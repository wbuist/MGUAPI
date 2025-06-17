<?php
/**
 * The API client class.
 *
 * @since      1.0.0
 * @package    MGU_API_Integration
 */

class MGU_API_Client {
    /**
     * The API endpoint URL
     *
     * @var string
     */
    protected $endpoint;

    /**
     * The client ID for API authentication
     *
     * @var string
     */
    protected $client_id;

    /**
     * The client secret for API authentication
     *
     * @var string
     */
    protected $client_secret;

    /**
     * The access token for API requests
     *
     * @var string
     */
    protected $access_token;

    /**
     * The token expiry time.
     *
     * @since    1.0.0
     * @access   private
     * @var      integer   $token_expiry    The token expiry time.
     */
    private $token_expiry;

    /**
     * The logger.
     *
     * @since    1.0.0
     * @access   private
     * @var      MGU_API_Logger    $logger    The logger.
     */
    private $logger;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     */
    public function __construct() {
        $this->endpoint = get_option('mgu_api_endpoint');
        $this->client_id = get_option('mgu_api_client_id');
        $this->client_secret = get_option('mgu_api_client_secret');
        $this->access_token = '';
        $this->logger = new MGU_API_Logger();

        // error_log('MGU API Debug - Constructor values:');
        // error_log('MGU API Debug - endpoint from option: ' . get_option('mgu_api_endpoint'));
        // error_log('MGU API Debug - client_id from option: ' . get_option('mgu_api_client_id'));
        // error_log('MGU API Debug - client_secret from option: ' . substr(get_option('mgu_api_client_secret'), 0, 5) . '...');
        // error_log('MGU API Debug - endpoint property: ' . $this->endpoint);
        // error_log('MGU API Debug - client_id property: ' . $this->client_id);
        // error_log('MGU API Debug - client_secret property: ' . substr($this->client_secret, 0, 5) . '...');
    }

    /**
     * Get a valid access token, refreshing if necessary
     */
    private function get_valid_token() {
        // Check if we need to refresh the token
        if (empty($this->access_token) || time() >= $this->token_expiry - 300) { // Refresh 5 minutes before expiry
            $this->refresh_token();
        }
        return $this->access_token;
    }

    /**
     * Refresh the access token
     */
    private function refresh_token() {
        if (empty($this->endpoint) || empty($this->client_id) || empty($this->client_secret)) {
            // error_log('MGU API Debug - Token refresh failed: Missing configuration');
            // error_log('MGU API Debug - endpoint: ' . $this->endpoint);
            // error_log('MGU API Debug - client_id: ' . $this->client_id);
            // error_log('MGU API Debug - client_secret: ' . substr($this->client_secret, 0, 5) . '...');
            return false;
        }

        $auth_url = rtrim($this->endpoint, '/') . '/sbauth/oauth/token';
        // error_log('MGU API Debug - Token refresh URL: ' . $auth_url);
        
        $response = wp_remote_post($auth_url, array(
            'headers' => array(
                'accept' => 'application/json',
                'Content-Type' => 'application/x-www-form-urlencoded',
            ),
            'body' => array(
                'client_id' => $this->client_id,
                'client_secret' => $this->client_secret,
                'grant_type' => 'client_credentials'
            )
        ));

        if (is_wp_error($response)) {
            // error_log('MGU API Debug - Token refresh request failed: ' . $response->get_error_message());
            return false;
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        // error_log('MGU API Debug - Token refresh response: ' . $body);

        if (empty($data['access_token'])) {
            // error_log('MGU API Debug - Invalid token response: ' . print_r($data, true));
            return false;
        }

        $this->access_token = $data['access_token'];
        $this->token_expiry = time() + $data['expires_in'];
        
        // error_log('MGU API Debug - Token refresh successful, expires in: ' . $data['expires_in'] . ' seconds');
        return true;
    }

    /**
     * Make an API request.
     *
     * @since    1.0.0
     * @param    string    $endpoint    The API endpoint to call.
     * @param    string    $method      The HTTP method to use.
     * @param    array     $data        The data to send with the request.
     * @return   array|WP_Error        The API response or WP_Error on failure.
     */
    private function make_request($endpoint, $method = 'GET', $data = array()) {
        if (empty($this->endpoint) || empty($this->client_id)) {
            error_log('MGU API Debug - Configuration missing: endpoint=' . $this->endpoint . ', client_id=' . $this->client_id);
            return new WP_Error('config_error', 'API endpoint or key not configured');
        }

        $url = rtrim($this->endpoint, '/') . '/' . ltrim($endpoint, '/');
        error_log('MGU API Debug - Request URL: ' . $url);
        
        // For GET requests, append the data as query parameters
        if ($method === 'GET' && !empty($data)) {
            $url = add_query_arg($data, $url);
            error_log('MGU API Debug - GET parameters: ' . print_r($data, true));
        }

        // Get a valid token
        $token = $this->get_valid_token();
        if (!$token) {
            error_log('MGU API Debug - Failed to get valid token');
            return new WP_Error('auth_error', 'Failed to obtain valid access token');
        }
        error_log('MGU API Debug - Using token: ' . substr($token, 0, 20) . '...');

        $args = array(
            'method' => $method,
            'headers' => array(
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            )
        );
        error_log('MGU API Debug - Request headers: ' . print_r($args['headers'], true));

        // Only add body for non-GET requests
        if ($method !== 'GET' && !empty($data)) {
            $args['body'] = json_encode($data);
            error_log('MGU API Debug - Request body: ' . $args['body']);
        }

        $response = wp_remote_request($url, $args);

        if (is_wp_error($response)) {
            error_log('MGU API Debug - Request error: ' . $response->get_error_message());
            return $response;
        }

        $response_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        error_log('MGU API Debug - Response code: ' . $response_code);
        error_log('MGU API Debug - Response body: ' . $body);

        // Handle token expiration
        if ($response_code === 401) {
            error_log('MGU API Debug - Token expired, attempting refresh');
            $this->access_token = null; // Force token refresh
            return $this->make_request($endpoint, $method, $data); // Retry the request
        }

        if ($response_code >= 400) {
            $error_message = isset($data['message']) ? $data['message'] : 'Unknown error';
            error_log('MGU API Debug - API error: ' . $error_message);
            return new WP_Error('api_error', $error_message, $data);
        }

        return $data;
    }

    /**
     * Create a new customer.
     *
     * @since    1.0.0
     * @param    array     $customer_data    The customer data (TGadgetCustomer structure).
     * @return   array|WP_Error             The API response or WP_Error on failure.
     */
    public function create_customer($customer_data) {
        return $this->make_request('/sbapi/v1/newCustomer', 'POST', $customer_data);
    }

    /**
     * Find a customer by MGU ID.
     *
     * @since    1.0.0
     * @param    integer   $customer_id    The MGU customer ID.
     * @return   array|WP_Error           The API response or WP_Error on failure.
     */
    public function find_customer($customer_id) {
        return $this->make_request('findCustomer', 'GET', array('customerId' => $customer_id));
    }

    /**
     * Find a customer by external ID.
     *
     * @since    1.0.0
     * @param    string    $external_id    The external customer ID.
     * @return   array|WP_Error           The API response or WP_Error on failure.
     */
    public function find_customer_by_external_id($external_id) {
        return $this->make_request('findCustomerByExternalId', 'GET', array('externalId' => $external_id));
    }

    /**
     * Open a basket for a customer.
     *
     * @since    1.0.0
     * @param    integer   $customer_id        The customer ID.
     * @param    string    $premium_period     The premium period (Month or Annual).
     * @param    string    $include_loss_cover Whether to include loss cover (Yes or No).
     * @return   array|WP_Error               The API response or WP_Error on failure.
     */
    public function open_basket($customer_id, $premium_period, $include_loss_cover) {
        return $this->make_request('/sbapi/v1/openBasket', 'GET', array(
            'customerId' => $customer_id,
            'premiumPeriod' => $premium_period,
            'includeLossCover' => $include_loss_cover
        ));
    }

    /**
     * Get an existing basket.
     *
     * @since    1.0.0
     * @param    integer   $basket_id    The basket ID.
     * @return   array|WP_Error         The API response or WP_Error on failure.
     */
    public function get_basket($basket_id) {
        return $this->make_request('/sbapi/v1/getBasket', 'GET', array('basketId' => $basket_id));
    }

    /**
     * Add gadgets to the basket.
     *
     * @since    1.0.0
     * @param    integer   $basket_id     The basket ID.
     * @param    array     $gadgets       Array of TGadgetDetail objects.
     * @return   array|WP_Error          The API response or WP_Error on failure.
     */
    public function add_gadgets($basket_id, $gadgets) {
        // Add basketId to each gadget
        foreach ($gadgets as &$gadget) {
            $gadget['basketId'] = $basket_id;
        }
        return $this->make_request('/sbapi/v1/addGadgets', 'POST', $gadgets);
    }

    /**
     * Get manufacturers for a specific gadget type.
     *
     * @param string $gadget_type The type of gadget (e.g., 'MobilePhone', 'Tablet', 'Laptop')
     * @return array|WP_Error Array of manufacturers or WP_Error on failure
     */
    public function get_manufacturers($gadget_type) {
        return $this->make_request('/sbapi/v1/manufacturers', 'GET',  array(
            'GadgetType' => $gadget_type
        ));
    }

    /**
     * Get models for a specific manufacturer and gadget type
     *
     * @param string $manufacturer_id
     * @param string $gadget_type
     * @return array|WP_Error
     */
    public function get_models($manufacturer_id, $gadget_type) {
        // error_log('=== Models Request Debug ===');
        // error_log('Manufacturer ID: ' . $manufacturer_id);
        // error_log('Gadget Type: ' . $gadget_type);
        
        // For GET requests, we need to append the parameters to the URL
        $endpoint = '/sbapi/v1/models?' . http_build_query(array(
            'ManufacturerId' => $manufacturer_id,
            'GadgetType' => $gadget_type
        ));
        
        // error_log('Full endpoint: ' . $endpoint);
        
        $response = $this->make_request($endpoint, 'GET');
        
        if (is_wp_error($response)) {
            // error_log('Models Error: ' . $response->get_error_message());
        } else {
            // error_log('Models Response: ' . print_r($response, true));
        }
        
        // error_log('=== End Models Request Debug ===');
        
        return $response;
    }

    /**
     * Get premiums for a specific gadget.
     *
     * @since    1.0.0
     * @param    integer   $premium_id    The premium ID.
     * @return   array|WP_Error          The API response or WP_Error on failure.
     */
    public function get_gadget_premium($premium_id) {
        return $this->make_request('gadgetPremium', 'GET', array('premiumId' => $premium_id));
    }

    /**
     * Get premiums for a model.
     *
     * @since    1.0.0
     * @param    integer   $manufacturer_id    The manufacturer ID.
     * @param    string    $gadget_type        The gadget type.
     * @param    string    $model              The model name.
     * @return   array|WP_Error               The API response or WP_Error on failure.
     */
    public function get_gadget_premiums($manufacturer_id, $gadget_type, $model) {
        return $this->make_request('gadgetPremiums', 'GET', array(
            'ManufacturerId' => $manufacturer_id,
            'GadgetType' => $gadget_type,
            'Model' => $model
        ));
    }

    /**
     * Confirm the basket.
     *
     * @since    1.0.0
     * @param    integer   $basket_id    The basket ID.
     * @return   array|WP_Error         The API response or WP_Error on failure.
     */
    public function confirm_basket($basket_id) {
        return $this->make_request('/sbapi/v1/confirm', 'GET', array('basketId' => $basket_id));
    }

    /**
     * Process payment by direct debit.
     *
     * @since    1.0.0
     * @param    integer   $basket_id    The basket ID.
     * @param    array     $direct_debit The direct debit details.
     * @return   array|WP_Error         The API response or WP_Error on failure.
     */
    public function pay_by_direct_debit($basket_id, $direct_debit) {
        return $this->make_request('/sbapi/v1/payByDirectDebit', 'POST', array(
            'basketId' => $basket_id,
            'directDebit' => $direct_debit
        ));
    }

    /**
     * Test the API connection
     */
    public function test_connection() {
        return $this->make_request('/sbapi/v1/manufacturers', 'GET');
    }

    /**
     * Get a quote for a device
     *
     * @param array $device_data
     * @return array|WP_Error
     */
    public function get_quote($device_data) {
        return $this->make_request('/sbapi/v1/gadgetPremiums', 'GET', array(
            'ManufacturerId' => $device_data['ManufacturerID'],
            'GadgetType' => $device_data['GadgetType'],
            'Model' => $device_data['Model']
        ));
    }

    /**
     * Create a new policy
     *
     * @param array $policy_data
     * @return array|WP_Error
     */
    public function create_policy($policy_data) {
        return $this->make_request('/sbapi/v1/policies', 'POST', $policy_data);
    }
} 