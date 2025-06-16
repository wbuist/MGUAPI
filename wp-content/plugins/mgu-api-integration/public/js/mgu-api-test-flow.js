jQuery(document).ready(function($) {
    console.log('Script loaded');
    console.log('AJAX URL:', mgu_api.ajax_url);
    console.log('Nonce:', mgu_api.nonce);

    let currentGadgetType = '';
    let currentQuoteId = '';

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

        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_quote',
                device_data: deviceData,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                console.log('Quote response:', response);
                if (response.success && response.data) {
                    $('#step-quote').show();
                    $('.mgu-api-quote-details').html(`
                        <h4>Quote Details</h4>
                        <p>Monthly Premium: £${response.data.monthly_premium}</p>
                        <p>Annual Premium: £${response.data.annual_premium}</p>
                    `);
                    $('.mgu-api-step-result').removeClass('error success').empty();
                } else {
                    $('.mgu-api-step-result').removeClass('success').addClass('error')
                        .text(response.data || 'Failed to get quote');
                }
            },
            error: function(xhr, status, error) {
                console.error('Quote error:', {xhr, status, error});
                $('.mgu-api-step-result').removeClass('success').addClass('error')
                    .text('Failed to get quote');
            }
        });
    });

    // Handle quote acceptance
    $('#accept-quote').on('click', function() {
        $('#step-policy').show();
    });

    // Handle policy form submission
    $('#policy-form').on('submit', function(e) {
        e.preventDefault();
        
        const policyData = {
            first_name: $('#policy-first-name').val(),
            last_name: $('#policy-last-name').val(),
            email: $('#policy-email').val(),
            phone: $('#policy-phone').val(),
            device_data: {
                manufacturer_id: $('#manufacturer-select').val(),
                gadget_type: $('#gadget-type-select').val(),
                model: $('#model-select').val(),
                purchase_date: $('#device-purchase-date').val(),
                purchase_price: $('#device-purchase-price').val()
            }
        };

        console.log('Submitting policy data:', policyData);

        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_create_policy',
                policy_data: policyData,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                console.log('Policy response:', response);
                if (response.success && response.data) {
                    $('.mgu-api-step-result').removeClass('error').addClass('success')
                        .text('Policy created successfully! Policy ID: ' + response.data.policy_id);
                } else {
                    $('.mgu-api-step-result').removeClass('success').addClass('error')
                        .text(response.data || 'Failed to create policy');
                }
            },
            error: function(xhr, status, error) {
                console.error('Policy error:', {xhr, status, error});
                $('.mgu-api-step-result').removeClass('success').addClass('error')
                    .text('Failed to create policy');
            }
        });
    });
}); 