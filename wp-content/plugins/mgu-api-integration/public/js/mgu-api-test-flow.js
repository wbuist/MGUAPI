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
                    
                    models.forEach(function(model) {
                        select.append(`<option value="${model.id}" data-model='${JSON.stringify(model)}'>${model.productName}</option>`);
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
            // Store the selected model data
            const selectedOption = $(this).find('option:selected');
            console.log('Model selection changed - option data:', selectedOption.data('model'));
            try {
                const modelData = selectedOption.data('model');
                window.selectedModel = (typeof modelData === 'string') ? JSON.parse(modelData) : modelData;
                console.log('Selected model stored:', window.selectedModel);
                console.log('Model product name:', window.selectedModel.productName);
            } catch (e) {
                console.error('Error parsing model data on selection:', e);
                window.selectedModel = null;
            }
            $('#step-device').show();
        }
    });

    // Handle device form submission
    $('#device-form').on('submit', function(e) {
        e.preventDefault();
        
        // Get model name - try multiple sources
        let modelName = '';
        if (window.selectedModel && window.selectedModel.productName) {
            modelName = window.selectedModel.productName;
        } else {
            const selectedOption = $('#model-select').find('option:selected');
            if (selectedOption.length && selectedOption.data('model')) {
                try {
                    const modelData = JSON.parse(selectedOption.data('model'));
                    modelName = modelData.productName;
                } catch (e) {
                    console.error('Error parsing model data:', e);
                    modelName = selectedOption.text(); // Fallback to option text
                }
            } else {
                modelName = selectedOption.text(); // Final fallback
            }
        }

        const deviceData = {
            ManufacturerID: parseInt($('#manufacturer-select').val()),
            GadgetType: $('#gadget-type-select').val(),
            Model: modelName
        };

        console.log('Submitting device data:', deviceData);
        console.log('Selected model object:', window.selectedModel);
        console.log('Model select value:', $('#model-select').val());

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
                <h3>${window.selectedModel ? window.selectedModel.productName : 'Device'} Quote</h3>
                <div class="mgu-api-quote-details">
                    <p>Memory: ${option.standardMemory || 'N/A'} ${option.memorySize || 'GB'}</p>
                    <p>Monthly Premium: £${option.monthlyPremium || 'N/A'}</p>
                    <p>Annual Premium: £${option.annualPremium || 'N/A'}</p>
                    <p>Damage Excess: £${option.damageExcess || 'N/A'}</p>
                    <p>Theft Excess: £${option.theftExcess || 'N/A'}</p>
                    <p>Premium ID: ${option.premiumId || option.id || 'N/A'}</p>
                    ${option.lossCoverAvailable ? `
                        <p>Loss Cover Available:</p>
                        <p>Monthly: £${option.lossCoverMonthlyPremium || 'N/A'}</p>
                        <p>Annual: £${option.lossCoverAnnualPremium || 'N/A'}</p>
                    ` : ''}
                    <button class="mgu-api-button select-quote-option" data-option-id="${option.premiumId || option.id}">Select This Option</button>
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
        const option = window.quoteOptions.find(opt => (opt.premiumId || opt.id) === optionId);
        
        if (option) {
            // Store the selected option
            window.selectedQuoteOption = option;
            window.currentQuoteId = option.premiumId || option.id;
            
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

        // Gather customer data - matching TGadgetCustomer structure from Swagger
        const customerData = {
            title: "Mr", // maxLength: 4
            givenName: $('#policy-first-name').val(), // REQUIRED, maxLength: 25
            lastName: $('#policy-last-name').val(), // REQUIRED, maxLength: 30
            companyName: $('#policy-company').val() || "", // maxLength: 250
            address1: $('#policy-address1').val(), // REQUIRED, maxLength: 25
            address2: $('#policy-address2').val() || "", // maxLength: 25
            address3: $('#policy-address3').val() || "", // maxLength: 25
            address4: $('#policy-address4').val() || "", // maxLength: 25
            postCode: $('#policy-postcode').val(), // REQUIRED, maxLength: 9
            email: $('#policy-email').val(), // REQUIRED, maxLength: 75
            mobileNumber: $('#policy-phone').val(), // REQUIRED, maxLength: 25
            homePhone: $('#policy-home-phone').val() || "", // maxLength: 25
            marketingOk: Boolean($('#policy-marketing').is(':checked')), // boolean
            externalId: "" // maxLength: 75 - could be set to a unique identifier if needed
        };

        // Gather payment data - matching TDirectDebit structure from Swagger
        const paymentData = {
            NameOnAccount: $('#payment-name-on-account').val(),
            AccountNumber: $('#payment-account-number').val(),
            SortCode: $('#payment-sort-code').val()
        };

        console.log('DEBUG - Customer data being sent:', JSON.stringify(customerData, null, 2));
        console.log('DEBUG - Payment data being sent:', JSON.stringify(paymentData, null, 2));
        console.log('DEBUG - Selected quote option:', JSON.stringify(window.selectedQuoteOption, null, 2));
        console.log('DEBUG - Current quote ID:', window.currentQuoteId);
        console.log('DEBUG - Current gadget type:', window.currentGadgetType);

        // Create the customer with payment details
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_create_customer',
                customer_data: customerData,
                payment_data: paymentData,
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
                            premium_period: (window.selectedQuoteOption.annualPremium && window.selectedQuoteOption.annualPremium > 0) ? 'Annual' : 'Month',
                            include_loss_cover: window.selectedQuoteOption.lossCoverAvailable ? 'Yes' : 'No',
                            nonce: mgu_api.nonce
                        },
                        success: function(basketResponse) {
                            console.log('DEBUG - Basket opened:', basketResponse);
                            if (basketResponse.success && basketResponse.data && basketResponse.data.value) {
                                const basketId = basketResponse.data.value;
                                
                                // Add gadget to basket
                                const gadgetData = {
                                    premiumId: parseInt(window.currentQuoteId), // REQUIRED - from quote response, must be integer
                                    status: "New", // enum: Unknown, Deleted, NotActive, New, Saved, Active, Cancelled, Completed
                                    gadgetType: window.selectedQuoteOption.gadgetType, // enum
                                    make: window.selectedQuoteOption.make, // string
                                    model: window.selectedQuoteOption.model, // string
                                    dateOfPurchase: $('#device-purchase-date').val() || new Date().toISOString().split('T')[0], // date format
                                    serialNumber: "", // string - could be collected from user
                                    installedMemory: (window.selectedQuoteOption.standardMemory || '') + (window.selectedQuoteOption.memorySize || ''), // string
                                    purchasePrice: parseFloat($('#device-purchase-price').val()) || 0 // number
                                };
                                
                                console.log('DEBUG - Gadget data being sent:', JSON.stringify(gadgetData, null, 2));
                                
                                $.ajax({
                                    url: mgu_api.ajax_url,
                                    type: 'POST',
                                    data: {
                                        action: 'mgu_api_add_gadget',
                                        basket_id: basketId,
                                        gadget_data: gadgetData,
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
                                                    customer_id: customerId,
                                                    nonce: mgu_api.nonce
                                                },
                                                success: function(confirmResponse) {
                                                    console.log('DEBUG - Basket confirmed:', confirmResponse);
                                                    console.log('DEBUG - Full basket confirmation response:', JSON.stringify(confirmResponse, null, 2));
                                                    if (confirmResponse.success && confirmResponse.data) {
                                                        const paymentResponse = confirmResponse.data;
                                                        console.log('DEBUG - Payment response:', paymentResponse);
                                                        
                                                        // Check the outcome
                                                        if (paymentResponse.Outcome === 'Confirmed') {
                                                            console.log('DEBUG - Policy created and payment processed successfully');
                                                            showSuccess('step-policy', 'Policy created and payment processed successfully!');
                                                        } else if (paymentResponse.Outcome === 'PaymentRequired') {
                                                            console.log('DEBUG - Payment still required (this shouldn\'t happen with new flow)');
                                                            showError('step-policy', 'Payment processing failed. Please try again.');
                                                        } else {
                                                            console.error('DEBUG - Unexpected payment outcome:', paymentResponse.Outcome);
                                                            showError('step-policy', 'Unexpected payment outcome: ' + paymentResponse.OutcomeText);
                                                        }
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

    function showError(stepId, message) {
        $(`#${stepId} .mgu-api-step-result`)
            .removeClass('success')
            .addClass('error')
            .html(`<div class="error-message">${message}</div>`);
    }

    function showSuccess(stepId, message) {
        $(`#${stepId} .mgu-api-step-result`)
            .removeClass('error')
            .addClass('success')
            .html(`<div class="success-message">${message}</div>`);
    }

}); 