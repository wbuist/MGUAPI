jQuery(document).ready(function($) {
    console.log('Script loaded');
    console.log('AJAX URL:', mgu_api.ajax_url);
    console.log('Nonce:', mgu_api.nonce);

    let currentGadgetType = '';
    let currentQuoteId = null;
    let selectedQuoteOption = null;
    let quoteOptions = [];

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
        quoteOptions = quoteData.value;
        
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
        const option = quoteOptions.find(opt => opt.id === optionId);
        
        if (option) {
            // Store the selected option
            selectedQuoteOption = option;
            currentQuoteId = option.id;
            
            // Update UI
            $('.mgu-api-quote-option').removeClass('selected');
            $(this).closest('.mgu-api-quote-option').addClass('selected');
            $('#accept-quote').show();
            
            console.log('Selected quote option:', selectedQuoteOption);
            console.log('Current quote ID:', currentQuoteId);
        }
    });

    // Handle quote acceptance
    $('#accept-quote').on('click', function(e) {
        e.preventDefault();
        if (!selectedQuoteOption) {
            console.error('No quote option selected');
            return;
        }
        
        // Show policy creation form
        $('#policy-creation-form').show();
        $(this).hide();
    });

    // Handle policy form submission
    $('#policy-creation-form').on('submit', function(e) {
        e.preventDefault();
        console.log('Policy form submitted');
        console.log('Current quote ID:', currentQuoteId);
        console.log('Selected quote option:', selectedQuoteOption);

        if (!currentQuoteId || !selectedQuoteOption) {
            console.error('No quote selected');
            return;
        }
        
        // Debug form values
        console.log('Form values:', {
            firstName: $('#policy-first-name').val(),
            lastName: $('#policy-last-name').val(),
            email: $('#policy-email').val(),
            phone: $('#policy-phone').val(),
            address1: $('#policy-address1').val(),
            postCode: $('#policy-postcode').val()
        });
        
        const customerData = {
            title: "Mr", // Default to Mr, could be made configurable
            givenName: $('#policy-first-name').val(),
            lastName: $('#policy-last-name').val(),
            email: $('#policy-email').val(),
            mobileNumber: $('#policy-phone').val(),
            marketingOk: $('#policy-marketing').is(':checked'),
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

        console.log('Creating customer with data:', customerData);
        console.log('Selected quote option:', selectedQuoteOption);
        console.log('Current quote ID:', currentQuoteId);
        console.log('Current gadget type:', currentGadgetType);

        // First create the customer
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_create_customer',
                customer_data: customerData,
                nonce: mgu_api.nonce
            },
            beforeSend: function() {
                console.log('Sending customer creation request...');
                showSuccess('step-policy', 'Creating customer...');
            },
            success: function(response) {
                console.log('Customer creation response:', response);
                if (response.success && response.data) {
                    // Store the customer ID for policy creation
                    window.customerId = response.data.customerId;
                    console.log('Customer created successfully. Customer ID:', window.customerId);
                    
                    // Now create the policy
                    const policyData = {
                        customer_id: window.customerId,
                        quote_option_id: currentQuoteId,
                        device_data: {
                            manufacturer_id: $('#manufacturer-select').val(),
                            gadget_type: $('#gadget-type-select').val(),
                            model: $('#model-select').val(),
                            purchase_date: $('#device-purchase-date').val(),
                            purchase_price: $('#device-purchase-price').val()
                        }
                    };

                    console.log('Creating policy with data:', policyData);

                    $.ajax({
                        url: mgu_api.ajax_url,
                        type: 'POST',
                        data: {
                            action: 'mgu_api_create_policy',
                            policy_data: policyData,
                            nonce: mgu_api.nonce
                        },
                        beforeSend: function() {
                            console.log('Sending policy creation request...');
                            showSuccess('step-policy', 'Creating policy...');
                        },
                        success: function(policyResponse) {
                            console.log('Policy creation response:', policyResponse);
                            if (policyResponse.success && policyResponse.data) {
                                showSuccess('step-policy', 'Policy created successfully! Policy ID: ' + policyResponse.data.policyId);
                            } else {
                                console.error('Policy creation failed:', policyResponse);
                                showError('step-policy', policyResponse.data || 'Failed to create policy');
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('Policy creation error:', {xhr, status, error});
                            showError('step-policy', 'Failed to create policy: ' + error);
                        }
                    });
                } else {
                    console.error('Customer creation failed:', response);
                    showError('step-policy', response.data || 'Failed to create customer');
                }
            },
            error: function(xhr, status, error) {
                console.error('Customer creation error:', {xhr, status, error});
                showError('step-policy', 'Failed to create customer: ' + error);
            }
        });
    });
}); 