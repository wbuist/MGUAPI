jQuery(document).ready(function($) {
    console.log('Script loaded');
    console.log('AJAX URL:', mgu_api.ajax_url);
    console.log('Nonce:', mgu_api.nonce);

    // Global variables to store state
    window.currentGadgetType = '';
    window.currentQuoteId = null;
    window.selectedQuoteOption = null;
    window.quoteOptions = [];
    let selectedModelData = null;

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
        
        // Clear any existing error messages
        $('#step-manufacturer .mgu-api-step-result').removeClass('error success').empty();
        
        // Load manufacturers
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: requestData,
            success: function(response) {
                console.log('Manufacturers response:', response);
                console.log('Response success:', response.success);
                console.log('Response data:', response.data);
                
                if (response.success && response.data && response.data.value) {
                    const manufacturers = response.data.value || [];
                    
                    if (manufacturers.length > 0) {
                        // Clear and populate dropdown
                        const select = $('#manufacturer-select');
                        select.empty().append('<option value="">Select a manufacturer...</option>');
                        
                        // Sort manufacturers alphabetically by name
                        manufacturers.sort(function(a, b) {
                            return a.name.localeCompare(b.name);
                        });
                        
                        manufacturers.forEach(function(manufacturer) {
                            select.append(`<option value="${manufacturer.id}">${manufacturer.name}</option>`);
                        });
                        
                        // Clear error message on success
                        $('#step-manufacturer .mgu-api-step-result').removeClass('error success').empty();
                        console.log('Successfully loaded ' + manufacturers.length + ' manufacturers');
                    } else {
                        // No manufacturers returned - clear dropdown and show error
                        const select = $('#manufacturer-select');
                        select.empty().append('<option value="">Select a manufacturer...</option>');
                        
                        console.log('No manufacturers available for gadget type:', gadgetType);
                        $('#step-manufacturer .mgu-api-step-result').removeClass('success').addClass('error')
                            .text('No manufacturers available for this gadget type');
                    }
                } else {
                    // Response failed - show error but allow retry
                    console.log('Manufacturers request failed - response:', response);
                    $('#step-manufacturer .mgu-api-step-result').removeClass('success').addClass('error')
                        .html('Failed to load manufacturers. <a href="#" class="retry-manufacturers">Click to retry</a>');
                    
                    // Add retry handler
                    $('.retry-manufacturers').on('click', function(e) {
                        e.preventDefault();
                        $('#step-manufacturer .mgu-api-step-result').removeClass('error success').empty();
                        $('#gadget-type-select').trigger('change'); // Retrigger the manufacturers load
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('Manufacturers error:', {xhr, status, error});
                $('#step-manufacturer .mgu-api-step-result').removeClass('success').addClass('error')
                    .html('Failed to load manufacturers. <a href="#" class="retry-manufacturers">Click to retry</a>');
                
                // Add retry handler
                $('.retry-manufacturers').on('click', function(e) {
                    e.preventDefault();
                    $('#step-manufacturer .mgu-api-step-result').removeClass('error success').empty();
                    $('#gadget-type-select').trigger('change'); // Retrigger the manufacturers load
                });
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
        
        // Clear any existing error messages
        $('#step-model .mgu-api-step-result').removeClass('error success').empty();
        
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
                console.log('Models response success:', response.success);
                console.log('Models response data:', response.data);
                
                const select = $('#model-select');
                select.empty().append('<option value="">Select a model...</option>');
                
                if (response.success && response.data && response.data.value) {
                    const models = response.data.value || [];
                    
                    if (models.length > 0) {
                        // Reverse the array order since API returns in correct order but we want last first
                        models.reverse();
                        
                        models.forEach(function(model) {
                            // Handle V2 API response structure
                            const modelId = model.id;
                            const modelName = model.productName || model.name || model.model || 'Unknown Model';
                            select.append(`<option value="${modelId}">${modelName}</option>`);
                        });
                        
                        // Clear error message on success
                        $('#step-model .mgu-api-step-result').removeClass('error success').empty();
                        console.log('Successfully loaded ' + models.length + ' models');
                    } else {
                        // No models returned
                        console.log('No models available for this manufacturer and gadget type');
                        $('#step-model .mgu-api-step-result').removeClass('success').addClass('error')
                            .text('No models available for this manufacturer');
                    }
                } else {
                    // Only show error if we didn't get models
                    console.log('Models failed - response:', response);
                    $('#step-model .mgu-api-step-result').removeClass('success').addClass('error')
                        .text('Failed to load models: ' + (response.data || 'Unknown error'));
                }
            },
            error: function(xhr, status, error) {
                console.error('Models error:', {xhr, status, error});
                $('#step-model .mgu-api-step-result').removeClass('success').addClass('error')
                    .text('Failed to load models');
            }
        });
    });

    // Handle model selection
    $('#model-select').on('change', function() {
        const modelId = $(this).val();
        const selectedOption = $(this).find('option:selected');
        
        if (modelId) {
            // Store the model data
            selectedModelData = {
                id: modelId,
                name: selectedOption.text()
            };
            
            // Show Step 4
            $('#step-device').show();
            
            // Populate memory options if available
            populateMemoryOptions();
            
            // Reset form and disable quote button
            resetDeviceForm();
            
            // Trigger initial validation
            setTimeout(function() {
                validateQuoteButton();
            }, 100);
        } else {
            selectedModelData = null;
            $('#step-device').hide();
        }
    });

    // Handle device form submission
    $('#device-form').on('submit', function(e) {
        e.preventDefault();
        
        if ($('#get-quote-btn').prop('disabled')) {
            return; // Don't submit if button is disabled
        }
        
        const deviceData = {
            productId: selectedModelData ? selectedModelData.id : null,
            memoryInstalled: $('input[name="memory-option"]:checked').val(),
            purchasePrice: parseFloat($('#device-purchase-price').val()) || 0,
            purchaseDate: $('#device-purchase-date').val(),
            serialNumber: $('#device-serial-number').val(),
            premiumPeriod: $('input[name="premium-period"]:checked').val()
        };

        console.log('Submitting device data:', deviceData);
        console.log('Selected model object:', window.selectedModel);
        console.log('Model select value:', $('#model-select').val());

        // Since we already have the quote data from the premium period selection,
        // we can go directly to policy creation
        console.log('DEBUG - Device form submitted, going directly to policy creation');
        $('#step-policy').show();
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
                device_data: deviceData,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                console.log('Quote response received:', response);
                if (response.success && response.data) {
                    console.log('Quote data:', response.data);
                    displayQuoteV2(response.data);
                    $('#step-quote').show();
                    // Clear any error messages
                    $('.mgu-api-step-result').removeClass('error success').empty();
                } else {
                    console.error('Quote error:', response.data);
                    showError('step-device', 'Failed to get quote: ' + (response.data || 'Unknown error'));
                }
            },
            error: function(xhr, status, error) {
                console.error('Quote request failed:', {xhr, status, error});
                showError('step-device', 'Failed to get quote');
            }
        });
    }

    // Function to display quote
    function displayQuoteV2(quoteData) {
        console.log('Displaying V2 quote data:', quoteData);
        
        if (!quoteData) {
            console.error('Invalid quote data received');
            return;
        }

        // Store the quote data globally for policy creation
        window.currentQuoteData = quoteData;

        const quoteHtml = `
            <div class="mgu-api-quote-details">
                <h4>Quote Details</h4>
                <p><strong>Monthly Premium:</strong> £${quoteData.monthlyPremium || 'N/A'}</p>
                <p><strong>Annual Premium:</strong> £${quoteData.annualPremium || 'N/A'}</p>
                <p><strong>Damage Excess:</strong> £${quoteData.damageExcess || 'N/A'}</p>
                <p><strong>Theft Excess:</strong> £${quoteData.theftExcess || 'N/A'}</p>
                ${quoteData.lossCoverAvailable ? '<p><strong>Loss Cover Available:</strong> Yes</p>' : ''}
            </div>
        `;
        
        $('.mgu-api-quote-details').html(quoteHtml);
        
        // Show the Buy Policy button for V2 API
        $('#buy-policy').show();
    }

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
            // V2 API - button is always available after quote is displayed
            
            console.log('Selected quote option:', window.selectedQuoteOption);
            console.log('Current quote ID:', window.currentQuoteId);
        }
    });

    // Handle buy policy
    $('#buy-policy').on('click', function(e) {
        e.preventDefault();
        // For V2 API, we have a single quote, no need to select from options
        console.log('Buy Policy clicked - moving to policy creation');
        $('#step-policy').show();
    });

    // Handle policy form submission
    $('#policy-form').on('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted - Starting customer creation process');
        console.log('Current quote data:', window.currentQuoteData);

        if (!window.currentQuoteData) {
            console.error('No quote data available');
            return;
        }

        // Gather customer data - matching TGadgetCustomer structure from Swagger
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
            // External ID for integration with external systems
            externalId: $('#policy-external-id').val() || null
        };

        // Validate required fields
        if (!customerData.givenName || !customerData.lastName || !customerData.email || !customerData.mobileNumber) {
            console.error('Missing required customer fields');
            alert('Please fill in all required fields (First Name, Last Name, Email, Phone)');
            return;
        }
        
        if (!customerData.address1 || !customerData.postCode) {
            console.error('Missing required address fields');
            alert('Please fill in Address Line 1 and Postcode');
            return;
        }

        console.log('DEBUG - Customer data being sent:', JSON.stringify(customerData, null, 2));
        console.log('DEBUG - Current quote data:', JSON.stringify(window.currentQuoteData, null, 2));

        // Create the customer (V2 API - payment happens later in the flow)
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
                            premium_period: $('input[name="premium-period"]:checked').val() || 'Annual',
                            include_loss_cover: window.currentQuoteData.lossCoverAvailable ? 'Yes' : 'No',
                            nonce: mgu_api.nonce
                        },
                        success: function(basketResponse) {
                            console.log('DEBUG - Basket opened:', basketResponse);
                            if (basketResponse.success && basketResponse.data && basketResponse.data.value) {
                                const basketId = basketResponse.data.value;
                                console.log('DEBUG - Basket ID:', basketId);
                                
                                // Add gadget to basket using V2 API data
                                console.log('DEBUG - Adding gadget with product ID:', window.currentQuoteData.productId);
                                
                                $.ajax({
                                    url: mgu_api.ajax_url,
                                    type: 'POST',
                                    data: {
                                        action: 'mgu_api_add_gadget',
                                        basket_id: basketId,
                                        gadget_data: {
                                            productId: window.currentQuoteData.productId,
                                            dateOfPurchase: $('#device-purchase-date').val(),
                                            serialNumber: $('#device-serial-number').val(),
                                            installedMemory: $('input[name="memory-option"]:checked').val(),
                                            purchasePrice: parseFloat($('#device-purchase-price').val()) || 0
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
                                                    customer_id: customerId,
                                                    nonce: mgu_api.nonce
                                                },
                                                success: function(confirmResponse) {
                                                    console.log('DEBUG - Basket confirmed:', confirmResponse);
                                                    if (confirmResponse.success) {
                                                        // Check if payment is required
                                                        const outcome = confirmResponse.data.Outcome;
                                                        console.log('DEBUG - Confirm basket outcome:', outcome);
                                                        
                                                        if (outcome === 'PaymentRequired') {
                                                            // Payment required - process direct debit
                                                            console.log('DEBUG - Payment required, processing direct debit');
                                                            $.ajax({
                                                                url: mgu_api.ajax_url,
                                                                type: 'POST',
                                                                data: {
                                                                    action: 'mgu_api_pay_by_direct_debit',
                                                                    basket_id: basketId,
                                                                    direct_debit: {
                                                                        NameOnAccount: $('#policy-account-name').val(),
                                                                        AccountNumber: $('#policy-account-number').val(),
                                                                        SortCode: $('#policy-sort-code').val()
                                                                    },
                                                                    nonce: mgu_api.nonce
                                                                },
                                                                success: function(paymentResponse) {
                                                                    console.log('DEBUG - Payment processed:', paymentResponse);
                                                                    if (paymentResponse.success) {
                                                                        showSuccess('step-policy', 'Policy created and payment processed successfully!');
                                                                    } else {
                                                                        showError('step-policy', 'Failed to process payment: ' + (paymentResponse.data.message || 'Unknown error'));
                                                                    }
                                                                },
                                                                error: function(xhr, status, error) {
                                                                    console.error('DEBUG - Payment processing error:', {xhr, status, error});
                                                                    showError('step-policy', 'Error processing payment: ' + error);
                                                                }
                                                            });
                                                        } else if (outcome === 'Confirmed') {
                                                            // No payment required - basket is already confirmed
                                                            console.log('DEBUG - No payment required, basket confirmed');
                                                            showSuccess('step-policy', 'Policy created successfully!');
                                                        } else {
                                                            showError('step-policy', 'Unexpected basket status: ' + outcome);
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
    
    // Function to populate memory options based on selected model
    function populateMemoryOptions() {
        // We need to get the full model data from the models that were loaded
        if (!selectedModelData) return;
        
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_models',
                manufacturer_id: $('#manufacturer-select').val(),
                gadget_type: $('#gadget-type-select').val(),
                nonce: mgu_api.nonce
            },
            success: function(response) {
                if (response.success && response.data && response.data.value) {
                    const models = response.data.value;
                    const selectedModel = models.find(model => model.id == selectedModelData.id);
                    
                    if (selectedModel && selectedModel.memoryOptions && selectedModel.memoryOptions.length > 0) {
                        // Show memory options container
                        $('#memory-options-container').show();
                        
                        // Clear existing options
                        $('#memory-radio-buttons').empty();
                        
                        // Add radio buttons for each memory option
                        selectedModel.memoryOptions.forEach(function(memoryOption) {
                            const radioId = 'memory-' + memoryOption.replace(/[^a-zA-Z0-9]/g, '');
                            const radioHtml = `
                                <div class="mgu-api-radio-option">
                                    <input type="radio" id="${radioId}" name="memory-option" value="${memoryOption}">
                                    <label for="${radioId}">${memoryOption}</label>
                                </div>
                            `;
                            $('#memory-radio-buttons').append(radioHtml);
                        });
                        
                        // Add click handler for radio options
                        $('.mgu-api-radio-option').on('click', function() {
                            $(this).addClass('selected').siblings().removeClass('selected');
                            $(this).find('input[type="radio"]').prop('checked', true);
                            
                            // Get quote data to populate premium period options
                            populatePremiumPeriodOptions(selectedModel.id, $(this).find('input[type="radio"]').val());
                            
                            validateQuoteButton();
                        });
                    } else {
                        // Hide memory options if none available
                        $('#memory-options-container').hide();
                    }
                }
            }
        });
    }
    
    // Function to populate premium period options with quote data
    function populatePremiumPeriodOptions(productId, memoryInstalled) {
        // Get current form data
        const purchasePrice = parseFloat($('#device-purchase-price').val()) || 0;
        
        console.log('DEBUG - Populating premium period options for product:', productId, 'memory:', memoryInstalled, 'price:', purchasePrice);
        
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_quote',
                device_data: {
                    productId: productId,
                    memoryInstalled: memoryInstalled,
                    purchasePrice: purchasePrice,
                    purchaseDate: $('#device-purchase-date').val(),
                    serialNumber: $('#device-serial-number').val()
                },
                nonce: mgu_api.nonce
            },
            success: function(response) {
                console.log('DEBUG - Quote response for premium period options:', response);
                if (response.success && response.data) {
                    const quoteData = response.data;
                    console.log('DEBUG - Quote data:', quoteData);
                    
                    // Store quote data globally for policy creation
                    window.currentQuoteData = quoteData;
                    
                    // Show premium period container
                    $('#premium-period-container').show();
                    
                    // Clear existing options
                    $('#premium-period-buttons').empty();
                    
                    // Use base premiums (loss cover handled separately)
                    let monthlyPremium = quoteData.monthlyPremium || 0;
                    let annualPremium = quoteData.annualPremium || 0;
                    
                    // Add radio buttons for monthly and annual premiums
                    const monthlyHtml = `
                        <div class="mgu-api-radio-option">
                            <input type="radio" id="premium-monthly" name="premium-period" value="Month">
                            <label for="premium-monthly">Monthly - £${monthlyPremium.toFixed(2)}</label>
                        </div>
                    `;
                    
                    const annualHtml = `
                        <div class="mgu-api-radio-option">
                            <input type="radio" id="premium-annual" name="premium-period" value="Annual">
                            <label for="premium-annual">Annual - £${annualPremium.toFixed(2)}</label>
                        </div>
                    `;
                    
                    $('#premium-period-buttons').append(monthlyHtml).append(annualHtml);
                    console.log('DEBUG - Premium period buttons added');
                    
                    // Add click handler for premium period options
                    $('.mgu-api-radio-option').on('click', function() {
                        $(this).addClass('selected').siblings().removeClass('selected');
                        $(this).find('input[type="radio"]').prop('checked', true);
                        
                        // Update stored quote data with selected premium period
                        if (window.currentQuoteData) {
                            window.currentQuoteData.selectedPremiumPeriod = $(this).find('input[type="radio"]').val();
                            console.log('DEBUG - Updated quote data with premium period:', window.currentQuoteData.selectedPremiumPeriod);
                        }
                        
                        validateQuoteButton();
                    });
                } else {
                    console.error('DEBUG - Quote request failed:', response);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error getting quote for premium period options:', {xhr, status, error});
            }
        });
    }
    
    // Function to reset device form
    function resetDeviceForm() {
        $('#device-form')[0].reset();
        // Set purchase date to today
        const today = new Date().toISOString().split('T')[0];
        $('#device-purchase-date').val(today);
        
        $('#memory-options-container').hide();
        $('#memory-radio-buttons').empty();
        $('#premium-period-container').hide();
        $('#premium-period-buttons').empty();
        $('#get-quote-btn').prop('disabled', true);
        $('#step-device .mgu-api-step-result').removeClass('error success').empty();
    }
    
    // Function to validate quote button state
    function validateQuoteButton() {
        const purchaseDate = $('#device-purchase-date').val();
        const purchasePrice = $('#device-purchase-price').val();
        const memorySelected = $('input[name="memory-option"]:checked').length > 0;
        
        // Check if purchase date is within 36 months
        let dateValid = false;
        if (purchaseDate) {
            const purchaseDateObj = new Date(purchaseDate);
            const now = new Date();
            const thirtySixMonthsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
            dateValid = purchaseDateObj >= thirtySixMonthsAgo && purchaseDateObj <= now;
            
            // Debug date validation
            console.log('Date Validation Debug:', {
                purchaseDate: purchaseDate,
                purchaseDateObj: purchaseDateObj,
                now: now,
                thirtySixMonthsAgo: thirtySixMonthsAgo,
                isAfter36MonthsAgo: purchaseDateObj >= thirtySixMonthsAgo,
                isBeforeNow: purchaseDateObj <= now,
                dateValid: dateValid
            });
        }
        
        // Check if premium period is selected
        const premiumPeriodSelected = $('input[name="premium-period"]:checked').length > 0;
        
        // Enable button if required fields are filled and date is valid (purchase price is optional)
        const allValid = purchaseDate && memorySelected && premiumPeriodSelected && dateValid;
        
        // Debug logging
        console.log('Quote Button Validation:', {
            purchaseDate: purchaseDate,
            memorySelected: memorySelected,
            premiumPeriodSelected: premiumPeriodSelected,
            dateValid: dateValid,
            allValid: allValid,
            buttonDisabled: !allValid
        });
        
        $('#get-quote-btn').prop('disabled', !allValid);
        
        // Visual feedback - add/remove disabled class
        if (allValid) {
            $('#get-quote-btn').removeClass('disabled').addClass('enabled');
        } else {
            $('#get-quote-btn').removeClass('enabled').addClass('disabled');
        }
    }
    
    // Add event handlers for form validation
    $('#device-purchase-date, #device-purchase-price').on('input change', function() {
        validateQuoteButton();
    });
    
    // Add event handler for premium period selection
    $(document).on('change', 'input[name="premium-period"]', function() {
        validateQuoteButton();
    });
    
    
    // Add click handler for quote button debugging
    $('#get-quote-btn').on('click', function(e) {
        console.log('Quote button clicked!');
        console.log('Button disabled state:', $(this).prop('disabled'));
        console.log('Button classes:', $(this).attr('class'));
        
        if ($(this).prop('disabled')) {
            console.log('Button is disabled - preventing form submission');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
}); 