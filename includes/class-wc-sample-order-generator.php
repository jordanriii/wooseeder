class WC_Sample_Order_Generator {
    // ... existing code ...

    private function create_order( $customer_id ) {
        // ... existing code ...

        $order = wc_create_order( array(
            'customer_id' => $customer_id,
            'status'      => 'processing',
        ) );

        // ... existing code ...

        // Add custom meta for newsletter subscription
        $this->add_newsletter_subscription_meta( $order );

        // ... existing code ...

        return $order;
    }

    // ... existing code ...

    /**
     * Add newsletter subscription meta to the order.
     *
     * @param WC_Order $order The order object.
     */
    private function add_newsletter_subscription_meta( $order ) {
        // 50% chance of adding the meta as subscribed
        $subscription_value = wp_rand( 0, 1 ) ? '1' : '';

        $order->update_meta_data( 'mailchimp_woocommerce_is_subscribed', $subscription_value );
        $order->save();
    }

    public function __construct() {
        // ... existing code ...

        // Add filter to display custom field in order admin
        add_filter( 'woocommerce_admin_order_data_after_billing_address', array( $this, 'display_admin_order_meta' ), 10, 1 );
    }

    /**
     * Display custom order meta in admin order details
     *
     * @param WC_Order $order
     */
    public function display_admin_order_meta( $order ) {
        $subscription_status = $order->get_meta( 'mailchimp_woocommerce_is_subscribed' );
        echo '<p><strong>Newsletter Subscription:</strong> ' . ($subscription_status === '1' ? 'Subscribed' : 'Not Subscribed') . '</p>';
    }

    // ... existing code ...
}