// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    String: string,
    ID: string,
    Boolean: boolean,
    Int: number,
    Float: number,
}


/** Contains details about the cart after adding bundle products. */
export interface AddBundleProductsToCartOutput {
    /** The cart after adding products. */
    cart: Cart
    __typename: 'AddBundleProductsToCartOutput'
}


/** Contains details about the cart after adding configurable products. */
export interface AddConfigurableProductsToCartOutput {
    /** The cart after adding products. */
    cart: Cart
    __typename: 'AddConfigurableProductsToCartOutput'
}


/** Contains details about the cart after adding downloadable products. */
export interface AddDownloadableProductsToCartOutput {
    /** The cart after adding products. */
    cart: Cart
    __typename: 'AddDownloadableProductsToCartOutput'
}


/** Contains details about the cart after adding products to it. */
export interface AddProductsToCartOutput {
    /** The cart after products have been added. */
    cart: Cart
    /** Contains errors encountered while adding an item to the cart. */
    user_errors: (CartUserInputError | null)[]
    __typename: 'AddProductsToCartOutput'
}


/** Contains details about the cart after adding products to it. */
export interface AddProductsToNewCartOutput {
    /** The cart after products have been added. */
    cart: (Cart | null)
    /** Contains errors encountered while adding an item to the cart. */
    user_errors: ((CartUserInputError | null)[] | null)
    __typename: 'AddProductsToNewCartOutput'
}


/** Contains the customer's wish list and any errors encountered. */
export interface AddProductsToWishlistOutput {
    /** An array of errors encountered while adding products to a wish list. */
    user_errors: (WishListUserInputError | null)[]
    /** Contains the wish list with all items that were successfully added. */
    wishlist: Wishlist
    __typename: 'AddProductsToWishlistOutput'
}


/** Contains details about the cart after adding simple or group products. */
export interface AddSimpleProductsToCartOutput {
    /** The cart after adding products. */
    cart: Cart
    __typename: 'AddSimpleProductsToCartOutput'
}


/** Contains details about the cart after adding virtual products. */
export interface AddVirtualProductsToCartOutput {
    /** The cart after adding products. */
    cart: Cart
    __typename: 'AddVirtualProductsToCartOutput'
}


/** Contains the resultant wish list and any error information. */
export interface AddWishlistItemsToCartOutput {
    /** An array of errors encountered while adding products to the customer's cart. */
    add_wishlist_items_to_cart_user_errors: (WishlistCartUserInputError | null)[]
    /** Indicates whether the attempt to add items to the customer's cart was successful. */
    status: Scalars['Boolean']
    /** Contains the wish list with all items that were successfully added. */
    wishlist: Wishlist
    __typename: 'AddWishlistItemsToCartOutput'
}


/** Contains information for each filterable option (such as price, category `UID`, and custom attributes). */
export interface Aggregation {
    /** Attribute code of the aggregation group. */
    attribute_code: Scalars['String']
    /** The number of options in the aggregation group. */
    count: (Scalars['Int'] | null)
    /** The aggregation display name. */
    label: (Scalars['String'] | null)
    /** Array of options for the aggregation. */
    options: ((AggregationOption | null)[] | null)
    /** The relative position of the attribute in a layered navigation block. */
    position: (Scalars['Int'] | null)
    __typename: 'Aggregation'
}


/** An implementation of `AggregationOptionInterface`. */
export interface AggregationOption {
    /** The number of items that match the aggregation option. */
    count: (Scalars['Int'] | null)
    /** The display label for an aggregation option. */
    label: (Scalars['String'] | null)
    /** The internal ID that represents the value of the option. */
    value: Scalars['String']
    __typename: 'AggregationOption'
}


/** Defines aggregation option fields. */
export type AggregationOptionInterface = (AggregationOption) & { __isUnion?: true }

export interface ApplePayConfig {
    /** The styles for the ApplePay Smart Button configuration */
    button_styles: (ButtonStyles | null)
    /** The payment method code as defined in the payment gateway */
    code: (Scalars['String'] | null)
    /** Indicates whether the payment method is displayed */
    is_visible: (Scalars['Boolean'] | null)
    /** Defines the payment intent (Authorize or Capture */
    payment_intent: (Scalars['String'] | null)
    /** The payment source for the payment method */
    payment_source: (Scalars['String'] | null)
    /** The PayPal parameters required to load the JS SDK */
    sdk_params: ((SDKParams | null)[] | null)
    /** The relative order the payment method is displayed on the checkout page */
    sort_order: (Scalars['String'] | null)
    /** The name displayed for the payment method */
    title: (Scalars['String'] | null)
    __typename: 'ApplePayConfig'
}


/** Contains the applied coupon code. */
export interface AppliedCoupon {
    /** The coupon code the shopper applied to the card. */
    code: Scalars['String']
    __typename: 'AppliedCoupon'
}


/** Contains details about the cart after applying a coupon. */
export interface ApplyCouponToCartOutput {
    /** The cart after applying a coupon. */
    cart: Cart
    __typename: 'ApplyCouponToCartOutput'
}


/** Contains the results of the request to assign a compare list. */
export interface AssignCompareListToCustomerOutput {
    /** The contents of the customer's compare list. */
    compare_list: (CompareList | null)
    /** Indicates whether the compare list was successfully assigned to the customer. */
    result: Scalars['Boolean']
    __typename: 'AssignCompareListToCustomerOutput'
}


/** Contains details about the attribute, including the code and type. */
export interface Attribute {
    /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
    attribute_code: (Scalars['String'] | null)
    /** Attribute options list. */
    attribute_options: ((AttributeOption | null)[] | null)
    /** The data type of the attribute. */
    attribute_type: (Scalars['String'] | null)
    /** The type of entity that defines the attribute. */
    entity_type: (Scalars['String'] | null)
    /** The frontend input type of the attribute. */
    input_type: (Scalars['String'] | null)
    /** Details about the storefront properties configured for the attribute. */
    storefront_properties: (StorefrontProperties | null)
    __typename: 'Attribute'
}


/** List of all entity types. Populated by the modules introducing EAV entities. */
export type AttributeEntityTypeEnum = 'CATALOG_PRODUCT' | 'CATALOG_CATEGORY' | 'CUSTOMER' | 'CUSTOMER_ADDRESS'


/** EAV attribute frontend input types. */
export type AttributeFrontendInputEnum = 'BOOLEAN' | 'DATE' | 'DATETIME' | 'FILE' | 'GALLERY' | 'HIDDEN' | 'IMAGE' | 'MEDIA_IMAGE' | 'MULTILINE' | 'MULTISELECT' | 'PRICE' | 'SELECT' | 'TEXT' | 'TEXTAREA' | 'WEIGHT' | 'UNDEFINED'


/** Base EAV implementation of CustomAttributeMetadataInterface. */
export interface AttributeMetadata {
    /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
    code: Scalars['ID']
    /** Default attribute value. */
    default_value: (Scalars['String'] | null)
    /** The type of entity that defines the attribute. */
    entity_type: AttributeEntityTypeEnum
    /** The frontend class of the attribute. */
    frontend_class: (Scalars['String'] | null)
    /** The frontend input type of the attribute. */
    frontend_input: (AttributeFrontendInputEnum | null)
    /** Whether the attribute value is required. */
    is_required: Scalars['Boolean']
    /** Whether the attribute value must be unique. */
    is_unique: Scalars['Boolean']
    /** The label assigned to the attribute. */
    label: (Scalars['String'] | null)
    /** Attribute options. */
    options: (CustomAttributeOptionInterface | null)[]
    __typename: 'AttributeMetadata'
}


/** Attribute metadata retrieval error. */
export interface AttributeMetadataError {
    /** Attribute metadata retrieval error message. */
    message: Scalars['String']
    /** Attribute metadata retrieval error type. */
    type: AttributeMetadataErrorType
    __typename: 'AttributeMetadataError'
}


/** Attribute metadata retrieval error types. */
export type AttributeMetadataErrorType = 'ENTITY_NOT_FOUND' | 'ATTRIBUTE_NOT_FOUND' | 'FILTER_NOT_FOUND' | 'UNDEFINED'


/** Defines an attribute option. */
export interface AttributeOption {
    /** The label assigned to the attribute option. */
    label: (Scalars['String'] | null)
    /** The attribute option value. */
    value: (Scalars['String'] | null)
    __typename: 'AttributeOption'
}


/** Base EAV implementation of CustomAttributeOptionInterface. */
export interface AttributeOptionMetadata {
    /** Is the option value default. */
    is_default: Scalars['Boolean']
    /** The label assigned to the attribute option. */
    label: Scalars['String']
    /** The attribute option value. */
    value: Scalars['String']
    __typename: 'AttributeOptionMetadata'
}

export interface AttributeSelectedOption {
    /** The attribute selected option label. */
    label: Scalars['String']
    /** The attribute selected option value. */
    value: Scalars['String']
    __typename: 'AttributeSelectedOption'
}

export type AttributeSelectedOptionInterface = (AttributeSelectedOption) & { __isUnion?: true }

export interface AttributeSelectedOptions {
    /** The attribute code. */
    code: Scalars['ID']
    selected_options: (AttributeSelectedOptionInterface | null)[]
    __typename: 'AttributeSelectedOptions'
}


/** Metadata of EAV attributes associated to form */
export interface AttributesFormOutput {
    /** Errors of retrieving certain attributes metadata. */
    errors: (AttributeMetadataError | null)[]
    /** Requested attributes metadata. */
    items: (CustomAttributeMetadataInterface | null)[]
    __typename: 'AttributesFormOutput'
}


/** Metadata of EAV attributes. */
export interface AttributesMetadataOutput {
    /** Errors of retrieving certain attributes metadata. */
    errors: (AttributeMetadataError | null)[]
    /** Requested attributes metadata. */
    items: (CustomAttributeMetadataInterface | null)[]
    __typename: 'AttributesMetadataOutput'
}

export interface AttributeValue {
    /** The attribute code. */
    code: Scalars['ID']
    /** The attribute value. */
    value: Scalars['String']
    __typename: 'AttributeValue'
}

export type AttributeValueInterface = (AttributeSelectedOptions | AttributeValue) & { __isUnion?: true }


/** Describes a payment method that the shopper can use to pay for the order. */
export interface AvailablePaymentMethod {
    /** The payment method code. */
    code: Scalars['String']
    /** If the payment method is an online integration */
    is_deferred: Scalars['Boolean']
    /** The payment method title. */
    title: Scalars['String']
    __typename: 'AvailablePaymentMethod'
}


/** Contains details about the possible shipping methods and carriers. */
export interface AvailableShippingMethod {
    /** The cost of shipping using this shipping method. */
    amount: Money
    /** Indicates whether this shipping method can be applied to the cart. */
    available: Scalars['Boolean']
    /** @deprecated The field should not be used on the storefront. */
    base_amount: (Money | null)
    /** A string that identifies a commercial carrier or an offline shipping method. */
    carrier_code: Scalars['String']
    /** The label for the carrier code. */
    carrier_title: Scalars['String']
    /** Describes an error condition. */
    error_message: (Scalars['String'] | null)
    /** A shipping method code associated with a carrier. The value could be null if no method is available. */
    method_code: (Scalars['String'] | null)
    /** The label for the shipping method code. The value could be null if no method is available. */
    method_title: (Scalars['String'] | null)
    /** The cost of shipping using this shipping method, excluding tax. */
    price_excl_tax: Money
    /** The cost of shipping using this shipping method, including tax. */
    price_incl_tax: Money
    __typename: 'AvailableShippingMethod'
}

export type BatchMutationStatus = 'SUCCESS' | 'FAILURE' | 'MIXED_RESULTS'


/** Contains details about the billing address. */
export interface BillingCartAddress {
    /** The city specified for the billing or shipping address. */
    city: Scalars['String']
    /** The company specified for the billing or shipping address. */
    company: (Scalars['String'] | null)
    /** An object containing the country label and code. */
    country: CartAddressCountry
    /** @deprecated The field is used only in shipping address. */
    customer_notes: (Scalars['String'] | null)
    /** The customer's fax number. */
    fax: (Scalars['String'] | null)
    /** The first name of the customer or guest. */
    firstname: Scalars['String']
    /** The last name of the customer or guest. */
    lastname: Scalars['String']
    /** The middle name of the person associated with the billing/shipping address. */
    middlename: (Scalars['String'] | null)
    /** The ZIP or postal code of the billing or shipping address. */
    postcode: (Scalars['String'] | null)
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix: (Scalars['String'] | null)
    /** An object containing the region label and code. */
    region: (CartAddressRegion | null)
    /** An array containing the street for the billing or shipping address. */
    street: (Scalars['String'] | null)[]
    /** A value such as Sr., Jr., or III. */
    suffix: (Scalars['String'] | null)
    /** The telephone number for the billing or shipping address. */
    telephone: (Scalars['String'] | null)
    /** The unique id of the customer address. */
    uid: Scalars['String']
    /** The VAT company number for billing or shipping address. */
    vat_id: (Scalars['String'] | null)
    __typename: 'BillingCartAddress'
}


/** Contains details about an individual category that comprises a breadcrumb. */
export interface Breadcrumb {
    /**
     * @deprecated Use `category_uid` instead.
     * The ID of the category.
     */
    category_id: (Scalars['Int'] | null)
    /** The category level. */
    category_level: (Scalars['Int'] | null)
    /** The display name of the category. */
    category_name: (Scalars['String'] | null)
    /** The unique ID for a `Breadcrumb` object. */
    category_uid: Scalars['ID']
    /** The URL key of the category. */
    category_url_key: (Scalars['String'] | null)
    /** The URL path of the category. */
    category_url_path: (Scalars['String'] | null)
    __typename: 'Breadcrumb'
}


/** An implementation for bundle product cart items. */
export interface BundleCartItem {
    /** An array containing the bundle options the shopper selected. */
    bundle_options: (SelectedBundleOption | null)[]
    /** An array containing the customizable options the shopper selected. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** An array of errors encountered while loading the cart item */
    errors: ((CartItemError | null)[] | null)
    /** The entered gift message for the cart item */
    gift_message: (GiftMessage | null)
    /** @deprecated Use `uid` instead. */
    id: Scalars['String']
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available: Scalars['Boolean']
    /** Contains details about the price of the item, including taxes and discounts. */
    prices: (CartItemPrices | null)
    /** Details about an item in the cart. */
    product: ProductInterface
    /** The quantity of this item in the cart. */
    quantity: Scalars['Float']
    /** The unique ID for a `CartItemInterface` object. */
    uid: Scalars['ID']
    __typename: 'BundleCartItem'
}


/** Defines bundle product options for `CreditMemoItemInterface`. */
export interface BundleCreditMemoItem {
    /** A list of bundle options that are assigned to a bundle product that is part of a credit memo. */
    bundle_options: ((ItemSelectedBundleOption | null)[] | null)
    /** Details about the final discount amount for the base product, including discounts on options. */
    discounts: ((Discount | null)[] | null)
    /** The unique ID for a `CreditMemoItemInterface` object. */
    id: Scalars['ID']
    /** The order item the credit memo is applied to. */
    order_item: (OrderItemInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price for the base product, including selected options. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The number of refunded items. */
    quantity_refunded: (Scalars['Float'] | null)
    __typename: 'BundleCreditMemoItem'
}


/** Defines bundle product options for `InvoiceItemInterface`. */
export interface BundleInvoiceItem {
    /** A list of bundle options that are assigned to an invoiced bundle product. */
    bundle_options: ((ItemSelectedBundleOption | null)[] | null)
    /** Information about the final discount amount for the base product, including discounts on options. */
    discounts: ((Discount | null)[] | null)
    /** The unique ID for an `InvoiceItemInterface` object. */
    id: Scalars['ID']
    /** Details about an individual order item. */
    order_item: (OrderItemInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price for the base product including selected options. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The number of invoiced items. */
    quantity_invoiced: (Scalars['Float'] | null)
    __typename: 'BundleInvoiceItem'
}


/** Defines an individual item within a bundle product. */
export interface BundleItem {
    /**
     * @deprecated Use `uid` instead
     * An ID assigned to each type of item in a bundle product.
     */
    option_id: (Scalars['Int'] | null)
    /** An array of additional options for this bundle item. */
    options: ((BundleItemOption | null)[] | null)
    /** A number indicating the sequence order of this item compared to the other bundle items. */
    position: (Scalars['Int'] | null)
    /** The range of prices for the product */
    price_range: PriceRange
    /** Indicates whether the item must be included in the bundle. */
    required: (Scalars['Boolean'] | null)
    /** The SKU of the bundle product. */
    sku: (Scalars['String'] | null)
    /** The display name of the item. */
    title: (Scalars['String'] | null)
    /** The input type that the customer uses to select the item. Examples include radio button and checkbox. */
    type: (Scalars['String'] | null)
    /** The unique ID for a `BundleItem` object. */
    uid: (Scalars['ID'] | null)
    __typename: 'BundleItem'
}


/** Defines the characteristics that comprise a specific bundle item and its options. */
export interface BundleItemOption {
    /** Indicates whether the customer can change the number of items for this option. */
    can_change_quantity: (Scalars['Boolean'] | null)
    /**
     * @deprecated Use `uid` instead
     * The ID assigned to the bundled item option.
     */
    id: (Scalars['Int'] | null)
    /** Indicates whether this option is the default option. */
    is_default: (Scalars['Boolean'] | null)
    /** The text that identifies the bundled item option. */
    label: (Scalars['String'] | null)
    /** When a bundle item contains multiple options, the relative position of this option compared to the other options. */
    position: (Scalars['Int'] | null)
    /** The price of the selected option. */
    price: (Scalars['Float'] | null)
    /** One of FIXED, PERCENT, or DYNAMIC. */
    price_type: (PriceTypeEnum | null)
    /** Contains details about this product option. */
    product: (ProductInterface | null)
    /**
     * @deprecated Use `quantity` instead.
     * Indicates the quantity of this specific bundle item.
     */
    qty: (Scalars['Float'] | null)
    /** The quantity of this specific bundle item. */
    quantity: (Scalars['Float'] | null)
    /** The unique ID for a `BundleItemOption` object. */
    uid: Scalars['ID']
    __typename: 'BundleItemOption'
}


/** Defines bundle product options for `OrderItemInterface`. */
export interface BundleOrderItem {
    /** A list of bundle options that are assigned to the bundle product. */
    bundle_options: ((ItemSelectedBundleOption | null)[] | null)
    /** The final discount information for the product. */
    discounts: ((Discount | null)[] | null)
    /** The entered option for the base product, such as a logo or image. */
    entered_options: ((OrderItemOption | null)[] | null)
    /** The selected gift message for the order item */
    gift_message: (GiftMessage | null)
    /** The unique ID for an `OrderItemInterface` object. */
    id: Scalars['ID']
    /** The ProductInterface object, which contains details about the base product */
    product: (ProductInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price of the base product, including selected options. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The type of product, such as simple, configurable, etc. */
    product_type: (Scalars['String'] | null)
    /** URL key of the base product. */
    product_url_key: (Scalars['String'] | null)
    /** The number of canceled items. */
    quantity_canceled: (Scalars['Float'] | null)
    /** The number of invoiced items. */
    quantity_invoiced: (Scalars['Float'] | null)
    /** The number of units ordered for this item. */
    quantity_ordered: (Scalars['Float'] | null)
    /** The number of refunded items. */
    quantity_refunded: (Scalars['Float'] | null)
    /** The number of returned items. */
    quantity_returned: (Scalars['Float'] | null)
    /** The number of shipped items. */
    quantity_shipped: (Scalars['Float'] | null)
    /** The selected options for the base product, such as color or size. */
    selected_options: ((OrderItemOption | null)[] | null)
    /** The status of the order item. */
    status: (Scalars['String'] | null)
    __typename: 'BundleOrderItem'
}


/** Defines basic features of a bundle product and contains multiple BundleItems. */
export interface BundleProduct {
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id: (Scalars['Int'] | null)
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url: (Scalars['String'] | null)
    /** The categories assigned to a product. */
    categories: ((CategoryInterface | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    color: (Scalars['Int'] | null)
    /** The product's country of origin. */
    country_of_manufacture: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at: (Scalars['String'] | null)
    /** Crosssell Products */
    crosssell_products: ((ProductInterface | null)[] | null)
    /** Product custom attributes. */
    custom_attributesV2: (ProductCustomAttributes | null)
    /** Detailed information about the product. The value can include simple HTML tags. */
    description: (ComplexTextValue | null)
    /** Indicates whether the bundle product has a dynamic price. */
    dynamic_price: (Scalars['Boolean'] | null)
    /** Indicates whether the bundle product has a dynamic SKU. */
    dynamic_sku: (Scalars['Boolean'] | null)
    /** Indicates whether the bundle product has a dynamically calculated weight. */
    dynamic_weight: (Scalars['Boolean'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size: (Scalars['String'] | null)
    /** Indicates whether a gift message is available. */
    gift_message_available: (Scalars['String'] | null)
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id: (Scalars['Int'] | null)
    /** The relative path to the main image on the product page. */
    image: (ProductImage | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested: (Scalars['Int'] | null)
    /** An array containing information about individual bundle items. */
    items: ((BundleItem | null)[] | null)
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer: (Scalars['Int'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2: (Scalars['Int'] | null)
    /** An array of media gallery objects. */
    media_gallery: ((MediaGalleryInterface | null)[] | null)
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries: ((MediaGalleryEntry | null)[] | null)
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description: (Scalars['String'] | null)
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword: (Scalars['String'] | null)
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title: (Scalars['String'] | null)
    /** The product name. Customers use this name to identify the product. */
    name: (Scalars['String'] | null)
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date: (Scalars['String'] | null)
    /** The end date for new product listings. */
    new_to_date: (Scalars['String'] | null)
    /** Product stock only x left count */
    only_x_left_in_stock: (Scalars['Float'] | null)
    /** An array of options for a customizable product. */
    options: ((CustomizableOptionInterface | null)[] | null)
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container: (Scalars['String'] | null)
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price: (ProductPrices | null)
    /** The price details of the main product */
    price_details: (PriceDetails | null)
    /** The range of prices for the product */
    price_range: PriceRange
    /** An array of `TierPrice` objects. */
    price_tiers: ((TierPrice | null)[] | null)
    /** One of PRICE_RANGE or AS_LOW_AS. */
    price_view: (PriceViewEnum | null)
    /** An array of `ProductLinks` objects. */
    product_links: ((ProductLinksInterface | null)[] | null)
    /** The average of all the ratings given to the product. */
    rating_summary: Scalars['Float']
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code: Scalars['Int']
    /** An array of products to be displayed in a Related Products block. */
    related_products: ((ProductInterface | null)[] | null)
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    /** The total count of all the reviews given to the product. */
    review_count: Scalars['Int']
    /** The list of products reviews. */
    reviews: ProductReviews
    /** Indicates whether to ship bundle items together or individually. */
    ship_bundle_items: (ShipBundleItemsEnum | null)
    /** A short description of the product. Its use depends on the theme. */
    short_description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    size: (Scalars['Int'] | null)
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku: (Scalars['String'] | null)
    /** The relative path to the small image, which is used on catalog pages. */
    small_image: (ProductImage | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date: (Scalars['String'] | null)
    /** The discounted price of the product. */
    special_price: (Scalars['Float'] | null)
    /** The end date for a product with a special price. */
    special_to_date: (Scalars['String'] | null)
    /** Stock status of the product */
    stock_status: (ProductStockStatus | null)
    /** The file name of a swatch image. */
    swatch_image: (Scalars['String'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tema: (Scalars['Int'] | null)
    /** The relative path to the product's thumbnail image. */
    thumbnail: (ProductImage | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price: (Scalars['Float'] | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices: ((ProductTierPrices | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia: (Scalars['Int'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id: (Scalars['String'] | null)
    /** The unique ID for a `ProductInterface` object. */
    uid: Scalars['ID']
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at: (Scalars['String'] | null)
    /** Upsell Products */
    upsell_products: ((ProductInterface | null)[] | null)
    /** The part of the URL that identifies the product */
    url_key: (Scalars['String'] | null)
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path: (Scalars['String'] | null)
    /** URL rewrites list */
    url_rewrites: ((UrlRewrite | null)[] | null)
    /** The part of the product URL that is appended after the url key */
    url_suffix: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites: ((Website | null)[] | null)
    /** The weight of the item, in units defined by the store. */
    weight: (Scalars['Float'] | null)
    __typename: 'BundleProduct'
}


/** Defines bundle product options for `ShipmentItemInterface`. */
export interface BundleShipmentItem {
    /** A list of bundle options that are assigned to a shipped product. */
    bundle_options: ((ItemSelectedBundleOption | null)[] | null)
    /** The unique ID for a `ShipmentItemInterface` object. */
    id: Scalars['ID']
    /** The order item associated with the shipment item. */
    order_item: (OrderItemInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price for the base product. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The number of shipped items. */
    quantity_shipped: Scalars['Float']
    __typename: 'BundleShipmentItem'
}


/** Defines bundle product options for `WishlistItemInterface`. */
export interface BundleWishlistItem {
    /** The date and time the item was added to the wish list. */
    added_at: Scalars['String']
    /** An array containing information about the selected bundle items. */
    bundle_options: ((SelectedBundleOption | null)[] | null)
    /** Custom options selected for the wish list item. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** The description of the item. */
    description: (Scalars['String'] | null)
    /** The unique ID for a `WishlistItemInterface` object. */
    id: Scalars['ID']
    /** Product details of the wish list item. */
    product: (ProductInterface | null)
    /** The quantity of this wish list item. */
    quantity: Scalars['Float']
    __typename: 'BundleWishlistItem'
}

export interface ButtonStyles {
    /** The button color */
    color: (Scalars['String'] | null)
    /** The button height in pixels */
    height: (Scalars['Int'] | null)
    /** The button label */
    label: (Scalars['String'] | null)
    /** The button layout */
    layout: (Scalars['String'] | null)
    /** The button shape */
    shape: (Scalars['String'] | null)
    /** Indicates whether the tagline is displayed */
    tagline: (Scalars['Boolean'] | null)
    /** Defines if the button uses default height. If the value is false, the value of height is used */
    use_default_height: (Scalars['Boolean'] | null)
    __typename: 'ButtonStyles'
}

export interface CancellationReason {
    description: Scalars['String']
    __typename: 'CancellationReason'
}


/** Contains the updated customer order and error message if any. */
export interface CancelOrderOutput {
    /** Error encountered while cancelling the order. */
    error: (Scalars['String'] | null)
    /** Updated customer order. */
    order: (CustomerOrder | null)
    __typename: 'CancelOrderOutput'
}

export interface Card {
    /** Card bin details */
    bin_details: (CardBin | null)
    /** Expiration month of the card */
    card_expiry_month: (Scalars['String'] | null)
    /** Expiration year of the card */
    card_expiry_year: (Scalars['String'] | null)
    /** Last four digits of the card */
    last_digits: (Scalars['String'] | null)
    /** Name on the card */
    name: (Scalars['String'] | null)
    __typename: 'Card'
}

export interface CardBin {
    /** Card bin number */
    bin: (Scalars['String'] | null)
    __typename: 'CardBin'
}


/** The card payment source information */
export interface CardPaymentSourceOutput {
    /** The brand of the card */
    brand: (Scalars['String'] | null)
    /** The expiry of the card */
    expiry: (Scalars['String'] | null)
    /** The last digits of the card */
    last_digits: (Scalars['String'] | null)
    __typename: 'CardPaymentSourceOutput'
}


/** Contains the contents and other details about a guest or customer cart. */
export interface Cart {
    /** @deprecated Use `applied_coupons` instead. */
    applied_coupon: (AppliedCoupon | null)
    /** An array of `AppliedCoupon` objects. Each object contains the `code` text attribute, which specifies the coupon code. */
    applied_coupons: ((AppliedCoupon | null)[] | null)
    /** An array of available payment methods. */
    available_payment_methods: ((AvailablePaymentMethod | null)[] | null)
    /** The billing address assigned to the cart. */
    billing_address: (BillingCartAddress | null)
    /** The email address of the guest or customer. */
    email: (Scalars['String'] | null)
    /** The entered gift message for the cart */
    gift_message: (GiftMessage | null)
    /** The unique ID for a `Cart` object. */
    id: Scalars['ID']
    /** Indicates whether the cart contains only virtual products. */
    is_virtual: Scalars['Boolean']
    /**
     * @deprecated Use `itemsV2` instead.
     * An array of products that have been added to the cart.
     */
    items: ((CartItemInterface | null)[] | null)
    itemsV2: (CartItems | null)
    /** Pricing details for the quote. */
    prices: (CartPrices | null)
    /** Indicates which payment method was applied to the cart. */
    selected_payment_method: (SelectedPaymentMethod | null)
    /** An array of shipping addresses assigned to the cart. */
    shipping_addresses: (ShippingCartAddress | null)[]
    /** The total number of items in the cart. */
    total_quantity: Scalars['Float']
    __typename: 'Cart'
}


/** Contains details the country in a billing or shipping address. */
export interface CartAddressCountry {
    /** The country code. */
    code: Scalars['String']
    /** The display label for the country. */
    label: Scalars['String']
    __typename: 'CartAddressCountry'
}

export type CartAddressInterface = (BillingCartAddress | ShippingCartAddress) & { __isUnion?: true }


/** Contains details about the region in a billing or shipping address. */
export interface CartAddressRegion {
    /** The state or province code. */
    code: (Scalars['String'] | null)
    /** The display label for the region. */
    label: (Scalars['String'] | null)
    /** The unique ID for a pre-defined region. */
    region_id: (Scalars['Int'] | null)
    __typename: 'CartAddressRegion'
}


/** Contains information about discounts applied to the cart. */
export interface CartDiscount {
    /** The amount of the discount applied to the item. */
    amount: Money
    /** The description of the discount. */
    label: (Scalars['String'] | null)[]
    __typename: 'CartDiscount'
}

export type CartDiscountType = 'ITEM' | 'SHIPPING'

export interface CartItemError {
    /** An error code that describes the error encountered */
    code: CartItemErrorType
    /** A localized error message */
    message: Scalars['String']
    __typename: 'CartItemError'
}

export type CartItemErrorType = 'UNDEFINED' | 'ITEM_QTY' | 'ITEM_INCREMENTS'


/** An interface for products in a cart. */
export type CartItemInterface = (BundleCartItem | ConfigurableCartItem | DownloadableCartItem | SimpleCartItem | VirtualCartItem) & { __isUnion?: true }


/** Contains details about the price of the item, including taxes and discounts. */
export interface CartItemPrices {
    /** An array of discounts to be applied to the cart item. */
    discounts: ((Discount | null)[] | null)
    /**
     * The price of the item before any discounts were applied. The price that might
     * include tax, depending on the configured display settings for cart.
     */
    price: Money
    /**
     * The price of the item before any discounts were applied. The price that might
     * include tax, depending on the configured display settings for cart.
     */
    price_including_tax: Money
    /** The value of the price multiplied by the quantity of the item. */
    row_total: Money
    /** The value of `row_total` plus the tax applied to the item. */
    row_total_including_tax: Money
    /** The total of all discounts applied to the item. */
    total_item_discount: (Money | null)
    __typename: 'CartItemPrices'
}


/** Deprecated: The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`. */
export interface CartItemQuantity {
    /** @deprecated The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`. */
    cart_item_id: Scalars['Int']
    /** @deprecated The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`. */
    quantity: Scalars['Float']
    __typename: 'CartItemQuantity'
}

export interface CartItems {
    /** An array of products that have been added to the cart. */
    items: (CartItemInterface | null)[]
    /** Metadata for pagination rendering. */
    page_info: (SearchResultPageInfo | null)
    /** The number of returned cart items. */
    total_count: Scalars['Int']
    __typename: 'CartItems'
}


/** Contains details about the price of a selected customizable value. */
export interface CartItemSelectedOptionValuePrice {
    /** Indicates whether the price type is fixed, percent, or dynamic. */
    type: PriceTypeEnum
    /** A string that describes the unit of the value. */
    units: Scalars['String']
    /** A price value. */
    value: Scalars['Float']
    __typename: 'CartItemSelectedOptionValuePrice'
}


/** Contains details about the final price of items in the cart, including discount and tax information. */
export interface CartPrices {
    /** An array containing the names and amounts of taxes applied to each item in the cart. */
    applied_taxes: ((CartTaxItem | null)[] | null)
    /** @deprecated Use discounts instead. */
    discount: (CartDiscount | null)
    /** An array containing cart rule discounts, store credit and gift cards applied to the cart. */
    discounts: ((Discount | null)[] | null)
    /** The total, including discounts, taxes, shipping, and other fees. */
    grand_total: (Money | null)
    /** The subtotal without any applied taxes. */
    subtotal_excluding_tax: (Money | null)
    /** The subtotal including any applied taxes. */
    subtotal_including_tax: (Money | null)
    /** The subtotal with any discounts applied, but not taxes. */
    subtotal_with_discount_excluding_tax: (Money | null)
    __typename: 'CartPrices'
}


/** Contains tax information about an item in the cart. */
export interface CartTaxItem {
    /** The amount of tax applied to the item. */
    amount: Money
    /** The description of the tax. */
    label: Scalars['String']
    __typename: 'CartTaxItem'
}


/** An error encountered while adding an item to the the cart. */
export interface CartUserInputError {
    /** A cart-specific error code. */
    code: CartUserInputErrorType
    /** A localized error message. */
    message: Scalars['String']
    __typename: 'CartUserInputError'
}

export type CartUserInputErrorType = 'PRODUCT_NOT_FOUND' | 'NOT_SALABLE' | 'INSUFFICIENT_STOCK' | 'UNDEFINED'

export type CatalogAttributeApplyToEnum = 'SIMPLE' | 'VIRTUAL' | 'BUNDLE' | 'DOWNLOADABLE' | 'CONFIGURABLE' | 'GROUPED' | 'CATEGORY'


/** Swatch attribute metadata. */
export interface CatalogAttributeMetadata {
    /** To which catalog types an attribute can be applied. */
    apply_to: ((CatalogAttributeApplyToEnum | null)[] | null)
    /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
    code: Scalars['ID']
    /** Default attribute value. */
    default_value: (Scalars['String'] | null)
    /** The type of entity that defines the attribute. */
    entity_type: AttributeEntityTypeEnum
    /** The frontend class of the attribute. */
    frontend_class: (Scalars['String'] | null)
    /** The frontend input type of the attribute. */
    frontend_input: (AttributeFrontendInputEnum | null)
    /** Whether a product or category attribute can be compared against another or not. */
    is_comparable: (Scalars['Boolean'] | null)
    /** Whether a product or category attribute can be filtered or not. */
    is_filterable: (Scalars['Boolean'] | null)
    /** Whether a product or category attribute can be filtered in search or not. */
    is_filterable_in_search: (Scalars['Boolean'] | null)
    /** Whether a product or category attribute can use HTML on front or not. */
    is_html_allowed_on_front: (Scalars['Boolean'] | null)
    /** Whether the attribute value is required. */
    is_required: Scalars['Boolean']
    /** Whether a product or category attribute can be searched or not. */
    is_searchable: (Scalars['Boolean'] | null)
    /** Whether the attribute value must be unique. */
    is_unique: Scalars['Boolean']
    /** Whether a product or category attribute can be used for price rules or not. */
    is_used_for_price_rules: (Scalars['Boolean'] | null)
    /** Whether a product or category attribute is used for promo rules or not. */
    is_used_for_promo_rules: (Scalars['Boolean'] | null)
    /** Whether a product or category attribute is visible in advanced search or not. */
    is_visible_in_advanced_search: (Scalars['Boolean'] | null)
    /** Whether a product or category attribute is visible on front or not. */
    is_visible_on_front: (Scalars['Boolean'] | null)
    /** Whether a product or category attribute has WYSIWYG enabled or not. */
    is_wysiwyg_enabled: (Scalars['Boolean'] | null)
    /** The label assigned to the attribute. */
    label: (Scalars['String'] | null)
    /** Attribute options. */
    options: (CustomAttributeOptionInterface | null)[]
    /** Input type of the swatch attribute option. */
    swatch_input_type: (SwatchInputTypeEnum | null)
    /** Whether update product preview image or not. */
    update_product_preview_image: (Scalars['Boolean'] | null)
    /** Whether use product image for swatch or not. */
    use_product_image_for_swatch: (Scalars['Boolean'] | null)
    /** Whether a product or category attribute is used in product listing or not. */
    used_in_product_listing: (Scalars['Boolean'] | null)
    __typename: 'CatalogAttributeMetadata'
}


/** Contains the full set of attributes that can be returned in a category search. */
export type CategoryInterface = (CategoryTree) & { __isUnion?: true }


/** Contains details about the products assigned to a category. */
export interface CategoryProducts {
    /** An array of products that are assigned to the category. */
    items: ((ProductInterface | null)[] | null)
    /** Pagination metadata. */
    page_info: (SearchResultPageInfo | null)
    /**
     * The number of products in the category that are marked as visible. By default,
     * in complex products, parent products are visible, but their child products are not.
     */
    total_count: (Scalars['Int'] | null)
    __typename: 'CategoryProducts'
}


/** Contains a collection of `CategoryTree` objects and pagination information. */
export interface CategoryResult {
    /** A list of categories that match the filter criteria. */
    items: ((CategoryTree | null)[] | null)
    /** An object that includes the `page_info` and `currentPage` values specified in the query. */
    page_info: (SearchResultPageInfo | null)
    /** The total number of categories that match the criteria. */
    total_count: (Scalars['Int'] | null)
    __typename: 'CategoryResult'
}


/** Contains the hierarchy of categories. */
export interface CategoryTree {
    available_sort_by: ((Scalars['String'] | null)[] | null)
    /** An array of breadcrumb items. */
    breadcrumbs: ((Breadcrumb | null)[] | null)
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Categories' is enabled.
     */
    canonical_url: (Scalars['String'] | null)
    /** A tree of child categories. */
    children: ((CategoryTree | null)[] | null)
    children_count: (Scalars['String'] | null)
    /** Contains a category CMS block. */
    cms_block: (CmsBlock | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The timestamp indicating when the category was created.
     */
    created_at: (Scalars['String'] | null)
    custom_layout_update_file: (Scalars['String'] | null)
    /** The attribute to use for sorting. */
    default_sort_by: (Scalars['String'] | null)
    /** An optional description of the category. */
    description: (Scalars['String'] | null)
    display_mode: (Scalars['String'] | null)
    filter_price_range: (Scalars['Float'] | null)
    /**
     * @deprecated Use `uid` instead.
     * An ID that uniquely identifies the category.
     */
    id: (Scalars['Int'] | null)
    image: (Scalars['String'] | null)
    include_in_menu: (Scalars['Int'] | null)
    is_anchor: (Scalars['Int'] | null)
    is_on_home: (Scalars['Int'] | null)
    landing_page: (Scalars['Int'] | null)
    /** The depth of the category within the tree. */
    level: (Scalars['Int'] | null)
    meta_description: (Scalars['String'] | null)
    meta_keywords: (Scalars['String'] | null)
    meta_title: (Scalars['String'] | null)
    /** The display name of the category. */
    name: (Scalars['String'] | null)
    /** The full category path. */
    path: (Scalars['String'] | null)
    /** The category path within the store. */
    path_in_store: (Scalars['String'] | null)
    /** The position of the category relative to other categories at the same level in tree. */
    position: (Scalars['Int'] | null)
    /**
     * The number of products in the category that are marked as visible. By default,
     * in complex products, parent products are visible, but their child products are not.
     */
    product_count: (Scalars['Int'] | null)
    /** The list of products assigned to the category. */
    products: (CategoryProducts | null)
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code: Scalars['Int']
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    thumbnail: (Scalars['String'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    /** The unique ID for a `CategoryInterface` object. */
    uid: Scalars['ID']
    /**
     * @deprecated The field should not be used on the storefront.
     * The timestamp indicating when the category was updated.
     */
    updated_at: (Scalars['String'] | null)
    /** The URL key assigned to the category. */
    url_key: (Scalars['String'] | null)
    /** The URL path assigned to the category. */
    url_path: (Scalars['String'] | null)
    /** The part of the category URL that is appended after the url key */
    url_suffix: (Scalars['String'] | null)
    __typename: 'CategoryTree'
}


/** Defines details about an individual checkout agreement. */
export interface CheckoutAgreement {
    /** The ID for a checkout agreement. */
    agreement_id: Scalars['Int']
    /** The checkbox text for the checkout agreement. */
    checkbox_text: Scalars['String']
    /** Required. The text of the agreement. */
    content: Scalars['String']
    /** The height of the text box where the Terms and Conditions statement appears during checkout. */
    content_height: (Scalars['String'] | null)
    /** Indicates whether the `content` text is in HTML format. */
    is_html: Scalars['Boolean']
    /** Indicates whether agreements are accepted automatically or manually. */
    mode: CheckoutAgreementMode
    /** The name given to the condition. */
    name: Scalars['String']
    __typename: 'CheckoutAgreement'
}


/** Indicates how agreements are accepted. */
export type CheckoutAgreementMode = 'AUTO' | 'MANUAL'


/** An error encountered while adding an item to the cart. */
export interface CheckoutUserInputError {
    /** An error code that is specific to Checkout. */
    code: CheckoutUserInputErrorCodes
    /** A localized error message. */
    message: Scalars['String']
    /**
     * The path to the input field that caused an error. See the GraphQL
     * specification about path errors for details:
     * http://spec.graphql.org/draft/#sec-Errors
     */
    path: (Scalars['String'] | null)[]
    __typename: 'CheckoutUserInputError'
}

export type CheckoutUserInputErrorCodes = 'REORDER_NOT_AVAILABLE' | 'PRODUCT_NOT_FOUND' | 'NOT_SALABLE' | 'INSUFFICIENT_STOCK' | 'UNDEFINED'


/** Contains details about a specific CMS block. */
export interface CmsBlock {
    /** The content of the CMS block in raw HTML. */
    content: (Scalars['String'] | null)
    /** The CMS block identifier. */
    identifier: (Scalars['String'] | null)
    /** The title assigned to the CMS block. */
    title: (Scalars['String'] | null)
    __typename: 'CmsBlock'
}


/** Contains an array CMS block items. */
export interface CmsBlocks {
    /** An array of CMS blocks. */
    items: ((CmsBlock | null)[] | null)
    __typename: 'CmsBlocks'
}


/** Contains details about a CMS page. */
export interface CmsPage {
    /** The content of the CMS page in raw HTML. */
    content: (Scalars['String'] | null)
    /** The heading that displays at the top of the CMS page. */
    content_heading: (Scalars['String'] | null)
    /** The ID of a CMS page. */
    identifier: (Scalars['String'] | null)
    /** A brief description of the page for search results listings. */
    meta_description: (Scalars['String'] | null)
    /** A brief description of the page for search results listings. */
    meta_keywords: (Scalars['String'] | null)
    /** A page title that is indexed by search engines and appears in search results listings. */
    meta_title: (Scalars['String'] | null)
    /** The design layout of the page, indicating the number of columns and navigation features used on the page. */
    page_layout: (Scalars['String'] | null)
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code: Scalars['Int']
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    /** The name that appears in the breadcrumb trail navigation and in the browser title bar and tab. */
    title: (Scalars['String'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    /** The URL key of the CMS page, which is often based on the `content_heading`. */
    url_key: (Scalars['String'] | null)
    __typename: 'CmsPage'
}

export interface ColorSwatchData {
    /** The value can be represented as color (HEX code), image link, or text. */
    value: (Scalars['String'] | null)
    __typename: 'ColorSwatchData'
}


/** Contains an attribute code that is used for product comparisons. */
export interface ComparableAttribute {
    /** An attribute code that is enabled for product comparisons. */
    code: Scalars['String']
    /** The label of the attribute code. */
    label: Scalars['String']
    __typename: 'ComparableAttribute'
}


/** Defines an object used to iterate through items for product comparisons. */
export interface ComparableItem {
    /** An array of product attributes that can be used to compare products. */
    attributes: (ProductAttribute | null)[]
    /** Details about a product in a compare list. */
    product: ProductInterface
    /** The unique ID of an item in a compare list. */
    uid: Scalars['ID']
    __typename: 'ComparableItem'
}


/** Contains iterable information such as the array of items, the count, and attributes that represent the compare list. */
export interface CompareList {
    /** An array of attributes that can be used for comparing products. */
    attributes: ((ComparableAttribute | null)[] | null)
    /** The number of items in the compare list. */
    item_count: Scalars['Int']
    /** An array of products to compare. */
    items: ((ComparableItem | null)[] | null)
    /** The unique ID assigned to the compare list. */
    uid: Scalars['ID']
    __typename: 'CompareList'
}

export interface ComplexTextValue {
    /** Text that can contain HTML tags. */
    html: Scalars['String']
    __typename: 'ComplexTextValue'
}


/** Contains details about a configurable product attribute option. */
export interface ConfigurableAttributeOption {
    /** The ID assigned to the attribute. */
    code: (Scalars['String'] | null)
    /** A string that describes the configurable attribute option. */
    label: (Scalars['String'] | null)
    /** The unique ID for a `ConfigurableAttributeOption` object. */
    uid: Scalars['ID']
    /** A unique index number assigned to the configurable product option. */
    value_index: (Scalars['Int'] | null)
    __typename: 'ConfigurableAttributeOption'
}


/** An implementation for configurable product cart items. */
export interface ConfigurableCartItem {
    /** An array containing the configuranle options the shopper selected. */
    configurable_options: (SelectedConfigurableOption | null)[]
    /** Product details of the cart item. */
    configured_variant: ProductInterface
    /** An array containing the customizable options the shopper selected. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** An array of errors encountered while loading the cart item */
    errors: ((CartItemError | null)[] | null)
    /** The entered gift message for the cart item */
    gift_message: (GiftMessage | null)
    /** @deprecated Use `uid` instead. */
    id: Scalars['String']
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available: Scalars['Boolean']
    /** Contains details about the price of the item, including taxes and discounts. */
    prices: (CartItemPrices | null)
    /** Details about an item in the cart. */
    product: ProductInterface
    /** The quantity of this item in the cart. */
    quantity: Scalars['Float']
    /** The unique ID for a `CartItemInterface` object. */
    uid: Scalars['ID']
    __typename: 'ConfigurableCartItem'
}


/** Describes configurable options that have been selected and can be selected as a result of the previous selections. */
export interface ConfigurableOptionAvailableForSelection {
    /** An attribute code that uniquely identifies a configurable option. */
    attribute_code: Scalars['String']
    /** An array of selectable option value IDs. */
    option_value_uids: (Scalars['ID'] | null)[]
    __typename: 'ConfigurableOptionAvailableForSelection'
}


/** Defines basic features of a configurable product and its simple product variants. */
export interface ConfigurableProduct {
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id: (Scalars['Int'] | null)
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url: (Scalars['String'] | null)
    /** The categories assigned to a product. */
    categories: ((CategoryInterface | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    color: (Scalars['Int'] | null)
    /** An array of options for the configurable product. */
    configurable_options: ((ConfigurableProductOptions | null)[] | null)
    /**
     * An array of media gallery items and other details about selected configurable
     * product options as well as details about remaining selectable options.
     */
    configurable_product_options_selection: (ConfigurableProductOptionsSelection | null)
    /** The product's country of origin. */
    country_of_manufacture: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at: (Scalars['String'] | null)
    /** Crosssell Products */
    crosssell_products: ((ProductInterface | null)[] | null)
    /** Product custom attributes. */
    custom_attributesV2: (ProductCustomAttributes | null)
    /** Detailed information about the product. The value can include simple HTML tags. */
    description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size: (Scalars['String'] | null)
    /** Indicates whether a gift message is available. */
    gift_message_available: (Scalars['String'] | null)
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id: (Scalars['Int'] | null)
    /** The relative path to the main image on the product page. */
    image: (ProductImage | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested: (Scalars['Int'] | null)
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer: (Scalars['Int'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2: (Scalars['Int'] | null)
    /** An array of media gallery objects. */
    media_gallery: ((MediaGalleryInterface | null)[] | null)
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries: ((MediaGalleryEntry | null)[] | null)
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description: (Scalars['String'] | null)
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword: (Scalars['String'] | null)
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title: (Scalars['String'] | null)
    /** The product name. Customers use this name to identify the product. */
    name: (Scalars['String'] | null)
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date: (Scalars['String'] | null)
    /** The end date for new product listings. */
    new_to_date: (Scalars['String'] | null)
    /** Product stock only x left count */
    only_x_left_in_stock: (Scalars['Float'] | null)
    /** An array of options for a customizable product. */
    options: ((CustomizableOptionInterface | null)[] | null)
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container: (Scalars['String'] | null)
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price: (ProductPrices | null)
    /** The range of prices for the product */
    price_range: PriceRange
    /** An array of `TierPrice` objects. */
    price_tiers: ((TierPrice | null)[] | null)
    /** An array of `ProductLinks` objects. */
    product_links: ((ProductLinksInterface | null)[] | null)
    /** The average of all the ratings given to the product. */
    rating_summary: Scalars['Float']
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code: Scalars['Int']
    /** An array of products to be displayed in a Related Products block. */
    related_products: ((ProductInterface | null)[] | null)
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    /** The total count of all the reviews given to the product. */
    review_count: Scalars['Int']
    /** The list of products reviews. */
    reviews: ProductReviews
    /** A short description of the product. Its use depends on the theme. */
    short_description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    size: (Scalars['Int'] | null)
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku: (Scalars['String'] | null)
    /** The relative path to the small image, which is used on catalog pages. */
    small_image: (ProductImage | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date: (Scalars['String'] | null)
    /** The discounted price of the product. */
    special_price: (Scalars['Float'] | null)
    /** The end date for a product with a special price. */
    special_to_date: (Scalars['String'] | null)
    /** Stock status of the product */
    stock_status: (ProductStockStatus | null)
    /** The file name of a swatch image. */
    swatch_image: (Scalars['String'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tema: (Scalars['Int'] | null)
    /** The relative path to the product's thumbnail image. */
    thumbnail: (ProductImage | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price: (Scalars['Float'] | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices: ((ProductTierPrices | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia: (Scalars['Int'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id: (Scalars['String'] | null)
    /** The unique ID for a `ProductInterface` object. */
    uid: Scalars['ID']
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at: (Scalars['String'] | null)
    /** Upsell Products */
    upsell_products: ((ProductInterface | null)[] | null)
    /** The part of the URL that identifies the product */
    url_key: (Scalars['String'] | null)
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path: (Scalars['String'] | null)
    /** URL rewrites list */
    url_rewrites: ((UrlRewrite | null)[] | null)
    /** The part of the product URL that is appended after the url key */
    url_suffix: (Scalars['String'] | null)
    /** An array of simple product variants. */
    variants: ((ConfigurableVariant | null)[] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites: ((Website | null)[] | null)
    /** The weight of the item, in units defined by the store. */
    weight: (Scalars['Float'] | null)
    __typename: 'ConfigurableProduct'
}


/** Contains details about configurable product options. */
export interface ConfigurableProductOption {
    /** An attribute code that uniquely identifies a configurable option. */
    attribute_code: Scalars['String']
    /** The display name of the option. */
    label: Scalars['String']
    /** The unique ID of the configurable option. */
    uid: Scalars['ID']
    /** An array of values that are applicable for this option. */
    values: ((ConfigurableProductOptionValue | null)[] | null)
    __typename: 'ConfigurableProductOption'
}


/** Defines configurable attributes for the specified product. */
export interface ConfigurableProductOptions {
    /** A string that identifies the attribute. */
    attribute_code: (Scalars['String'] | null)
    /**
     * @deprecated Use `attribute_uid` instead.
     * The ID assigned to the attribute.
     */
    attribute_id: (Scalars['String'] | null)
    /**
     * @deprecated Use `attribute_uid` instead.
     * The ID assigned to the attribute.
     */
    attribute_id_v2: (Scalars['Int'] | null)
    /** The unique ID for an `Attribute` object. */
    attribute_uid: Scalars['ID']
    /**
     * @deprecated Use `uid` instead.
     * The configurable option ID number assigned by the system.
     */
    id: (Scalars['Int'] | null)
    /** A displayed string that describes the configurable product option. */
    label: (Scalars['String'] | null)
    /** A number that indicates the order in which the attribute is displayed. */
    position: (Scalars['Int'] | null)
    /**
     * @deprecated `product_id` is not needed and can be obtained from its parent.
     * This is the same as a product's `id` field.
     */
    product_id: (Scalars['Int'] | null)
    /** The unique ID for a `ConfigurableProductOptions` object. */
    uid: Scalars['ID']
    /** Indicates whether the option is the default. */
    use_default: (Scalars['Boolean'] | null)
    /** An array that defines the `value_index` codes assigned to the configurable product. */
    values: ((ConfigurableProductOptionsValues | null)[] | null)
    __typename: 'ConfigurableProductOptions'
}


/** Contains metadata corresponding to the selected configurable options. */
export interface ConfigurableProductOptionsSelection {
    /** An array of all possible configurable options. */
    configurable_options: ((ConfigurableProductOption | null)[] | null)
    /** Product images and videos corresponding to the specified configurable options selection. */
    media_gallery: ((MediaGalleryInterface | null)[] | null)
    /** The configurable options available for further selection based on the current selection. */
    options_available_for_selection: ((ConfigurableOptionAvailableForSelection | null)[] | null)
    /**
     * A variant represented by the specified configurable options selection. The
     * value is expected to be null until selections are made for each configurable option.
     */
    variant: (SimpleProduct | null)
    __typename: 'ConfigurableProductOptionsSelection'
}


/** Contains the index number assigned to a configurable product option. */
export interface ConfigurableProductOptionsValues {
    /** The label of the product on the default store. */
    default_label: (Scalars['String'] | null)
    /** The label of the product. */
    label: (Scalars['String'] | null)
    /** The label of the product on the current store. */
    store_label: (Scalars['String'] | null)
    /** Swatch data for a configurable product option. */
    swatch_data: (SwatchDataInterface | null)
    /** The unique ID for a `ConfigurableProductOptionsValues` object. */
    uid: (Scalars['ID'] | null)
    /** Indicates whether to use the default_label. */
    use_default_value: (Scalars['Boolean'] | null)
    /**
     * @deprecated Use `uid` instead.
     * A unique index number assigned to the configurable product option.
     */
    value_index: (Scalars['Int'] | null)
    __typename: 'ConfigurableProductOptionsValues'
}


/** Defines a value for a configurable product option. */
export interface ConfigurableProductOptionValue {
    /** Indicates whether the product is available with this selected option. */
    is_available: Scalars['Boolean']
    /** Indicates whether the value is the default. */
    is_use_default: Scalars['Boolean']
    /** The display name of the value. */
    label: Scalars['String']
    /** The URL assigned to the thumbnail of the swatch image. */
    swatch: (SwatchDataInterface | null)
    /** The unique ID of the value. */
    uid: Scalars['ID']
    __typename: 'ConfigurableProductOptionValue'
}


/** Contains all the simple product variants of a configurable product. */
export interface ConfigurableVariant {
    /** An array of configurable attribute options. */
    attributes: ((ConfigurableAttributeOption | null)[] | null)
    /** An array of linked simple products. */
    product: (SimpleProduct | null)
    __typename: 'ConfigurableVariant'
}


/** A configurable product wish list item. */
export interface ConfigurableWishlistItem {
    /** The date and time the item was added to the wish list. */
    added_at: Scalars['String']
    /**
     * @deprecated Use `ConfigurableWishlistItem.configured_variant.sku` instead.
     * The SKU of the simple product corresponding to a set of selected configurable options.
     */
    child_sku: Scalars['String']
    /** An array of selected configurable options. */
    configurable_options: ((SelectedConfigurableOption | null)[] | null)
    /** Product details of the selected variant. The value is null if some options are not configured. */
    configured_variant: (ProductInterface | null)
    /** Custom options selected for the wish list item. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** The description of the item. */
    description: (Scalars['String'] | null)
    /** The unique ID for a `WishlistItemInterface` object. */
    id: Scalars['ID']
    /** Product details of the wish list item. */
    product: (ProductInterface | null)
    /** The quantity of this wish list item. */
    quantity: Scalars['Float']
    __typename: 'ConfigurableWishlistItem'
}


/** List of account confirmation statuses. */
export type ConfirmationStatusEnum = 'ACCOUNT_CONFIRMED' | 'ACCOUNT_CONFIRMATION_NOT_REQUIRED'


/** Contains the status of the request. */
export interface ContactUsOutput {
    /** Indicates whether the request was successful. */
    status: Scalars['Boolean']
    __typename: 'ContactUsOutput'
}

export interface Country {
    /** An array of regions within a particular country. */
    available_regions: ((Region | null)[] | null)
    /** The name of the country in English. */
    full_name_english: (Scalars['String'] | null)
    /** The name of the country in the current locale. */
    full_name_locale: (Scalars['String'] | null)
    /** The unique ID for a `Country` object. */
    id: (Scalars['String'] | null)
    /** The three-letter abbreviation of the country, such as USA. */
    three_letter_abbreviation: (Scalars['String'] | null)
    /** The two-letter abbreviation of the country, such as US. */
    two_letter_abbreviation: (Scalars['String'] | null)
    __typename: 'Country'
}


/** The list of country codes. */
export type CountryCodeEnum = 'AF' | 'AX' | 'AL' | 'DZ' | 'AS' | 'AD' | 'AO' | 'AI' | 'AQ' | 'AG' | 'AR' | 'AM' | 'AW' | 'AU' | 'AT' | 'AZ' | 'BS' | 'BH' | 'BD' | 'BB' | 'BY' | 'BE' | 'BZ' | 'BJ' | 'BM' | 'BT' | 'BO' | 'BA' | 'BW' | 'BV' | 'BR' | 'IO' | 'VG' | 'BN' | 'BG' | 'BF' | 'BI' | 'KH' | 'CM' | 'CA' | 'CV' | 'KY' | 'CF' | 'TD' | 'CL' | 'CN' | 'CX' | 'CC' | 'CO' | 'KM' | 'CG' | 'CD' | 'CK' | 'CR' | 'CI' | 'HR' | 'CU' | 'CY' | 'CZ' | 'DK' | 'DJ' | 'DM' | 'DO' | 'EC' | 'EG' | 'SV' | 'GQ' | 'ER' | 'EE' | 'SZ' | 'ET' | 'FK' | 'FO' | 'FJ' | 'FI' | 'FR' | 'GF' | 'PF' | 'TF' | 'GA' | 'GM' | 'GE' | 'DE' | 'GH' | 'GI' | 'GR' | 'GL' | 'GD' | 'GP' | 'GU' | 'GT' | 'GG' | 'GN' | 'GW' | 'GY' | 'HT' | 'HM' | 'HN' | 'HK' | 'HU' | 'IS' | 'IN' | 'ID' | 'IR' | 'IQ' | 'IE' | 'IM' | 'IL' | 'IT' | 'JM' | 'JP' | 'JE' | 'JO' | 'KZ' | 'KE' | 'KI' | 'KW' | 'KG' | 'LA' | 'LV' | 'LB' | 'LS' | 'LR' | 'LY' | 'LI' | 'LT' | 'LU' | 'MO' | 'MK' | 'MG' | 'MW' | 'MY' | 'MV' | 'ML' | 'MT' | 'MH' | 'MQ' | 'MR' | 'MU' | 'YT' | 'MX' | 'FM' | 'MD' | 'MC' | 'MN' | 'ME' | 'MS' | 'MA' | 'MZ' | 'MM' | 'NA' | 'NR' | 'NP' | 'NL' | 'AN' | 'NC' | 'NZ' | 'NI' | 'NE' | 'NG' | 'NU' | 'NF' | 'MP' | 'KP' | 'NO' | 'OM' | 'PK' | 'PW' | 'PS' | 'PA' | 'PG' | 'PY' | 'PE' | 'PH' | 'PN' | 'PL' | 'PT' | 'QA' | 'RE' | 'RO' | 'RU' | 'RW' | 'WS' | 'SM' | 'ST' | 'SA' | 'SN' | 'RS' | 'SC' | 'SL' | 'SG' | 'SK' | 'SI' | 'SB' | 'SO' | 'ZA' | 'GS' | 'KR' | 'ES' | 'LK' | 'BL' | 'SH' | 'KN' | 'LC' | 'MF' | 'PM' | 'VC' | 'SD' | 'SR' | 'SJ' | 'SE' | 'CH' | 'SY' | 'TW' | 'TJ' | 'TZ' | 'TH' | 'TL' | 'TG' | 'TK' | 'TO' | 'TT' | 'TN' | 'TR' | 'TM' | 'TC' | 'TV' | 'UG' | 'UA' | 'AE' | 'GB' | 'US' | 'UY' | 'UM' | 'VI' | 'UZ' | 'VU' | 'VA' | 'VE' | 'VN' | 'WF' | 'EH' | 'YE' | 'ZM' | 'ZW'

export interface CreateGuestCartOutput {
    /** The newly created cart. */
    cart: (Cart | null)
    __typename: 'CreateGuestCartOutput'
}


/** Contains the secure information used to authorize transaction. Applies to Payflow Pro and Payments Pro payment methods. */
export interface CreatePayflowProTokenOutput {
    /** The RESPMSG returned by PayPal. If the `result` is `0`, then `response_message` is `Approved`. */
    response_message: Scalars['String']
    /** A non-zero value if any errors occurred. */
    result: Scalars['Int']
    /** The RESULT returned by PayPal. A value of `0` indicates the transaction was approved. */
    result_code: Scalars['Int']
    /** A secure token generated by PayPal. */
    secure_token: Scalars['String']
    /** A secure token ID generated by PayPal. */
    secure_token_id: Scalars['String']
    __typename: 'CreatePayflowProTokenOutput'
}


/** Contains payment order details that are used while processing the payment order */
export interface CreatePaymentOrderOutput {
    /** The amount of the payment order */
    amount: (Scalars['Float'] | null)
    /** The currency of the payment order */
    currency_code: (Scalars['String'] | null)
    /** PayPal order ID */
    id: (Scalars['String'] | null)
    /** The order ID generated by Payment Services */
    mp_order_id: (Scalars['String'] | null)
    /** The status of the payment order */
    status: (Scalars['String'] | null)
    __typename: 'CreatePaymentOrderOutput'
}


/** Contains the completed product review. */
export interface CreateProductReviewOutput {
    /** Product review details. */
    review: ProductReview
    __typename: 'CreateProductReviewOutput'
}


/** The vault token id and information about the payment source */
export interface CreateVaultCardPaymentTokenOutput {
    /** The payment source information */
    payment_source: PaymentSourceOutput
    /** The vault payment token information */
    vault_token_id: Scalars['String']
    __typename: 'CreateVaultCardPaymentTokenOutput'
}


/** The setup token id information */
export interface CreateVaultCardSetupTokenOutput {
    /** The setup token id */
    setup_token: Scalars['String']
    __typename: 'CreateVaultCardSetupTokenOutput'
}


/** Contains credit memo details. */
export interface CreditMemo {
    /** Comments on the credit memo. */
    comments: ((SalesCommentItem | null)[] | null)
    /** The unique ID for a `CreditMemo` object. */
    id: Scalars['ID']
    /** An array containing details about refunded items. */
    items: ((CreditMemoItemInterface | null)[] | null)
    /** The sequential credit memo number. */
    number: Scalars['String']
    /** Details about the total refunded amount. */
    total: (CreditMemoTotal | null)
    __typename: 'CreditMemo'
}

export interface CreditMemoItem {
    /** Details about the final discount amount for the base product, including discounts on options. */
    discounts: ((Discount | null)[] | null)
    /** The unique ID for a `CreditMemoItemInterface` object. */
    id: Scalars['ID']
    /** The order item the credit memo is applied to. */
    order_item: (OrderItemInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price for the base product, including selected options. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The number of refunded items. */
    quantity_refunded: (Scalars['Float'] | null)
    __typename: 'CreditMemoItem'
}


/** Credit memo item details. */
export type CreditMemoItemInterface = (BundleCreditMemoItem | CreditMemoItem | DownloadableCreditMemoItem) & { __isUnion?: true }


/** Contains credit memo price details. */
export interface CreditMemoTotal {
    /** An adjustment manually applied to the order. */
    adjustment: Money
    /** The final base grand total amount in the base currency. */
    base_grand_total: Money
    /** The applied discounts to the credit memo. */
    discounts: ((Discount | null)[] | null)
    /** The final total amount, including shipping, discounts, and taxes. */
    grand_total: Money
    /** Details about the shipping and handling costs for the credit memo. */
    shipping_handling: (ShippingHandling | null)
    /** The subtotal of the invoice, excluding shipping, discounts, and taxes. */
    subtotal: Money
    /** The credit memo tax details. */
    taxes: ((TaxItem | null)[] | null)
    /** The shipping amount for the credit memo. */
    total_shipping: Money
    /** The amount of tax applied to the credit memo. */
    total_tax: Money
    __typename: 'CreditMemoTotal'
}

export interface Currency {
    /** An array of three-letter currency codes accepted by the store, such as USD and EUR. */
    available_currency_codes: ((Scalars['String'] | null)[] | null)
    /** The base currency set for the store, such as USD. */
    base_currency_code: (Scalars['String'] | null)
    /** The symbol for the specified base currency, such as $. */
    base_currency_symbol: (Scalars['String'] | null)
    /** @deprecated Symbol was missed. Use `default_display_currency_code`. */
    default_display_currecy_code: (Scalars['String'] | null)
    /** @deprecated Symbol was missed. Use `default_display_currency_code`. */
    default_display_currecy_symbol: (Scalars['String'] | null)
    /** The currency that is displayed by default, such as USD. */
    default_display_currency_code: (Scalars['String'] | null)
    /** The currency symbol that is displayed by default, such as $. */
    default_display_currency_symbol: (Scalars['String'] | null)
    /** An array of exchange rates for currencies defined in the store. */
    exchange_rates: ((ExchangeRate | null)[] | null)
    __typename: 'Currency'
}


/** The list of available currency codes. */
export type CurrencyEnum = 'AFN' | 'ALL' | 'AZN' | 'DZD' | 'AOA' | 'ARS' | 'AMD' | 'AWG' | 'AUD' | 'BSD' | 'BHD' | 'BDT' | 'BBD' | 'BYN' | 'BZD' | 'BMD' | 'BTN' | 'BOB' | 'BAM' | 'BWP' | 'BRL' | 'GBP' | 'BND' | 'BGN' | 'BUK' | 'BIF' | 'KHR' | 'CAD' | 'CVE' | 'CZK' | 'KYD' | 'GQE' | 'CLP' | 'CNY' | 'COP' | 'KMF' | 'CDF' | 'CRC' | 'HRK' | 'CUP' | 'DKK' | 'DJF' | 'DOP' | 'XCD' | 'EGP' | 'SVC' | 'ERN' | 'EEK' | 'ETB' | 'EUR' | 'FKP' | 'FJD' | 'GMD' | 'GEK' | 'GEL' | 'GHS' | 'GIP' | 'GTQ' | 'GNF' | 'GYD' | 'HTG' | 'HNL' | 'HKD' | 'HUF' | 'ISK' | 'INR' | 'IDR' | 'IRR' | 'IQD' | 'ILS' | 'JMD' | 'JPY' | 'JOD' | 'KZT' | 'KES' | 'KWD' | 'KGS' | 'LAK' | 'LVL' | 'LBP' | 'LSL' | 'LRD' | 'LYD' | 'LTL' | 'MOP' | 'MKD' | 'MGA' | 'MWK' | 'MYR' | 'MVR' | 'LSM' | 'MRO' | 'MUR' | 'MXN' | 'MDL' | 'MNT' | 'MAD' | 'MZN' | 'MMK' | 'NAD' | 'NPR' | 'ANG' | 'YTL' | 'NZD' | 'NIC' | 'NGN' | 'KPW' | 'NOK' | 'OMR' | 'PKR' | 'PAB' | 'PGK' | 'PYG' | 'PEN' | 'PHP' | 'PLN' | 'QAR' | 'RHD' | 'RON' | 'RUB' | 'RWF' | 'SHP' | 'STD' | 'SAR' | 'RSD' | 'SCR' | 'SLL' | 'SGD' | 'SKK' | 'SBD' | 'SOS' | 'ZAR' | 'KRW' | 'LKR' | 'SDG' | 'SRD' | 'SZL' | 'SEK' | 'CHF' | 'SYP' | 'TWD' | 'TJS' | 'TZS' | 'THB' | 'TOP' | 'TTD' | 'TND' | 'TMM' | 'USD' | 'UGX' | 'UAH' | 'AED' | 'UYU' | 'UZS' | 'VUV' | 'VEB' | 'VEF' | 'VND' | 'CHE' | 'CHW' | 'XOF' | 'WST' | 'YER' | 'ZMK' | 'ZWD' | 'TRY' | 'AZM' | 'ROL' | 'TRL' | 'XPF'


/** Defines an array of custom attributes. */
export interface CustomAttributeMetadata {
    /** An array of attributes. */
    items: ((Attribute | null)[] | null)
    __typename: 'CustomAttributeMetadata'
}


/** An interface containing fields that define the EAV attribute. */
export type CustomAttributeMetadataInterface = (AttributeMetadata | CatalogAttributeMetadata | CustomerAttributeMetadata) & { __isUnion?: true }

export type CustomAttributeOptionInterface = (AttributeOptionMetadata) & { __isUnion?: true }


/** Defines the customer name, addresses, and other details. */
export interface Customer {
    /** An array containing the customer's shipping and billing addresses. */
    addresses: ((CustomerAddress | null)[] | null)
    /** Indicates whether the customer has enabled remote shopping assistance. */
    allow_remote_shopping_assistance: Scalars['Boolean']
    /** The contents of the customer's compare list. */
    compare_list: (CompareList | null)
    /** The customer's confirmation status. */
    confirmation_status: ConfirmationStatusEnum
    /** Timestamp indicating when the account was created. */
    created_at: (Scalars['String'] | null)
    /** Customer's custom attributes. */
    custom_attributes: ((AttributeValueInterface | null)[] | null)
    /** The customer's date of birth. */
    date_of_birth: (Scalars['String'] | null)
    /** The ID assigned to the billing address. */
    default_billing: (Scalars['String'] | null)
    /** The ID assigned to the shipping address. */
    default_shipping: (Scalars['String'] | null)
    /**
     * @deprecated Use `date_of_birth` instead.
     * The customer's date of birth.
     */
    dob: (Scalars['String'] | null)
    /** The customer's email address. Required. */
    email: (Scalars['String'] | null)
    /** The customer's first name. */
    firstname: (Scalars['String'] | null)
    /** The customer's gender (Male - 1, Female - 2). */
    gender: (Scalars['Int'] | null)
    /** @deprecated Customer group should not be exposed in the storefront scenarios. */
    group_id: (Scalars['Int'] | null)
    /**
     * @deprecated `id` is not needed as part of `Customer`, because on the server side, it can be identified based on the customer token used for authentication. There is no need to know customer ID on the client side.
     * The ID assigned to the customer.
     */
    id: (Scalars['Int'] | null)
    /** Indicates whether the customer is subscribed to the company's newsletter. */
    is_subscribed: (Scalars['Boolean'] | null)
    /** The customer's family name. */
    lastname: (Scalars['String'] | null)
    /** The customer's middle name. */
    middlename: (Scalars['String'] | null)
    orders: (CustomerOrders | null)
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix: (Scalars['String'] | null)
    /** Contains the customer's product reviews. */
    reviews: ProductReviews
    /** A value such as Sr., Jr., or III. */
    suffix: (Scalars['String'] | null)
    /** The customer's Value-added tax (VAT) number (for corporate customers). */
    taxvat: (Scalars['String'] | null)
    /**
     * @deprecated Use `Customer.wishlists` or `Customer.wishlist_v2` instead.
     * Return a customer's wish lists.
     */
    wishlist: Wishlist
    /** Retrieve the wish list identified by the unique ID for a `Wishlist` object. */
    wishlist_v2: (Wishlist | null)
    /**
     * An array of wishlists. In Magento Open Source, customers are limited to one
     * wish list. The number of wish lists is configurable for Adobe Commerce.
     */
    wishlists: (Wishlist | null)[]
    __typename: 'Customer'
}


/** Contains detailed information about a customer's billing or shipping address. */
export interface CustomerAddress {
    /** The customer's city or town. */
    city: (Scalars['String'] | null)
    /** The customer's company. */
    company: (Scalars['String'] | null)
    /** The customer's country. */
    country_code: (CountryCodeEnum | null)
    /**
     * @deprecated Use `country_code` instead.
     * The customer's country.
     */
    country_id: (Scalars['String'] | null)
    /** @deprecated Use custom_attributesV2 instead. */
    custom_attributes: ((CustomerAddressAttribute | null)[] | null)
    /** Custom attributes assigned to the customer address. */
    custom_attributesV2: (AttributeValueInterface | null)[]
    /**
     * @deprecated `customer_id` is not needed as part of `CustomerAddress`. The `id` is a unique identifier for the addresses.
     * The customer ID
     */
    customer_id: (Scalars['Int'] | null)
    /** Indicates whether the address is the customer's default billing address. */
    default_billing: (Scalars['Boolean'] | null)
    /** Indicates whether the address is the customer's default shipping address. */
    default_shipping: (Scalars['Boolean'] | null)
    /** Contains any extension attributes for the address. */
    extension_attributes: ((CustomerAddressAttribute | null)[] | null)
    /** The customer's fax number. */
    fax: (Scalars['String'] | null)
    /** The first name of the person associated with the shipping/billing address. */
    firstname: (Scalars['String'] | null)
    /** The ID of a `CustomerAddress` object. */
    id: (Scalars['Int'] | null)
    /** The family name of the person associated with the shipping/billing address. */
    lastname: (Scalars['String'] | null)
    /** The middle name of the person associated with the shipping/billing address. */
    middlename: (Scalars['String'] | null)
    /** The customer's ZIP or postal code. */
    postcode: (Scalars['String'] | null)
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix: (Scalars['String'] | null)
    /** An object containing the region name, region code, and region ID. */
    region: (CustomerAddressRegion | null)
    /** The unique ID for a pre-defined region. */
    region_id: (Scalars['Int'] | null)
    /** An array of strings that define the street number and name. */
    street: ((Scalars['String'] | null)[] | null)
    /** A value such as Sr., Jr., or III. */
    suffix: (Scalars['String'] | null)
    /** The customer's telephone number. */
    telephone: (Scalars['String'] | null)
    /** The customer's Value-added tax (VAT) number (for corporate customers). */
    vat_id: (Scalars['String'] | null)
    __typename: 'CustomerAddress'
}


/** Specifies the attribute code and value of a customer address attribute. */
export interface CustomerAddressAttribute {
    /** The name assigned to the customer address attribute. */
    attribute_code: (Scalars['String'] | null)
    /** The value assigned to the customer address attribute. */
    value: (Scalars['String'] | null)
    __typename: 'CustomerAddressAttribute'
}


/** Defines the customer's state or province. */
export interface CustomerAddressRegion {
    /** The state or province name. */
    region: (Scalars['String'] | null)
    /** The address region code. */
    region_code: (Scalars['String'] | null)
    /** The unique ID for a pre-defined region. */
    region_id: (Scalars['Int'] | null)
    __typename: 'CustomerAddressRegion'
}


/** Customer attribute metadata. */
export interface CustomerAttributeMetadata {
    /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
    code: Scalars['ID']
    /** Default attribute value. */
    default_value: (Scalars['String'] | null)
    /** The type of entity that defines the attribute. */
    entity_type: AttributeEntityTypeEnum
    /** The frontend class of the attribute. */
    frontend_class: (Scalars['String'] | null)
    /** The frontend input type of the attribute. */
    frontend_input: (AttributeFrontendInputEnum | null)
    /** The template used for the input of the attribute (e.g., 'date'). */
    input_filter: (InputFilterEnum | null)
    /** Whether the attribute value is required. */
    is_required: Scalars['Boolean']
    /** Whether the attribute value must be unique. */
    is_unique: Scalars['Boolean']
    /** The label assigned to the attribute. */
    label: (Scalars['String'] | null)
    /** The number of lines of the attribute value. */
    multiline_count: (Scalars['Int'] | null)
    /** Attribute options. */
    options: (CustomAttributeOptionInterface | null)[]
    /** The position of the attribute in the form. */
    sort_order: (Scalars['Int'] | null)
    /** The validation rules of the attribute value. */
    validate_rules: ((ValidationRule | null)[] | null)
    __typename: 'CustomerAttributeMetadata'
}


/** Contains details about a single downloadable product. */
export interface CustomerDownloadableProduct {
    /** The date and time the purchase was made. */
    date: (Scalars['String'] | null)
    /** The fully qualified URL to the download file. */
    download_url: (Scalars['String'] | null)
    /** The unique ID assigned to the item. */
    order_increment_id: (Scalars['String'] | null)
    /** The remaining number of times the customer can download the product. */
    remaining_downloads: (Scalars['String'] | null)
    /** Indicates when the product becomes available for download. Options are `Pending` and `Invoiced`. */
    status: (Scalars['String'] | null)
    __typename: 'CustomerDownloadableProduct'
}


/** Contains a list of downloadable products. */
export interface CustomerDownloadableProducts {
    /** An array of purchased downloadable items. */
    items: ((CustomerDownloadableProduct | null)[] | null)
    __typename: 'CustomerDownloadableProducts'
}


/** Contains details about each of the customer's orders. */
export interface CustomerOrder {
    /** Coupons applied to the order. */
    applied_coupons: (AppliedCoupon | null)[]
    /** The billing address for the order. */
    billing_address: (OrderAddress | null)
    /** The shipping carrier for the order delivery. */
    carrier: (Scalars['String'] | null)
    /** Comments about the order. */
    comments: ((SalesCommentItem | null)[] | null)
    /** @deprecated Use the `order_date` field instead. */
    created_at: (Scalars['String'] | null)
    /** A list of credit memos. */
    credit_memos: ((CreditMemo | null)[] | null)
    /** Order customer email. */
    email: (Scalars['String'] | null)
    /** The entered gift message for the order */
    gift_message: (GiftMessage | null)
    /** @deprecated Use the `totals.grand_total` field instead. */
    grand_total: (Scalars['Float'] | null)
    /** The unique ID for a `CustomerOrder` object. */
    id: Scalars['ID']
    /** @deprecated Use the `id` field instead. */
    increment_id: (Scalars['String'] | null)
    /** A list of invoices for the order. */
    invoices: (Invoice | null)[]
    /** An array containing the items purchased in this order. */
    items: ((OrderItemInterface | null)[] | null)
    /** The order number. */
    number: Scalars['String']
    /** The date the order was placed. */
    order_date: Scalars['String']
    /** @deprecated Use the `number` field instead. */
    order_number: Scalars['String']
    /** Payment details for the order. */
    payment_methods: ((OrderPaymentMethod | null)[] | null)
    /** A list of shipments for the order. */
    shipments: ((OrderShipment | null)[] | null)
    /** The shipping address for the order. */
    shipping_address: (OrderAddress | null)
    /** The delivery method for the order. */
    shipping_method: (Scalars['String'] | null)
    /** The current status of the order. */
    status: Scalars['String']
    /** The token that can be used to retrieve the order using order query. */
    token: Scalars['String']
    /** Details about the calculated totals for this order. */
    total: (OrderTotal | null)
    __typename: 'CustomerOrder'
}


/** The collection of orders that match the conditions defined in the filter. */
export interface CustomerOrders {
    /** An array of customer orders. */
    items: (CustomerOrder | null)[]
    /** Contains pagination metadata. */
    page_info: (SearchResultPageInfo | null)
    /** The total count of customer orders. */
    total_count: (Scalars['Int'] | null)
    __typename: 'CustomerOrders'
}


/** Specifies the field to use for sorting */
export type CustomerOrderSortableField = 'NUMBER' | 'CREATED_AT'


/** Contains details about a newly-created or updated customer. */
export interface CustomerOutput {
    /** Customer details after creating or updating a customer. */
    customer: Customer
    __typename: 'CustomerOutput'
}


/** Contains payment tokens stored in the customer's vault. */
export interface CustomerPaymentTokens {
    /** An array of payment tokens. */
    items: (PaymentToken | null)[]
    __typename: 'CustomerPaymentTokens'
}


/** Contains a customer authorization token. */
export interface CustomerToken {
    /** The customer authorization token. */
    token: (Scalars['String'] | null)
    __typename: 'CustomerToken'
}


/** Contains information about a text area that is defined as part of a customizable option. */
export interface CustomizableAreaOption {
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id: (Scalars['Int'] | null)
    /** The Stock Keeping Unit of the base product. */
    product_sku: (Scalars['String'] | null)
    /** Indicates whether the option is required. */
    required: (Scalars['Boolean'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid: Scalars['ID']
    /** An object that defines a text area. */
    value: (CustomizableAreaValue | null)
    __typename: 'CustomizableAreaOption'
}


/** Defines the price and sku of a product whose page contains a customized text area. */
export interface CustomizableAreaValue {
    /** The maximum number of characters that can be entered for this customizable option. */
    max_characters: (Scalars['Int'] | null)
    /** The price assigned to this option. */
    price: (Scalars['Float'] | null)
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type: (PriceTypeEnum | null)
    /** The Stock Keeping Unit for this option. */
    sku: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableAreaValue` object. */
    uid: Scalars['ID']
    __typename: 'CustomizableAreaValue'
}


/** Contains information about a set of checkbox values that are defined as part of a customizable option. */
export interface CustomizableCheckboxOption {
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id: (Scalars['Int'] | null)
    /** Indicates whether the option is required. */
    required: (Scalars['Boolean'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid: Scalars['ID']
    /** An array that defines a set of checkbox values. */
    value: ((CustomizableCheckboxValue | null)[] | null)
    __typename: 'CustomizableCheckboxOption'
}


/** Defines the price and sku of a product whose page contains a customized set of checkbox values. */
export interface CustomizableCheckboxValue {
    /** The ID assigned to the value. */
    option_type_id: (Scalars['Int'] | null)
    /** The price assigned to this option. */
    price: (Scalars['Float'] | null)
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type: (PriceTypeEnum | null)
    /** The Stock Keeping Unit for this option. */
    sku: (Scalars['String'] | null)
    /** The order in which the checkbox value is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableCheckboxValue` object. */
    uid: Scalars['ID']
    __typename: 'CustomizableCheckboxValue'
}


/** Contains information about a date picker that is defined as part of a customizable option. */
export interface CustomizableDateOption {
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id: (Scalars['Int'] | null)
    /** The Stock Keeping Unit of the base product. */
    product_sku: (Scalars['String'] | null)
    /** Indicates whether the option is required. */
    required: (Scalars['Boolean'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid: Scalars['ID']
    /** An object that defines a date field in a customizable option. */
    value: (CustomizableDateValue | null)
    __typename: 'CustomizableDateOption'
}


/** Defines the customizable date type. */
export type CustomizableDateTypeEnum = 'DATE' | 'DATE_TIME' | 'TIME'


/** Defines the price and sku of a product whose page contains a customized date picker. */
export interface CustomizableDateValue {
    /** The price assigned to this option. */
    price: (Scalars['Float'] | null)
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type: (PriceTypeEnum | null)
    /** The Stock Keeping Unit for this option. */
    sku: (Scalars['String'] | null)
    /** DATE, DATE_TIME or TIME */
    type: (CustomizableDateTypeEnum | null)
    /** The unique ID for a `CustomizableDateValue` object. */
    uid: Scalars['ID']
    __typename: 'CustomizableDateValue'
}


/** Contains information about a drop down menu that is defined as part of a customizable option. */
export interface CustomizableDropDownOption {
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id: (Scalars['Int'] | null)
    /** Indicates whether the option is required. */
    required: (Scalars['Boolean'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid: Scalars['ID']
    /** An array that defines the set of options for a drop down menu. */
    value: ((CustomizableDropDownValue | null)[] | null)
    __typename: 'CustomizableDropDownOption'
}


/** Defines the price and sku of a product whose page contains a customized drop down menu. */
export interface CustomizableDropDownValue {
    /** The ID assigned to the value. */
    option_type_id: (Scalars['Int'] | null)
    /** The price assigned to this option. */
    price: (Scalars['Float'] | null)
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type: (PriceTypeEnum | null)
    /** The Stock Keeping Unit for this option. */
    sku: (Scalars['String'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableDropDownValue` object. */
    uid: Scalars['ID']
    __typename: 'CustomizableDropDownValue'
}


/** Contains information about a text field that is defined as part of a customizable option. */
export interface CustomizableFieldOption {
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id: (Scalars['Int'] | null)
    /** The Stock Keeping Unit of the base product. */
    product_sku: (Scalars['String'] | null)
    /** Indicates whether the option is required. */
    required: (Scalars['Boolean'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid: Scalars['ID']
    /** An object that defines a text field. */
    value: (CustomizableFieldValue | null)
    __typename: 'CustomizableFieldOption'
}


/** Defines the price and sku of a product whose page contains a customized text field. */
export interface CustomizableFieldValue {
    /** The maximum number of characters that can be entered for this customizable option. */
    max_characters: (Scalars['Int'] | null)
    /** The price of the custom value. */
    price: (Scalars['Float'] | null)
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type: (PriceTypeEnum | null)
    /** The Stock Keeping Unit for this option. */
    sku: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableFieldValue` object. */
    uid: Scalars['ID']
    __typename: 'CustomizableFieldValue'
}


/** Contains information about a file picker that is defined as part of a customizable option. */
export interface CustomizableFileOption {
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id: (Scalars['Int'] | null)
    /** The Stock Keeping Unit of the base product. */
    product_sku: (Scalars['String'] | null)
    /** Indicates whether the option is required. */
    required: (Scalars['Boolean'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid: Scalars['ID']
    /** An object that defines a file value. */
    value: (CustomizableFileValue | null)
    __typename: 'CustomizableFileOption'
}


/** Defines the price and sku of a product whose page contains a customized file picker. */
export interface CustomizableFileValue {
    /** The file extension to accept. */
    file_extension: (Scalars['String'] | null)
    /** The maximum width of an image. */
    image_size_x: (Scalars['Int'] | null)
    /** The maximum height of an image. */
    image_size_y: (Scalars['Int'] | null)
    /** The price assigned to this option. */
    price: (Scalars['Float'] | null)
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type: (PriceTypeEnum | null)
    /** The Stock Keeping Unit for this option. */
    sku: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableFileValue` object. */
    uid: Scalars['ID']
    __typename: 'CustomizableFileValue'
}


/** Contains information about a multiselect that is defined as part of a customizable option. */
export interface CustomizableMultipleOption {
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id: (Scalars['Int'] | null)
    /** Indicates whether the option is required. */
    required: (Scalars['Boolean'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid: Scalars['ID']
    /** An array that defines the set of options for a multiselect. */
    value: ((CustomizableMultipleValue | null)[] | null)
    __typename: 'CustomizableMultipleOption'
}


/** Defines the price and sku of a product whose page contains a customized multiselect. */
export interface CustomizableMultipleValue {
    /** The ID assigned to the value. */
    option_type_id: (Scalars['Int'] | null)
    /** The price assigned to this option. */
    price: (Scalars['Float'] | null)
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type: (PriceTypeEnum | null)
    /** The Stock Keeping Unit for this option. */
    sku: (Scalars['String'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableMultipleValue` object. */
    uid: Scalars['ID']
    __typename: 'CustomizableMultipleValue'
}


/** Contains basic information about a customizable option. It can be implemented by several types of configurable options. */
export type CustomizableOptionInterface = (CustomizableAreaOption | CustomizableCheckboxOption | CustomizableDateOption | CustomizableDropDownOption | CustomizableFieldOption | CustomizableFileOption | CustomizableMultipleOption | CustomizableRadioOption) & { __isUnion?: true }


/** Contains information about customizable product options. */
export type CustomizableProductInterface = (BundleProduct | ConfigurableProduct | DownloadableProduct | SimpleProduct | VirtualProduct) & { __isUnion?: true }


/** Contains information about a set of radio buttons that are defined as part of a customizable option. */
export interface CustomizableRadioOption {
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id: (Scalars['Int'] | null)
    /** Indicates whether the option is required. */
    required: (Scalars['Boolean'] | null)
    /** The order in which the option is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid: Scalars['ID']
    /** An array that defines a set of radio buttons. */
    value: ((CustomizableRadioValue | null)[] | null)
    __typename: 'CustomizableRadioOption'
}


/** Defines the price and sku of a product whose page contains a customized set of radio buttons. */
export interface CustomizableRadioValue {
    /** The ID assigned to the value. */
    option_type_id: (Scalars['Int'] | null)
    /** The price assigned to this option. */
    price: (Scalars['Float'] | null)
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type: (PriceTypeEnum | null)
    /** The Stock Keeping Unit for this option. */
    sku: (Scalars['String'] | null)
    /** The order in which the radio button is displayed. */
    sort_order: (Scalars['Int'] | null)
    /** The display name for this option. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `CustomizableRadioValue` object. */
    uid: Scalars['ID']
    __typename: 'CustomizableRadioValue'
}


/** Contains the results of the request to delete a compare list. */
export interface DeleteCompareListOutput {
    /** Indicates whether the compare list was successfully deleted. */
    result: Scalars['Boolean']
    __typename: 'DeleteCompareListOutput'
}


/** Indicates whether the request succeeded and returns the remaining customer payment tokens. */
export interface DeletePaymentTokenOutput {
    /** A container for the customer's remaining payment tokens. */
    customerPaymentTokens: (CustomerPaymentTokens | null)
    /** Indicates whether the request succeeded. */
    result: Scalars['Boolean']
    __typename: 'DeletePaymentTokenOutput'
}


/** Defines an individual discount. A discount can be applied to the cart as a whole or to an item, shipping. */
export interface Discount {
    /** The amount of the discount. */
    amount: Money
    /** The type of the entity the discount is applied to. */
    applied_to: CartDiscountType
    /** The coupon related to the discount. */
    coupon: (AppliedCoupon | null)
    /** A description of the discount. */
    label: Scalars['String']
    __typename: 'Discount'
}


/** An implementation for downloadable product cart items. */
export interface DownloadableCartItem {
    /** An array containing the customizable options the shopper selected. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** An array of errors encountered while loading the cart item */
    errors: ((CartItemError | null)[] | null)
    /** @deprecated Use `uid` instead. */
    id: Scalars['String']
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available: Scalars['Boolean']
    /** An array containing information about the links for the downloadable product added to the cart. */
    links: ((DownloadableProductLinks | null)[] | null)
    /** Contains details about the price of the item, including taxes and discounts. */
    prices: (CartItemPrices | null)
    /** Details about an item in the cart. */
    product: ProductInterface
    /** The quantity of this item in the cart. */
    quantity: Scalars['Float']
    /** An array containing information about samples of the selected downloadable product. */
    samples: ((DownloadableProductSamples | null)[] | null)
    /** The unique ID for a `CartItemInterface` object. */
    uid: Scalars['ID']
    __typename: 'DownloadableCartItem'
}


/** Defines downloadable product options for `CreditMemoItemInterface`. */
export interface DownloadableCreditMemoItem {
    /** Details about the final discount amount for the base product, including discounts on options. */
    discounts: ((Discount | null)[] | null)
    /** A list of downloadable links that are refunded from the downloadable product. */
    downloadable_links: ((DownloadableItemsLinks | null)[] | null)
    /** The unique ID for a `CreditMemoItemInterface` object. */
    id: Scalars['ID']
    /** The order item the credit memo is applied to. */
    order_item: (OrderItemInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price for the base product, including selected options. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The number of refunded items. */
    quantity_refunded: (Scalars['Float'] | null)
    __typename: 'DownloadableCreditMemoItem'
}

export type DownloadableFileTypeEnum = 'FILE' | 'URL'


/** Defines downloadable product options for `InvoiceItemInterface`. */
export interface DownloadableInvoiceItem {
    /** Information about the final discount amount for the base product, including discounts on options. */
    discounts: ((Discount | null)[] | null)
    /** A list of downloadable links that are invoiced from the downloadable product. */
    downloadable_links: ((DownloadableItemsLinks | null)[] | null)
    /** The unique ID for an `InvoiceItemInterface` object. */
    id: Scalars['ID']
    /** Details about an individual order item. */
    order_item: (OrderItemInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price for the base product including selected options. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The number of invoiced items. */
    quantity_invoiced: (Scalars['Float'] | null)
    __typename: 'DownloadableInvoiceItem'
}


/** Defines characteristics of the links for downloadable product. */
export interface DownloadableItemsLinks {
    /** A number indicating the sort order. */
    sort_order: (Scalars['Int'] | null)
    /** The display name of the link. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `DownloadableItemsLinks` object. */
    uid: Scalars['ID']
    __typename: 'DownloadableItemsLinks'
}


/** Defines downloadable product options for `OrderItemInterface`. */
export interface DownloadableOrderItem {
    /** The final discount information for the product. */
    discounts: ((Discount | null)[] | null)
    /** A list of downloadable links that are ordered from the downloadable product. */
    downloadable_links: ((DownloadableItemsLinks | null)[] | null)
    /** The entered option for the base product, such as a logo or image. */
    entered_options: ((OrderItemOption | null)[] | null)
    /** The selected gift message for the order item */
    gift_message: (GiftMessage | null)
    /** The unique ID for an `OrderItemInterface` object. */
    id: Scalars['ID']
    /** The ProductInterface object, which contains details about the base product */
    product: (ProductInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price of the base product, including selected options. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The type of product, such as simple, configurable, etc. */
    product_type: (Scalars['String'] | null)
    /** URL key of the base product. */
    product_url_key: (Scalars['String'] | null)
    /** The number of canceled items. */
    quantity_canceled: (Scalars['Float'] | null)
    /** The number of invoiced items. */
    quantity_invoiced: (Scalars['Float'] | null)
    /** The number of units ordered for this item. */
    quantity_ordered: (Scalars['Float'] | null)
    /** The number of refunded items. */
    quantity_refunded: (Scalars['Float'] | null)
    /** The number of returned items. */
    quantity_returned: (Scalars['Float'] | null)
    /** The number of shipped items. */
    quantity_shipped: (Scalars['Float'] | null)
    /** The selected options for the base product, such as color or size. */
    selected_options: ((OrderItemOption | null)[] | null)
    /** The status of the order item. */
    status: (Scalars['String'] | null)
    __typename: 'DownloadableOrderItem'
}


/** Defines a product that the shopper downloads. */
export interface DownloadableProduct {
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id: (Scalars['Int'] | null)
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url: (Scalars['String'] | null)
    /** The categories assigned to a product. */
    categories: ((CategoryInterface | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    color: (Scalars['Int'] | null)
    /** The product's country of origin. */
    country_of_manufacture: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at: (Scalars['String'] | null)
    /** Crosssell Products */
    crosssell_products: ((ProductInterface | null)[] | null)
    /** Product custom attributes. */
    custom_attributesV2: (ProductCustomAttributes | null)
    /** Detailed information about the product. The value can include simple HTML tags. */
    description: (ComplexTextValue | null)
    /** An array containing information about the links for this downloadable product. */
    downloadable_product_links: ((DownloadableProductLinks | null)[] | null)
    /** An array containing information about samples of this downloadable product. */
    downloadable_product_samples: ((DownloadableProductSamples | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size: (Scalars['String'] | null)
    /** Indicates whether a gift message is available. */
    gift_message_available: (Scalars['String'] | null)
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id: (Scalars['Int'] | null)
    /** The relative path to the main image on the product page. */
    image: (ProductImage | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested: (Scalars['Int'] | null)
    /** A value of 1 indicates that each link in the array must be purchased separately. */
    links_purchased_separately: (Scalars['Int'] | null)
    /** The heading above the list of downloadable products. */
    links_title: (Scalars['String'] | null)
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer: (Scalars['Int'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2: (Scalars['Int'] | null)
    /** An array of media gallery objects. */
    media_gallery: ((MediaGalleryInterface | null)[] | null)
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries: ((MediaGalleryEntry | null)[] | null)
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description: (Scalars['String'] | null)
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword: (Scalars['String'] | null)
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title: (Scalars['String'] | null)
    /** The product name. Customers use this name to identify the product. */
    name: (Scalars['String'] | null)
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date: (Scalars['String'] | null)
    /** The end date for new product listings. */
    new_to_date: (Scalars['String'] | null)
    /** Product stock only x left count */
    only_x_left_in_stock: (Scalars['Float'] | null)
    /** An array of options for a customizable product. */
    options: ((CustomizableOptionInterface | null)[] | null)
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container: (Scalars['String'] | null)
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price: (ProductPrices | null)
    /** The range of prices for the product */
    price_range: PriceRange
    /** An array of `TierPrice` objects. */
    price_tiers: ((TierPrice | null)[] | null)
    /** An array of `ProductLinks` objects. */
    product_links: ((ProductLinksInterface | null)[] | null)
    /** The average of all the ratings given to the product. */
    rating_summary: Scalars['Float']
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code: Scalars['Int']
    /** An array of products to be displayed in a Related Products block. */
    related_products: ((ProductInterface | null)[] | null)
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    /** The total count of all the reviews given to the product. */
    review_count: Scalars['Int']
    /** The list of products reviews. */
    reviews: ProductReviews
    /** A short description of the product. Its use depends on the theme. */
    short_description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    size: (Scalars['Int'] | null)
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku: (Scalars['String'] | null)
    /** The relative path to the small image, which is used on catalog pages. */
    small_image: (ProductImage | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date: (Scalars['String'] | null)
    /** The discounted price of the product. */
    special_price: (Scalars['Float'] | null)
    /** The end date for a product with a special price. */
    special_to_date: (Scalars['String'] | null)
    /** Stock status of the product */
    stock_status: (ProductStockStatus | null)
    /** The file name of a swatch image. */
    swatch_image: (Scalars['String'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tema: (Scalars['Int'] | null)
    /** The relative path to the product's thumbnail image. */
    thumbnail: (ProductImage | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price: (Scalars['Float'] | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices: ((ProductTierPrices | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia: (Scalars['Int'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id: (Scalars['String'] | null)
    /** The unique ID for a `ProductInterface` object. */
    uid: Scalars['ID']
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at: (Scalars['String'] | null)
    /** Upsell Products */
    upsell_products: ((ProductInterface | null)[] | null)
    /** The part of the URL that identifies the product */
    url_key: (Scalars['String'] | null)
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path: (Scalars['String'] | null)
    /** URL rewrites list */
    url_rewrites: ((UrlRewrite | null)[] | null)
    /** The part of the product URL that is appended after the url key */
    url_suffix: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites: ((Website | null)[] | null)
    __typename: 'DownloadableProduct'
}


/** Defines characteristics of a downloadable product. */
export interface DownloadableProductLinks {
    /** @deprecated This information should not be exposed on frontend. */
    id: (Scalars['Int'] | null)
    /** @deprecated This information should not be exposed on frontend. */
    is_shareable: (Scalars['Boolean'] | null)
    /** @deprecated `sample_url` serves to get the downloadable sample */
    link_type: (DownloadableFileTypeEnum | null)
    /** @deprecated This information should not be exposed on frontend. */
    number_of_downloads: (Scalars['Int'] | null)
    /** The price of the downloadable product. */
    price: (Scalars['Float'] | null)
    /** @deprecated `sample_url` serves to get the downloadable sample */
    sample_file: (Scalars['String'] | null)
    /** @deprecated `sample_url` serves to get the downloadable sample */
    sample_type: (DownloadableFileTypeEnum | null)
    /** The full URL to the downloadable sample. */
    sample_url: (Scalars['String'] | null)
    /** A number indicating the sort order. */
    sort_order: (Scalars['Int'] | null)
    /** The display name of the link. */
    title: (Scalars['String'] | null)
    /** The unique ID for a `DownloadableProductLinks` object. */
    uid: Scalars['ID']
    __typename: 'DownloadableProductLinks'
}


/** Defines characteristics of a downloadable product. */
export interface DownloadableProductSamples {
    /** @deprecated This information should not be exposed on frontend. */
    id: (Scalars['Int'] | null)
    /** @deprecated `sample_url` serves to get the downloadable sample */
    sample_file: (Scalars['String'] | null)
    /** @deprecated `sample_url` serves to get the downloadable sample */
    sample_type: (DownloadableFileTypeEnum | null)
    /** The full URL to the downloadable sample. */
    sample_url: (Scalars['String'] | null)
    /** A number indicating the sort order. */
    sort_order: (Scalars['Int'] | null)
    /** The display name of the sample. */
    title: (Scalars['String'] | null)
    __typename: 'DownloadableProductSamples'
}


/** A downloadable product wish list item. */
export interface DownloadableWishlistItem {
    /** The date and time the item was added to the wish list. */
    added_at: Scalars['String']
    /** Custom options selected for the wish list item. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** The description of the item. */
    description: (Scalars['String'] | null)
    /** The unique ID for a `WishlistItemInterface` object. */
    id: Scalars['ID']
    /** An array containing information about the selected links. */
    links_v2: ((DownloadableProductLinks | null)[] | null)
    /** Product details of the wish list item. */
    product: (ProductInterface | null)
    /** The quantity of this wish list item. */
    quantity: Scalars['Float']
    /** An array containing information about the selected samples. */
    samples: ((DownloadableProductSamples | null)[] | null)
    __typename: 'DownloadableWishlistItem'
}


/** Contains the `uid`, `relative_url`, and `type` attributes. */
export interface EntityUrl {
    /** @deprecated Use `relative_url` instead. */
    canonical_url: (Scalars['String'] | null)
    /**
     * The unique ID for a `ProductInterface`, `CategoryInterface`, `CmsPage`, or
     * similar object associated with the specified URL. This could be a product,
     * category, or CMS page UID.
     */
    entity_uid: (Scalars['ID'] | null)
    /**
     * @deprecated Use `entity_uid` instead.
     * The ID assigned to the object associated with the specified url. This could be a product ID, category ID, or page ID.
     */
    id: (Scalars['Int'] | null)
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirectCode: (Scalars['Int'] | null)
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    __typename: 'EntityUrl'
}

export type ErrorInterface = (InternalError | NoSuchEntityUidError) & { __isUnion?: true }


/** Estimate totals output. */
export interface EstimateTotalsOutput {
    /** Cart after totals estimation */
    cart: (Cart | null)
    __typename: 'EstimateTotalsOutput'
}


/** Lists the exchange rate. */
export interface ExchangeRate {
    /** Specifies the store’s default currency to exchange to. */
    currency_to: (Scalars['String'] | null)
    /** The exchange rate for the store’s default currency. */
    rate: (Scalars['Float'] | null)
    __typename: 'ExchangeRate'
}

export interface FastlaneConfig {
    /** The payment method code as defined in the payment gateway */
    code: (Scalars['String'] | null)
    /** Indicates whether the payment method is displayed */
    is_visible: (Scalars['Boolean'] | null)
    /** Defines the payment intent (Authorize or Capture */
    payment_intent: (Scalars['String'] | null)
    /** The payment source for the payment method */
    payment_source: (Scalars['String'] | null)
    /** The PayPal parameters required to load the JS SDK */
    sdk_params: ((SDKParams | null)[] | null)
    /** The relative order the payment method is displayed on the checkout page */
    sort_order: (Scalars['String'] | null)
    /** 3DS mode */
    three_ds_mode: (ThreeDSMode | null)
    /** The name displayed for the payment method */
    title: (Scalars['String'] | null)
    __typename: 'FastlaneConfig'
}

export type FilterMatchTypeEnum = 'FULL' | 'PARTIAL'


/** Contains the generated customer token. */
export interface GenerateCustomerTokenAsAdminOutput {
    /** The generated customer token. */
    customer_token: Scalars['String']
    __typename: 'GenerateCustomerTokenAsAdminOutput'
}


/** Gets the payment SDK URLs and values */
export interface GetPaymentSDKOutput {
    /** The payment SDK parameters */
    sdkParams: ((PaymentSDKParamsItem | null)[] | null)
    __typename: 'GetPaymentSDKOutput'
}


/** Contains the text of a gift message, its sender, and recipient */
export interface GiftMessage {
    /** Sender name */
    from: Scalars['String']
    /** Gift message text */
    message: Scalars['String']
    /** Recipient name */
    to: Scalars['String']
    __typename: 'GiftMessage'
}

export interface GooglePayButtonStyles {
    /** The button color */
    color: (Scalars['String'] | null)
    /** The button height in pixels */
    height: (Scalars['Int'] | null)
    /** The button type */
    type: (Scalars['String'] | null)
    __typename: 'GooglePayButtonStyles'
}

export interface GooglePayConfig {
    /** The styles for the GooglePay Button configuration */
    button_styles: (GooglePayButtonStyles | null)
    /** The payment method code as defined in the payment gateway */
    code: (Scalars['String'] | null)
    /** Indicates whether the payment method is displayed */
    is_visible: (Scalars['Boolean'] | null)
    /** Defines the payment intent (Authorize or Capture */
    payment_intent: (Scalars['String'] | null)
    /** The payment source for the payment method */
    payment_source: (Scalars['String'] | null)
    /** The PayPal parameters required to load the JS SDK */
    sdk_params: ((SDKParams | null)[] | null)
    /** The relative order the payment method is displayed on the checkout page */
    sort_order: (Scalars['String'] | null)
    /** 3DS mode */
    three_ds_mode: (ThreeDSMode | null)
    /** The name displayed for the payment method */
    title: (Scalars['String'] | null)
    __typename: 'GooglePayConfig'
}


/** Defines a grouped product, which consists of simple standalone products that are presented as a group. */
export interface GroupedProduct {
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id: (Scalars['Int'] | null)
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url: (Scalars['String'] | null)
    /** The categories assigned to a product. */
    categories: ((CategoryInterface | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    color: (Scalars['Int'] | null)
    /** The product's country of origin. */
    country_of_manufacture: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at: (Scalars['String'] | null)
    /** Crosssell Products */
    crosssell_products: ((ProductInterface | null)[] | null)
    /** Product custom attributes. */
    custom_attributesV2: (ProductCustomAttributes | null)
    /** Detailed information about the product. The value can include simple HTML tags. */
    description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size: (Scalars['String'] | null)
    /** Indicates whether a gift message is available. */
    gift_message_available: (Scalars['String'] | null)
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id: (Scalars['Int'] | null)
    /** The relative path to the main image on the product page. */
    image: (ProductImage | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested: (Scalars['Int'] | null)
    /** An array containing grouped product items. */
    items: ((GroupedProductItem | null)[] | null)
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer: (Scalars['Int'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2: (Scalars['Int'] | null)
    /** An array of media gallery objects. */
    media_gallery: ((MediaGalleryInterface | null)[] | null)
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries: ((MediaGalleryEntry | null)[] | null)
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description: (Scalars['String'] | null)
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword: (Scalars['String'] | null)
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title: (Scalars['String'] | null)
    /** The product name. Customers use this name to identify the product. */
    name: (Scalars['String'] | null)
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date: (Scalars['String'] | null)
    /** The end date for new product listings. */
    new_to_date: (Scalars['String'] | null)
    /** Product stock only x left count */
    only_x_left_in_stock: (Scalars['Float'] | null)
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container: (Scalars['String'] | null)
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price: (ProductPrices | null)
    /** The range of prices for the product */
    price_range: PriceRange
    /** An array of `TierPrice` objects. */
    price_tiers: ((TierPrice | null)[] | null)
    /** An array of `ProductLinks` objects. */
    product_links: ((ProductLinksInterface | null)[] | null)
    /** The average of all the ratings given to the product. */
    rating_summary: Scalars['Float']
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code: Scalars['Int']
    /** An array of products to be displayed in a Related Products block. */
    related_products: ((ProductInterface | null)[] | null)
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    /** The total count of all the reviews given to the product. */
    review_count: Scalars['Int']
    /** The list of products reviews. */
    reviews: ProductReviews
    /** A short description of the product. Its use depends on the theme. */
    short_description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    size: (Scalars['Int'] | null)
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku: (Scalars['String'] | null)
    /** The relative path to the small image, which is used on catalog pages. */
    small_image: (ProductImage | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date: (Scalars['String'] | null)
    /** The discounted price of the product. */
    special_price: (Scalars['Float'] | null)
    /** The end date for a product with a special price. */
    special_to_date: (Scalars['String'] | null)
    /** Stock status of the product */
    stock_status: (ProductStockStatus | null)
    /** The file name of a swatch image. */
    swatch_image: (Scalars['String'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tema: (Scalars['Int'] | null)
    /** The relative path to the product's thumbnail image. */
    thumbnail: (ProductImage | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price: (Scalars['Float'] | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices: ((ProductTierPrices | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia: (Scalars['Int'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id: (Scalars['String'] | null)
    /** The unique ID for a `ProductInterface` object. */
    uid: Scalars['ID']
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at: (Scalars['String'] | null)
    /** Upsell Products */
    upsell_products: ((ProductInterface | null)[] | null)
    /** The part of the URL that identifies the product */
    url_key: (Scalars['String'] | null)
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path: (Scalars['String'] | null)
    /** URL rewrites list */
    url_rewrites: ((UrlRewrite | null)[] | null)
    /** The part of the product URL that is appended after the url key */
    url_suffix: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites: ((Website | null)[] | null)
    /** The weight of the item, in units defined by the store. */
    weight: (Scalars['Float'] | null)
    __typename: 'GroupedProduct'
}


/** Contains information about an individual grouped product item. */
export interface GroupedProductItem {
    /** The relative position of this item compared to the other group items. */
    position: (Scalars['Int'] | null)
    /** Details about this product option. */
    product: (ProductInterface | null)
    /** The quantity of this grouped product item. */
    qty: (Scalars['Float'] | null)
    __typename: 'GroupedProductItem'
}


/** A grouped product wish list item. */
export interface GroupedProductWishlistItem {
    /** The date and time the item was added to the wish list. */
    added_at: Scalars['String']
    /** Custom options selected for the wish list item. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** The description of the item. */
    description: (Scalars['String'] | null)
    /** The unique ID for a `WishlistItemInterface` object. */
    id: Scalars['ID']
    /** Product details of the wish list item. */
    product: (ProductInterface | null)
    /** The quantity of this wish list item. */
    quantity: Scalars['Float']
    __typename: 'GroupedProductWishlistItem'
}

export interface HostedFieldsConfig {
    /** Vault payment method code */
    cc_vault_code: (Scalars['String'] | null)
    /** The payment method code as defined in the payment gateway */
    code: (Scalars['String'] | null)
    /** Card vault enabled */
    is_vault_enabled: (Scalars['Boolean'] | null)
    /** Indicates whether the payment method is displayed */
    is_visible: (Scalars['Boolean'] | null)
    /** Defines the payment intent (Authorize or Capture */
    payment_intent: (Scalars['String'] | null)
    /** The payment source for the payment method */
    payment_source: (Scalars['String'] | null)
    /** Card and bin details required */
    requires_card_details: (Scalars['Boolean'] | null)
    /** The PayPal parameters required to load the JS SDK */
    sdk_params: ((SDKParams | null)[] | null)
    /** The relative order the payment method is displayed on the checkout page */
    sort_order: (Scalars['String'] | null)
    /**
     * @deprecated Use 'three_ds_mode' instead.
     * Whether 3DS is activated; true if 3DS mode is not OFF.
     */
    three_ds: (Scalars['Boolean'] | null)
    /** 3DS mode */
    three_ds_mode: (ThreeDSMode | null)
    /** The name displayed for the payment method */
    title: (Scalars['String'] | null)
    __typename: 'HostedFieldsConfig'
}


/** Contains the secure URL used for the Payments Pro Hosted Solution payment method. */
export interface HostedProUrl {
    /** The secure URL generated by PayPal. */
    secure_form_url: (Scalars['String'] | null)
    __typename: 'HostedProUrl'
}


/** Contains target path parameters. */
export interface HttpQueryParameter {
    /** A parameter name. */
    name: (Scalars['String'] | null)
    /** A parameter value. */
    value: (Scalars['String'] | null)
    __typename: 'HttpQueryParameter'
}

export interface ImageSwatchData {
    /** The URL assigned to the thumbnail of the swatch image. */
    thumbnail: (Scalars['String'] | null)
    /** The value can be represented as color (HEX code), image link, or text. */
    value: (Scalars['String'] | null)
    __typename: 'ImageSwatchData'
}


/** List of templates/filters applied to customer attribute input. */
export type InputFilterEnum = 'NONE' | 'DATE' | 'TRIM' | 'STRIPTAGS' | 'ESCAPEHTML'


/** Contains an error message when an internal error occurred. */
export interface InternalError {
    /** The returned error message. */
    message: Scalars['String']
    __typename: 'InternalError'
}


/** Contains invoice details. */
export interface Invoice {
    /** Comments on the invoice. */
    comments: ((SalesCommentItem | null)[] | null)
    /** The unique ID for a `Invoice` object. */
    id: Scalars['ID']
    /** Invoiced product details. */
    items: ((InvoiceItemInterface | null)[] | null)
    /** Sequential invoice number. */
    number: Scalars['String']
    /** Invoice total amount details. */
    total: (InvoiceTotal | null)
    __typename: 'Invoice'
}

export interface InvoiceItem {
    /** Information about the final discount amount for the base product, including discounts on options. */
    discounts: ((Discount | null)[] | null)
    /** The unique ID for an `InvoiceItemInterface` object. */
    id: Scalars['ID']
    /** Details about an individual order item. */
    order_item: (OrderItemInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price for the base product including selected options. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The number of invoiced items. */
    quantity_invoiced: (Scalars['Float'] | null)
    __typename: 'InvoiceItem'
}


/** Contains detailes about invoiced items. */
export type InvoiceItemInterface = (BundleInvoiceItem | DownloadableInvoiceItem | InvoiceItem) & { __isUnion?: true }


/** Contains price details from an invoice. */
export interface InvoiceTotal {
    /** The final base grand total amount in the base currency. */
    base_grand_total: Money
    /** The applied discounts to the invoice. */
    discounts: ((Discount | null)[] | null)
    /** The final total amount, including shipping, discounts, and taxes. */
    grand_total: Money
    /** Details about the shipping and handling costs for the invoice. */
    shipping_handling: (ShippingHandling | null)
    /** The subtotal of the invoice, excluding shipping, discounts, and taxes. */
    subtotal: Money
    /** The invoice tax details. */
    taxes: ((TaxItem | null)[] | null)
    /** The shipping amount for the invoice. */
    total_shipping: Money
    /** The amount of tax applied to the invoice. */
    total_tax: Money
    __typename: 'InvoiceTotal'
}


/** Contains the result of the `isEmailAvailable` query. */
export interface IsEmailAvailableOutput {
    /** Indicates whether the specified email address can be used to create a customer. */
    is_email_available: (Scalars['Boolean'] | null)
    __typename: 'IsEmailAvailableOutput'
}


/** A list of options of the selected bundle product. */
export interface ItemSelectedBundleOption {
    /**
     * @deprecated Use `uid` instead.
     * The unique ID for a `ItemSelectedBundleOption` object.
     */
    id: Scalars['ID']
    /** The label of the option. */
    label: Scalars['String']
    /** The unique ID for a `ItemSelectedBundleOption` object. */
    uid: Scalars['ID']
    /** A list of products that represent the values of the parent option. */
    values: ((ItemSelectedBundleOptionValue | null)[] | null)
    __typename: 'ItemSelectedBundleOption'
}


/** A list of values for the selected bundle product. */
export interface ItemSelectedBundleOptionValue {
    /**
     * @deprecated Use `uid` instead.
     * The unique ID for a `ItemSelectedBundleOptionValue` object.
     */
    id: Scalars['ID']
    /** The price of the child bundle product. */
    price: Money
    /** The name of the child bundle product. */
    product_name: Scalars['String']
    /** The SKU of the child bundle product. */
    product_sku: Scalars['String']
    /** The number of this bundle product that were ordered. */
    quantity: Scalars['Float']
    /** The unique ID for a `ItemSelectedBundleOptionValue` object. */
    uid: Scalars['ID']
    __typename: 'ItemSelectedBundleOptionValue'
}


/** Contains a key-value pair. */
export interface KeyValue {
    /** The name part of the key/value pair. */
    name: (Scalars['String'] | null)
    /** The value part of the key/value pair. */
    value: (Scalars['String'] | null)
    __typename: 'KeyValue'
}


/** Contains information for rendering layered navigation. */
export interface LayerFilter {
    /**
     * @deprecated Use `Aggregation.options` instead.
     * An array of filter items.
     */
    filter_items: ((LayerFilterItemInterface | null)[] | null)
    /**
     * @deprecated Use `Aggregation.count` instead.
     * The count of filter items in filter group.
     */
    filter_items_count: (Scalars['Int'] | null)
    /**
     * @deprecated Use `Aggregation.label` instead.
     * The name of a layered navigation filter.
     */
    name: (Scalars['String'] | null)
    /**
     * @deprecated Use `Aggregation.attribute_code` instead.
     * The request variable name for a filter query.
     */
    request_var: (Scalars['String'] | null)
    __typename: 'LayerFilter'
}

export interface LayerFilterItem {
    /**
     * @deprecated Use `AggregationOption.count` instead.
     * The count of items per filter.
     */
    items_count: (Scalars['Int'] | null)
    /**
     * @deprecated Use `AggregationOption.label` instead.
     * The label for a filter.
     */
    label: (Scalars['String'] | null)
    /**
     * @deprecated Use `AggregationOption.value` instead.
     * The value of a filter request variable to be used in query.
     */
    value_string: (Scalars['String'] | null)
    __typename: 'LayerFilterItem'
}

export type LayerFilterItemInterface = (LayerFilterItem | SwatchLayerFilterItem) & { __isUnion?: true }


/** Defines characteristics about images and videos associated with a specific product. */
export interface MediaGalleryEntry {
    /** Details about the content of the media gallery item. */
    content: (ProductMediaGalleryEntriesContent | null)
    /** Indicates whether the image is hidden from view. */
    disabled: (Scalars['Boolean'] | null)
    /** The path of the image on the server. */
    file: (Scalars['String'] | null)
    /**
     * @deprecated Use `uid` instead.
     * The identifier assigned to the object.
     */
    id: (Scalars['Int'] | null)
    /** The alt text displayed on the storefront when the user points to the image. */
    label: (Scalars['String'] | null)
    /** Either `image` or `video`. */
    media_type: (Scalars['String'] | null)
    /** The media item's position after it has been sorted. */
    position: (Scalars['Int'] | null)
    /** Array of image types. It can have the following values: image, small_image, thumbnail. */
    types: ((Scalars['String'] | null)[] | null)
    /** The unique ID for a `MediaGalleryEntry` object. */
    uid: Scalars['ID']
    /** Details about the content of a video item. */
    video_content: (ProductMediaGalleryEntriesVideoContent | null)
    __typename: 'MediaGalleryEntry'
}


/** Contains basic information about a product image or video. */
export type MediaGalleryInterface = (ProductImage | ProductVideo) & { __isUnion?: true }

export interface MessageStyleLogo {
    /** The type of logo for the PayPal Pay Later messaging */
    type: (Scalars['String'] | null)
    __typename: 'MessageStyleLogo'
}

export interface MessageStyles {
    /** The message layout */
    layout: (Scalars['String'] | null)
    /** The message logo */
    logo: (MessageStyleLogo | null)
    __typename: 'MessageStyles'
}

export interface ModuleConfiguration {
    /** The Public Key of the Stripe payment. */
    apiKey: (Scalars['String'] | null)
    /** Module Version and Partner ID etc */
    appInfo: ((Scalars['String'] | null)[] | null)
    /** Serialized options that can be used to initialize the Elements object */
    elementsOptions: (Scalars['String'] | null)
    /** Locale */
    locale: (Scalars['String'] | null)
    /** Betas and API version */
    options: (ModuleOptions | null)
    __typename: 'ModuleConfiguration'
}

export interface ModuleOptions {
    /** API Version */
    apiVersion: (Scalars['String'] | null)
    /** Betas. */
    betas: ((Scalars['String'] | null)[] | null)
    __typename: 'ModuleOptions'
}


/** Defines a monetary value, including a numeric value and a currency code. */
export interface Money {
    /** A three-letter currency code, such as USD or EUR. */
    currency: (CurrencyEnum | null)
    /** A number expressing a monetary value. */
    value: (Scalars['Float'] | null)
    __typename: 'Money'
}

export interface Mutation {
    /** Add one or more bundle products to the specified cart. We recommend using `addProductsToCart` instead. */
    addBundleProductsToCart: (AddBundleProductsToCartOutput | null)
    /** Add one or more configurable products to the specified cart. We recommend using `addProductsToCart` instead. */
    addConfigurableProductsToCart: (AddConfigurableProductsToCartOutput | null)
    /** Add one or more downloadable products to the specified cart. We recommend using `addProductsToCart` instead. */
    addDownloadableProductsToCart: (AddDownloadableProductsToCartOutput | null)
    /** Add any type of product to the cart. */
    addProductsToCart: (AddProductsToCartOutput | null)
    /** Add products to the specified compare list. */
    addProductsToCompareList: (CompareList | null)
    /** Creates a new cart and add any type of product to it */
    addProductsToNewCart: (AddProductsToNewCartOutput | null)
    /** Add one or more products to the specified wish list. This mutation supports all product types. */
    addProductsToWishlist: (AddProductsToWishlistOutput | null)
    /** Add one or more simple products to the specified cart. We recommend using `addProductsToCart` instead. */
    addSimpleProductsToCart: (AddSimpleProductsToCartOutput | null)
    /** Saves a payment method on the logged in customer */
    addStripePaymentMethod: (StripePaymentMethod | null)
    /** Add one or more virtual products to the specified cart. We recommend using `addProductsToCart` instead. */
    addVirtualProductsToCart: (AddVirtualProductsToCartOutput | null)
    /** Add items in the specified wishlist to the customer's cart. */
    addWishlistItemsToCart: (AddWishlistItemsToCartOutput | null)
    /** Apply a pre-defined coupon code to the specified cart. */
    applyCouponToCart: (ApplyCouponToCartOutput | null)
    /** Assign the specified compare list to the logged in customer. */
    assignCompareListToCustomer: (AssignCompareListToCustomerOutput | null)
    /** Assign a logged-in customer to the specified guest shopping cart. */
    assignCustomerToGuestCart: Cart
    /** Cancel the specified customer order. */
    cancelOrder: (CancelOrderOutput | null)
    /** Change the password for the logged-in customer. */
    changeCustomerPassword: (Customer | null)
    /** Synchronizes order details and place the order */
    completeOrder: (PlaceOrderOutput | null)
    /** Confirms the email address for a customer. */
    confirmEmail: (CustomerOutput | null)
    /** Send a 'Contact Us' email to the merchant. */
    contactUs: (ContactUsOutput | null)
    /** Create a new compare list. The compare list is saved for logged in customers. */
    createCompareList: (CompareList | null)
    /** Use `createCustomerV2` instead. */
    createCustomer: (CustomerOutput | null)
    /** Create a billing or shipping address for a customer or guest. */
    createCustomerAddress: (CustomerAddress | null)
    /** Create a customer account. */
    createCustomerV2: (CustomerOutput | null)
    /**
     * @deprecated Use `Mutation.createGuestCart` or `Query.customerCart` for logged in customer
     * Create an empty shopping cart for a guest or logged in user
     */
    createEmptyCart: (Scalars['String'] | null)
    /** Create a new shopping cart */
    createGuestCart: (CreateGuestCartOutput | null)
    /** Initiate a transaction and receive a token. Use this mutation for Payflow Pro and Payments Pro payment methods */
    createPayflowProToken: (CreatePayflowProTokenOutput | null)
    /** Creates a payment order for further payment processing */
    createPaymentOrder: (CreatePaymentOrderOutput | null)
    /**
     * Initiate an Express Checkout transaction and receive a token. Use this
     * mutation for Express Checkout and Payments Standard payment methods.
     */
    createPaypalExpressToken: (PaypalExpressTokenOutput | null)
    /** Create a product review for the specified product. */
    createProductReview: CreateProductReviewOutput
    /** Creates a vault payment token */
    createVaultCardPaymentToken: (CreateVaultCardPaymentTokenOutput | null)
    /** Creates a vault card setup token */
    createVaultCardSetupToken: (CreateVaultCardSetupTokenOutput | null)
    /** Delete the specified compare list. */
    deleteCompareList: (DeleteCompareListOutput | null)
    /** Delete customer account */
    deleteCustomer: (Scalars['Boolean'] | null)
    /** Delete the billing or shipping address of a customer. */
    deleteCustomerAddress: (Scalars['Boolean'] | null)
    /** Delete a customer's payment token. */
    deletePaymentToken: (DeletePaymentTokenOutput | null)
    /** Deletes a saved payment method from a logged in customer */
    deleteStripePaymentMethod: (Scalars['String'] | null)
    /** Estimate shipping method(s) for cart based on address */
    estimateShippingMethods: ((AvailableShippingMethod | null)[] | null)
    /** Estimate totals for cart based on the address */
    estimateTotals: EstimateTotalsOutput
    /** Generate a token for specified customer. */
    generateCustomerToken: (CustomerToken | null)
    /** Request a customer token so that an administrator can perform remote shopping assistance. */
    generateCustomerTokenAsAdmin: (GenerateCustomerTokenAsAdminOutput | null)
    /**
     * Handle a payment response and save the payment in Quote. Use this mutation for
     * Payflow Pro and Payments Pro payment methods.
     */
    handlePayflowProResponse: (PayflowProResponseOutput | null)
    /** List all saved payment methods of a logged in customer */
    listStripePaymentMethods: ((StripePaymentMethod | null)[] | null)
    /** Transfer the contents of a guest cart into the cart of a logged-in customer. */
    mergeCarts: Cart
    /** Convert the quote into an order. */
    placeOrder: (PlaceOrderOutput | null)
    /** Remove a previously-applied coupon from the cart. The cart must contain at least one item in order to remove the coupon. */
    removeCouponFromCart: (RemoveCouponFromCartOutput | null)
    /**
     * Delete the entire quantity of a specified item from the cart. If you remove
     * all items from the cart, the cart continues to exist.
     */
    removeItemFromCart: (RemoveItemFromCartOutput | null)
    /** Remove products from the specified compare list. */
    removeProductsFromCompareList: (CompareList | null)
    /** Remove one or more products from the specified wish list. */
    removeProductsFromWishlist: (RemoveProductsFromWishlistOutput | null)
    /** Add all products from a customer's previous order to the cart. */
    reorderItems: (ReorderItemsOutput | null)
    /** Request an email with a reset password token for the registered customer identified by the specified email. */
    requestPasswordResetEmail: (Scalars['Boolean'] | null)
    /**
     * Reset a customer's password using the reset password token that the customer
     * received in an email after requesting it using `requestPasswordResetEmail`.
     */
    resetPassword: (Scalars['Boolean'] | null)
    /** Revoke the customer token. */
    revokeCustomerToken: (RevokeCustomerTokenOutput | null)
    /** Send a message on behalf of a customer to the specified email addresses. */
    sendEmailToFriend: (SendEmailToFriendOutput | null)
    /** Set the billing address on a specific cart. */
    setBillingAddressOnCart: (SetBillingAddressOnCartOutput | null)
    /** Sets the cart as inactive */
    setCartAsInactive: (SetCartAsInactiveOutput | null)
    /** Assign the email address of a guest to the cart. */
    setGuestEmailOnCart: (SetGuestEmailOnCartOutput | null)
    /**
     * @deprecated Should use setPaymentMethodOnCart and placeOrder mutations in single request.
     * Set the cart payment method and convert the cart into an order.
     */
    setPaymentMethodAndPlaceOrder: (PlaceOrderOutput | null)
    /** Apply a payment method to the cart. */
    setPaymentMethodOnCart: (SetPaymentMethodOnCartOutput | null)
    /** Set one or more shipping addresses on a specific cart. */
    setShippingAddressesOnCart: (SetShippingAddressesOnCartOutput | null)
    /** Set one or more delivery methods on a cart. */
    setShippingMethodsOnCart: (SetShippingMethodsOnCartOutput | null)
    /** Subscribe the specified email to the store's newsletter. */
    subscribeEmailToNewsletter: (SubscribeEmailToNewsletterOutput | null)
    /** Synchronizes the payment order details for further payment processing */
    syncPaymentOrder: (Scalars['Boolean'] | null)
    /** Modify items in the cart. */
    updateCartItems: (UpdateCartItemsOutput | null)
    /** Use `updateCustomerV2` instead. */
    updateCustomer: (CustomerOutput | null)
    /** Update the billing or shipping address of a customer or guest. */
    updateCustomerAddress: (CustomerAddress | null)
    /** Change the email address for the logged-in customer. */
    updateCustomerEmail: (CustomerOutput | null)
    /** Update the customer's personal information. */
    updateCustomerV2: (CustomerOutput | null)
    /** Update one or more products in the specified wish list. */
    updateProductsInWishlist: (UpdateProductsInWishlistOutput | null)
    __typename: 'Mutation'
}


/** Contains an error message when an invalid UID was specified. */
export interface NoSuchEntityUidError {
    /** The returned error message. */
    message: Scalars['String']
    /** The specified invalid unique ID of an object. */
    uid: Scalars['ID']
    __typename: 'NoSuchEntityUidError'
}


/** Contains the order ID. */
export interface Order {
    /** The client secret of the PaymentIntent or SetupIntent that is associated with this order */
    client_secret: (Scalars['String'] | null)
    /** @deprecated Use `order_number` instead. */
    order_id: (Scalars['String'] | null)
    /** The unique ID for an `Order` object. */
    order_number: Scalars['String']
    __typename: 'Order'
}


/** Contains detailed information about an order's billing and shipping addresses. */
export interface OrderAddress {
    /** The city or town. */
    city: Scalars['String']
    /** The customer's company. */
    company: (Scalars['String'] | null)
    /** The customer's country. */
    country_code: (CountryCodeEnum | null)
    /** The fax number. */
    fax: (Scalars['String'] | null)
    /** The first name of the person associated with the shipping/billing address. */
    firstname: Scalars['String']
    /** The family name of the person associated with the shipping/billing address. */
    lastname: Scalars['String']
    /** The middle name of the person associated with the shipping/billing address. */
    middlename: (Scalars['String'] | null)
    /** The customer's ZIP or postal code. */
    postcode: (Scalars['String'] | null)
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix: (Scalars['String'] | null)
    /** The state or province name. */
    region: (Scalars['String'] | null)
    /** The unique ID for a `Region` object of a pre-defined region. */
    region_id: (Scalars['ID'] | null)
    /** An array of strings that define the street number and name. */
    street: (Scalars['String'] | null)[]
    /** A value such as Sr., Jr., or III. */
    suffix: (Scalars['String'] | null)
    /** The telephone number. */
    telephone: (Scalars['String'] | null)
    /** The customer's Value-added tax (VAT) number (for corporate customers). */
    vat_id: (Scalars['String'] | null)
    __typename: 'OrderAddress'
}

export interface OrderItem {
    /** The final discount information for the product. */
    discounts: ((Discount | null)[] | null)
    /** The entered option for the base product, such as a logo or image. */
    entered_options: ((OrderItemOption | null)[] | null)
    /** The selected gift message for the order item */
    gift_message: (GiftMessage | null)
    /** The unique ID for an `OrderItemInterface` object. */
    id: Scalars['ID']
    /** The ProductInterface object, which contains details about the base product */
    product: (ProductInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price of the base product, including selected options. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The type of product, such as simple, configurable, etc. */
    product_type: (Scalars['String'] | null)
    /** URL key of the base product. */
    product_url_key: (Scalars['String'] | null)
    /** The number of canceled items. */
    quantity_canceled: (Scalars['Float'] | null)
    /** The number of invoiced items. */
    quantity_invoiced: (Scalars['Float'] | null)
    /** The number of units ordered for this item. */
    quantity_ordered: (Scalars['Float'] | null)
    /** The number of refunded items. */
    quantity_refunded: (Scalars['Float'] | null)
    /** The number of returned items. */
    quantity_returned: (Scalars['Float'] | null)
    /** The number of shipped items. */
    quantity_shipped: (Scalars['Float'] | null)
    /** The selected options for the base product, such as color or size. */
    selected_options: ((OrderItemOption | null)[] | null)
    /** The status of the order item. */
    status: (Scalars['String'] | null)
    __typename: 'OrderItem'
}


/** Order item details. */
export type OrderItemInterface = (BundleOrderItem | DownloadableOrderItem | OrderItem) & { __isUnion?: true }


/** Represents order item options like selected or entered. */
export interface OrderItemOption {
    /** The name of the option. */
    label: Scalars['String']
    /** The value of the option. */
    value: Scalars['String']
    __typename: 'OrderItemOption'
}


/** Contains details about the payment method used to pay for the order. */
export interface OrderPaymentMethod {
    /** Additional data per payment method type. */
    additional_data: ((KeyValue | null)[] | null)
    /** The label that describes the payment method. */
    name: Scalars['String']
    /** The payment method code that indicates how the order was paid for. */
    type: Scalars['String']
    __typename: 'OrderPaymentMethod'
}


/** Contains order shipment details. */
export interface OrderShipment {
    /** Comments added to the shipment. */
    comments: ((SalesCommentItem | null)[] | null)
    /** The unique ID for a `OrderShipment` object. */
    id: Scalars['ID']
    /** An array of items included in the shipment. */
    items: ((ShipmentItemInterface | null)[] | null)
    /** The sequential credit shipment number. */
    number: Scalars['String']
    /** An array of shipment tracking details. */
    tracking: ((ShipmentTracking | null)[] | null)
    __typename: 'OrderShipment'
}


/** Contains details about the sales total amounts used to calculate the final price. */
export interface OrderTotal {
    /** The final base grand total amount in the base currency. */
    base_grand_total: Money
    /** The applied discounts to the order. */
    discounts: ((Discount | null)[] | null)
    /** The final total amount, including shipping, discounts, and taxes. */
    grand_total: Money
    /** Details about the shipping and handling costs for the order. */
    shipping_handling: (ShippingHandling | null)
    /** The subtotal of the order, excluding shipping, discounts, and taxes. */
    subtotal: Money
    /** The order tax details. */
    taxes: ((TaxItem | null)[] | null)
    /** The shipping amount for the order. */
    total_shipping: Money
    /** The amount of tax applied to the order. */
    total_tax: Money
    __typename: 'OrderTotal'
}


/** Indicates the mode for payment. Applies to the Payflow Link and Payments Advanced payment methods. */
export type PayflowLinkMode = 'TEST' | 'LIVE'


/**
 * Contains information used to generate PayPal iframe for transaction. Applies to
 * Payflow Link and Payments Advanced payment methods.
 */
export interface PayflowLinkToken {
    /** The mode for the Payflow transaction. */
    mode: (PayflowLinkMode | null)
    /** The PayPal URL used for requesting a Payflow form. */
    paypal_url: (Scalars['String'] | null)
    /** The secure token generated by PayPal. */
    secure_token: (Scalars['String'] | null)
    /** The secure token ID generated by PayPal. */
    secure_token_id: (Scalars['String'] | null)
    __typename: 'PayflowLinkToken'
}

export interface PayflowProResponseOutput {
    /** The cart with the updated selected payment method. */
    cart: Cart
    __typename: 'PayflowProResponseOutput'
}


/** Contains the secure information used to authorize transaction. Applies to Payflow Pro and Payments Pro payment methods. */
export interface PayflowProToken {
    /** The RESPMSG returned by PayPal. If the `result` is `0`, then `response_message` is `Approved`. */
    response_message: Scalars['String']
    /** A non-zero value if any errors occurred. */
    result: Scalars['Int']
    /** The RESULT returned by PayPal. A value of `0` indicates the transaction was approved. */
    result_code: Scalars['Int']
    /** A secure token generated by PayPal. */
    secure_token: Scalars['String']
    /** A secure token ID generated by PayPal. */
    secure_token_id: Scalars['String']
    __typename: 'PayflowProToken'
}

export interface PaymentCommonConfig {
    /** The payment method code as defined in the payment gateway */
    code: (Scalars['String'] | null)
    /** Indicates whether the payment method is displayed */
    is_visible: (Scalars['Boolean'] | null)
    /** Defines the payment intent (Authorize or Capture */
    payment_intent: (Scalars['String'] | null)
    /** The PayPal parameters required to load the JS SDK */
    sdk_params: ((SDKParams | null)[] | null)
    /** The relative order the payment method is displayed on the checkout page */
    sort_order: (Scalars['String'] | null)
    /** The name displayed for the payment method */
    title: (Scalars['String'] | null)
    __typename: 'PaymentCommonConfig'
}


/** Contains payment fields that are common to all types of payment methods. */
export type PaymentConfigItem = (ApplePayConfig | FastlaneConfig | GooglePayConfig | HostedFieldsConfig | PaymentCommonConfig | SmartButtonsConfig) & { __isUnion?: true }


/** Retrieves the payment configuration for a given location */
export interface PaymentConfigOutput {
    /** ApplePay payment method configuration */
    apple_pay: (ApplePayConfig | null)
    /** Fastlane payment method configuration */
    fastlane: (FastlaneConfig | null)
    /** GooglePay payment method configuration */
    google_pay: (GooglePayConfig | null)
    /** Hosted fields payment method configuration */
    hosted_fields: (HostedFieldsConfig | null)
    /** Smart Buttons payment method configuration */
    smart_buttons: (SmartButtonsConfig | null)
    __typename: 'PaymentConfigOutput'
}


/** Defines the origin location for that payment request */
export type PaymentLocation = 'PRODUCT_DETAIL' | 'MINICART' | 'CART' | 'CHECKOUT' | 'ADMIN'


/** Contains the payment order details */
export interface PaymentOrderOutput {
    /** PayPal order ID */
    id: (Scalars['String'] | null)
    /** The order ID generated by Payment Services */
    mp_order_id: (Scalars['String'] | null)
    /** Details about the card used on the order */
    payment_source_details: (PaymentSourceDetails | null)
    /** The status of the payment order */
    status: (Scalars['String'] | null)
    __typename: 'PaymentOrderOutput'
}

export interface PaymentSDKParamsItem {
    /** The payment method code used in the order */
    code: (Scalars['String'] | null)
    /** The payment SDK parameters */
    params: ((SDKParams | null)[] | null)
    __typename: 'PaymentSDKParamsItem'
}

export interface PaymentSourceDetails {
    /** Details about the card used on the order */
    card: (Card | null)
    __typename: 'PaymentSourceDetails'
}


/** The payment source information */
export interface PaymentSourceOutput {
    /** The card payment source information */
    card: CardPaymentSourceOutput
    __typename: 'PaymentSourceOutput'
}


/** The stored payment method available to the customer. */
export interface PaymentToken {
    /** A description of the stored account details. */
    details: (Scalars['String'] | null)
    /** The payment method code associated with the token. */
    payment_method_code: Scalars['String']
    /** The public hash of the token. */
    public_hash: Scalars['String']
    /** Specifies the payment token type. */
    type: PaymentTokenTypeEnum
    __typename: 'PaymentToken'
}


/** The list of available payment token types. */
export type PaymentTokenTypeEnum = 'card' | 'account'


/** Deprecated. Use `PaypalExpressTokenOutput` instead. */
export interface PaypalExpressToken {
    /**
     * @deprecated Use `PaypalExpressTokenOutput.paypal_urls` instead.
     * A set of URLs that allow the buyer to authorize payment and adjust checkout details.
     */
    paypal_urls: (PaypalExpressUrlList | null)
    /**
     * @deprecated Use `PaypalExpressTokenOutput.token` instead.
     * The token returned by PayPal.
     */
    token: (Scalars['String'] | null)
    __typename: 'PaypalExpressToken'
}


/**
 * Contains the token returned by PayPal and a set of URLs that allow the buyer to
 * authorize payment and adjust checkout details. Applies to Express Checkout and
 * Payments Standard payment methods.
 */
export interface PaypalExpressTokenOutput {
    /** A set of URLs that allow the buyer to authorize payment and adjust checkout details. */
    paypal_urls: (PaypalExpressUrlList | null)
    /** The token returned by PayPal. */
    token: (Scalars['String'] | null)
    __typename: 'PaypalExpressTokenOutput'
}


/**
 * Contains a set of URLs that allow the buyer to authorize payment and adjust
 * checkout details for Express Checkout and Payments Standard transactions.
 */
export interface PaypalExpressUrlList {
    /** The PayPal URL that allows the buyer to edit their checkout details. */
    edit: (Scalars['String'] | null)
    /** The URL to the PayPal login page. */
    start: (Scalars['String'] | null)
    __typename: 'PaypalExpressUrlList'
}


/** Contains attributes specific to tangible products. */
export type PhysicalProductInterface = (BundleProduct | ConfigurableProduct | GroupedProduct | SimpleProduct) & { __isUnion?: true }


/** Defines Pickup Location information. */
export interface PickupLocation {
    city: (Scalars['String'] | null)
    contact_name: (Scalars['String'] | null)
    country_id: (Scalars['String'] | null)
    description: (Scalars['String'] | null)
    email: (Scalars['String'] | null)
    fax: (Scalars['String'] | null)
    latitude: (Scalars['Float'] | null)
    longitude: (Scalars['Float'] | null)
    name: (Scalars['String'] | null)
    phone: (Scalars['String'] | null)
    pickup_location_code: (Scalars['String'] | null)
    postcode: (Scalars['String'] | null)
    region: (Scalars['String'] | null)
    region_id: (Scalars['Int'] | null)
    street: (Scalars['String'] | null)
    __typename: 'PickupLocation'
}


/** Top level object returned in a pickup locations search. */
export interface PickupLocations {
    /** An array of pickup locations that match the specific search request. */
    items: ((PickupLocation | null)[] | null)
    /** An object that includes the page_info and currentPage values specified in the query. */
    page_info: (SearchResultPageInfo | null)
    /** The number of products returned. */
    total_count: (Scalars['Int'] | null)
    __typename: 'PickupLocations'
}


/** An error encountered while placing an order. */
export interface PlaceOrderError {
    /** An error code that is specific to place order. */
    code: PlaceOrderErrorCodes
    /** A localized error message. */
    message: Scalars['String']
    __typename: 'PlaceOrderError'
}

export type PlaceOrderErrorCodes = 'CART_NOT_FOUND' | 'CART_NOT_ACTIVE' | 'GUEST_EMAIL_MISSING' | 'UNABLE_TO_PLACE_ORDER' | 'UNDEFINED'


/** Contains the results of the request to place an order. */
export interface PlaceOrderOutput {
    /** An array of place order errors. */
    errors: (PlaceOrderError | null)[]
    /**
     * @deprecated Use `orderV2` instead.
     * The ID of the order.
     */
    order: (Order | null)
    /** Full order information. */
    orderV2: (CustomerOrder | null)
    __typename: 'PlaceOrderOutput'
}


/** Deprecated. Use `ProductPrice` instead. Defines the price of a product as well as any tax-related adjustments. */
export interface Price {
    /**
     * @deprecated Use `ProductPrice` instead.
     * An array that provides information about tax, weee, or weee_tax adjustments.
     */
    adjustments: ((PriceAdjustment | null)[] | null)
    /**
     * @deprecated Use `ProductPrice` instead.
     * The price of a product plus a three-letter currency code.
     */
    amount: (Money | null)
    __typename: 'Price'
}


/**
 * Deprecated. Taxes will be included or excluded in the price. Defines the amount
 * of money to apply as an adjustment, the type of adjustment to apply, and whether
 * the item is included or excluded from the adjustment.
 */
export interface PriceAdjustment {
    /** The amount of the price adjustment and its currency code. */
    amount: (Money | null)
    /**
     * @deprecated `PriceAdjustment` is deprecated.
     * Indicates whether the adjustment involves tax, weee, or weee_tax.
     */
    code: (PriceAdjustmentCodesEnum | null)
    /**
     * @deprecated `PriceAdjustment` is deprecated.
     * Indicates whether the entity described by the code attribute is included or excluded from the adjustment.
     */
    description: (PriceAdjustmentDescriptionEnum | null)
    __typename: 'PriceAdjustment'
}


/** `PriceAdjustment.code` is deprecated. */
export type PriceAdjustmentCodesEnum = 'TAX'


/** `PriceAdjustmentDescriptionEnum` is deprecated. States whether a price adjustment is included or excluded. */
export type PriceAdjustmentDescriptionEnum = 'INCLUDED' | 'EXCLUDED'


/** Can be used to retrieve the main price details in case of bundle product */
export interface PriceDetails {
    /** The percentage of discount applied to the main product price */
    discount_percentage: (Scalars['Float'] | null)
    /** The final price after applying the discount to the main product */
    main_final_price: (Scalars['Float'] | null)
    /** The regular price of the main product */
    main_price: (Scalars['Float'] | null)
    __typename: 'PriceDetails'
}


/** Contains the price range for a product. If the product has a single price, the minimum and maximum price will be the same. */
export interface PriceRange {
    /** The highest possible price for the product. */
    maximum_price: (ProductPrice | null)
    /** The lowest possible price for the product. */
    minimum_price: ProductPrice
    __typename: 'PriceRange'
}


/** Defines the price type. */
export type PriceTypeEnum = 'FIXED' | 'PERCENT' | 'DYNAMIC'


/** Defines whether a bundle product's price is displayed as the lowest possible value or as a range. */
export type PriceViewEnum = 'PRICE_RANGE' | 'AS_LOW_AS'


/** Contains a product attribute code and value. */
export interface ProductAttribute {
    /** The unique identifier for a product attribute code. */
    code: Scalars['String']
    /** The display value of the attribute. */
    value: Scalars['String']
    __typename: 'ProductAttribute'
}


/** Product custom attributes */
export interface ProductCustomAttributes {
    /** Errors when retrieving custom attributes metadata. */
    errors: (AttributeMetadataError | null)[]
    /** Requested custom attributes */
    items: (AttributeValueInterface | null)[]
    __typename: 'ProductCustomAttributes'
}


/** Contains the discount applied to a product price. */
export interface ProductDiscount {
    /** The actual value of the discount. */
    amount_off: (Scalars['Float'] | null)
    /** The discount expressed a percentage. */
    percent_off: (Scalars['Float'] | null)
    __typename: 'ProductDiscount'
}


/** Contains product image information, including the image URL and label. */
export interface ProductImage {
    /** Indicates whether the image is hidden from view. */
    disabled: (Scalars['Boolean'] | null)
    /** The label of the product image or video. */
    label: (Scalars['String'] | null)
    /** The media item's position after it has been sorted. */
    position: (Scalars['Int'] | null)
    /** The URL of the product image or video. */
    url: (Scalars['String'] | null)
    __typename: 'ProductImage'
}


/** Contains fields that are common to all types of products. */
export type ProductInterface = (BundleProduct | ConfigurableProduct | DownloadableProduct | GroupedProduct | SimpleProduct | VirtualProduct) & { __isUnion?: true }


/** An implementation of `ProductLinksInterface`. */
export interface ProductLinks {
    /** One of related, associated, upsell, or crosssell. */
    link_type: (Scalars['String'] | null)
    /** The SKU of the linked product. */
    linked_product_sku: (Scalars['String'] | null)
    /** The type of linked product (simple, virtual, bundle, downloadable, grouped, configurable). */
    linked_product_type: (Scalars['String'] | null)
    /** The position within the list of product links. */
    position: (Scalars['Int'] | null)
    /** The identifier of the linked product. */
    sku: (Scalars['String'] | null)
    __typename: 'ProductLinks'
}


/** Contains information about linked products, including the link type and product type of each item. */
export type ProductLinksInterface = (ProductLinks) & { __isUnion?: true }


/** Contains an image in base64 format and basic information about the image. */
export interface ProductMediaGalleryEntriesContent {
    /** The image in base64 format. */
    base64_encoded_data: (Scalars['String'] | null)
    /** The file name of the image. */
    name: (Scalars['String'] | null)
    /** The MIME type of the file, such as image/png. */
    type: (Scalars['String'] | null)
    __typename: 'ProductMediaGalleryEntriesContent'
}


/** Contains a link to a video file and basic information about the video. */
export interface ProductMediaGalleryEntriesVideoContent {
    /** Must be external-video. */
    media_type: (Scalars['String'] | null)
    /** A description of the video. */
    video_description: (Scalars['String'] | null)
    /** Optional data about the video. */
    video_metadata: (Scalars['String'] | null)
    /** Describes the video source. */
    video_provider: (Scalars['String'] | null)
    /** The title of the video. */
    video_title: (Scalars['String'] | null)
    /** The URL to the video. */
    video_url: (Scalars['String'] | null)
    __typename: 'ProductMediaGalleryEntriesVideoContent'
}


/** Represents a product price. */
export interface ProductPrice {
    /** The price discount. Represents the difference between the regular and final price. */
    discount: (ProductDiscount | null)
    /** The final price of the product after applying discounts. */
    final_price: Money
    /** The regular price of the product. */
    regular_price: Money
    __typename: 'ProductPrice'
}


/**
 * Deprecated. Use `PriceRange` instead. Contains the regular price of an item, as
 * well as its minimum and maximum prices. Only composite products, which include
 * bundle, configurable, and grouped products, can contain a minimum and maximum price.
 */
export interface ProductPrices {
    /**
     * @deprecated Use `PriceRange.maximum_price` instead.
     * The highest possible final price for all the options defined within a
     * composite product. If you are specifying a price range, this would be the `to` value.
     */
    maximalPrice: (Price | null)
    /**
     * @deprecated Use `PriceRange.minimum_price` instead.
     * The lowest possible final price for all the options defined within a composite
     * product. If you are specifying a price range, this would be the `from` value.
     */
    minimalPrice: (Price | null)
    /**
     * @deprecated Use `regular_price` from `PriceRange.minimum_price` or `PriceRange.maximum_price` instead.
     * The base price of a product.
     */
    regularPrice: (Price | null)
    __typename: 'ProductPrices'
}


/** Contains details of a product review. */
export interface ProductReview {
    /** The average of all ratings for this product. */
    average_rating: Scalars['Float']
    /** The date the review was created. */
    created_at: Scalars['String']
    /** The customer's nickname. Defaults to the customer name, if logged in. */
    nickname: Scalars['String']
    /** The reviewed product. */
    product: ProductInterface
    /** An array of ratings by rating category, such as quality, price, and value. */
    ratings_breakdown: (ProductReviewRating | null)[]
    /** The summary (title) of the review. */
    summary: Scalars['String']
    /** The review text. */
    text: Scalars['String']
    __typename: 'ProductReview'
}


/** Contains data about a single aspect of a product review. */
export interface ProductReviewRating {
    /** The label assigned to an aspect of a product that is being rated, such as quality or price. */
    name: Scalars['String']
    /** The rating value given by customer. By default, possible values range from 1 to 5. */
    value: Scalars['String']
    __typename: 'ProductReviewRating'
}


/** Contains details about a single aspect of a product review. */
export interface ProductReviewRatingMetadata {
    /** An encoded rating ID. */
    id: Scalars['String']
    /** The label assigned to an aspect of a product that is being rated, such as quality or price. */
    name: Scalars['String']
    /** List of product review ratings sorted by position. */
    values: (ProductReviewRatingValueMetadata | null)[]
    __typename: 'ProductReviewRatingMetadata'
}


/** Contains an array of metadata about each aspect of a product review. */
export interface ProductReviewRatingsMetadata {
    /** An array of product reviews sorted by position. */
    items: (ProductReviewRatingMetadata | null)[]
    __typename: 'ProductReviewRatingsMetadata'
}


/** Contains details about a single value in a product review. */
export interface ProductReviewRatingValueMetadata {
    /** A ratings scale, such as the number of stars awarded. */
    value: Scalars['String']
    /** An encoded rating value ID. */
    value_id: Scalars['String']
    __typename: 'ProductReviewRatingValueMetadata'
}


/** Contains an array of product reviews. */
export interface ProductReviews {
    /** An array of product reviews. */
    items: (ProductReview | null)[]
    /** Metadata for pagination rendering. */
    page_info: SearchResultPageInfo
    __typename: 'ProductReviews'
}


/** Contains the results of a `products` query. */
export interface Products {
    /** A bucket that contains the attribute code and label for each filterable option. */
    aggregations: ((Aggregation | null)[] | null)
    /**
     * @deprecated Use `aggregations` instead.
     * Layered navigation filters array.
     */
    filters: ((LayerFilter | null)[] | null)
    /** An array of products that match the specified search criteria. */
    items: ((ProductInterface | null)[] | null)
    /** An object that includes the page_info and currentPage values specified in the query. */
    page_info: (SearchResultPageInfo | null)
    /** An object that includes the default sort field and all available sort fields. */
    sort_fields: (SortFields | null)
    /** An array of search suggestions for case when search query have no results. */
    suggestions: ((SearchSuggestion | null)[] | null)
    /**
     * The number of products that are marked as visible. By default, in complex
     * products, parent products are visible, but their child products are not.
     */
    total_count: (Scalars['Int'] | null)
    __typename: 'Products'
}


/** This enumeration states whether a product stock status is in stock or out of stock */
export type ProductStockStatus = 'IN_STOCK' | 'OUT_OF_STOCK'


/**
 * Deprecated. Use `TierPrice` instead. Defines a tier price, which is a quantity
 * discount offered to a specific customer group.
 */
export interface ProductTierPrices {
    /**
     * @deprecated Not relevant for the storefront.
     * The ID of the customer group.
     */
    customer_group_id: (Scalars['String'] | null)
    /**
     * @deprecated Use `TierPrice.discount` instead.
     * The percentage discount of the item.
     */
    percentage_value: (Scalars['Float'] | null)
    /**
     * @deprecated Use `TierPrice.quantity` instead.
     * The number of items that must be purchased to qualify for tier pricing.
     */
    qty: (Scalars['Float'] | null)
    /**
     * @deprecated Use `TierPrice.final_price` instead.
     * The price of the fixed price item.
     */
    value: (Scalars['Float'] | null)
    /**
     * @deprecated Not relevant for the storefront.
     * The ID assigned to the website.
     */
    website_id: (Scalars['Float'] | null)
    __typename: 'ProductTierPrices'
}


/** Contains information about a product video. */
export interface ProductVideo {
    /** Indicates whether the image is hidden from view. */
    disabled: (Scalars['Boolean'] | null)
    /** The label of the product image or video. */
    label: (Scalars['String'] | null)
    /** The media item's position after it has been sorted. */
    position: (Scalars['Int'] | null)
    /** The URL of the product image or video. */
    url: (Scalars['String'] | null)
    /** Contains a `ProductMediaGalleryEntriesVideoContent` object. */
    video_content: (ProductMediaGalleryEntriesVideoContent | null)
    __typename: 'ProductVideo'
}

export interface Query {
    /**
     * Retrieve EAV attributes associated to a frontend form. Use countries query
     * provided by DirectoryGraphQl module to retrieve region_id and country_id
     * attribute options.
     */
    attributesForm: AttributesFormOutput
    /** Returns a list of attributes metadata for a given entity type. */
    attributesList: (AttributesMetadataOutput | null)
    /** Get a list of available store views and their config information. */
    availableStores: ((StoreConfig | null)[] | null)
    /** Return information about the specified shopping cart. */
    cart: (Cart | null)
    /** Return a list of categories that match the specified filter. */
    categories: (CategoryResult | null)
    /**
     * @deprecated Use `categories` instead.
     * Search for categories that match the criteria specified in the `search` and `filter` attributes.
     */
    category: (CategoryTree | null)
    /**
     * @deprecated Use `categories` instead.
     * Return an array of categories based on the specified filters.
     */
    categoryList: ((CategoryTree | null)[] | null)
    /** Return Terms and Conditions configuration information. */
    checkoutAgreements: ((CheckoutAgreement | null)[] | null)
    /** Return information about CMS blocks. */
    cmsBlocks: (CmsBlocks | null)
    /** Return details about a CMS page. */
    cmsPage: (CmsPage | null)
    /** Return products that have been added to the specified compare list. */
    compareList: (CompareList | null)
    /** The countries query provides information for all countries. */
    countries: ((Country | null)[] | null)
    /** The countries query provides information for a single country. */
    country: (Country | null)
    /** Return information about the store's currency. */
    currency: (Currency | null)
    /**
     * @deprecated Use `customAttributeMetadataV2` query instead.
     * Return the attribute type, given an attribute code and entity type.
     */
    customAttributeMetadata: (CustomAttributeMetadata | null)
    /** Retrieve EAV attributes metadata. */
    customAttributeMetadataV2: AttributesMetadataOutput
    /** Return detailed information about a customer account. */
    customer: (Customer | null)
    /** Return information about the customer's shopping cart. */
    customerCart: Cart
    /** Return a list of downloadable products the customer has purchased. */
    customerDownloadableProducts: (CustomerDownloadableProducts | null)
    /** @deprecated Use the `customer` query instead. */
    customerOrders: (CustomerOrders | null)
    /** Return a list of customer payment tokens stored in the vault. */
    customerPaymentTokens: (CustomerPaymentTokens | null)
    /** Retrieve the secure PayPal URL for a Payments Pro Hosted Solution transaction. */
    getHostedProUrl: (HostedProUrl | null)
    /** Retrieve payment credentials for a transaction. Use this query for Payflow Link and Payments Advanced payment methods. */
    getPayflowLinkToken: (PayflowLinkToken | null)
    /** Retrieves the payment configuration for a given location */
    getPaymentConfig: (PaymentConfigOutput | null)
    /** Retrieves the payment details for the order */
    getPaymentOrder: (PaymentOrderOutput | null)
    /** Gets the payment SDK urls and values */
    getPaymentSDK: (GetPaymentSDKOutput | null)
    /** Get the module's configuration to initialize Stripe Elements. */
    getStripeConfiguration: (ModuleConfiguration | null)
    /** Retrieves the vault configuration */
    getVaultConfig: (VaultConfigOutput | null)
    /** Retrieve guest order details based on number, email and postcode. */
    guestOrder: CustomerOrder
    /** Retrieve guest order details based on token. */
    guestOrderByToken: CustomerOrder
    /** Check whether the specified email has already been used to create a customer account. */
    isEmailAvailable: (IsEmailAvailableOutput | null)
    /** The pickup locations query searches for locations that match the search request requirements. */
    pickupLocations: (PickupLocations | null)
    /** Return the active ratings attributes and the values each rating can have. */
    productReviewRatingsMetadata: ProductReviewRatingsMetadata
    /** Search for products that match the criteria specified in the `search` and `filter` attributes. */
    products: (Products | null)
    /** Returns details about Google reCAPTCHA V3-Invisible configuration. */
    recaptchaV3Config: (ReCaptchaConfigurationV3 | null)
    /** Return the full details for a specified product, category, or CMS page. */
    route: (RoutableInterface | null)
    /** The snowdogMenuNodes query returns information about active nodes of a menu */
    snowdogMenuNodes: (SnowdogMenuNodes | null)
    /** The snowdogMenus query returns information about active menus */
    snowdogMenus: (SnowdogMenus | null)
    /** Return details about the store's configuration. */
    storeConfig: (StoreConfig | null)
    /**
     * @deprecated Use the `route` query instead.
     * Return the relative URL for a specified product, category or CMS page.
     */
    urlResolver: (EntityUrl | null)
    /**
     * @deprecated Moved under `Customer.wishlist`.
     * Return the contents of a customer's wish list.
     */
    wishlist: (WishlistOutput | null)
    __typename: 'Query'
}


/** Contains reCAPTCHA V3-Invisible configuration details. */
export interface ReCaptchaConfigurationV3 {
    /** The position of the invisible reCAPTCHA badge on each page. */
    badge_position: Scalars['String']
    /** The message that appears to the user if validation fails. */
    failure_message: Scalars['String']
    /** A list of forms on the storefront that have been configured to use reCAPTCHA V3. */
    forms: (ReCaptchaFormEnum | null)[]
    /** Return whether recaptcha is enabled or not */
    is_enabled: Scalars['Boolean']
    /** A two-character code that specifies the language that is used for Google reCAPTCHA text and messaging. */
    language_code: (Scalars['String'] | null)
    /** The minimum score that identifies a user interaction as a potential risk. */
    minimum_score: Scalars['Float']
    /** The website key generated when the Google reCAPTCHA account was registered. */
    website_key: Scalars['String']
    __typename: 'ReCaptchaConfigurationV3'
}

export type ReCaptchaFormEnum = 'PLACE_ORDER' | 'CONTACT' | 'CUSTOMER_LOGIN' | 'CUSTOMER_FORGOT_PASSWORD' | 'CUSTOMER_CREATE' | 'CUSTOMER_EDIT' | 'NEWSLETTER' | 'PRODUCT_REVIEW' | 'SENDFRIEND' | 'BRAINTREE'

export interface Region {
    /** The two-letter code for the region, such as TX for Texas. */
    code: (Scalars['String'] | null)
    /** The unique ID for a `Region` object. */
    id: (Scalars['Int'] | null)
    /** The name of the region, such as Texas. */
    name: (Scalars['String'] | null)
    __typename: 'Region'
}


/** Contains details about the cart after removing a coupon. */
export interface RemoveCouponFromCartOutput {
    /** The cart after removing a coupon. */
    cart: (Cart | null)
    __typename: 'RemoveCouponFromCartOutput'
}


/** Contains details about the cart after removing an item. */
export interface RemoveItemFromCartOutput {
    /** The cart after removing an item. */
    cart: Cart
    __typename: 'RemoveItemFromCartOutput'
}


/** Contains the customer's wish list and any errors encountered. */
export interface RemoveProductsFromWishlistOutput {
    /** An array of errors encountered while deleting products from a wish list. */
    user_errors: (WishListUserInputError | null)[]
    /** Contains the wish list with after items were successfully deleted. */
    wishlist: Wishlist
    __typename: 'RemoveProductsFromWishlistOutput'
}


/** Contains the cart and any errors after adding products. */
export interface ReorderItemsOutput {
    /** Detailed information about the customer's cart. */
    cart: Cart
    /** An array of reordering errors. */
    userInputErrors: (CheckoutUserInputError | null)[]
    __typename: 'ReorderItemsOutput'
}


/** Contains the result of a request to revoke a customer token. */
export interface RevokeCustomerTokenOutput {
    /** The result of a request to revoke a customer token. */
    result: Scalars['Boolean']
    __typename: 'RevokeCustomerTokenOutput'
}


/** Routable entities serve as the model for a rendered page. */
export type RoutableInterface = (BundleProduct | CategoryTree | CmsPage | ConfigurableProduct | DownloadableProduct | GroupedProduct | RoutableUrl | SimpleProduct | VirtualProduct) & { __isUnion?: true }


/** Default implementation of RoutableInterface. This type is returned when the URL is not linked to an entity. */
export interface RoutableUrl {
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code: Scalars['Int']
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    __typename: 'RoutableUrl'
}


/** Contains details about a comment. */
export interface SalesCommentItem {
    /** The text of the message. */
    message: Scalars['String']
    /** The timestamp of the comment. */
    timestamp: Scalars['String']
    __typename: 'SalesCommentItem'
}

export interface SalesItemInterface {
    /** The entered gift message for the order item */
    gift_message: (GiftMessage | null)
    __typename: 'SalesItemInterface'
}


/** This enumeration defines the scope type for customer orders. */
export type ScopeTypeEnum = 'GLOBAL' | 'WEBSITE' | 'STORE'


/** Defines the name and value of a SDK parameter */
export interface SDKParams {
    /** The name of the SDK parameter */
    name: (Scalars['String'] | null)
    /** The value of the SDK parameter */
    value: (Scalars['String'] | null)
    __typename: 'SDKParams'
}


/** Provides navigation for the query response. */
export interface SearchResultPageInfo {
    /** The specific page to return. */
    current_page: (Scalars['Int'] | null)
    /** The maximum number of items to return per page of results. */
    page_size: (Scalars['Int'] | null)
    /** The total number of pages in the response. */
    total_pages: (Scalars['Int'] | null)
    __typename: 'SearchResultPageInfo'
}


/** A string that contains search suggestion */
export interface SearchSuggestion {
    /** The search suggestion of existing product. */
    search: Scalars['String']
    __typename: 'SearchSuggestion'
}


/** Contains details about a selected bundle option. */
export interface SelectedBundleOption {
    /** @deprecated Use `uid` instead */
    id: Scalars['Int']
    /** The display name of the selected bundle product option. */
    label: Scalars['String']
    /** The type of selected bundle product option. */
    type: Scalars['String']
    /** The unique ID for a `SelectedBundleOption` object */
    uid: Scalars['ID']
    /** An array of selected bundle option values. */
    values: (SelectedBundleOptionValue | null)[]
    __typename: 'SelectedBundleOption'
}


/** Contains details about a value for a selected bundle option. */
export interface SelectedBundleOptionValue {
    /** Use `uid` instead */
    id: Scalars['Int']
    /** The display name of the value for the selected bundle product option. */
    label: Scalars['String']
    /** The price of the value for the selected bundle product option. */
    price: Scalars['Float']
    /** The quantity of the value for the selected bundle product option. */
    quantity: Scalars['Float']
    /** The unique ID for a `SelectedBundleOptionValue` object */
    uid: Scalars['ID']
    __typename: 'SelectedBundleOptionValue'
}


/** Contains details about a selected configurable option. */
export interface SelectedConfigurableOption {
    /** The unique ID for a `ConfigurableProductOptions` object. */
    configurable_product_option_uid: Scalars['ID']
    /** The unique ID for a `ConfigurableProductOptionsValues` object. */
    configurable_product_option_value_uid: Scalars['ID']
    /** @deprecated Use `SelectedConfigurableOption.configurable_product_option_uid` instead. */
    id: Scalars['Int']
    /** The display text for the option. */
    option_label: Scalars['String']
    /** @deprecated Use `SelectedConfigurableOption.configurable_product_option_value_uid` instead. */
    value_id: Scalars['Int']
    /** The display name of the selected configurable option. */
    value_label: Scalars['String']
    __typename: 'SelectedConfigurableOption'
}


/** Identifies a customized product that has been placed in a cart. */
export interface SelectedCustomizableOption {
    /**
     * The unique ID for a specific `CustomizableOptionInterface` object, such as a
     * `CustomizableFieldOption`, `CustomizableFileOption`, or
     * `CustomizableAreaOption` object.
     */
    customizable_option_uid: Scalars['ID']
    /** @deprecated Use `SelectedCustomizableOption.customizable_option_uid` instead. */
    id: Scalars['Int']
    /** Indicates whether the customizable option is required. */
    is_required: Scalars['Boolean']
    /** The display name of the selected customizable option. */
    label: Scalars['String']
    /** A value indicating the order to display this option. */
    sort_order: Scalars['Int']
    /** The type of `CustomizableOptionInterface` object. */
    type: Scalars['String']
    /** An array of selectable values. */
    values: (SelectedCustomizableOptionValue | null)[]
    __typename: 'SelectedCustomizableOption'
}


/** Identifies the value of the selected customized option. */
export interface SelectedCustomizableOptionValue {
    /** The unique ID for a value object that corresponds to the object represented by the `customizable_option_uid` attribute. */
    customizable_option_value_uid: Scalars['ID']
    /** @deprecated Use `SelectedCustomizableOptionValue.customizable_option_value_uid` instead. */
    id: Scalars['Int']
    /** The display name of the selected value. */
    label: Scalars['String']
    /** The price of the selected customizable value. */
    price: CartItemSelectedOptionValuePrice
    /** The text identifying the selected value. */
    value: Scalars['String']
    __typename: 'SelectedCustomizableOptionValue'
}


/** Describes the payment method the shopper selected. */
export interface SelectedPaymentMethod {
    /** The payment method code. */
    code: Scalars['String']
    /** The purchase order number. */
    purchase_order_number: (Scalars['String'] | null)
    /** The payment method title. */
    title: Scalars['String']
    __typename: 'SelectedPaymentMethod'
}


/** Contains details about the selected shipping method and carrier. */
export interface SelectedShippingMethod {
    /** The cost of shipping using this shipping method. */
    amount: Money
    /** @deprecated The field should not be used on the storefront. */
    base_amount: (Money | null)
    /** A string that identifies a commercial carrier or an offline shipping method. */
    carrier_code: Scalars['String']
    /** The label for the carrier code. */
    carrier_title: Scalars['String']
    /** A shipping method code associated with a carrier. */
    method_code: Scalars['String']
    /** The label for the method code. */
    method_title: Scalars['String']
    /** The cost of shipping using this shipping method, excluding tax. */
    price_excl_tax: Money
    /** The cost of shipping using this shipping method, including tax. */
    price_incl_tax: Money
    __typename: 'SelectedShippingMethod'
}


/** Contains information about the sender and recipients. */
export interface SendEmailToFriendOutput {
    /** An array containing information about each recipient. */
    recipients: ((SendEmailToFriendRecipient | null)[] | null)
    /** Information about the customer and the content of the message. */
    sender: (SendEmailToFriendSender | null)
    __typename: 'SendEmailToFriendOutput'
}


/** An output object that contains information about the recipient. */
export interface SendEmailToFriendRecipient {
    /** The email address of the recipient. */
    email: Scalars['String']
    /** The name of the recipient. */
    name: Scalars['String']
    __typename: 'SendEmailToFriendRecipient'
}


/** An output object that contains information about the sender. */
export interface SendEmailToFriendSender {
    /** The email address of the sender. */
    email: Scalars['String']
    /** The text of the message to be sent. */
    message: Scalars['String']
    /** The name of the sender. */
    name: Scalars['String']
    __typename: 'SendEmailToFriendSender'
}


/** Contains details about the configuration of the Email to a Friend feature. */
export interface SendFriendConfiguration {
    /** Indicates whether the Email to a Friend feature is enabled. */
    enabled_for_customers: Scalars['Boolean']
    /** Indicates whether the Email to a Friend feature is enabled for guests. */
    enabled_for_guests: Scalars['Boolean']
    __typename: 'SendFriendConfiguration'
}


/** Contains details about the cart after setting the billing address. */
export interface SetBillingAddressOnCartOutput {
    /** The cart after setting the billing address. */
    cart: Cart
    __typename: 'SetBillingAddressOnCartOutput'
}


/** Sets the cart as inactive */
export interface SetCartAsInactiveOutput {
    /** The error message returned after failing to set the cart as inactive */
    error: (Scalars['String'] | null)
    /** Indicates whether the cart was set as inactive */
    success: Scalars['Boolean']
    __typename: 'SetCartAsInactiveOutput'
}


/** Contains details about the cart after setting the email of a guest. */
export interface SetGuestEmailOnCartOutput {
    /** The cart after setting the guest email. */
    cart: Cart
    __typename: 'SetGuestEmailOnCartOutput'
}


/** Contains details about the cart after setting the payment method. */
export interface SetPaymentMethodOnCartOutput {
    /** The cart after setting the payment method. */
    cart: Cart
    __typename: 'SetPaymentMethodOnCartOutput'
}


/** Contains details about the cart after setting the shipping addresses. */
export interface SetShippingAddressesOnCartOutput {
    /** The cart after setting the shipping addresses. */
    cart: Cart
    __typename: 'SetShippingAddressesOnCartOutput'
}


/** Contains details about the cart after setting the shipping methods. */
export interface SetShippingMethodsOnCartOutput {
    /** The cart after setting the shipping methods. */
    cart: Cart
    __typename: 'SetShippingMethodsOnCartOutput'
}


/** Defines whether bundle items must be shipped together. */
export type ShipBundleItemsEnum = 'TOGETHER' | 'SEPARATELY'

export interface ShipmentItem {
    /** The unique ID for a `ShipmentItemInterface` object. */
    id: Scalars['ID']
    /** The order item associated with the shipment item. */
    order_item: (OrderItemInterface | null)
    /** The name of the base product. */
    product_name: (Scalars['String'] | null)
    /** The sale price for the base product. */
    product_sale_price: Money
    /** The SKU of the base product. */
    product_sku: Scalars['String']
    /** The number of shipped items. */
    quantity_shipped: Scalars['Float']
    __typename: 'ShipmentItem'
}


/** Order shipment item details. */
export type ShipmentItemInterface = (BundleShipmentItem | ShipmentItem) & { __isUnion?: true }


/** Contains order shipment tracking details. */
export interface ShipmentTracking {
    /** The shipping carrier for the order delivery. */
    carrier: Scalars['String']
    /** The tracking number of the order shipment. */
    number: (Scalars['String'] | null)
    /** The shipment tracking title. */
    title: Scalars['String']
    __typename: 'ShipmentTracking'
}


/** Contains shipping addresses and methods. */
export interface ShippingCartAddress {
    /** An array that lists the shipping methods that can be applied to the cart. */
    available_shipping_methods: ((AvailableShippingMethod | null)[] | null)
    /** @deprecated Use `cart_items_v2` instead. */
    cart_items: ((CartItemQuantity | null)[] | null)
    /** An array that lists the items in the cart. */
    cart_items_v2: ((CartItemInterface | null)[] | null)
    /** The city specified for the billing or shipping address. */
    city: Scalars['String']
    /** The company specified for the billing or shipping address. */
    company: (Scalars['String'] | null)
    /** An object containing the country label and code. */
    country: CartAddressCountry
    /** Text provided by the shopper. */
    customer_notes: (Scalars['String'] | null)
    /** The customer's fax number. */
    fax: (Scalars['String'] | null)
    /** The first name of the customer or guest. */
    firstname: Scalars['String']
    /** @deprecated This information should not be exposed on the frontend. */
    items_weight: (Scalars['Float'] | null)
    /** The last name of the customer or guest. */
    lastname: Scalars['String']
    /** The middle name of the person associated with the billing/shipping address. */
    middlename: (Scalars['String'] | null)
    pickup_location_code: (Scalars['String'] | null)
    /** The ZIP or postal code of the billing or shipping address. */
    postcode: (Scalars['String'] | null)
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix: (Scalars['String'] | null)
    /** An object containing the region label and code. */
    region: (CartAddressRegion | null)
    /** An object that describes the selected shipping method. */
    selected_shipping_method: (SelectedShippingMethod | null)
    /** An array containing the street for the billing or shipping address. */
    street: (Scalars['String'] | null)[]
    /** A value such as Sr., Jr., or III. */
    suffix: (Scalars['String'] | null)
    /** The telephone number for the billing or shipping address. */
    telephone: (Scalars['String'] | null)
    /** The unique id of the customer address. */
    uid: Scalars['String']
    /** The VAT company number for billing or shipping address. */
    vat_id: (Scalars['String'] | null)
    __typename: 'ShippingCartAddress'
}


/** Defines an individual shipping discount. This discount can be applied to shipping. */
export interface ShippingDiscount {
    /** The amount of the discount. */
    amount: Money
    __typename: 'ShippingDiscount'
}


/** Contains details about shipping and handling costs. */
export interface ShippingHandling {
    /** The shipping amount, excluding tax. */
    amount_excluding_tax: (Money | null)
    /** The shipping amount, including tax. */
    amount_including_tax: (Money | null)
    /** The applied discounts to the shipping. */
    discounts: ((ShippingDiscount | null)[] | null)
    /** Details about taxes applied for shipping. */
    taxes: ((TaxItem | null)[] | null)
    /** The total amount for shipping. */
    total_amount: Money
    __typename: 'ShippingHandling'
}


/** An implementation for simple product cart items. */
export interface SimpleCartItem {
    /** An array containing the customizable options the shopper selected. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** An array of errors encountered while loading the cart item */
    errors: ((CartItemError | null)[] | null)
    /** The entered gift message for the cart item */
    gift_message: (GiftMessage | null)
    /** @deprecated Use `uid` instead. */
    id: Scalars['String']
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available: Scalars['Boolean']
    /** Contains details about the price of the item, including taxes and discounts. */
    prices: (CartItemPrices | null)
    /** Details about an item in the cart. */
    product: ProductInterface
    /** The quantity of this item in the cart. */
    quantity: Scalars['Float']
    /** The unique ID for a `CartItemInterface` object. */
    uid: Scalars['ID']
    __typename: 'SimpleCartItem'
}


/** Defines a simple product, which is tangible and is usually sold in single units or in fixed quantities. */
export interface SimpleProduct {
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id: (Scalars['Int'] | null)
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url: (Scalars['String'] | null)
    /** The categories assigned to a product. */
    categories: ((CategoryInterface | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    color: (Scalars['Int'] | null)
    /** The product's country of origin. */
    country_of_manufacture: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at: (Scalars['String'] | null)
    /** Crosssell Products */
    crosssell_products: ((ProductInterface | null)[] | null)
    /** Product custom attributes. */
    custom_attributesV2: (ProductCustomAttributes | null)
    /** Detailed information about the product. The value can include simple HTML tags. */
    description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size: (Scalars['String'] | null)
    /** Indicates whether a gift message is available. */
    gift_message_available: (Scalars['String'] | null)
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id: (Scalars['Int'] | null)
    /** The relative path to the main image on the product page. */
    image: (ProductImage | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested: (Scalars['Int'] | null)
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer: (Scalars['Int'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2: (Scalars['Int'] | null)
    /** An array of media gallery objects. */
    media_gallery: ((MediaGalleryInterface | null)[] | null)
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries: ((MediaGalleryEntry | null)[] | null)
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description: (Scalars['String'] | null)
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword: (Scalars['String'] | null)
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title: (Scalars['String'] | null)
    /** The product name. Customers use this name to identify the product. */
    name: (Scalars['String'] | null)
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date: (Scalars['String'] | null)
    /** The end date for new product listings. */
    new_to_date: (Scalars['String'] | null)
    /** Product stock only x left count */
    only_x_left_in_stock: (Scalars['Float'] | null)
    /** An array of options for a customizable product. */
    options: ((CustomizableOptionInterface | null)[] | null)
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container: (Scalars['String'] | null)
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price: (ProductPrices | null)
    /** The range of prices for the product */
    price_range: PriceRange
    /** An array of `TierPrice` objects. */
    price_tiers: ((TierPrice | null)[] | null)
    /** An array of `ProductLinks` objects. */
    product_links: ((ProductLinksInterface | null)[] | null)
    /** The average of all the ratings given to the product. */
    rating_summary: Scalars['Float']
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code: Scalars['Int']
    /** An array of products to be displayed in a Related Products block. */
    related_products: ((ProductInterface | null)[] | null)
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    /** The total count of all the reviews given to the product. */
    review_count: Scalars['Int']
    /** The list of products reviews. */
    reviews: ProductReviews
    /** A short description of the product. Its use depends on the theme. */
    short_description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    size: (Scalars['Int'] | null)
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku: (Scalars['String'] | null)
    /** The relative path to the small image, which is used on catalog pages. */
    small_image: (ProductImage | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date: (Scalars['String'] | null)
    /** The discounted price of the product. */
    special_price: (Scalars['Float'] | null)
    /** The end date for a product with a special price. */
    special_to_date: (Scalars['String'] | null)
    /** Stock status of the product */
    stock_status: (ProductStockStatus | null)
    /** The file name of a swatch image. */
    swatch_image: (Scalars['String'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tema: (Scalars['Int'] | null)
    /** The relative path to the product's thumbnail image. */
    thumbnail: (ProductImage | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price: (Scalars['Float'] | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices: ((ProductTierPrices | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia: (Scalars['Int'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id: (Scalars['String'] | null)
    /** The unique ID for a `ProductInterface` object. */
    uid: Scalars['ID']
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at: (Scalars['String'] | null)
    /** Upsell Products */
    upsell_products: ((ProductInterface | null)[] | null)
    /** The part of the URL that identifies the product */
    url_key: (Scalars['String'] | null)
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path: (Scalars['String'] | null)
    /** URL rewrites list */
    url_rewrites: ((UrlRewrite | null)[] | null)
    /** The part of the product URL that is appended after the url key */
    url_suffix: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites: ((Website | null)[] | null)
    /** The weight of the item, in units defined by the store. */
    weight: (Scalars['Float'] | null)
    __typename: 'SimpleProduct'
}


/** Contains a simple product wish list item. */
export interface SimpleWishlistItem {
    /** The date and time the item was added to the wish list. */
    added_at: Scalars['String']
    /** Custom options selected for the wish list item. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** The description of the item. */
    description: (Scalars['String'] | null)
    /** The unique ID for a `WishlistItemInterface` object. */
    id: Scalars['ID']
    /** Product details of the wish list item. */
    product: (ProductInterface | null)
    /** The quantity of this wish list item. */
    quantity: Scalars['Float']
    __typename: 'SimpleWishlistItem'
}

export interface SmartButtonsConfig {
    /** Indicated whether to use App Switch on enabled mobile devices */
    app_switch_when_available: (Scalars['Boolean'] | null)
    /** The styles for the PayPal Smart Button configuration */
    button_styles: (ButtonStyles | null)
    /** The payment method code as defined in the payment gateway */
    code: (Scalars['String'] | null)
    /** Indicates whether to display the PayPal Pay Later message */
    display_message: (Scalars['Boolean'] | null)
    /** Indicates whether to display Venmo */
    display_venmo: (Scalars['Boolean'] | null)
    /** Indicates whether the payment method is displayed */
    is_visible: (Scalars['Boolean'] | null)
    /** Contains details about the styles for the PayPal Pay Later message */
    message_styles: (MessageStyles | null)
    /** Defines the payment intent (Authorize or Capture */
    payment_intent: (Scalars['String'] | null)
    /** The PayPal parameters required to load the JS SDK */
    sdk_params: ((SDKParams | null)[] | null)
    /** The relative order the payment method is displayed on the checkout page */
    sort_order: (Scalars['String'] | null)
    /** The name displayed for the payment method */
    title: (Scalars['String'] | null)
    __typename: 'SmartButtonsConfig'
}


/** SnowdogMenu defines all menu information */
export interface SnowdogMenu {
    /** Menu creation time */
    creation_time: Scalars['String']
    /** Menu CSS class */
    css_class: (Scalars['String'] | null)
    /** Menu identifier */
    identifier: Scalars['String']
    /** Menu ID */
    menu_id: Scalars['Int']
    /** Menu nodes */
    nodes: (SnowdogMenuNodes | null)
    /** Menu title */
    title: Scalars['String']
    /** Menu update time */
    update_time: Scalars['String']
    __typename: 'SnowdogMenu'
}


/** Snowdog menu CMS page node type */
export interface SnowdogMenuCmsPageNode {
    /** Node additional data */
    additional_data: ((Scalars['String'] | null)[] | null)
    /** Node classes */
    classes: (Scalars['String'] | null)
    /** Node content */
    content: (Scalars['String'] | null)
    /** Node creation time */
    creation_time: Scalars['String']
    /** Node level */
    level: Scalars['Int']
    /** Menu ID */
    menu_id: Scalars['Int']
    /** Node ID */
    node_id: Scalars['Int']
    /** Node template */
    node_template: (Scalars['String'] | null)
    /** Node parent ID */
    parent_id: (Scalars['Int'] | null)
    /** Node position */
    position: Scalars['Int']
    /** Node submenu template */
    submenu_template: (Scalars['String'] | null)
    /** Node title */
    title: (Scalars['String'] | null)
    /** Node type */
    type: Scalars['String']
    /** Node update time */
    update_time: Scalars['String']
    /** Returns the url key when available */
    url_key: (Scalars['String'] | null)
    __typename: 'SnowdogMenuCmsPageNode'
}


/** Snowdog menu custom URL node type */
export interface SnowdogMenuCustomUrlNode {
    /** Node additional data */
    additional_data: ((Scalars['String'] | null)[] | null)
    /** Node classes */
    classes: (Scalars['String'] | null)
    /** Node content */
    content: (Scalars['String'] | null)
    /** Node creation time */
    creation_time: Scalars['String']
    /** Node image */
    image: (Scalars['String'] | null)
    /** Node image alt text */
    image_alt_text: (Scalars['String'] | null)
    /** Node level */
    level: Scalars['Int']
    /** Menu ID */
    menu_id: Scalars['Int']
    /** Node ID */
    node_id: Scalars['Int']
    /** Node template */
    node_template: (Scalars['String'] | null)
    /** Node parent ID */
    parent_id: (Scalars['Int'] | null)
    /** Node position */
    position: Scalars['Int']
    /** Node submenu template */
    submenu_template: (Scalars['String'] | null)
    /** Node target (false for '_self', true for '_blank') */
    target: Scalars['Boolean']
    /** Node title */
    title: (Scalars['String'] | null)
    /** Node type */
    type: Scalars['String']
    /** Node update time */
    update_time: Scalars['String']
    /** Returns the url key when available */
    url_key: (Scalars['String'] | null)
    __typename: 'SnowdogMenuCustomUrlNode'
}


/** SnowdogMenuCustomUrlNodeInterface contains custom URL nodes specific fields */
export type SnowdogMenuCustomUrlNodeInterface = (SnowdogMenuCustomUrlNode) & { __isUnion?: true }


/** Snowdog menu default node type */
export interface SnowdogMenuNode {
    /** Node additional data */
    additional_data: ((Scalars['String'] | null)[] | null)
    /** Node classes */
    classes: (Scalars['String'] | null)
    /** Node content */
    content: (Scalars['String'] | null)
    /** Node creation time */
    creation_time: Scalars['String']
    /** Node image */
    image: (Scalars['String'] | null)
    /** Node image alt text */
    image_alt_text: (Scalars['String'] | null)
    /** Node level */
    level: Scalars['Int']
    /** Menu ID */
    menu_id: Scalars['Int']
    /** Node ID */
    node_id: Scalars['Int']
    /** Node template */
    node_template: (Scalars['String'] | null)
    /** Node parent ID */
    parent_id: (Scalars['Int'] | null)
    /** Node position */
    position: Scalars['Int']
    /** Node submenu template */
    submenu_template: (Scalars['String'] | null)
    /** Node title */
    title: (Scalars['String'] | null)
    /** Node type */
    type: Scalars['String']
    /** Node update time */
    update_time: Scalars['String']
    /** Returns the url key when available */
    url_key: (Scalars['String'] | null)
    __typename: 'SnowdogMenuNode'
}


/** SnowdogMenuNodeContentFieldsInterface defines node content field */
export type SnowdogMenuNodeContentFieldInterface = (SnowdogMenuCmsPageNode | SnowdogMenuCustomUrlNode | SnowdogMenuNode) & { __isUnion?: true }


/** SnowdogMenuNodeContentFieldsInterface defines node image fields */
export type SnowdogMenuNodeImageFieldInterface = (SnowdogMenuCustomUrlNode | SnowdogMenuNode) & { __isUnion?: true }


/** SnowdogMenuNodeInterface contains the fields that are common to all types of nodes */
export type SnowdogMenuNodeInterface = (SnowdogMenuCmsPageNode | SnowdogMenuCustomUrlNode | SnowdogMenuNode | SnowdogMenuWrapperNode) & { __isUnion?: true }


/** Menu nodes information */
export interface SnowdogMenuNodes {
    /** An array of menu nodes */
    items: ((SnowdogMenuNodeInterface | null)[] | null)
    __typename: 'SnowdogMenuNodes'
}


/** Menus information */
export interface SnowdogMenus {
    /** An array of menus */
    items: (SnowdogMenu | null)[]
    __typename: 'SnowdogMenus'
}


/** Snowdog menu wrapper node type */
export interface SnowdogMenuWrapperNode {
    /** Node additional data */
    additional_data: ((Scalars['String'] | null)[] | null)
    /** Node classes */
    classes: (Scalars['String'] | null)
    /** Node creation time */
    creation_time: Scalars['String']
    /** Node level */
    level: Scalars['Int']
    /** Menu ID */
    menu_id: Scalars['Int']
    /** Node ID */
    node_id: Scalars['Int']
    /** Node template */
    node_template: (Scalars['String'] | null)
    /** Node parent ID */
    parent_id: (Scalars['Int'] | null)
    /** Node position */
    position: Scalars['Int']
    /** Node submenu template */
    submenu_template: (Scalars['String'] | null)
    /** Node title */
    title: (Scalars['String'] | null)
    /** Node type */
    type: Scalars['String']
    /** Node update time */
    update_time: Scalars['String']
    /** Returns the url key when available */
    url_key: (Scalars['String'] | null)
    __typename: 'SnowdogMenuWrapperNode'
}


/** Indicates whether to return results in ascending or descending order. */
export type SortEnum = 'ASC' | 'DESC'


/** Defines a possible sort field. */
export interface SortField {
    /** The label of the sort field. */
    label: (Scalars['String'] | null)
    /** The attribute code of the sort field. */
    value: (Scalars['String'] | null)
    __typename: 'SortField'
}


/** Contains a default value for sort fields and all available sort fields. */
export interface SortFields {
    /** The default sort field value. */
    default: (Scalars['String'] | null)
    /** An array of possible sort fields. */
    options: ((SortField | null)[] | null)
    __typename: 'SortFields'
}


/** Specifies the field to use for sorting quote items */
export type SortQuoteItemsEnum = 'ITEM_ID' | 'CREATED_AT' | 'UPDATED_AT' | 'PRODUCT_ID' | 'SKU' | 'NAME' | 'DESCRIPTION' | 'WEIGHT' | 'QTY' | 'PRICE' | 'BASE_PRICE' | 'CUSTOM_PRICE' | 'DISCOUNT_PERCENT' | 'DISCOUNT_AMOUNT' | 'BASE_DISCOUNT_AMOUNT' | 'TAX_PERCENT' | 'TAX_AMOUNT' | 'BASE_TAX_AMOUNT' | 'ROW_TOTAL' | 'BASE_ROW_TOTAL' | 'ROW_TOTAL_WITH_DISCOUNT' | 'ROW_WEIGHT' | 'PRODUCT_TYPE' | 'BASE_TAX_BEFORE_DISCOUNT' | 'TAX_BEFORE_DISCOUNT' | 'ORIGINAL_CUSTOM_PRICE' | 'PRICE_INC_TAX' | 'BASE_PRICE_INC_TAX' | 'ROW_TOTAL_INC_TAX' | 'BASE_ROW_TOTAL_INC_TAX' | 'DISCOUNT_TAX_COMPENSATION_AMOUNT' | 'BASE_DISCOUNT_TAX_COMPENSATION_AMOUNT' | 'FREE_SHIPPING'


/** Contains information about a store's configuration. */
export interface StoreConfig {
    /** Contains scripts that must be included in the HTML before the closing `<body>` tag. */
    absolute_footer: (Scalars['String'] | null)
    /** Indicates whether guest users can write product reviews. Possible values: 1 (Yes) and 0 (No). */
    allow_guests_to_write_product_reviews: (Scalars['String'] | null)
    /** The value of the Allow Gift Messages for Order Items option */
    allow_items: (Scalars['String'] | null)
    /** The value of the Allow Gift Messages on Order Level option */
    allow_order: (Scalars['String'] | null)
    /** Indicates whether to enable autocomplete on login and forgot password forms. */
    autocomplete_on_storefront: (Scalars['Boolean'] | null)
    /** The base currency code. */
    base_currency_code: (Scalars['String'] | null)
    /** A fully-qualified URL that is used to create relative links to the `base_url`. */
    base_link_url: (Scalars['String'] | null)
    /** The fully-qualified URL that specifies the location of media files. */
    base_media_url: (Scalars['String'] | null)
    /** The fully-qualified URL that specifies the location of static view files. */
    base_static_url: (Scalars['String'] | null)
    /** The store’s fully-qualified base URL. */
    base_url: (Scalars['String'] | null)
    /** Extended Config Data - checkout/cart/delete_quote_after */
    cart_expires_in_days: (Scalars['Int'] | null)
    /** Extended Config Data - checkout/cart_link/use_qty */
    cart_summary_display_quantity: (Scalars['Int'] | null)
    /** The default sort order of the search results list. */
    catalog_default_sort_by: (Scalars['String'] | null)
    /** The suffix applied to category pages, such as `.htm` or `.html`. */
    category_url_suffix: (Scalars['String'] | null)
    /** Indicates whether only specific countries can use this payment method. */
    check_money_order_enable_for_specific_countries: (Scalars['Boolean'] | null)
    /** Indicates whether the Check/Money Order payment method is enabled. */
    check_money_order_enabled: (Scalars['Boolean'] | null)
    /** The name of the party to whom the check must be payable. */
    check_money_order_make_check_payable_to: (Scalars['String'] | null)
    /** The maximum order amount required to qualify for the Check/Money Order payment method. */
    check_money_order_max_order_total: (Scalars['String'] | null)
    /** The minimum order amount required to qualify for the Check/Money Order payment method. */
    check_money_order_min_order_total: (Scalars['String'] | null)
    /** The status of new orders placed using the Check/Money Order payment method. */
    check_money_order_new_order_status: (Scalars['String'] | null)
    /** A comma-separated list of specific countries allowed to use the Check/Money Order payment method. */
    check_money_order_payment_from_specific_countries: (Scalars['String'] | null)
    /** The full street address or PO Box where the checks are mailed. */
    check_money_order_send_check_to: (Scalars['String'] | null)
    /**
     * A number indicating the position of the Check/Money Order payment method in
     * the list of available payment methods during checkout.
     */
    check_money_order_sort_order: (Scalars['Int'] | null)
    /** The title of the Check/Money Order payment method displayed on the storefront. */
    check_money_order_title: (Scalars['String'] | null)
    /** The name of the CMS page that identifies the home page for the store. */
    cms_home_page: (Scalars['String'] | null)
    /** A specific CMS page that displays when cookies are not enabled for the browser. */
    cms_no_cookies: (Scalars['String'] | null)
    /** A specific CMS page that displays when a 404 'Page Not Found' error occurs. */
    cms_no_route: (Scalars['String'] | null)
    /**
     * @deprecated Use `store_code` instead.
     * A code assigned to the store to identify it.
     */
    code: (Scalars['String'] | null)
    /** Indicates whether the `parent` or child (`itself`) thumbnail should be used in the cart for configurable products. */
    configurable_thumbnail_source: (Scalars['String'] | null)
    /** Indicates whether the Contact Us form in enabled. */
    contact_enabled: Scalars['Boolean']
    /** The copyright statement that appears at the bottom of each page. */
    copyright: (Scalars['String'] | null)
    /** Extended Config Data - general/region/state_required */
    countries_with_required_region: (Scalars['String'] | null)
    /** Indicates if the new accounts need confirmation. */
    create_account_confirmation: (Scalars['Boolean'] | null)
    /** Customer access token lifetime. */
    customer_access_token_lifetime: (Scalars['Float'] | null)
    /** Extended Config Data - general/country/default */
    default_country: (Scalars['String'] | null)
    /**
     * The description that provides a summary of your site for search engine
     * listings. It should not be more than 160 characters in length.
     */
    default_description: (Scalars['String'] | null)
    /** The default display currency code. */
    default_display_currency_code: (Scalars['String'] | null)
    /** A series of keywords that describe your store, each separated by a comma. */
    default_keywords: (Scalars['String'] | null)
    /** The title that appears at the title bar of each page when viewed in a browser. */
    default_title: (Scalars['String'] | null)
    /** Controls the display of the demo store notice at the top of the page. Options: 0 (No) or 1 (Yes). */
    demonotice: (Scalars['Int'] | null)
    /** Extended Config Data - general/region/display_all */
    display_state_if_optional: (Scalars['Boolean'] | null)
    /** The landing page that is associated with the base URL. */
    front: (Scalars['String'] | null)
    /** The default number of products per page in Grid View. */
    grid_per_page: (Scalars['Int'] | null)
    /** A list of numbers that define how many products can be displayed in Grid View. */
    grid_per_page_values: (Scalars['String'] | null)
    /** Scripts that must be included in the HTML before the closing `<head>` tag. */
    head_includes: (Scalars['String'] | null)
    /** The small graphic image (favicon) that appears in the address bar and tab of the browser. */
    head_shortcut_icon: (Scalars['String'] | null)
    /** The path to the logo that appears in the header. */
    header_logo_src: (Scalars['String'] | null)
    /**
     * @deprecated Use `store_code` instead.
     * The ID number assigned to the store.
     */
    id: (Scalars['Int'] | null)
    /** Indicates whether the store view has been designated as the default within the store group. */
    is_default_store: (Scalars['Boolean'] | null)
    /** Indicates whether the store group has been designated as the default within the website. */
    is_default_store_group: (Scalars['Boolean'] | null)
    /** Extended Config Data - checkout/options/guest_checkout */
    is_guest_checkout_enabled: (Scalars['Boolean'] | null)
    /** Extended Config Data - checkout/options/onepage_checkout_enabled */
    is_one_page_checkout_enabled: (Scalars['Boolean'] | null)
    /** The format of the search results list. */
    list_mode: (Scalars['String'] | null)
    /** The default number of products per page in List View. */
    list_per_page: (Scalars['Int'] | null)
    /** A list of numbers that define how many products can be displayed in List View. */
    list_per_page_values: (Scalars['String'] | null)
    /** The store locale. */
    locale: (Scalars['String'] | null)
    /** The Alt text that is associated with the logo. */
    logo_alt: (Scalars['String'] | null)
    /** The height of the logo image, in pixels. */
    logo_height: (Scalars['Int'] | null)
    /** The width of the logo image, in pixels. */
    logo_width: (Scalars['Int'] | null)
    /** Indicates whether wishlists are enabled (1) or disabled (0). */
    magento_wishlist_general_is_enabled: (Scalars['String'] | null)
    /** Extended Config Data - checkout/options/max_items_display_count */
    max_items_in_order_summary: (Scalars['Int'] | null)
    /** Extended Config Data - checkout/sidebar/display */
    minicart_display: (Scalars['Boolean'] | null)
    /** Extended Config Data - checkout/sidebar/count */
    minicart_max_items: (Scalars['Int'] | null)
    /** The minimum number of characters required for a valid password. */
    minimum_password_length: (Scalars['String'] | null)
    /** Indicates whether newsletters are enabled. */
    newsletter_enabled: Scalars['Boolean']
    /** The default page that displays when a 404 'Page not Found' error occurs. */
    no_route: (Scalars['String'] | null)
    /** Extended Config Data - general/country/optional_zip_countries */
    optional_zip_countries: (Scalars['String'] | null)
    /** Indicates whether orders can be cancelled by customers or not. */
    order_cancellation_enabled: Scalars['Boolean']
    /** An array containing available cancellation reasons. */
    order_cancellation_reasons: (CancellationReason | null)[]
    /** Payflow Pro vault status. */
    payment_payflowpro_cc_vault_active: (Scalars['String'] | null)
    /** Indicates whether product reviews are enabled. Possible values: 1 (Yes) and 0 (No). */
    product_reviews_enabled: (Scalars['String'] | null)
    /** The suffix applied to product pages, such as `.htm` or `.html`. */
    product_url_suffix: (Scalars['String'] | null)
    /** The number of different character classes (lowercase, uppercase, digits, special characters) required in a password. */
    required_character_classes_number: (Scalars['String'] | null)
    /**
     * @deprecated Use `root_category_uid` instead.
     * The ID of the root category.
     */
    root_category_id: (Scalars['Int'] | null)
    /** The unique ID for a `CategoryInterface` object. */
    root_category_uid: (Scalars['ID'] | null)
    /** A secure fully-qualified URL that is used to create relative links to the `base_url`. */
    secure_base_link_url: (Scalars['String'] | null)
    /** The secure fully-qualified URL that specifies the location of media files. */
    secure_base_media_url: (Scalars['String'] | null)
    /** The secure fully-qualified URL that specifies the location of static view files. */
    secure_base_static_url: (Scalars['String'] | null)
    /** The store’s fully-qualified secure base URL. */
    secure_base_url: (Scalars['String'] | null)
    /** Email to a Friend configuration. */
    send_friend: (SendFriendConfiguration | null)
    /** Extended Config Data - tax/cart_display/full_summary */
    shopping_cart_display_full_summary: (Scalars['Boolean'] | null)
    /** Extended Config Data - tax/cart_display/grandtotal */
    shopping_cart_display_grand_total: (Scalars['Boolean'] | null)
    /** Extended Config Data - tax/cart_display/price */
    shopping_cart_display_price: (Scalars['Int'] | null)
    /** Extended Config Data - tax/cart_display/shipping */
    shopping_cart_display_shipping: (Scalars['Int'] | null)
    /** Extended Config Data - tax/cart_display/subtotal */
    shopping_cart_display_subtotal: (Scalars['Int'] | null)
    /** Extended Config Data - tax/cart_display/gift_wrapping */
    shopping_cart_display_tax_gift_wrapping: (TaxWrappingEnum | null)
    /** Extended Config Data - tax/cart_display/zero_tax */
    shopping_cart_display_zero_tax: (Scalars['Boolean'] | null)
    /** Indicates whether a breadcrumb trail appears on all CMS pages in the catalog. 0 (No) or 1 (Yes). */
    show_cms_breadcrumbs: (Scalars['Int'] | null)
    /**
     * The unique ID of the store view. In the Admin, this is called the Store View
     * Code. When making a GraphQL call, assign this value to the `Store` header to
     * provide the scope.
     */
    store_code: (Scalars['ID'] | null)
    /** The unique ID assigned to the store group. In the Admin, this is called the Store Name. */
    store_group_code: (Scalars['ID'] | null)
    /** The label assigned to the store group. */
    store_group_name: (Scalars['String'] | null)
    /** The label assigned to the store view. */
    store_name: (Scalars['String'] | null)
    /** The store view sort order. */
    store_sort_order: (Scalars['Int'] | null)
    /** The time zone of the store. */
    timezone: (Scalars['String'] | null)
    /** A prefix that appears before the title to create a two- or three-part title. */
    title_prefix: (Scalars['String'] | null)
    /** The character that separates the category name and subcategory in the browser title bar. */
    title_separator: (Scalars['String'] | null)
    /** A suffix that appears after the title to create a two- or three-part title. */
    title_suffix: (Scalars['String'] | null)
    /** Indicates whether the store code should be used in the URL. */
    use_store_in_url: (Scalars['Boolean'] | null)
    /** The unique ID for the website. */
    website_code: (Scalars['ID'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The ID number assigned to the website store.
     */
    website_id: (Scalars['Int'] | null)
    /** The label assigned to the website. */
    website_name: (Scalars['String'] | null)
    /** The unit of weight. */
    weight_unit: (Scalars['String'] | null)
    /** Text that appears in the header of the page and includes the name of the logged in customer. */
    welcome: (Scalars['String'] | null)
    /** Indicates whether only specific countries can use this payment method. */
    zero_subtotal_enable_for_specific_countries: (Scalars['Boolean'] | null)
    /** Indicates whether the Zero Subtotal payment method is enabled. */
    zero_subtotal_enabled: (Scalars['Boolean'] | null)
    /** The status of new orders placed using the Zero Subtotal payment method. */
    zero_subtotal_new_order_status: (Scalars['String'] | null)
    /**
     * When the new order status is 'Processing', this can be set to
     * `authorize_capture` to automatically invoice all items that have a zero balance.
     */
    zero_subtotal_payment_action: (Scalars['String'] | null)
    /** A comma-separated list of specific countries allowed to use the Zero Subtotal payment method. */
    zero_subtotal_payment_from_specific_countries: (Scalars['String'] | null)
    /**
     * A number indicating the position of the Zero Subtotal payment method in the
     * list of available payment methods during checkout.
     */
    zero_subtotal_sort_order: (Scalars['Int'] | null)
    /** The title of the Zero Subtotal payment method displayed on the storefront. */
    zero_subtotal_title: (Scalars['String'] | null)
    __typename: 'StoreConfig'
}


/** Indicates where an attribute can be displayed. */
export interface StorefrontProperties {
    /** The relative position of the attribute in the layered navigation block. */
    position: (Scalars['Int'] | null)
    /** Indicates whether the attribute is filterable with results, without results, or not at all. */
    use_in_layered_navigation: (UseInLayeredNavigationOptions | null)
    /** Indicates whether the attribute is displayed in product listings. */
    use_in_product_listing: (Scalars['Boolean'] | null)
    /** Indicates whether the attribute can be used in layered navigation on search results pages. */
    use_in_search_results_layered_navigation: (Scalars['Boolean'] | null)
    /** Indicates whether the attribute is displayed on product pages. */
    visible_on_catalog_pages: (Scalars['Boolean'] | null)
    __typename: 'StorefrontProperties'
}

export interface StripePaymentMethod {
    /** Card brand */
    brand: (Scalars['String'] | null)
    /** UNIX timestamp representing the date that the payment method was created. */
    created: (Scalars['Int'] | null)
    /** Indicates whether this saved payment method requires a CVC token to be submitted when placing an order. */
    cvc: (Scalars['Boolean'] | null)
    /** Card expiration month */
    exp_month: (Scalars['Int'] | null)
    /** Card expiration year */
    exp_year: (Scalars['Int'] | null)
    /** A unique identifier for the card number, tax id, bank account etc. */
    fingerprint: (Scalars['String'] | null)
    /** A payment method icon URL that can be used at the front-end. */
    icon: (Scalars['String'] | null)
    /** Payment method ID */
    id: Scalars['ID']
    /** A formatted payment method label that you can display to the customer. */
    label: (Scalars['String'] | null)
    /** The type of the payment method, i.e. card, klarna, sepa_debit. */
    type: (Scalars['String'] | null)
    __typename: 'StripePaymentMethod'
}


/** Contains the result of the `subscribeEmailToNewsletter` operation. */
export interface SubscribeEmailToNewsletterOutput {
    /** The status of the subscription request. */
    status: (SubscriptionStatusesEnum | null)
    __typename: 'SubscribeEmailToNewsletterOutput'
}


/** Indicates the status of the request. */
export type SubscriptionStatusesEnum = 'NOT_ACTIVE' | 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'UNCONFIRMED'


/** Describes the swatch type and a value. */
export interface SwatchData {
    /** The type of swatch filter item: 1 - text; 2 - image. */
    type: (Scalars['String'] | null)
    /** The value for the swatch item. It could be text or an image link. */
    value: (Scalars['String'] | null)
    __typename: 'SwatchData'
}

export type SwatchDataInterface = (ColorSwatchData | ImageSwatchData | TextSwatchData) & { __isUnion?: true }


/** Swatch attribute metadata input types. */
export type SwatchInputTypeEnum = 'BOOLEAN' | 'DATE' | 'DATETIME' | 'DROPDOWN' | 'FILE' | 'GALLERY' | 'HIDDEN' | 'IMAGE' | 'MEDIA_IMAGE' | 'MULTILINE' | 'MULTISELECT' | 'PRICE' | 'SELECT' | 'TEXT' | 'TEXTAREA' | 'UNDEFINED' | 'VISUAL' | 'WEIGHT'

export interface SwatchLayerFilterItem {
    /**
     * @deprecated Use `AggregationOption.count` instead.
     * The count of items per filter.
     */
    items_count: (Scalars['Int'] | null)
    /**
     * @deprecated Use `AggregationOption.label` instead.
     * The label for a filter.
     */
    label: (Scalars['String'] | null)
    /** Data required to render a swatch filter item. */
    swatch_data: (SwatchData | null)
    /**
     * @deprecated Use `AggregationOption.value` instead.
     * The value of a filter request variable to be used in query.
     */
    value_string: (Scalars['String'] | null)
    __typename: 'SwatchLayerFilterItem'
}

export type SwatchLayerFilterItemInterface = (SwatchLayerFilterItem) & { __isUnion?: true }


/** Contains tax item details. */
export interface TaxItem {
    /** The amount of tax applied to the item. */
    amount: Money
    /** The rate used to calculate the tax. */
    rate: Scalars['Float']
    /** A title that describes the tax. */
    title: Scalars['String']
    __typename: 'TaxItem'
}

export type TaxWrappingEnum = 'DISPLAY_EXCLUDING_TAX' | 'DISPLAY_INCLUDING_TAX' | 'DISPLAY_TYPE_BOTH'

export interface TextSwatchData {
    /** The value can be represented as color (HEX code), image link, or text. */
    value: (Scalars['String'] | null)
    __typename: 'TextSwatchData'
}


/** 3D Secure mode. */
export type ThreeDSMode = 'OFF' | 'SCA_WHEN_REQUIRED' | 'SCA_ALWAYS'


/** Defines a price based on the quantity purchased. */
export interface TierPrice {
    /** The price discount that this tier represents. */
    discount: (ProductDiscount | null)
    /** The price of the product at this tier. */
    final_price: (Money | null)
    /** The minimum number of items that must be purchased to qualify for this price tier. */
    quantity: (Scalars['Float'] | null)
    __typename: 'TierPrice'
}


/** Contains details about the cart after updating items. */
export interface UpdateCartItemsOutput {
    /** The cart after updating products. */
    cart: Cart
    __typename: 'UpdateCartItemsOutput'
}


/** Contains the customer's wish list and any errors encountered. */
export interface UpdateProductsInWishlistOutput {
    /** An array of errors encountered while updating products in a wish list. */
    user_errors: (WishListUserInputError | null)[]
    /** Contains the wish list with all items that were successfully updated. */
    wishlist: Wishlist
    __typename: 'UpdateProductsInWishlistOutput'
}


/** Contains URL rewrite details. */
export interface UrlRewrite {
    /** An array of request parameters. */
    parameters: ((HttpQueryParameter | null)[] | null)
    /** The request URL. */
    url: (Scalars['String'] | null)
    __typename: 'UrlRewrite'
}


/** This enumeration defines the entity type. */
export type UrlRewriteEntityTypeEnum = 'CMS_PAGE' | 'PRODUCT' | 'CATEGORY'


/** Defines whether the attribute is filterable in layered navigation. */
export type UseInLayeredNavigationOptions = 'NO' | 'FILTERABLE_WITH_RESULTS' | 'FILTERABLE_NO_RESULT'


/** Defines a customer attribute validation rule. */
export interface ValidationRule {
    /** Validation rule name applied to a customer attribute. */
    name: (ValidationRuleEnum | null)
    /** Validation rule value. */
    value: (Scalars['String'] | null)
    __typename: 'ValidationRule'
}


/** List of validation rule names applied to a customer attribute. */
export type ValidationRuleEnum = 'DATE_RANGE_MAX' | 'DATE_RANGE_MIN' | 'FILE_EXTENSIONS' | 'INPUT_VALIDATION' | 'MAX_TEXT_LENGTH' | 'MIN_TEXT_LENGTH' | 'MAX_FILE_SIZE' | 'MAX_IMAGE_HEIGHT' | 'MAX_IMAGE_WIDTH'


/** Retrieves the vault configuration */
export interface VaultConfigOutput {
    /** Credit card vault method configuration */
    credit_card: (VaultCreditCardConfig | null)
    __typename: 'VaultConfigOutput'
}

export interface VaultCreditCardConfig {
    /** Is vault enabled */
    is_vault_enabled: (Scalars['Boolean'] | null)
    /** The parameters required to load the Paypal JS SDK */
    sdk_params: ((SDKParams | null)[] | null)
    /** 3DS mode */
    three_ds_mode: (ThreeDSMode | null)
    __typename: 'VaultCreditCardConfig'
}


/** An implementation for virtual product cart items. */
export interface VirtualCartItem {
    /** An array containing customizable options the shopper selected. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** An array of errors encountered while loading the cart item */
    errors: ((CartItemError | null)[] | null)
    /** @deprecated Use `uid` instead. */
    id: Scalars['String']
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available: Scalars['Boolean']
    /** Contains details about the price of the item, including taxes and discounts. */
    prices: (CartItemPrices | null)
    /** Details about an item in the cart. */
    product: ProductInterface
    /** The quantity of this item in the cart. */
    quantity: Scalars['Float']
    /** The unique ID for a `CartItemInterface` object. */
    uid: Scalars['ID']
    __typename: 'VirtualCartItem'
}


/** Defines a virtual product, which is a non-tangible product that does not require shipping and is not kept in inventory. */
export interface VirtualProduct {
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id: (Scalars['Int'] | null)
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url: (Scalars['String'] | null)
    /** The categories assigned to a product. */
    categories: ((CategoryInterface | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    color: (Scalars['Int'] | null)
    /** The product's country of origin. */
    country_of_manufacture: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at: (Scalars['String'] | null)
    /** Crosssell Products */
    crosssell_products: ((ProductInterface | null)[] | null)
    /** Product custom attributes. */
    custom_attributesV2: (ProductCustomAttributes | null)
    /** Detailed information about the product. The value can include simple HTML tags. */
    description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size: (Scalars['String'] | null)
    /** Indicates whether a gift message is available. */
    gift_message_available: (Scalars['String'] | null)
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id: (Scalars['Int'] | null)
    /** The relative path to the main image on the product page. */
    image: (ProductImage | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested: (Scalars['Int'] | null)
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer: (Scalars['Int'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2: (Scalars['Int'] | null)
    /** An array of media gallery objects. */
    media_gallery: ((MediaGalleryInterface | null)[] | null)
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries: ((MediaGalleryEntry | null)[] | null)
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description: (Scalars['String'] | null)
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword: (Scalars['String'] | null)
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title: (Scalars['String'] | null)
    /** The product name. Customers use this name to identify the product. */
    name: (Scalars['String'] | null)
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date: (Scalars['String'] | null)
    /** The end date for new product listings. */
    new_to_date: (Scalars['String'] | null)
    /** Product stock only x left count */
    only_x_left_in_stock: (Scalars['Float'] | null)
    /** An array of options for a customizable product. */
    options: ((CustomizableOptionInterface | null)[] | null)
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container: (Scalars['String'] | null)
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price: (ProductPrices | null)
    /** The range of prices for the product */
    price_range: PriceRange
    /** An array of `TierPrice` objects. */
    price_tiers: ((TierPrice | null)[] | null)
    /** An array of `ProductLinks` objects. */
    product_links: ((ProductLinksInterface | null)[] | null)
    /** The average of all the ratings given to the product. */
    rating_summary: Scalars['Float']
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code: Scalars['Int']
    /** An array of products to be displayed in a Related Products block. */
    related_products: ((ProductInterface | null)[] | null)
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url: (Scalars['String'] | null)
    /** The total count of all the reviews given to the product. */
    review_count: Scalars['Int']
    /** The list of products reviews. */
    reviews: ProductReviews
    /** A short description of the product. Its use depends on the theme. */
    short_description: (ComplexTextValue | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    size: (Scalars['Int'] | null)
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku: (Scalars['String'] | null)
    /** The relative path to the small image, which is used on catalog pages. */
    small_image: (ProductImage | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date: (Scalars['String'] | null)
    /** The discounted price of the product. */
    special_price: (Scalars['Float'] | null)
    /** The end date for a product with a special price. */
    special_to_date: (Scalars['String'] | null)
    /** Stock status of the product */
    stock_status: (ProductStockStatus | null)
    /** The file name of a swatch image. */
    swatch_image: (Scalars['String'] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tema: (Scalars['Int'] | null)
    /** The relative path to the product's thumbnail image. */
    thumbnail: (ProductImage | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price: (Scalars['Float'] | null)
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices: ((ProductTierPrices | null)[] | null)
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia: (Scalars['Int'] | null)
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type: (UrlRewriteEntityTypeEnum | null)
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id: (Scalars['String'] | null)
    /** The unique ID for a `ProductInterface` object. */
    uid: Scalars['ID']
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at: (Scalars['String'] | null)
    /** Upsell Products */
    upsell_products: ((ProductInterface | null)[] | null)
    /** The part of the URL that identifies the product */
    url_key: (Scalars['String'] | null)
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path: (Scalars['String'] | null)
    /** URL rewrites list */
    url_rewrites: ((UrlRewrite | null)[] | null)
    /** The part of the product URL that is appended after the url key */
    url_suffix: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites: ((Website | null)[] | null)
    __typename: 'VirtualProduct'
}


/** Contains a virtual product wish list item. */
export interface VirtualWishlistItem {
    /** The date and time the item was added to the wish list. */
    added_at: Scalars['String']
    /** Custom options selected for the wish list item. */
    customizable_options: (SelectedCustomizableOption | null)[]
    /** The description of the item. */
    description: (Scalars['String'] | null)
    /** The unique ID for a `WishlistItemInterface` object. */
    id: Scalars['ID']
    /** Product details of the wish list item. */
    product: (ProductInterface | null)
    /** The quantity of this wish list item. */
    quantity: Scalars['Float']
    __typename: 'VirtualWishlistItem'
}


/** Deprecated. It should not be used on the storefront. Contains information about a website. */
export interface Website {
    /**
     * @deprecated The field should not be used on the storefront.
     * A code assigned to the website to identify it.
     */
    code: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The default group ID of the website.
     */
    default_group_id: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The ID number assigned to the website.
     */
    id: (Scalars['Int'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * Indicates whether this is the default website.
     */
    is_default: (Scalars['Boolean'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The website name. Websites use this name to identify it easier.
     */
    name: (Scalars['String'] | null)
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute to use for sorting websites.
     */
    sort_order: (Scalars['Int'] | null)
    __typename: 'Website'
}


/** Contains a customer wish list. */
export interface Wishlist {
    /** The unique ID for a `Wishlist` object. */
    id: (Scalars['ID'] | null)
    /** @deprecated Use the `items_v2` field instead. */
    items: ((WishlistItem | null)[] | null)
    /** The number of items in the wish list. */
    items_count: (Scalars['Int'] | null)
    /** An array of items in the customer's wish list. */
    items_v2: (WishlistItems | null)
    /** An encrypted code that Magento uses to link to the wish list. */
    sharing_code: (Scalars['String'] | null)
    /** The time of the last modification to the wish list. */
    updated_at: (Scalars['String'] | null)
    __typename: 'Wishlist'
}


/** Contains details about errors encountered when a customer added wish list items to the cart. */
export interface WishlistCartUserInputError {
    /** An error code that describes the error encountered. */
    code: WishlistCartUserInputErrorType
    /** A localized error message. */
    message: Scalars['String']
    /** The unique ID of the `Wishlist` object containing an error. */
    wishlistId: Scalars['ID']
    /** The unique ID of the wish list item containing an error. */
    wishlistItemId: Scalars['ID']
    __typename: 'WishlistCartUserInputError'
}


/** A list of possible error types. */
export type WishlistCartUserInputErrorType = 'PRODUCT_NOT_FOUND' | 'NOT_SALABLE' | 'INSUFFICIENT_STOCK' | 'UNDEFINED'


/** Contains details about a wish list item. */
export interface WishlistItem {
    /** The time when the customer added the item to the wish list. */
    added_at: (Scalars['String'] | null)
    /** The customer's comment about this item. */
    description: (Scalars['String'] | null)
    /** The unique ID for a `WishlistItem` object. */
    id: (Scalars['Int'] | null)
    /** Details about the wish list item. */
    product: (ProductInterface | null)
    /** The quantity of this wish list item */
    qty: (Scalars['Float'] | null)
    __typename: 'WishlistItem'
}


/** The interface for wish list items. */
export type WishlistItemInterface = (BundleWishlistItem | ConfigurableWishlistItem | DownloadableWishlistItem | GroupedProductWishlistItem | SimpleWishlistItem | VirtualWishlistItem) & { __isUnion?: true }


/** Contains an array of items in a wish list. */
export interface WishlistItems {
    /** A list of items in the wish list. */
    items: (WishlistItemInterface | null)[]
    /** Contains pagination metadata. */
    page_info: (SearchResultPageInfo | null)
    __typename: 'WishlistItems'
}


/** Deprecated: Use the `Wishlist` type instead. */
export interface WishlistOutput {
    /**
     * @deprecated Use the `Wishlist.items` field instead.
     * An array of items in the customer's wish list
     */
    items: ((WishlistItem | null)[] | null)
    /**
     * @deprecated Use the `Wishlist.items_count` field instead.
     * The number of items in the wish list.
     */
    items_count: (Scalars['Int'] | null)
    /**
     * @deprecated This field is related to Commerce functionality and is always `null` in Open Source.
     * When multiple wish lists are enabled, the name the customer assigns to the wishlist.
     */
    name: (Scalars['String'] | null)
    /**
     * @deprecated Use the `Wishlist.sharing_code` field instead.
     * An encrypted code that links to the wish list.
     */
    sharing_code: (Scalars['String'] | null)
    /**
     * @deprecated Use the `Wishlist.updated_at` field instead.
     * The time of the last modification to the wish list.
     */
    updated_at: (Scalars['String'] | null)
    __typename: 'WishlistOutput'
}


/** An error encountered while performing operations with WishList. */
export interface WishListUserInputError {
    /** A wish list-specific error code. */
    code: WishListUserInputErrorType
    /** A localized error message. */
    message: Scalars['String']
    __typename: 'WishListUserInputError'
}


/** A list of possible error types. */
export type WishListUserInputErrorType = 'PRODUCT_NOT_FOUND' | 'UNDEFINED'


/** Defines the bundle products to add to the cart. */
export interface AddBundleProductsToCartInput {
/** The ID of the cart. */
cart_id: Scalars['String'],
/** An array of bundle products to add. */
cart_items: (BundleProductCartItemInput | null)[]}


/** Contains details about the cart after adding bundle products. */
export interface AddBundleProductsToCartOutputGenqlSelection{
    /** The cart after adding products. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the configurable products to add to the cart. */
export interface AddConfigurableProductsToCartInput {
/** The ID of the cart. */
cart_id: Scalars['String'],
/** An array of configurable products to add. */
cart_items: (ConfigurableProductCartItemInput | null)[]}


/** Contains details about the cart after adding configurable products. */
export interface AddConfigurableProductsToCartOutputGenqlSelection{
    /** The cart after adding products. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AddDownloadableProductsToCartInput {
/** The ID of the cart. */
cart_id: Scalars['String'],
/** An array of downloadable products to add. */
cart_items: (DownloadableProductCartItemInput | null)[]}


/** Contains details about the cart after adding downloadable products. */
export interface AddDownloadableProductsToCartOutputGenqlSelection{
    /** The cart after adding products. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the cart after adding products to it. */
export interface AddProductsToCartOutputGenqlSelection{
    /** The cart after products have been added. */
    cart?: CartGenqlSelection
    /** Contains errors encountered while adding an item to the cart. */
    user_errors?: CartUserInputErrorGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains products to add to an existing compare list. */
export interface AddProductsToCompareListInput {
/** An array of product IDs to add to the compare list. */
products: (Scalars['ID'] | null)[],
/** The unique identifier of the compare list to modify. */
uid: Scalars['ID']}


/** Contains details about the cart after adding products to it. */
export interface AddProductsToNewCartOutputGenqlSelection{
    /** The cart after products have been added. */
    cart?: CartGenqlSelection
    /** Contains errors encountered while adding an item to the cart. */
    user_errors?: CartUserInputErrorGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the customer's wish list and any errors encountered. */
export interface AddProductsToWishlistOutputGenqlSelection{
    /** An array of errors encountered while adding products to a wish list. */
    user_errors?: WishListUserInputErrorGenqlSelection
    /** Contains the wish list with all items that were successfully added. */
    wishlist?: WishlistGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the simple and group products to add to the cart. */
export interface AddSimpleProductsToCartInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** An array of simple and group items to add. */
cart_items: (SimpleProductCartItemInput | null)[]}


/** Contains details about the cart after adding simple or group products. */
export interface AddSimpleProductsToCartOutputGenqlSelection{
    /** The cart after adding products. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the virtual products to add to the cart. */
export interface AddVirtualProductsToCartInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** An array of virtual products to add. */
cart_items: (VirtualProductCartItemInput | null)[]}


/** Contains details about the cart after adding virtual products. */
export interface AddVirtualProductsToCartOutputGenqlSelection{
    /** The cart after adding products. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the resultant wish list and any error information. */
export interface AddWishlistItemsToCartOutputGenqlSelection{
    /** An array of errors encountered while adding products to the customer's cart. */
    add_wishlist_items_to_cart_user_errors?: WishlistCartUserInputErrorGenqlSelection
    /** Indicates whether the attempt to add items to the customer's cart was successful. */
    status?: boolean | number
    /** Contains the wish list with all items that were successfully added. */
    wishlist?: WishlistGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information for each filterable option (such as price, category `UID`, and custom attributes). */
export interface AggregationGenqlSelection{
    /** Attribute code of the aggregation group. */
    attribute_code?: boolean | number
    /** The number of options in the aggregation group. */
    count?: boolean | number
    /** The aggregation display name. */
    label?: boolean | number
    /** Array of options for the aggregation. */
    options?: AggregationOptionGenqlSelection
    /** The relative position of the attribute in a layered navigation block. */
    position?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An implementation of `AggregationOptionInterface`. */
export interface AggregationOptionGenqlSelection{
    /** The number of items that match the aggregation option. */
    count?: boolean | number
    /** The display label for an aggregation option. */
    label?: boolean | number
    /** The internal ID that represents the value of the option. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines aggregation option fields. */
export interface AggregationOptionInterfaceGenqlSelection{
    /** The number of items that match the aggregation option. */
    count?: boolean | number
    /** The display label for an aggregation option. */
    label?: boolean | number
    /** The internal ID that represents the value of the option. */
    value?: boolean | number
    on_AggregationOption?: AggregationOptionGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Filter category aggregations in layered navigation. */
export interface AggregationsCategoryFilterInput {
/** Indicates whether to include only direct subcategories or all children categories at all levels. */
includeDirectChildrenOnly?: (Scalars['Boolean'] | null)}


/** An input object that specifies the filters used in product aggregations. */
export interface AggregationsFilterInput {
/** Filter category aggregations in layered navigation. */
category?: (AggregationsCategoryFilterInput | null)}

export interface ApplePayConfigGenqlSelection{
    /** The styles for the ApplePay Smart Button configuration */
    button_styles?: ButtonStylesGenqlSelection
    /** The payment method code as defined in the payment gateway */
    code?: boolean | number
    /** Indicates whether the payment method is displayed */
    is_visible?: boolean | number
    /** Defines the payment intent (Authorize or Capture */
    payment_intent?: boolean | number
    /** The payment source for the payment method */
    payment_source?: boolean | number
    /** The PayPal parameters required to load the JS SDK */
    sdk_params?: SDKParamsGenqlSelection
    /** The relative order the payment method is displayed on the checkout page */
    sort_order?: boolean | number
    /** The name displayed for the payment method */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Apple Pay inputs */
export interface ApplePayMethodInput {
/** The payment source for the payment method */
payment_source?: (Scalars['String'] | null),
/** The payment services order ID */
payments_order_id?: (Scalars['String'] | null),
/** PayPal order ID */
paypal_order_id?: (Scalars['String'] | null)}


/** Contains the applied coupon code. */
export interface AppliedCouponGenqlSelection{
    /** The coupon code the shopper applied to the card. */
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Specifies the coupon code to apply to the cart. */
export interface ApplyCouponToCartInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** A valid coupon code. */
coupon_code: Scalars['String']}


/** Contains details about the cart after applying a coupon. */
export interface ApplyCouponToCartOutputGenqlSelection{
    /** The cart after applying a coupon. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** AreaInput defines the parameters which will be used for filter by specified location. */
export interface AreaInput {
/** The radius for the search in KM. */
radius: Scalars['Int'],
/** The country code where search must be performed. Required parameter together with region, city or postcode. */
search_term: Scalars['String']}


/** Contains the results of the request to assign a compare list. */
export interface AssignCompareListToCustomerOutputGenqlSelection{
    /** The contents of the customer's compare list. */
    compare_list?: CompareListGenqlSelection
    /** Indicates whether the compare list was successfully assigned to the customer. */
    result?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the attribute, including the code and type. */
export interface AttributeGenqlSelection{
    /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
    attribute_code?: boolean | number
    /** Attribute options list. */
    attribute_options?: AttributeOptionGenqlSelection
    /** The data type of the attribute. */
    attribute_type?: boolean | number
    /** The type of entity that defines the attribute. */
    entity_type?: boolean | number
    /** The frontend input type of the attribute. */
    input_type?: boolean | number
    /** Details about the storefront properties configured for the attribute. */
    storefront_properties?: StorefrontPropertiesGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An input object that specifies the filters used for attributes. */
export interface AttributeFilterInput {
/** Whether a product or category attribute can be compared against another or not. */
is_comparable?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute can be filtered or not. */
is_filterable?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute can be filtered in search or not. */
is_filterable_in_search?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute can use HTML on front or not. */
is_html_allowed_on_front?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute can be searched or not. */
is_searchable?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute can be used for price rules or not. */
is_used_for_price_rules?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute is used for promo rules or not. */
is_used_for_promo_rules?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute is visible in advanced search or not. */
is_visible_in_advanced_search?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute is visible on front or not. */
is_visible_on_front?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute has WYSIWYG enabled or not. */
is_wysiwyg_enabled?: (Scalars['Boolean'] | null),
/** Whether a product or category attribute is used in product listing or not. */
used_in_product_listing?: (Scalars['Boolean'] | null)}


/** Defines the attribute characteristics to search for the `attribute_code` and `entity_type` to search. */
export interface AttributeInput {
/** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
attribute_code?: (Scalars['String'] | null),
/** The type of entity that defines the attribute. */
entity_type?: (Scalars['String'] | null)}


/** Specifies selected option for a select or multiselect attribute value. */
export interface AttributeInputSelectedOption {
/** The attribute option value. */
value: Scalars['String']}


/** Base EAV implementation of CustomAttributeMetadataInterface. */
export interface AttributeMetadataGenqlSelection{
    /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
    code?: boolean | number
    /** Default attribute value. */
    default_value?: boolean | number
    /** The type of entity that defines the attribute. */
    entity_type?: boolean | number
    /** The frontend class of the attribute. */
    frontend_class?: boolean | number
    /** The frontend input type of the attribute. */
    frontend_input?: boolean | number
    /** Whether the attribute value is required. */
    is_required?: boolean | number
    /** Whether the attribute value must be unique. */
    is_unique?: boolean | number
    /** The label assigned to the attribute. */
    label?: boolean | number
    /** Attribute options. */
    options?: CustomAttributeOptionInterfaceGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Attribute metadata retrieval error. */
export interface AttributeMetadataErrorGenqlSelection{
    /** Attribute metadata retrieval error message. */
    message?: boolean | number
    /** Attribute metadata retrieval error type. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines an attribute option. */
export interface AttributeOptionGenqlSelection{
    /** The label assigned to the attribute option. */
    label?: boolean | number
    /** The attribute option value. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Base EAV implementation of CustomAttributeOptionInterface. */
export interface AttributeOptionMetadataGenqlSelection{
    /** Is the option value default. */
    is_default?: boolean | number
    /** The label assigned to the attribute option. */
    label?: boolean | number
    /** The attribute option value. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AttributeSelectedOptionGenqlSelection{
    /** The attribute selected option label. */
    label?: boolean | number
    /** The attribute selected option value. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AttributeSelectedOptionInterfaceGenqlSelection{
    /** The attribute selected option label. */
    label?: boolean | number
    /** The attribute selected option value. */
    value?: boolean | number
    on_AttributeSelectedOption?: AttributeSelectedOptionGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AttributeSelectedOptionsGenqlSelection{
    /** The attribute code. */
    code?: boolean | number
    selected_options?: AttributeSelectedOptionInterfaceGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Metadata of EAV attributes associated to form */
export interface AttributesFormOutputGenqlSelection{
    /** Errors of retrieving certain attributes metadata. */
    errors?: AttributeMetadataErrorGenqlSelection
    /** Requested attributes metadata. */
    items?: CustomAttributeMetadataInterfaceGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Metadata of EAV attributes. */
export interface AttributesMetadataOutputGenqlSelection{
    /** Errors of retrieving certain attributes metadata. */
    errors?: AttributeMetadataErrorGenqlSelection
    /** Requested attributes metadata. */
    items?: CustomAttributeMetadataInterfaceGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface AttributeValueGenqlSelection{
    /** The attribute code. */
    code?: boolean | number
    /** The attribute value. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Specifies the value for attribute. */
export interface AttributeValueInput {
/** The code of the attribute. */
attribute_code: Scalars['String'],
/** An array containing selected options for a select or multiselect attribute. */
selected_options?: ((AttributeInputSelectedOption | null)[] | null),
/** The value assigned to the attribute. */
value?: (Scalars['String'] | null)}

export interface AttributeValueInterfaceGenqlSelection{
    /** The attribute code. */
    code?: boolean | number
    on_AttributeSelectedOptions?: AttributeSelectedOptionsGenqlSelection
    on_AttributeValue?: AttributeValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Describes a payment method that the shopper can use to pay for the order. */
export interface AvailablePaymentMethodGenqlSelection{
    /** The payment method code. */
    code?: boolean | number
    /** If the payment method is an online integration */
    is_deferred?: boolean | number
    /** The payment method title. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the possible shipping methods and carriers. */
export interface AvailableShippingMethodGenqlSelection{
    /** The cost of shipping using this shipping method. */
    amount?: MoneyGenqlSelection
    /** Indicates whether this shipping method can be applied to the cart. */
    available?: boolean | number
    /** @deprecated The field should not be used on the storefront. */
    base_amount?: MoneyGenqlSelection
    /** A string that identifies a commercial carrier or an offline shipping method. */
    carrier_code?: boolean | number
    /** The label for the carrier code. */
    carrier_title?: boolean | number
    /** Describes an error condition. */
    error_message?: boolean | number
    /** A shipping method code associated with a carrier. The value could be null if no method is available. */
    method_code?: boolean | number
    /** The label for the shipping method code. The value could be null if no method is available. */
    method_title?: boolean | number
    /** The cost of shipping using this shipping method, excluding tax. */
    price_excl_tax?: MoneyGenqlSelection
    /** The cost of shipping using this shipping method, including tax. */
    price_incl_tax?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the billing address. */
export interface BillingAddressInput {
/** Defines a billing address. */
address?: (CartAddressInput | null),
/** An ID from the customer's address book that uniquely identifies the address to be used for billing. */
customer_address_id?: (Scalars['Int'] | null),
/** Indicates whether to set the billing address to be the same as the existing shipping address on the cart. */
same_as_shipping?: (Scalars['Boolean'] | null),
/** Indicates whether to set the shipping address to be the same as this billing address. */
use_for_shipping?: (Scalars['Boolean'] | null)}


/** The billing address information */
export interface BillingAddressPaymentSourceInput {
/** The first line of the address */
address_line_1?: (Scalars['String'] | null),
/** The second line of the address */
address_line_2?: (Scalars['String'] | null),
/** The city of the address */
city?: (Scalars['String'] | null),
/** The country of the address */
country_code: Scalars['String'],
/** The postal code of the address */
postal_code?: (Scalars['String'] | null),
/** The region of the address */
region?: (Scalars['String'] | null)}


/** Contains details about the billing address. */
export interface BillingCartAddressGenqlSelection{
    /** The city specified for the billing or shipping address. */
    city?: boolean | number
    /** The company specified for the billing or shipping address. */
    company?: boolean | number
    /** An object containing the country label and code. */
    country?: CartAddressCountryGenqlSelection
    /** @deprecated The field is used only in shipping address. */
    customer_notes?: boolean | number
    /** The customer's fax number. */
    fax?: boolean | number
    /** The first name of the customer or guest. */
    firstname?: boolean | number
    /** The last name of the customer or guest. */
    lastname?: boolean | number
    /** The middle name of the person associated with the billing/shipping address. */
    middlename?: boolean | number
    /** The ZIP or postal code of the billing or shipping address. */
    postcode?: boolean | number
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix?: boolean | number
    /** An object containing the region label and code. */
    region?: CartAddressRegionGenqlSelection
    /** An array containing the street for the billing or shipping address. */
    street?: boolean | number
    /** A value such as Sr., Jr., or III. */
    suffix?: boolean | number
    /** The telephone number for the billing or shipping address. */
    telephone?: boolean | number
    /** The unique id of the customer address. */
    uid?: boolean | number
    /** The VAT company number for billing or shipping address. */
    vat_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about an individual category that comprises a breadcrumb. */
export interface BreadcrumbGenqlSelection{
    /**
     * @deprecated Use `category_uid` instead.
     * The ID of the category.
     */
    category_id?: boolean | number
    /** The category level. */
    category_level?: boolean | number
    /** The display name of the category. */
    category_name?: boolean | number
    /** The unique ID for a `Breadcrumb` object. */
    category_uid?: boolean | number
    /** The URL key of the category. */
    category_url_key?: boolean | number
    /** The URL path of the category. */
    category_url_path?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An implementation for bundle product cart items. */
export interface BundleCartItemGenqlSelection{
    /** An array containing the bundle options the shopper selected. */
    bundle_options?: SelectedBundleOptionGenqlSelection
    /** An array containing the customizable options the shopper selected. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** An array of errors encountered while loading the cart item */
    errors?: CartItemErrorGenqlSelection
    /** The entered gift message for the cart item */
    gift_message?: GiftMessageGenqlSelection
    /** @deprecated Use `uid` instead. */
    id?: boolean | number
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available?: boolean | number
    /** Contains details about the price of the item, including taxes and discounts. */
    prices?: CartItemPricesGenqlSelection
    /** Details about an item in the cart. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this item in the cart. */
    quantity?: boolean | number
    /** The unique ID for a `CartItemInterface` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines bundle product options for `CreditMemoItemInterface`. */
export interface BundleCreditMemoItemGenqlSelection{
    /** A list of bundle options that are assigned to a bundle product that is part of a credit memo. */
    bundle_options?: ItemSelectedBundleOptionGenqlSelection
    /** Details about the final discount amount for the base product, including discounts on options. */
    discounts?: DiscountGenqlSelection
    /** The unique ID for a `CreditMemoItemInterface` object. */
    id?: boolean | number
    /** The order item the credit memo is applied to. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product, including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of refunded items. */
    quantity_refunded?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines bundle product options for `InvoiceItemInterface`. */
export interface BundleInvoiceItemGenqlSelection{
    /** A list of bundle options that are assigned to an invoiced bundle product. */
    bundle_options?: ItemSelectedBundleOptionGenqlSelection
    /** Information about the final discount amount for the base product, including discounts on options. */
    discounts?: DiscountGenqlSelection
    /** The unique ID for an `InvoiceItemInterface` object. */
    id?: boolean | number
    /** Details about an individual order item. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of invoiced items. */
    quantity_invoiced?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines an individual item within a bundle product. */
export interface BundleItemGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * An ID assigned to each type of item in a bundle product.
     */
    option_id?: boolean | number
    /** An array of additional options for this bundle item. */
    options?: BundleItemOptionGenqlSelection
    /** A number indicating the sequence order of this item compared to the other bundle items. */
    position?: boolean | number
    /** The range of prices for the product */
    price_range?: PriceRangeGenqlSelection
    /** Indicates whether the item must be included in the bundle. */
    required?: boolean | number
    /** The SKU of the bundle product. */
    sku?: boolean | number
    /** The display name of the item. */
    title?: boolean | number
    /** The input type that the customer uses to select the item. Examples include radio button and checkbox. */
    type?: boolean | number
    /** The unique ID for a `BundleItem` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the characteristics that comprise a specific bundle item and its options. */
export interface BundleItemOptionGenqlSelection{
    /** Indicates whether the customer can change the number of items for this option. */
    can_change_quantity?: boolean | number
    /**
     * @deprecated Use `uid` instead
     * The ID assigned to the bundled item option.
     */
    id?: boolean | number
    /** Indicates whether this option is the default option. */
    is_default?: boolean | number
    /** The text that identifies the bundled item option. */
    label?: boolean | number
    /** When a bundle item contains multiple options, the relative position of this option compared to the other options. */
    position?: boolean | number
    /** The price of the selected option. */
    price?: boolean | number
    /** One of FIXED, PERCENT, or DYNAMIC. */
    price_type?: boolean | number
    /** Contains details about this product option. */
    product?: ProductInterfaceGenqlSelection
    /**
     * @deprecated Use `quantity` instead.
     * Indicates the quantity of this specific bundle item.
     */
    qty?: boolean | number
    /** The quantity of this specific bundle item. */
    quantity?: boolean | number
    /** The unique ID for a `BundleItemOption` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the input for a bundle option. */
export interface BundleOptionInput {
/** The ID of the option. */
id: Scalars['Int'],
/** The number of the selected item to add to the cart. */
quantity: Scalars['Float'],
/** An array with the chosen value of the option. */
value: (Scalars['String'] | null)[]}


/** Defines bundle product options for `OrderItemInterface`. */
export interface BundleOrderItemGenqlSelection{
    /** A list of bundle options that are assigned to the bundle product. */
    bundle_options?: ItemSelectedBundleOptionGenqlSelection
    /** The final discount information for the product. */
    discounts?: DiscountGenqlSelection
    /** The entered option for the base product, such as a logo or image. */
    entered_options?: OrderItemOptionGenqlSelection
    /** The selected gift message for the order item */
    gift_message?: GiftMessageGenqlSelection
    /** The unique ID for an `OrderItemInterface` object. */
    id?: boolean | number
    /** The ProductInterface object, which contains details about the base product */
    product?: ProductInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price of the base product, including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The type of product, such as simple, configurable, etc. */
    product_type?: boolean | number
    /** URL key of the base product. */
    product_url_key?: boolean | number
    /** The number of canceled items. */
    quantity_canceled?: boolean | number
    /** The number of invoiced items. */
    quantity_invoiced?: boolean | number
    /** The number of units ordered for this item. */
    quantity_ordered?: boolean | number
    /** The number of refunded items. */
    quantity_refunded?: boolean | number
    /** The number of returned items. */
    quantity_returned?: boolean | number
    /** The number of shipped items. */
    quantity_shipped?: boolean | number
    /** The selected options for the base product, such as color or size. */
    selected_options?: OrderItemOptionGenqlSelection
    /** The status of the order item. */
    status?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines basic features of a bundle product and contains multiple BundleItems. */
export interface BundleProductGenqlSelection{
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id?: boolean | number
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url?: boolean | number
    /** The categories assigned to a product. */
    categories?: CategoryInterfaceGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    color?: boolean | number
    /** The product's country of origin. */
    country_of_manufacture?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at?: boolean | number
    /** Crosssell Products */
    crosssell_products?: ProductInterfaceGenqlSelection
    /** Product custom attributes. */
    custom_attributesV2?: (ProductCustomAttributesGenqlSelection & { __args?: {filters?: (AttributeFilterInput | null)} })
    /** Detailed information about the product. The value can include simple HTML tags. */
    description?: ComplexTextValueGenqlSelection
    /** Indicates whether the bundle product has a dynamic price. */
    dynamic_price?: boolean | number
    /** Indicates whether the bundle product has a dynamic SKU. */
    dynamic_sku?: boolean | number
    /** Indicates whether the bundle product has a dynamically calculated weight. */
    dynamic_weight?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size?: boolean | number
    /** Indicates whether a gift message is available. */
    gift_message_available?: boolean | number
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id?: boolean | number
    /** The relative path to the main image on the product page. */
    image?: ProductImageGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested?: boolean | number
    /** An array containing information about individual bundle items. */
    items?: BundleItemGenqlSelection
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2?: boolean | number
    /** An array of media gallery objects. */
    media_gallery?: MediaGalleryInterfaceGenqlSelection
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries?: MediaGalleryEntryGenqlSelection
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description?: boolean | number
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword?: boolean | number
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title?: boolean | number
    /** The product name. Customers use this name to identify the product. */
    name?: boolean | number
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date?: boolean | number
    /** The end date for new product listings. */
    new_to_date?: boolean | number
    /** Product stock only x left count */
    only_x_left_in_stock?: boolean | number
    /** An array of options for a customizable product. */
    options?: CustomizableOptionInterfaceGenqlSelection
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container?: boolean | number
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price?: ProductPricesGenqlSelection
    /** The price details of the main product */
    price_details?: PriceDetailsGenqlSelection
    /** The range of prices for the product */
    price_range?: PriceRangeGenqlSelection
    /** An array of `TierPrice` objects. */
    price_tiers?: TierPriceGenqlSelection
    /** One of PRICE_RANGE or AS_LOW_AS. */
    price_view?: boolean | number
    /** An array of `ProductLinks` objects. */
    product_links?: ProductLinksInterfaceGenqlSelection
    /** The average of all the ratings given to the product. */
    rating_summary?: boolean | number
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** An array of products to be displayed in a Related Products block. */
    related_products?: ProductInterfaceGenqlSelection
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** The total count of all the reviews given to the product. */
    review_count?: boolean | number
    /** The list of products reviews. */
    reviews?: (ProductReviewsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /** Indicates whether to ship bundle items together or individually. */
    ship_bundle_items?: boolean | number
    /** A short description of the product. Its use depends on the theme. */
    short_description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    size?: boolean | number
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku?: boolean | number
    /** The relative path to the small image, which is used on catalog pages. */
    small_image?: ProductImageGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date?: boolean | number
    /** The discounted price of the product. */
    special_price?: boolean | number
    /** The end date for a product with a special price. */
    special_to_date?: boolean | number
    /** Stock status of the product */
    stock_status?: boolean | number
    /** The file name of a swatch image. */
    swatch_image?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    tema?: boolean | number
    /** The relative path to the product's thumbnail image. */
    thumbnail?: ProductImageGenqlSelection
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price?: boolean | number
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices?: ProductTierPricesGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id?: boolean | number
    /** The unique ID for a `ProductInterface` object. */
    uid?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at?: boolean | number
    /** Upsell Products */
    upsell_products?: ProductInterfaceGenqlSelection
    /** The part of the URL that identifies the product */
    url_key?: boolean | number
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path?: boolean | number
    /** URL rewrites list */
    url_rewrites?: UrlRewriteGenqlSelection
    /** The part of the product URL that is appended after the url key */
    url_suffix?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites?: WebsiteGenqlSelection
    /** The weight of the item, in units defined by the store. */
    weight?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a single bundle product. */
export interface BundleProductCartItemInput {
/** A mandatory array of options for the bundle product, including each chosen option and specified quantity. */
bundle_options: (BundleOptionInput | null)[],
/** The ID and value of the option. */
customizable_options?: ((CustomizableOptionInput | null)[] | null),
/** The quantity and SKU of the bundle product. */
data: CartItemInput}


/** Defines bundle product options for `ShipmentItemInterface`. */
export interface BundleShipmentItemGenqlSelection{
    /** A list of bundle options that are assigned to a shipped product. */
    bundle_options?: ItemSelectedBundleOptionGenqlSelection
    /** The unique ID for a `ShipmentItemInterface` object. */
    id?: boolean | number
    /** The order item associated with the shipment item. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of shipped items. */
    quantity_shipped?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines bundle product options for `WishlistItemInterface`. */
export interface BundleWishlistItemGenqlSelection{
    /** The date and time the item was added to the wish list. */
    added_at?: boolean | number
    /** An array containing information about the selected bundle items. */
    bundle_options?: SelectedBundleOptionGenqlSelection
    /** Custom options selected for the wish list item. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** The description of the item. */
    description?: boolean | number
    /** The unique ID for a `WishlistItemInterface` object. */
    id?: boolean | number
    /** Product details of the wish list item. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this wish list item. */
    quantity?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ButtonStylesGenqlSelection{
    /** The button color */
    color?: boolean | number
    /** The button height in pixels */
    height?: boolean | number
    /** The button label */
    label?: boolean | number
    /** The button layout */
    layout?: boolean | number
    /** The button shape */
    shape?: boolean | number
    /** Indicates whether the tagline is displayed */
    tagline?: boolean | number
    /** Defines if the button uses default height. If the value is false, the value of height is used */
    use_default_height?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CancellationReasonGenqlSelection{
    description?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the order to cancel. */
export interface CancelOrderInput {
/** Order ID. */
order_id: Scalars['ID'],
/** Cancellation reason. */
reason: Scalars['String']}


/** Contains the updated customer order and error message if any. */
export interface CancelOrderOutputGenqlSelection{
    /** Error encountered while cancelling the order. */
    error?: boolean | number
    /** Updated customer order. */
    order?: CustomerOrderGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CardGenqlSelection{
    /** Card bin details */
    bin_details?: CardBinGenqlSelection
    /** Expiration month of the card */
    card_expiry_month?: boolean | number
    /** Expiration year of the card */
    card_expiry_year?: boolean | number
    /** Last four digits of the card */
    last_digits?: boolean | number
    /** Name on the card */
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CardBinGenqlSelection{
    /** Card bin number */
    bin?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** The card payment source information */
export interface CardPaymentSourceInput {
/** The billing address of the card */
billing_address: BillingAddressPaymentSourceInput,
/** The name on the cardholder */
name?: (Scalars['String'] | null)}


/** The card payment source information */
export interface CardPaymentSourceOutputGenqlSelection{
    /** The brand of the card */
    brand?: boolean | number
    /** The expiry of the card */
    expiry?: boolean | number
    /** The last digits of the card */
    last_digits?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the contents and other details about a guest or customer cart. */
export interface CartGenqlSelection{
    /** @deprecated Use `applied_coupons` instead. */
    applied_coupon?: AppliedCouponGenqlSelection
    /** An array of `AppliedCoupon` objects. Each object contains the `code` text attribute, which specifies the coupon code. */
    applied_coupons?: AppliedCouponGenqlSelection
    /** An array of available payment methods. */
    available_payment_methods?: AvailablePaymentMethodGenqlSelection
    /** The billing address assigned to the cart. */
    billing_address?: BillingCartAddressGenqlSelection
    /** The email address of the guest or customer. */
    email?: boolean | number
    /** The entered gift message for the cart */
    gift_message?: GiftMessageGenqlSelection
    /** The unique ID for a `Cart` object. */
    id?: boolean | number
    /** Indicates whether the cart contains only virtual products. */
    is_virtual?: boolean | number
    /**
     * @deprecated Use `itemsV2` instead.
     * An array of products that have been added to the cart.
     */
    items?: CartItemInterfaceGenqlSelection
    itemsV2?: (CartItemsGenqlSelection & { __args?: {pageSize?: (Scalars['Int'] | null), currentPage?: (Scalars['Int'] | null), sort?: (QuoteItemsSortInput | null)} })
    /** Pricing details for the quote. */
    prices?: CartPricesGenqlSelection
    /** Indicates which payment method was applied to the cart. */
    selected_payment_method?: SelectedPaymentMethodGenqlSelection
    /** An array of shipping addresses assigned to the cart. */
    shipping_addresses?: ShippingCartAddressGenqlSelection
    /** The total number of items in the cart. */
    total_quantity?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details the country in a billing or shipping address. */
export interface CartAddressCountryGenqlSelection{
    /** The country code. */
    code?: boolean | number
    /** The display label for the country. */
    label?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the billing or shipping address to be applied to the cart. */
export interface CartAddressInput {
/** The city specified for the billing or shipping address. */
city: Scalars['String'],
/** The company specified for the billing or shipping address. */
company?: (Scalars['String'] | null),
/** The country code and label for the billing or shipping address. */
country_code: Scalars['String'],
/** The customer's fax number. */
fax?: (Scalars['String'] | null),
/** The first name of the customer or guest. */
firstname: Scalars['String'],
/** The last name of the customer or guest. */
lastname: Scalars['String'],
/** The middle name of the person associated with the billing/shipping address. */
middlename?: (Scalars['String'] | null),
/** The ZIP or postal code of the billing or shipping address. */
postcode?: (Scalars['String'] | null),
/** An honorific, such as Dr., Mr., or Mrs. */
prefix?: (Scalars['String'] | null),
/** A string that defines the state or province of the billing or shipping address. */
region?: (Scalars['String'] | null),
/** An integer that defines the state or province of the billing or shipping address. */
region_id?: (Scalars['Int'] | null),
/** Determines whether to save the address in the customer's address book. The default value is true. */
save_in_address_book?: (Scalars['Boolean'] | null),
/** An array containing the street for the billing or shipping address. */
street: (Scalars['String'] | null)[],
/** A value such as Sr., Jr., or III. */
suffix?: (Scalars['String'] | null),
/** The telephone number for the billing or shipping address. */
telephone?: (Scalars['String'] | null),
/** The VAT company number for billing or shipping address. */
vat_id?: (Scalars['String'] | null)}

export interface CartAddressInterfaceGenqlSelection{
    /** The city specified for the billing or shipping address. */
    city?: boolean | number
    /** The company specified for the billing or shipping address. */
    company?: boolean | number
    /** An object containing the country label and code. */
    country?: CartAddressCountryGenqlSelection
    /** The customer's fax number. */
    fax?: boolean | number
    /** The first name of the customer or guest. */
    firstname?: boolean | number
    /** The last name of the customer or guest. */
    lastname?: boolean | number
    /** The middle name of the person associated with the billing/shipping address. */
    middlename?: boolean | number
    /** The ZIP or postal code of the billing or shipping address. */
    postcode?: boolean | number
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix?: boolean | number
    /** An object containing the region label and code. */
    region?: CartAddressRegionGenqlSelection
    /** An array containing the street for the billing or shipping address. */
    street?: boolean | number
    /** A value such as Sr., Jr., or III. */
    suffix?: boolean | number
    /** The telephone number for the billing or shipping address. */
    telephone?: boolean | number
    /** The unique id of the customer address. */
    uid?: boolean | number
    /** The VAT company number for billing or shipping address. */
    vat_id?: boolean | number
    on_BillingCartAddress?: BillingCartAddressGenqlSelection
    on_ShippingCartAddress?: ShippingCartAddressGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the region in a billing or shipping address. */
export interface CartAddressRegionGenqlSelection{
    /** The state or province code. */
    code?: boolean | number
    /** The display label for the region. */
    label?: boolean | number
    /** The unique ID for a pre-defined region. */
    region_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about discounts applied to the cart. */
export interface CartDiscountGenqlSelection{
    /** The amount of the discount applied to the item. */
    amount?: MoneyGenqlSelection
    /** The description of the discount. */
    label?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CartItemErrorGenqlSelection{
    /** An error code that describes the error encountered */
    code?: boolean | number
    /** A localized error message */
    message?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines an item to be added to the cart. */
export interface CartItemInput {
/** An array of entered options for the base product, such as personalization text. */
entered_options?: ((EnteredOptionInput | null)[] | null),
/** For a child product, the SKU of its parent product. */
parent_sku?: (Scalars['String'] | null),
/** The amount or number of an item to add. */
quantity: Scalars['Float'],
/**
 * The selected options for the base product, such as color or size, using the
 * unique ID for an object such as `CustomizableRadioOption`,
 * `CustomizableDropDownOption`, or `ConfigurableProductOptionsValues`.
 */
selected_options?: ((Scalars['ID'] | null)[] | null),
/** The SKU of the product. */
sku: Scalars['String']}


/** An interface for products in a cart. */
export interface CartItemInterfaceGenqlSelection{
    /** An array of errors encountered while loading the cart item */
    errors?: CartItemErrorGenqlSelection
    /** @deprecated Use `uid` instead. */
    id?: boolean | number
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available?: boolean | number
    /** Contains details about the price of the item, including taxes and discounts. */
    prices?: CartItemPricesGenqlSelection
    /** Details about an item in the cart. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this item in the cart. */
    quantity?: boolean | number
    /** The unique ID for a `CartItemInterface` object. */
    uid?: boolean | number
    on_BundleCartItem?: BundleCartItemGenqlSelection
    on_ConfigurableCartItem?: ConfigurableCartItemGenqlSelection
    on_DownloadableCartItem?: DownloadableCartItemGenqlSelection
    on_SimpleCartItem?: SimpleCartItemGenqlSelection
    on_VirtualCartItem?: VirtualCartItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the price of the item, including taxes and discounts. */
export interface CartItemPricesGenqlSelection{
    /** An array of discounts to be applied to the cart item. */
    discounts?: DiscountGenqlSelection
    /**
     * The price of the item before any discounts were applied. The price that might
     * include tax, depending on the configured display settings for cart.
     */
    price?: MoneyGenqlSelection
    /**
     * The price of the item before any discounts were applied. The price that might
     * include tax, depending on the configured display settings for cart.
     */
    price_including_tax?: MoneyGenqlSelection
    /** The value of the price multiplied by the quantity of the item. */
    row_total?: MoneyGenqlSelection
    /** The value of `row_total` plus the tax applied to the item. */
    row_total_including_tax?: MoneyGenqlSelection
    /** The total of all discounts applied to the item. */
    total_item_discount?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Deprecated: The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`. */
export interface CartItemQuantityGenqlSelection{
    /** @deprecated The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`. */
    cart_item_id?: boolean | number
    /** @deprecated The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`. */
    quantity?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CartItemsGenqlSelection{
    /** An array of products that have been added to the cart. */
    items?: CartItemInterfaceGenqlSelection
    /** Metadata for pagination rendering. */
    page_info?: SearchResultPageInfoGenqlSelection
    /** The number of returned cart items. */
    total_count?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the price of a selected customizable value. */
export interface CartItemSelectedOptionValuePriceGenqlSelection{
    /** Indicates whether the price type is fixed, percent, or dynamic. */
    type?: boolean | number
    /** A string that describes the unit of the value. */
    units?: boolean | number
    /** A price value. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A single item to be updated. */
export interface CartItemUpdateInput {
/** Deprecated. Use `cart_item_uid` instead. */
cart_item_id?: (Scalars['Int'] | null),
/** The unique ID for a `CartItemInterface` object. */
cart_item_uid?: (Scalars['ID'] | null),
/** An array that defines customizable options for the product. */
customizable_options?: ((CustomizableOptionInput | null)[] | null),
/** Gift message details for the cart item */
gift_message?: (GiftMessageInput | null),
/** The new quantity of the item. */
quantity?: (Scalars['Float'] | null)}


/** Contains details about the final price of items in the cart, including discount and tax information. */
export interface CartPricesGenqlSelection{
    /** An array containing the names and amounts of taxes applied to each item in the cart. */
    applied_taxes?: CartTaxItemGenqlSelection
    /** @deprecated Use discounts instead. */
    discount?: CartDiscountGenqlSelection
    /** An array containing cart rule discounts, store credit and gift cards applied to the cart. */
    discounts?: DiscountGenqlSelection
    /** The total, including discounts, taxes, shipping, and other fees. */
    grand_total?: MoneyGenqlSelection
    /** The subtotal without any applied taxes. */
    subtotal_excluding_tax?: MoneyGenqlSelection
    /** The subtotal including any applied taxes. */
    subtotal_including_tax?: MoneyGenqlSelection
    /** The subtotal with any discounts applied, but not taxes. */
    subtotal_with_discount_excluding_tax?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains tax information about an item in the cart. */
export interface CartTaxItemGenqlSelection{
    /** The amount of tax applied to the item. */
    amount?: MoneyGenqlSelection
    /** The description of the tax. */
    label?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An error encountered while adding an item to the the cart. */
export interface CartUserInputErrorGenqlSelection{
    /** A cart-specific error code. */
    code?: boolean | number
    /** A localized error message. */
    message?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Swatch attribute metadata. */
export interface CatalogAttributeMetadataGenqlSelection{
    /** To which catalog types an attribute can be applied. */
    apply_to?: boolean | number
    /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
    code?: boolean | number
    /** Default attribute value. */
    default_value?: boolean | number
    /** The type of entity that defines the attribute. */
    entity_type?: boolean | number
    /** The frontend class of the attribute. */
    frontend_class?: boolean | number
    /** The frontend input type of the attribute. */
    frontend_input?: boolean | number
    /** Whether a product or category attribute can be compared against another or not. */
    is_comparable?: boolean | number
    /** Whether a product or category attribute can be filtered or not. */
    is_filterable?: boolean | number
    /** Whether a product or category attribute can be filtered in search or not. */
    is_filterable_in_search?: boolean | number
    /** Whether a product or category attribute can use HTML on front or not. */
    is_html_allowed_on_front?: boolean | number
    /** Whether the attribute value is required. */
    is_required?: boolean | number
    /** Whether a product or category attribute can be searched or not. */
    is_searchable?: boolean | number
    /** Whether the attribute value must be unique. */
    is_unique?: boolean | number
    /** Whether a product or category attribute can be used for price rules or not. */
    is_used_for_price_rules?: boolean | number
    /** Whether a product or category attribute is used for promo rules or not. */
    is_used_for_promo_rules?: boolean | number
    /** Whether a product or category attribute is visible in advanced search or not. */
    is_visible_in_advanced_search?: boolean | number
    /** Whether a product or category attribute is visible on front or not. */
    is_visible_on_front?: boolean | number
    /** Whether a product or category attribute has WYSIWYG enabled or not. */
    is_wysiwyg_enabled?: boolean | number
    /** The label assigned to the attribute. */
    label?: boolean | number
    /** Attribute options. */
    options?: CustomAttributeOptionInterfaceGenqlSelection
    /** Input type of the swatch attribute option. */
    swatch_input_type?: boolean | number
    /** Whether update product preview image or not. */
    update_product_preview_image?: boolean | number
    /** Whether use product image for swatch or not. */
    use_product_image_for_swatch?: boolean | number
    /** Whether a product or category attribute is used in product listing or not. */
    used_in_product_listing?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/**
 * Defines the filters to be used in the search. A filter contains at least one
 * attribute, a comparison operator, and the value that is being searched for.
 */
export interface CategoryFilterInput {
/** Filter by the unique category ID for a `CategoryInterface` object. */
category_uid?: (FilterEqualTypeInput | null),
/** Deprecated: use 'category_uid' to filter uniquely identifiers of categories. */
ids?: (FilterEqualTypeInput | null),
/** Filter by the display name of the category. */
name?: (FilterMatchTypeInput | null),
/** Filter by the unique parent category ID for a `CategoryInterface` object. */
parent_category_uid?: (FilterEqualTypeInput | null),
/** Filter by the unique parent category ID for a `CategoryInterface` object. */
parent_id?: (FilterEqualTypeInput | null),
/** Filter by the part of the URL that identifies the category. */
url_key?: (FilterEqualTypeInput | null),
/** Filter by the URL path for the category. */
url_path?: (FilterEqualTypeInput | null)}


/** Contains the full set of attributes that can be returned in a category search. */
export interface CategoryInterfaceGenqlSelection{
    available_sort_by?: boolean | number
    /** An array of breadcrumb items. */
    breadcrumbs?: BreadcrumbGenqlSelection
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Categories' is enabled.
     */
    canonical_url?: boolean | number
    children_count?: boolean | number
    /** Contains a category CMS block. */
    cms_block?: CmsBlockGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * The timestamp indicating when the category was created.
     */
    created_at?: boolean | number
    custom_layout_update_file?: boolean | number
    /** The attribute to use for sorting. */
    default_sort_by?: boolean | number
    /** An optional description of the category. */
    description?: boolean | number
    display_mode?: boolean | number
    filter_price_range?: boolean | number
    /**
     * @deprecated Use `uid` instead.
     * An ID that uniquely identifies the category.
     */
    id?: boolean | number
    image?: boolean | number
    include_in_menu?: boolean | number
    is_anchor?: boolean | number
    is_on_home?: boolean | number
    landing_page?: boolean | number
    /** The depth of the category within the tree. */
    level?: boolean | number
    meta_description?: boolean | number
    meta_keywords?: boolean | number
    meta_title?: boolean | number
    /** The display name of the category. */
    name?: boolean | number
    /** The full category path. */
    path?: boolean | number
    /** The category path within the store. */
    path_in_store?: boolean | number
    /** The position of the category relative to other categories at the same level in tree. */
    position?: boolean | number
    /**
     * The number of products in the category that are marked as visible. By default,
     * in complex products, parent products are visible, but their child products are not.
     */
    product_count?: boolean | number
    /** The list of products assigned to the category. */
    products?: (CategoryProductsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default value is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default value is 1. */
    currentPage?: (Scalars['Int'] | null), 
    /** The attributes to sort on, and whether to return the results in ascending or descending order. */
    sort?: (ProductAttributeSortInput | null)} })
    thumbnail?: boolean | number
    /** The unique ID for a `CategoryInterface` object. */
    uid?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * The timestamp indicating when the category was updated.
     */
    updated_at?: boolean | number
    /** The URL key assigned to the category. */
    url_key?: boolean | number
    /** The URL path assigned to the category. */
    url_path?: boolean | number
    /** The part of the category URL that is appended after the url key */
    url_suffix?: boolean | number
    on_CategoryTree?: CategoryTreeGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the products assigned to a category. */
export interface CategoryProductsGenqlSelection{
    /** An array of products that are assigned to the category. */
    items?: ProductInterfaceGenqlSelection
    /** Pagination metadata. */
    page_info?: SearchResultPageInfoGenqlSelection
    /**
     * The number of products in the category that are marked as visible. By default,
     * in complex products, parent products are visible, but their child products are not.
     */
    total_count?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains a collection of `CategoryTree` objects and pagination information. */
export interface CategoryResultGenqlSelection{
    /** A list of categories that match the filter criteria. */
    items?: CategoryTreeGenqlSelection
    /** An object that includes the `page_info` and `currentPage` values specified in the query. */
    page_info?: SearchResultPageInfoGenqlSelection
    /** The total number of categories that match the criteria. */
    total_count?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the hierarchy of categories. */
export interface CategoryTreeGenqlSelection{
    available_sort_by?: boolean | number
    /** An array of breadcrumb items. */
    breadcrumbs?: BreadcrumbGenqlSelection
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Categories' is enabled.
     */
    canonical_url?: boolean | number
    /** A tree of child categories. */
    children?: CategoryTreeGenqlSelection
    children_count?: boolean | number
    /** Contains a category CMS block. */
    cms_block?: CmsBlockGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * The timestamp indicating when the category was created.
     */
    created_at?: boolean | number
    custom_layout_update_file?: boolean | number
    /** The attribute to use for sorting. */
    default_sort_by?: boolean | number
    /** An optional description of the category. */
    description?: boolean | number
    display_mode?: boolean | number
    filter_price_range?: boolean | number
    /**
     * @deprecated Use `uid` instead.
     * An ID that uniquely identifies the category.
     */
    id?: boolean | number
    image?: boolean | number
    include_in_menu?: boolean | number
    is_anchor?: boolean | number
    is_on_home?: boolean | number
    landing_page?: boolean | number
    /** The depth of the category within the tree. */
    level?: boolean | number
    meta_description?: boolean | number
    meta_keywords?: boolean | number
    meta_title?: boolean | number
    /** The display name of the category. */
    name?: boolean | number
    /** The full category path. */
    path?: boolean | number
    /** The category path within the store. */
    path_in_store?: boolean | number
    /** The position of the category relative to other categories at the same level in tree. */
    position?: boolean | number
    /**
     * The number of products in the category that are marked as visible. By default,
     * in complex products, parent products are visible, but their child products are not.
     */
    product_count?: boolean | number
    /** The list of products assigned to the category. */
    products?: (CategoryProductsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default value is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default value is 1. */
    currentPage?: (Scalars['Int'] | null), 
    /** The attributes to sort on, and whether to return the results in ascending or descending order. */
    sort?: (ProductAttributeSortInput | null)} })
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    thumbnail?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    /** The unique ID for a `CategoryInterface` object. */
    uid?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * The timestamp indicating when the category was updated.
     */
    updated_at?: boolean | number
    /** The URL key assigned to the category. */
    url_key?: boolean | number
    /** The URL path assigned to the category. */
    url_path?: boolean | number
    /** The part of the category URL that is appended after the url key */
    url_suffix?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines details about an individual checkout agreement. */
export interface CheckoutAgreementGenqlSelection{
    /** The ID for a checkout agreement. */
    agreement_id?: boolean | number
    /** The checkbox text for the checkout agreement. */
    checkbox_text?: boolean | number
    /** Required. The text of the agreement. */
    content?: boolean | number
    /** The height of the text box where the Terms and Conditions statement appears during checkout. */
    content_height?: boolean | number
    /** Indicates whether the `content` text is in HTML format. */
    is_html?: boolean | number
    /** Indicates whether agreements are accepted automatically or manually. */
    mode?: boolean | number
    /** The name given to the condition. */
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An error encountered while adding an item to the cart. */
export interface CheckoutUserInputErrorGenqlSelection{
    /** An error code that is specific to Checkout. */
    code?: boolean | number
    /** A localized error message. */
    message?: boolean | number
    /**
     * The path to the input field that caused an error. See the GraphQL
     * specification about path errors for details:
     * http://spec.graphql.org/draft/#sec-Errors
     */
    path?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a specific CMS block. */
export interface CmsBlockGenqlSelection{
    /** The content of the CMS block in raw HTML. */
    content?: boolean | number
    /** The CMS block identifier. */
    identifier?: boolean | number
    /** The title assigned to the CMS block. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains an array CMS block items. */
export interface CmsBlocksGenqlSelection{
    /** An array of CMS blocks. */
    items?: CmsBlockGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a CMS page. */
export interface CmsPageGenqlSelection{
    /** The content of the CMS page in raw HTML. */
    content?: boolean | number
    /** The heading that displays at the top of the CMS page. */
    content_heading?: boolean | number
    /** The ID of a CMS page. */
    identifier?: boolean | number
    /** A brief description of the page for search results listings. */
    meta_description?: boolean | number
    /** A brief description of the page for search results listings. */
    meta_keywords?: boolean | number
    /** A page title that is indexed by search engines and appears in search results listings. */
    meta_title?: boolean | number
    /** The design layout of the page, indicating the number of columns and navigation features used on the page. */
    page_layout?: boolean | number
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** The name that appears in the breadcrumb trail navigation and in the browser title bar and tab. */
    title?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    /** The URL key of the CMS page, which is often based on the `content_heading`. */
    url_key?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ColorSwatchDataGenqlSelection{
    /** The value can be represented as color (HEX code), image link, or text. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains an attribute code that is used for product comparisons. */
export interface ComparableAttributeGenqlSelection{
    /** An attribute code that is enabled for product comparisons. */
    code?: boolean | number
    /** The label of the attribute code. */
    label?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines an object used to iterate through items for product comparisons. */
export interface ComparableItemGenqlSelection{
    /** An array of product attributes that can be used to compare products. */
    attributes?: ProductAttributeGenqlSelection
    /** Details about a product in a compare list. */
    product?: ProductInterfaceGenqlSelection
    /** The unique ID of an item in a compare list. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains iterable information such as the array of items, the count, and attributes that represent the compare list. */
export interface CompareListGenqlSelection{
    /** An array of attributes that can be used for comparing products. */
    attributes?: ComparableAttributeGenqlSelection
    /** The number of items in the compare list. */
    item_count?: boolean | number
    /** An array of products to compare. */
    items?: ComparableItemGenqlSelection
    /** The unique ID assigned to the compare list. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Update the quote and complete the order */
export interface CompleteOrderInput {
/** The customer cart ID */
cartId: Scalars['String'],
/** PayPal order ID */
id: Scalars['String']}

export interface ComplexTextValueGenqlSelection{
    /** Text that can contain HTML tags. */
    html?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a configurable product attribute option. */
export interface ConfigurableAttributeOptionGenqlSelection{
    /** The ID assigned to the attribute. */
    code?: boolean | number
    /** A string that describes the configurable attribute option. */
    label?: boolean | number
    /** The unique ID for a `ConfigurableAttributeOption` object. */
    uid?: boolean | number
    /** A unique index number assigned to the configurable product option. */
    value_index?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An implementation for configurable product cart items. */
export interface ConfigurableCartItemGenqlSelection{
    /** An array containing the configuranle options the shopper selected. */
    configurable_options?: SelectedConfigurableOptionGenqlSelection
    /** Product details of the cart item. */
    configured_variant?: ProductInterfaceGenqlSelection
    /** An array containing the customizable options the shopper selected. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** An array of errors encountered while loading the cart item */
    errors?: CartItemErrorGenqlSelection
    /** The entered gift message for the cart item */
    gift_message?: GiftMessageGenqlSelection
    /** @deprecated Use `uid` instead. */
    id?: boolean | number
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available?: boolean | number
    /** Contains details about the price of the item, including taxes and discounts. */
    prices?: CartItemPricesGenqlSelection
    /** Details about an item in the cart. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this item in the cart. */
    quantity?: boolean | number
    /** The unique ID for a `CartItemInterface` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Describes configurable options that have been selected and can be selected as a result of the previous selections. */
export interface ConfigurableOptionAvailableForSelectionGenqlSelection{
    /** An attribute code that uniquely identifies a configurable option. */
    attribute_code?: boolean | number
    /** An array of selectable option value IDs. */
    option_value_uids?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines basic features of a configurable product and its simple product variants. */
export interface ConfigurableProductGenqlSelection{
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id?: boolean | number
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url?: boolean | number
    /** The categories assigned to a product. */
    categories?: CategoryInterfaceGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    color?: boolean | number
    /** An array of options for the configurable product. */
    configurable_options?: ConfigurableProductOptionsGenqlSelection
    /**
     * An array of media gallery items and other details about selected configurable
     * product options as well as details about remaining selectable options.
     */
    configurable_product_options_selection?: (ConfigurableProductOptionsSelectionGenqlSelection & { __args?: {configurableOptionValueUids?: (Scalars['ID'][] | null)} })
    /** The product's country of origin. */
    country_of_manufacture?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at?: boolean | number
    /** Crosssell Products */
    crosssell_products?: ProductInterfaceGenqlSelection
    /** Product custom attributes. */
    custom_attributesV2?: (ProductCustomAttributesGenqlSelection & { __args?: {filters?: (AttributeFilterInput | null)} })
    /** Detailed information about the product. The value can include simple HTML tags. */
    description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size?: boolean | number
    /** Indicates whether a gift message is available. */
    gift_message_available?: boolean | number
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id?: boolean | number
    /** The relative path to the main image on the product page. */
    image?: ProductImageGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested?: boolean | number
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2?: boolean | number
    /** An array of media gallery objects. */
    media_gallery?: MediaGalleryInterfaceGenqlSelection
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries?: MediaGalleryEntryGenqlSelection
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description?: boolean | number
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword?: boolean | number
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title?: boolean | number
    /** The product name. Customers use this name to identify the product. */
    name?: boolean | number
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date?: boolean | number
    /** The end date for new product listings. */
    new_to_date?: boolean | number
    /** Product stock only x left count */
    only_x_left_in_stock?: boolean | number
    /** An array of options for a customizable product. */
    options?: CustomizableOptionInterfaceGenqlSelection
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container?: boolean | number
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price?: ProductPricesGenqlSelection
    /** The range of prices for the product */
    price_range?: PriceRangeGenqlSelection
    /** An array of `TierPrice` objects. */
    price_tiers?: TierPriceGenqlSelection
    /** An array of `ProductLinks` objects. */
    product_links?: ProductLinksInterfaceGenqlSelection
    /** The average of all the ratings given to the product. */
    rating_summary?: boolean | number
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** An array of products to be displayed in a Related Products block. */
    related_products?: ProductInterfaceGenqlSelection
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** The total count of all the reviews given to the product. */
    review_count?: boolean | number
    /** The list of products reviews. */
    reviews?: (ProductReviewsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /** A short description of the product. Its use depends on the theme. */
    short_description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    size?: boolean | number
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku?: boolean | number
    /** The relative path to the small image, which is used on catalog pages. */
    small_image?: ProductImageGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date?: boolean | number
    /** The discounted price of the product. */
    special_price?: boolean | number
    /** The end date for a product with a special price. */
    special_to_date?: boolean | number
    /** Stock status of the product */
    stock_status?: boolean | number
    /** The file name of a swatch image. */
    swatch_image?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    tema?: boolean | number
    /** The relative path to the product's thumbnail image. */
    thumbnail?: ProductImageGenqlSelection
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price?: boolean | number
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices?: ProductTierPricesGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id?: boolean | number
    /** The unique ID for a `ProductInterface` object. */
    uid?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at?: boolean | number
    /** Upsell Products */
    upsell_products?: ProductInterfaceGenqlSelection
    /** The part of the URL that identifies the product */
    url_key?: boolean | number
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path?: boolean | number
    /** URL rewrites list */
    url_rewrites?: UrlRewriteGenqlSelection
    /** The part of the product URL that is appended after the url key */
    url_suffix?: boolean | number
    /** An array of simple product variants. */
    variants?: ConfigurableVariantGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites?: WebsiteGenqlSelection
    /** The weight of the item, in units defined by the store. */
    weight?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ConfigurableProductCartItemInput {
/** The ID and value of the option. */
customizable_options?: ((CustomizableOptionInput | null)[] | null),
/** The quantity and SKU of the configurable product. */
data: CartItemInput,
/** The SKU of the parent configurable product. */
parent_sku?: (Scalars['String'] | null),
/** Deprecated. Use `CartItemInput.sku` instead. */
variant_sku?: (Scalars['String'] | null)}


/** Contains details about configurable product options. */
export interface ConfigurableProductOptionGenqlSelection{
    /** An attribute code that uniquely identifies a configurable option. */
    attribute_code?: boolean | number
    /** The display name of the option. */
    label?: boolean | number
    /** The unique ID of the configurable option. */
    uid?: boolean | number
    /** An array of values that are applicable for this option. */
    values?: ConfigurableProductOptionValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines configurable attributes for the specified product. */
export interface ConfigurableProductOptionsGenqlSelection{
    /** A string that identifies the attribute. */
    attribute_code?: boolean | number
    /**
     * @deprecated Use `attribute_uid` instead.
     * The ID assigned to the attribute.
     */
    attribute_id?: boolean | number
    /**
     * @deprecated Use `attribute_uid` instead.
     * The ID assigned to the attribute.
     */
    attribute_id_v2?: boolean | number
    /** The unique ID for an `Attribute` object. */
    attribute_uid?: boolean | number
    /**
     * @deprecated Use `uid` instead.
     * The configurable option ID number assigned by the system.
     */
    id?: boolean | number
    /** A displayed string that describes the configurable product option. */
    label?: boolean | number
    /** A number that indicates the order in which the attribute is displayed. */
    position?: boolean | number
    /**
     * @deprecated `product_id` is not needed and can be obtained from its parent.
     * This is the same as a product's `id` field.
     */
    product_id?: boolean | number
    /** The unique ID for a `ConfigurableProductOptions` object. */
    uid?: boolean | number
    /** Indicates whether the option is the default. */
    use_default?: boolean | number
    /** An array that defines the `value_index` codes assigned to the configurable product. */
    values?: ConfigurableProductOptionsValuesGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains metadata corresponding to the selected configurable options. */
export interface ConfigurableProductOptionsSelectionGenqlSelection{
    /** An array of all possible configurable options. */
    configurable_options?: ConfigurableProductOptionGenqlSelection
    /** Product images and videos corresponding to the specified configurable options selection. */
    media_gallery?: MediaGalleryInterfaceGenqlSelection
    /** The configurable options available for further selection based on the current selection. */
    options_available_for_selection?: ConfigurableOptionAvailableForSelectionGenqlSelection
    /**
     * A variant represented by the specified configurable options selection. The
     * value is expected to be null until selections are made for each configurable option.
     */
    variant?: SimpleProductGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the index number assigned to a configurable product option. */
export interface ConfigurableProductOptionsValuesGenqlSelection{
    /** The label of the product on the default store. */
    default_label?: boolean | number
    /** The label of the product. */
    label?: boolean | number
    /** The label of the product on the current store. */
    store_label?: boolean | number
    /** Swatch data for a configurable product option. */
    swatch_data?: SwatchDataInterfaceGenqlSelection
    /** The unique ID for a `ConfigurableProductOptionsValues` object. */
    uid?: boolean | number
    /** Indicates whether to use the default_label. */
    use_default_value?: boolean | number
    /**
     * @deprecated Use `uid` instead.
     * A unique index number assigned to the configurable product option.
     */
    value_index?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a value for a configurable product option. */
export interface ConfigurableProductOptionValueGenqlSelection{
    /** Indicates whether the product is available with this selected option. */
    is_available?: boolean | number
    /** Indicates whether the value is the default. */
    is_use_default?: boolean | number
    /** The display name of the value. */
    label?: boolean | number
    /** The URL assigned to the thumbnail of the swatch image. */
    swatch?: SwatchDataInterfaceGenqlSelection
    /** The unique ID of the value. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains all the simple product variants of a configurable product. */
export interface ConfigurableVariantGenqlSelection{
    /** An array of configurable attribute options. */
    attributes?: ConfigurableAttributeOptionGenqlSelection
    /** An array of linked simple products. */
    product?: SimpleProductGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A configurable product wish list item. */
export interface ConfigurableWishlistItemGenqlSelection{
    /** The date and time the item was added to the wish list. */
    added_at?: boolean | number
    /**
     * @deprecated Use `ConfigurableWishlistItem.configured_variant.sku` instead.
     * The SKU of the simple product corresponding to a set of selected configurable options.
     */
    child_sku?: boolean | number
    /** An array of selected configurable options. */
    configurable_options?: SelectedConfigurableOptionGenqlSelection
    /** Product details of the selected variant. The value is null if some options are not configured. */
    configured_variant?: ProductInterfaceGenqlSelection
    /** Custom options selected for the wish list item. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** The description of the item. */
    description?: boolean | number
    /** The unique ID for a `WishlistItemInterface` object. */
    id?: boolean | number
    /** Product details of the wish list item. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this wish list item. */
    quantity?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a customer email address to confirm. */
export interface ConfirmEmailInput {
/** The key to confirm the email address. */
confirmation_key: Scalars['String'],
/** The email address to be confirmed. */
email: Scalars['String']}

export interface ContactUsInput {
/** The shopper's comment to the merchant. */
comment: Scalars['String'],
/** The email address of the shopper. */
email: Scalars['String'],
/** The full name of the shopper. */
name: Scalars['String'],
/** The shopper's telephone number. */
telephone?: (Scalars['String'] | null)}


/** Contains the status of the request. */
export interface ContactUsOutputGenqlSelection{
    /** Indicates whether the request was successful. */
    status?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CountryGenqlSelection{
    /** An array of regions within a particular country. */
    available_regions?: RegionGenqlSelection
    /** The name of the country in English. */
    full_name_english?: boolean | number
    /** The name of the country in the current locale. */
    full_name_locale?: boolean | number
    /** The unique ID for a `Country` object. */
    id?: boolean | number
    /** The three-letter abbreviation of the country, such as USA. */
    three_letter_abbreviation?: boolean | number
    /** The two-letter abbreviation of the country, such as US. */
    two_letter_abbreviation?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains an array of product IDs to use for creating a compare list. */
export interface CreateCompareListInput {
/** An array of product IDs to add to the compare list. */
products?: ((Scalars['ID'] | null)[] | null)}


/** Assigns a specific `cart_id` to the empty cart. */
export interface createEmptyCartInput {
/** The ID to assign to the cart. */
cart_id?: (Scalars['String'] | null)}

export interface CreateGuestCartInput {
/** Optional client-generated ID */
cart_uid?: (Scalars['ID'] | null)}

export interface CreateGuestCartOutputGenqlSelection{
    /** The newly created cart. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the secure information used to authorize transaction. Applies to Payflow Pro and Payments Pro payment methods. */
export interface CreatePayflowProTokenOutputGenqlSelection{
    /** The RESPMSG returned by PayPal. If the `result` is `0`, then `response_message` is `Approved`. */
    response_message?: boolean | number
    /** A non-zero value if any errors occurred. */
    result?: boolean | number
    /** The RESULT returned by PayPal. A value of `0` indicates the transaction was approved. */
    result_code?: boolean | number
    /** A secure token generated by PayPal. */
    secure_token?: boolean | number
    /** A secure token ID generated by PayPal. */
    secure_token_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains payment order details that are used while processing the payment order */
export interface CreatePaymentOrderInput {
/** The customer cart ID */
cartId: Scalars['String'],
/** Defines the origin location for that payment request */
location: PaymentLocation,
/** The code for the payment method used in the order */
methodCode: Scalars['String'],
/** The identifiable payment source for the payment method */
paymentSource: Scalars['String'],
/** Indicates whether the payment information should be vaulted */
vaultIntent?: (Scalars['Boolean'] | null)}


/** Contains payment order details that are used while processing the payment order */
export interface CreatePaymentOrderOutputGenqlSelection{
    /** The amount of the payment order */
    amount?: boolean | number
    /** The currency of the payment order */
    currency_code?: boolean | number
    /** PayPal order ID */
    id?: boolean | number
    /** The order ID generated by Payment Services */
    mp_order_id?: boolean | number
    /** The status of the payment order */
    status?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a new product review. */
export interface CreateProductReviewInput {
/** The customer's nickname. Defaults to the customer name, if logged in. */
nickname: Scalars['String'],
/** The ratings details by category. For example, Price: 5 stars, Quality: 4 stars, etc. */
ratings: (ProductReviewRatingInput | null)[],
/** The SKU of the reviewed product. */
sku: Scalars['String'],
/** The summary (title) of the review. */
summary: Scalars['String'],
/** The review text. */
text: Scalars['String']}


/** Contains the completed product review. */
export interface CreateProductReviewOutputGenqlSelection{
    /** Product review details. */
    review?: ProductReviewGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Describe the variables needed to create a vault payment token */
export interface CreateVaultCardPaymentTokenInput {
/** Description of the vaulted card */
card_description?: (Scalars['String'] | null),
/** The setup token obtained by the createVaultCardSetupToken endpoint */
setup_token_id: Scalars['String']}


/** The vault token id and information about the payment source */
export interface CreateVaultCardPaymentTokenOutputGenqlSelection{
    /** The payment source information */
    payment_source?: PaymentSourceOutputGenqlSelection
    /** The vault payment token information */
    vault_token_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Describe the variables needed to create a vault card setup token */
export interface CreateVaultCardSetupTokenInput {
/** The setup token information */
setup_token: VaultSetupTokenInput,
/** The 3DS mode */
three_ds_mode?: (ThreeDSMode | null)}


/** The setup token id information */
export interface CreateVaultCardSetupTokenOutputGenqlSelection{
    /** The setup token id */
    setup_token?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Required fields for Payflow Pro and Payments Pro credit card payments. */
export interface CreditCardDetailsInput {
/** The credit card expiration month. */
cc_exp_month: Scalars['Int'],
/** The credit card expiration year. */
cc_exp_year: Scalars['Int'],
/** The last 4 digits of the credit card. */
cc_last_4: Scalars['Int'],
/** The credit card type. */
cc_type: Scalars['String']}


/** Contains credit memo details. */
export interface CreditMemoGenqlSelection{
    /** Comments on the credit memo. */
    comments?: SalesCommentItemGenqlSelection
    /** The unique ID for a `CreditMemo` object. */
    id?: boolean | number
    /** An array containing details about refunded items. */
    items?: CreditMemoItemInterfaceGenqlSelection
    /** The sequential credit memo number. */
    number?: boolean | number
    /** Details about the total refunded amount. */
    total?: CreditMemoTotalGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CreditMemoItemGenqlSelection{
    /** Details about the final discount amount for the base product, including discounts on options. */
    discounts?: DiscountGenqlSelection
    /** The unique ID for a `CreditMemoItemInterface` object. */
    id?: boolean | number
    /** The order item the credit memo is applied to. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product, including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of refunded items. */
    quantity_refunded?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Credit memo item details. */
export interface CreditMemoItemInterfaceGenqlSelection{
    /** Details about the final discount amount for the base product, including discounts on options. */
    discounts?: DiscountGenqlSelection
    /** The unique ID for a `CreditMemoItemInterface` object. */
    id?: boolean | number
    /** The order item the credit memo is applied to. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product, including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of refunded items. */
    quantity_refunded?: boolean | number
    on_BundleCreditMemoItem?: BundleCreditMemoItemGenqlSelection
    on_CreditMemoItem?: CreditMemoItemGenqlSelection
    on_DownloadableCreditMemoItem?: DownloadableCreditMemoItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains credit memo price details. */
export interface CreditMemoTotalGenqlSelection{
    /** An adjustment manually applied to the order. */
    adjustment?: MoneyGenqlSelection
    /** The final base grand total amount in the base currency. */
    base_grand_total?: MoneyGenqlSelection
    /** The applied discounts to the credit memo. */
    discounts?: DiscountGenqlSelection
    /** The final total amount, including shipping, discounts, and taxes. */
    grand_total?: MoneyGenqlSelection
    /** Details about the shipping and handling costs for the credit memo. */
    shipping_handling?: ShippingHandlingGenqlSelection
    /** The subtotal of the invoice, excluding shipping, discounts, and taxes. */
    subtotal?: MoneyGenqlSelection
    /** The credit memo tax details. */
    taxes?: TaxItemGenqlSelection
    /** The shipping amount for the credit memo. */
    total_shipping?: MoneyGenqlSelection
    /** The amount of tax applied to the credit memo. */
    total_tax?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CurrencyGenqlSelection{
    /** An array of three-letter currency codes accepted by the store, such as USD and EUR. */
    available_currency_codes?: boolean | number
    /** The base currency set for the store, such as USD. */
    base_currency_code?: boolean | number
    /** The symbol for the specified base currency, such as $. */
    base_currency_symbol?: boolean | number
    /** @deprecated Symbol was missed. Use `default_display_currency_code`. */
    default_display_currecy_code?: boolean | number
    /** @deprecated Symbol was missed. Use `default_display_currency_code`. */
    default_display_currecy_symbol?: boolean | number
    /** The currency that is displayed by default, such as USD. */
    default_display_currency_code?: boolean | number
    /** The currency symbol that is displayed by default, such as $. */
    default_display_currency_symbol?: boolean | number
    /** An array of exchange rates for currencies defined in the store. */
    exchange_rates?: ExchangeRateGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines an array of custom attributes. */
export interface CustomAttributeMetadataGenqlSelection{
    /** An array of attributes. */
    items?: AttributeGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An interface containing fields that define the EAV attribute. */
export interface CustomAttributeMetadataInterfaceGenqlSelection{
    /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
    code?: boolean | number
    /** Default attribute value. */
    default_value?: boolean | number
    /** The type of entity that defines the attribute. */
    entity_type?: boolean | number
    /** The frontend class of the attribute. */
    frontend_class?: boolean | number
    /** The frontend input type of the attribute. */
    frontend_input?: boolean | number
    /** Whether the attribute value is required. */
    is_required?: boolean | number
    /** Whether the attribute value must be unique. */
    is_unique?: boolean | number
    /** The label assigned to the attribute. */
    label?: boolean | number
    /** Attribute options. */
    options?: CustomAttributeOptionInterfaceGenqlSelection
    on_AttributeMetadata?: AttributeMetadataGenqlSelection
    on_CatalogAttributeMetadata?: CatalogAttributeMetadataGenqlSelection
    on_CustomerAttributeMetadata?: CustomerAttributeMetadataGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CustomAttributeOptionInterfaceGenqlSelection{
    /** Is the option value default. */
    is_default?: boolean | number
    /** The label assigned to the attribute option. */
    label?: boolean | number
    /** The attribute option value. */
    value?: boolean | number
    on_AttributeOptionMetadata?: AttributeOptionMetadataGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the customer name, addresses, and other details. */
export interface CustomerGenqlSelection{
    /** An array containing the customer's shipping and billing addresses. */
    addresses?: CustomerAddressGenqlSelection
    /** Indicates whether the customer has enabled remote shopping assistance. */
    allow_remote_shopping_assistance?: boolean | number
    /** The contents of the customer's compare list. */
    compare_list?: CompareListGenqlSelection
    /** The customer's confirmation status. */
    confirmation_status?: boolean | number
    /** Timestamp indicating when the account was created. */
    created_at?: boolean | number
    /** Customer's custom attributes. */
    custom_attributes?: (AttributeValueInterfaceGenqlSelection & { __args?: {attributeCodes?: (Scalars['ID'][] | null)} })
    /** The customer's date of birth. */
    date_of_birth?: boolean | number
    /** The ID assigned to the billing address. */
    default_billing?: boolean | number
    /** The ID assigned to the shipping address. */
    default_shipping?: boolean | number
    /**
     * @deprecated Use `date_of_birth` instead.
     * The customer's date of birth.
     */
    dob?: boolean | number
    /** The customer's email address. Required. */
    email?: boolean | number
    /** The customer's first name. */
    firstname?: boolean | number
    /** The customer's gender (Male - 1, Female - 2). */
    gender?: boolean | number
    /** @deprecated Customer group should not be exposed in the storefront scenarios. */
    group_id?: boolean | number
    /**
     * @deprecated `id` is not needed as part of `Customer`, because on the server side, it can be identified based on the customer token used for authentication. There is no need to know customer ID on the client side.
     * The ID assigned to the customer.
     */
    id?: boolean | number
    /** Indicates whether the customer is subscribed to the company's newsletter. */
    is_subscribed?: boolean | number
    /** The customer's family name. */
    lastname?: boolean | number
    /** The customer's middle name. */
    middlename?: boolean | number
    orders?: (CustomerOrdersGenqlSelection & { __args?: {
    /** Defines the filter to use for searching customer orders. */
    filter?: (CustomerOrdersFilterInput | null), 
    /** Specifies which page of results to return. The default value is 1. */
    currentPage?: (Scalars['Int'] | null), 
    /** Specifies the maximum number of results to return at once. The default value is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** Specifies which field to sort on, and whether to return the results in ascending or descending order. */
    sort?: (CustomerOrderSortInput | null), 
    /**
     * Specifies the scope to search for customer orders. The Store request header
     * identifies the customer's store view code. The default value of STORE limits
     * the search to the value specified in the header. Specify WEBSITE to expand
     * the search to include all customer orders assigned to the website that is
     * defined in the header, or specify GLOBAL to include all customer orders
     * across all websites and stores.
     */
    scope?: (ScopeTypeEnum | null)} })
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix?: boolean | number
    /** Contains the customer's product reviews. */
    reviews?: (ProductReviewsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default value is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default value is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /** A value such as Sr., Jr., or III. */
    suffix?: boolean | number
    /** The customer's Value-added tax (VAT) number (for corporate customers). */
    taxvat?: boolean | number
    /**
     * @deprecated Use `Customer.wishlists` or `Customer.wishlist_v2` instead.
     * Return a customer's wish lists.
     */
    wishlist?: WishlistGenqlSelection
    /** Retrieve the wish list identified by the unique ID for a `Wishlist` object. */
    wishlist_v2?: (WishlistGenqlSelection & { __args: {id: Scalars['ID']} })
    /**
     * An array of wishlists. In Magento Open Source, customers are limited to one
     * wish list. The number of wish lists is configurable for Adobe Commerce.
     */
    wishlists?: (WishlistGenqlSelection & { __args?: {
    /** Specifies the maximum number of results to return at once. This attribute is optional. */
    pageSize?: (Scalars['Int'] | null), 
    /** Specifies which page of results to return. The default value is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains detailed information about a customer's billing or shipping address. */
export interface CustomerAddressGenqlSelection{
    /** The customer's city or town. */
    city?: boolean | number
    /** The customer's company. */
    company?: boolean | number
    /** The customer's country. */
    country_code?: boolean | number
    /**
     * @deprecated Use `country_code` instead.
     * The customer's country.
     */
    country_id?: boolean | number
    /** @deprecated Use custom_attributesV2 instead. */
    custom_attributes?: CustomerAddressAttributeGenqlSelection
    /** Custom attributes assigned to the customer address. */
    custom_attributesV2?: (AttributeValueInterfaceGenqlSelection & { __args?: {attributeCodes?: (Scalars['ID'][] | null)} })
    /**
     * @deprecated `customer_id` is not needed as part of `CustomerAddress`. The `id` is a unique identifier for the addresses.
     * The customer ID
     */
    customer_id?: boolean | number
    /** Indicates whether the address is the customer's default billing address. */
    default_billing?: boolean | number
    /** Indicates whether the address is the customer's default shipping address. */
    default_shipping?: boolean | number
    /** Contains any extension attributes for the address. */
    extension_attributes?: CustomerAddressAttributeGenqlSelection
    /** The customer's fax number. */
    fax?: boolean | number
    /** The first name of the person associated with the shipping/billing address. */
    firstname?: boolean | number
    /** The ID of a `CustomerAddress` object. */
    id?: boolean | number
    /** The family name of the person associated with the shipping/billing address. */
    lastname?: boolean | number
    /** The middle name of the person associated with the shipping/billing address. */
    middlename?: boolean | number
    /** The customer's ZIP or postal code. */
    postcode?: boolean | number
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix?: boolean | number
    /** An object containing the region name, region code, and region ID. */
    region?: CustomerAddressRegionGenqlSelection
    /** The unique ID for a pre-defined region. */
    region_id?: boolean | number
    /** An array of strings that define the street number and name. */
    street?: boolean | number
    /** A value such as Sr., Jr., or III. */
    suffix?: boolean | number
    /** The customer's telephone number. */
    telephone?: boolean | number
    /** The customer's Value-added tax (VAT) number (for corporate customers). */
    vat_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Specifies the attribute code and value of a customer address attribute. */
export interface CustomerAddressAttributeGenqlSelection{
    /** The name assigned to the customer address attribute. */
    attribute_code?: boolean | number
    /** The value assigned to the customer address attribute. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Specifies the attribute code and value of a customer attribute. */
export interface CustomerAddressAttributeInput {
/** The name assigned to the attribute. */
attribute_code: Scalars['String'],
/** The value assigned to the attribute. */
value: Scalars['String']}


/** Contains details about a billing or shipping address. */
export interface CustomerAddressInput {
/** The customer's city or town. */
city?: (Scalars['String'] | null),
/** The customer's company. */
company?: (Scalars['String'] | null),
/** The two-letter code representing the customer's country. */
country_code?: (CountryCodeEnum | null),
/** Deprecated: use `country_code` instead. */
country_id?: (CountryCodeEnum | null),
/** Deprecated. Use custom_attributesV2 instead. */
custom_attributes?: ((CustomerAddressAttributeInput | null)[] | null),
/** Custom attributes assigned to the customer address. */
custom_attributesV2?: ((AttributeValueInput | null)[] | null),
/** Indicates whether the address is the default billing address. */
default_billing?: (Scalars['Boolean'] | null),
/** Indicates whether the address is the default shipping address. */
default_shipping?: (Scalars['Boolean'] | null),
/** The customer's fax number. */
fax?: (Scalars['String'] | null),
/** The first name of the person associated with the billing/shipping address. */
firstname?: (Scalars['String'] | null),
/** The family name of the person associated with the billing/shipping address. */
lastname?: (Scalars['String'] | null),
/** The middle name of the person associated with the billing/shipping address. */
middlename?: (Scalars['String'] | null),
/** The customer's ZIP or postal code. */
postcode?: (Scalars['String'] | null),
/** An honorific, such as Dr., Mr., or Mrs. */
prefix?: (Scalars['String'] | null),
/** An object containing the region name, region code, and region ID. */
region?: (CustomerAddressRegionInput | null),
/** An array of strings that define the street number and name. */
street?: ((Scalars['String'] | null)[] | null),
/** A value such as Sr., Jr., or III. */
suffix?: (Scalars['String'] | null),
/** The customer's telephone number. */
telephone?: (Scalars['String'] | null),
/** The customer's Tax/VAT number (for corporate customers). */
vat_id?: (Scalars['String'] | null)}


/** Defines the customer's state or province. */
export interface CustomerAddressRegionGenqlSelection{
    /** The state or province name. */
    region?: boolean | number
    /** The address region code. */
    region_code?: boolean | number
    /** The unique ID for a pre-defined region. */
    region_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the customer's state or province. */
export interface CustomerAddressRegionInput {
/** The state or province name. */
region?: (Scalars['String'] | null),
/** The address region code. */
region_code?: (Scalars['String'] | null),
/** The unique ID for a pre-defined region. */
region_id?: (Scalars['Int'] | null)}


/** Customer attribute metadata. */
export interface CustomerAttributeMetadataGenqlSelection{
    /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
    code?: boolean | number
    /** Default attribute value. */
    default_value?: boolean | number
    /** The type of entity that defines the attribute. */
    entity_type?: boolean | number
    /** The frontend class of the attribute. */
    frontend_class?: boolean | number
    /** The frontend input type of the attribute. */
    frontend_input?: boolean | number
    /** The template used for the input of the attribute (e.g., 'date'). */
    input_filter?: boolean | number
    /** Whether the attribute value is required. */
    is_required?: boolean | number
    /** Whether the attribute value must be unique. */
    is_unique?: boolean | number
    /** The label assigned to the attribute. */
    label?: boolean | number
    /** The number of lines of the attribute value. */
    multiline_count?: boolean | number
    /** Attribute options. */
    options?: CustomAttributeOptionInterfaceGenqlSelection
    /** The position of the attribute in the form. */
    sort_order?: boolean | number
    /** The validation rules of the attribute value. */
    validate_rules?: ValidationRuleGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An input object for creating a customer. */
export interface CustomerCreateInput {
/** Indicates whether the customer has enabled remote shopping assistance. */
allow_remote_shopping_assistance?: (Scalars['Boolean'] | null),
/** The customer's custom attributes. */
custom_attributes?: ((AttributeValueInput | null)[] | null),
/** The customer's date of birth. */
date_of_birth?: (Scalars['String'] | null),
/** Deprecated: Use `date_of_birth` instead. */
dob?: (Scalars['String'] | null),
/** The customer's email address. */
email: Scalars['String'],
/** The customer's first name. */
firstname: Scalars['String'],
/** The customer's gender (Male - 1, Female - 2). */
gender?: (Scalars['Int'] | null),
/** Indicates whether the customer is subscribed to the company's newsletter. */
is_subscribed?: (Scalars['Boolean'] | null),
/** The customer's family name. */
lastname: Scalars['String'],
/** The customer's middle name. */
middlename?: (Scalars['String'] | null),
/** The customer's password. */
password?: (Scalars['String'] | null),
/** An honorific, such as Dr., Mr., or Mrs. */
prefix?: (Scalars['String'] | null),
/** A value such as Sr., Jr., or III. */
suffix?: (Scalars['String'] | null),
/** The customer's Tax/VAT number (for corporate customers). */
taxvat?: (Scalars['String'] | null)}


/** Contains details about a single downloadable product. */
export interface CustomerDownloadableProductGenqlSelection{
    /** The date and time the purchase was made. */
    date?: boolean | number
    /** The fully qualified URL to the download file. */
    download_url?: boolean | number
    /** The unique ID assigned to the item. */
    order_increment_id?: boolean | number
    /** The remaining number of times the customer can download the product. */
    remaining_downloads?: boolean | number
    /** Indicates when the product becomes available for download. Options are `Pending` and `Invoiced`. */
    status?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains a list of downloadable products. */
export interface CustomerDownloadableProductsGenqlSelection{
    /** An array of purchased downloadable items. */
    items?: CustomerDownloadableProductGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An input object that assigns or updates customer attributes. */
export interface CustomerInput {
/** The customer's date of birth. */
date_of_birth?: (Scalars['String'] | null),
/** Deprecated: Use `date_of_birth` instead. */
dob?: (Scalars['String'] | null),
/** The customer's email address. Required when creating a customer. */
email?: (Scalars['String'] | null),
/** The customer's first name. */
firstname?: (Scalars['String'] | null),
/** The customer's gender (Male - 1, Female - 2). */
gender?: (Scalars['Int'] | null),
/** Indicates whether the customer is subscribed to the company's newsletter. */
is_subscribed?: (Scalars['Boolean'] | null),
/** The customer's family name. */
lastname?: (Scalars['String'] | null),
/** The customer's middle name. */
middlename?: (Scalars['String'] | null),
/** The customer's password. */
password?: (Scalars['String'] | null),
/** An honorific, such as Dr., Mr., or Mrs. */
prefix?: (Scalars['String'] | null),
/** A value such as Sr., Jr., or III. */
suffix?: (Scalars['String'] | null),
/** The customer's Tax/VAT number (for corporate customers). */
taxvat?: (Scalars['String'] | null)}


/** Contains details about each of the customer's orders. */
export interface CustomerOrderGenqlSelection{
    /** Coupons applied to the order. */
    applied_coupons?: AppliedCouponGenqlSelection
    /** The billing address for the order. */
    billing_address?: OrderAddressGenqlSelection
    /** The shipping carrier for the order delivery. */
    carrier?: boolean | number
    /** Comments about the order. */
    comments?: SalesCommentItemGenqlSelection
    /** @deprecated Use the `order_date` field instead. */
    created_at?: boolean | number
    /** A list of credit memos. */
    credit_memos?: CreditMemoGenqlSelection
    /** Order customer email. */
    email?: boolean | number
    /** The entered gift message for the order */
    gift_message?: GiftMessageGenqlSelection
    /** @deprecated Use the `totals.grand_total` field instead. */
    grand_total?: boolean | number
    /** The unique ID for a `CustomerOrder` object. */
    id?: boolean | number
    /** @deprecated Use the `id` field instead. */
    increment_id?: boolean | number
    /** A list of invoices for the order. */
    invoices?: InvoiceGenqlSelection
    /** An array containing the items purchased in this order. */
    items?: OrderItemInterfaceGenqlSelection
    /** The order number. */
    number?: boolean | number
    /** The date the order was placed. */
    order_date?: boolean | number
    /** @deprecated Use the `number` field instead. */
    order_number?: boolean | number
    /** Payment details for the order. */
    payment_methods?: OrderPaymentMethodGenqlSelection
    /** A list of shipments for the order. */
    shipments?: OrderShipmentGenqlSelection
    /** The shipping address for the order. */
    shipping_address?: OrderAddressGenqlSelection
    /** The delivery method for the order. */
    shipping_method?: boolean | number
    /** The current status of the order. */
    status?: boolean | number
    /** The token that can be used to retrieve the order using order query. */
    token?: boolean | number
    /** Details about the calculated totals for this order. */
    total?: OrderTotalGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** The collection of orders that match the conditions defined in the filter. */
export interface CustomerOrdersGenqlSelection{
    /** An array of customer orders. */
    items?: CustomerOrderGenqlSelection
    /** Contains pagination metadata. */
    page_info?: SearchResultPageInfoGenqlSelection
    /** The total count of customer orders. */
    total_count?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Identifies the filter to use for filtering orders. */
export interface CustomerOrdersFilterInput {
/** Filters by order number. */
number?: (FilterStringTypeInput | null)}


/**
 * CustomerOrderSortInput specifies the field to use for sorting search results and
 * indicates whether the results are sorted in ascending or descending order.
 */
export interface CustomerOrderSortInput {
/** This enumeration indicates whether to return results in ascending or descending order */
sort_direction: SortEnum,
/** Specifies the field to use for sorting */
sort_field: CustomerOrderSortableField}


/** Contains details about a newly-created or updated customer. */
export interface CustomerOutputGenqlSelection{
    /** Customer details after creating or updating a customer. */
    customer?: CustomerGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains payment tokens stored in the customer's vault. */
export interface CustomerPaymentTokensGenqlSelection{
    /** An array of payment tokens. */
    items?: PaymentTokenGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains a customer authorization token. */
export interface CustomerTokenGenqlSelection{
    /** The customer authorization token. */
    token?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An input object for updating a customer. */
export interface CustomerUpdateInput {
/** Indicates whether the customer has enabled remote shopping assistance. */
allow_remote_shopping_assistance?: (Scalars['Boolean'] | null),
/** The customer's custom attributes. */
custom_attributes?: ((AttributeValueInput | null)[] | null),
/** The customer's date of birth. */
date_of_birth?: (Scalars['String'] | null),
/** Deprecated: Use `date_of_birth` instead. */
dob?: (Scalars['String'] | null),
/** The customer's first name. */
firstname?: (Scalars['String'] | null),
/** The customer's gender (Male - 1, Female - 2). */
gender?: (Scalars['Int'] | null),
/** Indicates whether the customer is subscribed to the company's newsletter. */
is_subscribed?: (Scalars['Boolean'] | null),
/** The customer's family name. */
lastname?: (Scalars['String'] | null),
/** The customer's middle name. */
middlename?: (Scalars['String'] | null),
/** An honorific, such as Dr., Mr., or Mrs. */
prefix?: (Scalars['String'] | null),
/** A value such as Sr., Jr., or III. */
suffix?: (Scalars['String'] | null),
/** The customer's Tax/VAT number (for corporate customers). */
taxvat?: (Scalars['String'] | null)}


/** Contains information about a text area that is defined as part of a customizable option. */
export interface CustomizableAreaOptionGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id?: boolean | number
    /** The Stock Keeping Unit of the base product. */
    product_sku?: boolean | number
    /** Indicates whether the option is required. */
    required?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid?: boolean | number
    /** An object that defines a text area. */
    value?: CustomizableAreaValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the price and sku of a product whose page contains a customized text area. */
export interface CustomizableAreaValueGenqlSelection{
    /** The maximum number of characters that can be entered for this customizable option. */
    max_characters?: boolean | number
    /** The price assigned to this option. */
    price?: boolean | number
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type?: boolean | number
    /** The Stock Keeping Unit for this option. */
    sku?: boolean | number
    /** The unique ID for a `CustomizableAreaValue` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about a set of checkbox values that are defined as part of a customizable option. */
export interface CustomizableCheckboxOptionGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id?: boolean | number
    /** Indicates whether the option is required. */
    required?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid?: boolean | number
    /** An array that defines a set of checkbox values. */
    value?: CustomizableCheckboxValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the price and sku of a product whose page contains a customized set of checkbox values. */
export interface CustomizableCheckboxValueGenqlSelection{
    /** The ID assigned to the value. */
    option_type_id?: boolean | number
    /** The price assigned to this option. */
    price?: boolean | number
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type?: boolean | number
    /** The Stock Keeping Unit for this option. */
    sku?: boolean | number
    /** The order in which the checkbox value is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableCheckboxValue` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about a date picker that is defined as part of a customizable option. */
export interface CustomizableDateOptionGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id?: boolean | number
    /** The Stock Keeping Unit of the base product. */
    product_sku?: boolean | number
    /** Indicates whether the option is required. */
    required?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid?: boolean | number
    /** An object that defines a date field in a customizable option. */
    value?: CustomizableDateValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the price and sku of a product whose page contains a customized date picker. */
export interface CustomizableDateValueGenqlSelection{
    /** The price assigned to this option. */
    price?: boolean | number
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type?: boolean | number
    /** The Stock Keeping Unit for this option. */
    sku?: boolean | number
    /** DATE, DATE_TIME or TIME */
    type?: boolean | number
    /** The unique ID for a `CustomizableDateValue` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about a drop down menu that is defined as part of a customizable option. */
export interface CustomizableDropDownOptionGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id?: boolean | number
    /** Indicates whether the option is required. */
    required?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid?: boolean | number
    /** An array that defines the set of options for a drop down menu. */
    value?: CustomizableDropDownValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the price and sku of a product whose page contains a customized drop down menu. */
export interface CustomizableDropDownValueGenqlSelection{
    /** The ID assigned to the value. */
    option_type_id?: boolean | number
    /** The price assigned to this option. */
    price?: boolean | number
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type?: boolean | number
    /** The Stock Keeping Unit for this option. */
    sku?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableDropDownValue` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about a text field that is defined as part of a customizable option. */
export interface CustomizableFieldOptionGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id?: boolean | number
    /** The Stock Keeping Unit of the base product. */
    product_sku?: boolean | number
    /** Indicates whether the option is required. */
    required?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid?: boolean | number
    /** An object that defines a text field. */
    value?: CustomizableFieldValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the price and sku of a product whose page contains a customized text field. */
export interface CustomizableFieldValueGenqlSelection{
    /** The maximum number of characters that can be entered for this customizable option. */
    max_characters?: boolean | number
    /** The price of the custom value. */
    price?: boolean | number
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type?: boolean | number
    /** The Stock Keeping Unit for this option. */
    sku?: boolean | number
    /** The unique ID for a `CustomizableFieldValue` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about a file picker that is defined as part of a customizable option. */
export interface CustomizableFileOptionGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id?: boolean | number
    /** The Stock Keeping Unit of the base product. */
    product_sku?: boolean | number
    /** Indicates whether the option is required. */
    required?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid?: boolean | number
    /** An object that defines a file value. */
    value?: CustomizableFileValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the price and sku of a product whose page contains a customized file picker. */
export interface CustomizableFileValueGenqlSelection{
    /** The file extension to accept. */
    file_extension?: boolean | number
    /** The maximum width of an image. */
    image_size_x?: boolean | number
    /** The maximum height of an image. */
    image_size_y?: boolean | number
    /** The price assigned to this option. */
    price?: boolean | number
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type?: boolean | number
    /** The Stock Keeping Unit for this option. */
    sku?: boolean | number
    /** The unique ID for a `CustomizableFileValue` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about a multiselect that is defined as part of a customizable option. */
export interface CustomizableMultipleOptionGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id?: boolean | number
    /** Indicates whether the option is required. */
    required?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid?: boolean | number
    /** An array that defines the set of options for a multiselect. */
    value?: CustomizableMultipleValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the price and sku of a product whose page contains a customized multiselect. */
export interface CustomizableMultipleValueGenqlSelection{
    /** The ID assigned to the value. */
    option_type_id?: boolean | number
    /** The price assigned to this option. */
    price?: boolean | number
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type?: boolean | number
    /** The Stock Keeping Unit for this option. */
    sku?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableMultipleValue` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a customizable option. */
export interface CustomizableOptionInput {
/** The customizable option ID of the product. */
id?: (Scalars['Int'] | null),
/** The unique ID for a `CartItemInterface` object. */
uid?: (Scalars['ID'] | null),
/** The string value of the option. */
value_string: Scalars['String']}


/** Contains basic information about a customizable option. It can be implemented by several types of configurable options. */
export interface CustomizableOptionInterfaceGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id?: boolean | number
    /** Indicates whether the option is required. */
    required?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid?: boolean | number
    on_CustomizableAreaOption?: CustomizableAreaOptionGenqlSelection
    on_CustomizableCheckboxOption?: CustomizableCheckboxOptionGenqlSelection
    on_CustomizableDateOption?: CustomizableDateOptionGenqlSelection
    on_CustomizableDropDownOption?: CustomizableDropDownOptionGenqlSelection
    on_CustomizableFieldOption?: CustomizableFieldOptionGenqlSelection
    on_CustomizableFileOption?: CustomizableFileOptionGenqlSelection
    on_CustomizableMultipleOption?: CustomizableMultipleOptionGenqlSelection
    on_CustomizableRadioOption?: CustomizableRadioOptionGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about customizable product options. */
export interface CustomizableProductInterfaceGenqlSelection{
    /** An array of options for a customizable product. */
    options?: CustomizableOptionInterfaceGenqlSelection
    on_BundleProduct?: BundleProductGenqlSelection
    on_ConfigurableProduct?: ConfigurableProductGenqlSelection
    on_DownloadableProduct?: DownloadableProductGenqlSelection
    on_SimpleProduct?: SimpleProductGenqlSelection
    on_VirtualProduct?: VirtualProductGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about a set of radio buttons that are defined as part of a customizable option. */
export interface CustomizableRadioOptionGenqlSelection{
    /**
     * @deprecated Use `uid` instead
     * Option ID.
     */
    option_id?: boolean | number
    /** Indicates whether the option is required. */
    required?: boolean | number
    /** The order in which the option is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableOptionInterface` object. */
    uid?: boolean | number
    /** An array that defines a set of radio buttons. */
    value?: CustomizableRadioValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the price and sku of a product whose page contains a customized set of radio buttons. */
export interface CustomizableRadioValueGenqlSelection{
    /** The ID assigned to the value. */
    option_type_id?: boolean | number
    /** The price assigned to this option. */
    price?: boolean | number
    /** FIXED, PERCENT, or DYNAMIC. */
    price_type?: boolean | number
    /** The Stock Keeping Unit for this option. */
    sku?: boolean | number
    /** The order in which the radio button is displayed. */
    sort_order?: boolean | number
    /** The display name for this option. */
    title?: boolean | number
    /** The unique ID for a `CustomizableRadioValue` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the results of the request to delete a compare list. */
export interface DeleteCompareListOutputGenqlSelection{
    /** Indicates whether the compare list was successfully deleted. */
    result?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Indicates whether the request succeeded and returns the remaining customer payment tokens. */
export interface DeletePaymentTokenOutputGenqlSelection{
    /** A container for the customer's remaining payment tokens. */
    customerPaymentTokens?: CustomerPaymentTokensGenqlSelection
    /** Indicates whether the request succeeded. */
    result?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines an individual discount. A discount can be applied to the cart as a whole or to an item, shipping. */
export interface DiscountGenqlSelection{
    /** The amount of the discount. */
    amount?: MoneyGenqlSelection
    /** The type of the entity the discount is applied to. */
    applied_to?: boolean | number
    /** The coupon related to the discount. */
    coupon?: AppliedCouponGenqlSelection
    /** A description of the discount. */
    label?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An implementation for downloadable product cart items. */
export interface DownloadableCartItemGenqlSelection{
    /** An array containing the customizable options the shopper selected. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** An array of errors encountered while loading the cart item */
    errors?: CartItemErrorGenqlSelection
    /** @deprecated Use `uid` instead. */
    id?: boolean | number
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available?: boolean | number
    /** An array containing information about the links for the downloadable product added to the cart. */
    links?: DownloadableProductLinksGenqlSelection
    /** Contains details about the price of the item, including taxes and discounts. */
    prices?: CartItemPricesGenqlSelection
    /** Details about an item in the cart. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this item in the cart. */
    quantity?: boolean | number
    /** An array containing information about samples of the selected downloadable product. */
    samples?: DownloadableProductSamplesGenqlSelection
    /** The unique ID for a `CartItemInterface` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines downloadable product options for `CreditMemoItemInterface`. */
export interface DownloadableCreditMemoItemGenqlSelection{
    /** Details about the final discount amount for the base product, including discounts on options. */
    discounts?: DiscountGenqlSelection
    /** A list of downloadable links that are refunded from the downloadable product. */
    downloadable_links?: DownloadableItemsLinksGenqlSelection
    /** The unique ID for a `CreditMemoItemInterface` object. */
    id?: boolean | number
    /** The order item the credit memo is applied to. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product, including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of refunded items. */
    quantity_refunded?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines downloadable product options for `InvoiceItemInterface`. */
export interface DownloadableInvoiceItemGenqlSelection{
    /** Information about the final discount amount for the base product, including discounts on options. */
    discounts?: DiscountGenqlSelection
    /** A list of downloadable links that are invoiced from the downloadable product. */
    downloadable_links?: DownloadableItemsLinksGenqlSelection
    /** The unique ID for an `InvoiceItemInterface` object. */
    id?: boolean | number
    /** Details about an individual order item. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of invoiced items. */
    quantity_invoiced?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines characteristics of the links for downloadable product. */
export interface DownloadableItemsLinksGenqlSelection{
    /** A number indicating the sort order. */
    sort_order?: boolean | number
    /** The display name of the link. */
    title?: boolean | number
    /** The unique ID for a `DownloadableItemsLinks` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines downloadable product options for `OrderItemInterface`. */
export interface DownloadableOrderItemGenqlSelection{
    /** The final discount information for the product. */
    discounts?: DiscountGenqlSelection
    /** A list of downloadable links that are ordered from the downloadable product. */
    downloadable_links?: DownloadableItemsLinksGenqlSelection
    /** The entered option for the base product, such as a logo or image. */
    entered_options?: OrderItemOptionGenqlSelection
    /** The selected gift message for the order item */
    gift_message?: GiftMessageGenqlSelection
    /** The unique ID for an `OrderItemInterface` object. */
    id?: boolean | number
    /** The ProductInterface object, which contains details about the base product */
    product?: ProductInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price of the base product, including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The type of product, such as simple, configurable, etc. */
    product_type?: boolean | number
    /** URL key of the base product. */
    product_url_key?: boolean | number
    /** The number of canceled items. */
    quantity_canceled?: boolean | number
    /** The number of invoiced items. */
    quantity_invoiced?: boolean | number
    /** The number of units ordered for this item. */
    quantity_ordered?: boolean | number
    /** The number of refunded items. */
    quantity_refunded?: boolean | number
    /** The number of returned items. */
    quantity_returned?: boolean | number
    /** The number of shipped items. */
    quantity_shipped?: boolean | number
    /** The selected options for the base product, such as color or size. */
    selected_options?: OrderItemOptionGenqlSelection
    /** The status of the order item. */
    status?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a product that the shopper downloads. */
export interface DownloadableProductGenqlSelection{
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id?: boolean | number
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url?: boolean | number
    /** The categories assigned to a product. */
    categories?: CategoryInterfaceGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    color?: boolean | number
    /** The product's country of origin. */
    country_of_manufacture?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at?: boolean | number
    /** Crosssell Products */
    crosssell_products?: ProductInterfaceGenqlSelection
    /** Product custom attributes. */
    custom_attributesV2?: (ProductCustomAttributesGenqlSelection & { __args?: {filters?: (AttributeFilterInput | null)} })
    /** Detailed information about the product. The value can include simple HTML tags. */
    description?: ComplexTextValueGenqlSelection
    /** An array containing information about the links for this downloadable product. */
    downloadable_product_links?: DownloadableProductLinksGenqlSelection
    /** An array containing information about samples of this downloadable product. */
    downloadable_product_samples?: DownloadableProductSamplesGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size?: boolean | number
    /** Indicates whether a gift message is available. */
    gift_message_available?: boolean | number
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id?: boolean | number
    /** The relative path to the main image on the product page. */
    image?: ProductImageGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested?: boolean | number
    /** A value of 1 indicates that each link in the array must be purchased separately. */
    links_purchased_separately?: boolean | number
    /** The heading above the list of downloadable products. */
    links_title?: boolean | number
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2?: boolean | number
    /** An array of media gallery objects. */
    media_gallery?: MediaGalleryInterfaceGenqlSelection
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries?: MediaGalleryEntryGenqlSelection
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description?: boolean | number
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword?: boolean | number
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title?: boolean | number
    /** The product name. Customers use this name to identify the product. */
    name?: boolean | number
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date?: boolean | number
    /** The end date for new product listings. */
    new_to_date?: boolean | number
    /** Product stock only x left count */
    only_x_left_in_stock?: boolean | number
    /** An array of options for a customizable product. */
    options?: CustomizableOptionInterfaceGenqlSelection
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container?: boolean | number
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price?: ProductPricesGenqlSelection
    /** The range of prices for the product */
    price_range?: PriceRangeGenqlSelection
    /** An array of `TierPrice` objects. */
    price_tiers?: TierPriceGenqlSelection
    /** An array of `ProductLinks` objects. */
    product_links?: ProductLinksInterfaceGenqlSelection
    /** The average of all the ratings given to the product. */
    rating_summary?: boolean | number
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** An array of products to be displayed in a Related Products block. */
    related_products?: ProductInterfaceGenqlSelection
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** The total count of all the reviews given to the product. */
    review_count?: boolean | number
    /** The list of products reviews. */
    reviews?: (ProductReviewsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /** A short description of the product. Its use depends on the theme. */
    short_description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    size?: boolean | number
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku?: boolean | number
    /** The relative path to the small image, which is used on catalog pages. */
    small_image?: ProductImageGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date?: boolean | number
    /** The discounted price of the product. */
    special_price?: boolean | number
    /** The end date for a product with a special price. */
    special_to_date?: boolean | number
    /** Stock status of the product */
    stock_status?: boolean | number
    /** The file name of a swatch image. */
    swatch_image?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    tema?: boolean | number
    /** The relative path to the product's thumbnail image. */
    thumbnail?: ProductImageGenqlSelection
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price?: boolean | number
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices?: ProductTierPricesGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id?: boolean | number
    /** The unique ID for a `ProductInterface` object. */
    uid?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at?: boolean | number
    /** Upsell Products */
    upsell_products?: ProductInterfaceGenqlSelection
    /** The part of the URL that identifies the product */
    url_key?: boolean | number
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path?: boolean | number
    /** URL rewrites list */
    url_rewrites?: UrlRewriteGenqlSelection
    /** The part of the product URL that is appended after the url key */
    url_suffix?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites?: WebsiteGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a single downloadable product. */
export interface DownloadableProductCartItemInput {
/** The ID and value of the option. */
customizable_options?: ((CustomizableOptionInput | null)[] | null),
/** The quantity and SKU of the downloadable product. */
data: CartItemInput,
/** An array of objects containing the link_id of the downloadable product link. */
downloadable_product_links?: ((DownloadableProductLinksInput | null)[] | null)}


/** Defines characteristics of a downloadable product. */
export interface DownloadableProductLinksGenqlSelection{
    /** @deprecated This information should not be exposed on frontend. */
    id?: boolean | number
    /** @deprecated This information should not be exposed on frontend. */
    is_shareable?: boolean | number
    /** @deprecated `sample_url` serves to get the downloadable sample */
    link_type?: boolean | number
    /** @deprecated This information should not be exposed on frontend. */
    number_of_downloads?: boolean | number
    /** The price of the downloadable product. */
    price?: boolean | number
    /** @deprecated `sample_url` serves to get the downloadable sample */
    sample_file?: boolean | number
    /** @deprecated `sample_url` serves to get the downloadable sample */
    sample_type?: boolean | number
    /** The full URL to the downloadable sample. */
    sample_url?: boolean | number
    /** A number indicating the sort order. */
    sort_order?: boolean | number
    /** The display name of the link. */
    title?: boolean | number
    /** The unique ID for a `DownloadableProductLinks` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the link ID for the downloadable product. */
export interface DownloadableProductLinksInput {
/** The unique ID of the downloadable product link. */
link_id: Scalars['Int']}


/** Defines characteristics of a downloadable product. */
export interface DownloadableProductSamplesGenqlSelection{
    /** @deprecated This information should not be exposed on frontend. */
    id?: boolean | number
    /** @deprecated `sample_url` serves to get the downloadable sample */
    sample_file?: boolean | number
    /** @deprecated `sample_url` serves to get the downloadable sample */
    sample_type?: boolean | number
    /** The full URL to the downloadable sample. */
    sample_url?: boolean | number
    /** A number indicating the sort order. */
    sort_order?: boolean | number
    /** The display name of the sample. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A downloadable product wish list item. */
export interface DownloadableWishlistItemGenqlSelection{
    /** The date and time the item was added to the wish list. */
    added_at?: boolean | number
    /** Custom options selected for the wish list item. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** The description of the item. */
    description?: boolean | number
    /** The unique ID for a `WishlistItemInterface` object. */
    id?: boolean | number
    /** An array containing information about the selected links. */
    links_v2?: DownloadableProductLinksGenqlSelection
    /** Product details of the wish list item. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this wish list item. */
    quantity?: boolean | number
    /** An array containing information about the selected samples. */
    samples?: DownloadableProductSamplesGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a customer-entered option. */
export interface EnteredOptionInput {
/**
 * The unique ID for a `CustomizableOptionInterface` object, such as a
 * `CustomizableFieldOption`, `CustomizableFileOption`, or
 * `CustomizableAreaOption` object.
 */
uid: Scalars['ID'],
/** Text the customer entered. */
value: Scalars['String']}


/** Contains the `uid`, `relative_url`, and `type` attributes. */
export interface EntityUrlGenqlSelection{
    /** @deprecated Use `relative_url` instead. */
    canonical_url?: boolean | number
    /**
     * The unique ID for a `ProductInterface`, `CategoryInterface`, `CmsPage`, or
     * similar object associated with the specified URL. This could be a product,
     * category, or CMS page UID.
     */
    entity_uid?: boolean | number
    /**
     * @deprecated Use `entity_uid` instead.
     * The ID assigned to the object associated with the specified url. This could be a product ID, category ID, or page ID.
     */
    id?: boolean | number
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirectCode?: boolean | number
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ErrorInterfaceGenqlSelection{
    /** The returned error message. */
    message?: boolean | number
    on_InternalError?: InternalErrorGenqlSelection
    on_NoSuchEntityUidError?: NoSuchEntityUidErrorGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about an address. */
export interface EstimateAddressInput {
/** The two-letter code representing the customer's country. */
country_code: CountryCodeEnum,
/** The customer's ZIP or postal code. */
postcode?: (Scalars['String'] | null),
/** An object containing the region name, region code, and region ID. */
region?: (CustomerAddressRegionInput | null)}

export interface EstimateTotalsInput {
/** Customer's address to estimate totals. */
address: EstimateAddressInput,
/** The unique ID of the cart to query. */
cart_id: Scalars['String'],
/** Selected shipping method to estimate totals. */
shipping_method?: (ShippingMethodInput | null)}


/** Estimate totals output. */
export interface EstimateTotalsOutputGenqlSelection{
    /** Cart after totals estimation */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Lists the exchange rate. */
export interface ExchangeRateGenqlSelection{
    /** Specifies the store’s default currency to exchange to. */
    currency_to?: boolean | number
    /** The exchange rate for the store’s default currency. */
    rate?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface FastlaneConfigGenqlSelection{
    /** The payment method code as defined in the payment gateway */
    code?: boolean | number
    /** Indicates whether the payment method is displayed */
    is_visible?: boolean | number
    /** Defines the payment intent (Authorize or Capture */
    payment_intent?: boolean | number
    /** The payment source for the payment method */
    payment_source?: boolean | number
    /** The PayPal parameters required to load the JS SDK */
    sdk_params?: SDKParamsGenqlSelection
    /** The relative order the payment method is displayed on the checkout page */
    sort_order?: boolean | number
    /** 3DS mode */
    three_ds_mode?: boolean | number
    /** The name displayed for the payment method */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Fastlane Payment inputs */
export interface FastlaneMethodInput {
/** The payment source for the payment method */
payment_source?: (Scalars['String'] | null),
/** The single use token from Fastlane */
paypal_fastlane_token?: (Scalars['String'] | null)}


/** Defines a filter that matches the input exactly. */
export interface FilterEqualTypeInput {
/**
 * Use this attribute to exactly match the specified string. For example, to
 * filter on a specific category ID, specify a value such as `5`.
 */
eq?: (Scalars['String'] | null),
/**
 * Use this attribute to filter on an array of values. For example, to filter on
 * category IDs 4, 5, and 6, specify a value of `["4", "5", "6"]`.
 */
in?: ((Scalars['String'] | null)[] | null)}


/** Defines a filter that performs a fuzzy search. */
export interface FilterMatchTypeInput {
/**
 * Use this attribute to fuzzy match the specified string. For example, to filter
 * on a specific SKU, specify a value such as `24-MB01`.
 */
match?: (Scalars['String'] | null),
/**
 * Filter match type for fine-tuned results. Possible values FULL or PARTIAL. If
 * match_type is not provided, returned results will default to FULL match.
 */
match_type?: (FilterMatchTypeEnum | null)}


/** Defines a filter that matches a range of values, such as prices or dates. */
export interface FilterRangeTypeInput {
/** Use this attribute to specify the lowest possible value in the range. */
from?: (Scalars['String'] | null),
/** Use this attribute to specify the highest possible value in the range. */
to?: (Scalars['String'] | null)}


/** Defines a filter for an input string. */
export interface FilterStringTypeInput {
/** Filters items that are exactly the same as the specified string. */
eq?: (Scalars['String'] | null),
/** Filters items that are exactly the same as entries specified in an array of strings. */
in?: ((Scalars['String'] | null)[] | null),
/** Defines a filter that performs a fuzzy search using the specified string. */
match?: (Scalars['String'] | null)}


/** Defines the comparison operators that can be used in a filter. */
export interface FilterTypeInput {
/** Equals. */
eq?: (Scalars['String'] | null),finset?: ((Scalars['String'] | null)[] | null),
/** From. Must be used with the `to` field. */
from?: (Scalars['String'] | null),
/** Greater than. */
gt?: (Scalars['String'] | null),
/** Greater than or equal to. */
gteq?: (Scalars['String'] | null),
/** In. The value can contain a set of comma-separated values. */
in?: ((Scalars['String'] | null)[] | null),
/** Like. The specified value can contain % (percent signs) to allow matching of 0 or more characters. */
like?: (Scalars['String'] | null),
/** Less than. */
lt?: (Scalars['String'] | null),
/** Less than or equal to. */
lteq?: (Scalars['String'] | null),
/** More than or equal to. */
moreq?: (Scalars['String'] | null),
/** Not equal to. */
neq?: (Scalars['String'] | null),
/** Not in. The value can contain a set of comma-separated values. */
nin?: ((Scalars['String'] | null)[] | null),
/** Not null. */
notnull?: (Scalars['String'] | null),
/** Is null. */
null?: (Scalars['String'] | null),
/** To. Must be used with the `from` field. */
to?: (Scalars['String'] | null)}


/** Identifies which customer requires remote shopping assistance. */
export interface GenerateCustomerTokenAsAdminInput {
/** The email address of the customer requesting remote shopping assistance. */
customer_email: Scalars['String']}


/** Contains the generated customer token. */
export interface GenerateCustomerTokenAsAdminOutputGenqlSelection{
    /** The generated customer token. */
    customer_token?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Gets the payment SDK URLs and values */
export interface GetPaymentSDKOutputGenqlSelection{
    /** The payment SDK parameters */
    sdkParams?: PaymentSDKParamsItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the text of a gift message, its sender, and recipient */
export interface GiftMessageGenqlSelection{
    /** Sender name */
    from?: boolean | number
    /** Gift message text */
    message?: boolean | number
    /** Recipient name */
    to?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the text of a gift message, its sender, and recipient */
export interface GiftMessageInput {
/** Sender name */
from: Scalars['String'],
/** Gift message text */
message: Scalars['String'],
/** Recipient name */
to: Scalars['String']}

export interface GooglePayButtonStylesGenqlSelection{
    /** The button color */
    color?: boolean | number
    /** The button height in pixels */
    height?: boolean | number
    /** The button type */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface GooglePayConfigGenqlSelection{
    /** The styles for the GooglePay Button configuration */
    button_styles?: GooglePayButtonStylesGenqlSelection
    /** The payment method code as defined in the payment gateway */
    code?: boolean | number
    /** Indicates whether the payment method is displayed */
    is_visible?: boolean | number
    /** Defines the payment intent (Authorize or Capture */
    payment_intent?: boolean | number
    /** The payment source for the payment method */
    payment_source?: boolean | number
    /** The PayPal parameters required to load the JS SDK */
    sdk_params?: SDKParamsGenqlSelection
    /** The relative order the payment method is displayed on the checkout page */
    sort_order?: boolean | number
    /** 3DS mode */
    three_ds_mode?: boolean | number
    /** The name displayed for the payment method */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Google Pay inputs */
export interface GooglePayMethodInput {
/** The payment source for the payment method */
payment_source?: (Scalars['String'] | null),
/** The payment services order ID */
payments_order_id?: (Scalars['String'] | null),
/** PayPal order ID */
paypal_order_id?: (Scalars['String'] | null)}


/** Defines a grouped product, which consists of simple standalone products that are presented as a group. */
export interface GroupedProductGenqlSelection{
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id?: boolean | number
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url?: boolean | number
    /** The categories assigned to a product. */
    categories?: CategoryInterfaceGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    color?: boolean | number
    /** The product's country of origin. */
    country_of_manufacture?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at?: boolean | number
    /** Crosssell Products */
    crosssell_products?: ProductInterfaceGenqlSelection
    /** Product custom attributes. */
    custom_attributesV2?: (ProductCustomAttributesGenqlSelection & { __args?: {filters?: (AttributeFilterInput | null)} })
    /** Detailed information about the product. The value can include simple HTML tags. */
    description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size?: boolean | number
    /** Indicates whether a gift message is available. */
    gift_message_available?: boolean | number
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id?: boolean | number
    /** The relative path to the main image on the product page. */
    image?: ProductImageGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested?: boolean | number
    /** An array containing grouped product items. */
    items?: GroupedProductItemGenqlSelection
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2?: boolean | number
    /** An array of media gallery objects. */
    media_gallery?: MediaGalleryInterfaceGenqlSelection
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries?: MediaGalleryEntryGenqlSelection
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description?: boolean | number
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword?: boolean | number
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title?: boolean | number
    /** The product name. Customers use this name to identify the product. */
    name?: boolean | number
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date?: boolean | number
    /** The end date for new product listings. */
    new_to_date?: boolean | number
    /** Product stock only x left count */
    only_x_left_in_stock?: boolean | number
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container?: boolean | number
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price?: ProductPricesGenqlSelection
    /** The range of prices for the product */
    price_range?: PriceRangeGenqlSelection
    /** An array of `TierPrice` objects. */
    price_tiers?: TierPriceGenqlSelection
    /** An array of `ProductLinks` objects. */
    product_links?: ProductLinksInterfaceGenqlSelection
    /** The average of all the ratings given to the product. */
    rating_summary?: boolean | number
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** An array of products to be displayed in a Related Products block. */
    related_products?: ProductInterfaceGenqlSelection
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** The total count of all the reviews given to the product. */
    review_count?: boolean | number
    /** The list of products reviews. */
    reviews?: (ProductReviewsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /** A short description of the product. Its use depends on the theme. */
    short_description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    size?: boolean | number
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku?: boolean | number
    /** The relative path to the small image, which is used on catalog pages. */
    small_image?: ProductImageGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date?: boolean | number
    /** The discounted price of the product. */
    special_price?: boolean | number
    /** The end date for a product with a special price. */
    special_to_date?: boolean | number
    /** Stock status of the product */
    stock_status?: boolean | number
    /** The file name of a swatch image. */
    swatch_image?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    tema?: boolean | number
    /** The relative path to the product's thumbnail image. */
    thumbnail?: ProductImageGenqlSelection
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price?: boolean | number
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices?: ProductTierPricesGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id?: boolean | number
    /** The unique ID for a `ProductInterface` object. */
    uid?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at?: boolean | number
    /** Upsell Products */
    upsell_products?: ProductInterfaceGenqlSelection
    /** The part of the URL that identifies the product */
    url_key?: boolean | number
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path?: boolean | number
    /** URL rewrites list */
    url_rewrites?: UrlRewriteGenqlSelection
    /** The part of the product URL that is appended after the url key */
    url_suffix?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites?: WebsiteGenqlSelection
    /** The weight of the item, in units defined by the store. */
    weight?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about an individual grouped product item. */
export interface GroupedProductItemGenqlSelection{
    /** The relative position of this item compared to the other group items. */
    position?: boolean | number
    /** Details about this product option. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this grouped product item. */
    qty?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A grouped product wish list item. */
export interface GroupedProductWishlistItemGenqlSelection{
    /** The date and time the item was added to the wish list. */
    added_at?: boolean | number
    /** Custom options selected for the wish list item. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** The description of the item. */
    description?: boolean | number
    /** The unique ID for a `WishlistItemInterface` object. */
    id?: boolean | number
    /** Product details of the wish list item. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this wish list item. */
    quantity?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface HostedFieldsConfigGenqlSelection{
    /** Vault payment method code */
    cc_vault_code?: boolean | number
    /** The payment method code as defined in the payment gateway */
    code?: boolean | number
    /** Card vault enabled */
    is_vault_enabled?: boolean | number
    /** Indicates whether the payment method is displayed */
    is_visible?: boolean | number
    /** Defines the payment intent (Authorize or Capture */
    payment_intent?: boolean | number
    /** The payment source for the payment method */
    payment_source?: boolean | number
    /** Card and bin details required */
    requires_card_details?: boolean | number
    /** The PayPal parameters required to load the JS SDK */
    sdk_params?: SDKParamsGenqlSelection
    /** The relative order the payment method is displayed on the checkout page */
    sort_order?: boolean | number
    /**
     * @deprecated Use 'three_ds_mode' instead.
     * Whether 3DS is activated; true if 3DS mode is not OFF.
     */
    three_ds?: boolean | number
    /** 3DS mode */
    three_ds_mode?: boolean | number
    /** The name displayed for the payment method */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Hosted Fields payment inputs */
export interface HostedFieldsInput {
/** Card bin number */
cardBin?: (Scalars['String'] | null),
/** Expiration month of the card */
cardExpiryMonth?: (Scalars['String'] | null),
/** Expiration year of the card */
cardExpiryYear?: (Scalars['String'] | null),
/** Last four digits of the card */
cardLast4?: (Scalars['String'] | null),
/** Name on the card */
holderName?: (Scalars['String'] | null),
/**
 * Indicates whether details about the shopper's credit/debit card should be
 * tokenized for later usage. Required only if Vault is enabled for the Payment
 * Services payment integration.
 */
is_active_payment_token_enabler?: (Scalars['Boolean'] | null),
/** The payment source for the payment method */
payment_source?: (Scalars['String'] | null),
/** The payment services order ID */
payments_order_id?: (Scalars['String'] | null),
/** PayPal order ID */
paypal_order_id?: (Scalars['String'] | null)}


/**
 * Contains a set of relative URLs that PayPal uses in response to various actions
 * during the authorization process. Magento prepends the base URL to this value to
 * create a full URL. For example, if the full URL is
 * https://www.example.com/path/to/page.html, the relative URL is
 * path/to/page.html. Use this input for Payments Pro Hosted Solution payment method.
 */
export interface HostedProInput {
/**
 * The relative URL of the page that PayPal redirects to when the buyer cancels
 * the transaction in order to choose a different payment method. For example, if
 * the full URL to this page is
 * https://www.example.com/paypal/action/cancel.html, the relative URL is
 * paypal/action/cancel.html.
 */
cancel_url: Scalars['String'],
/**
 * The relative URL of the final confirmation page that PayPal redirects to upon
 * payment success. For example, if the full URL to this page is
 * https://www.example.com/paypal/action/return.html, the relative URL is
 * paypal/action/return.html.
 */
return_url: Scalars['String']}


/** Contains the secure URL used for the Payments Pro Hosted Solution payment method. */
export interface HostedProUrlGenqlSelection{
    /** The secure URL generated by PayPal. */
    secure_form_url?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the required input to request the secure URL for Payments Pro Hosted Solution payment. */
export interface HostedProUrlInput {
/** The unique ID that identifies the shopper's cart. */
cart_id: Scalars['String']}


/** Contains target path parameters. */
export interface HttpQueryParameterGenqlSelection{
    /** A parameter name. */
    name?: boolean | number
    /** A parameter value. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ImageSwatchDataGenqlSelection{
    /** The URL assigned to the thumbnail of the swatch image. */
    thumbnail?: boolean | number
    /** The value can be represented as color (HEX code), image link, or text. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains an error message when an internal error occurred. */
export interface InternalErrorGenqlSelection{
    /** The returned error message. */
    message?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains invoice details. */
export interface InvoiceGenqlSelection{
    /** Comments on the invoice. */
    comments?: SalesCommentItemGenqlSelection
    /** The unique ID for a `Invoice` object. */
    id?: boolean | number
    /** Invoiced product details. */
    items?: InvoiceItemInterfaceGenqlSelection
    /** Sequential invoice number. */
    number?: boolean | number
    /** Invoice total amount details. */
    total?: InvoiceTotalGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface InvoiceItemGenqlSelection{
    /** Information about the final discount amount for the base product, including discounts on options. */
    discounts?: DiscountGenqlSelection
    /** The unique ID for an `InvoiceItemInterface` object. */
    id?: boolean | number
    /** Details about an individual order item. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of invoiced items. */
    quantity_invoiced?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains detailes about invoiced items. */
export interface InvoiceItemInterfaceGenqlSelection{
    /** Information about the final discount amount for the base product, including discounts on options. */
    discounts?: DiscountGenqlSelection
    /** The unique ID for an `InvoiceItemInterface` object. */
    id?: boolean | number
    /** Details about an individual order item. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of invoiced items. */
    quantity_invoiced?: boolean | number
    on_BundleInvoiceItem?: BundleInvoiceItemGenqlSelection
    on_DownloadableInvoiceItem?: DownloadableInvoiceItemGenqlSelection
    on_InvoiceItem?: InvoiceItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains price details from an invoice. */
export interface InvoiceTotalGenqlSelection{
    /** The final base grand total amount in the base currency. */
    base_grand_total?: MoneyGenqlSelection
    /** The applied discounts to the invoice. */
    discounts?: DiscountGenqlSelection
    /** The final total amount, including shipping, discounts, and taxes. */
    grand_total?: MoneyGenqlSelection
    /** Details about the shipping and handling costs for the invoice. */
    shipping_handling?: ShippingHandlingGenqlSelection
    /** The subtotal of the invoice, excluding shipping, discounts, and taxes. */
    subtotal?: MoneyGenqlSelection
    /** The invoice tax details. */
    taxes?: TaxItemGenqlSelection
    /** The shipping amount for the invoice. */
    total_shipping?: MoneyGenqlSelection
    /** The amount of tax applied to the invoice. */
    total_tax?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the result of the `isEmailAvailable` query. */
export interface IsEmailAvailableOutputGenqlSelection{
    /** Indicates whether the specified email address can be used to create a customer. */
    is_email_available?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A list of options of the selected bundle product. */
export interface ItemSelectedBundleOptionGenqlSelection{
    /**
     * @deprecated Use `uid` instead.
     * The unique ID for a `ItemSelectedBundleOption` object.
     */
    id?: boolean | number
    /** The label of the option. */
    label?: boolean | number
    /** The unique ID for a `ItemSelectedBundleOption` object. */
    uid?: boolean | number
    /** A list of products that represent the values of the parent option. */
    values?: ItemSelectedBundleOptionValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A list of values for the selected bundle product. */
export interface ItemSelectedBundleOptionValueGenqlSelection{
    /**
     * @deprecated Use `uid` instead.
     * The unique ID for a `ItemSelectedBundleOptionValue` object.
     */
    id?: boolean | number
    /** The price of the child bundle product. */
    price?: MoneyGenqlSelection
    /** The name of the child bundle product. */
    product_name?: boolean | number
    /** The SKU of the child bundle product. */
    product_sku?: boolean | number
    /** The number of this bundle product that were ordered. */
    quantity?: boolean | number
    /** The unique ID for a `ItemSelectedBundleOptionValue` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains a key-value pair. */
export interface KeyValueGenqlSelection{
    /** The name part of the key/value pair. */
    name?: boolean | number
    /** The value part of the key/value pair. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information for rendering layered navigation. */
export interface LayerFilterGenqlSelection{
    /**
     * @deprecated Use `Aggregation.options` instead.
     * An array of filter items.
     */
    filter_items?: LayerFilterItemInterfaceGenqlSelection
    /**
     * @deprecated Use `Aggregation.count` instead.
     * The count of filter items in filter group.
     */
    filter_items_count?: boolean | number
    /**
     * @deprecated Use `Aggregation.label` instead.
     * The name of a layered navigation filter.
     */
    name?: boolean | number
    /**
     * @deprecated Use `Aggregation.attribute_code` instead.
     * The request variable name for a filter query.
     */
    request_var?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface LayerFilterItemGenqlSelection{
    /**
     * @deprecated Use `AggregationOption.count` instead.
     * The count of items per filter.
     */
    items_count?: boolean | number
    /**
     * @deprecated Use `AggregationOption.label` instead.
     * The label for a filter.
     */
    label?: boolean | number
    /**
     * @deprecated Use `AggregationOption.value` instead.
     * The value of a filter request variable to be used in query.
     */
    value_string?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface LayerFilterItemInterfaceGenqlSelection{
    /**
     * @deprecated Use `AggregationOption.count` instead.
     * The count of items per filter.
     */
    items_count?: boolean | number
    /**
     * @deprecated Use `AggregationOption.label` instead.
     * The label for a filter.
     */
    label?: boolean | number
    /**
     * @deprecated Use `AggregationOption.value` instead.
     * The value of a filter request variable to be used in query.
     */
    value_string?: boolean | number
    on_LayerFilterItem?: LayerFilterItemGenqlSelection
    on_SwatchLayerFilterItem?: SwatchLayerFilterItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines characteristics about images and videos associated with a specific product. */
export interface MediaGalleryEntryGenqlSelection{
    /** Details about the content of the media gallery item. */
    content?: ProductMediaGalleryEntriesContentGenqlSelection
    /** Indicates whether the image is hidden from view. */
    disabled?: boolean | number
    /** The path of the image on the server. */
    file?: boolean | number
    /**
     * @deprecated Use `uid` instead.
     * The identifier assigned to the object.
     */
    id?: boolean | number
    /** The alt text displayed on the storefront when the user points to the image. */
    label?: boolean | number
    /** Either `image` or `video`. */
    media_type?: boolean | number
    /** The media item's position after it has been sorted. */
    position?: boolean | number
    /** Array of image types. It can have the following values: image, small_image, thumbnail. */
    types?: boolean | number
    /** The unique ID for a `MediaGalleryEntry` object. */
    uid?: boolean | number
    /** Details about the content of a video item. */
    video_content?: ProductMediaGalleryEntriesVideoContentGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains basic information about a product image or video. */
export interface MediaGalleryInterfaceGenqlSelection{
    /** Indicates whether the image is hidden from view. */
    disabled?: boolean | number
    /** The label of the product image or video. */
    label?: boolean | number
    /** The media item's position after it has been sorted. */
    position?: boolean | number
    /** The URL of the product image or video. */
    url?: boolean | number
    on_ProductImage?: ProductImageGenqlSelection
    on_ProductVideo?: ProductVideoGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MessageStyleLogoGenqlSelection{
    /** The type of logo for the PayPal Pay Later messaging */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MessageStylesGenqlSelection{
    /** The message layout */
    layout?: boolean | number
    /** The message logo */
    logo?: MessageStyleLogoGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ModuleConfigurationGenqlSelection{
    /** The Public Key of the Stripe payment. */
    apiKey?: boolean | number
    /** Module Version and Partner ID etc */
    appInfo?: boolean | number
    /** Serialized options that can be used to initialize the Elements object */
    elementsOptions?: boolean | number
    /** Locale */
    locale?: boolean | number
    /** Betas and API version */
    options?: ModuleOptionsGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ModuleOptionsGenqlSelection{
    /** API Version */
    apiVersion?: boolean | number
    /** Betas. */
    betas?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a monetary value, including a numeric value and a currency code. */
export interface MoneyGenqlSelection{
    /** A three-letter currency code, such as USD or EUR. */
    currency?: boolean | number
    /** A number expressing a monetary value. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationGenqlSelection{
    /** Add one or more bundle products to the specified cart. We recommend using `addProductsToCart` instead. */
    addBundleProductsToCart?: (AddBundleProductsToCartOutputGenqlSelection & { __args?: {
    /** An input object that defines which bundle products to add to the cart. */
    input?: (AddBundleProductsToCartInput | null)} })
    /** Add one or more configurable products to the specified cart. We recommend using `addProductsToCart` instead. */
    addConfigurableProductsToCart?: (AddConfigurableProductsToCartOutputGenqlSelection & { __args?: {
    /** An input object that defines which configurable products to add to the cart. */
    input?: (AddConfigurableProductsToCartInput | null)} })
    /** Add one or more downloadable products to the specified cart. We recommend using `addProductsToCart` instead. */
    addDownloadableProductsToCart?: (AddDownloadableProductsToCartOutputGenqlSelection & { __args?: {
    /** An input object that defines which downloadable products to add to the cart. */
    input?: (AddDownloadableProductsToCartInput | null)} })
    /** Add any type of product to the cart. */
    addProductsToCart?: (AddProductsToCartOutputGenqlSelection & { __args: {
    /** The cart ID of the shopper. */
    cartId: Scalars['String'], 
    /** An array that defines the products to add to the cart. */
    cartItems: CartItemInput[]} })
    /** Add products to the specified compare list. */
    addProductsToCompareList?: (CompareListGenqlSelection & { __args?: {
    /** An input object that defines which products to add to an existing compare list. */
    input?: (AddProductsToCompareListInput | null)} })
    /** Creates a new cart and add any type of product to it */
    addProductsToNewCart?: (AddProductsToNewCartOutputGenqlSelection & { __args: {
    /** An array that defines the products to add to the new cart */
    cartItems: CartItemInput[]} })
    /** Add one or more products to the specified wish list. This mutation supports all product types. */
    addProductsToWishlist?: (AddProductsToWishlistOutputGenqlSelection & { __args: {
    /** The ID of a wish list. */
    wishlistId: Scalars['ID'], 
    /** An array of products to add to the wish list. */
    wishlistItems: WishlistItemInput[]} })
    /** Add one or more simple products to the specified cart. We recommend using `addProductsToCart` instead. */
    addSimpleProductsToCart?: (AddSimpleProductsToCartOutputGenqlSelection & { __args?: {
    /** An input object that defines which simple products to add to the cart. */
    input?: (AddSimpleProductsToCartInput | null)} })
    /** Saves a payment method on the logged in customer */
    addStripePaymentMethod?: (StripePaymentMethodGenqlSelection & { __args: {input: StripePaymentMethodId} })
    /** Add one or more virtual products to the specified cart. We recommend using `addProductsToCart` instead. */
    addVirtualProductsToCart?: (AddVirtualProductsToCartOutputGenqlSelection & { __args?: {
    /** An input object that defines which virtual products to add to the cart. */
    input?: (AddVirtualProductsToCartInput | null)} })
    /** Add items in the specified wishlist to the customer's cart. */
    addWishlistItemsToCart?: (AddWishlistItemsToCartOutputGenqlSelection & { __args: {
    /** The unique ID of the wish list */
    wishlistId: Scalars['ID'], 
    /**
     * An array of IDs representing products to be added to the cart. If no IDs are
     * specified, all items in the wishlist will be added to the cart
     */
    wishlistItemIds?: (Scalars['ID'][] | null)} })
    /** Apply a pre-defined coupon code to the specified cart. */
    applyCouponToCart?: (ApplyCouponToCartOutputGenqlSelection & { __args?: {
    /** An input object that defines the coupon code to apply to the cart. */
    input?: (ApplyCouponToCartInput | null)} })
    /** Assign the specified compare list to the logged in customer. */
    assignCompareListToCustomer?: (AssignCompareListToCustomerOutputGenqlSelection & { __args: {
    /** The unique ID of the compare list to be assigned. */
    uid: Scalars['ID']} })
    /** Assign a logged-in customer to the specified guest shopping cart. */
    assignCustomerToGuestCart?: (CartGenqlSelection & { __args: {cart_id: Scalars['String']} })
    /** Cancel the specified customer order. */
    cancelOrder?: (CancelOrderOutputGenqlSelection & { __args: {input: CancelOrderInput} })
    /** Change the password for the logged-in customer. */
    changeCustomerPassword?: (CustomerGenqlSelection & { __args: {
    /** The customer's original password. */
    currentPassword: Scalars['String'], 
    /** The customer's updated password. */
    newPassword: Scalars['String']} })
    /** Synchronizes order details and place the order */
    completeOrder?: (PlaceOrderOutputGenqlSelection & { __args?: {
    /** Describes the variables needed to complete or place the order */
    input?: (CompleteOrderInput | null)} })
    /** Confirms the email address for a customer. */
    confirmEmail?: (CustomerOutputGenqlSelection & { __args: {
    /** An input object to identify the customer to confirm the email. */
    input: ConfirmEmailInput} })
    /** Send a 'Contact Us' email to the merchant. */
    contactUs?: (ContactUsOutputGenqlSelection & { __args: {
    /** An input object that defines shopper information. */
    input: ContactUsInput} })
    /** Create a new compare list. The compare list is saved for logged in customers. */
    createCompareList?: (CompareListGenqlSelection & { __args?: {input?: (CreateCompareListInput | null)} })
    /** Use `createCustomerV2` instead. */
    createCustomer?: (CustomerOutputGenqlSelection & { __args: {
    /** An input object that defines the customer to be created. */
    input: CustomerInput} })
    /** Create a billing or shipping address for a customer or guest. */
    createCustomerAddress?: (CustomerAddressGenqlSelection & { __args: {input: CustomerAddressInput} })
    /** Create a customer account. */
    createCustomerV2?: (CustomerOutputGenqlSelection & { __args: {
    /** An input object that defines the customer to be created. */
    input: CustomerCreateInput} })
    /**
     * @deprecated Use `Mutation.createGuestCart` or `Query.customerCart` for logged in customer
     * Create an empty shopping cart for a guest or logged in user
     */
    createEmptyCart?: { __args: {
    /** An optional input object that assigns the specified ID to the cart. */
    input?: (createEmptyCartInput | null)} } | boolean | number
    /** Create a new shopping cart */
    createGuestCart?: (CreateGuestCartOutputGenqlSelection & { __args?: {input?: (CreateGuestCartInput | null)} })
    /** Initiate a transaction and receive a token. Use this mutation for Payflow Pro and Payments Pro payment methods */
    createPayflowProToken?: (CreatePayflowProTokenOutputGenqlSelection & { __args: {
    /** An input object that defines the requirements to fetch payment token information. */
    input: PayflowProTokenInput} })
    /** Creates a payment order for further payment processing */
    createPaymentOrder?: (CreatePaymentOrderOutputGenqlSelection & { __args: {
    /** Contains payment order details that are used while processing the payment order */
    input: CreatePaymentOrderInput} })
    /**
     * Initiate an Express Checkout transaction and receive a token. Use this
     * mutation for Express Checkout and Payments Standard payment methods.
     */
    createPaypalExpressToken?: (PaypalExpressTokenOutputGenqlSelection & { __args: {
    /** An input object that defines the requirements to receive a payment token. */
    input: PaypalExpressTokenInput} })
    /** Create a product review for the specified product. */
    createProductReview?: (CreateProductReviewOutputGenqlSelection & { __args: {
    /** An input object that contains the details necessary to create a product review. */
    input: CreateProductReviewInput} })
    /** Creates a vault payment token */
    createVaultCardPaymentToken?: (CreateVaultCardPaymentTokenOutputGenqlSelection & { __args: {
    /** Describe the variables needed to create a vault card payment token */
    input: CreateVaultCardPaymentTokenInput} })
    /** Creates a vault card setup token */
    createVaultCardSetupToken?: (CreateVaultCardSetupTokenOutputGenqlSelection & { __args: {
    /** Describe the variables needed to create a vault card setup token */
    input: CreateVaultCardSetupTokenInput} })
    /** Delete the specified compare list. */
    deleteCompareList?: (DeleteCompareListOutputGenqlSelection & { __args: {
    /** The unique ID of the compare list to be deleted. */
    uid: Scalars['ID']} })
    /** Delete customer account */
    deleteCustomer?: boolean | number
    /** Delete the billing or shipping address of a customer. */
    deleteCustomerAddress?: { __args: {
    /** The ID of the customer address to be deleted. */
    id: Scalars['Int']} }
    /** Delete a customer's payment token. */
    deletePaymentToken?: (DeletePaymentTokenOutputGenqlSelection & { __args: {
    /** The reusable payment token securely stored in the vault. */
    public_hash: Scalars['String']} })
    /** Deletes a saved payment method from a logged in customer */
    deleteStripePaymentMethod?: { __args: {input: StripePaymentMethodId} }
    /** Estimate shipping method(s) for cart based on address */
    estimateShippingMethods?: (AvailableShippingMethodGenqlSelection & { __args: {
    /** An input object that specifies details for estimation of available shipping methods */
    input: EstimateTotalsInput} })
    /** Estimate totals for cart based on the address */
    estimateTotals?: (EstimateTotalsOutputGenqlSelection & { __args: {
    /** An input object that specifies details for cart totals estimation */
    input: EstimateTotalsInput} })
    /** Generate a token for specified customer. */
    generateCustomerToken?: (CustomerTokenGenqlSelection & { __args: {
    /** The customer's email address. */
    email: Scalars['String'], 
    /** The customer's password. */
    password: Scalars['String']} })
    /** Request a customer token so that an administrator can perform remote shopping assistance. */
    generateCustomerTokenAsAdmin?: (GenerateCustomerTokenAsAdminOutputGenqlSelection & { __args: {
    /** An input object that defines the customer email address. */
    input: GenerateCustomerTokenAsAdminInput} })
    /**
     * Handle a payment response and save the payment in Quote. Use this mutation for
     * Payflow Pro and Payments Pro payment methods.
     */
    handlePayflowProResponse?: (PayflowProResponseOutputGenqlSelection & { __args: {
    /** An input object that includes the payload returned by PayPal and the cart ID. */
    input: PayflowProResponseInput} })
    /** List all saved payment methods of a logged in customer */
    listStripePaymentMethods?: StripePaymentMethodGenqlSelection
    /** Transfer the contents of a guest cart into the cart of a logged-in customer. */
    mergeCarts?: (CartGenqlSelection & { __args: {
    /** The guest's cart ID before they login. */
    source_cart_id: Scalars['String'], 
    /** The cart ID after the guest logs in. */
    destination_cart_id?: (Scalars['String'] | null)} })
    /** Convert the quote into an order. */
    placeOrder?: (PlaceOrderOutputGenqlSelection & { __args?: {
    /** An input object that defines the shopper's cart ID. */
    input?: (PlaceOrderInput | null)} })
    /** Remove a previously-applied coupon from the cart. The cart must contain at least one item in order to remove the coupon. */
    removeCouponFromCart?: (RemoveCouponFromCartOutputGenqlSelection & { __args?: {
    /** An input object that defines which coupon code to remove from the cart. */
    input?: (RemoveCouponFromCartInput | null)} })
    /**
     * Delete the entire quantity of a specified item from the cart. If you remove
     * all items from the cart, the cart continues to exist.
     */
    removeItemFromCart?: (RemoveItemFromCartOutputGenqlSelection & { __args?: {
    /** An input object that defines which products to remove from the cart. */
    input?: (RemoveItemFromCartInput | null)} })
    /** Remove products from the specified compare list. */
    removeProductsFromCompareList?: (CompareListGenqlSelection & { __args?: {
    /** An input object that defines which products to remove from a compare list. */
    input?: (RemoveProductsFromCompareListInput | null)} })
    /** Remove one or more products from the specified wish list. */
    removeProductsFromWishlist?: (RemoveProductsFromWishlistOutputGenqlSelection & { __args: {
    /** The ID of a wish list. */
    wishlistId: Scalars['ID'], 
    /** An array of item IDs representing products to be removed. */
    wishlistItemsIds: Scalars['ID'][]} })
    /** Add all products from a customer's previous order to the cart. */
    reorderItems?: (ReorderItemsOutputGenqlSelection & { __args: {orderNumber: Scalars['String']} })
    /** Request an email with a reset password token for the registered customer identified by the specified email. */
    requestPasswordResetEmail?: { __args: {
    /** The customer's email address. */
    email: Scalars['String']} }
    /**
     * Reset a customer's password using the reset password token that the customer
     * received in an email after requesting it using `requestPasswordResetEmail`.
     */
    resetPassword?: { __args: {
    /** The customer's email address. */
    email: Scalars['String'], 
    /** A runtime token generated by the `requestPasswordResetEmail` mutation. */
    resetPasswordToken: Scalars['String'], 
    /** The customer's new password. */
    newPassword: Scalars['String']} }
    /** Revoke the customer token. */
    revokeCustomerToken?: RevokeCustomerTokenOutputGenqlSelection
    /** Send a message on behalf of a customer to the specified email addresses. */
    sendEmailToFriend?: (SendEmailToFriendOutputGenqlSelection & { __args?: {
    /** An input object that defines sender, recipients, and product. */
    input?: (SendEmailToFriendInput | null)} })
    /** Set the billing address on a specific cart. */
    setBillingAddressOnCart?: (SetBillingAddressOnCartOutputGenqlSelection & { __args?: {
    /** An input object that defines the billing address to be assigned to the cart. */
    input?: (SetBillingAddressOnCartInput | null)} })
    /** Sets the cart as inactive */
    setCartAsInactive?: (SetCartAsInactiveOutputGenqlSelection & { __args: {
    /** The customer cart ID */
    cartId: Scalars['String']} })
    /** Assign the email address of a guest to the cart. */
    setGuestEmailOnCart?: (SetGuestEmailOnCartOutputGenqlSelection & { __args?: {
    /** An input object that defines a guest email address. */
    input?: (SetGuestEmailOnCartInput | null)} })
    /**
     * @deprecated Should use setPaymentMethodOnCart and placeOrder mutations in single request.
     * Set the cart payment method and convert the cart into an order.
     */
    setPaymentMethodAndPlaceOrder?: (PlaceOrderOutputGenqlSelection & { __args?: {input?: (SetPaymentMethodAndPlaceOrderInput | null)} })
    /** Apply a payment method to the cart. */
    setPaymentMethodOnCart?: (SetPaymentMethodOnCartOutputGenqlSelection & { __args?: {
    /** An input object that defines which payment method to apply to the cart. */
    input?: (SetPaymentMethodOnCartInput | null)} })
    /** Set one or more shipping addresses on a specific cart. */
    setShippingAddressesOnCart?: (SetShippingAddressesOnCartOutputGenqlSelection & { __args?: {
    /** An input object that defines one or more shipping addresses to be assigned to the cart. */
    input?: (SetShippingAddressesOnCartInput | null)} })
    /** Set one or more delivery methods on a cart. */
    setShippingMethodsOnCart?: (SetShippingMethodsOnCartOutputGenqlSelection & { __args?: {
    /** An input object that applies one or more shipping methods to the cart. */
    input?: (SetShippingMethodsOnCartInput | null)} })
    /** Subscribe the specified email to the store's newsletter. */
    subscribeEmailToNewsletter?: (SubscribeEmailToNewsletterOutputGenqlSelection & { __args: {
    /** The email address that will receive the store's newsletter. */
    email: Scalars['String']} })
    /** Synchronizes the payment order details for further payment processing */
    syncPaymentOrder?: { __args: {
    /** Describes the variables needed to synchronize the payment order details */
    input?: (SyncPaymentOrderInput | null)} } | boolean | number
    /** Modify items in the cart. */
    updateCartItems?: (UpdateCartItemsOutputGenqlSelection & { __args?: {
    /** An input object that defines products to be updated. */
    input?: (UpdateCartItemsInput | null)} })
    /** Use `updateCustomerV2` instead. */
    updateCustomer?: (CustomerOutputGenqlSelection & { __args: {
    /** An input object that defines the customer characteristics to update. */
    input: CustomerInput} })
    /** Update the billing or shipping address of a customer or guest. */
    updateCustomerAddress?: (CustomerAddressGenqlSelection & { __args: {
    /** The ID assigned to the customer address. */
    id: Scalars['Int'], 
    /** An input object that contains changes to the customer address. */
    input?: (CustomerAddressInput | null)} })
    /** Change the email address for the logged-in customer. */
    updateCustomerEmail?: (CustomerOutputGenqlSelection & { __args: {
    /** The customer's email address. */
    email: Scalars['String'], 
    /** The customer's password. */
    password: Scalars['String']} })
    /** Update the customer's personal information. */
    updateCustomerV2?: (CustomerOutputGenqlSelection & { __args: {
    /** An input object that defines the customer characteristics to update. */
    input: CustomerUpdateInput} })
    /** Update one or more products in the specified wish list. */
    updateProductsInWishlist?: (UpdateProductsInWishlistOutputGenqlSelection & { __args: {
    /** The ID of a wish list. */
    wishlistId: Scalars['ID'], 
    /** An array of items to be updated. */
    wishlistItems: WishlistItemUpdateInput[]} })
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains an error message when an invalid UID was specified. */
export interface NoSuchEntityUidErrorGenqlSelection{
    /** The returned error message. */
    message?: boolean | number
    /** The specified invalid unique ID of an object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the order ID. */
export interface OrderGenqlSelection{
    /** The client secret of the PaymentIntent or SetupIntent that is associated with this order */
    client_secret?: boolean | number
    /** @deprecated Use `order_number` instead. */
    order_id?: boolean | number
    /** The unique ID for an `Order` object. */
    order_number?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains detailed information about an order's billing and shipping addresses. */
export interface OrderAddressGenqlSelection{
    /** The city or town. */
    city?: boolean | number
    /** The customer's company. */
    company?: boolean | number
    /** The customer's country. */
    country_code?: boolean | number
    /** The fax number. */
    fax?: boolean | number
    /** The first name of the person associated with the shipping/billing address. */
    firstname?: boolean | number
    /** The family name of the person associated with the shipping/billing address. */
    lastname?: boolean | number
    /** The middle name of the person associated with the shipping/billing address. */
    middlename?: boolean | number
    /** The customer's ZIP or postal code. */
    postcode?: boolean | number
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix?: boolean | number
    /** The state or province name. */
    region?: boolean | number
    /** The unique ID for a `Region` object of a pre-defined region. */
    region_id?: boolean | number
    /** An array of strings that define the street number and name. */
    street?: boolean | number
    /** A value such as Sr., Jr., or III. */
    suffix?: boolean | number
    /** The telephone number. */
    telephone?: boolean | number
    /** The customer's Value-added tax (VAT) number (for corporate customers). */
    vat_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Input to retrieve an order based on details. */
export interface OrderInformationInput {
/** Order billing address email. */
email: Scalars['String'],
/** Order number. */
number: Scalars['String'],
/** Order billing address postcode. */
postcode: Scalars['String']}

export interface OrderItemGenqlSelection{
    /** The final discount information for the product. */
    discounts?: DiscountGenqlSelection
    /** The entered option for the base product, such as a logo or image. */
    entered_options?: OrderItemOptionGenqlSelection
    /** The selected gift message for the order item */
    gift_message?: GiftMessageGenqlSelection
    /** The unique ID for an `OrderItemInterface` object. */
    id?: boolean | number
    /** The ProductInterface object, which contains details about the base product */
    product?: ProductInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price of the base product, including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The type of product, such as simple, configurable, etc. */
    product_type?: boolean | number
    /** URL key of the base product. */
    product_url_key?: boolean | number
    /** The number of canceled items. */
    quantity_canceled?: boolean | number
    /** The number of invoiced items. */
    quantity_invoiced?: boolean | number
    /** The number of units ordered for this item. */
    quantity_ordered?: boolean | number
    /** The number of refunded items. */
    quantity_refunded?: boolean | number
    /** The number of returned items. */
    quantity_returned?: boolean | number
    /** The number of shipped items. */
    quantity_shipped?: boolean | number
    /** The selected options for the base product, such as color or size. */
    selected_options?: OrderItemOptionGenqlSelection
    /** The status of the order item. */
    status?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Order item details. */
export interface OrderItemInterfaceGenqlSelection{
    /** The final discount information for the product. */
    discounts?: DiscountGenqlSelection
    /** The entered option for the base product, such as a logo or image. */
    entered_options?: OrderItemOptionGenqlSelection
    /** The selected gift message for the order item */
    gift_message?: GiftMessageGenqlSelection
    /** The unique ID for an `OrderItemInterface` object. */
    id?: boolean | number
    /** The ProductInterface object, which contains details about the base product */
    product?: ProductInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price of the base product, including selected options. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The type of product, such as simple, configurable, etc. */
    product_type?: boolean | number
    /** URL key of the base product. */
    product_url_key?: boolean | number
    /** The number of canceled items. */
    quantity_canceled?: boolean | number
    /** The number of invoiced items. */
    quantity_invoiced?: boolean | number
    /** The number of units ordered for this item. */
    quantity_ordered?: boolean | number
    /** The number of refunded items. */
    quantity_refunded?: boolean | number
    /** The number of returned items. */
    quantity_returned?: boolean | number
    /** The number of shipped items. */
    quantity_shipped?: boolean | number
    /** The selected options for the base product, such as color or size. */
    selected_options?: OrderItemOptionGenqlSelection
    /** The status of the order item. */
    status?: boolean | number
    on_BundleOrderItem?: BundleOrderItemGenqlSelection
    on_DownloadableOrderItem?: DownloadableOrderItemGenqlSelection
    on_OrderItem?: OrderItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Represents order item options like selected or entered. */
export interface OrderItemOptionGenqlSelection{
    /** The name of the option. */
    label?: boolean | number
    /** The value of the option. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the payment method used to pay for the order. */
export interface OrderPaymentMethodGenqlSelection{
    /** Additional data per payment method type. */
    additional_data?: KeyValueGenqlSelection
    /** The label that describes the payment method. */
    name?: boolean | number
    /** The payment method code that indicates how the order was paid for. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains order shipment details. */
export interface OrderShipmentGenqlSelection{
    /** Comments added to the shipment. */
    comments?: SalesCommentItemGenqlSelection
    /** The unique ID for a `OrderShipment` object. */
    id?: boolean | number
    /** An array of items included in the shipment. */
    items?: ShipmentItemInterfaceGenqlSelection
    /** The sequential credit shipment number. */
    number?: boolean | number
    /** An array of shipment tracking details. */
    tracking?: ShipmentTrackingGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Input to retrieve an order based on token. */
export interface OrderTokenInput {
/** Order token. */
token: Scalars['String']}


/** Contains details about the sales total amounts used to calculate the final price. */
export interface OrderTotalGenqlSelection{
    /** The final base grand total amount in the base currency. */
    base_grand_total?: MoneyGenqlSelection
    /** The applied discounts to the order. */
    discounts?: DiscountGenqlSelection
    /** The final total amount, including shipping, discounts, and taxes. */
    grand_total?: MoneyGenqlSelection
    /** Details about the shipping and handling costs for the order. */
    shipping_handling?: ShippingHandlingGenqlSelection
    /** The subtotal of the order, excluding shipping, discounts, and taxes. */
    subtotal?: MoneyGenqlSelection
    /** The order tax details. */
    taxes?: TaxItemGenqlSelection
    /** The shipping amount for the order. */
    total_shipping?: MoneyGenqlSelection
    /** The amount of tax applied to the order. */
    total_tax?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains required input for Payflow Express Checkout payments. */
export interface PayflowExpressInput {
/** The unique ID of the PayPal user. */
payer_id: Scalars['String'],
/** The token returned by the createPaypalExpressToken mutation. */
token: Scalars['String']}


/**
 * A set of relative URLs that PayPal uses in response to various actions during
 * the authorization process. Adobe Commerce prepends the base URL to this value to
 * create a full URL. For example, if the full URL is
 * https://www.example.com/path/to/page.html, the relative URL is
 * path/to/page.html. Use this input for Payflow Link and Payments Advanced payment methods.
 */
export interface PayflowLinkInput {
/**
 * The relative URL of the page that PayPal redirects to when the buyer cancels
 * the transaction in order to choose a different payment method. If the full URL
 * to this page is https://www.example.com/paypal/action/cancel.html, the
 * relative URL is paypal/action/cancel.html.
 */
cancel_url: Scalars['String'],
/**
 * The relative URL of the transaction error page that PayPal redirects to upon
 * payment error. If the full URL to this page is
 * https://www.example.com/paypal/action/error.html, the relative URL is
 * paypal/action/error.html.
 */
error_url: Scalars['String'],
/**
 * The relative URL of the order confirmation page that PayPal redirects to when
 * the payment is successful and additional confirmation is not needed. If the
 * full URL to this page is https://www.example.com/paypal/action/return.html,
 * the relative URL is paypal/action/return.html.
 */
return_url: Scalars['String']}


/**
 * Contains information used to generate PayPal iframe for transaction. Applies to
 * Payflow Link and Payments Advanced payment methods.
 */
export interface PayflowLinkTokenGenqlSelection{
    /** The mode for the Payflow transaction. */
    mode?: boolean | number
    /** The PayPal URL used for requesting a Payflow form. */
    paypal_url?: boolean | number
    /** The secure token generated by PayPal. */
    secure_token?: boolean | number
    /** The secure token ID generated by PayPal. */
    secure_token_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information required to fetch payment token information for the Payflow Link and Payments Advanced payment methods. */
export interface PayflowLinkTokenInput {
/** The unique ID that identifies the customer's cart. */
cart_id: Scalars['String']}


/** Contains input for the Payflow Pro and Payments Pro payment methods. */
export interface PayflowProInput {
/** Required input for credit card related information. */
cc_details: CreditCardDetailsInput,
/**
 * Indicates whether details about the shopper's credit/debit card should be
 * tokenized for later usage. Required only if Vault is enabled for the PayPal
 * Payflow Pro payment integration.
 */
is_active_payment_token_enabler?: (Scalars['Boolean'] | null)}


/** Input required to complete payment. Applies to Payflow Pro and Payments Pro payment methods. */
export interface PayflowProResponseInput {
/** The unique ID that identifies the shopper's cart. */
cart_id: Scalars['String'],
/** The payload returned from PayPal. */
paypal_payload: Scalars['String']}

export interface PayflowProResponseOutputGenqlSelection{
    /** The cart with the updated selected payment method. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the secure information used to authorize transaction. Applies to Payflow Pro and Payments Pro payment methods. */
export interface PayflowProTokenGenqlSelection{
    /** The RESPMSG returned by PayPal. If the `result` is `0`, then `response_message` is `Approved`. */
    response_message?: boolean | number
    /** A non-zero value if any errors occurred. */
    result?: boolean | number
    /** The RESULT returned by PayPal. A value of `0` indicates the transaction was approved. */
    result_code?: boolean | number
    /** A secure token generated by PayPal. */
    secure_token?: boolean | number
    /** A secure token ID generated by PayPal. */
    secure_token_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains input required to fetch payment token information for the Payflow Pro and Payments Pro payment methods. */
export interface PayflowProTokenInput {
/** The unique ID that identifies the shopper's cart. */
cart_id: Scalars['String'],
/** A set of relative URLs that PayPal uses for callback. */
urls: PayflowProUrlInput}


/**
 * Contains a set of relative URLs that PayPal uses in response to various actions
 * during the authorization process. Magento prepends the base URL to this value to
 * create a full URL. For example, if the full URL is
 * https://www.example.com/path/to/page.html, the relative URL is
 * path/to/page.html. Use this input for the Payflow Pro and Payment Pro payment methods.
 */
export interface PayflowProUrlInput {
/**
 * The relative URL of the page that PayPal redirects to when the buyer cancels
 * the transaction in order to choose a different payment method. If the full URL
 * to this page is https://www.example.com/paypal/action/cancel.html, the
 * relative URL is paypal/action/cancel.html.
 */
cancel_url: Scalars['String'],
/**
 * The relative URL of the transaction error page that PayPal redirects to upon
 * payment error. If the full URL to this page is
 * https://www.example.com/paypal/action/error.html, the relative URL is
 * paypal/action/error.html.
 */
error_url: Scalars['String'],
/**
 * The relative URL of the final confirmation page that PayPal redirects to upon
 * payment success. If the full URL to this page is
 * https://www.example.com/paypal/action/return.html, the relative URL is
 * paypal/action/return.html.
 */
return_url: Scalars['String']}

export interface PaymentCommonConfigGenqlSelection{
    /** The payment method code as defined in the payment gateway */
    code?: boolean | number
    /** Indicates whether the payment method is displayed */
    is_visible?: boolean | number
    /** Defines the payment intent (Authorize or Capture */
    payment_intent?: boolean | number
    /** The PayPal parameters required to load the JS SDK */
    sdk_params?: SDKParamsGenqlSelection
    /** The relative order the payment method is displayed on the checkout page */
    sort_order?: boolean | number
    /** The name displayed for the payment method */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains payment fields that are common to all types of payment methods. */
export interface PaymentConfigItemGenqlSelection{
    /** The payment method code as defined in the payment gateway */
    code?: boolean | number
    /** Indicates whether the payment method is displayed */
    is_visible?: boolean | number
    /** Defines the payment intent (Authorize or Capture */
    payment_intent?: boolean | number
    /** The PayPal parameters required to load the JS SDK */
    sdk_params?: SDKParamsGenqlSelection
    /** The relative order the payment method is displayed on the checkout page */
    sort_order?: boolean | number
    /** The name displayed for the payment method */
    title?: boolean | number
    on_ApplePayConfig?: ApplePayConfigGenqlSelection
    on_FastlaneConfig?: FastlaneConfigGenqlSelection
    on_GooglePayConfig?: GooglePayConfigGenqlSelection
    on_HostedFieldsConfig?: HostedFieldsConfigGenqlSelection
    on_PaymentCommonConfig?: PaymentCommonConfigGenqlSelection
    on_SmartButtonsConfig?: SmartButtonsConfigGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Retrieves the payment configuration for a given location */
export interface PaymentConfigOutputGenqlSelection{
    /** ApplePay payment method configuration */
    apple_pay?: ApplePayConfigGenqlSelection
    /** Fastlane payment method configuration */
    fastlane?: FastlaneConfigGenqlSelection
    /** GooglePay payment method configuration */
    google_pay?: GooglePayConfigGenqlSelection
    /** Hosted fields payment method configuration */
    hosted_fields?: HostedFieldsConfigGenqlSelection
    /** Smart Buttons payment method configuration */
    smart_buttons?: SmartButtonsConfigGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the payment method. */
export interface PaymentMethodInput {
/** The internal name for the payment method. */
code: Scalars['String'],
/** Required input for PayPal Hosted pro payments. */
hosted_pro?: (HostedProInput | null),
/** Required input for Payflow Express Checkout payments. */
payflow_express?: (PayflowExpressInput | null),
/** Required input for PayPal Payflow Link and Payments Advanced payments. */
payflow_link?: (PayflowLinkInput | null),
/** Required input for PayPal Payflow Pro and Payment Pro payments. */
payflowpro?: (PayflowProInput | null),
/** Required input for PayPal Payflow Pro vault payments. */
payflowpro_cc_vault?: (VaultTokenInput | null),
/** Required input for Apple Pay button */
payment_services_paypal_apple_pay?: (ApplePayMethodInput | null),
/** Required input for fastlane */
payment_services_paypal_fastlane?: (FastlaneMethodInput | null),
/** Required input for Google Pay button */
payment_services_paypal_google_pay?: (GooglePayMethodInput | null),
/** Required input for Hosted Fields */
payment_services_paypal_hosted_fields?: (HostedFieldsInput | null),
/** Required input for Smart buttons */
payment_services_paypal_smart_buttons?: (SmartButtonMethodInput | null),
/** Required input for vault */
payment_services_paypal_vault?: (VaultMethodInput | null),
/** Required input for Express Checkout and Payments Standard payments. */
paypal_express?: (PaypalExpressInput | null),
/** The purchase order number. Optional for most payment methods. */
purchase_order_number?: (Scalars['String'] | null),
/** Required input for Stripe Payments */
stripe_payments?: (StripePaymentsInput | null)}


/** Contains the payment order details */
export interface PaymentOrderOutputGenqlSelection{
    /** PayPal order ID */
    id?: boolean | number
    /** The order ID generated by Payment Services */
    mp_order_id?: boolean | number
    /** Details about the card used on the order */
    payment_source_details?: PaymentSourceDetailsGenqlSelection
    /** The status of the payment order */
    status?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PaymentSDKParamsItemGenqlSelection{
    /** The payment method code used in the order */
    code?: boolean | number
    /** The payment SDK parameters */
    params?: SDKParamsGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PaymentSourceDetailsGenqlSelection{
    /** Details about the card used on the order */
    card?: CardGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** The payment source information */
export interface PaymentSourceInput {
/** The card payment source information */
card: CardPaymentSourceInput}


/** The payment source information */
export interface PaymentSourceOutputGenqlSelection{
    /** The card payment source information */
    card?: CardPaymentSourceOutputGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** The stored payment method available to the customer. */
export interface PaymentTokenGenqlSelection{
    /** A description of the stored account details. */
    details?: boolean | number
    /** The payment method code associated with the token. */
    payment_method_code?: boolean | number
    /** The public hash of the token. */
    public_hash?: boolean | number
    /** Specifies the payment token type. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains required input for Express Checkout and Payments Standard payments. */
export interface PaypalExpressInput {
/** The unique ID of the PayPal user. */
payer_id: Scalars['String'],
/** The token returned by the `createPaypalExpressToken` mutation. */
token: Scalars['String']}


/** Deprecated. Use `PaypalExpressTokenOutput` instead. */
export interface PaypalExpressTokenGenqlSelection{
    /**
     * @deprecated Use `PaypalExpressTokenOutput.paypal_urls` instead.
     * A set of URLs that allow the buyer to authorize payment and adjust checkout details.
     */
    paypal_urls?: PaypalExpressUrlListGenqlSelection
    /**
     * @deprecated Use `PaypalExpressTokenOutput.token` instead.
     * The token returned by PayPal.
     */
    token?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the attributes required to receive a payment token for Express Checkout and Payments Standard payment methods. */
export interface PaypalExpressTokenInput {
/** The unique ID that identifies the customer's cart. */
cart_id: Scalars['String'],
/** The payment method code. */
code: Scalars['String'],
/** Indicates whether the buyer selected the quick checkout button. The default value is false. */
express_button?: (Scalars['Boolean'] | null),
/** A set of relative URLs that PayPal uses in response to various actions during the authorization process. */
urls: PaypalExpressUrlsInput,
/** Indicates whether the buyer clicked the PayPal credit button. The default value is false. */
use_paypal_credit?: (Scalars['Boolean'] | null)}


/**
 * Contains the token returned by PayPal and a set of URLs that allow the buyer to
 * authorize payment and adjust checkout details. Applies to Express Checkout and
 * Payments Standard payment methods.
 */
export interface PaypalExpressTokenOutputGenqlSelection{
    /** A set of URLs that allow the buyer to authorize payment and adjust checkout details. */
    paypal_urls?: PaypalExpressUrlListGenqlSelection
    /** The token returned by PayPal. */
    token?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/**
 * Contains a set of URLs that allow the buyer to authorize payment and adjust
 * checkout details for Express Checkout and Payments Standard transactions.
 */
export interface PaypalExpressUrlListGenqlSelection{
    /** The PayPal URL that allows the buyer to edit their checkout details. */
    edit?: boolean | number
    /** The URL to the PayPal login page. */
    start?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/**
 * Contains a set of relative URLs that PayPal uses in response to various actions
 * during the authorization process. Magento prepends the base URL to this value to
 * create a full URL. For example, if the full URL is
 * https://www.example.com/path/to/page.html, the relative URL is
 * path/to/page.html. Use this input for Express Checkout and Payments Standard
 * payment methods.
 */
export interface PaypalExpressUrlsInput {
/**
 * The relative URL of the page that PayPal redirects to when the buyer cancels
 * the transaction in order to choose a different payment method. If the full URL
 * to this page is https://www.example.com/paypal/action/cancel.html, the
 * relative URL is paypal/action/cancel.html.
 */
cancel_url: Scalars['String'],
/**
 * The relative URL of the page that PayPal redirects to when the payment has
 * been put on hold for additional review. This condition mostly applies to ACH
 * transactions, and is not applicable to most PayPal solutions. If the full URL
 * to this page is https://www.example.com/paypal/action/success_pending.html,
 * the relative URL is paypal/action/success_pending.html.
 */
pending_url?: (Scalars['String'] | null),
/**
 * The relative URL of the final confirmation page that PayPal redirects to upon
 * payment success. If the full URL to this page is
 * https://www.example.com/paypal/action/return.html, the relative URL is
 * paypal/action/return.html.
 */
return_url: Scalars['String'],
/**
 * The relative URL of the order confirmation page that PayPal redirects to when
 * the payment is successful and additional confirmation is not needed. Not
 * applicable to most PayPal solutions. If the full URL to this page is
 * https://www.example.com/paypal/action/success.html, the relative URL is
 * paypal/action/success.html.
 */
success_url?: (Scalars['String'] | null)}


/** Contains attributes specific to tangible products. */
export interface PhysicalProductInterfaceGenqlSelection{
    /** The weight of the item, in units defined by the store. */
    weight?: boolean | number
    on_BundleProduct?: BundleProductGenqlSelection
    on_ConfigurableProduct?: ConfigurableProductGenqlSelection
    on_GroupedProduct?: GroupedProductGenqlSelection
    on_SimpleProduct?: SimpleProductGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines Pickup Location information. */
export interface PickupLocationGenqlSelection{
    city?: boolean | number
    contact_name?: boolean | number
    country_id?: boolean | number
    description?: boolean | number
    email?: boolean | number
    fax?: boolean | number
    latitude?: boolean | number
    longitude?: boolean | number
    name?: boolean | number
    phone?: boolean | number
    pickup_location_code?: boolean | number
    postcode?: boolean | number
    region?: boolean | number
    region_id?: boolean | number
    street?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** PickupLocationFilterInput defines the list of attributes and filters for the search. */
export interface PickupLocationFilterInput {
/** Filter by city. */
city?: (FilterTypeInput | null),
/** Filter by country. */
country_id?: (FilterTypeInput | null),
/** Filter by pickup location name. */
name?: (FilterTypeInput | null),
/** Filter by pickup location code. */
pickup_location_code?: (FilterTypeInput | null),
/** Filter by postcode. */
postcode?: (FilterTypeInput | null),
/** Filter by region. */
region?: (FilterTypeInput | null),
/** Filter by region id. */
region_id?: (FilterTypeInput | null),
/** Filter by street. */
street?: (FilterTypeInput | null)}


/** Top level object returned in a pickup locations search. */
export interface PickupLocationsGenqlSelection{
    /** An array of pickup locations that match the specific search request. */
    items?: PickupLocationGenqlSelection
    /** An object that includes the page_info and currentPage values specified in the query. */
    page_info?: SearchResultPageInfoGenqlSelection
    /** The number of products returned. */
    total_count?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/**
 * PickupLocationSortInput specifies attribute to use for sorting search results
 * and indicates whether the results are sorted in ascending or descending order.
 */
export interface PickupLocationSortInput {
/** City where pickup location is placed. */
city?: (SortEnum | null),
/** Name of the contact person. */
contact_name?: (SortEnum | null),
/** Id of the country in two letters. */
country_id?: (SortEnum | null),
/** Description of the pickup location. */
description?: (SortEnum | null),
/**
 * Distance to the address, requested by distance filter. Applicable only with
 * distance filter. If distance sort order is present, all other sort orders will be ignored.
 */
distance?: (SortEnum | null),
/** Contact email of the pickup location. */
email?: (SortEnum | null),
/** Contact fax of the pickup location. */
fax?: (SortEnum | null),
/** Geographic latitude where pickup location is placed. */
latitude?: (SortEnum | null),
/** Geographic longitude where pickup location is placed. */
longitude?: (SortEnum | null),
/** The pickup location name. Customer use this to identify the pickup location. */
name?: (SortEnum | null),
/** Contact phone number of the pickup location. */
phone?: (SortEnum | null),
/** A code assigned to pickup location to identify the source. */
pickup_location_code?: (SortEnum | null),
/** Postcode where pickup location is placed. */
postcode?: (SortEnum | null),
/** Name of the region. */
region?: (SortEnum | null),
/** Id of the region. */
region_id?: (SortEnum | null),
/** Street where pickup location is placed. */
street?: (SortEnum | null)}


/** An error encountered while placing an order. */
export interface PlaceOrderErrorGenqlSelection{
    /** An error code that is specific to place order. */
    code?: boolean | number
    /** A localized error message. */
    message?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Specifies the quote to be converted to an order. */
export interface PlaceOrderInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String']}


/** Contains the results of the request to place an order. */
export interface PlaceOrderOutputGenqlSelection{
    /** An array of place order errors. */
    errors?: PlaceOrderErrorGenqlSelection
    /**
     * @deprecated Use `orderV2` instead.
     * The ID of the order.
     */
    order?: OrderGenqlSelection
    /** Full order information. */
    orderV2?: CustomerOrderGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Deprecated. Use `ProductPrice` instead. Defines the price of a product as well as any tax-related adjustments. */
export interface PriceGenqlSelection{
    /**
     * @deprecated Use `ProductPrice` instead.
     * An array that provides information about tax, weee, or weee_tax adjustments.
     */
    adjustments?: PriceAdjustmentGenqlSelection
    /**
     * @deprecated Use `ProductPrice` instead.
     * The price of a product plus a three-letter currency code.
     */
    amount?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/**
 * Deprecated. Taxes will be included or excluded in the price. Defines the amount
 * of money to apply as an adjustment, the type of adjustment to apply, and whether
 * the item is included or excluded from the adjustment.
 */
export interface PriceAdjustmentGenqlSelection{
    /** The amount of the price adjustment and its currency code. */
    amount?: MoneyGenqlSelection
    /**
     * @deprecated `PriceAdjustment` is deprecated.
     * Indicates whether the adjustment involves tax, weee, or weee_tax.
     */
    code?: boolean | number
    /**
     * @deprecated `PriceAdjustment` is deprecated.
     * Indicates whether the entity described by the code attribute is included or excluded from the adjustment.
     */
    description?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Can be used to retrieve the main price details in case of bundle product */
export interface PriceDetailsGenqlSelection{
    /** The percentage of discount applied to the main product price */
    discount_percentage?: boolean | number
    /** The final price after applying the discount to the main product */
    main_final_price?: boolean | number
    /** The regular price of the main product */
    main_price?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the price range for a product. If the product has a single price, the minimum and maximum price will be the same. */
export interface PriceRangeGenqlSelection{
    /** The highest possible price for the product. */
    maximum_price?: ProductPriceGenqlSelection
    /** The lowest possible price for the product. */
    minimum_price?: ProductPriceGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains a product attribute code and value. */
export interface ProductAttributeGenqlSelection{
    /** The unique identifier for a product attribute code. */
    code?: boolean | number
    /** The display value of the attribute. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/**
 * Defines the filters to be used in the search. A filter contains at least one
 * attribute, a comparison operator, and the value that is being searched for.
 */
export interface ProductAttributeFilterInput {
/** Deprecated: use `category_uid` to filter product by category ID. */
category_id?: (FilterEqualTypeInput | null),
/** Filter product by the unique ID for a `CategoryInterface` object. */
category_uid?: (FilterEqualTypeInput | null),
/** Filter product by category URL path. */
category_url_path?: (FilterEqualTypeInput | null),
/** Attribute label: Colore */
color?: (FilterEqualTypeInput | null),
/** Attribute label: Description */
description?: (FilterMatchTypeInput | null),
/** Attribute label: Colori e Fantasie */
match_collezione2?: (FilterEqualTypeInput | null),
/** Attribute label: Product Name */
name?: (FilterMatchTypeInput | null),
/** Attribute label: Short Description */
short_description?: (FilterMatchTypeInput | null),
/** Attribute label: Taglia */
size?: (FilterEqualTypeInput | null),
/** Attribute label: SKU */
sku?: (FilterEqualTypeInput | null),
/** Attribute label: Tema */
tema?: (FilterEqualTypeInput | null),
/** Attribute label: Articolo */
tipologia?: (FilterEqualTypeInput | null),
/** The part of the URL that identifies the product */
url_key?: (FilterEqualTypeInput | null)}


/**
 * Specifies the attribute to use for sorting search results and indicates whether
 * the results are sorted in ascending or descending order. It's possible to sort
 * products using searchable attributes with enabled 'Use in Filter Options' option
 */
export interface ProductAttributeSortInput {
/** Attribute label: Product Name */
name?: (SortEnum | null),
/** Sort by the position assigned to each product. */
position?: (SortEnum | null),
/** Sort by the search relevance score (default). */
relevance?: (SortEnum | null),
/** Attribute label: Taglia */
size?: (SortEnum | null)}


/** Product custom attributes */
export interface ProductCustomAttributesGenqlSelection{
    /** Errors when retrieving custom attributes metadata. */
    errors?: AttributeMetadataErrorGenqlSelection
    /** Requested custom attributes */
    items?: AttributeValueInterfaceGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the discount applied to a product price. */
export interface ProductDiscountGenqlSelection{
    /** The actual value of the discount. */
    amount_off?: boolean | number
    /** The discount expressed a percentage. */
    percent_off?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/**
 * ProductFilterInput is deprecated, use @ProductAttributeFilterInput instead.
 * ProductFilterInput defines the filters to be used in the search. A filter
 * contains at least one attribute, a comparison operator, and the value that is
 * being searched for.
 */
export interface ProductFilterInput {
/** The category ID the product belongs to. */
category_id?: (FilterTypeInput | null),
/** The product's country of origin. */
country_of_manufacture?: (FilterTypeInput | null),
/** The timestamp indicating when the product was created. */
created_at?: (FilterTypeInput | null),
/** The name of a custom layout. */
custom_layout?: (FilterTypeInput | null),
/** XML code that is applied as a layout update to the product page. */
custom_layout_update?: (FilterTypeInput | null),
/** Detailed information about the product. The value can include simple HTML tags. */
description?: (FilterTypeInput | null),
/** Indicates whether a gift message is available. */
gift_message_available?: (FilterTypeInput | null),
/** Indicates whether additional attributes have been created for the product. */
has_options?: (FilterTypeInput | null),
/** The relative path to the main image on the product page. */
image?: (FilterTypeInput | null),
/** The label assigned to a product image. */
image_label?: (FilterTypeInput | null),
/** A number representing the product's manufacturer. */
manufacturer?: (FilterTypeInput | null),
/** The numeric maximal price of the product. Do not include the currency code. */
max_price?: (FilterTypeInput | null),
/** A brief overview of the product for search results listings, maximum 255 characters. */
meta_description?: (FilterTypeInput | null),
/** A comma-separated list of keywords that are visible only to search engines. */
meta_keyword?: (FilterTypeInput | null),
/** A string that is displayed in the title bar and tab of the browser and in search results lists. */
meta_title?: (FilterTypeInput | null),
/** The numeric minimal price of the product. Do not include the currency code. */
min_price?: (FilterTypeInput | null),
/** The product name. Customers use this name to identify the product. */
name?: (FilterTypeInput | null),
/** The beginning date for new product listings, and determines if the product is featured as a new product. */
news_from_date?: (FilterTypeInput | null),
/** The end date for new product listings. */
news_to_date?: (FilterTypeInput | null),
/** If the product has multiple options, determines where they appear on the product page. */
options_container?: (FilterTypeInput | null),
/** The keyword required to perform a logical OR comparison. */
or?: (ProductFilterInput | null),
/** The price of an item. */
price?: (FilterTypeInput | null),
/** Indicates whether the product has required options. */
required_options?: (FilterTypeInput | null),
/** A short description of the product. Its use depends on the theme. */
short_description?: (FilterTypeInput | null),
/** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
sku?: (FilterTypeInput | null),
/** The relative path to the small image, which is used on catalog pages. */
small_image?: (FilterTypeInput | null),
/** The label assigned to a product's small image. */
small_image_label?: (FilterTypeInput | null),
/** The beginning date that a product has a special price. */
special_from_date?: (FilterTypeInput | null),
/** The discounted price of the product. Do not include the currency code. */
special_price?: (FilterTypeInput | null),
/** The end date that a product has a special price. */
special_to_date?: (FilterTypeInput | null),
/** The file name of a swatch image. */
swatch_image?: (FilterTypeInput | null),
/** The relative path to the product's thumbnail image. */
thumbnail?: (FilterTypeInput | null),
/** The label assigned to a product's thumbnail image. */
thumbnail_label?: (FilterTypeInput | null),
/** The price when tier pricing is in effect and the items purchased threshold has been reached. */
tier_price?: (FilterTypeInput | null),
/** The timestamp indicating when the product was updated. */
updated_at?: (FilterTypeInput | null),
/** The part of the URL that identifies the product */
url_key?: (FilterTypeInput | null),url_path?: (FilterTypeInput | null),
/** The weight of the item, in units defined by the store. */
weight?: (FilterTypeInput | null)}


/** Contains product image information, including the image URL and label. */
export interface ProductImageGenqlSelection{
    /** Indicates whether the image is hidden from view. */
    disabled?: boolean | number
    /** The label of the product image or video. */
    label?: boolean | number
    /** The media item's position after it has been sorted. */
    position?: boolean | number
    /** The URL of the product image or video. */
    url?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Product Information used for Pickup Locations search. */
export interface ProductInfoInput {
/** Product SKU. */
sku: Scalars['String']}


/** Contains fields that are common to all types of products. */
export interface ProductInterfaceGenqlSelection{
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id?: boolean | number
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url?: boolean | number
    /** The categories assigned to a product. */
    categories?: CategoryInterfaceGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    color?: boolean | number
    /** The product's country of origin. */
    country_of_manufacture?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at?: boolean | number
    /** Crosssell Products */
    crosssell_products?: ProductInterfaceGenqlSelection
    /** Product custom attributes. */
    custom_attributesV2?: (ProductCustomAttributesGenqlSelection & { __args?: {filters?: (AttributeFilterInput | null)} })
    /** Detailed information about the product. The value can include simple HTML tags. */
    description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size?: boolean | number
    /** Indicates whether a gift message is available. */
    gift_message_available?: boolean | number
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id?: boolean | number
    /** The relative path to the main image on the product page. */
    image?: ProductImageGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested?: boolean | number
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2?: boolean | number
    /** An array of media gallery objects. */
    media_gallery?: MediaGalleryInterfaceGenqlSelection
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries?: MediaGalleryEntryGenqlSelection
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description?: boolean | number
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword?: boolean | number
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title?: boolean | number
    /** The product name. Customers use this name to identify the product. */
    name?: boolean | number
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date?: boolean | number
    /** The end date for new product listings. */
    new_to_date?: boolean | number
    /** Product stock only x left count */
    only_x_left_in_stock?: boolean | number
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container?: boolean | number
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price?: ProductPricesGenqlSelection
    /** The range of prices for the product */
    price_range?: PriceRangeGenqlSelection
    /** An array of `TierPrice` objects. */
    price_tiers?: TierPriceGenqlSelection
    /** An array of `ProductLinks` objects. */
    product_links?: ProductLinksInterfaceGenqlSelection
    /** The average of all the ratings given to the product. */
    rating_summary?: boolean | number
    /** An array of products to be displayed in a Related Products block. */
    related_products?: ProductInterfaceGenqlSelection
    /** The total count of all the reviews given to the product. */
    review_count?: boolean | number
    /** The list of products reviews. */
    reviews?: (ProductReviewsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /** A short description of the product. Its use depends on the theme. */
    short_description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    size?: boolean | number
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku?: boolean | number
    /** The relative path to the small image, which is used on catalog pages. */
    small_image?: ProductImageGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date?: boolean | number
    /** The discounted price of the product. */
    special_price?: boolean | number
    /** The end date for a product with a special price. */
    special_to_date?: boolean | number
    /** Stock status of the product */
    stock_status?: boolean | number
    /** The file name of a swatch image. */
    swatch_image?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    tema?: boolean | number
    /** The relative path to the product's thumbnail image. */
    thumbnail?: ProductImageGenqlSelection
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price?: boolean | number
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices?: ProductTierPricesGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia?: boolean | number
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id?: boolean | number
    /** The unique ID for a `ProductInterface` object. */
    uid?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at?: boolean | number
    /** Upsell Products */
    upsell_products?: ProductInterfaceGenqlSelection
    /** The part of the URL that identifies the product */
    url_key?: boolean | number
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path?: boolean | number
    /** URL rewrites list */
    url_rewrites?: UrlRewriteGenqlSelection
    /** The part of the product URL that is appended after the url key */
    url_suffix?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites?: WebsiteGenqlSelection
    on_BundleProduct?: BundleProductGenqlSelection
    on_ConfigurableProduct?: ConfigurableProductGenqlSelection
    on_DownloadableProduct?: DownloadableProductGenqlSelection
    on_GroupedProduct?: GroupedProductGenqlSelection
    on_SimpleProduct?: SimpleProductGenqlSelection
    on_VirtualProduct?: VirtualProductGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An implementation of `ProductLinksInterface`. */
export interface ProductLinksGenqlSelection{
    /** One of related, associated, upsell, or crosssell. */
    link_type?: boolean | number
    /** The SKU of the linked product. */
    linked_product_sku?: boolean | number
    /** The type of linked product (simple, virtual, bundle, downloadable, grouped, configurable). */
    linked_product_type?: boolean | number
    /** The position within the list of product links. */
    position?: boolean | number
    /** The identifier of the linked product. */
    sku?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about linked products, including the link type and product type of each item. */
export interface ProductLinksInterfaceGenqlSelection{
    /** One of related, associated, upsell, or crosssell. */
    link_type?: boolean | number
    /** The SKU of the linked product. */
    linked_product_sku?: boolean | number
    /** The type of linked product (simple, virtual, bundle, downloadable, grouped, configurable). */
    linked_product_type?: boolean | number
    /** The position within the list of product links. */
    position?: boolean | number
    /** The identifier of the linked product. */
    sku?: boolean | number
    on_ProductLinks?: ProductLinksGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains an image in base64 format and basic information about the image. */
export interface ProductMediaGalleryEntriesContentGenqlSelection{
    /** The image in base64 format. */
    base64_encoded_data?: boolean | number
    /** The file name of the image. */
    name?: boolean | number
    /** The MIME type of the file, such as image/png. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains a link to a video file and basic information about the video. */
export interface ProductMediaGalleryEntriesVideoContentGenqlSelection{
    /** Must be external-video. */
    media_type?: boolean | number
    /** A description of the video. */
    video_description?: boolean | number
    /** Optional data about the video. */
    video_metadata?: boolean | number
    /** Describes the video source. */
    video_provider?: boolean | number
    /** The title of the video. */
    video_title?: boolean | number
    /** The URL to the video. */
    video_url?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Represents a product price. */
export interface ProductPriceGenqlSelection{
    /** The price discount. Represents the difference between the regular and final price. */
    discount?: ProductDiscountGenqlSelection
    /** The final price of the product after applying discounts. */
    final_price?: MoneyGenqlSelection
    /** The regular price of the product. */
    regular_price?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/**
 * Deprecated. Use `PriceRange` instead. Contains the regular price of an item, as
 * well as its minimum and maximum prices. Only composite products, which include
 * bundle, configurable, and grouped products, can contain a minimum and maximum price.
 */
export interface ProductPricesGenqlSelection{
    /**
     * @deprecated Use `PriceRange.maximum_price` instead.
     * The highest possible final price for all the options defined within a
     * composite product. If you are specifying a price range, this would be the `to` value.
     */
    maximalPrice?: PriceGenqlSelection
    /**
     * @deprecated Use `PriceRange.minimum_price` instead.
     * The lowest possible final price for all the options defined within a composite
     * product. If you are specifying a price range, this would be the `from` value.
     */
    minimalPrice?: PriceGenqlSelection
    /**
     * @deprecated Use `regular_price` from `PriceRange.minimum_price` or `PriceRange.maximum_price` instead.
     * The base price of a product.
     */
    regularPrice?: PriceGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details of a product review. */
export interface ProductReviewGenqlSelection{
    /** The average of all ratings for this product. */
    average_rating?: boolean | number
    /** The date the review was created. */
    created_at?: boolean | number
    /** The customer's nickname. Defaults to the customer name, if logged in. */
    nickname?: boolean | number
    /** The reviewed product. */
    product?: ProductInterfaceGenqlSelection
    /** An array of ratings by rating category, such as quality, price, and value. */
    ratings_breakdown?: ProductReviewRatingGenqlSelection
    /** The summary (title) of the review. */
    summary?: boolean | number
    /** The review text. */
    text?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains data about a single aspect of a product review. */
export interface ProductReviewRatingGenqlSelection{
    /** The label assigned to an aspect of a product that is being rated, such as quality or price. */
    name?: boolean | number
    /** The rating value given by customer. By default, possible values range from 1 to 5. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the reviewer's rating for a single aspect of a review. */
export interface ProductReviewRatingInput {
/** An encoded rating ID. */
id: Scalars['String'],
/** An encoded rating value ID. */
value_id: Scalars['String']}


/** Contains details about a single aspect of a product review. */
export interface ProductReviewRatingMetadataGenqlSelection{
    /** An encoded rating ID. */
    id?: boolean | number
    /** The label assigned to an aspect of a product that is being rated, such as quality or price. */
    name?: boolean | number
    /** List of product review ratings sorted by position. */
    values?: ProductReviewRatingValueMetadataGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains an array of metadata about each aspect of a product review. */
export interface ProductReviewRatingsMetadataGenqlSelection{
    /** An array of product reviews sorted by position. */
    items?: ProductReviewRatingMetadataGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a single value in a product review. */
export interface ProductReviewRatingValueMetadataGenqlSelection{
    /** A ratings scale, such as the number of stars awarded. */
    value?: boolean | number
    /** An encoded rating value ID. */
    value_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains an array of product reviews. */
export interface ProductReviewsGenqlSelection{
    /** An array of product reviews. */
    items?: ProductReviewGenqlSelection
    /** Metadata for pagination rendering. */
    page_info?: SearchResultPageInfoGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the results of a `products` query. */
export interface ProductsGenqlSelection{
    /** A bucket that contains the attribute code and label for each filterable option. */
    aggregations?: (AggregationGenqlSelection & { __args?: {filter?: (AggregationsFilterInput | null)} })
    /**
     * @deprecated Use `aggregations` instead.
     * Layered navigation filters array.
     */
    filters?: LayerFilterGenqlSelection
    /** An array of products that match the specified search criteria. */
    items?: ProductInterfaceGenqlSelection
    /** An object that includes the page_info and currentPage values specified in the query. */
    page_info?: SearchResultPageInfoGenqlSelection
    /** An object that includes the default sort field and all available sort fields. */
    sort_fields?: SortFieldsGenqlSelection
    /** An array of search suggestions for case when search query have no results. */
    suggestions?: SearchSuggestionGenqlSelection
    /**
     * The number of products that are marked as visible. By default, in complex
     * products, parent products are visible, but their child products are not.
     */
    total_count?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/**
 * Deprecated. Use `ProductAttributeSortInput` instead. Specifies the attribute to
 * use for sorting search results and indicates whether the results are sorted in
 * ascending or descending order.
 */
export interface ProductSortInput {
/** The product's country of origin. */
country_of_manufacture?: (SortEnum | null),
/** The timestamp indicating when the product was created. */
created_at?: (SortEnum | null),
/** The name of a custom layout. */
custom_layout?: (SortEnum | null),
/** XML code that is applied as a layout update to the product page. */
custom_layout_update?: (SortEnum | null),
/** Detailed information about the product. The value can include simple HTML tags. */
description?: (SortEnum | null),
/** Indicates whether a gift message is available. */
gift_message_available?: (SortEnum | null),
/** Indicates whether additional attributes have been created for the product. */
has_options?: (SortEnum | null),
/** The relative path to the main image on the product page. */
image?: (SortEnum | null),
/** The label assigned to a product image. */
image_label?: (SortEnum | null),
/** A number representing the product's manufacturer. */
manufacturer?: (SortEnum | null),
/** A brief overview of the product for search results listings, maximum 255 characters. */
meta_description?: (SortEnum | null),
/** A comma-separated list of keywords that are visible only to search engines. */
meta_keyword?: (SortEnum | null),
/** A string that is displayed in the title bar and tab of the browser and in search results lists. */
meta_title?: (SortEnum | null),
/** The product name. Customers use this name to identify the product. */
name?: (SortEnum | null),
/** The beginning date for new product listings, and determines if the product is featured as a new product. */
news_from_date?: (SortEnum | null),
/** The end date for new product listings. */
news_to_date?: (SortEnum | null),
/** If the product has multiple options, determines where they appear on the product page. */
options_container?: (SortEnum | null),
/** The price of the item. */
price?: (SortEnum | null),
/** Indicates whether the product has required options. */
required_options?: (SortEnum | null),
/** A short description of the product. Its use depends on the theme. */
short_description?: (SortEnum | null),
/** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
sku?: (SortEnum | null),
/** The relative path to the small image, which is used on catalog pages. */
small_image?: (SortEnum | null),
/** The label assigned to a product's small image. */
small_image_label?: (SortEnum | null),
/** The beginning date that a product has a special price. */
special_from_date?: (SortEnum | null),
/** The discounted price of the product. */
special_price?: (SortEnum | null),
/** The end date that a product has a special price. */
special_to_date?: (SortEnum | null),
/** Indicates the criteria to sort swatches. */
swatch_image?: (SortEnum | null),
/** The relative path to the product's thumbnail image. */
thumbnail?: (SortEnum | null),
/** The label assigned to a product's thumbnail image. */
thumbnail_label?: (SortEnum | null),
/** The price when tier pricing is in effect and the items purchased threshold has been reached. */
tier_price?: (SortEnum | null),
/** The timestamp indicating when the product was updated. */
updated_at?: (SortEnum | null),
/** The part of the URL that identifies the product */
url_key?: (SortEnum | null),url_path?: (SortEnum | null),
/** The weight of the item, in units defined by the store. */
weight?: (SortEnum | null)}


/**
 * Deprecated. Use `TierPrice` instead. Defines a tier price, which is a quantity
 * discount offered to a specific customer group.
 */
export interface ProductTierPricesGenqlSelection{
    /**
     * @deprecated Not relevant for the storefront.
     * The ID of the customer group.
     */
    customer_group_id?: boolean | number
    /**
     * @deprecated Use `TierPrice.discount` instead.
     * The percentage discount of the item.
     */
    percentage_value?: boolean | number
    /**
     * @deprecated Use `TierPrice.quantity` instead.
     * The number of items that must be purchased to qualify for tier pricing.
     */
    qty?: boolean | number
    /**
     * @deprecated Use `TierPrice.final_price` instead.
     * The price of the fixed price item.
     */
    value?: boolean | number
    /**
     * @deprecated Not relevant for the storefront.
     * The ID assigned to the website.
     */
    website_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about a product video. */
export interface ProductVideoGenqlSelection{
    /** Indicates whether the image is hidden from view. */
    disabled?: boolean | number
    /** The label of the product image or video. */
    label?: boolean | number
    /** The media item's position after it has been sorted. */
    position?: boolean | number
    /** The URL of the product image or video. */
    url?: boolean | number
    /** Contains a `ProductMediaGalleryEntriesVideoContent` object. */
    video_content?: ProductMediaGalleryEntriesVideoContentGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryGenqlSelection{
    /**
     * Retrieve EAV attributes associated to a frontend form. Use countries query
     * provided by DirectoryGraphQl module to retrieve region_id and country_id
     * attribute options.
     */
    attributesForm?: (AttributesFormOutputGenqlSelection & { __args: {
    /** Form code. */
    formCode: Scalars['String']} })
    /** Returns a list of attributes metadata for a given entity type. */
    attributesList?: (AttributesMetadataOutputGenqlSelection & { __args: {
    /** Entity type. */
    entityType: AttributeEntityTypeEnum, 
    /** Identifies which filter inputs to search for and return. */
    filters?: (AttributeFilterInput | null)} })
    /** Get a list of available store views and their config information. */
    availableStores?: (StoreConfigGenqlSelection & { __args?: {
    /** Filter store views by the current store group. */
    useCurrentGroup?: (Scalars['Boolean'] | null)} })
    /** Return information about the specified shopping cart. */
    cart?: (CartGenqlSelection & { __args: {
    /** The unique ID of the cart to query. */
    cart_id: Scalars['String']} })
    /** Return a list of categories that match the specified filter. */
    categories?: (CategoryResultGenqlSelection & { __args?: {
    /** Identifies which Category filter inputs to search for and return. */
    filters?: (CategoryFilterInput | null), 
    /** Specifies the maximum number of results to return at once. The default value is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** Specifies which page of results to return. The default value is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /**
     * @deprecated Use `categories` instead.
     * Search for categories that match the criteria specified in the `search` and `filter` attributes.
     */
    category?: (CategoryTreeGenqlSelection & { __args?: {
    /** The category ID to use as the root of the search. */
    id?: (Scalars['Int'] | null)} })
    /**
     * @deprecated Use `categories` instead.
     * Return an array of categories based on the specified filters.
     */
    categoryList?: (CategoryTreeGenqlSelection & { __args?: {
    /** Identifies which Category filter inputs to search for and return. */
    filters?: (CategoryFilterInput | null), 
    /** Specifies the maximum number of results to return at once. The default value is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** Specifies which page of results to return. The default value is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /** Return Terms and Conditions configuration information. */
    checkoutAgreements?: CheckoutAgreementGenqlSelection
    /** Return information about CMS blocks. */
    cmsBlocks?: (CmsBlocksGenqlSelection & { __args?: {
    /** An array of CMS block IDs. */
    identifiers?: ((Scalars['String'] | null)[] | null)} })
    /** Return details about a CMS page. */
    cmsPage?: (CmsPageGenqlSelection & { __args?: {
    /** The ID of the CMS page. */
    id?: (Scalars['Int'] | null), 
    /** The identifier of the CMS page. */
    identifier?: (Scalars['String'] | null)} })
    /** Return products that have been added to the specified compare list. */
    compareList?: (CompareListGenqlSelection & { __args: {
    /** The unique ID of the compare list to be queried. */
    uid: Scalars['ID']} })
    /** The countries query provides information for all countries. */
    countries?: CountryGenqlSelection
    /** The countries query provides information for a single country. */
    country?: (CountryGenqlSelection & { __args?: {id?: (Scalars['String'] | null)} })
    /** Return information about the store's currency. */
    currency?: CurrencyGenqlSelection
    /**
     * @deprecated Use `customAttributeMetadataV2` query instead.
     * Return the attribute type, given an attribute code and entity type.
     */
    customAttributeMetadata?: (CustomAttributeMetadataGenqlSelection & { __args: {
    /** An input object that specifies the attribute code and entity type to search. */
    attributes: AttributeInput[]} })
    /** Retrieve EAV attributes metadata. */
    customAttributeMetadataV2?: (AttributesMetadataOutputGenqlSelection & { __args?: {attributes?: (AttributeInput[] | null)} })
    /** Return detailed information about a customer account. */
    customer?: CustomerGenqlSelection
    /** Return information about the customer's shopping cart. */
    customerCart?: CartGenqlSelection
    /** Return a list of downloadable products the customer has purchased. */
    customerDownloadableProducts?: CustomerDownloadableProductsGenqlSelection
    /** @deprecated Use the `customer` query instead. */
    customerOrders?: CustomerOrdersGenqlSelection
    /** Return a list of customer payment tokens stored in the vault. */
    customerPaymentTokens?: CustomerPaymentTokensGenqlSelection
    /** Retrieve the secure PayPal URL for a Payments Pro Hosted Solution transaction. */
    getHostedProUrl?: (HostedProUrlGenqlSelection & { __args: {
    /** An input object that specifies the cart ID. */
    input: HostedProUrlInput} })
    /** Retrieve payment credentials for a transaction. Use this query for Payflow Link and Payments Advanced payment methods. */
    getPayflowLinkToken?: (PayflowLinkTokenGenqlSelection & { __args: {
    /** An input object that defines the requirements to receive a payment token. */
    input: PayflowLinkTokenInput} })
    /** Retrieves the payment configuration for a given location */
    getPaymentConfig?: (PaymentConfigOutputGenqlSelection & { __args: {
    /** Defines the origin location for that payment request */
    location: PaymentLocation} })
    /** Retrieves the payment details for the order */
    getPaymentOrder?: (PaymentOrderOutputGenqlSelection & { __args: {
    /** The customer cart ID */
    cartId: Scalars['String'], 
    /** PayPal order ID */
    id: Scalars['String']} })
    /** Gets the payment SDK urls and values */
    getPaymentSDK?: (GetPaymentSDKOutputGenqlSelection & { __args: {
    /** Defines the origin location for that payment request */
    location: PaymentLocation} })
    /** Get the module's configuration to initialize Stripe Elements. */
    getStripeConfiguration?: ModuleConfigurationGenqlSelection
    /** Retrieves the vault configuration */
    getVaultConfig?: VaultConfigOutputGenqlSelection
    /** Retrieve guest order details based on number, email and postcode. */
    guestOrder?: (CustomerOrderGenqlSelection & { __args: {input: OrderInformationInput} })
    /** Retrieve guest order details based on token. */
    guestOrderByToken?: (CustomerOrderGenqlSelection & { __args: {input: OrderTokenInput} })
    /** Check whether the specified email has already been used to create a customer account. */
    isEmailAvailable?: (IsEmailAvailableOutputGenqlSelection & { __args: {
    /** The email address to check. */
    email: Scalars['String']} })
    /** The pickup locations query searches for locations that match the search request requirements. */
    pickupLocations?: (PickupLocationsGenqlSelection & { __args?: {
    /** Perform search by location using radius and search term. */
    area?: (AreaInput | null), 
    /** Apply filters by attributes. */
    filters?: (PickupLocationFilterInput | null), 
    /** Specifies which attribute to sort on, and whether to return the results in ascending or descending order. */
    sort?: (PickupLocationSortInput | null), 
    /** The maximum number of pickup locations to return at once. The attribute is optional. */
    pageSize?: (Scalars['Int'] | null), 
    /** Specifies which page of results to return. The default value is 1. */
    currentPage?: (Scalars['Int'] | null), 
    /** Information about products which should be delivered. */
    productsInfo?: ((ProductInfoInput | null)[] | null)} })
    /** Return the active ratings attributes and the values each rating can have. */
    productReviewRatingsMetadata?: ProductReviewRatingsMetadataGenqlSelection
    /** Search for products that match the criteria specified in the `search` and `filter` attributes. */
    products?: (ProductsGenqlSelection & { __args?: {
    /** One or more keywords to use in a full-text search. */
    search?: (Scalars['String'] | null), 
    /** The product attributes to search for and return. */
    filter?: (ProductAttributeFilterInput | null), 
    /** The maximum number of results to return at once. The default value is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default value is 1. */
    currentPage?: (Scalars['Int'] | null), 
    /** Specifies which attributes to sort on, and whether to return the results in ascending or descending order. */
    sort?: (ProductAttributeSortInput | null)} })
    /** Returns details about Google reCAPTCHA V3-Invisible configuration. */
    recaptchaV3Config?: ReCaptchaConfigurationV3GenqlSelection
    /** Return the full details for a specified product, category, or CMS page. */
    route?: (RoutableInterfaceGenqlSelection & { __args: {
    /** A `url_key` appended by the `url_suffix, if one exists. */
    url: Scalars['String']} })
    /** The snowdogMenuNodes query returns information about active nodes of a menu */
    snowdogMenuNodes?: (SnowdogMenuNodesGenqlSelection & { __args: {
    /** Identifier of nodes menu */
    identifier: Scalars['String']} })
    /** The snowdogMenus query returns information about active menus */
    snowdogMenus?: (SnowdogMenusGenqlSelection & { __args?: {
    /** Identifier of the menu */
    identifiers?: ((Scalars['String'] | null)[] | null)} })
    /** Return details about the store's configuration. */
    storeConfig?: StoreConfigGenqlSelection
    /**
     * @deprecated Use the `route` query instead.
     * Return the relative URL for a specified product, category or CMS page.
     */
    urlResolver?: (EntityUrlGenqlSelection & { __args: {
    /** A `url_key` appended by the `url_suffix, if one exists. */
    url: Scalars['String']} })
    /**
     * @deprecated Moved under `Customer.wishlist`.
     * Return the contents of a customer's wish list.
     */
    wishlist?: WishlistOutputGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Specifies the field to use for sorting quote items */
export interface QuoteItemsSortInput {
/** Specifies the quote items field to sort by */
field: SortQuoteItemsEnum,
/** Specifies the order of quote items' sorting */
order: SortEnum}


/** Contains reCAPTCHA V3-Invisible configuration details. */
export interface ReCaptchaConfigurationV3GenqlSelection{
    /** The position of the invisible reCAPTCHA badge on each page. */
    badge_position?: boolean | number
    /** The message that appears to the user if validation fails. */
    failure_message?: boolean | number
    /** A list of forms on the storefront that have been configured to use reCAPTCHA V3. */
    forms?: boolean | number
    /** Return whether recaptcha is enabled or not */
    is_enabled?: boolean | number
    /** A two-character code that specifies the language that is used for Google reCAPTCHA text and messaging. */
    language_code?: boolean | number
    /** The minimum score that identifies a user interaction as a potential risk. */
    minimum_score?: boolean | number
    /** The website key generated when the Google reCAPTCHA account was registered. */
    website_key?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RegionGenqlSelection{
    /** The two-letter code for the region, such as TX for Texas. */
    code?: boolean | number
    /** The unique ID for a `Region` object. */
    id?: boolean | number
    /** The name of the region, such as Texas. */
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Specifies the cart from which to remove a coupon. */
export interface RemoveCouponFromCartInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String']}


/** Contains details about the cart after removing a coupon. */
export interface RemoveCouponFromCartOutputGenqlSelection{
    /** The cart after removing a coupon. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Specifies which items to remove from the cart. */
export interface RemoveItemFromCartInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** Deprecated. Use `cart_item_uid` instead. */
cart_item_id?: (Scalars['Int'] | null),
/** Required field. The unique ID for a `CartItemInterface` object. */
cart_item_uid?: (Scalars['ID'] | null)}


/** Contains details about the cart after removing an item. */
export interface RemoveItemFromCartOutputGenqlSelection{
    /** The cart after removing an item. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines which products to remove from a compare list. */
export interface RemoveProductsFromCompareListInput {
/** An array of product IDs to remove from the compare list. */
products: (Scalars['ID'] | null)[],
/** The unique identifier of the compare list to modify. */
uid: Scalars['ID']}


/** Contains the customer's wish list and any errors encountered. */
export interface RemoveProductsFromWishlistOutputGenqlSelection{
    /** An array of errors encountered while deleting products from a wish list. */
    user_errors?: WishListUserInputErrorGenqlSelection
    /** Contains the wish list with after items were successfully deleted. */
    wishlist?: WishlistGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the cart and any errors after adding products. */
export interface ReorderItemsOutputGenqlSelection{
    /** Detailed information about the customer's cart. */
    cart?: CartGenqlSelection
    /** An array of reordering errors. */
    userInputErrors?: CheckoutUserInputErrorGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the result of a request to revoke a customer token. */
export interface RevokeCustomerTokenOutputGenqlSelection{
    /** The result of a request to revoke a customer token. */
    result?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Routable entities serve as the model for a rendered page. */
export interface RoutableInterfaceGenqlSelection{
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    on_BundleProduct?: BundleProductGenqlSelection
    on_CategoryTree?: CategoryTreeGenqlSelection
    on_CmsPage?: CmsPageGenqlSelection
    on_ConfigurableProduct?: ConfigurableProductGenqlSelection
    on_DownloadableProduct?: DownloadableProductGenqlSelection
    on_GroupedProduct?: GroupedProductGenqlSelection
    on_RoutableUrl?: RoutableUrlGenqlSelection
    on_SimpleProduct?: SimpleProductGenqlSelection
    on_VirtualProduct?: VirtualProductGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Default implementation of RoutableInterface. This type is returned when the URL is not linked to an entity. */
export interface RoutableUrlGenqlSelection{
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a comment. */
export interface SalesCommentItemGenqlSelection{
    /** The text of the message. */
    message?: boolean | number
    /** The timestamp of the comment. */
    timestamp?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SalesItemInterfaceGenqlSelection{
    /** The entered gift message for the order item */
    gift_message?: GiftMessageGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the name and value of a SDK parameter */
export interface SDKParamsGenqlSelection{
    /** The name of the SDK parameter */
    name?: boolean | number
    /** The value of the SDK parameter */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Provides navigation for the query response. */
export interface SearchResultPageInfoGenqlSelection{
    /** The specific page to return. */
    current_page?: boolean | number
    /** The maximum number of items to return per page of results. */
    page_size?: boolean | number
    /** The total number of pages in the response. */
    total_pages?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** A string that contains search suggestion */
export interface SearchSuggestionGenqlSelection{
    /** The search suggestion of existing product. */
    search?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a selected bundle option. */
export interface SelectedBundleOptionGenqlSelection{
    /** @deprecated Use `uid` instead */
    id?: boolean | number
    /** The display name of the selected bundle product option. */
    label?: boolean | number
    /** The type of selected bundle product option. */
    type?: boolean | number
    /** The unique ID for a `SelectedBundleOption` object */
    uid?: boolean | number
    /** An array of selected bundle option values. */
    values?: SelectedBundleOptionValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a value for a selected bundle option. */
export interface SelectedBundleOptionValueGenqlSelection{
    /** Use `uid` instead */
    id?: boolean | number
    /** The display name of the value for the selected bundle product option. */
    label?: boolean | number
    /** The price of the value for the selected bundle product option. */
    price?: boolean | number
    /** The quantity of the value for the selected bundle product option. */
    quantity?: boolean | number
    /** The unique ID for a `SelectedBundleOptionValue` object */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a selected configurable option. */
export interface SelectedConfigurableOptionGenqlSelection{
    /** The unique ID for a `ConfigurableProductOptions` object. */
    configurable_product_option_uid?: boolean | number
    /** The unique ID for a `ConfigurableProductOptionsValues` object. */
    configurable_product_option_value_uid?: boolean | number
    /** @deprecated Use `SelectedConfigurableOption.configurable_product_option_uid` instead. */
    id?: boolean | number
    /** The display text for the option. */
    option_label?: boolean | number
    /** @deprecated Use `SelectedConfigurableOption.configurable_product_option_value_uid` instead. */
    value_id?: boolean | number
    /** The display name of the selected configurable option. */
    value_label?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Identifies a customized product that has been placed in a cart. */
export interface SelectedCustomizableOptionGenqlSelection{
    /**
     * The unique ID for a specific `CustomizableOptionInterface` object, such as a
     * `CustomizableFieldOption`, `CustomizableFileOption`, or
     * `CustomizableAreaOption` object.
     */
    customizable_option_uid?: boolean | number
    /** @deprecated Use `SelectedCustomizableOption.customizable_option_uid` instead. */
    id?: boolean | number
    /** Indicates whether the customizable option is required. */
    is_required?: boolean | number
    /** The display name of the selected customizable option. */
    label?: boolean | number
    /** A value indicating the order to display this option. */
    sort_order?: boolean | number
    /** The type of `CustomizableOptionInterface` object. */
    type?: boolean | number
    /** An array of selectable values. */
    values?: SelectedCustomizableOptionValueGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Identifies the value of the selected customized option. */
export interface SelectedCustomizableOptionValueGenqlSelection{
    /** The unique ID for a value object that corresponds to the object represented by the `customizable_option_uid` attribute. */
    customizable_option_value_uid?: boolean | number
    /** @deprecated Use `SelectedCustomizableOptionValue.customizable_option_value_uid` instead. */
    id?: boolean | number
    /** The display name of the selected value. */
    label?: boolean | number
    /** The price of the selected customizable value. */
    price?: CartItemSelectedOptionValuePriceGenqlSelection
    /** The text identifying the selected value. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Describes the payment method the shopper selected. */
export interface SelectedPaymentMethodGenqlSelection{
    /** The payment method code. */
    code?: boolean | number
    /** The purchase order number. */
    purchase_order_number?: boolean | number
    /** The payment method title. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the selected shipping method and carrier. */
export interface SelectedShippingMethodGenqlSelection{
    /** The cost of shipping using this shipping method. */
    amount?: MoneyGenqlSelection
    /** @deprecated The field should not be used on the storefront. */
    base_amount?: MoneyGenqlSelection
    /** A string that identifies a commercial carrier or an offline shipping method. */
    carrier_code?: boolean | number
    /** The label for the carrier code. */
    carrier_title?: boolean | number
    /** A shipping method code associated with a carrier. */
    method_code?: boolean | number
    /** The label for the method code. */
    method_title?: boolean | number
    /** The cost of shipping using this shipping method, excluding tax. */
    price_excl_tax?: MoneyGenqlSelection
    /** The cost of shipping using this shipping method, including tax. */
    price_incl_tax?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the referenced product and the email sender and recipients. */
export interface SendEmailToFriendInput {
/** The ID of the product that the sender is referencing. */
product_id: Scalars['Int'],
/** An array containing information about each recipient. */
recipients: (SendEmailToFriendRecipientInput | null)[],
/** Information about the customer and the content of the message. */
sender: SendEmailToFriendSenderInput}


/** Contains information about the sender and recipients. */
export interface SendEmailToFriendOutputGenqlSelection{
    /** An array containing information about each recipient. */
    recipients?: SendEmailToFriendRecipientGenqlSelection
    /** Information about the customer and the content of the message. */
    sender?: SendEmailToFriendSenderGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An output object that contains information about the recipient. */
export interface SendEmailToFriendRecipientGenqlSelection{
    /** The email address of the recipient. */
    email?: boolean | number
    /** The name of the recipient. */
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a recipient. */
export interface SendEmailToFriendRecipientInput {
/** The email address of the recipient. */
email: Scalars['String'],
/** The name of the recipient. */
name: Scalars['String']}


/** An output object that contains information about the sender. */
export interface SendEmailToFriendSenderGenqlSelection{
    /** The email address of the sender. */
    email?: boolean | number
    /** The text of the message to be sent. */
    message?: boolean | number
    /** The name of the sender. */
    name?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about the sender. */
export interface SendEmailToFriendSenderInput {
/** The email address of the sender. */
email: Scalars['String'],
/** The text of the message to be sent. */
message: Scalars['String'],
/** The name of the sender. */
name: Scalars['String']}


/** Contains details about the configuration of the Email to a Friend feature. */
export interface SendFriendConfigurationGenqlSelection{
    /** Indicates whether the Email to a Friend feature is enabled. */
    enabled_for_customers?: boolean | number
    /** Indicates whether the Email to a Friend feature is enabled for guests. */
    enabled_for_guests?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Sets the billing address. */
export interface SetBillingAddressOnCartInput {
/** The billing address. */
billing_address: BillingAddressInput,
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String']}


/** Contains details about the cart after setting the billing address. */
export interface SetBillingAddressOnCartOutputGenqlSelection{
    /** The cart after setting the billing address. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Sets the cart as inactive */
export interface SetCartAsInactiveOutputGenqlSelection{
    /** The error message returned after failing to set the cart as inactive */
    error?: boolean | number
    /** Indicates whether the cart was set as inactive */
    success?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the guest email and cart. */
export interface SetGuestEmailOnCartInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** The email address of the guest. */
email: Scalars['String']}


/** Contains details about the cart after setting the email of a guest. */
export interface SetGuestEmailOnCartOutputGenqlSelection{
    /** The cart after setting the guest email. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Applies a payment method to the quote. */
export interface SetPaymentMethodAndPlaceOrderInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** The payment method data to apply to the cart. */
payment_method: PaymentMethodInput}


/** Applies a payment method to the cart. */
export interface SetPaymentMethodOnCartInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** The payment method data to apply to the cart. */
payment_method: PaymentMethodInput}


/** Contains details about the cart after setting the payment method. */
export interface SetPaymentMethodOnCartOutputGenqlSelection{
    /** The cart after setting the payment method. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Specifies an array of addresses to use for shipping. */
export interface SetShippingAddressesOnCartInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** An array of shipping addresses. */
shipping_addresses: (ShippingAddressInput | null)[]}


/** Contains details about the cart after setting the shipping addresses. */
export interface SetShippingAddressesOnCartOutputGenqlSelection{
    /** The cart after setting the shipping addresses. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Applies one or shipping methods to the cart. */
export interface SetShippingMethodsOnCartInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** An array of shipping methods. */
shipping_methods: (ShippingMethodInput | null)[]}


/** Contains details about the cart after setting the shipping methods. */
export interface SetShippingMethodsOnCartOutputGenqlSelection{
    /** The cart after setting the shipping methods. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ShipmentItemGenqlSelection{
    /** The unique ID for a `ShipmentItemInterface` object. */
    id?: boolean | number
    /** The order item associated with the shipment item. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of shipped items. */
    quantity_shipped?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Order shipment item details. */
export interface ShipmentItemInterfaceGenqlSelection{
    /** The unique ID for a `ShipmentItemInterface` object. */
    id?: boolean | number
    /** The order item associated with the shipment item. */
    order_item?: OrderItemInterfaceGenqlSelection
    /** The name of the base product. */
    product_name?: boolean | number
    /** The sale price for the base product. */
    product_sale_price?: MoneyGenqlSelection
    /** The SKU of the base product. */
    product_sku?: boolean | number
    /** The number of shipped items. */
    quantity_shipped?: boolean | number
    on_BundleShipmentItem?: BundleShipmentItemGenqlSelection
    on_ShipmentItem?: ShipmentItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains order shipment tracking details. */
export interface ShipmentTrackingGenqlSelection{
    /** The shipping carrier for the order delivery. */
    carrier?: boolean | number
    /** The tracking number of the order shipment. */
    number?: boolean | number
    /** The shipment tracking title. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a single shipping address. */
export interface ShippingAddressInput {
/** Defines a shipping address. */
address?: (CartAddressInput | null),
/** An ID from the customer's address book that uniquely identifies the address to be used for shipping. */
customer_address_id?: (Scalars['Int'] | null),
/** Text provided by the shopper. */
customer_notes?: (Scalars['String'] | null),
/** The code of Pickup Location which will be used for In-Store Pickup. */
pickup_location_code?: (Scalars['String'] | null)}


/** Contains shipping addresses and methods. */
export interface ShippingCartAddressGenqlSelection{
    /** An array that lists the shipping methods that can be applied to the cart. */
    available_shipping_methods?: AvailableShippingMethodGenqlSelection
    /** @deprecated Use `cart_items_v2` instead. */
    cart_items?: CartItemQuantityGenqlSelection
    /** An array that lists the items in the cart. */
    cart_items_v2?: CartItemInterfaceGenqlSelection
    /** The city specified for the billing or shipping address. */
    city?: boolean | number
    /** The company specified for the billing or shipping address. */
    company?: boolean | number
    /** An object containing the country label and code. */
    country?: CartAddressCountryGenqlSelection
    /** Text provided by the shopper. */
    customer_notes?: boolean | number
    /** The customer's fax number. */
    fax?: boolean | number
    /** The first name of the customer or guest. */
    firstname?: boolean | number
    /** @deprecated This information should not be exposed on the frontend. */
    items_weight?: boolean | number
    /** The last name of the customer or guest. */
    lastname?: boolean | number
    /** The middle name of the person associated with the billing/shipping address. */
    middlename?: boolean | number
    pickup_location_code?: boolean | number
    /** The ZIP or postal code of the billing or shipping address. */
    postcode?: boolean | number
    /** An honorific, such as Dr., Mr., or Mrs. */
    prefix?: boolean | number
    /** An object containing the region label and code. */
    region?: CartAddressRegionGenqlSelection
    /** An object that describes the selected shipping method. */
    selected_shipping_method?: SelectedShippingMethodGenqlSelection
    /** An array containing the street for the billing or shipping address. */
    street?: boolean | number
    /** A value such as Sr., Jr., or III. */
    suffix?: boolean | number
    /** The telephone number for the billing or shipping address. */
    telephone?: boolean | number
    /** The unique id of the customer address. */
    uid?: boolean | number
    /** The VAT company number for billing or shipping address. */
    vat_id?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines an individual shipping discount. This discount can be applied to shipping. */
export interface ShippingDiscountGenqlSelection{
    /** The amount of the discount. */
    amount?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about shipping and handling costs. */
export interface ShippingHandlingGenqlSelection{
    /** The shipping amount, excluding tax. */
    amount_excluding_tax?: MoneyGenqlSelection
    /** The shipping amount, including tax. */
    amount_including_tax?: MoneyGenqlSelection
    /** The applied discounts to the shipping. */
    discounts?: ShippingDiscountGenqlSelection
    /** Details about taxes applied for shipping. */
    taxes?: TaxItemGenqlSelection
    /** The total amount for shipping. */
    total_amount?: MoneyGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the shipping carrier and method. */
export interface ShippingMethodInput {
/** A string that identifies a commercial carrier or an offline delivery method. */
carrier_code: Scalars['String'],
/**
 * A string that indicates which service a commercial carrier will use to ship
 * items. For offline delivery methods, this value is similar to the label
 * displayed on the checkout page.
 */
method_code: Scalars['String']}


/** An implementation for simple product cart items. */
export interface SimpleCartItemGenqlSelection{
    /** An array containing the customizable options the shopper selected. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** An array of errors encountered while loading the cart item */
    errors?: CartItemErrorGenqlSelection
    /** The entered gift message for the cart item */
    gift_message?: GiftMessageGenqlSelection
    /** @deprecated Use `uid` instead. */
    id?: boolean | number
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available?: boolean | number
    /** Contains details about the price of the item, including taxes and discounts. */
    prices?: CartItemPricesGenqlSelection
    /** Details about an item in the cart. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this item in the cart. */
    quantity?: boolean | number
    /** The unique ID for a `CartItemInterface` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a simple product, which is tangible and is usually sold in single units or in fixed quantities. */
export interface SimpleProductGenqlSelection{
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id?: boolean | number
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url?: boolean | number
    /** The categories assigned to a product. */
    categories?: CategoryInterfaceGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    color?: boolean | number
    /** The product's country of origin. */
    country_of_manufacture?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at?: boolean | number
    /** Crosssell Products */
    crosssell_products?: ProductInterfaceGenqlSelection
    /** Product custom attributes. */
    custom_attributesV2?: (ProductCustomAttributesGenqlSelection & { __args?: {filters?: (AttributeFilterInput | null)} })
    /** Detailed information about the product. The value can include simple HTML tags. */
    description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size?: boolean | number
    /** Indicates whether a gift message is available. */
    gift_message_available?: boolean | number
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id?: boolean | number
    /** The relative path to the main image on the product page. */
    image?: ProductImageGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested?: boolean | number
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2?: boolean | number
    /** An array of media gallery objects. */
    media_gallery?: MediaGalleryInterfaceGenqlSelection
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries?: MediaGalleryEntryGenqlSelection
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description?: boolean | number
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword?: boolean | number
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title?: boolean | number
    /** The product name. Customers use this name to identify the product. */
    name?: boolean | number
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date?: boolean | number
    /** The end date for new product listings. */
    new_to_date?: boolean | number
    /** Product stock only x left count */
    only_x_left_in_stock?: boolean | number
    /** An array of options for a customizable product. */
    options?: CustomizableOptionInterfaceGenqlSelection
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container?: boolean | number
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price?: ProductPricesGenqlSelection
    /** The range of prices for the product */
    price_range?: PriceRangeGenqlSelection
    /** An array of `TierPrice` objects. */
    price_tiers?: TierPriceGenqlSelection
    /** An array of `ProductLinks` objects. */
    product_links?: ProductLinksInterfaceGenqlSelection
    /** The average of all the ratings given to the product. */
    rating_summary?: boolean | number
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** An array of products to be displayed in a Related Products block. */
    related_products?: ProductInterfaceGenqlSelection
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** The total count of all the reviews given to the product. */
    review_count?: boolean | number
    /** The list of products reviews. */
    reviews?: (ProductReviewsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /** A short description of the product. Its use depends on the theme. */
    short_description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    size?: boolean | number
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku?: boolean | number
    /** The relative path to the small image, which is used on catalog pages. */
    small_image?: ProductImageGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date?: boolean | number
    /** The discounted price of the product. */
    special_price?: boolean | number
    /** The end date for a product with a special price. */
    special_to_date?: boolean | number
    /** Stock status of the product */
    stock_status?: boolean | number
    /** The file name of a swatch image. */
    swatch_image?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    tema?: boolean | number
    /** The relative path to the product's thumbnail image. */
    thumbnail?: ProductImageGenqlSelection
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price?: boolean | number
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices?: ProductTierPricesGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id?: boolean | number
    /** The unique ID for a `ProductInterface` object. */
    uid?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at?: boolean | number
    /** Upsell Products */
    upsell_products?: ProductInterfaceGenqlSelection
    /** The part of the URL that identifies the product */
    url_key?: boolean | number
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path?: boolean | number
    /** URL rewrites list */
    url_rewrites?: UrlRewriteGenqlSelection
    /** The part of the product URL that is appended after the url key */
    url_suffix?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites?: WebsiteGenqlSelection
    /** The weight of the item, in units defined by the store. */
    weight?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a single product to add to the cart. */
export interface SimpleProductCartItemInput {
/** An array that defines customizable options for the product. */
customizable_options?: ((CustomizableOptionInput | null)[] | null),
/** An object containing the `sku`, `quantity`, and other relevant information about the product. */
data: CartItemInput}


/** Contains a simple product wish list item. */
export interface SimpleWishlistItemGenqlSelection{
    /** The date and time the item was added to the wish list. */
    added_at?: boolean | number
    /** Custom options selected for the wish list item. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** The description of the item. */
    description?: boolean | number
    /** The unique ID for a `WishlistItemInterface` object. */
    id?: boolean | number
    /** Product details of the wish list item. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this wish list item. */
    quantity?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Smart button payment inputs */
export interface SmartButtonMethodInput {
/** The payment source for the payment method */
payment_source?: (Scalars['String'] | null),
/** The payment services order ID */
payments_order_id?: (Scalars['String'] | null),
/** PayPal order ID */
paypal_order_id?: (Scalars['String'] | null)}

export interface SmartButtonsConfigGenqlSelection{
    /** Indicated whether to use App Switch on enabled mobile devices */
    app_switch_when_available?: boolean | number
    /** The styles for the PayPal Smart Button configuration */
    button_styles?: ButtonStylesGenqlSelection
    /** The payment method code as defined in the payment gateway */
    code?: boolean | number
    /** Indicates whether to display the PayPal Pay Later message */
    display_message?: boolean | number
    /** Indicates whether to display Venmo */
    display_venmo?: boolean | number
    /** Indicates whether the payment method is displayed */
    is_visible?: boolean | number
    /** Contains details about the styles for the PayPal Pay Later message */
    message_styles?: MessageStylesGenqlSelection
    /** Defines the payment intent (Authorize or Capture */
    payment_intent?: boolean | number
    /** The PayPal parameters required to load the JS SDK */
    sdk_params?: SDKParamsGenqlSelection
    /** The relative order the payment method is displayed on the checkout page */
    sort_order?: boolean | number
    /** The name displayed for the payment method */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** SnowdogMenu defines all menu information */
export interface SnowdogMenuGenqlSelection{
    /** Menu creation time */
    creation_time?: boolean | number
    /** Menu CSS class */
    css_class?: boolean | number
    /** Menu identifier */
    identifier?: boolean | number
    /** Menu ID */
    menu_id?: boolean | number
    /** Menu nodes */
    nodes?: SnowdogMenuNodesGenqlSelection
    /** Menu title */
    title?: boolean | number
    /** Menu update time */
    update_time?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Snowdog menu CMS page node type */
export interface SnowdogMenuCmsPageNodeGenqlSelection{
    /** Node additional data */
    additional_data?: boolean | number
    /** Node classes */
    classes?: boolean | number
    /** Node content */
    content?: boolean | number
    /** Node creation time */
    creation_time?: boolean | number
    /** Node level */
    level?: boolean | number
    /** Menu ID */
    menu_id?: boolean | number
    /** Node ID */
    node_id?: boolean | number
    /** Node template */
    node_template?: boolean | number
    /** Node parent ID */
    parent_id?: boolean | number
    /** Node position */
    position?: boolean | number
    /** Node submenu template */
    submenu_template?: boolean | number
    /** Node title */
    title?: boolean | number
    /** Node type */
    type?: boolean | number
    /** Node update time */
    update_time?: boolean | number
    /** Returns the url key when available */
    url_key?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Snowdog menu custom URL node type */
export interface SnowdogMenuCustomUrlNodeGenqlSelection{
    /** Node additional data */
    additional_data?: boolean | number
    /** Node classes */
    classes?: boolean | number
    /** Node content */
    content?: boolean | number
    /** Node creation time */
    creation_time?: boolean | number
    /** Node image */
    image?: boolean | number
    /** Node image alt text */
    image_alt_text?: boolean | number
    /** Node level */
    level?: boolean | number
    /** Menu ID */
    menu_id?: boolean | number
    /** Node ID */
    node_id?: boolean | number
    /** Node template */
    node_template?: boolean | number
    /** Node parent ID */
    parent_id?: boolean | number
    /** Node position */
    position?: boolean | number
    /** Node submenu template */
    submenu_template?: boolean | number
    /** Node target (false for '_self', true for '_blank') */
    target?: boolean | number
    /** Node title */
    title?: boolean | number
    /** Node type */
    type?: boolean | number
    /** Node update time */
    update_time?: boolean | number
    /** Returns the url key when available */
    url_key?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** SnowdogMenuCustomUrlNodeInterface contains custom URL nodes specific fields */
export interface SnowdogMenuCustomUrlNodeInterfaceGenqlSelection{
    /** Node target (false for '_self', true for '_blank') */
    target?: boolean | number
    on_SnowdogMenuCustomUrlNode?: SnowdogMenuCustomUrlNodeGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Snowdog menu default node type */
export interface SnowdogMenuNodeGenqlSelection{
    /** Node additional data */
    additional_data?: boolean | number
    /** Node classes */
    classes?: boolean | number
    /** Node content */
    content?: boolean | number
    /** Node creation time */
    creation_time?: boolean | number
    /** Node image */
    image?: boolean | number
    /** Node image alt text */
    image_alt_text?: boolean | number
    /** Node level */
    level?: boolean | number
    /** Menu ID */
    menu_id?: boolean | number
    /** Node ID */
    node_id?: boolean | number
    /** Node template */
    node_template?: boolean | number
    /** Node parent ID */
    parent_id?: boolean | number
    /** Node position */
    position?: boolean | number
    /** Node submenu template */
    submenu_template?: boolean | number
    /** Node title */
    title?: boolean | number
    /** Node type */
    type?: boolean | number
    /** Node update time */
    update_time?: boolean | number
    /** Returns the url key when available */
    url_key?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** SnowdogMenuNodeContentFieldsInterface defines node content field */
export interface SnowdogMenuNodeContentFieldInterfaceGenqlSelection{
    /** Node content */
    content?: boolean | number
    on_SnowdogMenuCmsPageNode?: SnowdogMenuCmsPageNodeGenqlSelection
    on_SnowdogMenuCustomUrlNode?: SnowdogMenuCustomUrlNodeGenqlSelection
    on_SnowdogMenuNode?: SnowdogMenuNodeGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** SnowdogMenuNodeContentFieldsInterface defines node image fields */
export interface SnowdogMenuNodeImageFieldInterfaceGenqlSelection{
    /** Node image */
    image?: boolean | number
    /** Node image alt text */
    image_alt_text?: boolean | number
    on_SnowdogMenuCustomUrlNode?: SnowdogMenuCustomUrlNodeGenqlSelection
    on_SnowdogMenuNode?: SnowdogMenuNodeGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** SnowdogMenuNodeInterface contains the fields that are common to all types of nodes */
export interface SnowdogMenuNodeInterfaceGenqlSelection{
    /** Node additional data */
    additional_data?: boolean | number
    /** Node classes */
    classes?: boolean | number
    /** Node creation time */
    creation_time?: boolean | number
    /** Node level */
    level?: boolean | number
    /** Menu ID */
    menu_id?: boolean | number
    /** Node ID */
    node_id?: boolean | number
    /** Node template */
    node_template?: boolean | number
    /** Node parent ID */
    parent_id?: boolean | number
    /** Node position */
    position?: boolean | number
    /** Node submenu template */
    submenu_template?: boolean | number
    /** Node title */
    title?: boolean | number
    /** Node type */
    type?: boolean | number
    /** Node update time */
    update_time?: boolean | number
    /** Returns the url key when available */
    url_key?: boolean | number
    on_SnowdogMenuCmsPageNode?: SnowdogMenuCmsPageNodeGenqlSelection
    on_SnowdogMenuCustomUrlNode?: SnowdogMenuCustomUrlNodeGenqlSelection
    on_SnowdogMenuNode?: SnowdogMenuNodeGenqlSelection
    on_SnowdogMenuWrapperNode?: SnowdogMenuWrapperNodeGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Menu nodes information */
export interface SnowdogMenuNodesGenqlSelection{
    /** An array of menu nodes */
    items?: SnowdogMenuNodeInterfaceGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Menus information */
export interface SnowdogMenusGenqlSelection{
    /** An array of menus */
    items?: SnowdogMenuGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Snowdog menu wrapper node type */
export interface SnowdogMenuWrapperNodeGenqlSelection{
    /** Node additional data */
    additional_data?: boolean | number
    /** Node classes */
    classes?: boolean | number
    /** Node creation time */
    creation_time?: boolean | number
    /** Node level */
    level?: boolean | number
    /** Menu ID */
    menu_id?: boolean | number
    /** Node ID */
    node_id?: boolean | number
    /** Node template */
    node_template?: boolean | number
    /** Node parent ID */
    parent_id?: boolean | number
    /** Node position */
    position?: boolean | number
    /** Node submenu template */
    submenu_template?: boolean | number
    /** Node title */
    title?: boolean | number
    /** Node type */
    type?: boolean | number
    /** Node update time */
    update_time?: boolean | number
    /** Returns the url key when available */
    url_key?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a possible sort field. */
export interface SortFieldGenqlSelection{
    /** The label of the sort field. */
    label?: boolean | number
    /** The attribute code of the sort field. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains a default value for sort fields and all available sort fields. */
export interface SortFieldsGenqlSelection{
    /** The default sort field value. */
    default?: boolean | number
    /** An array of possible sort fields. */
    options?: SortFieldGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains information about a store's configuration. */
export interface StoreConfigGenqlSelection{
    /** Contains scripts that must be included in the HTML before the closing `<body>` tag. */
    absolute_footer?: boolean | number
    /** Indicates whether guest users can write product reviews. Possible values: 1 (Yes) and 0 (No). */
    allow_guests_to_write_product_reviews?: boolean | number
    /** The value of the Allow Gift Messages for Order Items option */
    allow_items?: boolean | number
    /** The value of the Allow Gift Messages on Order Level option */
    allow_order?: boolean | number
    /** Indicates whether to enable autocomplete on login and forgot password forms. */
    autocomplete_on_storefront?: boolean | number
    /** The base currency code. */
    base_currency_code?: boolean | number
    /** A fully-qualified URL that is used to create relative links to the `base_url`. */
    base_link_url?: boolean | number
    /** The fully-qualified URL that specifies the location of media files. */
    base_media_url?: boolean | number
    /** The fully-qualified URL that specifies the location of static view files. */
    base_static_url?: boolean | number
    /** The store’s fully-qualified base URL. */
    base_url?: boolean | number
    /** Extended Config Data - checkout/cart/delete_quote_after */
    cart_expires_in_days?: boolean | number
    /** Extended Config Data - checkout/cart_link/use_qty */
    cart_summary_display_quantity?: boolean | number
    /** The default sort order of the search results list. */
    catalog_default_sort_by?: boolean | number
    /** The suffix applied to category pages, such as `.htm` or `.html`. */
    category_url_suffix?: boolean | number
    /** Indicates whether only specific countries can use this payment method. */
    check_money_order_enable_for_specific_countries?: boolean | number
    /** Indicates whether the Check/Money Order payment method is enabled. */
    check_money_order_enabled?: boolean | number
    /** The name of the party to whom the check must be payable. */
    check_money_order_make_check_payable_to?: boolean | number
    /** The maximum order amount required to qualify for the Check/Money Order payment method. */
    check_money_order_max_order_total?: boolean | number
    /** The minimum order amount required to qualify for the Check/Money Order payment method. */
    check_money_order_min_order_total?: boolean | number
    /** The status of new orders placed using the Check/Money Order payment method. */
    check_money_order_new_order_status?: boolean | number
    /** A comma-separated list of specific countries allowed to use the Check/Money Order payment method. */
    check_money_order_payment_from_specific_countries?: boolean | number
    /** The full street address or PO Box where the checks are mailed. */
    check_money_order_send_check_to?: boolean | number
    /**
     * A number indicating the position of the Check/Money Order payment method in
     * the list of available payment methods during checkout.
     */
    check_money_order_sort_order?: boolean | number
    /** The title of the Check/Money Order payment method displayed on the storefront. */
    check_money_order_title?: boolean | number
    /** The name of the CMS page that identifies the home page for the store. */
    cms_home_page?: boolean | number
    /** A specific CMS page that displays when cookies are not enabled for the browser. */
    cms_no_cookies?: boolean | number
    /** A specific CMS page that displays when a 404 'Page Not Found' error occurs. */
    cms_no_route?: boolean | number
    /**
     * @deprecated Use `store_code` instead.
     * A code assigned to the store to identify it.
     */
    code?: boolean | number
    /** Indicates whether the `parent` or child (`itself`) thumbnail should be used in the cart for configurable products. */
    configurable_thumbnail_source?: boolean | number
    /** Indicates whether the Contact Us form in enabled. */
    contact_enabled?: boolean | number
    /** The copyright statement that appears at the bottom of each page. */
    copyright?: boolean | number
    /** Extended Config Data - general/region/state_required */
    countries_with_required_region?: boolean | number
    /** Indicates if the new accounts need confirmation. */
    create_account_confirmation?: boolean | number
    /** Customer access token lifetime. */
    customer_access_token_lifetime?: boolean | number
    /** Extended Config Data - general/country/default */
    default_country?: boolean | number
    /**
     * The description that provides a summary of your site for search engine
     * listings. It should not be more than 160 characters in length.
     */
    default_description?: boolean | number
    /** The default display currency code. */
    default_display_currency_code?: boolean | number
    /** A series of keywords that describe your store, each separated by a comma. */
    default_keywords?: boolean | number
    /** The title that appears at the title bar of each page when viewed in a browser. */
    default_title?: boolean | number
    /** Controls the display of the demo store notice at the top of the page. Options: 0 (No) or 1 (Yes). */
    demonotice?: boolean | number
    /** Extended Config Data - general/region/display_all */
    display_state_if_optional?: boolean | number
    /** The landing page that is associated with the base URL. */
    front?: boolean | number
    /** The default number of products per page in Grid View. */
    grid_per_page?: boolean | number
    /** A list of numbers that define how many products can be displayed in Grid View. */
    grid_per_page_values?: boolean | number
    /** Scripts that must be included in the HTML before the closing `<head>` tag. */
    head_includes?: boolean | number
    /** The small graphic image (favicon) that appears in the address bar and tab of the browser. */
    head_shortcut_icon?: boolean | number
    /** The path to the logo that appears in the header. */
    header_logo_src?: boolean | number
    /**
     * @deprecated Use `store_code` instead.
     * The ID number assigned to the store.
     */
    id?: boolean | number
    /** Indicates whether the store view has been designated as the default within the store group. */
    is_default_store?: boolean | number
    /** Indicates whether the store group has been designated as the default within the website. */
    is_default_store_group?: boolean | number
    /** Extended Config Data - checkout/options/guest_checkout */
    is_guest_checkout_enabled?: boolean | number
    /** Extended Config Data - checkout/options/onepage_checkout_enabled */
    is_one_page_checkout_enabled?: boolean | number
    /** The format of the search results list. */
    list_mode?: boolean | number
    /** The default number of products per page in List View. */
    list_per_page?: boolean | number
    /** A list of numbers that define how many products can be displayed in List View. */
    list_per_page_values?: boolean | number
    /** The store locale. */
    locale?: boolean | number
    /** The Alt text that is associated with the logo. */
    logo_alt?: boolean | number
    /** The height of the logo image, in pixels. */
    logo_height?: boolean | number
    /** The width of the logo image, in pixels. */
    logo_width?: boolean | number
    /** Indicates whether wishlists are enabled (1) or disabled (0). */
    magento_wishlist_general_is_enabled?: boolean | number
    /** Extended Config Data - checkout/options/max_items_display_count */
    max_items_in_order_summary?: boolean | number
    /** Extended Config Data - checkout/sidebar/display */
    minicart_display?: boolean | number
    /** Extended Config Data - checkout/sidebar/count */
    minicart_max_items?: boolean | number
    /** The minimum number of characters required for a valid password. */
    minimum_password_length?: boolean | number
    /** Indicates whether newsletters are enabled. */
    newsletter_enabled?: boolean | number
    /** The default page that displays when a 404 'Page not Found' error occurs. */
    no_route?: boolean | number
    /** Extended Config Data - general/country/optional_zip_countries */
    optional_zip_countries?: boolean | number
    /** Indicates whether orders can be cancelled by customers or not. */
    order_cancellation_enabled?: boolean | number
    /** An array containing available cancellation reasons. */
    order_cancellation_reasons?: CancellationReasonGenqlSelection
    /** Payflow Pro vault status. */
    payment_payflowpro_cc_vault_active?: boolean | number
    /** Indicates whether product reviews are enabled. Possible values: 1 (Yes) and 0 (No). */
    product_reviews_enabled?: boolean | number
    /** The suffix applied to product pages, such as `.htm` or `.html`. */
    product_url_suffix?: boolean | number
    /** The number of different character classes (lowercase, uppercase, digits, special characters) required in a password. */
    required_character_classes_number?: boolean | number
    /**
     * @deprecated Use `root_category_uid` instead.
     * The ID of the root category.
     */
    root_category_id?: boolean | number
    /** The unique ID for a `CategoryInterface` object. */
    root_category_uid?: boolean | number
    /** A secure fully-qualified URL that is used to create relative links to the `base_url`. */
    secure_base_link_url?: boolean | number
    /** The secure fully-qualified URL that specifies the location of media files. */
    secure_base_media_url?: boolean | number
    /** The secure fully-qualified URL that specifies the location of static view files. */
    secure_base_static_url?: boolean | number
    /** The store’s fully-qualified secure base URL. */
    secure_base_url?: boolean | number
    /** Email to a Friend configuration. */
    send_friend?: SendFriendConfigurationGenqlSelection
    /** Extended Config Data - tax/cart_display/full_summary */
    shopping_cart_display_full_summary?: boolean | number
    /** Extended Config Data - tax/cart_display/grandtotal */
    shopping_cart_display_grand_total?: boolean | number
    /** Extended Config Data - tax/cart_display/price */
    shopping_cart_display_price?: boolean | number
    /** Extended Config Data - tax/cart_display/shipping */
    shopping_cart_display_shipping?: boolean | number
    /** Extended Config Data - tax/cart_display/subtotal */
    shopping_cart_display_subtotal?: boolean | number
    /** Extended Config Data - tax/cart_display/gift_wrapping */
    shopping_cart_display_tax_gift_wrapping?: boolean | number
    /** Extended Config Data - tax/cart_display/zero_tax */
    shopping_cart_display_zero_tax?: boolean | number
    /** Indicates whether a breadcrumb trail appears on all CMS pages in the catalog. 0 (No) or 1 (Yes). */
    show_cms_breadcrumbs?: boolean | number
    /**
     * The unique ID of the store view. In the Admin, this is called the Store View
     * Code. When making a GraphQL call, assign this value to the `Store` header to
     * provide the scope.
     */
    store_code?: boolean | number
    /** The unique ID assigned to the store group. In the Admin, this is called the Store Name. */
    store_group_code?: boolean | number
    /** The label assigned to the store group. */
    store_group_name?: boolean | number
    /** The label assigned to the store view. */
    store_name?: boolean | number
    /** The store view sort order. */
    store_sort_order?: boolean | number
    /** The time zone of the store. */
    timezone?: boolean | number
    /** A prefix that appears before the title to create a two- or three-part title. */
    title_prefix?: boolean | number
    /** The character that separates the category name and subcategory in the browser title bar. */
    title_separator?: boolean | number
    /** A suffix that appears after the title to create a two- or three-part title. */
    title_suffix?: boolean | number
    /** Indicates whether the store code should be used in the URL. */
    use_store_in_url?: boolean | number
    /** The unique ID for the website. */
    website_code?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * The ID number assigned to the website store.
     */
    website_id?: boolean | number
    /** The label assigned to the website. */
    website_name?: boolean | number
    /** The unit of weight. */
    weight_unit?: boolean | number
    /** Text that appears in the header of the page and includes the name of the logged in customer. */
    welcome?: boolean | number
    /** Indicates whether only specific countries can use this payment method. */
    zero_subtotal_enable_for_specific_countries?: boolean | number
    /** Indicates whether the Zero Subtotal payment method is enabled. */
    zero_subtotal_enabled?: boolean | number
    /** The status of new orders placed using the Zero Subtotal payment method. */
    zero_subtotal_new_order_status?: boolean | number
    /**
     * When the new order status is 'Processing', this can be set to
     * `authorize_capture` to automatically invoice all items that have a zero balance.
     */
    zero_subtotal_payment_action?: boolean | number
    /** A comma-separated list of specific countries allowed to use the Zero Subtotal payment method. */
    zero_subtotal_payment_from_specific_countries?: boolean | number
    /**
     * A number indicating the position of the Zero Subtotal payment method in the
     * list of available payment methods during checkout.
     */
    zero_subtotal_sort_order?: boolean | number
    /** The title of the Zero Subtotal payment method displayed on the storefront. */
    zero_subtotal_title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Indicates where an attribute can be displayed. */
export interface StorefrontPropertiesGenqlSelection{
    /** The relative position of the attribute in the layered navigation block. */
    position?: boolean | number
    /** Indicates whether the attribute is filterable with results, without results, or not at all. */
    use_in_layered_navigation?: boolean | number
    /** Indicates whether the attribute is displayed in product listings. */
    use_in_product_listing?: boolean | number
    /** Indicates whether the attribute can be used in layered navigation on search results pages. */
    use_in_search_results_layered_navigation?: boolean | number
    /** Indicates whether the attribute is displayed on product pages. */
    visible_on_catalog_pages?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StripePaymentMethodGenqlSelection{
    /** Card brand */
    brand?: boolean | number
    /** UNIX timestamp representing the date that the payment method was created. */
    created?: boolean | number
    /** Indicates whether this saved payment method requires a CVC token to be submitted when placing an order. */
    cvc?: boolean | number
    /** Card expiration month */
    exp_month?: boolean | number
    /** Card expiration year */
    exp_year?: boolean | number
    /** A unique identifier for the card number, tax id, bank account etc. */
    fingerprint?: boolean | number
    /** A payment method icon URL that can be used at the front-end. */
    icon?: boolean | number
    /** Payment method ID */
    id?: boolean | number
    /** A formatted payment method label that you can display to the customer. */
    label?: boolean | number
    /** The type of the payment method, i.e. card, klarna, sepa_debit. */
    type?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StripePaymentMethodId {
/** When this is passed, the action will be performed on all duplicate payment methods which match the fingerprint. */
fingerprint?: (Scalars['String'] | null),
/** The ID of a payment method object */
payment_method: Scalars['String']}

export interface StripePaymentsInput {
/** When CVC is enabled for saved cards, pass the CVC token here to perform the verification. */
cvc_token?: (Scalars['String'] | null),
/** Pass the payment method token here (starts with pm_) */
payment_method?: (Scalars['String'] | null),
/** Specify whether the payment method should be saved */
save_payment_method?: (Scalars['Boolean'] | null)}


/** Contains the result of the `subscribeEmailToNewsletter` operation. */
export interface SubscribeEmailToNewsletterOutputGenqlSelection{
    /** The status of the subscription request. */
    status?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Describes the swatch type and a value. */
export interface SwatchDataGenqlSelection{
    /** The type of swatch filter item: 1 - text; 2 - image. */
    type?: boolean | number
    /** The value for the swatch item. It could be text or an image link. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SwatchDataInterfaceGenqlSelection{
    /** The value can be represented as color (HEX code), image link, or text. */
    value?: boolean | number
    on_ColorSwatchData?: ColorSwatchDataGenqlSelection
    on_ImageSwatchData?: ImageSwatchDataGenqlSelection
    on_TextSwatchData?: TextSwatchDataGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SwatchLayerFilterItemGenqlSelection{
    /**
     * @deprecated Use `AggregationOption.count` instead.
     * The count of items per filter.
     */
    items_count?: boolean | number
    /**
     * @deprecated Use `AggregationOption.label` instead.
     * The label for a filter.
     */
    label?: boolean | number
    /** Data required to render a swatch filter item. */
    swatch_data?: SwatchDataGenqlSelection
    /**
     * @deprecated Use `AggregationOption.value` instead.
     * The value of a filter request variable to be used in query.
     */
    value_string?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SwatchLayerFilterItemInterfaceGenqlSelection{
    /** Data required to render a swatch filter item. */
    swatch_data?: SwatchDataGenqlSelection
    on_SwatchLayerFilterItem?: SwatchLayerFilterItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Synchronizes the payment order details */
export interface SyncPaymentOrderInput {
/** The customer cart ID */
cartId: Scalars['String'],
/** PayPal order ID */
id: Scalars['String']}


/** Contains tax item details. */
export interface TaxItemGenqlSelection{
    /** The amount of tax applied to the item. */
    amount?: MoneyGenqlSelection
    /** The rate used to calculate the tax. */
    rate?: boolean | number
    /** A title that describes the tax. */
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface TextSwatchDataGenqlSelection{
    /** The value can be represented as color (HEX code), image link, or text. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a price based on the quantity purchased. */
export interface TierPriceGenqlSelection{
    /** The price discount that this tier represents. */
    discount?: ProductDiscountGenqlSelection
    /** The price of the product at this tier. */
    final_price?: MoneyGenqlSelection
    /** The minimum number of items that must be purchased to qualify for this price tier. */
    quantity?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Modifies the specified items in the cart. */
export interface UpdateCartItemsInput {
/** The unique ID of a `Cart` object. */
cart_id: Scalars['String'],
/** An array of items to be updated. */
cart_items: (CartItemUpdateInput | null)[]}


/** Contains details about the cart after updating items. */
export interface UpdateCartItemsOutputGenqlSelection{
    /** The cart after updating products. */
    cart?: CartGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains the customer's wish list and any errors encountered. */
export interface UpdateProductsInWishlistOutputGenqlSelection{
    /** An array of errors encountered while updating products in a wish list. */
    user_errors?: WishListUserInputErrorGenqlSelection
    /** Contains the wish list with all items that were successfully updated. */
    wishlist?: WishlistGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains URL rewrite details. */
export interface UrlRewriteGenqlSelection{
    /** An array of request parameters. */
    parameters?: HttpQueryParameterGenqlSelection
    /** The request URL. */
    url?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a customer attribute validation rule. */
export interface ValidationRuleGenqlSelection{
    /** Validation rule name applied to a customer attribute. */
    name?: boolean | number
    /** Validation rule value. */
    value?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Retrieves the vault configuration */
export interface VaultConfigOutputGenqlSelection{
    /** Credit card vault method configuration */
    credit_card?: VaultCreditCardConfigGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface VaultCreditCardConfigGenqlSelection{
    /** Is vault enabled */
    is_vault_enabled?: boolean | number
    /** The parameters required to load the Paypal JS SDK */
    sdk_params?: SDKParamsGenqlSelection
    /** 3DS mode */
    three_ds_mode?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Vault payment inputs */
export interface VaultMethodInput {
/** The payment source for the payment method */
payment_source?: (Scalars['String'] | null),
/** The payment services order ID */
payments_order_id?: (Scalars['String'] | null),
/** PayPal order ID */
paypal_order_id?: (Scalars['String'] | null),
/** The public hash of the token. */
public_hash?: (Scalars['String'] | null)}


/** The payment source information */
export interface VaultSetupTokenInput {
/** The payment source information */
payment_source: PaymentSourceInput}


/** Contains required input for payment methods with Vault support. */
export interface VaultTokenInput {
/** The public hash of the payment token. */
public_hash: Scalars['String']}


/** An implementation for virtual product cart items. */
export interface VirtualCartItemGenqlSelection{
    /** An array containing customizable options the shopper selected. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** An array of errors encountered while loading the cart item */
    errors?: CartItemErrorGenqlSelection
    /** @deprecated Use `uid` instead. */
    id?: boolean | number
    /** True if requested quantity is less than available stock, false otherwise. */
    is_available?: boolean | number
    /** Contains details about the price of the item, including taxes and discounts. */
    prices?: CartItemPricesGenqlSelection
    /** Details about an item in the cart. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this item in the cart. */
    quantity?: boolean | number
    /** The unique ID for a `CartItemInterface` object. */
    uid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a virtual product, which is a non-tangible product that does not require shipping and is not kept in inventory. */
export interface VirtualProductGenqlSelection{
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute set assigned to the product.
     */
    attribute_set_id?: boolean | number
    /**
     * The relative canonical URL. This value is returned only if the system setting
     * 'Use Canonical Link Meta Tag For Products' is enabled.
     */
    canonical_url?: boolean | number
    /** The categories assigned to a product. */
    categories?: CategoryInterfaceGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    color?: boolean | number
    /** The product's country of origin. */
    country_of_manufacture?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was created.
     */
    created_at?: boolean | number
    /** Crosssell Products */
    crosssell_products?: ProductInterfaceGenqlSelection
    /** Product custom attributes. */
    custom_attributesV2?: (ProductCustomAttributesGenqlSelection & { __args?: {filters?: (AttributeFilterInput | null)} })
    /** Detailed information about the product. The value can include simple HTML tags. */
    description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    figure_size?: boolean | number
    /** Indicates whether a gift message is available. */
    gift_message_available?: boolean | number
    /**
     * @deprecated Use the `uid` field instead.
     * The ID number assigned to the product.
     */
    id?: boolean | number
    /** The relative path to the main image on the product page. */
    image?: ProductImageGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    is_suggested?: boolean | number
    /**
     * @deprecated Use the `custom_attributes` field instead.
     * A number representing the product's manufacturer.
     */
    manufacturer?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    match_collezione2?: boolean | number
    /** An array of media gallery objects. */
    media_gallery?: MediaGalleryInterfaceGenqlSelection
    /**
     * @deprecated Use `media_gallery` instead.
     * An array of MediaGalleryEntry objects.
     */
    media_gallery_entries?: MediaGalleryEntryGenqlSelection
    /** A brief overview of the product for search results listings, maximum 255 characters. */
    meta_description?: boolean | number
    /** A comma-separated list of keywords that are visible only to search engines. */
    meta_keyword?: boolean | number
    /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
    meta_title?: boolean | number
    /** The product name. Customers use this name to identify the product. */
    name?: boolean | number
    /** The beginning date for new product listings, and determines if the product is featured as a new product. */
    new_from_date?: boolean | number
    /** The end date for new product listings. */
    new_to_date?: boolean | number
    /** Product stock only x left count */
    only_x_left_in_stock?: boolean | number
    /** An array of options for a customizable product. */
    options?: CustomizableOptionInterfaceGenqlSelection
    /** If the product has multiple options, determines where they appear on the product page. */
    options_container?: boolean | number
    /**
     * @deprecated Use `price_range` for product price information.
     * Indicates the price of an item.
     */
    price?: ProductPricesGenqlSelection
    /** The range of prices for the product */
    price_range?: PriceRangeGenqlSelection
    /** An array of `TierPrice` objects. */
    price_tiers?: TierPriceGenqlSelection
    /** An array of `ProductLinks` objects. */
    product_links?: ProductLinksInterfaceGenqlSelection
    /** The average of all the ratings given to the product. */
    rating_summary?: boolean | number
    /**
     * Contains 0 when there is no redirect error. A value of 301 indicates the URL
     * of the requested resource has been changed permanently, while a value of 302
     * indicates a temporary redirect.
     */
    redirect_code?: boolean | number
    /** An array of products to be displayed in a Related Products block. */
    related_products?: ProductInterfaceGenqlSelection
    /** The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original. */
    relative_url?: boolean | number
    /** The total count of all the reviews given to the product. */
    review_count?: boolean | number
    /** The list of products reviews. */
    reviews?: (ProductReviewsGenqlSelection & { __args?: {
    /** The maximum number of results to return at once. The default is 20. */
    pageSize?: (Scalars['Int'] | null), 
    /** The page of results to return. The default is 1. */
    currentPage?: (Scalars['Int'] | null)} })
    /** A short description of the product. Its use depends on the theme. */
    short_description?: ComplexTextValueGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    size?: boolean | number
    /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
    sku?: boolean | number
    /** The relative path to the small image, which is used on catalog pages. */
    small_image?: ProductImageGenqlSelection
    /**
     * @deprecated The field should not be used on the storefront.
     * The beginning date that a product has a special price.
     */
    special_from_date?: boolean | number
    /** The discounted price of the product. */
    special_price?: boolean | number
    /** The end date for a product with a special price. */
    special_to_date?: boolean | number
    /** Stock status of the product */
    stock_status?: boolean | number
    /** The file name of a swatch image. */
    swatch_image?: boolean | number
    /** @deprecated Use the `custom_attributes` field instead. */
    tema?: boolean | number
    /** The relative path to the product's thumbnail image. */
    thumbnail?: ProductImageGenqlSelection
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * The price when tier pricing is in effect and the items purchased threshold has been reached.
     */
    tier_price?: boolean | number
    /**
     * @deprecated Use `price_tiers` for product tier price information.
     * An array of ProductTierPrices objects.
     */
    tier_prices?: ProductTierPricesGenqlSelection
    /** @deprecated Use the `custom_attributes` field instead. */
    tipologia?: boolean | number
    /** One of PRODUCT, CATEGORY, or CMS_PAGE. */
    type?: boolean | number
    /**
     * @deprecated Use `__typename` instead.
     * One of simple, virtual, bundle, downloadable, grouped, or configurable.
     */
    type_id?: boolean | number
    /** The unique ID for a `ProductInterface` object. */
    uid?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Timestamp indicating when the product was updated.
     */
    updated_at?: boolean | number
    /** Upsell Products */
    upsell_products?: ProductInterfaceGenqlSelection
    /** The part of the URL that identifies the product */
    url_key?: boolean | number
    /** @deprecated Use product's `canonical_url` or url rewrites instead */
    url_path?: boolean | number
    /** URL rewrites list */
    url_rewrites?: UrlRewriteGenqlSelection
    /** The part of the product URL that is appended after the url key */
    url_suffix?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * An array of websites in which the product is available.
     */
    websites?: WebsiteGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines a single product to add to the cart. */
export interface VirtualProductCartItemInput {
/** An array that defines customizable options for the product. */
customizable_options?: ((CustomizableOptionInput | null)[] | null),
/** An object containing the `sku`, `quantity`, and other relevant information about the product. */
data: CartItemInput}


/** Contains a virtual product wish list item. */
export interface VirtualWishlistItemGenqlSelection{
    /** The date and time the item was added to the wish list. */
    added_at?: boolean | number
    /** Custom options selected for the wish list item. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** The description of the item. */
    description?: boolean | number
    /** The unique ID for a `WishlistItemInterface` object. */
    id?: boolean | number
    /** Product details of the wish list item. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this wish list item. */
    quantity?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Deprecated. It should not be used on the storefront. Contains information about a website. */
export interface WebsiteGenqlSelection{
    /**
     * @deprecated The field should not be used on the storefront.
     * A code assigned to the website to identify it.
     */
    code?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * The default group ID of the website.
     */
    default_group_id?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * The ID number assigned to the website.
     */
    id?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * Indicates whether this is the default website.
     */
    is_default?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * The website name. Websites use this name to identify it easier.
     */
    name?: boolean | number
    /**
     * @deprecated The field should not be used on the storefront.
     * The attribute to use for sorting websites.
     */
    sort_order?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains a customer wish list. */
export interface WishlistGenqlSelection{
    /** The unique ID for a `Wishlist` object. */
    id?: boolean | number
    /** @deprecated Use the `items_v2` field instead. */
    items?: WishlistItemGenqlSelection
    /** The number of items in the wish list. */
    items_count?: boolean | number
    /** An array of items in the customer's wish list. */
    items_v2?: (WishlistItemsGenqlSelection & { __args?: {currentPage?: (Scalars['Int'] | null), pageSize?: (Scalars['Int'] | null)} })
    /** An encrypted code that Magento uses to link to the wish list. */
    sharing_code?: boolean | number
    /** The time of the last modification to the wish list. */
    updated_at?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about errors encountered when a customer added wish list items to the cart. */
export interface WishlistCartUserInputErrorGenqlSelection{
    /** An error code that describes the error encountered. */
    code?: boolean | number
    /** A localized error message. */
    message?: boolean | number
    /** The unique ID of the `Wishlist` object containing an error. */
    wishlistId?: boolean | number
    /** The unique ID of the wish list item containing an error. */
    wishlistItemId?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains details about a wish list item. */
export interface WishlistItemGenqlSelection{
    /** The time when the customer added the item to the wish list. */
    added_at?: boolean | number
    /** The customer's comment about this item. */
    description?: boolean | number
    /** The unique ID for a `WishlistItem` object. */
    id?: boolean | number
    /** Details about the wish list item. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this wish list item */
    qty?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines the items to add to a wish list. */
export interface WishlistItemInput {
/** An array of options that the customer entered. */
entered_options?: ((EnteredOptionInput | null)[] | null),
/** For complex product types, the SKU of the parent product. */
parent_sku?: (Scalars['String'] | null),
/** The amount or number of items to add. */
quantity: Scalars['Float'],
/** An array of strings corresponding to options the customer selected. */
selected_options?: ((Scalars['ID'] | null)[] | null),
/** The SKU of the product to add. For complex product types, specify the child product SKU. */
sku: Scalars['String']}


/** The interface for wish list items. */
export interface WishlistItemInterfaceGenqlSelection{
    /** The date and time the item was added to the wish list. */
    added_at?: boolean | number
    /** Custom options selected for the wish list item. */
    customizable_options?: SelectedCustomizableOptionGenqlSelection
    /** The description of the item. */
    description?: boolean | number
    /** The unique ID for a `WishlistItemInterface` object. */
    id?: boolean | number
    /** Product details of the wish list item. */
    product?: ProductInterfaceGenqlSelection
    /** The quantity of this wish list item. */
    quantity?: boolean | number
    on_BundleWishlistItem?: BundleWishlistItemGenqlSelection
    on_ConfigurableWishlistItem?: ConfigurableWishlistItemGenqlSelection
    on_DownloadableWishlistItem?: DownloadableWishlistItemGenqlSelection
    on_GroupedProductWishlistItem?: GroupedProductWishlistItemGenqlSelection
    on_SimpleWishlistItem?: SimpleWishlistItemGenqlSelection
    on_VirtualWishlistItem?: VirtualWishlistItemGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Contains an array of items in a wish list. */
export interface WishlistItemsGenqlSelection{
    /** A list of items in the wish list. */
    items?: WishlistItemInterfaceGenqlSelection
    /** Contains pagination metadata. */
    page_info?: SearchResultPageInfoGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** Defines updates to items in a wish list. */
export interface WishlistItemUpdateInput {
/** Customer-entered comments about the item. */
description?: (Scalars['String'] | null),
/** An array of options that the customer entered. */
entered_options?: ((EnteredOptionInput | null)[] | null),
/** The new amount or number of this item. */
quantity?: (Scalars['Float'] | null),
/** An array of strings corresponding to options the customer selected. */
selected_options?: ((Scalars['ID'] | null)[] | null),
/** The unique ID for a `WishlistItemInterface` object. */
wishlist_item_id: Scalars['ID']}


/** Deprecated: Use the `Wishlist` type instead. */
export interface WishlistOutputGenqlSelection{
    /**
     * @deprecated Use the `Wishlist.items` field instead.
     * An array of items in the customer's wish list
     */
    items?: WishlistItemGenqlSelection
    /**
     * @deprecated Use the `Wishlist.items_count` field instead.
     * The number of items in the wish list.
     */
    items_count?: boolean | number
    /**
     * @deprecated This field is related to Commerce functionality and is always `null` in Open Source.
     * When multiple wish lists are enabled, the name the customer assigns to the wishlist.
     */
    name?: boolean | number
    /**
     * @deprecated Use the `Wishlist.sharing_code` field instead.
     * An encrypted code that links to the wish list.
     */
    sharing_code?: boolean | number
    /**
     * @deprecated Use the `Wishlist.updated_at` field instead.
     * The time of the last modification to the wish list.
     */
    updated_at?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


/** An error encountered while performing operations with WishList. */
export interface WishListUserInputErrorGenqlSelection{
    /** A wish list-specific error code. */
    code?: boolean | number
    /** A localized error message. */
    message?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const AddBundleProductsToCartOutput_possibleTypes: string[] = ['AddBundleProductsToCartOutput']
    export const isAddBundleProductsToCartOutput = (obj?: { __typename?: any } | null): obj is AddBundleProductsToCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAddBundleProductsToCartOutput"')
      return AddBundleProductsToCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AddConfigurableProductsToCartOutput_possibleTypes: string[] = ['AddConfigurableProductsToCartOutput']
    export const isAddConfigurableProductsToCartOutput = (obj?: { __typename?: any } | null): obj is AddConfigurableProductsToCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAddConfigurableProductsToCartOutput"')
      return AddConfigurableProductsToCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AddDownloadableProductsToCartOutput_possibleTypes: string[] = ['AddDownloadableProductsToCartOutput']
    export const isAddDownloadableProductsToCartOutput = (obj?: { __typename?: any } | null): obj is AddDownloadableProductsToCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAddDownloadableProductsToCartOutput"')
      return AddDownloadableProductsToCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AddProductsToCartOutput_possibleTypes: string[] = ['AddProductsToCartOutput']
    export const isAddProductsToCartOutput = (obj?: { __typename?: any } | null): obj is AddProductsToCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAddProductsToCartOutput"')
      return AddProductsToCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AddProductsToNewCartOutput_possibleTypes: string[] = ['AddProductsToNewCartOutput']
    export const isAddProductsToNewCartOutput = (obj?: { __typename?: any } | null): obj is AddProductsToNewCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAddProductsToNewCartOutput"')
      return AddProductsToNewCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AddProductsToWishlistOutput_possibleTypes: string[] = ['AddProductsToWishlistOutput']
    export const isAddProductsToWishlistOutput = (obj?: { __typename?: any } | null): obj is AddProductsToWishlistOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAddProductsToWishlistOutput"')
      return AddProductsToWishlistOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AddSimpleProductsToCartOutput_possibleTypes: string[] = ['AddSimpleProductsToCartOutput']
    export const isAddSimpleProductsToCartOutput = (obj?: { __typename?: any } | null): obj is AddSimpleProductsToCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAddSimpleProductsToCartOutput"')
      return AddSimpleProductsToCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AddVirtualProductsToCartOutput_possibleTypes: string[] = ['AddVirtualProductsToCartOutput']
    export const isAddVirtualProductsToCartOutput = (obj?: { __typename?: any } | null): obj is AddVirtualProductsToCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAddVirtualProductsToCartOutput"')
      return AddVirtualProductsToCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AddWishlistItemsToCartOutput_possibleTypes: string[] = ['AddWishlistItemsToCartOutput']
    export const isAddWishlistItemsToCartOutput = (obj?: { __typename?: any } | null): obj is AddWishlistItemsToCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAddWishlistItemsToCartOutput"')
      return AddWishlistItemsToCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const Aggregation_possibleTypes: string[] = ['Aggregation']
    export const isAggregation = (obj?: { __typename?: any } | null): obj is Aggregation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAggregation"')
      return Aggregation_possibleTypes.includes(obj.__typename)
    }
    


    const AggregationOption_possibleTypes: string[] = ['AggregationOption']
    export const isAggregationOption = (obj?: { __typename?: any } | null): obj is AggregationOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAggregationOption"')
      return AggregationOption_possibleTypes.includes(obj.__typename)
    }
    


    const AggregationOptionInterface_possibleTypes: string[] = ['AggregationOption']
    export const isAggregationOptionInterface = (obj?: { __typename?: any } | null): obj is AggregationOptionInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAggregationOptionInterface"')
      return AggregationOptionInterface_possibleTypes.includes(obj.__typename)
    }
    


    const ApplePayConfig_possibleTypes: string[] = ['ApplePayConfig']
    export const isApplePayConfig = (obj?: { __typename?: any } | null): obj is ApplePayConfig => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isApplePayConfig"')
      return ApplePayConfig_possibleTypes.includes(obj.__typename)
    }
    


    const AppliedCoupon_possibleTypes: string[] = ['AppliedCoupon']
    export const isAppliedCoupon = (obj?: { __typename?: any } | null): obj is AppliedCoupon => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAppliedCoupon"')
      return AppliedCoupon_possibleTypes.includes(obj.__typename)
    }
    


    const ApplyCouponToCartOutput_possibleTypes: string[] = ['ApplyCouponToCartOutput']
    export const isApplyCouponToCartOutput = (obj?: { __typename?: any } | null): obj is ApplyCouponToCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isApplyCouponToCartOutput"')
      return ApplyCouponToCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AssignCompareListToCustomerOutput_possibleTypes: string[] = ['AssignCompareListToCustomerOutput']
    export const isAssignCompareListToCustomerOutput = (obj?: { __typename?: any } | null): obj is AssignCompareListToCustomerOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAssignCompareListToCustomerOutput"')
      return AssignCompareListToCustomerOutput_possibleTypes.includes(obj.__typename)
    }
    


    const Attribute_possibleTypes: string[] = ['Attribute']
    export const isAttribute = (obj?: { __typename?: any } | null): obj is Attribute => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttribute"')
      return Attribute_possibleTypes.includes(obj.__typename)
    }
    


    const AttributeMetadata_possibleTypes: string[] = ['AttributeMetadata']
    export const isAttributeMetadata = (obj?: { __typename?: any } | null): obj is AttributeMetadata => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributeMetadata"')
      return AttributeMetadata_possibleTypes.includes(obj.__typename)
    }
    


    const AttributeMetadataError_possibleTypes: string[] = ['AttributeMetadataError']
    export const isAttributeMetadataError = (obj?: { __typename?: any } | null): obj is AttributeMetadataError => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributeMetadataError"')
      return AttributeMetadataError_possibleTypes.includes(obj.__typename)
    }
    


    const AttributeOption_possibleTypes: string[] = ['AttributeOption']
    export const isAttributeOption = (obj?: { __typename?: any } | null): obj is AttributeOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributeOption"')
      return AttributeOption_possibleTypes.includes(obj.__typename)
    }
    


    const AttributeOptionMetadata_possibleTypes: string[] = ['AttributeOptionMetadata']
    export const isAttributeOptionMetadata = (obj?: { __typename?: any } | null): obj is AttributeOptionMetadata => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributeOptionMetadata"')
      return AttributeOptionMetadata_possibleTypes.includes(obj.__typename)
    }
    


    const AttributeSelectedOption_possibleTypes: string[] = ['AttributeSelectedOption']
    export const isAttributeSelectedOption = (obj?: { __typename?: any } | null): obj is AttributeSelectedOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributeSelectedOption"')
      return AttributeSelectedOption_possibleTypes.includes(obj.__typename)
    }
    


    const AttributeSelectedOptionInterface_possibleTypes: string[] = ['AttributeSelectedOption']
    export const isAttributeSelectedOptionInterface = (obj?: { __typename?: any } | null): obj is AttributeSelectedOptionInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributeSelectedOptionInterface"')
      return AttributeSelectedOptionInterface_possibleTypes.includes(obj.__typename)
    }
    


    const AttributeSelectedOptions_possibleTypes: string[] = ['AttributeSelectedOptions']
    export const isAttributeSelectedOptions = (obj?: { __typename?: any } | null): obj is AttributeSelectedOptions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributeSelectedOptions"')
      return AttributeSelectedOptions_possibleTypes.includes(obj.__typename)
    }
    


    const AttributesFormOutput_possibleTypes: string[] = ['AttributesFormOutput']
    export const isAttributesFormOutput = (obj?: { __typename?: any } | null): obj is AttributesFormOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributesFormOutput"')
      return AttributesFormOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AttributesMetadataOutput_possibleTypes: string[] = ['AttributesMetadataOutput']
    export const isAttributesMetadataOutput = (obj?: { __typename?: any } | null): obj is AttributesMetadataOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributesMetadataOutput"')
      return AttributesMetadataOutput_possibleTypes.includes(obj.__typename)
    }
    


    const AttributeValue_possibleTypes: string[] = ['AttributeValue']
    export const isAttributeValue = (obj?: { __typename?: any } | null): obj is AttributeValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributeValue"')
      return AttributeValue_possibleTypes.includes(obj.__typename)
    }
    


    const AttributeValueInterface_possibleTypes: string[] = ['AttributeSelectedOptions','AttributeValue']
    export const isAttributeValueInterface = (obj?: { __typename?: any } | null): obj is AttributeValueInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAttributeValueInterface"')
      return AttributeValueInterface_possibleTypes.includes(obj.__typename)
    }
    


    const AvailablePaymentMethod_possibleTypes: string[] = ['AvailablePaymentMethod']
    export const isAvailablePaymentMethod = (obj?: { __typename?: any } | null): obj is AvailablePaymentMethod => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAvailablePaymentMethod"')
      return AvailablePaymentMethod_possibleTypes.includes(obj.__typename)
    }
    


    const AvailableShippingMethod_possibleTypes: string[] = ['AvailableShippingMethod']
    export const isAvailableShippingMethod = (obj?: { __typename?: any } | null): obj is AvailableShippingMethod => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isAvailableShippingMethod"')
      return AvailableShippingMethod_possibleTypes.includes(obj.__typename)
    }
    


    const BillingCartAddress_possibleTypes: string[] = ['BillingCartAddress']
    export const isBillingCartAddress = (obj?: { __typename?: any } | null): obj is BillingCartAddress => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBillingCartAddress"')
      return BillingCartAddress_possibleTypes.includes(obj.__typename)
    }
    


    const Breadcrumb_possibleTypes: string[] = ['Breadcrumb']
    export const isBreadcrumb = (obj?: { __typename?: any } | null): obj is Breadcrumb => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBreadcrumb"')
      return Breadcrumb_possibleTypes.includes(obj.__typename)
    }
    


    const BundleCartItem_possibleTypes: string[] = ['BundleCartItem']
    export const isBundleCartItem = (obj?: { __typename?: any } | null): obj is BundleCartItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBundleCartItem"')
      return BundleCartItem_possibleTypes.includes(obj.__typename)
    }
    


    const BundleCreditMemoItem_possibleTypes: string[] = ['BundleCreditMemoItem']
    export const isBundleCreditMemoItem = (obj?: { __typename?: any } | null): obj is BundleCreditMemoItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBundleCreditMemoItem"')
      return BundleCreditMemoItem_possibleTypes.includes(obj.__typename)
    }
    


    const BundleInvoiceItem_possibleTypes: string[] = ['BundleInvoiceItem']
    export const isBundleInvoiceItem = (obj?: { __typename?: any } | null): obj is BundleInvoiceItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBundleInvoiceItem"')
      return BundleInvoiceItem_possibleTypes.includes(obj.__typename)
    }
    


    const BundleItem_possibleTypes: string[] = ['BundleItem']
    export const isBundleItem = (obj?: { __typename?: any } | null): obj is BundleItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBundleItem"')
      return BundleItem_possibleTypes.includes(obj.__typename)
    }
    


    const BundleItemOption_possibleTypes: string[] = ['BundleItemOption']
    export const isBundleItemOption = (obj?: { __typename?: any } | null): obj is BundleItemOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBundleItemOption"')
      return BundleItemOption_possibleTypes.includes(obj.__typename)
    }
    


    const BundleOrderItem_possibleTypes: string[] = ['BundleOrderItem']
    export const isBundleOrderItem = (obj?: { __typename?: any } | null): obj is BundleOrderItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBundleOrderItem"')
      return BundleOrderItem_possibleTypes.includes(obj.__typename)
    }
    


    const BundleProduct_possibleTypes: string[] = ['BundleProduct']
    export const isBundleProduct = (obj?: { __typename?: any } | null): obj is BundleProduct => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBundleProduct"')
      return BundleProduct_possibleTypes.includes(obj.__typename)
    }
    


    const BundleShipmentItem_possibleTypes: string[] = ['BundleShipmentItem']
    export const isBundleShipmentItem = (obj?: { __typename?: any } | null): obj is BundleShipmentItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBundleShipmentItem"')
      return BundleShipmentItem_possibleTypes.includes(obj.__typename)
    }
    


    const BundleWishlistItem_possibleTypes: string[] = ['BundleWishlistItem']
    export const isBundleWishlistItem = (obj?: { __typename?: any } | null): obj is BundleWishlistItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBundleWishlistItem"')
      return BundleWishlistItem_possibleTypes.includes(obj.__typename)
    }
    


    const ButtonStyles_possibleTypes: string[] = ['ButtonStyles']
    export const isButtonStyles = (obj?: { __typename?: any } | null): obj is ButtonStyles => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isButtonStyles"')
      return ButtonStyles_possibleTypes.includes(obj.__typename)
    }
    


    const CancellationReason_possibleTypes: string[] = ['CancellationReason']
    export const isCancellationReason = (obj?: { __typename?: any } | null): obj is CancellationReason => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCancellationReason"')
      return CancellationReason_possibleTypes.includes(obj.__typename)
    }
    


    const CancelOrderOutput_possibleTypes: string[] = ['CancelOrderOutput']
    export const isCancelOrderOutput = (obj?: { __typename?: any } | null): obj is CancelOrderOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCancelOrderOutput"')
      return CancelOrderOutput_possibleTypes.includes(obj.__typename)
    }
    


    const Card_possibleTypes: string[] = ['Card']
    export const isCard = (obj?: { __typename?: any } | null): obj is Card => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCard"')
      return Card_possibleTypes.includes(obj.__typename)
    }
    


    const CardBin_possibleTypes: string[] = ['CardBin']
    export const isCardBin = (obj?: { __typename?: any } | null): obj is CardBin => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCardBin"')
      return CardBin_possibleTypes.includes(obj.__typename)
    }
    


    const CardPaymentSourceOutput_possibleTypes: string[] = ['CardPaymentSourceOutput']
    export const isCardPaymentSourceOutput = (obj?: { __typename?: any } | null): obj is CardPaymentSourceOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCardPaymentSourceOutput"')
      return CardPaymentSourceOutput_possibleTypes.includes(obj.__typename)
    }
    


    const Cart_possibleTypes: string[] = ['Cart']
    export const isCart = (obj?: { __typename?: any } | null): obj is Cart => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCart"')
      return Cart_possibleTypes.includes(obj.__typename)
    }
    


    const CartAddressCountry_possibleTypes: string[] = ['CartAddressCountry']
    export const isCartAddressCountry = (obj?: { __typename?: any } | null): obj is CartAddressCountry => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartAddressCountry"')
      return CartAddressCountry_possibleTypes.includes(obj.__typename)
    }
    


    const CartAddressInterface_possibleTypes: string[] = ['BillingCartAddress','ShippingCartAddress']
    export const isCartAddressInterface = (obj?: { __typename?: any } | null): obj is CartAddressInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartAddressInterface"')
      return CartAddressInterface_possibleTypes.includes(obj.__typename)
    }
    


    const CartAddressRegion_possibleTypes: string[] = ['CartAddressRegion']
    export const isCartAddressRegion = (obj?: { __typename?: any } | null): obj is CartAddressRegion => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartAddressRegion"')
      return CartAddressRegion_possibleTypes.includes(obj.__typename)
    }
    


    const CartDiscount_possibleTypes: string[] = ['CartDiscount']
    export const isCartDiscount = (obj?: { __typename?: any } | null): obj is CartDiscount => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartDiscount"')
      return CartDiscount_possibleTypes.includes(obj.__typename)
    }
    


    const CartItemError_possibleTypes: string[] = ['CartItemError']
    export const isCartItemError = (obj?: { __typename?: any } | null): obj is CartItemError => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartItemError"')
      return CartItemError_possibleTypes.includes(obj.__typename)
    }
    


    const CartItemInterface_possibleTypes: string[] = ['BundleCartItem','ConfigurableCartItem','DownloadableCartItem','SimpleCartItem','VirtualCartItem']
    export const isCartItemInterface = (obj?: { __typename?: any } | null): obj is CartItemInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartItemInterface"')
      return CartItemInterface_possibleTypes.includes(obj.__typename)
    }
    


    const CartItemPrices_possibleTypes: string[] = ['CartItemPrices']
    export const isCartItemPrices = (obj?: { __typename?: any } | null): obj is CartItemPrices => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartItemPrices"')
      return CartItemPrices_possibleTypes.includes(obj.__typename)
    }
    


    const CartItemQuantity_possibleTypes: string[] = ['CartItemQuantity']
    export const isCartItemQuantity = (obj?: { __typename?: any } | null): obj is CartItemQuantity => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartItemQuantity"')
      return CartItemQuantity_possibleTypes.includes(obj.__typename)
    }
    


    const CartItems_possibleTypes: string[] = ['CartItems']
    export const isCartItems = (obj?: { __typename?: any } | null): obj is CartItems => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartItems"')
      return CartItems_possibleTypes.includes(obj.__typename)
    }
    


    const CartItemSelectedOptionValuePrice_possibleTypes: string[] = ['CartItemSelectedOptionValuePrice']
    export const isCartItemSelectedOptionValuePrice = (obj?: { __typename?: any } | null): obj is CartItemSelectedOptionValuePrice => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartItemSelectedOptionValuePrice"')
      return CartItemSelectedOptionValuePrice_possibleTypes.includes(obj.__typename)
    }
    


    const CartPrices_possibleTypes: string[] = ['CartPrices']
    export const isCartPrices = (obj?: { __typename?: any } | null): obj is CartPrices => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartPrices"')
      return CartPrices_possibleTypes.includes(obj.__typename)
    }
    


    const CartTaxItem_possibleTypes: string[] = ['CartTaxItem']
    export const isCartTaxItem = (obj?: { __typename?: any } | null): obj is CartTaxItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartTaxItem"')
      return CartTaxItem_possibleTypes.includes(obj.__typename)
    }
    


    const CartUserInputError_possibleTypes: string[] = ['CartUserInputError']
    export const isCartUserInputError = (obj?: { __typename?: any } | null): obj is CartUserInputError => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCartUserInputError"')
      return CartUserInputError_possibleTypes.includes(obj.__typename)
    }
    


    const CatalogAttributeMetadata_possibleTypes: string[] = ['CatalogAttributeMetadata']
    export const isCatalogAttributeMetadata = (obj?: { __typename?: any } | null): obj is CatalogAttributeMetadata => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCatalogAttributeMetadata"')
      return CatalogAttributeMetadata_possibleTypes.includes(obj.__typename)
    }
    


    const CategoryInterface_possibleTypes: string[] = ['CategoryTree']
    export const isCategoryInterface = (obj?: { __typename?: any } | null): obj is CategoryInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCategoryInterface"')
      return CategoryInterface_possibleTypes.includes(obj.__typename)
    }
    


    const CategoryProducts_possibleTypes: string[] = ['CategoryProducts']
    export const isCategoryProducts = (obj?: { __typename?: any } | null): obj is CategoryProducts => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCategoryProducts"')
      return CategoryProducts_possibleTypes.includes(obj.__typename)
    }
    


    const CategoryResult_possibleTypes: string[] = ['CategoryResult']
    export const isCategoryResult = (obj?: { __typename?: any } | null): obj is CategoryResult => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCategoryResult"')
      return CategoryResult_possibleTypes.includes(obj.__typename)
    }
    


    const CategoryTree_possibleTypes: string[] = ['CategoryTree']
    export const isCategoryTree = (obj?: { __typename?: any } | null): obj is CategoryTree => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCategoryTree"')
      return CategoryTree_possibleTypes.includes(obj.__typename)
    }
    


    const CheckoutAgreement_possibleTypes: string[] = ['CheckoutAgreement']
    export const isCheckoutAgreement = (obj?: { __typename?: any } | null): obj is CheckoutAgreement => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCheckoutAgreement"')
      return CheckoutAgreement_possibleTypes.includes(obj.__typename)
    }
    


    const CheckoutUserInputError_possibleTypes: string[] = ['CheckoutUserInputError']
    export const isCheckoutUserInputError = (obj?: { __typename?: any } | null): obj is CheckoutUserInputError => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCheckoutUserInputError"')
      return CheckoutUserInputError_possibleTypes.includes(obj.__typename)
    }
    


    const CmsBlock_possibleTypes: string[] = ['CmsBlock']
    export const isCmsBlock = (obj?: { __typename?: any } | null): obj is CmsBlock => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCmsBlock"')
      return CmsBlock_possibleTypes.includes(obj.__typename)
    }
    


    const CmsBlocks_possibleTypes: string[] = ['CmsBlocks']
    export const isCmsBlocks = (obj?: { __typename?: any } | null): obj is CmsBlocks => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCmsBlocks"')
      return CmsBlocks_possibleTypes.includes(obj.__typename)
    }
    


    const CmsPage_possibleTypes: string[] = ['CmsPage']
    export const isCmsPage = (obj?: { __typename?: any } | null): obj is CmsPage => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCmsPage"')
      return CmsPage_possibleTypes.includes(obj.__typename)
    }
    


    const ColorSwatchData_possibleTypes: string[] = ['ColorSwatchData']
    export const isColorSwatchData = (obj?: { __typename?: any } | null): obj is ColorSwatchData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isColorSwatchData"')
      return ColorSwatchData_possibleTypes.includes(obj.__typename)
    }
    


    const ComparableAttribute_possibleTypes: string[] = ['ComparableAttribute']
    export const isComparableAttribute = (obj?: { __typename?: any } | null): obj is ComparableAttribute => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isComparableAttribute"')
      return ComparableAttribute_possibleTypes.includes(obj.__typename)
    }
    


    const ComparableItem_possibleTypes: string[] = ['ComparableItem']
    export const isComparableItem = (obj?: { __typename?: any } | null): obj is ComparableItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isComparableItem"')
      return ComparableItem_possibleTypes.includes(obj.__typename)
    }
    


    const CompareList_possibleTypes: string[] = ['CompareList']
    export const isCompareList = (obj?: { __typename?: any } | null): obj is CompareList => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCompareList"')
      return CompareList_possibleTypes.includes(obj.__typename)
    }
    


    const ComplexTextValue_possibleTypes: string[] = ['ComplexTextValue']
    export const isComplexTextValue = (obj?: { __typename?: any } | null): obj is ComplexTextValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isComplexTextValue"')
      return ComplexTextValue_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableAttributeOption_possibleTypes: string[] = ['ConfigurableAttributeOption']
    export const isConfigurableAttributeOption = (obj?: { __typename?: any } | null): obj is ConfigurableAttributeOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableAttributeOption"')
      return ConfigurableAttributeOption_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableCartItem_possibleTypes: string[] = ['ConfigurableCartItem']
    export const isConfigurableCartItem = (obj?: { __typename?: any } | null): obj is ConfigurableCartItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableCartItem"')
      return ConfigurableCartItem_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableOptionAvailableForSelection_possibleTypes: string[] = ['ConfigurableOptionAvailableForSelection']
    export const isConfigurableOptionAvailableForSelection = (obj?: { __typename?: any } | null): obj is ConfigurableOptionAvailableForSelection => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableOptionAvailableForSelection"')
      return ConfigurableOptionAvailableForSelection_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableProduct_possibleTypes: string[] = ['ConfigurableProduct']
    export const isConfigurableProduct = (obj?: { __typename?: any } | null): obj is ConfigurableProduct => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableProduct"')
      return ConfigurableProduct_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableProductOption_possibleTypes: string[] = ['ConfigurableProductOption']
    export const isConfigurableProductOption = (obj?: { __typename?: any } | null): obj is ConfigurableProductOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableProductOption"')
      return ConfigurableProductOption_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableProductOptions_possibleTypes: string[] = ['ConfigurableProductOptions']
    export const isConfigurableProductOptions = (obj?: { __typename?: any } | null): obj is ConfigurableProductOptions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableProductOptions"')
      return ConfigurableProductOptions_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableProductOptionsSelection_possibleTypes: string[] = ['ConfigurableProductOptionsSelection']
    export const isConfigurableProductOptionsSelection = (obj?: { __typename?: any } | null): obj is ConfigurableProductOptionsSelection => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableProductOptionsSelection"')
      return ConfigurableProductOptionsSelection_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableProductOptionsValues_possibleTypes: string[] = ['ConfigurableProductOptionsValues']
    export const isConfigurableProductOptionsValues = (obj?: { __typename?: any } | null): obj is ConfigurableProductOptionsValues => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableProductOptionsValues"')
      return ConfigurableProductOptionsValues_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableProductOptionValue_possibleTypes: string[] = ['ConfigurableProductOptionValue']
    export const isConfigurableProductOptionValue = (obj?: { __typename?: any } | null): obj is ConfigurableProductOptionValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableProductOptionValue"')
      return ConfigurableProductOptionValue_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableVariant_possibleTypes: string[] = ['ConfigurableVariant']
    export const isConfigurableVariant = (obj?: { __typename?: any } | null): obj is ConfigurableVariant => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableVariant"')
      return ConfigurableVariant_possibleTypes.includes(obj.__typename)
    }
    


    const ConfigurableWishlistItem_possibleTypes: string[] = ['ConfigurableWishlistItem']
    export const isConfigurableWishlistItem = (obj?: { __typename?: any } | null): obj is ConfigurableWishlistItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isConfigurableWishlistItem"')
      return ConfigurableWishlistItem_possibleTypes.includes(obj.__typename)
    }
    


    const ContactUsOutput_possibleTypes: string[] = ['ContactUsOutput']
    export const isContactUsOutput = (obj?: { __typename?: any } | null): obj is ContactUsOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isContactUsOutput"')
      return ContactUsOutput_possibleTypes.includes(obj.__typename)
    }
    


    const Country_possibleTypes: string[] = ['Country']
    export const isCountry = (obj?: { __typename?: any } | null): obj is Country => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCountry"')
      return Country_possibleTypes.includes(obj.__typename)
    }
    


    const CreateGuestCartOutput_possibleTypes: string[] = ['CreateGuestCartOutput']
    export const isCreateGuestCartOutput = (obj?: { __typename?: any } | null): obj is CreateGuestCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreateGuestCartOutput"')
      return CreateGuestCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const CreatePayflowProTokenOutput_possibleTypes: string[] = ['CreatePayflowProTokenOutput']
    export const isCreatePayflowProTokenOutput = (obj?: { __typename?: any } | null): obj is CreatePayflowProTokenOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreatePayflowProTokenOutput"')
      return CreatePayflowProTokenOutput_possibleTypes.includes(obj.__typename)
    }
    


    const CreatePaymentOrderOutput_possibleTypes: string[] = ['CreatePaymentOrderOutput']
    export const isCreatePaymentOrderOutput = (obj?: { __typename?: any } | null): obj is CreatePaymentOrderOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreatePaymentOrderOutput"')
      return CreatePaymentOrderOutput_possibleTypes.includes(obj.__typename)
    }
    


    const CreateProductReviewOutput_possibleTypes: string[] = ['CreateProductReviewOutput']
    export const isCreateProductReviewOutput = (obj?: { __typename?: any } | null): obj is CreateProductReviewOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreateProductReviewOutput"')
      return CreateProductReviewOutput_possibleTypes.includes(obj.__typename)
    }
    


    const CreateVaultCardPaymentTokenOutput_possibleTypes: string[] = ['CreateVaultCardPaymentTokenOutput']
    export const isCreateVaultCardPaymentTokenOutput = (obj?: { __typename?: any } | null): obj is CreateVaultCardPaymentTokenOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreateVaultCardPaymentTokenOutput"')
      return CreateVaultCardPaymentTokenOutput_possibleTypes.includes(obj.__typename)
    }
    


    const CreateVaultCardSetupTokenOutput_possibleTypes: string[] = ['CreateVaultCardSetupTokenOutput']
    export const isCreateVaultCardSetupTokenOutput = (obj?: { __typename?: any } | null): obj is CreateVaultCardSetupTokenOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreateVaultCardSetupTokenOutput"')
      return CreateVaultCardSetupTokenOutput_possibleTypes.includes(obj.__typename)
    }
    


    const CreditMemo_possibleTypes: string[] = ['CreditMemo']
    export const isCreditMemo = (obj?: { __typename?: any } | null): obj is CreditMemo => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreditMemo"')
      return CreditMemo_possibleTypes.includes(obj.__typename)
    }
    


    const CreditMemoItem_possibleTypes: string[] = ['CreditMemoItem']
    export const isCreditMemoItem = (obj?: { __typename?: any } | null): obj is CreditMemoItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreditMemoItem"')
      return CreditMemoItem_possibleTypes.includes(obj.__typename)
    }
    


    const CreditMemoItemInterface_possibleTypes: string[] = ['BundleCreditMemoItem','CreditMemoItem','DownloadableCreditMemoItem']
    export const isCreditMemoItemInterface = (obj?: { __typename?: any } | null): obj is CreditMemoItemInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreditMemoItemInterface"')
      return CreditMemoItemInterface_possibleTypes.includes(obj.__typename)
    }
    


    const CreditMemoTotal_possibleTypes: string[] = ['CreditMemoTotal']
    export const isCreditMemoTotal = (obj?: { __typename?: any } | null): obj is CreditMemoTotal => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCreditMemoTotal"')
      return CreditMemoTotal_possibleTypes.includes(obj.__typename)
    }
    


    const Currency_possibleTypes: string[] = ['Currency']
    export const isCurrency = (obj?: { __typename?: any } | null): obj is Currency => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCurrency"')
      return Currency_possibleTypes.includes(obj.__typename)
    }
    


    const CustomAttributeMetadata_possibleTypes: string[] = ['CustomAttributeMetadata']
    export const isCustomAttributeMetadata = (obj?: { __typename?: any } | null): obj is CustomAttributeMetadata => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomAttributeMetadata"')
      return CustomAttributeMetadata_possibleTypes.includes(obj.__typename)
    }
    


    const CustomAttributeMetadataInterface_possibleTypes: string[] = ['AttributeMetadata','CatalogAttributeMetadata','CustomerAttributeMetadata']
    export const isCustomAttributeMetadataInterface = (obj?: { __typename?: any } | null): obj is CustomAttributeMetadataInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomAttributeMetadataInterface"')
      return CustomAttributeMetadataInterface_possibleTypes.includes(obj.__typename)
    }
    


    const CustomAttributeOptionInterface_possibleTypes: string[] = ['AttributeOptionMetadata']
    export const isCustomAttributeOptionInterface = (obj?: { __typename?: any } | null): obj is CustomAttributeOptionInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomAttributeOptionInterface"')
      return CustomAttributeOptionInterface_possibleTypes.includes(obj.__typename)
    }
    


    const Customer_possibleTypes: string[] = ['Customer']
    export const isCustomer = (obj?: { __typename?: any } | null): obj is Customer => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomer"')
      return Customer_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerAddress_possibleTypes: string[] = ['CustomerAddress']
    export const isCustomerAddress = (obj?: { __typename?: any } | null): obj is CustomerAddress => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerAddress"')
      return CustomerAddress_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerAddressAttribute_possibleTypes: string[] = ['CustomerAddressAttribute']
    export const isCustomerAddressAttribute = (obj?: { __typename?: any } | null): obj is CustomerAddressAttribute => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerAddressAttribute"')
      return CustomerAddressAttribute_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerAddressRegion_possibleTypes: string[] = ['CustomerAddressRegion']
    export const isCustomerAddressRegion = (obj?: { __typename?: any } | null): obj is CustomerAddressRegion => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerAddressRegion"')
      return CustomerAddressRegion_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerAttributeMetadata_possibleTypes: string[] = ['CustomerAttributeMetadata']
    export const isCustomerAttributeMetadata = (obj?: { __typename?: any } | null): obj is CustomerAttributeMetadata => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerAttributeMetadata"')
      return CustomerAttributeMetadata_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerDownloadableProduct_possibleTypes: string[] = ['CustomerDownloadableProduct']
    export const isCustomerDownloadableProduct = (obj?: { __typename?: any } | null): obj is CustomerDownloadableProduct => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerDownloadableProduct"')
      return CustomerDownloadableProduct_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerDownloadableProducts_possibleTypes: string[] = ['CustomerDownloadableProducts']
    export const isCustomerDownloadableProducts = (obj?: { __typename?: any } | null): obj is CustomerDownloadableProducts => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerDownloadableProducts"')
      return CustomerDownloadableProducts_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerOrder_possibleTypes: string[] = ['CustomerOrder']
    export const isCustomerOrder = (obj?: { __typename?: any } | null): obj is CustomerOrder => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerOrder"')
      return CustomerOrder_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerOrders_possibleTypes: string[] = ['CustomerOrders']
    export const isCustomerOrders = (obj?: { __typename?: any } | null): obj is CustomerOrders => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerOrders"')
      return CustomerOrders_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerOutput_possibleTypes: string[] = ['CustomerOutput']
    export const isCustomerOutput = (obj?: { __typename?: any } | null): obj is CustomerOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerOutput"')
      return CustomerOutput_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerPaymentTokens_possibleTypes: string[] = ['CustomerPaymentTokens']
    export const isCustomerPaymentTokens = (obj?: { __typename?: any } | null): obj is CustomerPaymentTokens => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerPaymentTokens"')
      return CustomerPaymentTokens_possibleTypes.includes(obj.__typename)
    }
    


    const CustomerToken_possibleTypes: string[] = ['CustomerToken']
    export const isCustomerToken = (obj?: { __typename?: any } | null): obj is CustomerToken => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomerToken"')
      return CustomerToken_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableAreaOption_possibleTypes: string[] = ['CustomizableAreaOption']
    export const isCustomizableAreaOption = (obj?: { __typename?: any } | null): obj is CustomizableAreaOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableAreaOption"')
      return CustomizableAreaOption_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableAreaValue_possibleTypes: string[] = ['CustomizableAreaValue']
    export const isCustomizableAreaValue = (obj?: { __typename?: any } | null): obj is CustomizableAreaValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableAreaValue"')
      return CustomizableAreaValue_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableCheckboxOption_possibleTypes: string[] = ['CustomizableCheckboxOption']
    export const isCustomizableCheckboxOption = (obj?: { __typename?: any } | null): obj is CustomizableCheckboxOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableCheckboxOption"')
      return CustomizableCheckboxOption_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableCheckboxValue_possibleTypes: string[] = ['CustomizableCheckboxValue']
    export const isCustomizableCheckboxValue = (obj?: { __typename?: any } | null): obj is CustomizableCheckboxValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableCheckboxValue"')
      return CustomizableCheckboxValue_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableDateOption_possibleTypes: string[] = ['CustomizableDateOption']
    export const isCustomizableDateOption = (obj?: { __typename?: any } | null): obj is CustomizableDateOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableDateOption"')
      return CustomizableDateOption_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableDateValue_possibleTypes: string[] = ['CustomizableDateValue']
    export const isCustomizableDateValue = (obj?: { __typename?: any } | null): obj is CustomizableDateValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableDateValue"')
      return CustomizableDateValue_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableDropDownOption_possibleTypes: string[] = ['CustomizableDropDownOption']
    export const isCustomizableDropDownOption = (obj?: { __typename?: any } | null): obj is CustomizableDropDownOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableDropDownOption"')
      return CustomizableDropDownOption_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableDropDownValue_possibleTypes: string[] = ['CustomizableDropDownValue']
    export const isCustomizableDropDownValue = (obj?: { __typename?: any } | null): obj is CustomizableDropDownValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableDropDownValue"')
      return CustomizableDropDownValue_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableFieldOption_possibleTypes: string[] = ['CustomizableFieldOption']
    export const isCustomizableFieldOption = (obj?: { __typename?: any } | null): obj is CustomizableFieldOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableFieldOption"')
      return CustomizableFieldOption_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableFieldValue_possibleTypes: string[] = ['CustomizableFieldValue']
    export const isCustomizableFieldValue = (obj?: { __typename?: any } | null): obj is CustomizableFieldValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableFieldValue"')
      return CustomizableFieldValue_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableFileOption_possibleTypes: string[] = ['CustomizableFileOption']
    export const isCustomizableFileOption = (obj?: { __typename?: any } | null): obj is CustomizableFileOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableFileOption"')
      return CustomizableFileOption_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableFileValue_possibleTypes: string[] = ['CustomizableFileValue']
    export const isCustomizableFileValue = (obj?: { __typename?: any } | null): obj is CustomizableFileValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableFileValue"')
      return CustomizableFileValue_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableMultipleOption_possibleTypes: string[] = ['CustomizableMultipleOption']
    export const isCustomizableMultipleOption = (obj?: { __typename?: any } | null): obj is CustomizableMultipleOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableMultipleOption"')
      return CustomizableMultipleOption_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableMultipleValue_possibleTypes: string[] = ['CustomizableMultipleValue']
    export const isCustomizableMultipleValue = (obj?: { __typename?: any } | null): obj is CustomizableMultipleValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableMultipleValue"')
      return CustomizableMultipleValue_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableOptionInterface_possibleTypes: string[] = ['CustomizableAreaOption','CustomizableCheckboxOption','CustomizableDateOption','CustomizableDropDownOption','CustomizableFieldOption','CustomizableFileOption','CustomizableMultipleOption','CustomizableRadioOption']
    export const isCustomizableOptionInterface = (obj?: { __typename?: any } | null): obj is CustomizableOptionInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableOptionInterface"')
      return CustomizableOptionInterface_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableProductInterface_possibleTypes: string[] = ['BundleProduct','ConfigurableProduct','DownloadableProduct','SimpleProduct','VirtualProduct']
    export const isCustomizableProductInterface = (obj?: { __typename?: any } | null): obj is CustomizableProductInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableProductInterface"')
      return CustomizableProductInterface_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableRadioOption_possibleTypes: string[] = ['CustomizableRadioOption']
    export const isCustomizableRadioOption = (obj?: { __typename?: any } | null): obj is CustomizableRadioOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableRadioOption"')
      return CustomizableRadioOption_possibleTypes.includes(obj.__typename)
    }
    


    const CustomizableRadioValue_possibleTypes: string[] = ['CustomizableRadioValue']
    export const isCustomizableRadioValue = (obj?: { __typename?: any } | null): obj is CustomizableRadioValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCustomizableRadioValue"')
      return CustomizableRadioValue_possibleTypes.includes(obj.__typename)
    }
    


    const DeleteCompareListOutput_possibleTypes: string[] = ['DeleteCompareListOutput']
    export const isDeleteCompareListOutput = (obj?: { __typename?: any } | null): obj is DeleteCompareListOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDeleteCompareListOutput"')
      return DeleteCompareListOutput_possibleTypes.includes(obj.__typename)
    }
    


    const DeletePaymentTokenOutput_possibleTypes: string[] = ['DeletePaymentTokenOutput']
    export const isDeletePaymentTokenOutput = (obj?: { __typename?: any } | null): obj is DeletePaymentTokenOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDeletePaymentTokenOutput"')
      return DeletePaymentTokenOutput_possibleTypes.includes(obj.__typename)
    }
    


    const Discount_possibleTypes: string[] = ['Discount']
    export const isDiscount = (obj?: { __typename?: any } | null): obj is Discount => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDiscount"')
      return Discount_possibleTypes.includes(obj.__typename)
    }
    


    const DownloadableCartItem_possibleTypes: string[] = ['DownloadableCartItem']
    export const isDownloadableCartItem = (obj?: { __typename?: any } | null): obj is DownloadableCartItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDownloadableCartItem"')
      return DownloadableCartItem_possibleTypes.includes(obj.__typename)
    }
    


    const DownloadableCreditMemoItem_possibleTypes: string[] = ['DownloadableCreditMemoItem']
    export const isDownloadableCreditMemoItem = (obj?: { __typename?: any } | null): obj is DownloadableCreditMemoItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDownloadableCreditMemoItem"')
      return DownloadableCreditMemoItem_possibleTypes.includes(obj.__typename)
    }
    


    const DownloadableInvoiceItem_possibleTypes: string[] = ['DownloadableInvoiceItem']
    export const isDownloadableInvoiceItem = (obj?: { __typename?: any } | null): obj is DownloadableInvoiceItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDownloadableInvoiceItem"')
      return DownloadableInvoiceItem_possibleTypes.includes(obj.__typename)
    }
    


    const DownloadableItemsLinks_possibleTypes: string[] = ['DownloadableItemsLinks']
    export const isDownloadableItemsLinks = (obj?: { __typename?: any } | null): obj is DownloadableItemsLinks => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDownloadableItemsLinks"')
      return DownloadableItemsLinks_possibleTypes.includes(obj.__typename)
    }
    


    const DownloadableOrderItem_possibleTypes: string[] = ['DownloadableOrderItem']
    export const isDownloadableOrderItem = (obj?: { __typename?: any } | null): obj is DownloadableOrderItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDownloadableOrderItem"')
      return DownloadableOrderItem_possibleTypes.includes(obj.__typename)
    }
    


    const DownloadableProduct_possibleTypes: string[] = ['DownloadableProduct']
    export const isDownloadableProduct = (obj?: { __typename?: any } | null): obj is DownloadableProduct => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDownloadableProduct"')
      return DownloadableProduct_possibleTypes.includes(obj.__typename)
    }
    


    const DownloadableProductLinks_possibleTypes: string[] = ['DownloadableProductLinks']
    export const isDownloadableProductLinks = (obj?: { __typename?: any } | null): obj is DownloadableProductLinks => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDownloadableProductLinks"')
      return DownloadableProductLinks_possibleTypes.includes(obj.__typename)
    }
    


    const DownloadableProductSamples_possibleTypes: string[] = ['DownloadableProductSamples']
    export const isDownloadableProductSamples = (obj?: { __typename?: any } | null): obj is DownloadableProductSamples => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDownloadableProductSamples"')
      return DownloadableProductSamples_possibleTypes.includes(obj.__typename)
    }
    


    const DownloadableWishlistItem_possibleTypes: string[] = ['DownloadableWishlistItem']
    export const isDownloadableWishlistItem = (obj?: { __typename?: any } | null): obj is DownloadableWishlistItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDownloadableWishlistItem"')
      return DownloadableWishlistItem_possibleTypes.includes(obj.__typename)
    }
    


    const EntityUrl_possibleTypes: string[] = ['EntityUrl']
    export const isEntityUrl = (obj?: { __typename?: any } | null): obj is EntityUrl => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isEntityUrl"')
      return EntityUrl_possibleTypes.includes(obj.__typename)
    }
    


    const ErrorInterface_possibleTypes: string[] = ['InternalError','NoSuchEntityUidError']
    export const isErrorInterface = (obj?: { __typename?: any } | null): obj is ErrorInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isErrorInterface"')
      return ErrorInterface_possibleTypes.includes(obj.__typename)
    }
    


    const EstimateTotalsOutput_possibleTypes: string[] = ['EstimateTotalsOutput']
    export const isEstimateTotalsOutput = (obj?: { __typename?: any } | null): obj is EstimateTotalsOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isEstimateTotalsOutput"')
      return EstimateTotalsOutput_possibleTypes.includes(obj.__typename)
    }
    


    const ExchangeRate_possibleTypes: string[] = ['ExchangeRate']
    export const isExchangeRate = (obj?: { __typename?: any } | null): obj is ExchangeRate => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isExchangeRate"')
      return ExchangeRate_possibleTypes.includes(obj.__typename)
    }
    


    const FastlaneConfig_possibleTypes: string[] = ['FastlaneConfig']
    export const isFastlaneConfig = (obj?: { __typename?: any } | null): obj is FastlaneConfig => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isFastlaneConfig"')
      return FastlaneConfig_possibleTypes.includes(obj.__typename)
    }
    


    const GenerateCustomerTokenAsAdminOutput_possibleTypes: string[] = ['GenerateCustomerTokenAsAdminOutput']
    export const isGenerateCustomerTokenAsAdminOutput = (obj?: { __typename?: any } | null): obj is GenerateCustomerTokenAsAdminOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isGenerateCustomerTokenAsAdminOutput"')
      return GenerateCustomerTokenAsAdminOutput_possibleTypes.includes(obj.__typename)
    }
    


    const GetPaymentSDKOutput_possibleTypes: string[] = ['GetPaymentSDKOutput']
    export const isGetPaymentSDKOutput = (obj?: { __typename?: any } | null): obj is GetPaymentSDKOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isGetPaymentSDKOutput"')
      return GetPaymentSDKOutput_possibleTypes.includes(obj.__typename)
    }
    


    const GiftMessage_possibleTypes: string[] = ['GiftMessage']
    export const isGiftMessage = (obj?: { __typename?: any } | null): obj is GiftMessage => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isGiftMessage"')
      return GiftMessage_possibleTypes.includes(obj.__typename)
    }
    


    const GooglePayButtonStyles_possibleTypes: string[] = ['GooglePayButtonStyles']
    export const isGooglePayButtonStyles = (obj?: { __typename?: any } | null): obj is GooglePayButtonStyles => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isGooglePayButtonStyles"')
      return GooglePayButtonStyles_possibleTypes.includes(obj.__typename)
    }
    


    const GooglePayConfig_possibleTypes: string[] = ['GooglePayConfig']
    export const isGooglePayConfig = (obj?: { __typename?: any } | null): obj is GooglePayConfig => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isGooglePayConfig"')
      return GooglePayConfig_possibleTypes.includes(obj.__typename)
    }
    


    const GroupedProduct_possibleTypes: string[] = ['GroupedProduct']
    export const isGroupedProduct = (obj?: { __typename?: any } | null): obj is GroupedProduct => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isGroupedProduct"')
      return GroupedProduct_possibleTypes.includes(obj.__typename)
    }
    


    const GroupedProductItem_possibleTypes: string[] = ['GroupedProductItem']
    export const isGroupedProductItem = (obj?: { __typename?: any } | null): obj is GroupedProductItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isGroupedProductItem"')
      return GroupedProductItem_possibleTypes.includes(obj.__typename)
    }
    


    const GroupedProductWishlistItem_possibleTypes: string[] = ['GroupedProductWishlistItem']
    export const isGroupedProductWishlistItem = (obj?: { __typename?: any } | null): obj is GroupedProductWishlistItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isGroupedProductWishlistItem"')
      return GroupedProductWishlistItem_possibleTypes.includes(obj.__typename)
    }
    


    const HostedFieldsConfig_possibleTypes: string[] = ['HostedFieldsConfig']
    export const isHostedFieldsConfig = (obj?: { __typename?: any } | null): obj is HostedFieldsConfig => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isHostedFieldsConfig"')
      return HostedFieldsConfig_possibleTypes.includes(obj.__typename)
    }
    


    const HostedProUrl_possibleTypes: string[] = ['HostedProUrl']
    export const isHostedProUrl = (obj?: { __typename?: any } | null): obj is HostedProUrl => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isHostedProUrl"')
      return HostedProUrl_possibleTypes.includes(obj.__typename)
    }
    


    const HttpQueryParameter_possibleTypes: string[] = ['HttpQueryParameter']
    export const isHttpQueryParameter = (obj?: { __typename?: any } | null): obj is HttpQueryParameter => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isHttpQueryParameter"')
      return HttpQueryParameter_possibleTypes.includes(obj.__typename)
    }
    


    const ImageSwatchData_possibleTypes: string[] = ['ImageSwatchData']
    export const isImageSwatchData = (obj?: { __typename?: any } | null): obj is ImageSwatchData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isImageSwatchData"')
      return ImageSwatchData_possibleTypes.includes(obj.__typename)
    }
    


    const InternalError_possibleTypes: string[] = ['InternalError']
    export const isInternalError = (obj?: { __typename?: any } | null): obj is InternalError => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isInternalError"')
      return InternalError_possibleTypes.includes(obj.__typename)
    }
    


    const Invoice_possibleTypes: string[] = ['Invoice']
    export const isInvoice = (obj?: { __typename?: any } | null): obj is Invoice => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isInvoice"')
      return Invoice_possibleTypes.includes(obj.__typename)
    }
    


    const InvoiceItem_possibleTypes: string[] = ['InvoiceItem']
    export const isInvoiceItem = (obj?: { __typename?: any } | null): obj is InvoiceItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isInvoiceItem"')
      return InvoiceItem_possibleTypes.includes(obj.__typename)
    }
    


    const InvoiceItemInterface_possibleTypes: string[] = ['BundleInvoiceItem','DownloadableInvoiceItem','InvoiceItem']
    export const isInvoiceItemInterface = (obj?: { __typename?: any } | null): obj is InvoiceItemInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isInvoiceItemInterface"')
      return InvoiceItemInterface_possibleTypes.includes(obj.__typename)
    }
    


    const InvoiceTotal_possibleTypes: string[] = ['InvoiceTotal']
    export const isInvoiceTotal = (obj?: { __typename?: any } | null): obj is InvoiceTotal => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isInvoiceTotal"')
      return InvoiceTotal_possibleTypes.includes(obj.__typename)
    }
    


    const IsEmailAvailableOutput_possibleTypes: string[] = ['IsEmailAvailableOutput']
    export const isIsEmailAvailableOutput = (obj?: { __typename?: any } | null): obj is IsEmailAvailableOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isIsEmailAvailableOutput"')
      return IsEmailAvailableOutput_possibleTypes.includes(obj.__typename)
    }
    


    const ItemSelectedBundleOption_possibleTypes: string[] = ['ItemSelectedBundleOption']
    export const isItemSelectedBundleOption = (obj?: { __typename?: any } | null): obj is ItemSelectedBundleOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isItemSelectedBundleOption"')
      return ItemSelectedBundleOption_possibleTypes.includes(obj.__typename)
    }
    


    const ItemSelectedBundleOptionValue_possibleTypes: string[] = ['ItemSelectedBundleOptionValue']
    export const isItemSelectedBundleOptionValue = (obj?: { __typename?: any } | null): obj is ItemSelectedBundleOptionValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isItemSelectedBundleOptionValue"')
      return ItemSelectedBundleOptionValue_possibleTypes.includes(obj.__typename)
    }
    


    const KeyValue_possibleTypes: string[] = ['KeyValue']
    export const isKeyValue = (obj?: { __typename?: any } | null): obj is KeyValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isKeyValue"')
      return KeyValue_possibleTypes.includes(obj.__typename)
    }
    


    const LayerFilter_possibleTypes: string[] = ['LayerFilter']
    export const isLayerFilter = (obj?: { __typename?: any } | null): obj is LayerFilter => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isLayerFilter"')
      return LayerFilter_possibleTypes.includes(obj.__typename)
    }
    


    const LayerFilterItem_possibleTypes: string[] = ['LayerFilterItem']
    export const isLayerFilterItem = (obj?: { __typename?: any } | null): obj is LayerFilterItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isLayerFilterItem"')
      return LayerFilterItem_possibleTypes.includes(obj.__typename)
    }
    


    const LayerFilterItemInterface_possibleTypes: string[] = ['LayerFilterItem','SwatchLayerFilterItem']
    export const isLayerFilterItemInterface = (obj?: { __typename?: any } | null): obj is LayerFilterItemInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isLayerFilterItemInterface"')
      return LayerFilterItemInterface_possibleTypes.includes(obj.__typename)
    }
    


    const MediaGalleryEntry_possibleTypes: string[] = ['MediaGalleryEntry']
    export const isMediaGalleryEntry = (obj?: { __typename?: any } | null): obj is MediaGalleryEntry => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMediaGalleryEntry"')
      return MediaGalleryEntry_possibleTypes.includes(obj.__typename)
    }
    


    const MediaGalleryInterface_possibleTypes: string[] = ['ProductImage','ProductVideo']
    export const isMediaGalleryInterface = (obj?: { __typename?: any } | null): obj is MediaGalleryInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMediaGalleryInterface"')
      return MediaGalleryInterface_possibleTypes.includes(obj.__typename)
    }
    


    const MessageStyleLogo_possibleTypes: string[] = ['MessageStyleLogo']
    export const isMessageStyleLogo = (obj?: { __typename?: any } | null): obj is MessageStyleLogo => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMessageStyleLogo"')
      return MessageStyleLogo_possibleTypes.includes(obj.__typename)
    }
    


    const MessageStyles_possibleTypes: string[] = ['MessageStyles']
    export const isMessageStyles = (obj?: { __typename?: any } | null): obj is MessageStyles => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMessageStyles"')
      return MessageStyles_possibleTypes.includes(obj.__typename)
    }
    


    const ModuleConfiguration_possibleTypes: string[] = ['ModuleConfiguration']
    export const isModuleConfiguration = (obj?: { __typename?: any } | null): obj is ModuleConfiguration => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isModuleConfiguration"')
      return ModuleConfiguration_possibleTypes.includes(obj.__typename)
    }
    


    const ModuleOptions_possibleTypes: string[] = ['ModuleOptions']
    export const isModuleOptions = (obj?: { __typename?: any } | null): obj is ModuleOptions => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isModuleOptions"')
      return ModuleOptions_possibleTypes.includes(obj.__typename)
    }
    


    const Money_possibleTypes: string[] = ['Money']
    export const isMoney = (obj?: { __typename?: any } | null): obj is Money => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMoney"')
      return Money_possibleTypes.includes(obj.__typename)
    }
    


    const Mutation_possibleTypes: string[] = ['Mutation']
    export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
      return Mutation_possibleTypes.includes(obj.__typename)
    }
    


    const NoSuchEntityUidError_possibleTypes: string[] = ['NoSuchEntityUidError']
    export const isNoSuchEntityUidError = (obj?: { __typename?: any } | null): obj is NoSuchEntityUidError => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isNoSuchEntityUidError"')
      return NoSuchEntityUidError_possibleTypes.includes(obj.__typename)
    }
    


    const Order_possibleTypes: string[] = ['Order']
    export const isOrder = (obj?: { __typename?: any } | null): obj is Order => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOrder"')
      return Order_possibleTypes.includes(obj.__typename)
    }
    


    const OrderAddress_possibleTypes: string[] = ['OrderAddress']
    export const isOrderAddress = (obj?: { __typename?: any } | null): obj is OrderAddress => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOrderAddress"')
      return OrderAddress_possibleTypes.includes(obj.__typename)
    }
    


    const OrderItem_possibleTypes: string[] = ['OrderItem']
    export const isOrderItem = (obj?: { __typename?: any } | null): obj is OrderItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOrderItem"')
      return OrderItem_possibleTypes.includes(obj.__typename)
    }
    


    const OrderItemInterface_possibleTypes: string[] = ['BundleOrderItem','DownloadableOrderItem','OrderItem']
    export const isOrderItemInterface = (obj?: { __typename?: any } | null): obj is OrderItemInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOrderItemInterface"')
      return OrderItemInterface_possibleTypes.includes(obj.__typename)
    }
    


    const OrderItemOption_possibleTypes: string[] = ['OrderItemOption']
    export const isOrderItemOption = (obj?: { __typename?: any } | null): obj is OrderItemOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOrderItemOption"')
      return OrderItemOption_possibleTypes.includes(obj.__typename)
    }
    


    const OrderPaymentMethod_possibleTypes: string[] = ['OrderPaymentMethod']
    export const isOrderPaymentMethod = (obj?: { __typename?: any } | null): obj is OrderPaymentMethod => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOrderPaymentMethod"')
      return OrderPaymentMethod_possibleTypes.includes(obj.__typename)
    }
    


    const OrderShipment_possibleTypes: string[] = ['OrderShipment']
    export const isOrderShipment = (obj?: { __typename?: any } | null): obj is OrderShipment => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOrderShipment"')
      return OrderShipment_possibleTypes.includes(obj.__typename)
    }
    


    const OrderTotal_possibleTypes: string[] = ['OrderTotal']
    export const isOrderTotal = (obj?: { __typename?: any } | null): obj is OrderTotal => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isOrderTotal"')
      return OrderTotal_possibleTypes.includes(obj.__typename)
    }
    


    const PayflowLinkToken_possibleTypes: string[] = ['PayflowLinkToken']
    export const isPayflowLinkToken = (obj?: { __typename?: any } | null): obj is PayflowLinkToken => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPayflowLinkToken"')
      return PayflowLinkToken_possibleTypes.includes(obj.__typename)
    }
    


    const PayflowProResponseOutput_possibleTypes: string[] = ['PayflowProResponseOutput']
    export const isPayflowProResponseOutput = (obj?: { __typename?: any } | null): obj is PayflowProResponseOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPayflowProResponseOutput"')
      return PayflowProResponseOutput_possibleTypes.includes(obj.__typename)
    }
    


    const PayflowProToken_possibleTypes: string[] = ['PayflowProToken']
    export const isPayflowProToken = (obj?: { __typename?: any } | null): obj is PayflowProToken => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPayflowProToken"')
      return PayflowProToken_possibleTypes.includes(obj.__typename)
    }
    


    const PaymentCommonConfig_possibleTypes: string[] = ['PaymentCommonConfig']
    export const isPaymentCommonConfig = (obj?: { __typename?: any } | null): obj is PaymentCommonConfig => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaymentCommonConfig"')
      return PaymentCommonConfig_possibleTypes.includes(obj.__typename)
    }
    


    const PaymentConfigItem_possibleTypes: string[] = ['ApplePayConfig','FastlaneConfig','GooglePayConfig','HostedFieldsConfig','PaymentCommonConfig','SmartButtonsConfig']
    export const isPaymentConfigItem = (obj?: { __typename?: any } | null): obj is PaymentConfigItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaymentConfigItem"')
      return PaymentConfigItem_possibleTypes.includes(obj.__typename)
    }
    


    const PaymentConfigOutput_possibleTypes: string[] = ['PaymentConfigOutput']
    export const isPaymentConfigOutput = (obj?: { __typename?: any } | null): obj is PaymentConfigOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaymentConfigOutput"')
      return PaymentConfigOutput_possibleTypes.includes(obj.__typename)
    }
    


    const PaymentOrderOutput_possibleTypes: string[] = ['PaymentOrderOutput']
    export const isPaymentOrderOutput = (obj?: { __typename?: any } | null): obj is PaymentOrderOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaymentOrderOutput"')
      return PaymentOrderOutput_possibleTypes.includes(obj.__typename)
    }
    


    const PaymentSDKParamsItem_possibleTypes: string[] = ['PaymentSDKParamsItem']
    export const isPaymentSDKParamsItem = (obj?: { __typename?: any } | null): obj is PaymentSDKParamsItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaymentSDKParamsItem"')
      return PaymentSDKParamsItem_possibleTypes.includes(obj.__typename)
    }
    


    const PaymentSourceDetails_possibleTypes: string[] = ['PaymentSourceDetails']
    export const isPaymentSourceDetails = (obj?: { __typename?: any } | null): obj is PaymentSourceDetails => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaymentSourceDetails"')
      return PaymentSourceDetails_possibleTypes.includes(obj.__typename)
    }
    


    const PaymentSourceOutput_possibleTypes: string[] = ['PaymentSourceOutput']
    export const isPaymentSourceOutput = (obj?: { __typename?: any } | null): obj is PaymentSourceOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaymentSourceOutput"')
      return PaymentSourceOutput_possibleTypes.includes(obj.__typename)
    }
    


    const PaymentToken_possibleTypes: string[] = ['PaymentToken']
    export const isPaymentToken = (obj?: { __typename?: any } | null): obj is PaymentToken => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaymentToken"')
      return PaymentToken_possibleTypes.includes(obj.__typename)
    }
    


    const PaypalExpressToken_possibleTypes: string[] = ['PaypalExpressToken']
    export const isPaypalExpressToken = (obj?: { __typename?: any } | null): obj is PaypalExpressToken => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaypalExpressToken"')
      return PaypalExpressToken_possibleTypes.includes(obj.__typename)
    }
    


    const PaypalExpressTokenOutput_possibleTypes: string[] = ['PaypalExpressTokenOutput']
    export const isPaypalExpressTokenOutput = (obj?: { __typename?: any } | null): obj is PaypalExpressTokenOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaypalExpressTokenOutput"')
      return PaypalExpressTokenOutput_possibleTypes.includes(obj.__typename)
    }
    


    const PaypalExpressUrlList_possibleTypes: string[] = ['PaypalExpressUrlList']
    export const isPaypalExpressUrlList = (obj?: { __typename?: any } | null): obj is PaypalExpressUrlList => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaypalExpressUrlList"')
      return PaypalExpressUrlList_possibleTypes.includes(obj.__typename)
    }
    


    const PhysicalProductInterface_possibleTypes: string[] = ['BundleProduct','ConfigurableProduct','GroupedProduct','SimpleProduct']
    export const isPhysicalProductInterface = (obj?: { __typename?: any } | null): obj is PhysicalProductInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPhysicalProductInterface"')
      return PhysicalProductInterface_possibleTypes.includes(obj.__typename)
    }
    


    const PickupLocation_possibleTypes: string[] = ['PickupLocation']
    export const isPickupLocation = (obj?: { __typename?: any } | null): obj is PickupLocation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPickupLocation"')
      return PickupLocation_possibleTypes.includes(obj.__typename)
    }
    


    const PickupLocations_possibleTypes: string[] = ['PickupLocations']
    export const isPickupLocations = (obj?: { __typename?: any } | null): obj is PickupLocations => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPickupLocations"')
      return PickupLocations_possibleTypes.includes(obj.__typename)
    }
    


    const PlaceOrderError_possibleTypes: string[] = ['PlaceOrderError']
    export const isPlaceOrderError = (obj?: { __typename?: any } | null): obj is PlaceOrderError => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPlaceOrderError"')
      return PlaceOrderError_possibleTypes.includes(obj.__typename)
    }
    


    const PlaceOrderOutput_possibleTypes: string[] = ['PlaceOrderOutput']
    export const isPlaceOrderOutput = (obj?: { __typename?: any } | null): obj is PlaceOrderOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPlaceOrderOutput"')
      return PlaceOrderOutput_possibleTypes.includes(obj.__typename)
    }
    


    const Price_possibleTypes: string[] = ['Price']
    export const isPrice = (obj?: { __typename?: any } | null): obj is Price => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPrice"')
      return Price_possibleTypes.includes(obj.__typename)
    }
    


    const PriceAdjustment_possibleTypes: string[] = ['PriceAdjustment']
    export const isPriceAdjustment = (obj?: { __typename?: any } | null): obj is PriceAdjustment => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPriceAdjustment"')
      return PriceAdjustment_possibleTypes.includes(obj.__typename)
    }
    


    const PriceDetails_possibleTypes: string[] = ['PriceDetails']
    export const isPriceDetails = (obj?: { __typename?: any } | null): obj is PriceDetails => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPriceDetails"')
      return PriceDetails_possibleTypes.includes(obj.__typename)
    }
    


    const PriceRange_possibleTypes: string[] = ['PriceRange']
    export const isPriceRange = (obj?: { __typename?: any } | null): obj is PriceRange => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPriceRange"')
      return PriceRange_possibleTypes.includes(obj.__typename)
    }
    


    const ProductAttribute_possibleTypes: string[] = ['ProductAttribute']
    export const isProductAttribute = (obj?: { __typename?: any } | null): obj is ProductAttribute => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductAttribute"')
      return ProductAttribute_possibleTypes.includes(obj.__typename)
    }
    


    const ProductCustomAttributes_possibleTypes: string[] = ['ProductCustomAttributes']
    export const isProductCustomAttributes = (obj?: { __typename?: any } | null): obj is ProductCustomAttributes => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductCustomAttributes"')
      return ProductCustomAttributes_possibleTypes.includes(obj.__typename)
    }
    


    const ProductDiscount_possibleTypes: string[] = ['ProductDiscount']
    export const isProductDiscount = (obj?: { __typename?: any } | null): obj is ProductDiscount => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductDiscount"')
      return ProductDiscount_possibleTypes.includes(obj.__typename)
    }
    


    const ProductImage_possibleTypes: string[] = ['ProductImage']
    export const isProductImage = (obj?: { __typename?: any } | null): obj is ProductImage => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductImage"')
      return ProductImage_possibleTypes.includes(obj.__typename)
    }
    


    const ProductInterface_possibleTypes: string[] = ['BundleProduct','ConfigurableProduct','DownloadableProduct','GroupedProduct','SimpleProduct','VirtualProduct']
    export const isProductInterface = (obj?: { __typename?: any } | null): obj is ProductInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductInterface"')
      return ProductInterface_possibleTypes.includes(obj.__typename)
    }
    


    const ProductLinks_possibleTypes: string[] = ['ProductLinks']
    export const isProductLinks = (obj?: { __typename?: any } | null): obj is ProductLinks => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductLinks"')
      return ProductLinks_possibleTypes.includes(obj.__typename)
    }
    


    const ProductLinksInterface_possibleTypes: string[] = ['ProductLinks']
    export const isProductLinksInterface = (obj?: { __typename?: any } | null): obj is ProductLinksInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductLinksInterface"')
      return ProductLinksInterface_possibleTypes.includes(obj.__typename)
    }
    


    const ProductMediaGalleryEntriesContent_possibleTypes: string[] = ['ProductMediaGalleryEntriesContent']
    export const isProductMediaGalleryEntriesContent = (obj?: { __typename?: any } | null): obj is ProductMediaGalleryEntriesContent => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductMediaGalleryEntriesContent"')
      return ProductMediaGalleryEntriesContent_possibleTypes.includes(obj.__typename)
    }
    


    const ProductMediaGalleryEntriesVideoContent_possibleTypes: string[] = ['ProductMediaGalleryEntriesVideoContent']
    export const isProductMediaGalleryEntriesVideoContent = (obj?: { __typename?: any } | null): obj is ProductMediaGalleryEntriesVideoContent => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductMediaGalleryEntriesVideoContent"')
      return ProductMediaGalleryEntriesVideoContent_possibleTypes.includes(obj.__typename)
    }
    


    const ProductPrice_possibleTypes: string[] = ['ProductPrice']
    export const isProductPrice = (obj?: { __typename?: any } | null): obj is ProductPrice => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductPrice"')
      return ProductPrice_possibleTypes.includes(obj.__typename)
    }
    


    const ProductPrices_possibleTypes: string[] = ['ProductPrices']
    export const isProductPrices = (obj?: { __typename?: any } | null): obj is ProductPrices => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductPrices"')
      return ProductPrices_possibleTypes.includes(obj.__typename)
    }
    


    const ProductReview_possibleTypes: string[] = ['ProductReview']
    export const isProductReview = (obj?: { __typename?: any } | null): obj is ProductReview => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductReview"')
      return ProductReview_possibleTypes.includes(obj.__typename)
    }
    


    const ProductReviewRating_possibleTypes: string[] = ['ProductReviewRating']
    export const isProductReviewRating = (obj?: { __typename?: any } | null): obj is ProductReviewRating => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductReviewRating"')
      return ProductReviewRating_possibleTypes.includes(obj.__typename)
    }
    


    const ProductReviewRatingMetadata_possibleTypes: string[] = ['ProductReviewRatingMetadata']
    export const isProductReviewRatingMetadata = (obj?: { __typename?: any } | null): obj is ProductReviewRatingMetadata => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductReviewRatingMetadata"')
      return ProductReviewRatingMetadata_possibleTypes.includes(obj.__typename)
    }
    


    const ProductReviewRatingsMetadata_possibleTypes: string[] = ['ProductReviewRatingsMetadata']
    export const isProductReviewRatingsMetadata = (obj?: { __typename?: any } | null): obj is ProductReviewRatingsMetadata => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductReviewRatingsMetadata"')
      return ProductReviewRatingsMetadata_possibleTypes.includes(obj.__typename)
    }
    


    const ProductReviewRatingValueMetadata_possibleTypes: string[] = ['ProductReviewRatingValueMetadata']
    export const isProductReviewRatingValueMetadata = (obj?: { __typename?: any } | null): obj is ProductReviewRatingValueMetadata => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductReviewRatingValueMetadata"')
      return ProductReviewRatingValueMetadata_possibleTypes.includes(obj.__typename)
    }
    


    const ProductReviews_possibleTypes: string[] = ['ProductReviews']
    export const isProductReviews = (obj?: { __typename?: any } | null): obj is ProductReviews => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductReviews"')
      return ProductReviews_possibleTypes.includes(obj.__typename)
    }
    


    const Products_possibleTypes: string[] = ['Products']
    export const isProducts = (obj?: { __typename?: any } | null): obj is Products => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProducts"')
      return Products_possibleTypes.includes(obj.__typename)
    }
    


    const ProductTierPrices_possibleTypes: string[] = ['ProductTierPrices']
    export const isProductTierPrices = (obj?: { __typename?: any } | null): obj is ProductTierPrices => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductTierPrices"')
      return ProductTierPrices_possibleTypes.includes(obj.__typename)
    }
    


    const ProductVideo_possibleTypes: string[] = ['ProductVideo']
    export const isProductVideo = (obj?: { __typename?: any } | null): obj is ProductVideo => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isProductVideo"')
      return ProductVideo_possibleTypes.includes(obj.__typename)
    }
    


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    


    const ReCaptchaConfigurationV3_possibleTypes: string[] = ['ReCaptchaConfigurationV3']
    export const isReCaptchaConfigurationV3 = (obj?: { __typename?: any } | null): obj is ReCaptchaConfigurationV3 => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isReCaptchaConfigurationV3"')
      return ReCaptchaConfigurationV3_possibleTypes.includes(obj.__typename)
    }
    


    const Region_possibleTypes: string[] = ['Region']
    export const isRegion = (obj?: { __typename?: any } | null): obj is Region => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRegion"')
      return Region_possibleTypes.includes(obj.__typename)
    }
    


    const RemoveCouponFromCartOutput_possibleTypes: string[] = ['RemoveCouponFromCartOutput']
    export const isRemoveCouponFromCartOutput = (obj?: { __typename?: any } | null): obj is RemoveCouponFromCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRemoveCouponFromCartOutput"')
      return RemoveCouponFromCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const RemoveItemFromCartOutput_possibleTypes: string[] = ['RemoveItemFromCartOutput']
    export const isRemoveItemFromCartOutput = (obj?: { __typename?: any } | null): obj is RemoveItemFromCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRemoveItemFromCartOutput"')
      return RemoveItemFromCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const RemoveProductsFromWishlistOutput_possibleTypes: string[] = ['RemoveProductsFromWishlistOutput']
    export const isRemoveProductsFromWishlistOutput = (obj?: { __typename?: any } | null): obj is RemoveProductsFromWishlistOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRemoveProductsFromWishlistOutput"')
      return RemoveProductsFromWishlistOutput_possibleTypes.includes(obj.__typename)
    }
    


    const ReorderItemsOutput_possibleTypes: string[] = ['ReorderItemsOutput']
    export const isReorderItemsOutput = (obj?: { __typename?: any } | null): obj is ReorderItemsOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isReorderItemsOutput"')
      return ReorderItemsOutput_possibleTypes.includes(obj.__typename)
    }
    


    const RevokeCustomerTokenOutput_possibleTypes: string[] = ['RevokeCustomerTokenOutput']
    export const isRevokeCustomerTokenOutput = (obj?: { __typename?: any } | null): obj is RevokeCustomerTokenOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRevokeCustomerTokenOutput"')
      return RevokeCustomerTokenOutput_possibleTypes.includes(obj.__typename)
    }
    


    const RoutableInterface_possibleTypes: string[] = ['BundleProduct','CategoryTree','CmsPage','ConfigurableProduct','DownloadableProduct','GroupedProduct','RoutableUrl','SimpleProduct','VirtualProduct']
    export const isRoutableInterface = (obj?: { __typename?: any } | null): obj is RoutableInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRoutableInterface"')
      return RoutableInterface_possibleTypes.includes(obj.__typename)
    }
    


    const RoutableUrl_possibleTypes: string[] = ['RoutableUrl']
    export const isRoutableUrl = (obj?: { __typename?: any } | null): obj is RoutableUrl => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRoutableUrl"')
      return RoutableUrl_possibleTypes.includes(obj.__typename)
    }
    


    const SalesCommentItem_possibleTypes: string[] = ['SalesCommentItem']
    export const isSalesCommentItem = (obj?: { __typename?: any } | null): obj is SalesCommentItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSalesCommentItem"')
      return SalesCommentItem_possibleTypes.includes(obj.__typename)
    }
    


    const SalesItemInterface_possibleTypes: string[] = ['SalesItemInterface']
    export const isSalesItemInterface = (obj?: { __typename?: any } | null): obj is SalesItemInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSalesItemInterface"')
      return SalesItemInterface_possibleTypes.includes(obj.__typename)
    }
    


    const SDKParams_possibleTypes: string[] = ['SDKParams']
    export const isSDKParams = (obj?: { __typename?: any } | null): obj is SDKParams => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSDKParams"')
      return SDKParams_possibleTypes.includes(obj.__typename)
    }
    


    const SearchResultPageInfo_possibleTypes: string[] = ['SearchResultPageInfo']
    export const isSearchResultPageInfo = (obj?: { __typename?: any } | null): obj is SearchResultPageInfo => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchResultPageInfo"')
      return SearchResultPageInfo_possibleTypes.includes(obj.__typename)
    }
    


    const SearchSuggestion_possibleTypes: string[] = ['SearchSuggestion']
    export const isSearchSuggestion = (obj?: { __typename?: any } | null): obj is SearchSuggestion => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchSuggestion"')
      return SearchSuggestion_possibleTypes.includes(obj.__typename)
    }
    


    const SelectedBundleOption_possibleTypes: string[] = ['SelectedBundleOption']
    export const isSelectedBundleOption = (obj?: { __typename?: any } | null): obj is SelectedBundleOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSelectedBundleOption"')
      return SelectedBundleOption_possibleTypes.includes(obj.__typename)
    }
    


    const SelectedBundleOptionValue_possibleTypes: string[] = ['SelectedBundleOptionValue']
    export const isSelectedBundleOptionValue = (obj?: { __typename?: any } | null): obj is SelectedBundleOptionValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSelectedBundleOptionValue"')
      return SelectedBundleOptionValue_possibleTypes.includes(obj.__typename)
    }
    


    const SelectedConfigurableOption_possibleTypes: string[] = ['SelectedConfigurableOption']
    export const isSelectedConfigurableOption = (obj?: { __typename?: any } | null): obj is SelectedConfigurableOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSelectedConfigurableOption"')
      return SelectedConfigurableOption_possibleTypes.includes(obj.__typename)
    }
    


    const SelectedCustomizableOption_possibleTypes: string[] = ['SelectedCustomizableOption']
    export const isSelectedCustomizableOption = (obj?: { __typename?: any } | null): obj is SelectedCustomizableOption => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSelectedCustomizableOption"')
      return SelectedCustomizableOption_possibleTypes.includes(obj.__typename)
    }
    


    const SelectedCustomizableOptionValue_possibleTypes: string[] = ['SelectedCustomizableOptionValue']
    export const isSelectedCustomizableOptionValue = (obj?: { __typename?: any } | null): obj is SelectedCustomizableOptionValue => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSelectedCustomizableOptionValue"')
      return SelectedCustomizableOptionValue_possibleTypes.includes(obj.__typename)
    }
    


    const SelectedPaymentMethod_possibleTypes: string[] = ['SelectedPaymentMethod']
    export const isSelectedPaymentMethod = (obj?: { __typename?: any } | null): obj is SelectedPaymentMethod => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSelectedPaymentMethod"')
      return SelectedPaymentMethod_possibleTypes.includes(obj.__typename)
    }
    


    const SelectedShippingMethod_possibleTypes: string[] = ['SelectedShippingMethod']
    export const isSelectedShippingMethod = (obj?: { __typename?: any } | null): obj is SelectedShippingMethod => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSelectedShippingMethod"')
      return SelectedShippingMethod_possibleTypes.includes(obj.__typename)
    }
    


    const SendEmailToFriendOutput_possibleTypes: string[] = ['SendEmailToFriendOutput']
    export const isSendEmailToFriendOutput = (obj?: { __typename?: any } | null): obj is SendEmailToFriendOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSendEmailToFriendOutput"')
      return SendEmailToFriendOutput_possibleTypes.includes(obj.__typename)
    }
    


    const SendEmailToFriendRecipient_possibleTypes: string[] = ['SendEmailToFriendRecipient']
    export const isSendEmailToFriendRecipient = (obj?: { __typename?: any } | null): obj is SendEmailToFriendRecipient => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSendEmailToFriendRecipient"')
      return SendEmailToFriendRecipient_possibleTypes.includes(obj.__typename)
    }
    


    const SendEmailToFriendSender_possibleTypes: string[] = ['SendEmailToFriendSender']
    export const isSendEmailToFriendSender = (obj?: { __typename?: any } | null): obj is SendEmailToFriendSender => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSendEmailToFriendSender"')
      return SendEmailToFriendSender_possibleTypes.includes(obj.__typename)
    }
    


    const SendFriendConfiguration_possibleTypes: string[] = ['SendFriendConfiguration']
    export const isSendFriendConfiguration = (obj?: { __typename?: any } | null): obj is SendFriendConfiguration => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSendFriendConfiguration"')
      return SendFriendConfiguration_possibleTypes.includes(obj.__typename)
    }
    


    const SetBillingAddressOnCartOutput_possibleTypes: string[] = ['SetBillingAddressOnCartOutput']
    export const isSetBillingAddressOnCartOutput = (obj?: { __typename?: any } | null): obj is SetBillingAddressOnCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSetBillingAddressOnCartOutput"')
      return SetBillingAddressOnCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const SetCartAsInactiveOutput_possibleTypes: string[] = ['SetCartAsInactiveOutput']
    export const isSetCartAsInactiveOutput = (obj?: { __typename?: any } | null): obj is SetCartAsInactiveOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSetCartAsInactiveOutput"')
      return SetCartAsInactiveOutput_possibleTypes.includes(obj.__typename)
    }
    


    const SetGuestEmailOnCartOutput_possibleTypes: string[] = ['SetGuestEmailOnCartOutput']
    export const isSetGuestEmailOnCartOutput = (obj?: { __typename?: any } | null): obj is SetGuestEmailOnCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSetGuestEmailOnCartOutput"')
      return SetGuestEmailOnCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const SetPaymentMethodOnCartOutput_possibleTypes: string[] = ['SetPaymentMethodOnCartOutput']
    export const isSetPaymentMethodOnCartOutput = (obj?: { __typename?: any } | null): obj is SetPaymentMethodOnCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSetPaymentMethodOnCartOutput"')
      return SetPaymentMethodOnCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const SetShippingAddressesOnCartOutput_possibleTypes: string[] = ['SetShippingAddressesOnCartOutput']
    export const isSetShippingAddressesOnCartOutput = (obj?: { __typename?: any } | null): obj is SetShippingAddressesOnCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSetShippingAddressesOnCartOutput"')
      return SetShippingAddressesOnCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const SetShippingMethodsOnCartOutput_possibleTypes: string[] = ['SetShippingMethodsOnCartOutput']
    export const isSetShippingMethodsOnCartOutput = (obj?: { __typename?: any } | null): obj is SetShippingMethodsOnCartOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSetShippingMethodsOnCartOutput"')
      return SetShippingMethodsOnCartOutput_possibleTypes.includes(obj.__typename)
    }
    


    const ShipmentItem_possibleTypes: string[] = ['ShipmentItem']
    export const isShipmentItem = (obj?: { __typename?: any } | null): obj is ShipmentItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isShipmentItem"')
      return ShipmentItem_possibleTypes.includes(obj.__typename)
    }
    


    const ShipmentItemInterface_possibleTypes: string[] = ['BundleShipmentItem','ShipmentItem']
    export const isShipmentItemInterface = (obj?: { __typename?: any } | null): obj is ShipmentItemInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isShipmentItemInterface"')
      return ShipmentItemInterface_possibleTypes.includes(obj.__typename)
    }
    


    const ShipmentTracking_possibleTypes: string[] = ['ShipmentTracking']
    export const isShipmentTracking = (obj?: { __typename?: any } | null): obj is ShipmentTracking => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isShipmentTracking"')
      return ShipmentTracking_possibleTypes.includes(obj.__typename)
    }
    


    const ShippingCartAddress_possibleTypes: string[] = ['ShippingCartAddress']
    export const isShippingCartAddress = (obj?: { __typename?: any } | null): obj is ShippingCartAddress => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isShippingCartAddress"')
      return ShippingCartAddress_possibleTypes.includes(obj.__typename)
    }
    


    const ShippingDiscount_possibleTypes: string[] = ['ShippingDiscount']
    export const isShippingDiscount = (obj?: { __typename?: any } | null): obj is ShippingDiscount => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isShippingDiscount"')
      return ShippingDiscount_possibleTypes.includes(obj.__typename)
    }
    


    const ShippingHandling_possibleTypes: string[] = ['ShippingHandling']
    export const isShippingHandling = (obj?: { __typename?: any } | null): obj is ShippingHandling => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isShippingHandling"')
      return ShippingHandling_possibleTypes.includes(obj.__typename)
    }
    


    const SimpleCartItem_possibleTypes: string[] = ['SimpleCartItem']
    export const isSimpleCartItem = (obj?: { __typename?: any } | null): obj is SimpleCartItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSimpleCartItem"')
      return SimpleCartItem_possibleTypes.includes(obj.__typename)
    }
    


    const SimpleProduct_possibleTypes: string[] = ['SimpleProduct']
    export const isSimpleProduct = (obj?: { __typename?: any } | null): obj is SimpleProduct => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSimpleProduct"')
      return SimpleProduct_possibleTypes.includes(obj.__typename)
    }
    


    const SimpleWishlistItem_possibleTypes: string[] = ['SimpleWishlistItem']
    export const isSimpleWishlistItem = (obj?: { __typename?: any } | null): obj is SimpleWishlistItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSimpleWishlistItem"')
      return SimpleWishlistItem_possibleTypes.includes(obj.__typename)
    }
    


    const SmartButtonsConfig_possibleTypes: string[] = ['SmartButtonsConfig']
    export const isSmartButtonsConfig = (obj?: { __typename?: any } | null): obj is SmartButtonsConfig => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSmartButtonsConfig"')
      return SmartButtonsConfig_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenu_possibleTypes: string[] = ['SnowdogMenu']
    export const isSnowdogMenu = (obj?: { __typename?: any } | null): obj is SnowdogMenu => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenu"')
      return SnowdogMenu_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenuCmsPageNode_possibleTypes: string[] = ['SnowdogMenuCmsPageNode']
    export const isSnowdogMenuCmsPageNode = (obj?: { __typename?: any } | null): obj is SnowdogMenuCmsPageNode => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenuCmsPageNode"')
      return SnowdogMenuCmsPageNode_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenuCustomUrlNode_possibleTypes: string[] = ['SnowdogMenuCustomUrlNode']
    export const isSnowdogMenuCustomUrlNode = (obj?: { __typename?: any } | null): obj is SnowdogMenuCustomUrlNode => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenuCustomUrlNode"')
      return SnowdogMenuCustomUrlNode_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenuCustomUrlNodeInterface_possibleTypes: string[] = ['SnowdogMenuCustomUrlNode']
    export const isSnowdogMenuCustomUrlNodeInterface = (obj?: { __typename?: any } | null): obj is SnowdogMenuCustomUrlNodeInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenuCustomUrlNodeInterface"')
      return SnowdogMenuCustomUrlNodeInterface_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenuNode_possibleTypes: string[] = ['SnowdogMenuNode']
    export const isSnowdogMenuNode = (obj?: { __typename?: any } | null): obj is SnowdogMenuNode => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenuNode"')
      return SnowdogMenuNode_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenuNodeContentFieldInterface_possibleTypes: string[] = ['SnowdogMenuCmsPageNode','SnowdogMenuCustomUrlNode','SnowdogMenuNode']
    export const isSnowdogMenuNodeContentFieldInterface = (obj?: { __typename?: any } | null): obj is SnowdogMenuNodeContentFieldInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenuNodeContentFieldInterface"')
      return SnowdogMenuNodeContentFieldInterface_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenuNodeImageFieldInterface_possibleTypes: string[] = ['SnowdogMenuCustomUrlNode','SnowdogMenuNode']
    export const isSnowdogMenuNodeImageFieldInterface = (obj?: { __typename?: any } | null): obj is SnowdogMenuNodeImageFieldInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenuNodeImageFieldInterface"')
      return SnowdogMenuNodeImageFieldInterface_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenuNodeInterface_possibleTypes: string[] = ['SnowdogMenuCmsPageNode','SnowdogMenuCustomUrlNode','SnowdogMenuNode','SnowdogMenuWrapperNode']
    export const isSnowdogMenuNodeInterface = (obj?: { __typename?: any } | null): obj is SnowdogMenuNodeInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenuNodeInterface"')
      return SnowdogMenuNodeInterface_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenuNodes_possibleTypes: string[] = ['SnowdogMenuNodes']
    export const isSnowdogMenuNodes = (obj?: { __typename?: any } | null): obj is SnowdogMenuNodes => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenuNodes"')
      return SnowdogMenuNodes_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenus_possibleTypes: string[] = ['SnowdogMenus']
    export const isSnowdogMenus = (obj?: { __typename?: any } | null): obj is SnowdogMenus => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenus"')
      return SnowdogMenus_possibleTypes.includes(obj.__typename)
    }
    


    const SnowdogMenuWrapperNode_possibleTypes: string[] = ['SnowdogMenuWrapperNode']
    export const isSnowdogMenuWrapperNode = (obj?: { __typename?: any } | null): obj is SnowdogMenuWrapperNode => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSnowdogMenuWrapperNode"')
      return SnowdogMenuWrapperNode_possibleTypes.includes(obj.__typename)
    }
    


    const SortField_possibleTypes: string[] = ['SortField']
    export const isSortField = (obj?: { __typename?: any } | null): obj is SortField => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSortField"')
      return SortField_possibleTypes.includes(obj.__typename)
    }
    


    const SortFields_possibleTypes: string[] = ['SortFields']
    export const isSortFields = (obj?: { __typename?: any } | null): obj is SortFields => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSortFields"')
      return SortFields_possibleTypes.includes(obj.__typename)
    }
    


    const StoreConfig_possibleTypes: string[] = ['StoreConfig']
    export const isStoreConfig = (obj?: { __typename?: any } | null): obj is StoreConfig => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isStoreConfig"')
      return StoreConfig_possibleTypes.includes(obj.__typename)
    }
    


    const StorefrontProperties_possibleTypes: string[] = ['StorefrontProperties']
    export const isStorefrontProperties = (obj?: { __typename?: any } | null): obj is StorefrontProperties => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isStorefrontProperties"')
      return StorefrontProperties_possibleTypes.includes(obj.__typename)
    }
    


    const StripePaymentMethod_possibleTypes: string[] = ['StripePaymentMethod']
    export const isStripePaymentMethod = (obj?: { __typename?: any } | null): obj is StripePaymentMethod => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isStripePaymentMethod"')
      return StripePaymentMethod_possibleTypes.includes(obj.__typename)
    }
    


    const SubscribeEmailToNewsletterOutput_possibleTypes: string[] = ['SubscribeEmailToNewsletterOutput']
    export const isSubscribeEmailToNewsletterOutput = (obj?: { __typename?: any } | null): obj is SubscribeEmailToNewsletterOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSubscribeEmailToNewsletterOutput"')
      return SubscribeEmailToNewsletterOutput_possibleTypes.includes(obj.__typename)
    }
    


    const SwatchData_possibleTypes: string[] = ['SwatchData']
    export const isSwatchData = (obj?: { __typename?: any } | null): obj is SwatchData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSwatchData"')
      return SwatchData_possibleTypes.includes(obj.__typename)
    }
    


    const SwatchDataInterface_possibleTypes: string[] = ['ColorSwatchData','ImageSwatchData','TextSwatchData']
    export const isSwatchDataInterface = (obj?: { __typename?: any } | null): obj is SwatchDataInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSwatchDataInterface"')
      return SwatchDataInterface_possibleTypes.includes(obj.__typename)
    }
    


    const SwatchLayerFilterItem_possibleTypes: string[] = ['SwatchLayerFilterItem']
    export const isSwatchLayerFilterItem = (obj?: { __typename?: any } | null): obj is SwatchLayerFilterItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSwatchLayerFilterItem"')
      return SwatchLayerFilterItem_possibleTypes.includes(obj.__typename)
    }
    


    const SwatchLayerFilterItemInterface_possibleTypes: string[] = ['SwatchLayerFilterItem']
    export const isSwatchLayerFilterItemInterface = (obj?: { __typename?: any } | null): obj is SwatchLayerFilterItemInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSwatchLayerFilterItemInterface"')
      return SwatchLayerFilterItemInterface_possibleTypes.includes(obj.__typename)
    }
    


    const TaxItem_possibleTypes: string[] = ['TaxItem']
    export const isTaxItem = (obj?: { __typename?: any } | null): obj is TaxItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isTaxItem"')
      return TaxItem_possibleTypes.includes(obj.__typename)
    }
    


    const TextSwatchData_possibleTypes: string[] = ['TextSwatchData']
    export const isTextSwatchData = (obj?: { __typename?: any } | null): obj is TextSwatchData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isTextSwatchData"')
      return TextSwatchData_possibleTypes.includes(obj.__typename)
    }
    


    const TierPrice_possibleTypes: string[] = ['TierPrice']
    export const isTierPrice = (obj?: { __typename?: any } | null): obj is TierPrice => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isTierPrice"')
      return TierPrice_possibleTypes.includes(obj.__typename)
    }
    


    const UpdateCartItemsOutput_possibleTypes: string[] = ['UpdateCartItemsOutput']
    export const isUpdateCartItemsOutput = (obj?: { __typename?: any } | null): obj is UpdateCartItemsOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUpdateCartItemsOutput"')
      return UpdateCartItemsOutput_possibleTypes.includes(obj.__typename)
    }
    


    const UpdateProductsInWishlistOutput_possibleTypes: string[] = ['UpdateProductsInWishlistOutput']
    export const isUpdateProductsInWishlistOutput = (obj?: { __typename?: any } | null): obj is UpdateProductsInWishlistOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUpdateProductsInWishlistOutput"')
      return UpdateProductsInWishlistOutput_possibleTypes.includes(obj.__typename)
    }
    


    const UrlRewrite_possibleTypes: string[] = ['UrlRewrite']
    export const isUrlRewrite = (obj?: { __typename?: any } | null): obj is UrlRewrite => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUrlRewrite"')
      return UrlRewrite_possibleTypes.includes(obj.__typename)
    }
    


    const ValidationRule_possibleTypes: string[] = ['ValidationRule']
    export const isValidationRule = (obj?: { __typename?: any } | null): obj is ValidationRule => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isValidationRule"')
      return ValidationRule_possibleTypes.includes(obj.__typename)
    }
    


    const VaultConfigOutput_possibleTypes: string[] = ['VaultConfigOutput']
    export const isVaultConfigOutput = (obj?: { __typename?: any } | null): obj is VaultConfigOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isVaultConfigOutput"')
      return VaultConfigOutput_possibleTypes.includes(obj.__typename)
    }
    


    const VaultCreditCardConfig_possibleTypes: string[] = ['VaultCreditCardConfig']
    export const isVaultCreditCardConfig = (obj?: { __typename?: any } | null): obj is VaultCreditCardConfig => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isVaultCreditCardConfig"')
      return VaultCreditCardConfig_possibleTypes.includes(obj.__typename)
    }
    


    const VirtualCartItem_possibleTypes: string[] = ['VirtualCartItem']
    export const isVirtualCartItem = (obj?: { __typename?: any } | null): obj is VirtualCartItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isVirtualCartItem"')
      return VirtualCartItem_possibleTypes.includes(obj.__typename)
    }
    


    const VirtualProduct_possibleTypes: string[] = ['VirtualProduct']
    export const isVirtualProduct = (obj?: { __typename?: any } | null): obj is VirtualProduct => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isVirtualProduct"')
      return VirtualProduct_possibleTypes.includes(obj.__typename)
    }
    


    const VirtualWishlistItem_possibleTypes: string[] = ['VirtualWishlistItem']
    export const isVirtualWishlistItem = (obj?: { __typename?: any } | null): obj is VirtualWishlistItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isVirtualWishlistItem"')
      return VirtualWishlistItem_possibleTypes.includes(obj.__typename)
    }
    


    const Website_possibleTypes: string[] = ['Website']
    export const isWebsite = (obj?: { __typename?: any } | null): obj is Website => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWebsite"')
      return Website_possibleTypes.includes(obj.__typename)
    }
    


    const Wishlist_possibleTypes: string[] = ['Wishlist']
    export const isWishlist = (obj?: { __typename?: any } | null): obj is Wishlist => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWishlist"')
      return Wishlist_possibleTypes.includes(obj.__typename)
    }
    


    const WishlistCartUserInputError_possibleTypes: string[] = ['WishlistCartUserInputError']
    export const isWishlistCartUserInputError = (obj?: { __typename?: any } | null): obj is WishlistCartUserInputError => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWishlistCartUserInputError"')
      return WishlistCartUserInputError_possibleTypes.includes(obj.__typename)
    }
    


    const WishlistItem_possibleTypes: string[] = ['WishlistItem']
    export const isWishlistItem = (obj?: { __typename?: any } | null): obj is WishlistItem => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWishlistItem"')
      return WishlistItem_possibleTypes.includes(obj.__typename)
    }
    


    const WishlistItemInterface_possibleTypes: string[] = ['BundleWishlistItem','ConfigurableWishlistItem','DownloadableWishlistItem','GroupedProductWishlistItem','SimpleWishlistItem','VirtualWishlistItem']
    export const isWishlistItemInterface = (obj?: { __typename?: any } | null): obj is WishlistItemInterface => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWishlistItemInterface"')
      return WishlistItemInterface_possibleTypes.includes(obj.__typename)
    }
    


    const WishlistItems_possibleTypes: string[] = ['WishlistItems']
    export const isWishlistItems = (obj?: { __typename?: any } | null): obj is WishlistItems => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWishlistItems"')
      return WishlistItems_possibleTypes.includes(obj.__typename)
    }
    


    const WishlistOutput_possibleTypes: string[] = ['WishlistOutput']
    export const isWishlistOutput = (obj?: { __typename?: any } | null): obj is WishlistOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWishlistOutput"')
      return WishlistOutput_possibleTypes.includes(obj.__typename)
    }
    


    const WishListUserInputError_possibleTypes: string[] = ['WishListUserInputError']
    export const isWishListUserInputError = (obj?: { __typename?: any } | null): obj is WishListUserInputError => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWishListUserInputError"')
      return WishListUserInputError_possibleTypes.includes(obj.__typename)
    }
    

export const enumAttributeEntityTypeEnum = {
   CATALOG_PRODUCT: 'CATALOG_PRODUCT' as const,
   CATALOG_CATEGORY: 'CATALOG_CATEGORY' as const,
   CUSTOMER: 'CUSTOMER' as const,
   CUSTOMER_ADDRESS: 'CUSTOMER_ADDRESS' as const
}

export const enumAttributeFrontendInputEnum = {
   BOOLEAN: 'BOOLEAN' as const,
   DATE: 'DATE' as const,
   DATETIME: 'DATETIME' as const,
   FILE: 'FILE' as const,
   GALLERY: 'GALLERY' as const,
   HIDDEN: 'HIDDEN' as const,
   IMAGE: 'IMAGE' as const,
   MEDIA_IMAGE: 'MEDIA_IMAGE' as const,
   MULTILINE: 'MULTILINE' as const,
   MULTISELECT: 'MULTISELECT' as const,
   PRICE: 'PRICE' as const,
   SELECT: 'SELECT' as const,
   TEXT: 'TEXT' as const,
   TEXTAREA: 'TEXTAREA' as const,
   WEIGHT: 'WEIGHT' as const,
   UNDEFINED: 'UNDEFINED' as const
}

export const enumAttributeMetadataErrorType = {
   ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND' as const,
   ATTRIBUTE_NOT_FOUND: 'ATTRIBUTE_NOT_FOUND' as const,
   FILTER_NOT_FOUND: 'FILTER_NOT_FOUND' as const,
   UNDEFINED: 'UNDEFINED' as const
}

export const enumBatchMutationStatus = {
   SUCCESS: 'SUCCESS' as const,
   FAILURE: 'FAILURE' as const,
   MIXED_RESULTS: 'MIXED_RESULTS' as const
}

export const enumCartDiscountType = {
   ITEM: 'ITEM' as const,
   SHIPPING: 'SHIPPING' as const
}

export const enumCartItemErrorType = {
   UNDEFINED: 'UNDEFINED' as const,
   ITEM_QTY: 'ITEM_QTY' as const,
   ITEM_INCREMENTS: 'ITEM_INCREMENTS' as const
}

export const enumCartUserInputErrorType = {
   PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND' as const,
   NOT_SALABLE: 'NOT_SALABLE' as const,
   INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK' as const,
   UNDEFINED: 'UNDEFINED' as const
}

export const enumCatalogAttributeApplyToEnum = {
   SIMPLE: 'SIMPLE' as const,
   VIRTUAL: 'VIRTUAL' as const,
   BUNDLE: 'BUNDLE' as const,
   DOWNLOADABLE: 'DOWNLOADABLE' as const,
   CONFIGURABLE: 'CONFIGURABLE' as const,
   GROUPED: 'GROUPED' as const,
   CATEGORY: 'CATEGORY' as const
}

export const enumCheckoutAgreementMode = {
   AUTO: 'AUTO' as const,
   MANUAL: 'MANUAL' as const
}

export const enumCheckoutUserInputErrorCodes = {
   REORDER_NOT_AVAILABLE: 'REORDER_NOT_AVAILABLE' as const,
   PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND' as const,
   NOT_SALABLE: 'NOT_SALABLE' as const,
   INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK' as const,
   UNDEFINED: 'UNDEFINED' as const
}

export const enumConfirmationStatusEnum = {
   ACCOUNT_CONFIRMED: 'ACCOUNT_CONFIRMED' as const,
   ACCOUNT_CONFIRMATION_NOT_REQUIRED: 'ACCOUNT_CONFIRMATION_NOT_REQUIRED' as const
}

export const enumCountryCodeEnum = {
   AF: 'AF' as const,
   AX: 'AX' as const,
   AL: 'AL' as const,
   DZ: 'DZ' as const,
   AS: 'AS' as const,
   AD: 'AD' as const,
   AO: 'AO' as const,
   AI: 'AI' as const,
   AQ: 'AQ' as const,
   AG: 'AG' as const,
   AR: 'AR' as const,
   AM: 'AM' as const,
   AW: 'AW' as const,
   AU: 'AU' as const,
   AT: 'AT' as const,
   AZ: 'AZ' as const,
   BS: 'BS' as const,
   BH: 'BH' as const,
   BD: 'BD' as const,
   BB: 'BB' as const,
   BY: 'BY' as const,
   BE: 'BE' as const,
   BZ: 'BZ' as const,
   BJ: 'BJ' as const,
   BM: 'BM' as const,
   BT: 'BT' as const,
   BO: 'BO' as const,
   BA: 'BA' as const,
   BW: 'BW' as const,
   BV: 'BV' as const,
   BR: 'BR' as const,
   IO: 'IO' as const,
   VG: 'VG' as const,
   BN: 'BN' as const,
   BG: 'BG' as const,
   BF: 'BF' as const,
   BI: 'BI' as const,
   KH: 'KH' as const,
   CM: 'CM' as const,
   CA: 'CA' as const,
   CV: 'CV' as const,
   KY: 'KY' as const,
   CF: 'CF' as const,
   TD: 'TD' as const,
   CL: 'CL' as const,
   CN: 'CN' as const,
   CX: 'CX' as const,
   CC: 'CC' as const,
   CO: 'CO' as const,
   KM: 'KM' as const,
   CG: 'CG' as const,
   CD: 'CD' as const,
   CK: 'CK' as const,
   CR: 'CR' as const,
   CI: 'CI' as const,
   HR: 'HR' as const,
   CU: 'CU' as const,
   CY: 'CY' as const,
   CZ: 'CZ' as const,
   DK: 'DK' as const,
   DJ: 'DJ' as const,
   DM: 'DM' as const,
   DO: 'DO' as const,
   EC: 'EC' as const,
   EG: 'EG' as const,
   SV: 'SV' as const,
   GQ: 'GQ' as const,
   ER: 'ER' as const,
   EE: 'EE' as const,
   SZ: 'SZ' as const,
   ET: 'ET' as const,
   FK: 'FK' as const,
   FO: 'FO' as const,
   FJ: 'FJ' as const,
   FI: 'FI' as const,
   FR: 'FR' as const,
   GF: 'GF' as const,
   PF: 'PF' as const,
   TF: 'TF' as const,
   GA: 'GA' as const,
   GM: 'GM' as const,
   GE: 'GE' as const,
   DE: 'DE' as const,
   GH: 'GH' as const,
   GI: 'GI' as const,
   GR: 'GR' as const,
   GL: 'GL' as const,
   GD: 'GD' as const,
   GP: 'GP' as const,
   GU: 'GU' as const,
   GT: 'GT' as const,
   GG: 'GG' as const,
   GN: 'GN' as const,
   GW: 'GW' as const,
   GY: 'GY' as const,
   HT: 'HT' as const,
   HM: 'HM' as const,
   HN: 'HN' as const,
   HK: 'HK' as const,
   HU: 'HU' as const,
   IS: 'IS' as const,
   IN: 'IN' as const,
   ID: 'ID' as const,
   IR: 'IR' as const,
   IQ: 'IQ' as const,
   IE: 'IE' as const,
   IM: 'IM' as const,
   IL: 'IL' as const,
   IT: 'IT' as const,
   JM: 'JM' as const,
   JP: 'JP' as const,
   JE: 'JE' as const,
   JO: 'JO' as const,
   KZ: 'KZ' as const,
   KE: 'KE' as const,
   KI: 'KI' as const,
   KW: 'KW' as const,
   KG: 'KG' as const,
   LA: 'LA' as const,
   LV: 'LV' as const,
   LB: 'LB' as const,
   LS: 'LS' as const,
   LR: 'LR' as const,
   LY: 'LY' as const,
   LI: 'LI' as const,
   LT: 'LT' as const,
   LU: 'LU' as const,
   MO: 'MO' as const,
   MK: 'MK' as const,
   MG: 'MG' as const,
   MW: 'MW' as const,
   MY: 'MY' as const,
   MV: 'MV' as const,
   ML: 'ML' as const,
   MT: 'MT' as const,
   MH: 'MH' as const,
   MQ: 'MQ' as const,
   MR: 'MR' as const,
   MU: 'MU' as const,
   YT: 'YT' as const,
   MX: 'MX' as const,
   FM: 'FM' as const,
   MD: 'MD' as const,
   MC: 'MC' as const,
   MN: 'MN' as const,
   ME: 'ME' as const,
   MS: 'MS' as const,
   MA: 'MA' as const,
   MZ: 'MZ' as const,
   MM: 'MM' as const,
   NA: 'NA' as const,
   NR: 'NR' as const,
   NP: 'NP' as const,
   NL: 'NL' as const,
   AN: 'AN' as const,
   NC: 'NC' as const,
   NZ: 'NZ' as const,
   NI: 'NI' as const,
   NE: 'NE' as const,
   NG: 'NG' as const,
   NU: 'NU' as const,
   NF: 'NF' as const,
   MP: 'MP' as const,
   KP: 'KP' as const,
   NO: 'NO' as const,
   OM: 'OM' as const,
   PK: 'PK' as const,
   PW: 'PW' as const,
   PS: 'PS' as const,
   PA: 'PA' as const,
   PG: 'PG' as const,
   PY: 'PY' as const,
   PE: 'PE' as const,
   PH: 'PH' as const,
   PN: 'PN' as const,
   PL: 'PL' as const,
   PT: 'PT' as const,
   QA: 'QA' as const,
   RE: 'RE' as const,
   RO: 'RO' as const,
   RU: 'RU' as const,
   RW: 'RW' as const,
   WS: 'WS' as const,
   SM: 'SM' as const,
   ST: 'ST' as const,
   SA: 'SA' as const,
   SN: 'SN' as const,
   RS: 'RS' as const,
   SC: 'SC' as const,
   SL: 'SL' as const,
   SG: 'SG' as const,
   SK: 'SK' as const,
   SI: 'SI' as const,
   SB: 'SB' as const,
   SO: 'SO' as const,
   ZA: 'ZA' as const,
   GS: 'GS' as const,
   KR: 'KR' as const,
   ES: 'ES' as const,
   LK: 'LK' as const,
   BL: 'BL' as const,
   SH: 'SH' as const,
   KN: 'KN' as const,
   LC: 'LC' as const,
   MF: 'MF' as const,
   PM: 'PM' as const,
   VC: 'VC' as const,
   SD: 'SD' as const,
   SR: 'SR' as const,
   SJ: 'SJ' as const,
   SE: 'SE' as const,
   CH: 'CH' as const,
   SY: 'SY' as const,
   TW: 'TW' as const,
   TJ: 'TJ' as const,
   TZ: 'TZ' as const,
   TH: 'TH' as const,
   TL: 'TL' as const,
   TG: 'TG' as const,
   TK: 'TK' as const,
   TO: 'TO' as const,
   TT: 'TT' as const,
   TN: 'TN' as const,
   TR: 'TR' as const,
   TM: 'TM' as const,
   TC: 'TC' as const,
   TV: 'TV' as const,
   UG: 'UG' as const,
   UA: 'UA' as const,
   AE: 'AE' as const,
   GB: 'GB' as const,
   US: 'US' as const,
   UY: 'UY' as const,
   UM: 'UM' as const,
   VI: 'VI' as const,
   UZ: 'UZ' as const,
   VU: 'VU' as const,
   VA: 'VA' as const,
   VE: 'VE' as const,
   VN: 'VN' as const,
   WF: 'WF' as const,
   EH: 'EH' as const,
   YE: 'YE' as const,
   ZM: 'ZM' as const,
   ZW: 'ZW' as const
}

export const enumCurrencyEnum = {
   AFN: 'AFN' as const,
   ALL: 'ALL' as const,
   AZN: 'AZN' as const,
   DZD: 'DZD' as const,
   AOA: 'AOA' as const,
   ARS: 'ARS' as const,
   AMD: 'AMD' as const,
   AWG: 'AWG' as const,
   AUD: 'AUD' as const,
   BSD: 'BSD' as const,
   BHD: 'BHD' as const,
   BDT: 'BDT' as const,
   BBD: 'BBD' as const,
   BYN: 'BYN' as const,
   BZD: 'BZD' as const,
   BMD: 'BMD' as const,
   BTN: 'BTN' as const,
   BOB: 'BOB' as const,
   BAM: 'BAM' as const,
   BWP: 'BWP' as const,
   BRL: 'BRL' as const,
   GBP: 'GBP' as const,
   BND: 'BND' as const,
   BGN: 'BGN' as const,
   BUK: 'BUK' as const,
   BIF: 'BIF' as const,
   KHR: 'KHR' as const,
   CAD: 'CAD' as const,
   CVE: 'CVE' as const,
   CZK: 'CZK' as const,
   KYD: 'KYD' as const,
   GQE: 'GQE' as const,
   CLP: 'CLP' as const,
   CNY: 'CNY' as const,
   COP: 'COP' as const,
   KMF: 'KMF' as const,
   CDF: 'CDF' as const,
   CRC: 'CRC' as const,
   HRK: 'HRK' as const,
   CUP: 'CUP' as const,
   DKK: 'DKK' as const,
   DJF: 'DJF' as const,
   DOP: 'DOP' as const,
   XCD: 'XCD' as const,
   EGP: 'EGP' as const,
   SVC: 'SVC' as const,
   ERN: 'ERN' as const,
   EEK: 'EEK' as const,
   ETB: 'ETB' as const,
   EUR: 'EUR' as const,
   FKP: 'FKP' as const,
   FJD: 'FJD' as const,
   GMD: 'GMD' as const,
   GEK: 'GEK' as const,
   GEL: 'GEL' as const,
   GHS: 'GHS' as const,
   GIP: 'GIP' as const,
   GTQ: 'GTQ' as const,
   GNF: 'GNF' as const,
   GYD: 'GYD' as const,
   HTG: 'HTG' as const,
   HNL: 'HNL' as const,
   HKD: 'HKD' as const,
   HUF: 'HUF' as const,
   ISK: 'ISK' as const,
   INR: 'INR' as const,
   IDR: 'IDR' as const,
   IRR: 'IRR' as const,
   IQD: 'IQD' as const,
   ILS: 'ILS' as const,
   JMD: 'JMD' as const,
   JPY: 'JPY' as const,
   JOD: 'JOD' as const,
   KZT: 'KZT' as const,
   KES: 'KES' as const,
   KWD: 'KWD' as const,
   KGS: 'KGS' as const,
   LAK: 'LAK' as const,
   LVL: 'LVL' as const,
   LBP: 'LBP' as const,
   LSL: 'LSL' as const,
   LRD: 'LRD' as const,
   LYD: 'LYD' as const,
   LTL: 'LTL' as const,
   MOP: 'MOP' as const,
   MKD: 'MKD' as const,
   MGA: 'MGA' as const,
   MWK: 'MWK' as const,
   MYR: 'MYR' as const,
   MVR: 'MVR' as const,
   LSM: 'LSM' as const,
   MRO: 'MRO' as const,
   MUR: 'MUR' as const,
   MXN: 'MXN' as const,
   MDL: 'MDL' as const,
   MNT: 'MNT' as const,
   MAD: 'MAD' as const,
   MZN: 'MZN' as const,
   MMK: 'MMK' as const,
   NAD: 'NAD' as const,
   NPR: 'NPR' as const,
   ANG: 'ANG' as const,
   YTL: 'YTL' as const,
   NZD: 'NZD' as const,
   NIC: 'NIC' as const,
   NGN: 'NGN' as const,
   KPW: 'KPW' as const,
   NOK: 'NOK' as const,
   OMR: 'OMR' as const,
   PKR: 'PKR' as const,
   PAB: 'PAB' as const,
   PGK: 'PGK' as const,
   PYG: 'PYG' as const,
   PEN: 'PEN' as const,
   PHP: 'PHP' as const,
   PLN: 'PLN' as const,
   QAR: 'QAR' as const,
   RHD: 'RHD' as const,
   RON: 'RON' as const,
   RUB: 'RUB' as const,
   RWF: 'RWF' as const,
   SHP: 'SHP' as const,
   STD: 'STD' as const,
   SAR: 'SAR' as const,
   RSD: 'RSD' as const,
   SCR: 'SCR' as const,
   SLL: 'SLL' as const,
   SGD: 'SGD' as const,
   SKK: 'SKK' as const,
   SBD: 'SBD' as const,
   SOS: 'SOS' as const,
   ZAR: 'ZAR' as const,
   KRW: 'KRW' as const,
   LKR: 'LKR' as const,
   SDG: 'SDG' as const,
   SRD: 'SRD' as const,
   SZL: 'SZL' as const,
   SEK: 'SEK' as const,
   CHF: 'CHF' as const,
   SYP: 'SYP' as const,
   TWD: 'TWD' as const,
   TJS: 'TJS' as const,
   TZS: 'TZS' as const,
   THB: 'THB' as const,
   TOP: 'TOP' as const,
   TTD: 'TTD' as const,
   TND: 'TND' as const,
   TMM: 'TMM' as const,
   USD: 'USD' as const,
   UGX: 'UGX' as const,
   UAH: 'UAH' as const,
   AED: 'AED' as const,
   UYU: 'UYU' as const,
   UZS: 'UZS' as const,
   VUV: 'VUV' as const,
   VEB: 'VEB' as const,
   VEF: 'VEF' as const,
   VND: 'VND' as const,
   CHE: 'CHE' as const,
   CHW: 'CHW' as const,
   XOF: 'XOF' as const,
   WST: 'WST' as const,
   YER: 'YER' as const,
   ZMK: 'ZMK' as const,
   ZWD: 'ZWD' as const,
   TRY: 'TRY' as const,
   AZM: 'AZM' as const,
   ROL: 'ROL' as const,
   TRL: 'TRL' as const,
   XPF: 'XPF' as const
}

export const enumCustomerOrderSortableField = {
   NUMBER: 'NUMBER' as const,
   CREATED_AT: 'CREATED_AT' as const
}

export const enumCustomizableDateTypeEnum = {
   DATE: 'DATE' as const,
   DATE_TIME: 'DATE_TIME' as const,
   TIME: 'TIME' as const
}

export const enumDownloadableFileTypeEnum = {
   FILE: 'FILE' as const,
   URL: 'URL' as const
}

export const enumFilterMatchTypeEnum = {
   FULL: 'FULL' as const,
   PARTIAL: 'PARTIAL' as const
}

export const enumInputFilterEnum = {
   NONE: 'NONE' as const,
   DATE: 'DATE' as const,
   TRIM: 'TRIM' as const,
   STRIPTAGS: 'STRIPTAGS' as const,
   ESCAPEHTML: 'ESCAPEHTML' as const
}

export const enumPayflowLinkMode = {
   TEST: 'TEST' as const,
   LIVE: 'LIVE' as const
}

export const enumPaymentLocation = {
   PRODUCT_DETAIL: 'PRODUCT_DETAIL' as const,
   MINICART: 'MINICART' as const,
   CART: 'CART' as const,
   CHECKOUT: 'CHECKOUT' as const,
   ADMIN: 'ADMIN' as const
}

export const enumPaymentTokenTypeEnum = {
   card: 'card' as const,
   account: 'account' as const
}

export const enumPlaceOrderErrorCodes = {
   CART_NOT_FOUND: 'CART_NOT_FOUND' as const,
   CART_NOT_ACTIVE: 'CART_NOT_ACTIVE' as const,
   GUEST_EMAIL_MISSING: 'GUEST_EMAIL_MISSING' as const,
   UNABLE_TO_PLACE_ORDER: 'UNABLE_TO_PLACE_ORDER' as const,
   UNDEFINED: 'UNDEFINED' as const
}

export const enumPriceAdjustmentCodesEnum = {
   TAX: 'TAX' as const
}

export const enumPriceAdjustmentDescriptionEnum = {
   INCLUDED: 'INCLUDED' as const,
   EXCLUDED: 'EXCLUDED' as const
}

export const enumPriceTypeEnum = {
   FIXED: 'FIXED' as const,
   PERCENT: 'PERCENT' as const,
   DYNAMIC: 'DYNAMIC' as const
}

export const enumPriceViewEnum = {
   PRICE_RANGE: 'PRICE_RANGE' as const,
   AS_LOW_AS: 'AS_LOW_AS' as const
}

export const enumProductStockStatus = {
   IN_STOCK: 'IN_STOCK' as const,
   OUT_OF_STOCK: 'OUT_OF_STOCK' as const
}

export const enumReCaptchaFormEnum = {
   PLACE_ORDER: 'PLACE_ORDER' as const,
   CONTACT: 'CONTACT' as const,
   CUSTOMER_LOGIN: 'CUSTOMER_LOGIN' as const,
   CUSTOMER_FORGOT_PASSWORD: 'CUSTOMER_FORGOT_PASSWORD' as const,
   CUSTOMER_CREATE: 'CUSTOMER_CREATE' as const,
   CUSTOMER_EDIT: 'CUSTOMER_EDIT' as const,
   NEWSLETTER: 'NEWSLETTER' as const,
   PRODUCT_REVIEW: 'PRODUCT_REVIEW' as const,
   SENDFRIEND: 'SENDFRIEND' as const,
   BRAINTREE: 'BRAINTREE' as const
}

export const enumScopeTypeEnum = {
   GLOBAL: 'GLOBAL' as const,
   WEBSITE: 'WEBSITE' as const,
   STORE: 'STORE' as const
}

export const enumShipBundleItemsEnum = {
   TOGETHER: 'TOGETHER' as const,
   SEPARATELY: 'SEPARATELY' as const
}

export const enumSortEnum = {
   ASC: 'ASC' as const,
   DESC: 'DESC' as const
}

export const enumSortQuoteItemsEnum = {
   ITEM_ID: 'ITEM_ID' as const,
   CREATED_AT: 'CREATED_AT' as const,
   UPDATED_AT: 'UPDATED_AT' as const,
   PRODUCT_ID: 'PRODUCT_ID' as const,
   SKU: 'SKU' as const,
   NAME: 'NAME' as const,
   DESCRIPTION: 'DESCRIPTION' as const,
   WEIGHT: 'WEIGHT' as const,
   QTY: 'QTY' as const,
   PRICE: 'PRICE' as const,
   BASE_PRICE: 'BASE_PRICE' as const,
   CUSTOM_PRICE: 'CUSTOM_PRICE' as const,
   DISCOUNT_PERCENT: 'DISCOUNT_PERCENT' as const,
   DISCOUNT_AMOUNT: 'DISCOUNT_AMOUNT' as const,
   BASE_DISCOUNT_AMOUNT: 'BASE_DISCOUNT_AMOUNT' as const,
   TAX_PERCENT: 'TAX_PERCENT' as const,
   TAX_AMOUNT: 'TAX_AMOUNT' as const,
   BASE_TAX_AMOUNT: 'BASE_TAX_AMOUNT' as const,
   ROW_TOTAL: 'ROW_TOTAL' as const,
   BASE_ROW_TOTAL: 'BASE_ROW_TOTAL' as const,
   ROW_TOTAL_WITH_DISCOUNT: 'ROW_TOTAL_WITH_DISCOUNT' as const,
   ROW_WEIGHT: 'ROW_WEIGHT' as const,
   PRODUCT_TYPE: 'PRODUCT_TYPE' as const,
   BASE_TAX_BEFORE_DISCOUNT: 'BASE_TAX_BEFORE_DISCOUNT' as const,
   TAX_BEFORE_DISCOUNT: 'TAX_BEFORE_DISCOUNT' as const,
   ORIGINAL_CUSTOM_PRICE: 'ORIGINAL_CUSTOM_PRICE' as const,
   PRICE_INC_TAX: 'PRICE_INC_TAX' as const,
   BASE_PRICE_INC_TAX: 'BASE_PRICE_INC_TAX' as const,
   ROW_TOTAL_INC_TAX: 'ROW_TOTAL_INC_TAX' as const,
   BASE_ROW_TOTAL_INC_TAX: 'BASE_ROW_TOTAL_INC_TAX' as const,
   DISCOUNT_TAX_COMPENSATION_AMOUNT: 'DISCOUNT_TAX_COMPENSATION_AMOUNT' as const,
   BASE_DISCOUNT_TAX_COMPENSATION_AMOUNT: 'BASE_DISCOUNT_TAX_COMPENSATION_AMOUNT' as const,
   FREE_SHIPPING: 'FREE_SHIPPING' as const
}

export const enumSubscriptionStatusesEnum = {
   NOT_ACTIVE: 'NOT_ACTIVE' as const,
   SUBSCRIBED: 'SUBSCRIBED' as const,
   UNSUBSCRIBED: 'UNSUBSCRIBED' as const,
   UNCONFIRMED: 'UNCONFIRMED' as const
}

export const enumSwatchInputTypeEnum = {
   BOOLEAN: 'BOOLEAN' as const,
   DATE: 'DATE' as const,
   DATETIME: 'DATETIME' as const,
   DROPDOWN: 'DROPDOWN' as const,
   FILE: 'FILE' as const,
   GALLERY: 'GALLERY' as const,
   HIDDEN: 'HIDDEN' as const,
   IMAGE: 'IMAGE' as const,
   MEDIA_IMAGE: 'MEDIA_IMAGE' as const,
   MULTILINE: 'MULTILINE' as const,
   MULTISELECT: 'MULTISELECT' as const,
   PRICE: 'PRICE' as const,
   SELECT: 'SELECT' as const,
   TEXT: 'TEXT' as const,
   TEXTAREA: 'TEXTAREA' as const,
   UNDEFINED: 'UNDEFINED' as const,
   VISUAL: 'VISUAL' as const,
   WEIGHT: 'WEIGHT' as const
}

export const enumTaxWrappingEnum = {
   DISPLAY_EXCLUDING_TAX: 'DISPLAY_EXCLUDING_TAX' as const,
   DISPLAY_INCLUDING_TAX: 'DISPLAY_INCLUDING_TAX' as const,
   DISPLAY_TYPE_BOTH: 'DISPLAY_TYPE_BOTH' as const
}

export const enumThreeDsMode = {
   OFF: 'OFF' as const,
   SCA_WHEN_REQUIRED: 'SCA_WHEN_REQUIRED' as const,
   SCA_ALWAYS: 'SCA_ALWAYS' as const
}

export const enumUrlRewriteEntityTypeEnum = {
   CMS_PAGE: 'CMS_PAGE' as const,
   PRODUCT: 'PRODUCT' as const,
   CATEGORY: 'CATEGORY' as const
}

export const enumUseInLayeredNavigationOptions = {
   NO: 'NO' as const,
   FILTERABLE_WITH_RESULTS: 'FILTERABLE_WITH_RESULTS' as const,
   FILTERABLE_NO_RESULT: 'FILTERABLE_NO_RESULT' as const
}

export const enumValidationRuleEnum = {
   DATE_RANGE_MAX: 'DATE_RANGE_MAX' as const,
   DATE_RANGE_MIN: 'DATE_RANGE_MIN' as const,
   FILE_EXTENSIONS: 'FILE_EXTENSIONS' as const,
   INPUT_VALIDATION: 'INPUT_VALIDATION' as const,
   MAX_TEXT_LENGTH: 'MAX_TEXT_LENGTH' as const,
   MIN_TEXT_LENGTH: 'MIN_TEXT_LENGTH' as const,
   MAX_FILE_SIZE: 'MAX_FILE_SIZE' as const,
   MAX_IMAGE_HEIGHT: 'MAX_IMAGE_HEIGHT' as const,
   MAX_IMAGE_WIDTH: 'MAX_IMAGE_WIDTH' as const
}

export const enumWishlistCartUserInputErrorType = {
   PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND' as const,
   NOT_SALABLE: 'NOT_SALABLE' as const,
   INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK' as const,
   UNDEFINED: 'UNDEFINED' as const
}

export const enumWishListUserInputErrorType = {
   PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND' as const,
   UNDEFINED: 'UNDEFINED' as const
}
