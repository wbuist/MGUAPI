jQuery(document).ready(function($) {
    console.log('Script loaded');
    console.log('AJAX URL:', mgu_api.ajax_url);
    console.log('Nonce:', mgu_api.nonce);

    // Global variables to store state
    window.currentGadgetType = '';
    window.currentQuoteId = null;
    window.selectedQuoteOption = null;
    window.quoteOptions = [];

    // Handle gadget type selection
    $('#gadget-type-select').on('change', function() {
        const gadgetType = $(this).val();
        if (!gadgetType) return;

        console.log('Selected gadget type:', gadgetType);

        // Show manufacturer step
        $('#step-manufacturer').show();
        
        const requestData = {
            action: 'mgu_api_get_manufacturers',
            gadget_type: gadgetType,
            nonce: mgu_api.nonce
        };
        
        console.log('Sending manufacturer request:', requestData);
        
        // Load manufacturers
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: requestData,
            success: function(response) {
                console.log('Manufacturers response:', response);
                if (response.success && response.data) {
                    const manufacturers = response.data.value || [];
                    const select = $('#manufacturer-select');
                    select.empty().append('<option value="">Select a manufacturer...</option>');
                    
                    manufacturers.forEach(function(manufacturer) {
                        select.append(`<option value="${manufacturer.id}">${manufacturer.name}</option>`);
                    });
                    
                    $('.mgu-api-step-result').removeClass('error success').empty();
                } else {
                    $('.mgu-api-step-result').removeClass('success').addClass('error')
                        .text('Failed to load manufacturers');
                }
            },
            error: function(xhr, status, error) {
                console.error('Manufacturers error:', {xhr, status, error});
                $('.mgu-api-step-result').removeClass('success').addClass('error')
                    .text('Failed to load manufacturers');
            }
        });
    });

    // Handle manufacturer selection
    $('#manufacturer-select').on('change', function() {
        const manufacturerId = $(this).val();
        const gadgetType = $('#gadget-type-select').val();
        if (!manufacturerId || !gadgetType) return;

        // Show model step
        $('#step-model').show();
        
        console.log('Loading models with:', {
            manufacturer_id: manufacturerId,
            gadget_type: gadgetType,
            nonce: mgu_api.nonce
        });
        
        // Load models
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_models',
                manufacturer_id: manufacturerId,
                gadget_type: gadgetType,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                console.log('Models response:', response);
                if (response.success && response.data) {
                    const models = response.data.value || [];
                    const select = $('#model-select');
                    select.empty().append('<option value="">Select a model...</option>');
                    
                    models.forEach(function(modelName) {
                        select.append(`<option value="${modelName}">${modelName}</option>`);
                    });
                    
                    $('.mgu-api-step-result').removeClass('error success').empty();
                } else {
                    $('.mgu-api-step-result').removeClass('success').addClass('error')
                        .text(response.data || 'Failed to load models');
                }
            },
            error: function(xhr, status, error) {
                console.error('Models error:', {xhr, status, error});
                $('.mgu-api-step-result').removeClass('success').addClass('error')
                    .text('Failed to load models');
            }
        });
    });

    // Handle model selection
    $('#model-select').on('change', function() {
        if ($(this).val()) {
            $('#step-device').show();
        }
    });

    // Handle device form submission
    $('#device-form').on('submit', function(e) {
        e.preventDefault();
        
        const deviceData = {
            ManufacturerID: $('#manufacturer-select').val(),
            GadgetType: $('#gadget-type-select').val(),
            Model: $('#model-select').val()
        };

        console.log('Submitting device data:', deviceData);

        getQuote(deviceData);
    });

    // Function to get quote
    function getQuote(deviceData) {
        console.log('Sending quote request with data:', deviceData);
        
        // Clear any previous error messages
        $('.mgu-api-step-result').removeClass('error success').empty();
        
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_quote',
                device_data: {
                    ManufacturerID: deviceData.ManufacturerID,
                    GadgetType: deviceData.GadgetType,
                    Model: deviceData.Model
                },
                nonce: mgu_api.nonce
            },
            success: function(response) {
                console.log('Quote response received:', response);
                if (response.success && response.data && response.data.value) {
                    console.log('Quote data:', response.data);
                    displayQuote(response.data);
                    $('#step-quote').show();
                    // Clear any error messages
                    $('.mgu-api-step-result').removeClass('error success').empty();
                } else {
                    console.error('Quote error:', response.data);
                    showError('step-device', 'Failed to get quote');
                }
            },
            error: function(xhr, status, error) {
                console.error('Quote request failed:', {xhr, status, error});
                showError('step-device', 'Failed to get quote');
            }
        });
    }

    // Function to display quote
    function displayQuote(quoteData) {
        console.log('Displaying quote data:', quoteData);
        
        if (!quoteData || !quoteData.value || !Array.isArray(quoteData.value)) {
            console.error('Invalid quote data received');
            return;
        }

        // Store the options globally
        window.quoteOptions = quoteData.value;
        
        // Create HTML for each option
        const optionsHtml = quoteData.value.map(option => `
            <div class="mgu-api-quote-option">
                <h3>${option.make} ${option.model}</h3>
                <div class="mgu-api-quote-details">
                    <p>Memory: ${option.standardMemory} ${option.memorySize}</p>
                    <p>Monthly Premium: £${option.monthlyPremium}</p>
                    <p>Annual Premium: £${option.annualPremium}</p>
                    <p>Damage Excess: £${option.damageExcess}</p>
                    <p>Theft Excess: £${option.theftExcess}</p>
                    ${option.lossCoverAvailable ? `
                        <p>Loss Cover Available:</p>
                        <p>Monthly: £${option.lossCoverMonthlyPremium}</p>
                        <p>Annual: £${option.lossCoverAnnualPremium}</p>
                    ` : ''}
                    <button class="mgu-api-button select-quote-option" data-option-id="${option.id}">Select This Option</button>
                </div>
            </div>
        `).join('');

        const quoteHtml = `
            <div class="mgu-api-quote-options">
                ${optionsHtml}
            </div>
        `;
        
        $('.mgu-api-quote-details').html(quoteHtml);
    }

    // Handle quote option selection
    $(document).on('click', '.select-quote-option', function(e) {
        e.preventDefault();
        const optionId = $(this).data('option-id');
        const option = window.quoteOptions.find(opt => opt.id === optionId);
        
        if (option) {
            // Store the selected option
            window.selectedQuoteOption = option;
            window.currentQuoteId = option.id;
            
            // Update UI
            $('.mgu-api-quote-option').removeClass('selected');
            $(this).closest('.mgu-api-quote-option').addClass('selected');
            $('#accept-quote').show();
            
            console.log('Selected quote option:', window.selectedQuoteOption);
            console.log('Current quote ID:', window.currentQuoteId);
        }
    });

    // Handle quote acceptance
    $('#accept-quote').on('click', function(e) {
        e.preventDefault();
        if (!window.selectedQuoteOption) {
            console.error('No quote option selected');
            return;
        }
        
        // Show policy creation form
        $('#policy-form').show();
        $(this).hide();
    });

    // Handle policy form submission
    $('#policy-form').on('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted - Starting customer creation process');
        console.log('Current quote ID:', window.currentQuoteId);
        console.log('Selected quote option:', window.selectedQuoteOption);

        if (!window.currentQuoteId || !window.selectedQuoteOption) {
            console.error('No quote selected');
            return;
        }

        // Gather customer data
        const customerData = {
            title: "Mr", // Default to Mr, could be made configurable
            givenName: $('#policy-first-name').val(),
            lastName: $('#policy-last-name').val(),
            email: $('#policy-email').val(),
            mobileNumber: $('#policy-phone').val(),
            marketingOk: Boolean($('#policy-marketing').is(':checked')),
            // Required address fields
            address1: $('#policy-address1').val(),
            postCode: $('#policy-postcode').val(),
            // Optional fields
            companyName: $('#policy-company').val() || "",
            address2: $('#policy-address2').val() || "",
            address3: $('#policy-address3').val() || "",
            address4: $('#policy-address4').val() || "",
            homePhone: $('#policy-home-phone').val() || "",
            externalId: "" // Could be set to a unique identifier if needed
        };

        console.log('DEBUG - Customer data being sent:', JSON.stringify(customerData, null, 2));
        console.log('DEBUG - Selected quote option:', JSON.stringify(window.selectedQuoteOption, null, 2));
        console.log('DEBUG - Current quote ID:', window.currentQuoteId);
        console.log('DEBUG - Current gadget type:', window.currentGadgetType);

        // Create the customer
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_create_customer',
                customer_data: customerData,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                console.log('DEBUG - Full customer creation response:', JSON.stringify(response, null, 2));
                
                if (response.success && response.data && response.data.value) {
                    const customerId = response.data.value;
                    console.log('DEBUG - Customer created successfully with ID:', customerId);
                    
                    // Display success message with customer ID
                    const successMessage = `Customer created successfully! Customer ID: ${customerId}`;
                    showSuccess('step-policy', successMessage);
                    
                    // Start policy creation process
                    console.log('DEBUG - Starting policy creation process');
                    
                    // Open basket
                    $.ajax({
                        url: mgu_api.ajax_url,
                        type: 'POST',
                        data: {
                            action: 'mgu_api_open_basket',
                            customer_id: customerId,
                            premium_period: window.selectedQuoteOption.annualPremium ? 'Annual' : 'Month',
                            include_loss_cover: window.selectedQuoteOption.lossCoverAvailable ? 'Yes' : 'No',
                            nonce: mgu_api.nonce
                        },
                        success: function(basketResponse) {
                            console.log('DEBUG - Basket opened:', basketResponse);
                            if (basketResponse.success && basketResponse.data && basketResponse.data.value) {
                                const basketId = basketResponse.data.value;
                                
                                // Add gadget to basket
                                $.ajax({
                                    url: mgu_api.ajax_url,
                                    type: 'POST',
                                    data: {
                                        action: 'mgu_api_add_gadget',
                                        basket_id: basketId,
                                        gadget_data: {
                                            manufacturerId: window.selectedQuoteOption.manufacturerId,
                                            gadgetType: window.selectedQuoteOption.gadgetType,
                                            model: window.selectedQuoteOption.model,
                                            memory: window.selectedQuoteOption.standardMemory,
                                            memorySize: window.selectedQuoteOption.memorySize
                                        },
                                        nonce: mgu_api.nonce
                                    },
                                    success: function(addResponse) {
                                        console.log('DEBUG - Gadget added:', addResponse);
                                        if (addResponse.success) {
                                            // Confirm basket
                                            $.ajax({
                                                url: mgu_api.ajax_url,
                                                type: 'POST',
                                                data: {
                                                    action: 'mgu_api_confirm_basket',
                                                    basket_id: basketId,
                                                    nonce: mgu_api.nonce
                                                },
                                                success: function(confirmResponse) {
                                                    console.log('DEBUG - Basket confirmed:', confirmResponse);
                                                    if (confirmResponse.success) {
                                                        // Create policy
                                                        $.ajax({
                                                            url: mgu_api.ajax_url,
                                                            type: 'POST',
                                                            data: {
                                                                action: 'mgu_api_create_policy',
                                                                policy_data: {
                                                                    customerId: customerId,
                                                                    basketId: basketId,
                                                                    quoteOptionId: window.currentQuoteId
                                                                },
                                                                nonce: mgu_api.nonce
                                                            },
                                                            success: function(policyResponse) {
                                                                console.log('DEBUG - Policy created:', policyResponse);
                                                                if (policyResponse.success) {
                                                                    showSuccess('step-policy', 'Policy created successfully!');
                                                                } else {
                                                                    showError('step-policy', 'Failed to create policy: ' + (policyResponse.data.message || 'Unknown error'));
                                                                }
                                                            },
                                                            error: function(xhr, status, error) {
                                                                console.error('DEBUG - Policy creation error:', {xhr, status, error});
                                                                showError('step-policy', 'Error creating policy: ' + error);
                                                            }
                                                        });
                                                    } else {
                                                        showError('step-policy', 'Failed to confirm basket: ' + (confirmResponse.data.message || 'Unknown error'));
                                                    }
                                                },
                                                error: function(xhr, status, error) {
                                                    console.error('DEBUG - Basket confirmation error:', {xhr, status, error});
                                                    showError('step-policy', 'Error confirming basket: ' + error);
                                                }
                                            });
                                        } else {
                                            showError('step-policy', 'Failed to add gadget: ' + (addResponse.data.message || 'Unknown error'));
                                        }
                                    },
                                    error: function(xhr, status, error) {
                                        console.error('DEBUG - Add gadget error:', {xhr, status, error});
                                        showError('step-policy', 'Error adding gadget: ' + error);
                                    }
                                });
                            } else {
                                showError('step-policy', 'Failed to open basket: ' + (basketResponse.data.message || 'Unknown error'));
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('DEBUG - Open basket error:', {xhr, status, error});
                            showError('step-policy', 'Error opening basket: ' + error);
                        }
                    });
                } else {
                    console.error('DEBUG - Customer creation failed:', response);
                    showError('step-policy', response.data.message || 'Failed to create customer');
                }
            },
            error: function(xhr, status, error) {
                console.error('DEBUG - Customer creation error:', {
                    status: status,
                    error: error,
                    response: xhr.responseText
                });
                showError('step-policy', 'Error creating customer: ' + error);
            }
        });
    });

    function showError(message) {
        $('#error-message').text(message).show();
        setTimeout(function() {
            $('#error-message').fadeOut();
        }, 5000);
    }

    function showSuccess(stepId, message) {
        $(`#${stepId} .mgu-api-step-result`)
            .removeClass('error')
            .addClass('success')
            .html(`<div class="success-message">${message}</div>`);
    }
}); 