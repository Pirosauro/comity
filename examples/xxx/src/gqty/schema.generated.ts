/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { SchemaUnionsKey, type ScalarsEnumsHash } from "gqty";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
}

/** Defines the bundle products to add to the cart. */
export interface AddBundleProductsToCartInput {
  /** The ID of the cart. */
  cart_id: Scalars["String"]["input"];
  /** An array of bundle products to add. */
  cart_items: Array<InputMaybe<BundleProductCartItemInput>>;
}

/** Defines the configurable products to add to the cart. */
export interface AddConfigurableProductsToCartInput {
  /** The ID of the cart. */
  cart_id: Scalars["String"]["input"];
  /** An array of configurable products to add. */
  cart_items: Array<InputMaybe<ConfigurableProductCartItemInput>>;
}

export interface AddDownloadableProductsToCartInput {
  /** The ID of the cart. */
  cart_id: Scalars["String"]["input"];
  /** An array of downloadable products to add. */
  cart_items: Array<InputMaybe<DownloadableProductCartItemInput>>;
}

/** Contains products to add to an existing compare list. */
export interface AddProductsToCompareListInput {
  /** An array of product IDs to add to the compare list. */
  products: Array<InputMaybe<Scalars["ID"]["input"]>>;
  /** The unique identifier of the compare list to modify. */
  uid: Scalars["ID"]["input"];
}

/** Defines the simple and group products to add to the cart. */
export interface AddSimpleProductsToCartInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** An array of simple and group items to add. */
  cart_items: Array<InputMaybe<SimpleProductCartItemInput>>;
}

/** Defines the virtual products to add to the cart. */
export interface AddVirtualProductsToCartInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** An array of virtual products to add. */
  cart_items: Array<InputMaybe<VirtualProductCartItemInput>>;
}

/** Filter category aggregations in layered navigation. */
export interface AggregationsCategoryFilterInput {
  /** Indicates whether to include only direct subcategories or all children categories at all levels. */
  includeDirectChildrenOnly?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** An input object that specifies the filters used in product aggregations. */
export interface AggregationsFilterInput {
  /** Filter category aggregations in layered navigation. */
  category?: InputMaybe<AggregationsCategoryFilterInput>;
}

/** Apple Pay inputs */
export interface ApplePayMethodInput {
  /** The payment source for the payment method */
  payment_source?: InputMaybe<Scalars["String"]["input"]>;
  /** The payment services order ID */
  payments_order_id?: InputMaybe<Scalars["String"]["input"]>;
  /** PayPal order ID */
  paypal_order_id?: InputMaybe<Scalars["String"]["input"]>;
}

/** Specifies the coupon code to apply to the cart. */
export interface ApplyCouponToCartInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** A valid coupon code. */
  coupon_code: Scalars["String"]["input"];
}

/** AreaInput defines the parameters which will be used for filter by specified location. */
export interface AreaInput {
  /** The radius for the search in KM. */
  radius: Scalars["Int"]["input"];
  /** The country code where search must be performed. Required parameter together with region, city or postcode. */
  search_term: Scalars["String"]["input"];
}

/** List of all entity types. Populated by the modules introducing EAV entities. */
export enum AttributeEntityTypeEnum {
  CATALOG_CATEGORY = "CATALOG_CATEGORY",
  CATALOG_PRODUCT = "CATALOG_PRODUCT",
  CUSTOMER = "CUSTOMER",
  CUSTOMER_ADDRESS = "CUSTOMER_ADDRESS",
}

/** An input object that specifies the filters used for attributes. */
export interface AttributeFilterInput {
  /** Whether a product or category attribute can be compared against another or not. */
  is_comparable?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute can be filtered or not. */
  is_filterable?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute can be filtered in search or not. */
  is_filterable_in_search?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute can use HTML on front or not. */
  is_html_allowed_on_front?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute can be searched or not. */
  is_searchable?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute can be used for price rules or not. */
  is_used_for_price_rules?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute is used for promo rules or not. */
  is_used_for_promo_rules?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute is visible in advanced search or not. */
  is_visible_in_advanced_search?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute is visible on front or not. */
  is_visible_on_front?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute has WYSIWYG enabled or not. */
  is_wysiwyg_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Whether a product or category attribute is used in product listing or not. */
  used_in_product_listing?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** EAV attribute frontend input types. */
export enum AttributeFrontendInputEnum {
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  DATETIME = "DATETIME",
  FILE = "FILE",
  GALLERY = "GALLERY",
  HIDDEN = "HIDDEN",
  IMAGE = "IMAGE",
  MEDIA_IMAGE = "MEDIA_IMAGE",
  MULTILINE = "MULTILINE",
  MULTISELECT = "MULTISELECT",
  PRICE = "PRICE",
  SELECT = "SELECT",
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  UNDEFINED = "UNDEFINED",
  WEIGHT = "WEIGHT",
}

/** Defines the attribute characteristics to search for the `attribute_code` and `entity_type` to search. */
export interface AttributeInput {
  /** The unique identifier for an attribute code. This value should be in lowercase letters without spaces. */
  attribute_code?: InputMaybe<Scalars["String"]["input"]>;
  /** The type of entity that defines the attribute. */
  entity_type?: InputMaybe<Scalars["String"]["input"]>;
}

/** Specifies selected option for a select or multiselect attribute value. */
export interface AttributeInputSelectedOption {
  /** The attribute option value. */
  value: Scalars["String"]["input"];
}

/** Attribute metadata retrieval error types. */
export enum AttributeMetadataErrorType {
  /** The requested attribute was not found. */
  ATTRIBUTE_NOT_FOUND = "ATTRIBUTE_NOT_FOUND",
  /** The requested entity was not found. */
  ENTITY_NOT_FOUND = "ENTITY_NOT_FOUND",
  /** The filter cannot be applied as it does not belong to the entity */
  FILTER_NOT_FOUND = "FILTER_NOT_FOUND",
  /** Not categorized error, see the error message. */
  UNDEFINED = "UNDEFINED",
}

/** Specifies the value for attribute. */
export interface AttributeValueInput {
  /** The code of the attribute. */
  attribute_code: Scalars["String"]["input"];
  /** An array containing selected options for a select or multiselect attribute. */
  selected_options?: InputMaybe<Array<InputMaybe<AttributeInputSelectedOption>>>;
  /** The value assigned to the attribute. */
  value?: InputMaybe<Scalars["String"]["input"]>;
}

export enum BatchMutationStatus {
  FAILURE = "FAILURE",
  MIXED_RESULTS = "MIXED_RESULTS",
  SUCCESS = "SUCCESS",
}

/** Defines the billing address. */
export interface BillingAddressInput {
  /** Defines a billing address. */
  address?: InputMaybe<CartAddressInput>;
  /** An ID from the customer's address book that uniquely identifies the address to be used for billing. */
  customer_address_id?: InputMaybe<Scalars["Int"]["input"]>;
  /** Indicates whether to set the billing address to be the same as the existing shipping address on the cart. */
  same_as_shipping?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Indicates whether to set the shipping address to be the same as this billing address. */
  use_for_shipping?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** The billing address information */
export interface BillingAddressPaymentSourceInput {
  /** The first line of the address */
  address_line_1?: InputMaybe<Scalars["String"]["input"]>;
  /** The second line of the address */
  address_line_2?: InputMaybe<Scalars["String"]["input"]>;
  /** The city of the address */
  city?: InputMaybe<Scalars["String"]["input"]>;
  /** The country of the address */
  country_code: Scalars["String"]["input"];
  /** The postal code of the address */
  postal_code?: InputMaybe<Scalars["String"]["input"]>;
  /** The region of the address */
  region?: InputMaybe<Scalars["String"]["input"]>;
}

/** Defines the input for a bundle option. */
export interface BundleOptionInput {
  /** The ID of the option. */
  id: Scalars["Int"]["input"];
  /** The number of the selected item to add to the cart. */
  quantity: Scalars["Float"]["input"];
  /** An array with the chosen value of the option. */
  value: Array<InputMaybe<Scalars["String"]["input"]>>;
}

/** Defines a single bundle product. */
export interface BundleProductCartItemInput {
  /** A mandatory array of options for the bundle product, including each chosen option and specified quantity. */
  bundle_options: Array<InputMaybe<BundleOptionInput>>;
  /** The ID and value of the option. */
  customizable_options?: InputMaybe<Array<InputMaybe<CustomizableOptionInput>>>;
  /** The quantity and SKU of the bundle product. */
  data: CartItemInput;
}

/** Defines the order to cancel. */
export interface CancelOrderInput {
  /** Order ID. */
  order_id: Scalars["ID"]["input"];
  /** Cancellation reason. */
  reason: Scalars["String"]["input"];
}

/** The card payment source information */
export interface CardPaymentSourceInput {
  /** The billing address of the card */
  billing_address: BillingAddressPaymentSourceInput;
  /** The name on the cardholder */
  name?: InputMaybe<Scalars["String"]["input"]>;
}

/** Defines the billing or shipping address to be applied to the cart. */
export interface CartAddressInput {
  /** The city specified for the billing or shipping address. */
  city: Scalars["String"]["input"];
  /** The company specified for the billing or shipping address. */
  company?: InputMaybe<Scalars["String"]["input"]>;
  /** The country code and label for the billing or shipping address. */
  country_code: Scalars["String"]["input"];
  /** The customer's fax number. */
  fax?: InputMaybe<Scalars["String"]["input"]>;
  /** The first name of the customer or guest. */
  firstname: Scalars["String"]["input"];
  /** The last name of the customer or guest. */
  lastname: Scalars["String"]["input"];
  /** The middle name of the person associated with the billing/shipping address. */
  middlename?: InputMaybe<Scalars["String"]["input"]>;
  /** The ZIP or postal code of the billing or shipping address. */
  postcode?: InputMaybe<Scalars["String"]["input"]>;
  /** An honorific, such as Dr., Mr., or Mrs. */
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  /** A string that defines the state or province of the billing or shipping address. */
  region?: InputMaybe<Scalars["String"]["input"]>;
  /** An integer that defines the state or province of the billing or shipping address. */
  region_id?: InputMaybe<Scalars["Int"]["input"]>;
  /** Determines whether to save the address in the customer's address book. The default value is true. */
  save_in_address_book?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** An array containing the street for the billing or shipping address. */
  street: Array<InputMaybe<Scalars["String"]["input"]>>;
  /** A value such as Sr., Jr., or III. */
  suffix?: InputMaybe<Scalars["String"]["input"]>;
  /** The telephone number for the billing or shipping address. */
  telephone?: InputMaybe<Scalars["String"]["input"]>;
  /** The VAT company number for billing or shipping address. */
  vat_id?: InputMaybe<Scalars["String"]["input"]>;
}

export enum CartDiscountType {
  ITEM = "ITEM",
  SHIPPING = "SHIPPING",
}

export enum CartItemErrorType {
  ITEM_INCREMENTS = "ITEM_INCREMENTS",
  ITEM_QTY = "ITEM_QTY",
  UNDEFINED = "UNDEFINED",
}

/** Defines an item to be added to the cart. */
export interface CartItemInput {
  /** An array of entered options for the base product, such as personalization text. */
  entered_options?: InputMaybe<Array<InputMaybe<EnteredOptionInput>>>;
  /** For a child product, the SKU of its parent product. */
  parent_sku?: InputMaybe<Scalars["String"]["input"]>;
  /** The amount or number of an item to add. */
  quantity: Scalars["Float"]["input"];
  /** The selected options for the base product, such as color or size, using the unique ID for an object such as `CustomizableRadioOption`, `CustomizableDropDownOption`, or `ConfigurableProductOptionsValues`. */
  selected_options?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  /** The SKU of the product. */
  sku: Scalars["String"]["input"];
}

/** A single item to be updated. */
export interface CartItemUpdateInput {
  /** Deprecated. Use `cart_item_uid` instead. */
  cart_item_id?: InputMaybe<Scalars["Int"]["input"]>;
  /** The unique ID for a `CartItemInterface` object. */
  cart_item_uid?: InputMaybe<Scalars["ID"]["input"]>;
  /** An array that defines customizable options for the product. */
  customizable_options?: InputMaybe<Array<InputMaybe<CustomizableOptionInput>>>;
  /** Gift message details for the cart item */
  gift_message?: InputMaybe<GiftMessageInput>;
  /** The new quantity of the item. */
  quantity?: InputMaybe<Scalars["Float"]["input"]>;
}

export enum CartUserInputErrorType {
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  NOT_SALABLE = "NOT_SALABLE",
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  UNDEFINED = "UNDEFINED",
}

export enum CatalogAttributeApplyToEnum {
  BUNDLE = "BUNDLE",
  CATEGORY = "CATEGORY",
  CONFIGURABLE = "CONFIGURABLE",
  DOWNLOADABLE = "DOWNLOADABLE",
  GROUPED = "GROUPED",
  SIMPLE = "SIMPLE",
  VIRTUAL = "VIRTUAL",
}

/** Defines the filters to be used in the search. A filter contains at least one attribute, a comparison operator, and the value that is being searched for. */
export interface CategoryFilterInput {
  /** Filter by the unique category ID for a `CategoryInterface` object. */
  category_uid?: InputMaybe<FilterEqualTypeInput>;
  /** Deprecated: use 'category_uid' to filter uniquely identifiers of categories. */
  ids?: InputMaybe<FilterEqualTypeInput>;
  /** Filter by the display name of the category. */
  name?: InputMaybe<FilterMatchTypeInput>;
  /** Filter by the unique parent category ID for a `CategoryInterface` object. */
  parent_category_uid?: InputMaybe<FilterEqualTypeInput>;
  /** Filter by the unique parent category ID for a `CategoryInterface` object. */
  parent_id?: InputMaybe<FilterEqualTypeInput>;
  /** Filter by the part of the URL that identifies the category. */
  url_key?: InputMaybe<FilterEqualTypeInput>;
  /** Filter by the URL path for the category. */
  url_path?: InputMaybe<FilterEqualTypeInput>;
}

/** Indicates how agreements are accepted. */
export enum CheckoutAgreementMode {
  /** Conditions are automatically accepted upon checkout. */
  AUTO = "AUTO",
  /** Shoppers must manually accept the conditions to place an order. */
  MANUAL = "MANUAL",
}

export enum CheckoutUserInputErrorCodes {
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  NOT_SALABLE = "NOT_SALABLE",
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  REORDER_NOT_AVAILABLE = "REORDER_NOT_AVAILABLE",
  UNDEFINED = "UNDEFINED",
}

/** Update the quote and complete the order */
export interface CompleteOrderInput {
  /** The customer cart ID */
  cartId: Scalars["String"]["input"];
  /** PayPal order ID */
  id: Scalars["String"]["input"];
}

export interface ConfigurableProductCartItemInput {
  /** The ID and value of the option. */
  customizable_options?: InputMaybe<Array<InputMaybe<CustomizableOptionInput>>>;
  /** The quantity and SKU of the configurable product. */
  data: CartItemInput;
  /** The SKU of the parent configurable product. */
  parent_sku?: InputMaybe<Scalars["String"]["input"]>;
  /** Deprecated. Use `CartItemInput.sku` instead. */
  variant_sku?: InputMaybe<Scalars["String"]["input"]>;
}

/** Contains details about a customer email address to confirm. */
export interface ConfirmEmailInput {
  /** The key to confirm the email address. */
  confirmation_key: Scalars["String"]["input"];
  /** The email address to be confirmed. */
  email: Scalars["String"]["input"];
}

/** List of account confirmation statuses. */
export enum ConfirmationStatusEnum {
  /** Account confirmation not required */
  ACCOUNT_CONFIRMATION_NOT_REQUIRED = "ACCOUNT_CONFIRMATION_NOT_REQUIRED",
  /** Account confirmed */
  ACCOUNT_CONFIRMED = "ACCOUNT_CONFIRMED",
}

export interface ContactUsInput {
  /** The shopper's comment to the merchant. */
  comment: Scalars["String"]["input"];
  /** The email address of the shopper. */
  email: Scalars["String"]["input"];
  /** The full name of the shopper. */
  name: Scalars["String"]["input"];
  /** The shopper's telephone number. */
  telephone?: InputMaybe<Scalars["String"]["input"]>;
}

/** The list of country codes. */
export enum CountryCodeEnum {
  /** Andorra */
  AD = "AD",
  /** United Arab Emirates */
  AE = "AE",
  /** Afghanistan */
  AF = "AF",
  /** Antigua & Barbuda */
  AG = "AG",
  /** Anguilla */
  AI = "AI",
  /** Albania */
  AL = "AL",
  /** Armenia */
  AM = "AM",
  /** Netherlands Antilles */
  AN = "AN",
  /** Angola */
  AO = "AO",
  /** Antarctica */
  AQ = "AQ",
  /** Argentina */
  AR = "AR",
  /** American Samoa */
  AS = "AS",
  /** Austria */
  AT = "AT",
  /** Australia */
  AU = "AU",
  /** Aruba */
  AW = "AW",
  /** Åland Islands */
  AX = "AX",
  /** Azerbaijan */
  AZ = "AZ",
  /** Bosnia & Herzegovina */
  BA = "BA",
  /** Barbados */
  BB = "BB",
  /** Bangladesh */
  BD = "BD",
  /** Belgium */
  BE = "BE",
  /** Burkina Faso */
  BF = "BF",
  /** Bulgaria */
  BG = "BG",
  /** Bahrain */
  BH = "BH",
  /** Burundi */
  BI = "BI",
  /** Benin */
  BJ = "BJ",
  /** St. Barthélemy */
  BL = "BL",
  /** Bermuda */
  BM = "BM",
  /** Brunei */
  BN = "BN",
  /** Bolivia */
  BO = "BO",
  /** Brazil */
  BR = "BR",
  /** Bahamas */
  BS = "BS",
  /** Bhutan */
  BT = "BT",
  /** Bouvet Island */
  BV = "BV",
  /** Botswana */
  BW = "BW",
  /** Belarus */
  BY = "BY",
  /** Belize */
  BZ = "BZ",
  /** Canada */
  CA = "CA",
  /** Cocos (Keeling) Islands */
  CC = "CC",
  /** Congo-Kinshasa */
  CD = "CD",
  /** Central African Republic */
  CF = "CF",
  /** Congo-Brazzaville */
  CG = "CG",
  /** Switzerland */
  CH = "CH",
  /** Côte d’Ivoire */
  CI = "CI",
  /** Cook Islands */
  CK = "CK",
  /** Chile */
  CL = "CL",
  /** Cameroon */
  CM = "CM",
  /** China */
  CN = "CN",
  /** Colombia */
  CO = "CO",
  /** Costa Rica */
  CR = "CR",
  /** Cuba */
  CU = "CU",
  /** Cape Verde */
  CV = "CV",
  /** Christmas Island */
  CX = "CX",
  /** Cyprus */
  CY = "CY",
  /** Czech Republic */
  CZ = "CZ",
  /** Germany */
  DE = "DE",
  /** Djibouti */
  DJ = "DJ",
  /** Denmark */
  DK = "DK",
  /** Dominica */
  DM = "DM",
  /** Dominican Republic */
  DO = "DO",
  /** Algeria */
  DZ = "DZ",
  /** Ecuador */
  EC = "EC",
  /** Estonia */
  EE = "EE",
  /** Egypt */
  EG = "EG",
  /** Western Sahara */
  EH = "EH",
  /** Eritrea */
  ER = "ER",
  /** Spain */
  ES = "ES",
  /** Ethiopia */
  ET = "ET",
  /** Finland */
  FI = "FI",
  /** Fiji */
  FJ = "FJ",
  /** Falkland Islands */
  FK = "FK",
  /** Micronesia */
  FM = "FM",
  /** Faroe Islands */
  FO = "FO",
  /** France */
  FR = "FR",
  /** Gabon */
  GA = "GA",
  /** United Kingdom */
  GB = "GB",
  /** Grenada */
  GD = "GD",
  /** Georgia */
  GE = "GE",
  /** French Guiana */
  GF = "GF",
  /** Guernsey */
  GG = "GG",
  /** Ghana */
  GH = "GH",
  /** Gibraltar */
  GI = "GI",
  /** Greenland */
  GL = "GL",
  /** Gambia */
  GM = "GM",
  /** Guinea */
  GN = "GN",
  /** Guadeloupe */
  GP = "GP",
  /** Equatorial Guinea */
  GQ = "GQ",
  /** Greece */
  GR = "GR",
  /** South Georgia & South Sandwich Islands */
  GS = "GS",
  /** Guatemala */
  GT = "GT",
  /** Guam */
  GU = "GU",
  /** Guinea-Bissau */
  GW = "GW",
  /** Guyana */
  GY = "GY",
  /** Hong Kong SAR China */
  HK = "HK",
  /** Heard &amp; McDonald Islands */
  HM = "HM",
  /** Honduras */
  HN = "HN",
  /** Croatia */
  HR = "HR",
  /** Haiti */
  HT = "HT",
  /** Hungary */
  HU = "HU",
  /** Indonesia */
  ID = "ID",
  /** Ireland */
  IE = "IE",
  /** Israel */
  IL = "IL",
  /** Isle of Man */
  IM = "IM",
  /** India */
  IN = "IN",
  /** British Indian Ocean Territory */
  IO = "IO",
  /** Iraq */
  IQ = "IQ",
  /** Iran */
  IR = "IR",
  /** Iceland */
  IS = "IS",
  /** Italy */
  IT = "IT",
  /** Jersey */
  JE = "JE",
  /** Jamaica */
  JM = "JM",
  /** Jordan */
  JO = "JO",
  /** Japan */
  JP = "JP",
  /** Kenya */
  KE = "KE",
  /** Kyrgyzstan */
  KG = "KG",
  /** Cambodia */
  KH = "KH",
  /** Kiribati */
  KI = "KI",
  /** Comoros */
  KM = "KM",
  /** St. Kitts & Nevis */
  KN = "KN",
  /** North Korea */
  KP = "KP",
  /** South Korea */
  KR = "KR",
  /** Kuwait */
  KW = "KW",
  /** Cayman Islands */
  KY = "KY",
  /** Kazakhstan */
  KZ = "KZ",
  /** Laos */
  LA = "LA",
  /** Lebanon */
  LB = "LB",
  /** St. Lucia */
  LC = "LC",
  /** Liechtenstein */
  LI = "LI",
  /** Sri Lanka */
  LK = "LK",
  /** Liberia */
  LR = "LR",
  /** Lesotho */
  LS = "LS",
  /** Lithuania */
  LT = "LT",
  /** Luxembourg */
  LU = "LU",
  /** Latvia */
  LV = "LV",
  /** Libya */
  LY = "LY",
  /** Morocco */
  MA = "MA",
  /** Monaco */
  MC = "MC",
  /** Moldova */
  MD = "MD",
  /** Montenegro */
  ME = "ME",
  /** St. Martin */
  MF = "MF",
  /** Madagascar */
  MG = "MG",
  /** Marshall Islands */
  MH = "MH",
  /** Macedonia */
  MK = "MK",
  /** Mali */
  ML = "ML",
  /** Myanmar (Burma) */
  MM = "MM",
  /** Mongolia */
  MN = "MN",
  /** Macau SAR China */
  MO = "MO",
  /** Northern Mariana Islands */
  MP = "MP",
  /** Martinique */
  MQ = "MQ",
  /** Mauritania */
  MR = "MR",
  /** Montserrat */
  MS = "MS",
  /** Malta */
  MT = "MT",
  /** Mauritius */
  MU = "MU",
  /** Maldives */
  MV = "MV",
  /** Malawi */
  MW = "MW",
  /** Mexico */
  MX = "MX",
  /** Malaysia */
  MY = "MY",
  /** Mozambique */
  MZ = "MZ",
  /** Namibia */
  NA = "NA",
  /** New Caledonia */
  NC = "NC",
  /** Niger */
  NE = "NE",
  /** Norfolk Island */
  NF = "NF",
  /** Nigeria */
  NG = "NG",
  /** Nicaragua */
  NI = "NI",
  /** Netherlands */
  NL = "NL",
  /** Norway */
  NO = "NO",
  /** Nepal */
  NP = "NP",
  /** Nauru */
  NR = "NR",
  /** Niue */
  NU = "NU",
  /** New Zealand */
  NZ = "NZ",
  /** Oman */
  OM = "OM",
  /** Panama */
  PA = "PA",
  /** Peru */
  PE = "PE",
  /** French Polynesia */
  PF = "PF",
  /** Papua New Guinea */
  PG = "PG",
  /** Philippines */
  PH = "PH",
  /** Pakistan */
  PK = "PK",
  /** Poland */
  PL = "PL",
  /** St. Pierre & Miquelon */
  PM = "PM",
  /** Pitcairn Islands */
  PN = "PN",
  /** Palestinian Territories */
  PS = "PS",
  /** Portugal */
  PT = "PT",
  /** Palau */
  PW = "PW",
  /** Paraguay */
  PY = "PY",
  /** Qatar */
  QA = "QA",
  /** Réunion */
  RE = "RE",
  /** Romania */
  RO = "RO",
  /** Serbia */
  RS = "RS",
  /** Russia */
  RU = "RU",
  /** Rwanda */
  RW = "RW",
  /** Saudi Arabia */
  SA = "SA",
  /** Solomon Islands */
  SB = "SB",
  /** Seychelles */
  SC = "SC",
  /** Sudan */
  SD = "SD",
  /** Sweden */
  SE = "SE",
  /** Singapore */
  SG = "SG",
  /** St. Helena */
  SH = "SH",
  /** Slovenia */
  SI = "SI",
  /** Svalbard & Jan Mayen */
  SJ = "SJ",
  /** Slovakia */
  SK = "SK",
  /** Sierra Leone */
  SL = "SL",
  /** San Marino */
  SM = "SM",
  /** Senegal */
  SN = "SN",
  /** Somalia */
  SO = "SO",
  /** Suriname */
  SR = "SR",
  /** São Tomé & Príncipe */
  ST = "ST",
  /** El Salvador */
  SV = "SV",
  /** Syria */
  SY = "SY",
  /** Eswatini */
  SZ = "SZ",
  /** Turks & Caicos Islands */
  TC = "TC",
  /** Chad */
  TD = "TD",
  /** French Southern Territories */
  TF = "TF",
  /** Togo */
  TG = "TG",
  /** Thailand */
  TH = "TH",
  /** Tajikistan */
  TJ = "TJ",
  /** Tokelau */
  TK = "TK",
  /** Timor-Leste */
  TL = "TL",
  /** Turkmenistan */
  TM = "TM",
  /** Tunisia */
  TN = "TN",
  /** Tonga */
  TO = "TO",
  /** Turkey */
  TR = "TR",
  /** Trinidad & Tobago */
  TT = "TT",
  /** Tuvalu */
  TV = "TV",
  /** Taiwan */
  TW = "TW",
  /** Tanzania */
  TZ = "TZ",
  /** Ukraine */
  UA = "UA",
  /** Uganda */
  UG = "UG",
  /** U.S. Outlying Islands */
  UM = "UM",
  /** United States */
  US = "US",
  /** Uruguay */
  UY = "UY",
  /** Uzbekistan */
  UZ = "UZ",
  /** Vatican City */
  VA = "VA",
  /** St. Vincent & Grenadines */
  VC = "VC",
  /** Venezuela */
  VE = "VE",
  /** British Virgin Islands */
  VG = "VG",
  /** U.S. Virgin Islands */
  VI = "VI",
  /** Vietnam */
  VN = "VN",
  /** Vanuatu */
  VU = "VU",
  /** Wallis & Futuna */
  WF = "WF",
  /** Samoa */
  WS = "WS",
  /** Yemen */
  YE = "YE",
  /** Mayotte */
  YT = "YT",
  /** South Africa */
  ZA = "ZA",
  /** Zambia */
  ZM = "ZM",
  /** Zimbabwe */
  ZW = "ZW",
}

/** Contains an array of product IDs to use for creating a compare list. */
export interface CreateCompareListInput {
  /** An array of product IDs to add to the compare list. */
  products?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
}

export interface CreateGuestCartInput {
  /** Optional client-generated ID */
  cart_uid?: InputMaybe<Scalars["ID"]["input"]>;
}

/** Contains payment order details that are used while processing the payment order */
export interface CreatePaymentOrderInput {
  /** The customer cart ID */
  cartId: Scalars["String"]["input"];
  /** Defines the origin location for that payment request */
  location: PaymentLocation;
  /** The code for the payment method used in the order */
  methodCode: Scalars["String"]["input"];
  /** The identifiable payment source for the payment method */
  paymentSource: Scalars["String"]["input"];
  /** Indicates whether the payment information should be vaulted */
  vaultIntent?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** Defines a new product review. */
export interface CreateProductReviewInput {
  /** The customer's nickname. Defaults to the customer name, if logged in. */
  nickname: Scalars["String"]["input"];
  /** The ratings details by category. For example, Price: 5 stars, Quality: 4 stars, etc. */
  ratings: Array<InputMaybe<ProductReviewRatingInput>>;
  /** The SKU of the reviewed product. */
  sku: Scalars["String"]["input"];
  /** The summary (title) of the review. */
  summary: Scalars["String"]["input"];
  /** The review text. */
  text: Scalars["String"]["input"];
}

/** Describe the variables needed to create a vault payment token */
export interface CreateVaultCardPaymentTokenInput {
  /** Description of the vaulted card */
  card_description?: InputMaybe<Scalars["String"]["input"]>;
  /** The setup token obtained by the createVaultCardSetupToken endpoint */
  setup_token_id: Scalars["String"]["input"];
}

/** Describe the variables needed to create a vault card setup token */
export interface CreateVaultCardSetupTokenInput {
  /** The setup token information */
  setup_token: VaultSetupTokenInput;
  /** The 3DS mode */
  three_ds_mode?: InputMaybe<ThreeDSMode>;
}

/** Required fields for Payflow Pro and Payments Pro credit card payments. */
export interface CreditCardDetailsInput {
  /** The credit card expiration month. */
  cc_exp_month: Scalars["Int"]["input"];
  /** The credit card expiration year. */
  cc_exp_year: Scalars["Int"]["input"];
  /** The last 4 digits of the credit card. */
  cc_last_4: Scalars["Int"]["input"];
  /** The credit card type. */
  cc_type: Scalars["String"]["input"];
}

/** The list of available currency codes. */
export enum CurrencyEnum {
  AED = "AED",
  AFN = "AFN",
  ALL = "ALL",
  AMD = "AMD",
  ANG = "ANG",
  AOA = "AOA",
  ARS = "ARS",
  AUD = "AUD",
  AWG = "AWG",
  AZM = "AZM",
  AZN = "AZN",
  BAM = "BAM",
  BBD = "BBD",
  BDT = "BDT",
  BGN = "BGN",
  BHD = "BHD",
  BIF = "BIF",
  BMD = "BMD",
  BND = "BND",
  BOB = "BOB",
  BRL = "BRL",
  BSD = "BSD",
  BTN = "BTN",
  BUK = "BUK",
  BWP = "BWP",
  BYN = "BYN",
  BZD = "BZD",
  CAD = "CAD",
  CDF = "CDF",
  CHE = "CHE",
  CHF = "CHF",
  CHW = "CHW",
  CLP = "CLP",
  CNY = "CNY",
  COP = "COP",
  CRC = "CRC",
  CUP = "CUP",
  CVE = "CVE",
  CZK = "CZK",
  DJF = "DJF",
  DKK = "DKK",
  DOP = "DOP",
  DZD = "DZD",
  EEK = "EEK",
  EGP = "EGP",
  ERN = "ERN",
  ETB = "ETB",
  EUR = "EUR",
  FJD = "FJD",
  FKP = "FKP",
  GBP = "GBP",
  GEK = "GEK",
  GEL = "GEL",
  GHS = "GHS",
  GIP = "GIP",
  GMD = "GMD",
  GNF = "GNF",
  GQE = "GQE",
  GTQ = "GTQ",
  GYD = "GYD",
  HKD = "HKD",
  HNL = "HNL",
  HRK = "HRK",
  HTG = "HTG",
  HUF = "HUF",
  IDR = "IDR",
  ILS = "ILS",
  INR = "INR",
  IQD = "IQD",
  IRR = "IRR",
  ISK = "ISK",
  JMD = "JMD",
  JOD = "JOD",
  JPY = "JPY",
  KES = "KES",
  KGS = "KGS",
  KHR = "KHR",
  KMF = "KMF",
  KPW = "KPW",
  KRW = "KRW",
  KWD = "KWD",
  KYD = "KYD",
  KZT = "KZT",
  LAK = "LAK",
  LBP = "LBP",
  LKR = "LKR",
  LRD = "LRD",
  LSL = "LSL",
  LSM = "LSM",
  LTL = "LTL",
  LVL = "LVL",
  LYD = "LYD",
  MAD = "MAD",
  MDL = "MDL",
  MGA = "MGA",
  MKD = "MKD",
  MMK = "MMK",
  MNT = "MNT",
  MOP = "MOP",
  MRO = "MRO",
  MUR = "MUR",
  MVR = "MVR",
  MWK = "MWK",
  MXN = "MXN",
  MYR = "MYR",
  MZN = "MZN",
  NAD = "NAD",
  NGN = "NGN",
  NIC = "NIC",
  NOK = "NOK",
  NPR = "NPR",
  NZD = "NZD",
  OMR = "OMR",
  PAB = "PAB",
  PEN = "PEN",
  PGK = "PGK",
  PHP = "PHP",
  PKR = "PKR",
  PLN = "PLN",
  PYG = "PYG",
  QAR = "QAR",
  RHD = "RHD",
  ROL = "ROL",
  RON = "RON",
  RSD = "RSD",
  RUB = "RUB",
  RWF = "RWF",
  SAR = "SAR",
  SBD = "SBD",
  SCR = "SCR",
  SDG = "SDG",
  SEK = "SEK",
  SGD = "SGD",
  SHP = "SHP",
  SKK = "SKK",
  SLL = "SLL",
  SOS = "SOS",
  SRD = "SRD",
  STD = "STD",
  SVC = "SVC",
  SYP = "SYP",
  SZL = "SZL",
  THB = "THB",
  TJS = "TJS",
  TMM = "TMM",
  TND = "TND",
  TOP = "TOP",
  TRL = "TRL",
  TRY = "TRY",
  TTD = "TTD",
  TWD = "TWD",
  TZS = "TZS",
  UAH = "UAH",
  UGX = "UGX",
  USD = "USD",
  UYU = "UYU",
  UZS = "UZS",
  VEB = "VEB",
  VEF = "VEF",
  VND = "VND",
  VUV = "VUV",
  WST = "WST",
  XCD = "XCD",
  XOF = "XOF",
  XPF = "XPF",
  YER = "YER",
  YTL = "YTL",
  ZAR = "ZAR",
  ZMK = "ZMK",
  ZWD = "ZWD",
}

/** Specifies the attribute code and value of a customer attribute. */
export interface CustomerAddressAttributeInput {
  /** The name assigned to the attribute. */
  attribute_code: Scalars["String"]["input"];
  /** The value assigned to the attribute. */
  value: Scalars["String"]["input"];
}

/** Contains details about a billing or shipping address. */
export interface CustomerAddressInput {
  /** The customer's city or town. */
  city?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's company. */
  company?: InputMaybe<Scalars["String"]["input"]>;
  /** The two-letter code representing the customer's country. */
  country_code?: InputMaybe<CountryCodeEnum>;
  /** Deprecated: use `country_code` instead. */
  country_id?: InputMaybe<CountryCodeEnum>;
  /** Deprecated. Use custom_attributesV2 instead. */
  custom_attributes?: InputMaybe<Array<InputMaybe<CustomerAddressAttributeInput>>>;
  /** Custom attributes assigned to the customer address. */
  custom_attributesV2?: InputMaybe<Array<InputMaybe<AttributeValueInput>>>;
  /** Indicates whether the address is the default billing address. */
  default_billing?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Indicates whether the address is the default shipping address. */
  default_shipping?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** The customer's fax number. */
  fax?: InputMaybe<Scalars["String"]["input"]>;
  /** The first name of the person associated with the billing/shipping address. */
  firstname?: InputMaybe<Scalars["String"]["input"]>;
  /** The family name of the person associated with the billing/shipping address. */
  lastname?: InputMaybe<Scalars["String"]["input"]>;
  /** The middle name of the person associated with the billing/shipping address. */
  middlename?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's ZIP or postal code. */
  postcode?: InputMaybe<Scalars["String"]["input"]>;
  /** An honorific, such as Dr., Mr., or Mrs. */
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  /** An object containing the region name, region code, and region ID. */
  region?: InputMaybe<CustomerAddressRegionInput>;
  /** An array of strings that define the street number and name. */
  street?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** A value such as Sr., Jr., or III. */
  suffix?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's telephone number. */
  telephone?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's Tax/VAT number (for corporate customers). */
  vat_id?: InputMaybe<Scalars["String"]["input"]>;
}

/** Defines the customer's state or province. */
export interface CustomerAddressRegionInput {
  /** The state or province name. */
  region?: InputMaybe<Scalars["String"]["input"]>;
  /** The address region code. */
  region_code?: InputMaybe<Scalars["String"]["input"]>;
  /** The unique ID for a pre-defined region. */
  region_id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** An input object for creating a customer. */
export interface CustomerCreateInput {
  /** Indicates whether the customer has enabled remote shopping assistance. */
  allow_remote_shopping_assistance?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** The customer's custom attributes. */
  custom_attributes?: InputMaybe<Array<InputMaybe<AttributeValueInput>>>;
  /** The customer's date of birth. */
  date_of_birth?: InputMaybe<Scalars["String"]["input"]>;
  /** Deprecated: Use `date_of_birth` instead. */
  dob?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's email address. */
  email: Scalars["String"]["input"];
  /** The customer's first name. */
  firstname: Scalars["String"]["input"];
  /** The customer's gender (Male - 1, Female - 2). */
  gender?: InputMaybe<Scalars["Int"]["input"]>;
  /** Indicates whether the customer is subscribed to the company's newsletter. */
  is_subscribed?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** The customer's family name. */
  lastname: Scalars["String"]["input"];
  /** The customer's middle name. */
  middlename?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's password. */
  password?: InputMaybe<Scalars["String"]["input"]>;
  /** An honorific, such as Dr., Mr., or Mrs. */
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  /** A value such as Sr., Jr., or III. */
  suffix?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's Tax/VAT number (for corporate customers). */
  taxvat?: InputMaybe<Scalars["String"]["input"]>;
}

/** An input object that assigns or updates customer attributes. */
export interface CustomerInput {
  /** The customer's date of birth. */
  date_of_birth?: InputMaybe<Scalars["String"]["input"]>;
  /** Deprecated: Use `date_of_birth` instead. */
  dob?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's email address. Required when creating a customer. */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's first name. */
  firstname?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's gender (Male - 1, Female - 2). */
  gender?: InputMaybe<Scalars["Int"]["input"]>;
  /** Indicates whether the customer is subscribed to the company's newsletter. */
  is_subscribed?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** The customer's family name. */
  lastname?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's middle name. */
  middlename?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's password. */
  password?: InputMaybe<Scalars["String"]["input"]>;
  /** An honorific, such as Dr., Mr., or Mrs. */
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  /** A value such as Sr., Jr., or III. */
  suffix?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's Tax/VAT number (for corporate customers). */
  taxvat?: InputMaybe<Scalars["String"]["input"]>;
}

/** CustomerOrderSortInput specifies the field to use for sorting search results and indicates whether the results are sorted in ascending or descending order. */
export interface CustomerOrderSortInput {
  /** This enumeration indicates whether to return results in ascending or descending order */
  sort_direction: SortEnum;
  /** Specifies the field to use for sorting */
  sort_field: CustomerOrderSortableField;
}

/** Specifies the field to use for sorting */
export enum CustomerOrderSortableField {
  /** Sorts customer orders by created_at field */
  CREATED_AT = "CREATED_AT",
  /** Sorts customer orders by number */
  NUMBER = "NUMBER",
}

/** Identifies the filter to use for filtering orders. */
export interface CustomerOrdersFilterInput {
  /** Filters by order number. */
  number?: InputMaybe<FilterStringTypeInput>;
}

/** An input object for updating a customer. */
export interface CustomerUpdateInput {
  /** Indicates whether the customer has enabled remote shopping assistance. */
  allow_remote_shopping_assistance?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** The customer's custom attributes. */
  custom_attributes?: InputMaybe<Array<InputMaybe<AttributeValueInput>>>;
  /** The customer's date of birth. */
  date_of_birth?: InputMaybe<Scalars["String"]["input"]>;
  /** Deprecated: Use `date_of_birth` instead. */
  dob?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's first name. */
  firstname?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's gender (Male - 1, Female - 2). */
  gender?: InputMaybe<Scalars["Int"]["input"]>;
  /** Indicates whether the customer is subscribed to the company's newsletter. */
  is_subscribed?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** The customer's family name. */
  lastname?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's middle name. */
  middlename?: InputMaybe<Scalars["String"]["input"]>;
  /** An honorific, such as Dr., Mr., or Mrs. */
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  /** A value such as Sr., Jr., or III. */
  suffix?: InputMaybe<Scalars["String"]["input"]>;
  /** The customer's Tax/VAT number (for corporate customers). */
  taxvat?: InputMaybe<Scalars["String"]["input"]>;
}

/** Defines the customizable date type. */
export enum CustomizableDateTypeEnum {
  DATE = "DATE",
  DATE_TIME = "DATE_TIME",
  TIME = "TIME",
}

/** Defines a customizable option. */
export interface CustomizableOptionInput {
  /** The customizable option ID of the product. */
  id?: InputMaybe<Scalars["Int"]["input"]>;
  /** The unique ID for a `CartItemInterface` object. */
  uid?: InputMaybe<Scalars["ID"]["input"]>;
  /** The string value of the option. */
  value_string: Scalars["String"]["input"];
}

export enum DownloadableFileTypeEnum {
  /** @deprecated `sample_url` serves to get the downloadable sample */
  FILE = "FILE",
  /** @deprecated `sample_url` serves to get the downloadable sample */
  URL = "URL",
}

/** Defines a single downloadable product. */
export interface DownloadableProductCartItemInput {
  /** The ID and value of the option. */
  customizable_options?: InputMaybe<Array<InputMaybe<CustomizableOptionInput>>>;
  /** The quantity and SKU of the downloadable product. */
  data: CartItemInput;
  /** An array of objects containing the link_id of the downloadable product link. */
  downloadable_product_links?: InputMaybe<Array<InputMaybe<DownloadableProductLinksInput>>>;
}

/** Contains the link ID for the downloadable product. */
export interface DownloadableProductLinksInput {
  /** The unique ID of the downloadable product link. */
  link_id: Scalars["Int"]["input"];
}

/** Defines a customer-entered option. */
export interface EnteredOptionInput {
  /** The unique ID for a `CustomizableOptionInterface` object, such as a `CustomizableFieldOption`, `CustomizableFileOption`, or `CustomizableAreaOption` object. */
  uid: Scalars["ID"]["input"];
  /** Text the customer entered. */
  value: Scalars["String"]["input"];
}

/** Contains details about an address. */
export interface EstimateAddressInput {
  /** The two-letter code representing the customer's country. */
  country_code: CountryCodeEnum;
  /** The customer's ZIP or postal code. */
  postcode?: InputMaybe<Scalars["String"]["input"]>;
  /** An object containing the region name, region code, and region ID. */
  region?: InputMaybe<CustomerAddressRegionInput>;
}

export interface EstimateTotalsInput {
  /** Customer's address to estimate totals. */
  address: EstimateAddressInput;
  /** The unique ID of the cart to query. */
  cart_id: Scalars["String"]["input"];
  /** Selected shipping method to estimate totals. */
  shipping_method?: InputMaybe<ShippingMethodInput>;
}

/** Fastlane Payment inputs */
export interface FastlaneMethodInput {
  /** The payment source for the payment method */
  payment_source?: InputMaybe<Scalars["String"]["input"]>;
  /** The single use token from Fastlane */
  paypal_fastlane_token?: InputMaybe<Scalars["String"]["input"]>;
}

/** Defines a filter that matches the input exactly. */
export interface FilterEqualTypeInput {
  /** Use this attribute to exactly match the specified string. For example, to filter on a specific category ID, specify a value such as `5`. */
  eq?: InputMaybe<Scalars["String"]["input"]>;
  /** Use this attribute to filter on an array of values. For example, to filter on category IDs 4, 5, and 6, specify a value of `["4", "5", "6"]`. */
  in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
}

export enum FilterMatchTypeEnum {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
}

/** Defines a filter that performs a fuzzy search. */
export interface FilterMatchTypeInput {
  /** Use this attribute to fuzzy match the specified string. For example, to filter on a specific SKU, specify a value such as `24-MB01`. */
  match?: InputMaybe<Scalars["String"]["input"]>;
  /** Filter match type for fine-tuned results. Possible values FULL or PARTIAL. If match_type is not provided, returned results will default to FULL match. */
  match_type?: InputMaybe<FilterMatchTypeEnum>;
}

/** Defines a filter that matches a range of values, such as prices or dates. */
export interface FilterRangeTypeInput {
  /** Use this attribute to specify the lowest possible value in the range. */
  from?: InputMaybe<Scalars["String"]["input"]>;
  /** Use this attribute to specify the highest possible value in the range. */
  to?: InputMaybe<Scalars["String"]["input"]>;
}

/** Defines a filter for an input string. */
export interface FilterStringTypeInput {
  /** Filters items that are exactly the same as the specified string. */
  eq?: InputMaybe<Scalars["String"]["input"]>;
  /** Filters items that are exactly the same as entries specified in an array of strings. */
  in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** Defines a filter that performs a fuzzy search using the specified string. */
  match?: InputMaybe<Scalars["String"]["input"]>;
}

/** Defines the comparison operators that can be used in a filter. */
export interface FilterTypeInput {
  /** Equals. */
  eq?: InputMaybe<Scalars["String"]["input"]>;
  finset?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** From. Must be used with the `to` field. */
  from?: InputMaybe<Scalars["String"]["input"]>;
  /** Greater than. */
  gt?: InputMaybe<Scalars["String"]["input"]>;
  /** Greater than or equal to. */
  gteq?: InputMaybe<Scalars["String"]["input"]>;
  /** In. The value can contain a set of comma-separated values. */
  in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** Like. The specified value can contain % (percent signs) to allow matching of 0 or more characters. */
  like?: InputMaybe<Scalars["String"]["input"]>;
  /** Less than. */
  lt?: InputMaybe<Scalars["String"]["input"]>;
  /** Less than or equal to. */
  lteq?: InputMaybe<Scalars["String"]["input"]>;
  /** More than or equal to. */
  moreq?: InputMaybe<Scalars["String"]["input"]>;
  /** Not equal to. */
  neq?: InputMaybe<Scalars["String"]["input"]>;
  /** Not in. The value can contain a set of comma-separated values. */
  nin?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** Not null. */
  notnull?: InputMaybe<Scalars["String"]["input"]>;
  /** Is null. */
  null?: InputMaybe<Scalars["String"]["input"]>;
  /** To. Must be used with the `from` field. */
  to?: InputMaybe<Scalars["String"]["input"]>;
}

/** Identifies which customer requires remote shopping assistance. */
export interface GenerateCustomerTokenAsAdminInput {
  /** The email address of the customer requesting remote shopping assistance. */
  customer_email: Scalars["String"]["input"];
}

/** Contains the text of a gift message, its sender, and recipient */
export interface GiftMessageInput {
  /** Sender name */
  from: Scalars["String"]["input"];
  /** Gift message text */
  message: Scalars["String"]["input"];
  /** Recipient name */
  to: Scalars["String"]["input"];
}

/** Google Pay inputs */
export interface GooglePayMethodInput {
  /** The payment source for the payment method */
  payment_source?: InputMaybe<Scalars["String"]["input"]>;
  /** The payment services order ID */
  payments_order_id?: InputMaybe<Scalars["String"]["input"]>;
  /** PayPal order ID */
  paypal_order_id?: InputMaybe<Scalars["String"]["input"]>;
}

/** Hosted Fields payment inputs */
export interface HostedFieldsInput {
  /** Card bin number */
  cardBin?: InputMaybe<Scalars["String"]["input"]>;
  /** Expiration month of the card */
  cardExpiryMonth?: InputMaybe<Scalars["String"]["input"]>;
  /** Expiration year of the card */
  cardExpiryYear?: InputMaybe<Scalars["String"]["input"]>;
  /** Last four digits of the card */
  cardLast4?: InputMaybe<Scalars["String"]["input"]>;
  /** Name on the card */
  holderName?: InputMaybe<Scalars["String"]["input"]>;
  /** Indicates whether details about the shopper's credit/debit card should be tokenized for later usage. Required only if Vault is enabled for the Payment Services payment integration. */
  is_active_payment_token_enabler?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** The payment source for the payment method */
  payment_source?: InputMaybe<Scalars["String"]["input"]>;
  /** The payment services order ID */
  payments_order_id?: InputMaybe<Scalars["String"]["input"]>;
  /** PayPal order ID */
  paypal_order_id?: InputMaybe<Scalars["String"]["input"]>;
}

/** Contains a set of relative URLs that PayPal uses in response to various actions during the authorization process. Magento prepends the base URL to this value to create a full URL. For example, if the full URL is https://www.example.com/path/to/page.html, the relative URL is path/to/page.html. Use this input for Payments Pro Hosted Solution payment method. */
export interface HostedProInput {
  /** The relative URL of the page that PayPal redirects to when the buyer cancels the transaction in order to choose a different payment method. For example, if the full URL to this page is https://www.example.com/paypal/action/cancel.html, the relative URL is paypal/action/cancel.html. */
  cancel_url: Scalars["String"]["input"];
  /** The relative URL of the final confirmation page that PayPal redirects to upon payment success. For example, if the full URL to this page is https://www.example.com/paypal/action/return.html, the relative URL is paypal/action/return.html. */
  return_url: Scalars["String"]["input"];
}

/** Contains the required input to request the secure URL for Payments Pro Hosted Solution payment. */
export interface HostedProUrlInput {
  /** The unique ID that identifies the shopper's cart. */
  cart_id: Scalars["String"]["input"];
}

/** List of templates/filters applied to customer attribute input. */
export enum InputFilterEnum {
  /** Forces attribute input to follow the date format. */
  DATE = "DATE",
  /** Escape HTML Entities. */
  ESCAPEHTML = "ESCAPEHTML",
  /** There are no templates or filters to be applied. */
  NONE = "NONE",
  /** Strip HTML Tags. */
  STRIPTAGS = "STRIPTAGS",
  /** Strip whitespace (or other characters) from the beginning and end of the input. */
  TRIM = "TRIM",
}

/** Input to retrieve an order based on details. */
export interface OrderInformationInput {
  /** Order billing address email. */
  email: Scalars["String"]["input"];
  /** Order number. */
  number: Scalars["String"]["input"];
  /** Order billing address postcode. */
  postcode: Scalars["String"]["input"];
}

/** Input to retrieve an order based on token. */
export interface OrderTokenInput {
  /** Order token. */
  token: Scalars["String"]["input"];
}

/** Contains required input for Payflow Express Checkout payments. */
export interface PayflowExpressInput {
  /** The unique ID of the PayPal user. */
  payer_id: Scalars["String"]["input"];
  /** The token returned by the createPaypalExpressToken mutation. */
  token: Scalars["String"]["input"];
}

/** A set of relative URLs that PayPal uses in response to various actions during the authorization process. Adobe Commerce prepends the base URL to this value to create a full URL. For example, if the full URL is https://www.example.com/path/to/page.html, the relative URL is path/to/page.html. Use this input for Payflow Link and Payments Advanced payment methods. */
export interface PayflowLinkInput {
  /** The relative URL of the page that PayPal redirects to when the buyer cancels the transaction in order to choose a different payment method. If the full URL to this page is https://www.example.com/paypal/action/cancel.html, the relative URL is paypal/action/cancel.html. */
  cancel_url: Scalars["String"]["input"];
  /** The relative URL of the transaction error page that PayPal redirects to upon payment error. If the full URL to this page is https://www.example.com/paypal/action/error.html, the relative URL is paypal/action/error.html. */
  error_url: Scalars["String"]["input"];
  /** The relative URL of the order confirmation page that PayPal redirects to when the payment is successful and additional confirmation is not needed. If the full URL to this page is https://www.example.com/paypal/action/return.html, the relative URL is paypal/action/return.html. */
  return_url: Scalars["String"]["input"];
}

/** Indicates the mode for payment. Applies to the Payflow Link and Payments Advanced payment methods. */
export enum PayflowLinkMode {
  LIVE = "LIVE",
  TEST = "TEST",
}

/** Contains information required to fetch payment token information for the Payflow Link and Payments Advanced payment methods. */
export interface PayflowLinkTokenInput {
  /** The unique ID that identifies the customer's cart. */
  cart_id: Scalars["String"]["input"];
}

/** Contains input for the Payflow Pro and Payments Pro payment methods. */
export interface PayflowProInput {
  /** Required input for credit card related information. */
  cc_details: CreditCardDetailsInput;
  /** Indicates whether details about the shopper's credit/debit card should be tokenized for later usage. Required only if Vault is enabled for the PayPal Payflow Pro payment integration. */
  is_active_payment_token_enabler?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** Input required to complete payment. Applies to Payflow Pro and Payments Pro payment methods. */
export interface PayflowProResponseInput {
  /** The unique ID that identifies the shopper's cart. */
  cart_id: Scalars["String"]["input"];
  /** The payload returned from PayPal. */
  paypal_payload: Scalars["String"]["input"];
}

/** Contains input required to fetch payment token information for the Payflow Pro and Payments Pro payment methods. */
export interface PayflowProTokenInput {
  /** The unique ID that identifies the shopper's cart. */
  cart_id: Scalars["String"]["input"];
  /** A set of relative URLs that PayPal uses for callback. */
  urls: PayflowProUrlInput;
}

/** Contains a set of relative URLs that PayPal uses in response to various actions during the authorization process. Magento prepends the base URL to this value to create a full URL. For example, if the full URL is https://www.example.com/path/to/page.html, the relative URL is path/to/page.html. Use this input for the Payflow Pro and Payment Pro payment methods. */
export interface PayflowProUrlInput {
  /** The relative URL of the page that PayPal redirects to when the buyer cancels the transaction in order to choose a different payment method. If the full URL to this page is https://www.example.com/paypal/action/cancel.html, the relative URL is paypal/action/cancel.html. */
  cancel_url: Scalars["String"]["input"];
  /** The relative URL of the transaction error page that PayPal redirects to upon payment error. If the full URL to this page is https://www.example.com/paypal/action/error.html, the relative URL is paypal/action/error.html. */
  error_url: Scalars["String"]["input"];
  /** The relative URL of the final confirmation page that PayPal redirects to upon payment success. If the full URL to this page is https://www.example.com/paypal/action/return.html, the relative URL is paypal/action/return.html. */
  return_url: Scalars["String"]["input"];
}

/** Defines the origin location for that payment request */
export enum PaymentLocation {
  ADMIN = "ADMIN",
  CART = "CART",
  CHECKOUT = "CHECKOUT",
  MINICART = "MINICART",
  PRODUCT_DETAIL = "PRODUCT_DETAIL",
}

/** Defines the payment method. */
export interface PaymentMethodInput {
  /** The internal name for the payment method. */
  code: Scalars["String"]["input"];
  /** Required input for PayPal Hosted pro payments. */
  hosted_pro?: InputMaybe<HostedProInput>;
  /** Required input for Payflow Express Checkout payments. */
  payflow_express?: InputMaybe<PayflowExpressInput>;
  /** Required input for PayPal Payflow Link and Payments Advanced payments. */
  payflow_link?: InputMaybe<PayflowLinkInput>;
  /** Required input for PayPal Payflow Pro and Payment Pro payments. */
  payflowpro?: InputMaybe<PayflowProInput>;
  /** Required input for PayPal Payflow Pro vault payments. */
  payflowpro_cc_vault?: InputMaybe<VaultTokenInput>;
  /** Required input for Apple Pay button */
  payment_services_paypal_apple_pay?: InputMaybe<ApplePayMethodInput>;
  /** Required input for fastlane */
  payment_services_paypal_fastlane?: InputMaybe<FastlaneMethodInput>;
  /** Required input for Google Pay button */
  payment_services_paypal_google_pay?: InputMaybe<GooglePayMethodInput>;
  /** Required input for Hosted Fields */
  payment_services_paypal_hosted_fields?: InputMaybe<HostedFieldsInput>;
  /** Required input for Smart buttons */
  payment_services_paypal_smart_buttons?: InputMaybe<SmartButtonMethodInput>;
  /** Required input for vault */
  payment_services_paypal_vault?: InputMaybe<VaultMethodInput>;
  /** Required input for Express Checkout and Payments Standard payments. */
  paypal_express?: InputMaybe<PaypalExpressInput>;
  /** The purchase order number. Optional for most payment methods. */
  purchase_order_number?: InputMaybe<Scalars["String"]["input"]>;
  /** Required input for Stripe Payments */
  stripe_payments?: InputMaybe<StripePaymentsInput>;
}

/** The payment source information */
export interface PaymentSourceInput {
  /** The card payment source information */
  card: CardPaymentSourceInput;
}

/** The list of available payment token types. */
export enum PaymentTokenTypeEnum {
  /** phpcs:ignore Magento2.GraphQL.ValidArgumentName */
  account = "account",
  /** phpcs:ignore Magento2.GraphQL.ValidArgumentName */
  card = "card",
}

/** Contains required input for Express Checkout and Payments Standard payments. */
export interface PaypalExpressInput {
  /** The unique ID of the PayPal user. */
  payer_id: Scalars["String"]["input"];
  /** The token returned by the `createPaypalExpressToken` mutation. */
  token: Scalars["String"]["input"];
}

/** Defines the attributes required to receive a payment token for Express Checkout and Payments Standard payment methods. */
export interface PaypalExpressTokenInput {
  /** The unique ID that identifies the customer's cart. */
  cart_id: Scalars["String"]["input"];
  /** The payment method code. */
  code: Scalars["String"]["input"];
  /** Indicates whether the buyer selected the quick checkout button. The default value is false. */
  express_button?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** A set of relative URLs that PayPal uses in response to various actions during the authorization process. */
  urls: PaypalExpressUrlsInput;
  /** Indicates whether the buyer clicked the PayPal credit button. The default value is false. */
  use_paypal_credit?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** Contains a set of relative URLs that PayPal uses in response to various actions during the authorization process. Magento prepends the base URL to this value to create a full URL. For example, if the full URL is https://www.example.com/path/to/page.html, the relative URL is path/to/page.html. Use this input for Express Checkout and Payments Standard payment methods. */
export interface PaypalExpressUrlsInput {
  /** The relative URL of the page that PayPal redirects to when the buyer cancels the transaction in order to choose a different payment method. If the full URL to this page is https://www.example.com/paypal/action/cancel.html, the relative URL is paypal/action/cancel.html. */
  cancel_url: Scalars["String"]["input"];
  /** The relative URL of the page that PayPal redirects to when the payment has been put on hold for additional review. This condition mostly applies to ACH transactions, and is not applicable to most PayPal solutions. If the full URL to this page is https://www.example.com/paypal/action/success_pending.html, the relative URL is paypal/action/success_pending.html. */
  pending_url?: InputMaybe<Scalars["String"]["input"]>;
  /** The relative URL of the final confirmation page that PayPal redirects to upon payment success. If the full URL to this page is https://www.example.com/paypal/action/return.html, the relative URL is paypal/action/return.html. */
  return_url: Scalars["String"]["input"];
  /** The relative URL of the order confirmation page that PayPal redirects to when the payment is successful and additional confirmation is not needed. Not applicable to most PayPal solutions. If the full URL to this page is https://www.example.com/paypal/action/success.html, the relative URL is paypal/action/success.html. */
  success_url?: InputMaybe<Scalars["String"]["input"]>;
}

/** PickupLocationFilterInput defines the list of attributes and filters for the search. */
export interface PickupLocationFilterInput {
  /** Filter by city. */
  city?: InputMaybe<FilterTypeInput>;
  /** Filter by country. */
  country_id?: InputMaybe<FilterTypeInput>;
  /** Filter by pickup location name. */
  name?: InputMaybe<FilterTypeInput>;
  /** Filter by pickup location code. */
  pickup_location_code?: InputMaybe<FilterTypeInput>;
  /** Filter by postcode. */
  postcode?: InputMaybe<FilterTypeInput>;
  /** Filter by region. */
  region?: InputMaybe<FilterTypeInput>;
  /** Filter by region id. */
  region_id?: InputMaybe<FilterTypeInput>;
  /** Filter by street. */
  street?: InputMaybe<FilterTypeInput>;
}

/** PickupLocationSortInput specifies attribute to use for sorting search results and indicates whether the results are sorted in ascending or descending order. */
export interface PickupLocationSortInput {
  /** City where pickup location is placed. */
  city?: InputMaybe<SortEnum>;
  /** Name of the contact person. */
  contact_name?: InputMaybe<SortEnum>;
  /** Id of the country in two letters. */
  country_id?: InputMaybe<SortEnum>;
  /** Description of the pickup location. */
  description?: InputMaybe<SortEnum>;
  /** Distance to the address, requested by distance filter. Applicable only with distance filter. If distance sort order is present, all other sort orders will be ignored. */
  distance?: InputMaybe<SortEnum>;
  /** Contact email of the pickup location. */
  email?: InputMaybe<SortEnum>;
  /** Contact fax of the pickup location. */
  fax?: InputMaybe<SortEnum>;
  /** Geographic latitude where pickup location is placed. */
  latitude?: InputMaybe<SortEnum>;
  /** Geographic longitude where pickup location is placed. */
  longitude?: InputMaybe<SortEnum>;
  /** The pickup location name. Customer use this to identify the pickup location. */
  name?: InputMaybe<SortEnum>;
  /** Contact phone number of the pickup location. */
  phone?: InputMaybe<SortEnum>;
  /** A code assigned to pickup location to identify the source. */
  pickup_location_code?: InputMaybe<SortEnum>;
  /** Postcode where pickup location is placed. */
  postcode?: InputMaybe<SortEnum>;
  /** Name of the region. */
  region?: InputMaybe<SortEnum>;
  /** Id of the region. */
  region_id?: InputMaybe<SortEnum>;
  /** Street where pickup location is placed. */
  street?: InputMaybe<SortEnum>;
}

export enum PlaceOrderErrorCodes {
  CART_NOT_ACTIVE = "CART_NOT_ACTIVE",
  CART_NOT_FOUND = "CART_NOT_FOUND",
  GUEST_EMAIL_MISSING = "GUEST_EMAIL_MISSING",
  UNABLE_TO_PLACE_ORDER = "UNABLE_TO_PLACE_ORDER",
  UNDEFINED = "UNDEFINED",
}

/** Specifies the quote to be converted to an order. */
export interface PlaceOrderInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
}

/** `PriceAdjustment.code` is deprecated. */
export enum PriceAdjustmentCodesEnum {
  /** @deprecated `PriceAdjustmentCodesEnum` is deprecated. Tax is included or excluded in the price. Tax is not shown separately in Catalog. */
  TAX = "TAX",
}

/** `PriceAdjustmentDescriptionEnum` is deprecated. States whether a price adjustment is included or excluded. */
export enum PriceAdjustmentDescriptionEnum {
  EXCLUDED = "EXCLUDED",
  INCLUDED = "INCLUDED",
}

/** Defines the price type. */
export enum PriceTypeEnum {
  DYNAMIC = "DYNAMIC",
  FIXED = "FIXED",
  PERCENT = "PERCENT",
}

/** Defines whether a bundle product's price is displayed as the lowest possible value or as a range. */
export enum PriceViewEnum {
  AS_LOW_AS = "AS_LOW_AS",
  PRICE_RANGE = "PRICE_RANGE",
}

/** Defines the filters to be used in the search. A filter contains at least one attribute, a comparison operator, and the value that is being searched for. */
export interface ProductAttributeFilterInput {
  /** Deprecated: use `category_uid` to filter product by category ID. */
  category_id?: InputMaybe<FilterEqualTypeInput>;
  /** Filter product by the unique ID for a `CategoryInterface` object. */
  category_uid?: InputMaybe<FilterEqualTypeInput>;
  /** Filter product by category URL path. */
  category_url_path?: InputMaybe<FilterEqualTypeInput>;
  /** Attribute label: Colore */
  color?: InputMaybe<FilterEqualTypeInput>;
  /** Attribute label: Description */
  description?: InputMaybe<FilterMatchTypeInput>;
  /** Attribute label: Colori e Fantasie */
  match_collezione2?: InputMaybe<FilterEqualTypeInput>;
  /** Attribute label: Product Name */
  name?: InputMaybe<FilterMatchTypeInput>;
  /** Attribute label: Short Description */
  short_description?: InputMaybe<FilterMatchTypeInput>;
  /** Attribute label: Taglia */
  size?: InputMaybe<FilterEqualTypeInput>;
  /** Attribute label: SKU */
  sku?: InputMaybe<FilterEqualTypeInput>;
  /** Attribute label: Tema */
  tema?: InputMaybe<FilterEqualTypeInput>;
  /** Attribute label: Articolo */
  tipologia?: InputMaybe<FilterEqualTypeInput>;
  /** The part of the URL that identifies the product */
  url_key?: InputMaybe<FilterEqualTypeInput>;
}

/** Specifies the attribute to use for sorting search results and indicates whether the results are sorted in ascending or descending order. It's possible to sort products using searchable attributes with enabled 'Use in Filter Options' option */
export interface ProductAttributeSortInput {
  /** Attribute label: Product Name */
  name?: InputMaybe<SortEnum>;
  /** Sort by the position assigned to each product. */
  position?: InputMaybe<SortEnum>;
  /** Sort by the search relevance score (default). */
  relevance?: InputMaybe<SortEnum>;
  /** Attribute label: Taglia */
  size?: InputMaybe<SortEnum>;
}

/** ProductFilterInput is deprecated, use @ProductAttributeFilterInput instead. ProductFilterInput defines the filters to be used in the search. A filter contains at least one attribute, a comparison operator, and the value that is being searched for. */
export interface ProductFilterInput {
  /** The category ID the product belongs to. */
  category_id?: InputMaybe<FilterTypeInput>;
  /** The product's country of origin. */
  country_of_manufacture?: InputMaybe<FilterTypeInput>;
  /** The timestamp indicating when the product was created. */
  created_at?: InputMaybe<FilterTypeInput>;
  /** The name of a custom layout. */
  custom_layout?: InputMaybe<FilterTypeInput>;
  /** XML code that is applied as a layout update to the product page. */
  custom_layout_update?: InputMaybe<FilterTypeInput>;
  /** Detailed information about the product. The value can include simple HTML tags. */
  description?: InputMaybe<FilterTypeInput>;
  /** Indicates whether a gift message is available. */
  gift_message_available?: InputMaybe<FilterTypeInput>;
  /** Indicates whether additional attributes have been created for the product. */
  has_options?: InputMaybe<FilterTypeInput>;
  /** The relative path to the main image on the product page. */
  image?: InputMaybe<FilterTypeInput>;
  /** The label assigned to a product image. */
  image_label?: InputMaybe<FilterTypeInput>;
  /** A number representing the product's manufacturer. */
  manufacturer?: InputMaybe<FilterTypeInput>;
  /** The numeric maximal price of the product. Do not include the currency code. */
  max_price?: InputMaybe<FilterTypeInput>;
  /** A brief overview of the product for search results listings, maximum 255 characters. */
  meta_description?: InputMaybe<FilterTypeInput>;
  /** A comma-separated list of keywords that are visible only to search engines. */
  meta_keyword?: InputMaybe<FilterTypeInput>;
  /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
  meta_title?: InputMaybe<FilterTypeInput>;
  /** The numeric minimal price of the product. Do not include the currency code. */
  min_price?: InputMaybe<FilterTypeInput>;
  /** The product name. Customers use this name to identify the product. */
  name?: InputMaybe<FilterTypeInput>;
  /** The beginning date for new product listings, and determines if the product is featured as a new product. */
  news_from_date?: InputMaybe<FilterTypeInput>;
  /** The end date for new product listings. */
  news_to_date?: InputMaybe<FilterTypeInput>;
  /** If the product has multiple options, determines where they appear on the product page. */
  options_container?: InputMaybe<FilterTypeInput>;
  /** The keyword required to perform a logical OR comparison. */
  or?: InputMaybe<ProductFilterInput>;
  /** The price of an item. */
  price?: InputMaybe<FilterTypeInput>;
  /** Indicates whether the product has required options. */
  required_options?: InputMaybe<FilterTypeInput>;
  /** A short description of the product. Its use depends on the theme. */
  short_description?: InputMaybe<FilterTypeInput>;
  /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
  sku?: InputMaybe<FilterTypeInput>;
  /** The relative path to the small image, which is used on catalog pages. */
  small_image?: InputMaybe<FilterTypeInput>;
  /** The label assigned to a product's small image. */
  small_image_label?: InputMaybe<FilterTypeInput>;
  /** The beginning date that a product has a special price. */
  special_from_date?: InputMaybe<FilterTypeInput>;
  /** The discounted price of the product. Do not include the currency code. */
  special_price?: InputMaybe<FilterTypeInput>;
  /** The end date that a product has a special price. */
  special_to_date?: InputMaybe<FilterTypeInput>;
  /** The file name of a swatch image. */
  swatch_image?: InputMaybe<FilterTypeInput>;
  /** The relative path to the product's thumbnail image. */
  thumbnail?: InputMaybe<FilterTypeInput>;
  /** The label assigned to a product's thumbnail image. */
  thumbnail_label?: InputMaybe<FilterTypeInput>;
  /** The price when tier pricing is in effect and the items purchased threshold has been reached. */
  tier_price?: InputMaybe<FilterTypeInput>;
  /** The timestamp indicating when the product was updated. */
  updated_at?: InputMaybe<FilterTypeInput>;
  /** The part of the URL that identifies the product */
  url_key?: InputMaybe<FilterTypeInput>;
  url_path?: InputMaybe<FilterTypeInput>;
  /** The weight of the item, in units defined by the store. */
  weight?: InputMaybe<FilterTypeInput>;
}

/** Product Information used for Pickup Locations search. */
export interface ProductInfoInput {
  /** Product SKU. */
  sku: Scalars["String"]["input"];
}

/** Contains the reviewer's rating for a single aspect of a review. */
export interface ProductReviewRatingInput {
  /** An encoded rating ID. */
  id: Scalars["String"]["input"];
  /** An encoded rating value ID. */
  value_id: Scalars["String"]["input"];
}

/** Deprecated. Use `ProductAttributeSortInput` instead. Specifies the attribute to use for sorting search results and indicates whether the results are sorted in ascending or descending order. */
export interface ProductSortInput {
  /** The product's country of origin. */
  country_of_manufacture?: InputMaybe<SortEnum>;
  /** The timestamp indicating when the product was created. */
  created_at?: InputMaybe<SortEnum>;
  /** The name of a custom layout. */
  custom_layout?: InputMaybe<SortEnum>;
  /** XML code that is applied as a layout update to the product page. */
  custom_layout_update?: InputMaybe<SortEnum>;
  /** Detailed information about the product. The value can include simple HTML tags. */
  description?: InputMaybe<SortEnum>;
  /** Indicates whether a gift message is available. */
  gift_message_available?: InputMaybe<SortEnum>;
  /** Indicates whether additional attributes have been created for the product. */
  has_options?: InputMaybe<SortEnum>;
  /** The relative path to the main image on the product page. */
  image?: InputMaybe<SortEnum>;
  /** The label assigned to a product image. */
  image_label?: InputMaybe<SortEnum>;
  /** A number representing the product's manufacturer. */
  manufacturer?: InputMaybe<SortEnum>;
  /** A brief overview of the product for search results listings, maximum 255 characters. */
  meta_description?: InputMaybe<SortEnum>;
  /** A comma-separated list of keywords that are visible only to search engines. */
  meta_keyword?: InputMaybe<SortEnum>;
  /** A string that is displayed in the title bar and tab of the browser and in search results lists. */
  meta_title?: InputMaybe<SortEnum>;
  /** The product name. Customers use this name to identify the product. */
  name?: InputMaybe<SortEnum>;
  /** The beginning date for new product listings, and determines if the product is featured as a new product. */
  news_from_date?: InputMaybe<SortEnum>;
  /** The end date for new product listings. */
  news_to_date?: InputMaybe<SortEnum>;
  /** If the product has multiple options, determines where they appear on the product page. */
  options_container?: InputMaybe<SortEnum>;
  /** The price of the item. */
  price?: InputMaybe<SortEnum>;
  /** Indicates whether the product has required options. */
  required_options?: InputMaybe<SortEnum>;
  /** A short description of the product. Its use depends on the theme. */
  short_description?: InputMaybe<SortEnum>;
  /** A number or code assigned to a product to identify the product, options, price, and manufacturer. */
  sku?: InputMaybe<SortEnum>;
  /** The relative path to the small image, which is used on catalog pages. */
  small_image?: InputMaybe<SortEnum>;
  /** The label assigned to a product's small image. */
  small_image_label?: InputMaybe<SortEnum>;
  /** The beginning date that a product has a special price. */
  special_from_date?: InputMaybe<SortEnum>;
  /** The discounted price of the product. */
  special_price?: InputMaybe<SortEnum>;
  /** The end date that a product has a special price. */
  special_to_date?: InputMaybe<SortEnum>;
  /** Indicates the criteria to sort swatches. */
  swatch_image?: InputMaybe<SortEnum>;
  /** The relative path to the product's thumbnail image. */
  thumbnail?: InputMaybe<SortEnum>;
  /** The label assigned to a product's thumbnail image. */
  thumbnail_label?: InputMaybe<SortEnum>;
  /** The price when tier pricing is in effect and the items purchased threshold has been reached. */
  tier_price?: InputMaybe<SortEnum>;
  /** The timestamp indicating when the product was updated. */
  updated_at?: InputMaybe<SortEnum>;
  /** The part of the URL that identifies the product */
  url_key?: InputMaybe<SortEnum>;
  url_path?: InputMaybe<SortEnum>;
  /** The weight of the item, in units defined by the store. */
  weight?: InputMaybe<SortEnum>;
}

/** This enumeration states whether a product stock status is in stock or out of stock */
export enum ProductStockStatus {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

/** Specifies the field to use for sorting quote items */
export interface QuoteItemsSortInput {
  /** Specifies the quote items field to sort by */
  field: SortQuoteItemsEnum;
  /** Specifies the order of quote items' sorting */
  order: SortEnum;
}

export enum ReCaptchaFormEnum {
  BRAINTREE = "BRAINTREE",
  CONTACT = "CONTACT",
  CUSTOMER_CREATE = "CUSTOMER_CREATE",
  CUSTOMER_EDIT = "CUSTOMER_EDIT",
  CUSTOMER_FORGOT_PASSWORD = "CUSTOMER_FORGOT_PASSWORD",
  CUSTOMER_LOGIN = "CUSTOMER_LOGIN",
  NEWSLETTER = "NEWSLETTER",
  PLACE_ORDER = "PLACE_ORDER",
  PRODUCT_REVIEW = "PRODUCT_REVIEW",
  SENDFRIEND = "SENDFRIEND",
}

/** Specifies the cart from which to remove a coupon. */
export interface RemoveCouponFromCartInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
}

/** Specifies which items to remove from the cart. */
export interface RemoveItemFromCartInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** Deprecated. Use `cart_item_uid` instead. */
  cart_item_id?: InputMaybe<Scalars["Int"]["input"]>;
  /** Required field. The unique ID for a `CartItemInterface` object. */
  cart_item_uid?: InputMaybe<Scalars["ID"]["input"]>;
}

/** Defines which products to remove from a compare list. */
export interface RemoveProductsFromCompareListInput {
  /** An array of product IDs to remove from the compare list. */
  products: Array<InputMaybe<Scalars["ID"]["input"]>>;
  /** The unique identifier of the compare list to modify. */
  uid: Scalars["ID"]["input"];
}

/** This enumeration defines the scope type for customer orders. */
export enum ScopeTypeEnum {
  GLOBAL = "GLOBAL",
  STORE = "STORE",
  WEBSITE = "WEBSITE",
}

/** Defines the referenced product and the email sender and recipients. */
export interface SendEmailToFriendInput {
  /** The ID of the product that the sender is referencing. */
  product_id: Scalars["Int"]["input"];
  /** An array containing information about each recipient. */
  recipients: Array<InputMaybe<SendEmailToFriendRecipientInput>>;
  /** Information about the customer and the content of the message. */
  sender: SendEmailToFriendSenderInput;
}

/** Contains details about a recipient. */
export interface SendEmailToFriendRecipientInput {
  /** The email address of the recipient. */
  email: Scalars["String"]["input"];
  /** The name of the recipient. */
  name: Scalars["String"]["input"];
}

/** Contains details about the sender. */
export interface SendEmailToFriendSenderInput {
  /** The email address of the sender. */
  email: Scalars["String"]["input"];
  /** The text of the message to be sent. */
  message: Scalars["String"]["input"];
  /** The name of the sender. */
  name: Scalars["String"]["input"];
}

/** Sets the billing address. */
export interface SetBillingAddressOnCartInput {
  /** The billing address. */
  billing_address: BillingAddressInput;
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
}

/** Defines the guest email and cart. */
export interface SetGuestEmailOnCartInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** The email address of the guest. */
  email: Scalars["String"]["input"];
}

/** Applies a payment method to the quote. */
export interface SetPaymentMethodAndPlaceOrderInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** The payment method data to apply to the cart. */
  payment_method: PaymentMethodInput;
}

/** Applies a payment method to the cart. */
export interface SetPaymentMethodOnCartInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** The payment method data to apply to the cart. */
  payment_method: PaymentMethodInput;
}

/** Specifies an array of addresses to use for shipping. */
export interface SetShippingAddressesOnCartInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** An array of shipping addresses. */
  shipping_addresses: Array<InputMaybe<ShippingAddressInput>>;
}

/** Applies one or shipping methods to the cart. */
export interface SetShippingMethodsOnCartInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** An array of shipping methods. */
  shipping_methods: Array<InputMaybe<ShippingMethodInput>>;
}

/** Defines whether bundle items must be shipped together. */
export enum ShipBundleItemsEnum {
  SEPARATELY = "SEPARATELY",
  TOGETHER = "TOGETHER",
}

/** Defines a single shipping address. */
export interface ShippingAddressInput {
  /** Defines a shipping address. */
  address?: InputMaybe<CartAddressInput>;
  /** An ID from the customer's address book that uniquely identifies the address to be used for shipping. */
  customer_address_id?: InputMaybe<Scalars["Int"]["input"]>;
  /** Text provided by the shopper. */
  customer_notes?: InputMaybe<Scalars["String"]["input"]>;
  /** The code of Pickup Location which will be used for In-Store Pickup. */
  pickup_location_code?: InputMaybe<Scalars["String"]["input"]>;
}

/** Defines the shipping carrier and method. */
export interface ShippingMethodInput {
  /** A string that identifies a commercial carrier or an offline delivery method. */
  carrier_code: Scalars["String"]["input"];
  /** A string that indicates which service a commercial carrier will use to ship items. For offline delivery methods, this value is similar to the label displayed on the checkout page. */
  method_code: Scalars["String"]["input"];
}

/** Defines a single product to add to the cart. */
export interface SimpleProductCartItemInput {
  /** An array that defines customizable options for the product. */
  customizable_options?: InputMaybe<Array<InputMaybe<CustomizableOptionInput>>>;
  /** An object containing the `sku`, `quantity`, and other relevant information about the product. */
  data: CartItemInput;
}

/** Smart button payment inputs */
export interface SmartButtonMethodInput {
  /** The payment source for the payment method */
  payment_source?: InputMaybe<Scalars["String"]["input"]>;
  /** The payment services order ID */
  payments_order_id?: InputMaybe<Scalars["String"]["input"]>;
  /** PayPal order ID */
  paypal_order_id?: InputMaybe<Scalars["String"]["input"]>;
}

/** Indicates whether to return results in ascending or descending order. */
export enum SortEnum {
  ASC = "ASC",
  DESC = "DESC",
}

/** Specifies the field to use for sorting quote items */
export enum SortQuoteItemsEnum {
  BASE_DISCOUNT_AMOUNT = "BASE_DISCOUNT_AMOUNT",
  BASE_DISCOUNT_TAX_COMPENSATION_AMOUNT = "BASE_DISCOUNT_TAX_COMPENSATION_AMOUNT",
  BASE_PRICE = "BASE_PRICE",
  BASE_PRICE_INC_TAX = "BASE_PRICE_INC_TAX",
  BASE_ROW_TOTAL = "BASE_ROW_TOTAL",
  BASE_ROW_TOTAL_INC_TAX = "BASE_ROW_TOTAL_INC_TAX",
  BASE_TAX_AMOUNT = "BASE_TAX_AMOUNT",
  BASE_TAX_BEFORE_DISCOUNT = "BASE_TAX_BEFORE_DISCOUNT",
  CREATED_AT = "CREATED_AT",
  CUSTOM_PRICE = "CUSTOM_PRICE",
  DESCRIPTION = "DESCRIPTION",
  DISCOUNT_AMOUNT = "DISCOUNT_AMOUNT",
  DISCOUNT_PERCENT = "DISCOUNT_PERCENT",
  DISCOUNT_TAX_COMPENSATION_AMOUNT = "DISCOUNT_TAX_COMPENSATION_AMOUNT",
  FREE_SHIPPING = "FREE_SHIPPING",
  ITEM_ID = "ITEM_ID",
  NAME = "NAME",
  ORIGINAL_CUSTOM_PRICE = "ORIGINAL_CUSTOM_PRICE",
  PRICE = "PRICE",
  PRICE_INC_TAX = "PRICE_INC_TAX",
  PRODUCT_ID = "PRODUCT_ID",
  PRODUCT_TYPE = "PRODUCT_TYPE",
  QTY = "QTY",
  ROW_TOTAL = "ROW_TOTAL",
  ROW_TOTAL_INC_TAX = "ROW_TOTAL_INC_TAX",
  ROW_TOTAL_WITH_DISCOUNT = "ROW_TOTAL_WITH_DISCOUNT",
  ROW_WEIGHT = "ROW_WEIGHT",
  SKU = "SKU",
  TAX_AMOUNT = "TAX_AMOUNT",
  TAX_BEFORE_DISCOUNT = "TAX_BEFORE_DISCOUNT",
  TAX_PERCENT = "TAX_PERCENT",
  UPDATED_AT = "UPDATED_AT",
  WEIGHT = "WEIGHT",
}

export interface StripePaymentMethodId {
  /** When this is passed, the action will be performed on all duplicate payment methods which match the fingerprint. */
  fingerprint?: InputMaybe<Scalars["String"]["input"]>;
  /** The ID of a payment method object */
  payment_method: Scalars["String"]["input"];
}

export interface StripePaymentsInput {
  /** When CVC is enabled for saved cards, pass the CVC token here to perform the verification. */
  cvc_token?: InputMaybe<Scalars["String"]["input"]>;
  /** Pass the payment method token here (starts with pm_) */
  payment_method?: InputMaybe<Scalars["String"]["input"]>;
  /** Specify whether the payment method should be saved */
  save_payment_method?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** Indicates the status of the request. */
export enum SubscriptionStatusesEnum {
  NOT_ACTIVE = "NOT_ACTIVE",
  SUBSCRIBED = "SUBSCRIBED",
  UNCONFIRMED = "UNCONFIRMED",
  UNSUBSCRIBED = "UNSUBSCRIBED",
}

/** Swatch attribute metadata input types. */
export enum SwatchInputTypeEnum {
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  DATETIME = "DATETIME",
  DROPDOWN = "DROPDOWN",
  FILE = "FILE",
  GALLERY = "GALLERY",
  HIDDEN = "HIDDEN",
  IMAGE = "IMAGE",
  MEDIA_IMAGE = "MEDIA_IMAGE",
  MULTILINE = "MULTILINE",
  MULTISELECT = "MULTISELECT",
  PRICE = "PRICE",
  SELECT = "SELECT",
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  UNDEFINED = "UNDEFINED",
  VISUAL = "VISUAL",
  WEIGHT = "WEIGHT",
}

/** Synchronizes the payment order details */
export interface SyncPaymentOrderInput {
  /** The customer cart ID */
  cartId: Scalars["String"]["input"];
  /** PayPal order ID */
  id: Scalars["String"]["input"];
}

export enum TaxWrappingEnum {
  DISPLAY_EXCLUDING_TAX = "DISPLAY_EXCLUDING_TAX",
  DISPLAY_INCLUDING_TAX = "DISPLAY_INCLUDING_TAX",
  DISPLAY_TYPE_BOTH = "DISPLAY_TYPE_BOTH",
}

/** 3D Secure mode. */
export enum ThreeDSMode {
  OFF = "OFF",
  SCA_ALWAYS = "SCA_ALWAYS",
  SCA_WHEN_REQUIRED = "SCA_WHEN_REQUIRED",
}

/** Modifies the specified items in the cart. */
export interface UpdateCartItemsInput {
  /** The unique ID of a `Cart` object. */
  cart_id: Scalars["String"]["input"];
  /** An array of items to be updated. */
  cart_items: Array<InputMaybe<CartItemUpdateInput>>;
}

/** This enumeration defines the entity type. */
export enum UrlRewriteEntityTypeEnum {
  CATEGORY = "CATEGORY",
  CMS_PAGE = "CMS_PAGE",
  PRODUCT = "PRODUCT",
}

/** Defines whether the attribute is filterable in layered navigation. */
export enum UseInLayeredNavigationOptions {
  FILTERABLE_NO_RESULT = "FILTERABLE_NO_RESULT",
  FILTERABLE_WITH_RESULTS = "FILTERABLE_WITH_RESULTS",
  NO = "NO",
}

/** List of validation rule names applied to a customer attribute. */
export enum ValidationRuleEnum {
  DATE_RANGE_MAX = "DATE_RANGE_MAX",
  DATE_RANGE_MIN = "DATE_RANGE_MIN",
  FILE_EXTENSIONS = "FILE_EXTENSIONS",
  INPUT_VALIDATION = "INPUT_VALIDATION",
  MAX_FILE_SIZE = "MAX_FILE_SIZE",
  MAX_IMAGE_HEIGHT = "MAX_IMAGE_HEIGHT",
  MAX_IMAGE_WIDTH = "MAX_IMAGE_WIDTH",
  MAX_TEXT_LENGTH = "MAX_TEXT_LENGTH",
  MIN_TEXT_LENGTH = "MIN_TEXT_LENGTH",
}

/** Vault payment inputs */
export interface VaultMethodInput {
  /** The payment source for the payment method */
  payment_source?: InputMaybe<Scalars["String"]["input"]>;
  /** The payment services order ID */
  payments_order_id?: InputMaybe<Scalars["String"]["input"]>;
  /** PayPal order ID */
  paypal_order_id?: InputMaybe<Scalars["String"]["input"]>;
  /** The public hash of the token. */
  public_hash?: InputMaybe<Scalars["String"]["input"]>;
}

/** The payment source information */
export interface VaultSetupTokenInput {
  /** The payment source information */
  payment_source: PaymentSourceInput;
}

/** Contains required input for payment methods with Vault support. */
export interface VaultTokenInput {
  /** The public hash of the payment token. */
  public_hash: Scalars["String"]["input"];
}

/** Defines a single product to add to the cart. */
export interface VirtualProductCartItemInput {
  /** An array that defines customizable options for the product. */
  customizable_options?: InputMaybe<Array<InputMaybe<CustomizableOptionInput>>>;
  /** An object containing the `sku`, `quantity`, and other relevant information about the product. */
  data: CartItemInput;
}

/** A list of possible error types. */
export enum WishListUserInputErrorType {
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  UNDEFINED = "UNDEFINED",
}

/** A list of possible error types. */
export enum WishlistCartUserInputErrorType {
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  NOT_SALABLE = "NOT_SALABLE",
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
  UNDEFINED = "UNDEFINED",
}

/** Defines the items to add to a wish list. */
export interface WishlistItemInput {
  /** An array of options that the customer entered. */
  entered_options?: InputMaybe<Array<InputMaybe<EnteredOptionInput>>>;
  /** For complex product types, the SKU of the parent product. */
  parent_sku?: InputMaybe<Scalars["String"]["input"]>;
  /** The amount or number of items to add. */
  quantity: Scalars["Float"]["input"];
  /** An array of strings corresponding to options the customer selected. */
  selected_options?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  /** The SKU of the product to add. For complex product types, specify the child product SKU. */
  sku: Scalars["String"]["input"];
}

/** Defines updates to items in a wish list. */
export interface WishlistItemUpdateInput {
  /** Customer-entered comments about the item. */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** An array of options that the customer entered. */
  entered_options?: InputMaybe<Array<InputMaybe<EnteredOptionInput>>>;
  /** The new amount or number of this item. */
  quantity?: InputMaybe<Scalars["Float"]["input"]>;
  /** An array of strings corresponding to options the customer selected. */
  selected_options?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  /** The unique ID for a `WishlistItemInterface` object. */
  wishlist_item_id: Scalars["ID"]["input"];
}

/** Assigns a specific `cart_id` to the empty cart. */
export interface createEmptyCartInput {
  /** The ID to assign to the cart. */
  cart_id?: InputMaybe<Scalars["String"]["input"]>;
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  AttributeEntityTypeEnum: true,
  AttributeFrontendInputEnum: true,
  AttributeMetadataErrorType: true,
  BatchMutationStatus: true,
  Boolean: true,
  CartDiscountType: true,
  CartItemErrorType: true,
  CartUserInputErrorType: true,
  CatalogAttributeApplyToEnum: true,
  CheckoutAgreementMode: true,
  CheckoutUserInputErrorCodes: true,
  ConfirmationStatusEnum: true,
  CountryCodeEnum: true,
  CurrencyEnum: true,
  CustomerOrderSortableField: true,
  CustomizableDateTypeEnum: true,
  DownloadableFileTypeEnum: true,
  FilterMatchTypeEnum: true,
  Float: true,
  ID: true,
  InputFilterEnum: true,
  Int: true,
  PayflowLinkMode: true,
  PaymentLocation: true,
  PaymentTokenTypeEnum: true,
  PlaceOrderErrorCodes: true,
  PriceAdjustmentCodesEnum: true,
  PriceAdjustmentDescriptionEnum: true,
  PriceTypeEnum: true,
  PriceViewEnum: true,
  ProductStockStatus: true,
  ReCaptchaFormEnum: true,
  ScopeTypeEnum: true,
  ShipBundleItemsEnum: true,
  SortEnum: true,
  SortQuoteItemsEnum: true,
  String: true,
  SubscriptionStatusesEnum: true,
  SwatchInputTypeEnum: true,
  TaxWrappingEnum: true,
  ThreeDSMode: true,
  UrlRewriteEntityTypeEnum: true,
  UseInLayeredNavigationOptions: true,
  ValidationRuleEnum: true,
  WishListUserInputErrorType: true,
  WishlistCartUserInputErrorType: true,
};
export const generatedSchema = {
  AddBundleProductsToCartInput: {
    cart_id: { __type: "String!" },
    cart_items: { __type: "[BundleProductCartItemInput]!" },
  },
  AddBundleProductsToCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  AddConfigurableProductsToCartInput: {
    cart_id: { __type: "String!" },
    cart_items: { __type: "[ConfigurableProductCartItemInput]!" },
  },
  AddConfigurableProductsToCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  AddDownloadableProductsToCartInput: {
    cart_id: { __type: "String!" },
    cart_items: { __type: "[DownloadableProductCartItemInput]!" },
  },
  AddDownloadableProductsToCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  AddProductsToCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
    user_errors: { __type: "[CartUserInputError]!" },
  },
  AddProductsToCompareListInput: {
    products: { __type: "[ID]!" },
    uid: { __type: "ID!" },
  },
  AddProductsToNewCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart" },
    user_errors: { __type: "[CartUserInputError]" },
  },
  AddProductsToWishlistOutput: {
    __typename: { __type: "String!" },
    user_errors: { __type: "[WishListUserInputError]!" },
    wishlist: { __type: "Wishlist!" },
  },
  AddSimpleProductsToCartInput: {
    cart_id: { __type: "String!" },
    cart_items: { __type: "[SimpleProductCartItemInput]!" },
  },
  AddSimpleProductsToCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  AddVirtualProductsToCartInput: {
    cart_id: { __type: "String!" },
    cart_items: { __type: "[VirtualProductCartItemInput]!" },
  },
  AddVirtualProductsToCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  AddWishlistItemsToCartOutput: {
    __typename: { __type: "String!" },
    add_wishlist_items_to_cart_user_errors: {
      __type: "[WishlistCartUserInputError]!",
    },
    status: { __type: "Boolean!" },
    wishlist: { __type: "Wishlist!" },
  },
  Aggregation: {
    __typename: { __type: "String!" },
    attribute_code: { __type: "String!" },
    count: { __type: "Int" },
    label: { __type: "String" },
    options: { __type: "[AggregationOption]" },
    position: { __type: "Int" },
  },
  AggregationOption: {
    __typename: { __type: "String!" },
    count: { __type: "Int" },
    label: { __type: "String" },
    value: { __type: "String!" },
  },
  AggregationOptionInterface: {
    __typename: { __type: "String!" },
    count: { __type: "Int" },
    label: { __type: "String" },
    value: { __type: "String!" },
    $on: { __type: "$AggregationOptionInterface!" },
  },
  AggregationsCategoryFilterInput: {
    includeDirectChildrenOnly: { __type: "Boolean" },
  },
  AggregationsFilterInput: {
    category: { __type: "AggregationsCategoryFilterInput" },
  },
  ApplePayConfig: {
    __typename: { __type: "String!" },
    button_styles: { __type: "ButtonStyles" },
    code: { __type: "String" },
    is_visible: { __type: "Boolean" },
    payment_intent: { __type: "String" },
    payment_source: { __type: "String" },
    sdk_params: { __type: "[SDKParams]" },
    sort_order: { __type: "String" },
    title: { __type: "String" },
  },
  ApplePayMethodInput: {
    payment_source: { __type: "String" },
    payments_order_id: { __type: "String" },
    paypal_order_id: { __type: "String" },
  },
  AppliedCoupon: {
    __typename: { __type: "String!" },
    code: { __type: "String!" },
  },
  ApplyCouponToCartInput: {
    cart_id: { __type: "String!" },
    coupon_code: { __type: "String!" },
  },
  ApplyCouponToCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  AreaInput: { radius: { __type: "Int!" }, search_term: { __type: "String!" } },
  AssignCompareListToCustomerOutput: {
    __typename: { __type: "String!" },
    compare_list: { __type: "CompareList" },
    result: { __type: "Boolean!" },
  },
  Attribute: {
    __typename: { __type: "String!" },
    attribute_code: { __type: "String" },
    attribute_options: { __type: "[AttributeOption]" },
    attribute_type: { __type: "String" },
    entity_type: { __type: "String" },
    input_type: { __type: "String" },
    storefront_properties: { __type: "StorefrontProperties" },
  },
  AttributeFilterInput: {
    is_comparable: { __type: "Boolean" },
    is_filterable: { __type: "Boolean" },
    is_filterable_in_search: { __type: "Boolean" },
    is_html_allowed_on_front: { __type: "Boolean" },
    is_searchable: { __type: "Boolean" },
    is_used_for_price_rules: { __type: "Boolean" },
    is_used_for_promo_rules: { __type: "Boolean" },
    is_visible_in_advanced_search: { __type: "Boolean" },
    is_visible_on_front: { __type: "Boolean" },
    is_wysiwyg_enabled: { __type: "Boolean" },
    used_in_product_listing: { __type: "Boolean" },
  },
  AttributeInput: {
    attribute_code: { __type: "String" },
    entity_type: { __type: "String" },
  },
  AttributeInputSelectedOption: { value: { __type: "String!" } },
  AttributeMetadata: {
    __typename: { __type: "String!" },
    code: { __type: "ID!" },
    default_value: { __type: "String" },
    entity_type: { __type: "AttributeEntityTypeEnum!" },
    frontend_class: { __type: "String" },
    frontend_input: { __type: "AttributeFrontendInputEnum" },
    is_required: { __type: "Boolean!" },
    is_unique: { __type: "Boolean!" },
    label: { __type: "String" },
    options: { __type: "[CustomAttributeOptionInterface]!" },
  },
  AttributeMetadataError: {
    __typename: { __type: "String!" },
    message: { __type: "String!" },
    type: { __type: "AttributeMetadataErrorType!" },
  },
  AttributeOption: {
    __typename: { __type: "String!" },
    label: { __type: "String" },
    value: { __type: "String" },
  },
  AttributeOptionMetadata: {
    __typename: { __type: "String!" },
    is_default: { __type: "Boolean!" },
    label: { __type: "String!" },
    value: { __type: "String!" },
  },
  AttributeSelectedOption: {
    __typename: { __type: "String!" },
    label: { __type: "String!" },
    value: { __type: "String!" },
  },
  AttributeSelectedOptionInterface: {
    __typename: { __type: "String!" },
    label: { __type: "String!" },
    value: { __type: "String!" },
    $on: { __type: "$AttributeSelectedOptionInterface!" },
  },
  AttributeSelectedOptions: {
    __typename: { __type: "String!" },
    code: { __type: "ID!" },
    selected_options: { __type: "[AttributeSelectedOptionInterface]!" },
  },
  AttributeValue: {
    __typename: { __type: "String!" },
    code: { __type: "ID!" },
    value: { __type: "String!" },
  },
  AttributeValueInput: {
    attribute_code: { __type: "String!" },
    selected_options: { __type: "[AttributeInputSelectedOption]" },
    value: { __type: "String" },
  },
  AttributeValueInterface: {
    __typename: { __type: "String!" },
    code: { __type: "ID!" },
    $on: { __type: "$AttributeValueInterface!" },
  },
  AttributesFormOutput: {
    __typename: { __type: "String!" },
    errors: { __type: "[AttributeMetadataError]!" },
    items: { __type: "[CustomAttributeMetadataInterface]!" },
  },
  AttributesMetadataOutput: {
    __typename: { __type: "String!" },
    errors: { __type: "[AttributeMetadataError]!" },
    items: { __type: "[CustomAttributeMetadataInterface]!" },
  },
  AvailablePaymentMethod: {
    __typename: { __type: "String!" },
    code: { __type: "String!" },
    is_deferred: { __type: "Boolean!" },
    title: { __type: "String!" },
  },
  AvailableShippingMethod: {
    __typename: { __type: "String!" },
    amount: { __type: "Money!" },
    available: { __type: "Boolean!" },
    base_amount: { __type: "Money" },
    carrier_code: { __type: "String!" },
    carrier_title: { __type: "String!" },
    error_message: { __type: "String" },
    method_code: { __type: "String" },
    method_title: { __type: "String" },
    price_excl_tax: { __type: "Money!" },
    price_incl_tax: { __type: "Money!" },
  },
  BillingAddressInput: {
    address: { __type: "CartAddressInput" },
    customer_address_id: { __type: "Int" },
    same_as_shipping: { __type: "Boolean" },
    use_for_shipping: { __type: "Boolean" },
  },
  BillingAddressPaymentSourceInput: {
    address_line_1: { __type: "String" },
    address_line_2: { __type: "String" },
    city: { __type: "String" },
    country_code: { __type: "String!" },
    postal_code: { __type: "String" },
    region: { __type: "String" },
  },
  BillingCartAddress: {
    __typename: { __type: "String!" },
    city: { __type: "String!" },
    company: { __type: "String" },
    country: { __type: "CartAddressCountry!" },
    customer_notes: { __type: "String" },
    fax: { __type: "String" },
    firstname: { __type: "String!" },
    lastname: { __type: "String!" },
    middlename: { __type: "String" },
    postcode: { __type: "String" },
    prefix: { __type: "String" },
    region: { __type: "CartAddressRegion" },
    street: { __type: "[String]!" },
    suffix: { __type: "String" },
    telephone: { __type: "String" },
    uid: { __type: "String!" },
    vat_id: { __type: "String" },
  },
  Breadcrumb: {
    __typename: { __type: "String!" },
    category_id: { __type: "Int" },
    category_level: { __type: "Int" },
    category_name: { __type: "String" },
    category_uid: { __type: "ID!" },
    category_url_key: { __type: "String" },
    category_url_path: { __type: "String" },
  },
  BundleCartItem: {
    __typename: { __type: "String!" },
    bundle_options: { __type: "[SelectedBundleOption]!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    errors: { __type: "[CartItemError]" },
    gift_message: { __type: "GiftMessage" },
    id: { __type: "String!" },
    is_available: { __type: "Boolean!" },
    prices: { __type: "CartItemPrices" },
    product: { __type: "ProductInterface!" },
    quantity: { __type: "Float!" },
    uid: { __type: "ID!" },
  },
  BundleCreditMemoItem: {
    __typename: { __type: "String!" },
    bundle_options: { __type: "[ItemSelectedBundleOption]" },
    discounts: { __type: "[Discount]" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_refunded: { __type: "Float" },
  },
  BundleInvoiceItem: {
    __typename: { __type: "String!" },
    bundle_options: { __type: "[ItemSelectedBundleOption]" },
    discounts: { __type: "[Discount]" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_invoiced: { __type: "Float" },
  },
  BundleItem: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    options: { __type: "[BundleItemOption]" },
    position: { __type: "Int" },
    price_range: { __type: "PriceRange!" },
    required: { __type: "Boolean" },
    sku: { __type: "String" },
    title: { __type: "String" },
    type: { __type: "String" },
    uid: { __type: "ID" },
  },
  BundleItemOption: {
    __typename: { __type: "String!" },
    can_change_quantity: { __type: "Boolean" },
    id: { __type: "Int" },
    is_default: { __type: "Boolean" },
    label: { __type: "String" },
    position: { __type: "Int" },
    price: { __type: "Float" },
    price_type: { __type: "PriceTypeEnum" },
    product: { __type: "ProductInterface" },
    qty: { __type: "Float" },
    quantity: { __type: "Float" },
    uid: { __type: "ID!" },
  },
  BundleOptionInput: {
    id: { __type: "Int!" },
    quantity: { __type: "Float!" },
    value: { __type: "[String]!" },
  },
  BundleOrderItem: {
    __typename: { __type: "String!" },
    bundle_options: { __type: "[ItemSelectedBundleOption]" },
    discounts: { __type: "[Discount]" },
    entered_options: { __type: "[OrderItemOption]" },
    gift_message: { __type: "GiftMessage" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    product_type: { __type: "String" },
    product_url_key: { __type: "String" },
    quantity_canceled: { __type: "Float" },
    quantity_invoiced: { __type: "Float" },
    quantity_ordered: { __type: "Float" },
    quantity_refunded: { __type: "Float" },
    quantity_returned: { __type: "Float" },
    quantity_shipped: { __type: "Float" },
    selected_options: { __type: "[OrderItemOption]" },
    status: { __type: "String" },
  },
  BundleProduct: {
    __typename: { __type: "String!" },
    attribute_set_id: { __type: "Int" },
    canonical_url: { __type: "String" },
    categories: { __type: "[CategoryInterface]" },
    color: { __type: "Int" },
    country_of_manufacture: { __type: "String" },
    created_at: { __type: "String" },
    crosssell_products: { __type: "[ProductInterface]" },
    custom_attributesV2: {
      __type: "ProductCustomAttributes",
      __args: { filters: "AttributeFilterInput" },
    },
    description: { __type: "ComplexTextValue" },
    dynamic_price: { __type: "Boolean" },
    dynamic_sku: { __type: "Boolean" },
    dynamic_weight: { __type: "Boolean" },
    figure_size: { __type: "String" },
    gift_message_available: { __type: "String" },
    id: { __type: "Int" },
    image: { __type: "ProductImage" },
    is_suggested: { __type: "Int" },
    items: { __type: "[BundleItem]" },
    manufacturer: { __type: "Int" },
    match_collezione2: { __type: "Int" },
    media_gallery: { __type: "[MediaGalleryInterface]" },
    media_gallery_entries: { __type: "[MediaGalleryEntry]" },
    meta_description: { __type: "String" },
    meta_keyword: { __type: "String" },
    meta_title: { __type: "String" },
    name: { __type: "String" },
    new_from_date: { __type: "String" },
    new_to_date: { __type: "String" },
    only_x_left_in_stock: { __type: "Float" },
    options: { __type: "[CustomizableOptionInterface]" },
    options_container: { __type: "String" },
    price: { __type: "ProductPrices" },
    price_details: { __type: "PriceDetails" },
    price_range: { __type: "PriceRange!" },
    price_tiers: { __type: "[TierPrice]" },
    price_view: { __type: "PriceViewEnum" },
    product_links: { __type: "[ProductLinksInterface]" },
    rating_summary: { __type: "Float!" },
    redirect_code: { __type: "Int!" },
    related_products: { __type: "[ProductInterface]" },
    relative_url: { __type: "String" },
    review_count: { __type: "Int!" },
    reviews: {
      __type: "ProductReviews!",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
    ship_bundle_items: { __type: "ShipBundleItemsEnum" },
    short_description: { __type: "ComplexTextValue" },
    size: { __type: "Int" },
    sku: { __type: "String" },
    small_image: { __type: "ProductImage" },
    special_from_date: { __type: "String" },
    special_price: { __type: "Float" },
    special_to_date: { __type: "String" },
    stock_status: { __type: "ProductStockStatus" },
    swatch_image: { __type: "String" },
    tema: { __type: "Int" },
    thumbnail: { __type: "ProductImage" },
    tier_price: { __type: "Float" },
    tier_prices: { __type: "[ProductTierPrices]" },
    tipologia: { __type: "Int" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
    type_id: { __type: "String" },
    uid: { __type: "ID!" },
    updated_at: { __type: "String" },
    upsell_products: { __type: "[ProductInterface]" },
    url_key: { __type: "String" },
    url_path: { __type: "String" },
    url_rewrites: { __type: "[UrlRewrite]" },
    url_suffix: { __type: "String" },
    websites: { __type: "[Website]" },
    weight: { __type: "Float" },
  },
  BundleProductCartItemInput: {
    bundle_options: { __type: "[BundleOptionInput]!" },
    customizable_options: { __type: "[CustomizableOptionInput]" },
    data: { __type: "CartItemInput!" },
  },
  BundleShipmentItem: {
    __typename: { __type: "String!" },
    bundle_options: { __type: "[ItemSelectedBundleOption]" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_shipped: { __type: "Float!" },
  },
  BundleWishlistItem: {
    __typename: { __type: "String!" },
    added_at: { __type: "String!" },
    bundle_options: { __type: "[SelectedBundleOption]" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    quantity: { __type: "Float!" },
  },
  ButtonStyles: {
    __typename: { __type: "String!" },
    color: { __type: "String" },
    height: { __type: "Int" },
    label: { __type: "String" },
    layout: { __type: "String" },
    shape: { __type: "String" },
    tagline: { __type: "Boolean" },
    use_default_height: { __type: "Boolean" },
  },
  CancelOrderInput: {
    order_id: { __type: "ID!" },
    reason: { __type: "String!" },
  },
  CancelOrderOutput: {
    __typename: { __type: "String!" },
    error: { __type: "String" },
    order: { __type: "CustomerOrder" },
  },
  CancellationReason: {
    __typename: { __type: "String!" },
    description: { __type: "String!" },
  },
  Card: {
    __typename: { __type: "String!" },
    bin_details: { __type: "CardBin" },
    card_expiry_month: { __type: "String" },
    card_expiry_year: { __type: "String" },
    last_digits: { __type: "String" },
    name: { __type: "String" },
  },
  CardBin: { __typename: { __type: "String!" }, bin: { __type: "String" } },
  CardPaymentSourceInput: {
    billing_address: { __type: "BillingAddressPaymentSourceInput!" },
    name: { __type: "String" },
  },
  CardPaymentSourceOutput: {
    __typename: { __type: "String!" },
    brand: { __type: "String" },
    expiry: { __type: "String" },
    last_digits: { __type: "String" },
  },
  Cart: {
    __typename: { __type: "String!" },
    applied_coupon: { __type: "AppliedCoupon" },
    applied_coupons: { __type: "[AppliedCoupon]" },
    available_payment_methods: { __type: "[AvailablePaymentMethod]" },
    billing_address: { __type: "BillingCartAddress" },
    email: { __type: "String" },
    gift_message: { __type: "GiftMessage" },
    id: { __type: "ID!" },
    is_virtual: { __type: "Boolean!" },
    items: { __type: "[CartItemInterface]" },
    itemsV2: {
      __type: "CartItems",
      __args: {
        currentPage: "Int",
        pageSize: "Int",
        sort: "QuoteItemsSortInput",
      },
    },
    prices: { __type: "CartPrices" },
    selected_payment_method: { __type: "SelectedPaymentMethod" },
    shipping_addresses: { __type: "[ShippingCartAddress]!" },
    total_quantity: { __type: "Float!" },
  },
  CartAddressCountry: {
    __typename: { __type: "String!" },
    code: { __type: "String!" },
    label: { __type: "String!" },
  },
  CartAddressInput: {
    city: { __type: "String!" },
    company: { __type: "String" },
    country_code: { __type: "String!" },
    fax: { __type: "String" },
    firstname: { __type: "String!" },
    lastname: { __type: "String!" },
    middlename: { __type: "String" },
    postcode: { __type: "String" },
    prefix: { __type: "String" },
    region: { __type: "String" },
    region_id: { __type: "Int" },
    save_in_address_book: { __type: "Boolean" },
    street: { __type: "[String]!" },
    suffix: { __type: "String" },
    telephone: { __type: "String" },
    vat_id: { __type: "String" },
  },
  CartAddressInterface: {
    __typename: { __type: "String!" },
    city: { __type: "String!" },
    company: { __type: "String" },
    country: { __type: "CartAddressCountry!" },
    fax: { __type: "String" },
    firstname: { __type: "String!" },
    lastname: { __type: "String!" },
    middlename: { __type: "String" },
    postcode: { __type: "String" },
    prefix: { __type: "String" },
    region: { __type: "CartAddressRegion" },
    street: { __type: "[String]!" },
    suffix: { __type: "String" },
    telephone: { __type: "String" },
    uid: { __type: "String!" },
    vat_id: { __type: "String" },
    $on: { __type: "$CartAddressInterface!" },
  },
  CartAddressRegion: {
    __typename: { __type: "String!" },
    code: { __type: "String" },
    label: { __type: "String" },
    region_id: { __type: "Int" },
  },
  CartDiscount: {
    __typename: { __type: "String!" },
    amount: { __type: "Money!" },
    label: { __type: "[String]!" },
  },
  CartItemError: {
    __typename: { __type: "String!" },
    code: { __type: "CartItemErrorType!" },
    message: { __type: "String!" },
  },
  CartItemInput: {
    entered_options: { __type: "[EnteredOptionInput]" },
    parent_sku: { __type: "String" },
    quantity: { __type: "Float!" },
    selected_options: { __type: "[ID]" },
    sku: { __type: "String!" },
  },
  CartItemInterface: {
    __typename: { __type: "String!" },
    errors: { __type: "[CartItemError]" },
    id: { __type: "String!" },
    is_available: { __type: "Boolean!" },
    prices: { __type: "CartItemPrices" },
    product: { __type: "ProductInterface!" },
    quantity: { __type: "Float!" },
    uid: { __type: "ID!" },
    $on: { __type: "$CartItemInterface!" },
  },
  CartItemPrices: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    price: { __type: "Money!" },
    price_including_tax: { __type: "Money!" },
    row_total: { __type: "Money!" },
    row_total_including_tax: { __type: "Money!" },
    total_item_discount: { __type: "Money" },
  },
  CartItemQuantity: {
    __typename: { __type: "String!" },
    cart_item_id: { __type: "Int!" },
    quantity: { __type: "Float!" },
  },
  CartItemSelectedOptionValuePrice: {
    __typename: { __type: "String!" },
    type: { __type: "PriceTypeEnum!" },
    units: { __type: "String!" },
    value: { __type: "Float!" },
  },
  CartItemUpdateInput: {
    cart_item_id: { __type: "Int" },
    cart_item_uid: { __type: "ID" },
    customizable_options: { __type: "[CustomizableOptionInput]" },
    gift_message: { __type: "GiftMessageInput" },
    quantity: { __type: "Float" },
  },
  CartItems: {
    __typename: { __type: "String!" },
    items: { __type: "[CartItemInterface]!" },
    page_info: { __type: "SearchResultPageInfo" },
    total_count: { __type: "Int!" },
  },
  CartPrices: {
    __typename: { __type: "String!" },
    applied_taxes: { __type: "[CartTaxItem]" },
    discount: { __type: "CartDiscount" },
    discounts: { __type: "[Discount]" },
    grand_total: { __type: "Money" },
    subtotal_excluding_tax: { __type: "Money" },
    subtotal_including_tax: { __type: "Money" },
    subtotal_with_discount_excluding_tax: { __type: "Money" },
  },
  CartTaxItem: {
    __typename: { __type: "String!" },
    amount: { __type: "Money!" },
    label: { __type: "String!" },
  },
  CartUserInputError: {
    __typename: { __type: "String!" },
    code: { __type: "CartUserInputErrorType!" },
    message: { __type: "String!" },
  },
  CatalogAttributeMetadata: {
    __typename: { __type: "String!" },
    apply_to: { __type: "[CatalogAttributeApplyToEnum]" },
    code: { __type: "ID!" },
    default_value: { __type: "String" },
    entity_type: { __type: "AttributeEntityTypeEnum!" },
    frontend_class: { __type: "String" },
    frontend_input: { __type: "AttributeFrontendInputEnum" },
    is_comparable: { __type: "Boolean" },
    is_filterable: { __type: "Boolean" },
    is_filterable_in_search: { __type: "Boolean" },
    is_html_allowed_on_front: { __type: "Boolean" },
    is_required: { __type: "Boolean!" },
    is_searchable: { __type: "Boolean" },
    is_unique: { __type: "Boolean!" },
    is_used_for_price_rules: { __type: "Boolean" },
    is_used_for_promo_rules: { __type: "Boolean" },
    is_visible_in_advanced_search: { __type: "Boolean" },
    is_visible_on_front: { __type: "Boolean" },
    is_wysiwyg_enabled: { __type: "Boolean" },
    label: { __type: "String" },
    options: { __type: "[CustomAttributeOptionInterface]!" },
    swatch_input_type: { __type: "SwatchInputTypeEnum" },
    update_product_preview_image: { __type: "Boolean" },
    use_product_image_for_swatch: { __type: "Boolean" },
    used_in_product_listing: { __type: "Boolean" },
  },
  CategoryFilterInput: {
    category_uid: { __type: "FilterEqualTypeInput" },
    ids: { __type: "FilterEqualTypeInput" },
    name: { __type: "FilterMatchTypeInput" },
    parent_category_uid: { __type: "FilterEqualTypeInput" },
    parent_id: { __type: "FilterEqualTypeInput" },
    url_key: { __type: "FilterEqualTypeInput" },
    url_path: { __type: "FilterEqualTypeInput" },
  },
  CategoryInterface: {
    __typename: { __type: "String!" },
    available_sort_by: { __type: "[String]" },
    breadcrumbs: { __type: "[Breadcrumb]" },
    canonical_url: { __type: "String" },
    children_count: { __type: "String" },
    cms_block: { __type: "CmsBlock" },
    created_at: { __type: "String" },
    custom_layout_update_file: { __type: "String" },
    default_sort_by: { __type: "String" },
    description: { __type: "String" },
    display_mode: { __type: "String" },
    filter_price_range: { __type: "Float" },
    id: { __type: "Int" },
    image: { __type: "String" },
    include_in_menu: { __type: "Int" },
    is_anchor: { __type: "Int" },
    is_on_home: { __type: "Int" },
    landing_page: { __type: "Int" },
    level: { __type: "Int" },
    meta_description: { __type: "String" },
    meta_keywords: { __type: "String" },
    meta_title: { __type: "String" },
    name: { __type: "String" },
    path: { __type: "String" },
    path_in_store: { __type: "String" },
    position: { __type: "Int" },
    product_count: { __type: "Int" },
    products: {
      __type: "CategoryProducts",
      __args: {
        currentPage: "Int",
        pageSize: "Int",
        sort: "ProductAttributeSortInput",
      },
    },
    thumbnail: { __type: "String" },
    uid: { __type: "ID!" },
    updated_at: { __type: "String" },
    url_key: { __type: "String" },
    url_path: { __type: "String" },
    url_suffix: { __type: "String" },
    $on: { __type: "$CategoryInterface!" },
  },
  CategoryProducts: {
    __typename: { __type: "String!" },
    items: { __type: "[ProductInterface]" },
    page_info: { __type: "SearchResultPageInfo" },
    total_count: { __type: "Int" },
  },
  CategoryResult: {
    __typename: { __type: "String!" },
    items: { __type: "[CategoryTree]" },
    page_info: { __type: "SearchResultPageInfo" },
    total_count: { __type: "Int" },
  },
  CategoryTree: {
    __typename: { __type: "String!" },
    available_sort_by: { __type: "[String]" },
    breadcrumbs: { __type: "[Breadcrumb]" },
    canonical_url: { __type: "String" },
    children: { __type: "[CategoryTree]" },
    children_count: { __type: "String" },
    cms_block: { __type: "CmsBlock" },
    created_at: { __type: "String" },
    custom_layout_update_file: { __type: "String" },
    default_sort_by: { __type: "String" },
    description: { __type: "String" },
    display_mode: { __type: "String" },
    filter_price_range: { __type: "Float" },
    id: { __type: "Int" },
    image: { __type: "String" },
    include_in_menu: { __type: "Int" },
    is_anchor: { __type: "Int" },
    is_on_home: { __type: "Int" },
    landing_page: { __type: "Int" },
    level: { __type: "Int" },
    meta_description: { __type: "String" },
    meta_keywords: { __type: "String" },
    meta_title: { __type: "String" },
    name: { __type: "String" },
    path: { __type: "String" },
    path_in_store: { __type: "String" },
    position: { __type: "Int" },
    product_count: { __type: "Int" },
    products: {
      __type: "CategoryProducts",
      __args: {
        currentPage: "Int",
        pageSize: "Int",
        sort: "ProductAttributeSortInput",
      },
    },
    redirect_code: { __type: "Int!" },
    relative_url: { __type: "String" },
    thumbnail: { __type: "String" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
    uid: { __type: "ID!" },
    updated_at: { __type: "String" },
    url_key: { __type: "String" },
    url_path: { __type: "String" },
    url_suffix: { __type: "String" },
  },
  CheckoutAgreement: {
    __typename: { __type: "String!" },
    agreement_id: { __type: "Int!" },
    checkbox_text: { __type: "String!" },
    content: { __type: "String!" },
    content_height: { __type: "String" },
    is_html: { __type: "Boolean!" },
    mode: { __type: "CheckoutAgreementMode!" },
    name: { __type: "String!" },
  },
  CheckoutUserInputError: {
    __typename: { __type: "String!" },
    code: { __type: "CheckoutUserInputErrorCodes!" },
    message: { __type: "String!" },
    path: { __type: "[String]!" },
  },
  CmsBlock: {
    __typename: { __type: "String!" },
    content: { __type: "String" },
    identifier: { __type: "String" },
    title: { __type: "String" },
  },
  CmsBlocks: {
    __typename: { __type: "String!" },
    items: { __type: "[CmsBlock]" },
  },
  CmsPage: {
    __typename: { __type: "String!" },
    content: { __type: "String" },
    content_heading: { __type: "String" },
    identifier: { __type: "String" },
    meta_description: { __type: "String" },
    meta_keywords: { __type: "String" },
    meta_title: { __type: "String" },
    page_layout: { __type: "String" },
    redirect_code: { __type: "Int!" },
    relative_url: { __type: "String" },
    title: { __type: "String" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
    url_key: { __type: "String" },
  },
  ColorSwatchData: {
    __typename: { __type: "String!" },
    value: { __type: "String" },
  },
  ComparableAttribute: {
    __typename: { __type: "String!" },
    code: { __type: "String!" },
    label: { __type: "String!" },
  },
  ComparableItem: {
    __typename: { __type: "String!" },
    attributes: { __type: "[ProductAttribute]!" },
    product: { __type: "ProductInterface!" },
    uid: { __type: "ID!" },
  },
  CompareList: {
    __typename: { __type: "String!" },
    attributes: { __type: "[ComparableAttribute]" },
    item_count: { __type: "Int!" },
    items: { __type: "[ComparableItem]" },
    uid: { __type: "ID!" },
  },
  CompleteOrderInput: {
    cartId: { __type: "String!" },
    id: { __type: "String!" },
  },
  ComplexTextValue: {
    __typename: { __type: "String!" },
    html: { __type: "String!" },
  },
  ConfigurableAttributeOption: {
    __typename: { __type: "String!" },
    code: { __type: "String" },
    label: { __type: "String" },
    uid: { __type: "ID!" },
    value_index: { __type: "Int" },
  },
  ConfigurableCartItem: {
    __typename: { __type: "String!" },
    configurable_options: { __type: "[SelectedConfigurableOption]!" },
    configured_variant: { __type: "ProductInterface!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    errors: { __type: "[CartItemError]" },
    gift_message: { __type: "GiftMessage" },
    id: { __type: "String!" },
    is_available: { __type: "Boolean!" },
    prices: { __type: "CartItemPrices" },
    product: { __type: "ProductInterface!" },
    quantity: { __type: "Float!" },
    uid: { __type: "ID!" },
  },
  ConfigurableOptionAvailableForSelection: {
    __typename: { __type: "String!" },
    attribute_code: { __type: "String!" },
    option_value_uids: { __type: "[ID]!" },
  },
  ConfigurableProduct: {
    __typename: { __type: "String!" },
    attribute_set_id: { __type: "Int" },
    canonical_url: { __type: "String" },
    categories: { __type: "[CategoryInterface]" },
    color: { __type: "Int" },
    configurable_options: { __type: "[ConfigurableProductOptions]" },
    configurable_product_options_selection: {
      __type: "ConfigurableProductOptionsSelection",
      __args: { configurableOptionValueUids: "[ID!]" },
    },
    country_of_manufacture: { __type: "String" },
    created_at: { __type: "String" },
    crosssell_products: { __type: "[ProductInterface]" },
    custom_attributesV2: {
      __type: "ProductCustomAttributes",
      __args: { filters: "AttributeFilterInput" },
    },
    description: { __type: "ComplexTextValue" },
    figure_size: { __type: "String" },
    gift_message_available: { __type: "String" },
    id: { __type: "Int" },
    image: { __type: "ProductImage" },
    is_suggested: { __type: "Int" },
    manufacturer: { __type: "Int" },
    match_collezione2: { __type: "Int" },
    media_gallery: { __type: "[MediaGalleryInterface]" },
    media_gallery_entries: { __type: "[MediaGalleryEntry]" },
    meta_description: { __type: "String" },
    meta_keyword: { __type: "String" },
    meta_title: { __type: "String" },
    name: { __type: "String" },
    new_from_date: { __type: "String" },
    new_to_date: { __type: "String" },
    only_x_left_in_stock: { __type: "Float" },
    options: { __type: "[CustomizableOptionInterface]" },
    options_container: { __type: "String" },
    price: { __type: "ProductPrices" },
    price_range: { __type: "PriceRange!" },
    price_tiers: { __type: "[TierPrice]" },
    product_links: { __type: "[ProductLinksInterface]" },
    rating_summary: { __type: "Float!" },
    redirect_code: { __type: "Int!" },
    related_products: { __type: "[ProductInterface]" },
    relative_url: { __type: "String" },
    review_count: { __type: "Int!" },
    reviews: {
      __type: "ProductReviews!",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
    short_description: { __type: "ComplexTextValue" },
    size: { __type: "Int" },
    sku: { __type: "String" },
    small_image: { __type: "ProductImage" },
    special_from_date: { __type: "String" },
    special_price: { __type: "Float" },
    special_to_date: { __type: "String" },
    stock_status: { __type: "ProductStockStatus" },
    swatch_image: { __type: "String" },
    tema: { __type: "Int" },
    thumbnail: { __type: "ProductImage" },
    tier_price: { __type: "Float" },
    tier_prices: { __type: "[ProductTierPrices]" },
    tipologia: { __type: "Int" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
    type_id: { __type: "String" },
    uid: { __type: "ID!" },
    updated_at: { __type: "String" },
    upsell_products: { __type: "[ProductInterface]" },
    url_key: { __type: "String" },
    url_path: { __type: "String" },
    url_rewrites: { __type: "[UrlRewrite]" },
    url_suffix: { __type: "String" },
    variants: { __type: "[ConfigurableVariant]" },
    websites: { __type: "[Website]" },
    weight: { __type: "Float" },
  },
  ConfigurableProductCartItemInput: {
    customizable_options: { __type: "[CustomizableOptionInput]" },
    data: { __type: "CartItemInput!" },
    parent_sku: { __type: "String" },
    variant_sku: { __type: "String" },
  },
  ConfigurableProductOption: {
    __typename: { __type: "String!" },
    attribute_code: { __type: "String!" },
    label: { __type: "String!" },
    uid: { __type: "ID!" },
    values: { __type: "[ConfigurableProductOptionValue]" },
  },
  ConfigurableProductOptionValue: {
    __typename: { __type: "String!" },
    is_available: { __type: "Boolean!" },
    is_use_default: { __type: "Boolean!" },
    label: { __type: "String!" },
    swatch: { __type: "SwatchDataInterface" },
    uid: { __type: "ID!" },
  },
  ConfigurableProductOptions: {
    __typename: { __type: "String!" },
    attribute_code: { __type: "String" },
    attribute_id: { __type: "String" },
    attribute_id_v2: { __type: "Int" },
    attribute_uid: { __type: "ID!" },
    id: { __type: "Int" },
    label: { __type: "String" },
    position: { __type: "Int" },
    product_id: { __type: "Int" },
    uid: { __type: "ID!" },
    use_default: { __type: "Boolean" },
    values: { __type: "[ConfigurableProductOptionsValues]" },
  },
  ConfigurableProductOptionsSelection: {
    __typename: { __type: "String!" },
    configurable_options: { __type: "[ConfigurableProductOption]" },
    media_gallery: { __type: "[MediaGalleryInterface]" },
    options_available_for_selection: {
      __type: "[ConfigurableOptionAvailableForSelection]",
    },
    variant: { __type: "SimpleProduct" },
  },
  ConfigurableProductOptionsValues: {
    __typename: { __type: "String!" },
    default_label: { __type: "String" },
    label: { __type: "String" },
    store_label: { __type: "String" },
    swatch_data: { __type: "SwatchDataInterface" },
    uid: { __type: "ID" },
    use_default_value: { __type: "Boolean" },
    value_index: { __type: "Int" },
  },
  ConfigurableVariant: {
    __typename: { __type: "String!" },
    attributes: { __type: "[ConfigurableAttributeOption]" },
    product: { __type: "SimpleProduct" },
  },
  ConfigurableWishlistItem: {
    __typename: { __type: "String!" },
    added_at: { __type: "String!" },
    child_sku: { __type: "String!" },
    configurable_options: { __type: "[SelectedConfigurableOption]" },
    configured_variant: { __type: "ProductInterface" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    quantity: { __type: "Float!" },
  },
  ConfirmEmailInput: {
    confirmation_key: { __type: "String!" },
    email: { __type: "String!" },
  },
  ContactUsInput: {
    comment: { __type: "String!" },
    email: { __type: "String!" },
    name: { __type: "String!" },
    telephone: { __type: "String" },
  },
  ContactUsOutput: {
    __typename: { __type: "String!" },
    status: { __type: "Boolean!" },
  },
  Country: {
    __typename: { __type: "String!" },
    available_regions: { __type: "[Region]" },
    full_name_english: { __type: "String" },
    full_name_locale: { __type: "String" },
    id: { __type: "String" },
    three_letter_abbreviation: { __type: "String" },
    two_letter_abbreviation: { __type: "String" },
  },
  CreateCompareListInput: { products: { __type: "[ID]" } },
  CreateGuestCartInput: { cart_uid: { __type: "ID" } },
  CreateGuestCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart" },
  },
  CreatePayflowProTokenOutput: {
    __typename: { __type: "String!" },
    response_message: { __type: "String!" },
    result: { __type: "Int!" },
    result_code: { __type: "Int!" },
    secure_token: { __type: "String!" },
    secure_token_id: { __type: "String!" },
  },
  CreatePaymentOrderInput: {
    cartId: { __type: "String!" },
    location: { __type: "PaymentLocation!" },
    methodCode: { __type: "String!" },
    paymentSource: { __type: "String!" },
    vaultIntent: { __type: "Boolean" },
  },
  CreatePaymentOrderOutput: {
    __typename: { __type: "String!" },
    amount: { __type: "Float" },
    currency_code: { __type: "String" },
    id: { __type: "String" },
    mp_order_id: { __type: "String" },
    status: { __type: "String" },
  },
  CreateProductReviewInput: {
    nickname: { __type: "String!" },
    ratings: { __type: "[ProductReviewRatingInput]!" },
    sku: { __type: "String!" },
    summary: { __type: "String!" },
    text: { __type: "String!" },
  },
  CreateProductReviewOutput: {
    __typename: { __type: "String!" },
    review: { __type: "ProductReview!" },
  },
  CreateVaultCardPaymentTokenInput: {
    card_description: { __type: "String" },
    setup_token_id: { __type: "String!" },
  },
  CreateVaultCardPaymentTokenOutput: {
    __typename: { __type: "String!" },
    payment_source: { __type: "PaymentSourceOutput!" },
    vault_token_id: { __type: "String!" },
  },
  CreateVaultCardSetupTokenInput: {
    setup_token: { __type: "VaultSetupTokenInput!" },
    three_ds_mode: { __type: "ThreeDSMode" },
  },
  CreateVaultCardSetupTokenOutput: {
    __typename: { __type: "String!" },
    setup_token: { __type: "String!" },
  },
  CreditCardDetailsInput: {
    cc_exp_month: { __type: "Int!" },
    cc_exp_year: { __type: "Int!" },
    cc_last_4: { __type: "Int!" },
    cc_type: { __type: "String!" },
  },
  CreditMemo: {
    __typename: { __type: "String!" },
    comments: { __type: "[SalesCommentItem]" },
    id: { __type: "ID!" },
    items: { __type: "[CreditMemoItemInterface]" },
    number: { __type: "String!" },
    total: { __type: "CreditMemoTotal" },
  },
  CreditMemoItem: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_refunded: { __type: "Float" },
  },
  CreditMemoItemInterface: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_refunded: { __type: "Float" },
    $on: { __type: "$CreditMemoItemInterface!" },
  },
  CreditMemoTotal: {
    __typename: { __type: "String!" },
    adjustment: { __type: "Money!" },
    base_grand_total: { __type: "Money!" },
    discounts: { __type: "[Discount]" },
    grand_total: { __type: "Money!" },
    shipping_handling: { __type: "ShippingHandling" },
    subtotal: { __type: "Money!" },
    taxes: { __type: "[TaxItem]" },
    total_shipping: { __type: "Money!" },
    total_tax: { __type: "Money!" },
  },
  Currency: {
    __typename: { __type: "String!" },
    available_currency_codes: { __type: "[String]" },
    base_currency_code: { __type: "String" },
    base_currency_symbol: { __type: "String" },
    default_display_currecy_code: { __type: "String" },
    default_display_currecy_symbol: { __type: "String" },
    default_display_currency_code: { __type: "String" },
    default_display_currency_symbol: { __type: "String" },
    exchange_rates: { __type: "[ExchangeRate]" },
  },
  CustomAttributeMetadata: {
    __typename: { __type: "String!" },
    items: { __type: "[Attribute]" },
  },
  CustomAttributeMetadataInterface: {
    __typename: { __type: "String!" },
    code: { __type: "ID!" },
    default_value: { __type: "String" },
    entity_type: { __type: "AttributeEntityTypeEnum!" },
    frontend_class: { __type: "String" },
    frontend_input: { __type: "AttributeFrontendInputEnum" },
    is_required: { __type: "Boolean!" },
    is_unique: { __type: "Boolean!" },
    label: { __type: "String" },
    options: { __type: "[CustomAttributeOptionInterface]!" },
    $on: { __type: "$CustomAttributeMetadataInterface!" },
  },
  CustomAttributeOptionInterface: {
    __typename: { __type: "String!" },
    is_default: { __type: "Boolean!" },
    label: { __type: "String!" },
    value: { __type: "String!" },
    $on: { __type: "$CustomAttributeOptionInterface!" },
  },
  Customer: {
    __typename: { __type: "String!" },
    addresses: { __type: "[CustomerAddress]" },
    allow_remote_shopping_assistance: { __type: "Boolean!" },
    compare_list: { __type: "CompareList" },
    confirmation_status: { __type: "ConfirmationStatusEnum!" },
    created_at: { __type: "String" },
    custom_attributes: {
      __type: "[AttributeValueInterface]",
      __args: { attributeCodes: "[ID!]" },
    },
    date_of_birth: { __type: "String" },
    default_billing: { __type: "String" },
    default_shipping: { __type: "String" },
    dob: { __type: "String" },
    email: { __type: "String" },
    firstname: { __type: "String" },
    gender: { __type: "Int" },
    group_id: { __type: "Int" },
    id: { __type: "Int" },
    is_subscribed: { __type: "Boolean" },
    lastname: { __type: "String" },
    middlename: { __type: "String" },
    orders: {
      __type: "CustomerOrders",
      __args: {
        currentPage: "Int",
        filter: "CustomerOrdersFilterInput",
        pageSize: "Int",
        scope: "ScopeTypeEnum",
        sort: "CustomerOrderSortInput",
      },
    },
    prefix: { __type: "String" },
    reviews: {
      __type: "ProductReviews!",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
    suffix: { __type: "String" },
    taxvat: { __type: "String" },
    wishlist: { __type: "Wishlist!" },
    wishlist_v2: { __type: "Wishlist", __args: { id: "ID!" } },
    wishlists: {
      __type: "[Wishlist]!",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
  },
  CustomerAddress: {
    __typename: { __type: "String!" },
    city: { __type: "String" },
    company: { __type: "String" },
    country_code: { __type: "CountryCodeEnum" },
    country_id: { __type: "String" },
    custom_attributes: { __type: "[CustomerAddressAttribute]" },
    custom_attributesV2: {
      __type: "[AttributeValueInterface]!",
      __args: { attributeCodes: "[ID!]" },
    },
    customer_id: { __type: "Int" },
    default_billing: { __type: "Boolean" },
    default_shipping: { __type: "Boolean" },
    extension_attributes: { __type: "[CustomerAddressAttribute]" },
    fax: { __type: "String" },
    firstname: { __type: "String" },
    id: { __type: "Int" },
    lastname: { __type: "String" },
    middlename: { __type: "String" },
    postcode: { __type: "String" },
    prefix: { __type: "String" },
    region: { __type: "CustomerAddressRegion" },
    region_id: { __type: "Int" },
    street: { __type: "[String]" },
    suffix: { __type: "String" },
    telephone: { __type: "String" },
    vat_id: { __type: "String" },
  },
  CustomerAddressAttribute: {
    __typename: { __type: "String!" },
    attribute_code: { __type: "String" },
    value: { __type: "String" },
  },
  CustomerAddressAttributeInput: {
    attribute_code: { __type: "String!" },
    value: { __type: "String!" },
  },
  CustomerAddressInput: {
    city: { __type: "String" },
    company: { __type: "String" },
    country_code: { __type: "CountryCodeEnum" },
    country_id: { __type: "CountryCodeEnum" },
    custom_attributes: { __type: "[CustomerAddressAttributeInput]" },
    custom_attributesV2: { __type: "[AttributeValueInput]" },
    default_billing: { __type: "Boolean" },
    default_shipping: { __type: "Boolean" },
    fax: { __type: "String" },
    firstname: { __type: "String" },
    lastname: { __type: "String" },
    middlename: { __type: "String" },
    postcode: { __type: "String" },
    prefix: { __type: "String" },
    region: { __type: "CustomerAddressRegionInput" },
    street: { __type: "[String]" },
    suffix: { __type: "String" },
    telephone: { __type: "String" },
    vat_id: { __type: "String" },
  },
  CustomerAddressRegion: {
    __typename: { __type: "String!" },
    region: { __type: "String" },
    region_code: { __type: "String" },
    region_id: { __type: "Int" },
  },
  CustomerAddressRegionInput: {
    region: { __type: "String" },
    region_code: { __type: "String" },
    region_id: { __type: "Int" },
  },
  CustomerAttributeMetadata: {
    __typename: { __type: "String!" },
    code: { __type: "ID!" },
    default_value: { __type: "String" },
    entity_type: { __type: "AttributeEntityTypeEnum!" },
    frontend_class: { __type: "String" },
    frontend_input: { __type: "AttributeFrontendInputEnum" },
    input_filter: { __type: "InputFilterEnum" },
    is_required: { __type: "Boolean!" },
    is_unique: { __type: "Boolean!" },
    label: { __type: "String" },
    multiline_count: { __type: "Int" },
    options: { __type: "[CustomAttributeOptionInterface]!" },
    sort_order: { __type: "Int" },
    validate_rules: { __type: "[ValidationRule]" },
  },
  CustomerCreateInput: {
    allow_remote_shopping_assistance: { __type: "Boolean" },
    custom_attributes: { __type: "[AttributeValueInput]" },
    date_of_birth: { __type: "String" },
    dob: { __type: "String" },
    email: { __type: "String!" },
    firstname: { __type: "String!" },
    gender: { __type: "Int" },
    is_subscribed: { __type: "Boolean" },
    lastname: { __type: "String!" },
    middlename: { __type: "String" },
    password: { __type: "String" },
    prefix: { __type: "String" },
    suffix: { __type: "String" },
    taxvat: { __type: "String" },
  },
  CustomerDownloadableProduct: {
    __typename: { __type: "String!" },
    date: { __type: "String" },
    download_url: { __type: "String" },
    order_increment_id: { __type: "String" },
    remaining_downloads: { __type: "String" },
    status: { __type: "String" },
  },
  CustomerDownloadableProducts: {
    __typename: { __type: "String!" },
    items: { __type: "[CustomerDownloadableProduct]" },
  },
  CustomerInput: {
    date_of_birth: { __type: "String" },
    dob: { __type: "String" },
    email: { __type: "String" },
    firstname: { __type: "String" },
    gender: { __type: "Int" },
    is_subscribed: { __type: "Boolean" },
    lastname: { __type: "String" },
    middlename: { __type: "String" },
    password: { __type: "String" },
    prefix: { __type: "String" },
    suffix: { __type: "String" },
    taxvat: { __type: "String" },
  },
  CustomerOrder: {
    __typename: { __type: "String!" },
    applied_coupons: { __type: "[AppliedCoupon]!" },
    billing_address: { __type: "OrderAddress" },
    carrier: { __type: "String" },
    comments: { __type: "[SalesCommentItem]" },
    created_at: { __type: "String" },
    credit_memos: { __type: "[CreditMemo]" },
    email: { __type: "String" },
    gift_message: { __type: "GiftMessage" },
    grand_total: { __type: "Float" },
    id: { __type: "ID!" },
    increment_id: { __type: "String" },
    invoices: { __type: "[Invoice]!" },
    items: { __type: "[OrderItemInterface]" },
    number: { __type: "String!" },
    order_date: { __type: "String!" },
    order_number: { __type: "String!" },
    payment_methods: { __type: "[OrderPaymentMethod]" },
    shipments: { __type: "[OrderShipment]" },
    shipping_address: { __type: "OrderAddress" },
    shipping_method: { __type: "String" },
    status: { __type: "String!" },
    token: { __type: "String!" },
    total: { __type: "OrderTotal" },
  },
  CustomerOrderSortInput: {
    sort_direction: { __type: "SortEnum!" },
    sort_field: { __type: "CustomerOrderSortableField!" },
  },
  CustomerOrders: {
    __typename: { __type: "String!" },
    items: { __type: "[CustomerOrder]!" },
    page_info: { __type: "SearchResultPageInfo" },
    total_count: { __type: "Int" },
  },
  CustomerOrdersFilterInput: { number: { __type: "FilterStringTypeInput" } },
  CustomerOutput: {
    __typename: { __type: "String!" },
    customer: { __type: "Customer!" },
  },
  CustomerPaymentTokens: {
    __typename: { __type: "String!" },
    items: { __type: "[PaymentToken]!" },
  },
  CustomerToken: {
    __typename: { __type: "String!" },
    token: { __type: "String" },
  },
  CustomerUpdateInput: {
    allow_remote_shopping_assistance: { __type: "Boolean" },
    custom_attributes: { __type: "[AttributeValueInput]" },
    date_of_birth: { __type: "String" },
    dob: { __type: "String" },
    firstname: { __type: "String" },
    gender: { __type: "Int" },
    is_subscribed: { __type: "Boolean" },
    lastname: { __type: "String" },
    middlename: { __type: "String" },
    prefix: { __type: "String" },
    suffix: { __type: "String" },
    taxvat: { __type: "String" },
  },
  CustomizableAreaOption: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    product_sku: { __type: "String" },
    required: { __type: "Boolean" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
    value: { __type: "CustomizableAreaValue" },
  },
  CustomizableAreaValue: {
    __typename: { __type: "String!" },
    max_characters: { __type: "Int" },
    price: { __type: "Float" },
    price_type: { __type: "PriceTypeEnum" },
    sku: { __type: "String" },
    uid: { __type: "ID!" },
  },
  CustomizableCheckboxOption: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    required: { __type: "Boolean" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
    value: { __type: "[CustomizableCheckboxValue]" },
  },
  CustomizableCheckboxValue: {
    __typename: { __type: "String!" },
    option_type_id: { __type: "Int" },
    price: { __type: "Float" },
    price_type: { __type: "PriceTypeEnum" },
    sku: { __type: "String" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
  },
  CustomizableDateOption: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    product_sku: { __type: "String" },
    required: { __type: "Boolean" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
    value: { __type: "CustomizableDateValue" },
  },
  CustomizableDateValue: {
    __typename: { __type: "String!" },
    price: { __type: "Float" },
    price_type: { __type: "PriceTypeEnum" },
    sku: { __type: "String" },
    type: { __type: "CustomizableDateTypeEnum" },
    uid: { __type: "ID!" },
  },
  CustomizableDropDownOption: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    required: { __type: "Boolean" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
    value: { __type: "[CustomizableDropDownValue]" },
  },
  CustomizableDropDownValue: {
    __typename: { __type: "String!" },
    option_type_id: { __type: "Int" },
    price: { __type: "Float" },
    price_type: { __type: "PriceTypeEnum" },
    sku: { __type: "String" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
  },
  CustomizableFieldOption: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    product_sku: { __type: "String" },
    required: { __type: "Boolean" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
    value: { __type: "CustomizableFieldValue" },
  },
  CustomizableFieldValue: {
    __typename: { __type: "String!" },
    max_characters: { __type: "Int" },
    price: { __type: "Float" },
    price_type: { __type: "PriceTypeEnum" },
    sku: { __type: "String" },
    uid: { __type: "ID!" },
  },
  CustomizableFileOption: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    product_sku: { __type: "String" },
    required: { __type: "Boolean" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
    value: { __type: "CustomizableFileValue" },
  },
  CustomizableFileValue: {
    __typename: { __type: "String!" },
    file_extension: { __type: "String" },
    image_size_x: { __type: "Int" },
    image_size_y: { __type: "Int" },
    price: { __type: "Float" },
    price_type: { __type: "PriceTypeEnum" },
    sku: { __type: "String" },
    uid: { __type: "ID!" },
  },
  CustomizableMultipleOption: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    required: { __type: "Boolean" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
    value: { __type: "[CustomizableMultipleValue]" },
  },
  CustomizableMultipleValue: {
    __typename: { __type: "String!" },
    option_type_id: { __type: "Int" },
    price: { __type: "Float" },
    price_type: { __type: "PriceTypeEnum" },
    sku: { __type: "String" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
  },
  CustomizableOptionInput: {
    id: { __type: "Int" },
    uid: { __type: "ID" },
    value_string: { __type: "String!" },
  },
  CustomizableOptionInterface: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    required: { __type: "Boolean" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
    $on: { __type: "$CustomizableOptionInterface!" },
  },
  CustomizableProductInterface: {
    __typename: { __type: "String!" },
    options: { __type: "[CustomizableOptionInterface]" },
    $on: { __type: "$CustomizableProductInterface!" },
  },
  CustomizableRadioOption: {
    __typename: { __type: "String!" },
    option_id: { __type: "Int" },
    required: { __type: "Boolean" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
    value: { __type: "[CustomizableRadioValue]" },
  },
  CustomizableRadioValue: {
    __typename: { __type: "String!" },
    option_type_id: { __type: "Int" },
    price: { __type: "Float" },
    price_type: { __type: "PriceTypeEnum" },
    sku: { __type: "String" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
  },
  DeleteCompareListOutput: {
    __typename: { __type: "String!" },
    result: { __type: "Boolean!" },
  },
  DeletePaymentTokenOutput: {
    __typename: { __type: "String!" },
    customerPaymentTokens: { __type: "CustomerPaymentTokens" },
    result: { __type: "Boolean!" },
  },
  Discount: {
    __typename: { __type: "String!" },
    amount: { __type: "Money!" },
    applied_to: { __type: "CartDiscountType!" },
    coupon: { __type: "AppliedCoupon" },
    label: { __type: "String!" },
  },
  DownloadableCartItem: {
    __typename: { __type: "String!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    errors: { __type: "[CartItemError]" },
    id: { __type: "String!" },
    is_available: { __type: "Boolean!" },
    links: { __type: "[DownloadableProductLinks]" },
    prices: { __type: "CartItemPrices" },
    product: { __type: "ProductInterface!" },
    quantity: { __type: "Float!" },
    samples: { __type: "[DownloadableProductSamples]" },
    uid: { __type: "ID!" },
  },
  DownloadableCreditMemoItem: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    downloadable_links: { __type: "[DownloadableItemsLinks]" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_refunded: { __type: "Float" },
  },
  DownloadableInvoiceItem: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    downloadable_links: { __type: "[DownloadableItemsLinks]" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_invoiced: { __type: "Float" },
  },
  DownloadableItemsLinks: {
    __typename: { __type: "String!" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
  },
  DownloadableOrderItem: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    downloadable_links: { __type: "[DownloadableItemsLinks]" },
    entered_options: { __type: "[OrderItemOption]" },
    gift_message: { __type: "GiftMessage" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    product_type: { __type: "String" },
    product_url_key: { __type: "String" },
    quantity_canceled: { __type: "Float" },
    quantity_invoiced: { __type: "Float" },
    quantity_ordered: { __type: "Float" },
    quantity_refunded: { __type: "Float" },
    quantity_returned: { __type: "Float" },
    quantity_shipped: { __type: "Float" },
    selected_options: { __type: "[OrderItemOption]" },
    status: { __type: "String" },
  },
  DownloadableProduct: {
    __typename: { __type: "String!" },
    attribute_set_id: { __type: "Int" },
    canonical_url: { __type: "String" },
    categories: { __type: "[CategoryInterface]" },
    color: { __type: "Int" },
    country_of_manufacture: { __type: "String" },
    created_at: { __type: "String" },
    crosssell_products: { __type: "[ProductInterface]" },
    custom_attributesV2: {
      __type: "ProductCustomAttributes",
      __args: { filters: "AttributeFilterInput" },
    },
    description: { __type: "ComplexTextValue" },
    downloadable_product_links: { __type: "[DownloadableProductLinks]" },
    downloadable_product_samples: { __type: "[DownloadableProductSamples]" },
    figure_size: { __type: "String" },
    gift_message_available: { __type: "String" },
    id: { __type: "Int" },
    image: { __type: "ProductImage" },
    is_suggested: { __type: "Int" },
    links_purchased_separately: { __type: "Int" },
    links_title: { __type: "String" },
    manufacturer: { __type: "Int" },
    match_collezione2: { __type: "Int" },
    media_gallery: { __type: "[MediaGalleryInterface]" },
    media_gallery_entries: { __type: "[MediaGalleryEntry]" },
    meta_description: { __type: "String" },
    meta_keyword: { __type: "String" },
    meta_title: { __type: "String" },
    name: { __type: "String" },
    new_from_date: { __type: "String" },
    new_to_date: { __type: "String" },
    only_x_left_in_stock: { __type: "Float" },
    options: { __type: "[CustomizableOptionInterface]" },
    options_container: { __type: "String" },
    price: { __type: "ProductPrices" },
    price_range: { __type: "PriceRange!" },
    price_tiers: { __type: "[TierPrice]" },
    product_links: { __type: "[ProductLinksInterface]" },
    rating_summary: { __type: "Float!" },
    redirect_code: { __type: "Int!" },
    related_products: { __type: "[ProductInterface]" },
    relative_url: { __type: "String" },
    review_count: { __type: "Int!" },
    reviews: {
      __type: "ProductReviews!",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
    short_description: { __type: "ComplexTextValue" },
    size: { __type: "Int" },
    sku: { __type: "String" },
    small_image: { __type: "ProductImage" },
    special_from_date: { __type: "String" },
    special_price: { __type: "Float" },
    special_to_date: { __type: "String" },
    stock_status: { __type: "ProductStockStatus" },
    swatch_image: { __type: "String" },
    tema: { __type: "Int" },
    thumbnail: { __type: "ProductImage" },
    tier_price: { __type: "Float" },
    tier_prices: { __type: "[ProductTierPrices]" },
    tipologia: { __type: "Int" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
    type_id: { __type: "String" },
    uid: { __type: "ID!" },
    updated_at: { __type: "String" },
    upsell_products: { __type: "[ProductInterface]" },
    url_key: { __type: "String" },
    url_path: { __type: "String" },
    url_rewrites: { __type: "[UrlRewrite]" },
    url_suffix: { __type: "String" },
    websites: { __type: "[Website]" },
  },
  DownloadableProductCartItemInput: {
    customizable_options: { __type: "[CustomizableOptionInput]" },
    data: { __type: "CartItemInput!" },
    downloadable_product_links: { __type: "[DownloadableProductLinksInput]" },
  },
  DownloadableProductLinks: {
    __typename: { __type: "String!" },
    id: { __type: "Int" },
    is_shareable: { __type: "Boolean" },
    link_type: { __type: "DownloadableFileTypeEnum" },
    number_of_downloads: { __type: "Int" },
    price: { __type: "Float" },
    sample_file: { __type: "String" },
    sample_type: { __type: "DownloadableFileTypeEnum" },
    sample_url: { __type: "String" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
    uid: { __type: "ID!" },
  },
  DownloadableProductLinksInput: { link_id: { __type: "Int!" } },
  DownloadableProductSamples: {
    __typename: { __type: "String!" },
    id: { __type: "Int" },
    sample_file: { __type: "String" },
    sample_type: { __type: "DownloadableFileTypeEnum" },
    sample_url: { __type: "String" },
    sort_order: { __type: "Int" },
    title: { __type: "String" },
  },
  DownloadableWishlistItem: {
    __typename: { __type: "String!" },
    added_at: { __type: "String!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    links_v2: { __type: "[DownloadableProductLinks]" },
    product: { __type: "ProductInterface" },
    quantity: { __type: "Float!" },
    samples: { __type: "[DownloadableProductSamples]" },
  },
  EnteredOptionInput: { uid: { __type: "ID!" }, value: { __type: "String!" } },
  EntityUrl: {
    __typename: { __type: "String!" },
    canonical_url: { __type: "String" },
    entity_uid: { __type: "ID" },
    id: { __type: "Int" },
    redirectCode: { __type: "Int" },
    relative_url: { __type: "String" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
  },
  ErrorInterface: {
    __typename: { __type: "String!" },
    message: { __type: "String!" },
    $on: { __type: "$ErrorInterface!" },
  },
  EstimateAddressInput: {
    country_code: { __type: "CountryCodeEnum!" },
    postcode: { __type: "String" },
    region: { __type: "CustomerAddressRegionInput" },
  },
  EstimateTotalsInput: {
    address: { __type: "EstimateAddressInput!" },
    cart_id: { __type: "String!" },
    shipping_method: { __type: "ShippingMethodInput" },
  },
  EstimateTotalsOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart" },
  },
  ExchangeRate: {
    __typename: { __type: "String!" },
    currency_to: { __type: "String" },
    rate: { __type: "Float" },
  },
  FastlaneConfig: {
    __typename: { __type: "String!" },
    code: { __type: "String" },
    is_visible: { __type: "Boolean" },
    payment_intent: { __type: "String" },
    payment_source: { __type: "String" },
    sdk_params: { __type: "[SDKParams]" },
    sort_order: { __type: "String" },
    three_ds_mode: { __type: "ThreeDSMode" },
    title: { __type: "String" },
  },
  FastlaneMethodInput: {
    payment_source: { __type: "String" },
    paypal_fastlane_token: { __type: "String" },
  },
  FilterEqualTypeInput: {
    eq: { __type: "String" },
    in: { __type: "[String]" },
  },
  FilterMatchTypeInput: {
    match: { __type: "String" },
    match_type: { __type: "FilterMatchTypeEnum" },
  },
  FilterRangeTypeInput: {
    from: { __type: "String" },
    to: { __type: "String" },
  },
  FilterStringTypeInput: {
    eq: { __type: "String" },
    in: { __type: "[String]" },
    match: { __type: "String" },
  },
  FilterTypeInput: {
    eq: { __type: "String" },
    finset: { __type: "[String]" },
    from: { __type: "String" },
    gt: { __type: "String" },
    gteq: { __type: "String" },
    in: { __type: "[String]" },
    like: { __type: "String" },
    lt: { __type: "String" },
    lteq: { __type: "String" },
    moreq: { __type: "String" },
    neq: { __type: "String" },
    nin: { __type: "[String]" },
    notnull: { __type: "String" },
    null: { __type: "String" },
    to: { __type: "String" },
  },
  GenerateCustomerTokenAsAdminInput: { customer_email: { __type: "String!" } },
  GenerateCustomerTokenAsAdminOutput: {
    __typename: { __type: "String!" },
    customer_token: { __type: "String!" },
  },
  GetPaymentSDKOutput: {
    __typename: { __type: "String!" },
    sdkParams: { __type: "[PaymentSDKParamsItem]" },
  },
  GiftMessage: {
    __typename: { __type: "String!" },
    from: { __type: "String!" },
    message: { __type: "String!" },
    to: { __type: "String!" },
  },
  GiftMessageInput: {
    from: { __type: "String!" },
    message: { __type: "String!" },
    to: { __type: "String!" },
  },
  GooglePayButtonStyles: {
    __typename: { __type: "String!" },
    color: { __type: "String" },
    height: { __type: "Int" },
    type: { __type: "String" },
  },
  GooglePayConfig: {
    __typename: { __type: "String!" },
    button_styles: { __type: "GooglePayButtonStyles" },
    code: { __type: "String" },
    is_visible: { __type: "Boolean" },
    payment_intent: { __type: "String" },
    payment_source: { __type: "String" },
    sdk_params: { __type: "[SDKParams]" },
    sort_order: { __type: "String" },
    three_ds_mode: { __type: "ThreeDSMode" },
    title: { __type: "String" },
  },
  GooglePayMethodInput: {
    payment_source: { __type: "String" },
    payments_order_id: { __type: "String" },
    paypal_order_id: { __type: "String" },
  },
  GroupedProduct: {
    __typename: { __type: "String!" },
    attribute_set_id: { __type: "Int" },
    canonical_url: { __type: "String" },
    categories: { __type: "[CategoryInterface]" },
    color: { __type: "Int" },
    country_of_manufacture: { __type: "String" },
    created_at: { __type: "String" },
    crosssell_products: { __type: "[ProductInterface]" },
    custom_attributesV2: {
      __type: "ProductCustomAttributes",
      __args: { filters: "AttributeFilterInput" },
    },
    description: { __type: "ComplexTextValue" },
    figure_size: { __type: "String" },
    gift_message_available: { __type: "String" },
    id: { __type: "Int" },
    image: { __type: "ProductImage" },
    is_suggested: { __type: "Int" },
    items: { __type: "[GroupedProductItem]" },
    manufacturer: { __type: "Int" },
    match_collezione2: { __type: "Int" },
    media_gallery: { __type: "[MediaGalleryInterface]" },
    media_gallery_entries: { __type: "[MediaGalleryEntry]" },
    meta_description: { __type: "String" },
    meta_keyword: { __type: "String" },
    meta_title: { __type: "String" },
    name: { __type: "String" },
    new_from_date: { __type: "String" },
    new_to_date: { __type: "String" },
    only_x_left_in_stock: { __type: "Float" },
    options_container: { __type: "String" },
    price: { __type: "ProductPrices" },
    price_range: { __type: "PriceRange!" },
    price_tiers: { __type: "[TierPrice]" },
    product_links: { __type: "[ProductLinksInterface]" },
    rating_summary: { __type: "Float!" },
    redirect_code: { __type: "Int!" },
    related_products: { __type: "[ProductInterface]" },
    relative_url: { __type: "String" },
    review_count: { __type: "Int!" },
    reviews: {
      __type: "ProductReviews!",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
    short_description: { __type: "ComplexTextValue" },
    size: { __type: "Int" },
    sku: { __type: "String" },
    small_image: { __type: "ProductImage" },
    special_from_date: { __type: "String" },
    special_price: { __type: "Float" },
    special_to_date: { __type: "String" },
    stock_status: { __type: "ProductStockStatus" },
    swatch_image: { __type: "String" },
    tema: { __type: "Int" },
    thumbnail: { __type: "ProductImage" },
    tier_price: { __type: "Float" },
    tier_prices: { __type: "[ProductTierPrices]" },
    tipologia: { __type: "Int" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
    type_id: { __type: "String" },
    uid: { __type: "ID!" },
    updated_at: { __type: "String" },
    upsell_products: { __type: "[ProductInterface]" },
    url_key: { __type: "String" },
    url_path: { __type: "String" },
    url_rewrites: { __type: "[UrlRewrite]" },
    url_suffix: { __type: "String" },
    websites: { __type: "[Website]" },
    weight: { __type: "Float" },
  },
  GroupedProductItem: {
    __typename: { __type: "String!" },
    position: { __type: "Int" },
    product: { __type: "ProductInterface" },
    qty: { __type: "Float" },
  },
  GroupedProductWishlistItem: {
    __typename: { __type: "String!" },
    added_at: { __type: "String!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    quantity: { __type: "Float!" },
  },
  HostedFieldsConfig: {
    __typename: { __type: "String!" },
    cc_vault_code: { __type: "String" },
    code: { __type: "String" },
    is_vault_enabled: { __type: "Boolean" },
    is_visible: { __type: "Boolean" },
    payment_intent: { __type: "String" },
    payment_source: { __type: "String" },
    requires_card_details: { __type: "Boolean" },
    sdk_params: { __type: "[SDKParams]" },
    sort_order: { __type: "String" },
    three_ds: { __type: "Boolean" },
    three_ds_mode: { __type: "ThreeDSMode" },
    title: { __type: "String" },
  },
  HostedFieldsInput: {
    cardBin: { __type: "String" },
    cardExpiryMonth: { __type: "String" },
    cardExpiryYear: { __type: "String" },
    cardLast4: { __type: "String" },
    holderName: { __type: "String" },
    is_active_payment_token_enabler: { __type: "Boolean" },
    payment_source: { __type: "String" },
    payments_order_id: { __type: "String" },
    paypal_order_id: { __type: "String" },
  },
  HostedProInput: {
    cancel_url: { __type: "String!" },
    return_url: { __type: "String!" },
  },
  HostedProUrl: {
    __typename: { __type: "String!" },
    secure_form_url: { __type: "String" },
  },
  HostedProUrlInput: { cart_id: { __type: "String!" } },
  HttpQueryParameter: {
    __typename: { __type: "String!" },
    name: { __type: "String" },
    value: { __type: "String" },
  },
  ImageSwatchData: {
    __typename: { __type: "String!" },
    thumbnail: { __type: "String" },
    value: { __type: "String" },
  },
  InternalError: {
    __typename: { __type: "String!" },
    message: { __type: "String!" },
  },
  Invoice: {
    __typename: { __type: "String!" },
    comments: { __type: "[SalesCommentItem]" },
    id: { __type: "ID!" },
    items: { __type: "[InvoiceItemInterface]" },
    number: { __type: "String!" },
    total: { __type: "InvoiceTotal" },
  },
  InvoiceItem: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_invoiced: { __type: "Float" },
  },
  InvoiceItemInterface: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_invoiced: { __type: "Float" },
    $on: { __type: "$InvoiceItemInterface!" },
  },
  InvoiceTotal: {
    __typename: { __type: "String!" },
    base_grand_total: { __type: "Money!" },
    discounts: { __type: "[Discount]" },
    grand_total: { __type: "Money!" },
    shipping_handling: { __type: "ShippingHandling" },
    subtotal: { __type: "Money!" },
    taxes: { __type: "[TaxItem]" },
    total_shipping: { __type: "Money!" },
    total_tax: { __type: "Money!" },
  },
  IsEmailAvailableOutput: {
    __typename: { __type: "String!" },
    is_email_available: { __type: "Boolean" },
  },
  ItemSelectedBundleOption: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    label: { __type: "String!" },
    uid: { __type: "ID!" },
    values: { __type: "[ItemSelectedBundleOptionValue]" },
  },
  ItemSelectedBundleOptionValue: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    price: { __type: "Money!" },
    product_name: { __type: "String!" },
    product_sku: { __type: "String!" },
    quantity: { __type: "Float!" },
    uid: { __type: "ID!" },
  },
  KeyValue: {
    __typename: { __type: "String!" },
    name: { __type: "String" },
    value: { __type: "String" },
  },
  LayerFilter: {
    __typename: { __type: "String!" },
    filter_items: { __type: "[LayerFilterItemInterface]" },
    filter_items_count: { __type: "Int" },
    name: { __type: "String" },
    request_var: { __type: "String" },
  },
  LayerFilterItem: {
    __typename: { __type: "String!" },
    items_count: { __type: "Int" },
    label: { __type: "String" },
    value_string: { __type: "String" },
  },
  LayerFilterItemInterface: {
    __typename: { __type: "String!" },
    items_count: { __type: "Int" },
    label: { __type: "String" },
    value_string: { __type: "String" },
    $on: { __type: "$LayerFilterItemInterface!" },
  },
  MediaGalleryEntry: {
    __typename: { __type: "String!" },
    content: { __type: "ProductMediaGalleryEntriesContent" },
    disabled: { __type: "Boolean" },
    file: { __type: "String" },
    id: { __type: "Int" },
    label: { __type: "String" },
    media_type: { __type: "String" },
    position: { __type: "Int" },
    types: { __type: "[String]" },
    uid: { __type: "ID!" },
    video_content: { __type: "ProductMediaGalleryEntriesVideoContent" },
  },
  MediaGalleryInterface: {
    __typename: { __type: "String!" },
    disabled: { __type: "Boolean" },
    label: { __type: "String" },
    position: { __type: "Int" },
    url: { __type: "String" },
    $on: { __type: "$MediaGalleryInterface!" },
  },
  MessageStyleLogo: {
    __typename: { __type: "String!" },
    type: { __type: "String" },
  },
  MessageStyles: {
    __typename: { __type: "String!" },
    layout: { __type: "String" },
    logo: { __type: "MessageStyleLogo" },
  },
  ModuleConfiguration: {
    __typename: { __type: "String!" },
    apiKey: { __type: "String" },
    appInfo: { __type: "[String]" },
    elementsOptions: { __type: "String" },
    locale: { __type: "String" },
    options: { __type: "ModuleOptions" },
  },
  ModuleOptions: {
    __typename: { __type: "String!" },
    apiVersion: { __type: "String" },
    betas: { __type: "[String]" },
  },
  Money: {
    __typename: { __type: "String!" },
    currency: { __type: "CurrencyEnum" },
    value: { __type: "Float" },
  },
  NoSuchEntityUidError: {
    __typename: { __type: "String!" },
    message: { __type: "String!" },
    uid: { __type: "ID!" },
  },
  Order: {
    __typename: { __type: "String!" },
    client_secret: { __type: "String" },
    order_id: { __type: "String" },
    order_number: { __type: "String!" },
  },
  OrderAddress: {
    __typename: { __type: "String!" },
    city: { __type: "String!" },
    company: { __type: "String" },
    country_code: { __type: "CountryCodeEnum" },
    fax: { __type: "String" },
    firstname: { __type: "String!" },
    lastname: { __type: "String!" },
    middlename: { __type: "String" },
    postcode: { __type: "String" },
    prefix: { __type: "String" },
    region: { __type: "String" },
    region_id: { __type: "ID" },
    street: { __type: "[String]!" },
    suffix: { __type: "String" },
    telephone: { __type: "String" },
    vat_id: { __type: "String" },
  },
  OrderInformationInput: {
    email: { __type: "String!" },
    number: { __type: "String!" },
    postcode: { __type: "String!" },
  },
  OrderItem: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    entered_options: { __type: "[OrderItemOption]" },
    gift_message: { __type: "GiftMessage" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    product_type: { __type: "String" },
    product_url_key: { __type: "String" },
    quantity_canceled: { __type: "Float" },
    quantity_invoiced: { __type: "Float" },
    quantity_ordered: { __type: "Float" },
    quantity_refunded: { __type: "Float" },
    quantity_returned: { __type: "Float" },
    quantity_shipped: { __type: "Float" },
    selected_options: { __type: "[OrderItemOption]" },
    status: { __type: "String" },
  },
  OrderItemInterface: {
    __typename: { __type: "String!" },
    discounts: { __type: "[Discount]" },
    entered_options: { __type: "[OrderItemOption]" },
    gift_message: { __type: "GiftMessage" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    product_type: { __type: "String" },
    product_url_key: { __type: "String" },
    quantity_canceled: { __type: "Float" },
    quantity_invoiced: { __type: "Float" },
    quantity_ordered: { __type: "Float" },
    quantity_refunded: { __type: "Float" },
    quantity_returned: { __type: "Float" },
    quantity_shipped: { __type: "Float" },
    selected_options: { __type: "[OrderItemOption]" },
    status: { __type: "String" },
    $on: { __type: "$OrderItemInterface!" },
  },
  OrderItemOption: {
    __typename: { __type: "String!" },
    label: { __type: "String!" },
    value: { __type: "String!" },
  },
  OrderPaymentMethod: {
    __typename: { __type: "String!" },
    additional_data: { __type: "[KeyValue]" },
    name: { __type: "String!" },
    type: { __type: "String!" },
  },
  OrderShipment: {
    __typename: { __type: "String!" },
    comments: { __type: "[SalesCommentItem]" },
    id: { __type: "ID!" },
    items: { __type: "[ShipmentItemInterface]" },
    number: { __type: "String!" },
    tracking: { __type: "[ShipmentTracking]" },
  },
  OrderTokenInput: { token: { __type: "String!" } },
  OrderTotal: {
    __typename: { __type: "String!" },
    base_grand_total: { __type: "Money!" },
    discounts: { __type: "[Discount]" },
    grand_total: { __type: "Money!" },
    shipping_handling: { __type: "ShippingHandling" },
    subtotal: { __type: "Money!" },
    taxes: { __type: "[TaxItem]" },
    total_shipping: { __type: "Money!" },
    total_tax: { __type: "Money!" },
  },
  PayflowExpressInput: {
    payer_id: { __type: "String!" },
    token: { __type: "String!" },
  },
  PayflowLinkInput: {
    cancel_url: { __type: "String!" },
    error_url: { __type: "String!" },
    return_url: { __type: "String!" },
  },
  PayflowLinkToken: {
    __typename: { __type: "String!" },
    mode: { __type: "PayflowLinkMode" },
    paypal_url: { __type: "String" },
    secure_token: { __type: "String" },
    secure_token_id: { __type: "String" },
  },
  PayflowLinkTokenInput: { cart_id: { __type: "String!" } },
  PayflowProInput: {
    cc_details: { __type: "CreditCardDetailsInput!" },
    is_active_payment_token_enabler: { __type: "Boolean" },
  },
  PayflowProResponseInput: {
    cart_id: { __type: "String!" },
    paypal_payload: { __type: "String!" },
  },
  PayflowProResponseOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  PayflowProToken: {
    __typename: { __type: "String!" },
    response_message: { __type: "String!" },
    result: { __type: "Int!" },
    result_code: { __type: "Int!" },
    secure_token: { __type: "String!" },
    secure_token_id: { __type: "String!" },
  },
  PayflowProTokenInput: {
    cart_id: { __type: "String!" },
    urls: { __type: "PayflowProUrlInput!" },
  },
  PayflowProUrlInput: {
    cancel_url: { __type: "String!" },
    error_url: { __type: "String!" },
    return_url: { __type: "String!" },
  },
  PaymentCommonConfig: {
    __typename: { __type: "String!" },
    code: { __type: "String" },
    is_visible: { __type: "Boolean" },
    payment_intent: { __type: "String" },
    sdk_params: { __type: "[SDKParams]" },
    sort_order: { __type: "String" },
    title: { __type: "String" },
  },
  PaymentConfigItem: {
    __typename: { __type: "String!" },
    code: { __type: "String" },
    is_visible: { __type: "Boolean" },
    payment_intent: { __type: "String" },
    sdk_params: { __type: "[SDKParams]" },
    sort_order: { __type: "String" },
    title: { __type: "String" },
    $on: { __type: "$PaymentConfigItem!" },
  },
  PaymentConfigOutput: {
    __typename: { __type: "String!" },
    apple_pay: { __type: "ApplePayConfig" },
    fastlane: { __type: "FastlaneConfig" },
    google_pay: { __type: "GooglePayConfig" },
    hosted_fields: { __type: "HostedFieldsConfig" },
    smart_buttons: { __type: "SmartButtonsConfig" },
  },
  PaymentMethodInput: {
    code: { __type: "String!" },
    hosted_pro: { __type: "HostedProInput" },
    payflow_express: { __type: "PayflowExpressInput" },
    payflow_link: { __type: "PayflowLinkInput" },
    payflowpro: { __type: "PayflowProInput" },
    payflowpro_cc_vault: { __type: "VaultTokenInput" },
    payment_services_paypal_apple_pay: { __type: "ApplePayMethodInput" },
    payment_services_paypal_fastlane: { __type: "FastlaneMethodInput" },
    payment_services_paypal_google_pay: { __type: "GooglePayMethodInput" },
    payment_services_paypal_hosted_fields: { __type: "HostedFieldsInput" },
    payment_services_paypal_smart_buttons: { __type: "SmartButtonMethodInput" },
    payment_services_paypal_vault: { __type: "VaultMethodInput" },
    paypal_express: { __type: "PaypalExpressInput" },
    purchase_order_number: { __type: "String" },
    stripe_payments: { __type: "StripePaymentsInput" },
  },
  PaymentOrderOutput: {
    __typename: { __type: "String!" },
    id: { __type: "String" },
    mp_order_id: { __type: "String" },
    payment_source_details: { __type: "PaymentSourceDetails" },
    status: { __type: "String" },
  },
  PaymentSDKParamsItem: {
    __typename: { __type: "String!" },
    code: { __type: "String" },
    params: { __type: "[SDKParams]" },
  },
  PaymentSourceDetails: {
    __typename: { __type: "String!" },
    card: { __type: "Card" },
  },
  PaymentSourceInput: { card: { __type: "CardPaymentSourceInput!" } },
  PaymentSourceOutput: {
    __typename: { __type: "String!" },
    card: { __type: "CardPaymentSourceOutput!" },
  },
  PaymentToken: {
    __typename: { __type: "String!" },
    details: { __type: "String" },
    payment_method_code: { __type: "String!" },
    public_hash: { __type: "String!" },
    type: { __type: "PaymentTokenTypeEnum!" },
  },
  PaypalExpressInput: {
    payer_id: { __type: "String!" },
    token: { __type: "String!" },
  },
  PaypalExpressToken: {
    __typename: { __type: "String!" },
    paypal_urls: { __type: "PaypalExpressUrlList" },
    token: { __type: "String" },
  },
  PaypalExpressTokenInput: {
    cart_id: { __type: "String!" },
    code: { __type: "String!" },
    express_button: { __type: "Boolean" },
    urls: { __type: "PaypalExpressUrlsInput!" },
    use_paypal_credit: { __type: "Boolean" },
  },
  PaypalExpressTokenOutput: {
    __typename: { __type: "String!" },
    paypal_urls: { __type: "PaypalExpressUrlList" },
    token: { __type: "String" },
  },
  PaypalExpressUrlList: {
    __typename: { __type: "String!" },
    edit: { __type: "String" },
    start: { __type: "String" },
  },
  PaypalExpressUrlsInput: {
    cancel_url: { __type: "String!" },
    pending_url: { __type: "String" },
    return_url: { __type: "String!" },
    success_url: { __type: "String" },
  },
  PhysicalProductInterface: {
    __typename: { __type: "String!" },
    weight: { __type: "Float" },
    $on: { __type: "$PhysicalProductInterface!" },
  },
  PickupLocation: {
    __typename: { __type: "String!" },
    city: { __type: "String" },
    contact_name: { __type: "String" },
    country_id: { __type: "String" },
    description: { __type: "String" },
    email: { __type: "String" },
    fax: { __type: "String" },
    latitude: { __type: "Float" },
    longitude: { __type: "Float" },
    name: { __type: "String" },
    phone: { __type: "String" },
    pickup_location_code: { __type: "String" },
    postcode: { __type: "String" },
    region: { __type: "String" },
    region_id: { __type: "Int" },
    street: { __type: "String" },
  },
  PickupLocationFilterInput: {
    city: { __type: "FilterTypeInput" },
    country_id: { __type: "FilterTypeInput" },
    name: { __type: "FilterTypeInput" },
    pickup_location_code: { __type: "FilterTypeInput" },
    postcode: { __type: "FilterTypeInput" },
    region: { __type: "FilterTypeInput" },
    region_id: { __type: "FilterTypeInput" },
    street: { __type: "FilterTypeInput" },
  },
  PickupLocationSortInput: {
    city: { __type: "SortEnum" },
    contact_name: { __type: "SortEnum" },
    country_id: { __type: "SortEnum" },
    description: { __type: "SortEnum" },
    distance: { __type: "SortEnum" },
    email: { __type: "SortEnum" },
    fax: { __type: "SortEnum" },
    latitude: { __type: "SortEnum" },
    longitude: { __type: "SortEnum" },
    name: { __type: "SortEnum" },
    phone: { __type: "SortEnum" },
    pickup_location_code: { __type: "SortEnum" },
    postcode: { __type: "SortEnum" },
    region: { __type: "SortEnum" },
    region_id: { __type: "SortEnum" },
    street: { __type: "SortEnum" },
  },
  PickupLocations: {
    __typename: { __type: "String!" },
    items: { __type: "[PickupLocation]" },
    page_info: { __type: "SearchResultPageInfo" },
    total_count: { __type: "Int" },
  },
  PlaceOrderError: {
    __typename: { __type: "String!" },
    code: { __type: "PlaceOrderErrorCodes!" },
    message: { __type: "String!" },
  },
  PlaceOrderInput: { cart_id: { __type: "String!" } },
  PlaceOrderOutput: {
    __typename: { __type: "String!" },
    errors: { __type: "[PlaceOrderError]!" },
    order: { __type: "Order" },
    orderV2: { __type: "CustomerOrder" },
  },
  Price: {
    __typename: { __type: "String!" },
    adjustments: { __type: "[PriceAdjustment]" },
    amount: { __type: "Money" },
  },
  PriceAdjustment: {
    __typename: { __type: "String!" },
    amount: { __type: "Money" },
    code: { __type: "PriceAdjustmentCodesEnum" },
    description: { __type: "PriceAdjustmentDescriptionEnum" },
  },
  PriceDetails: {
    __typename: { __type: "String!" },
    discount_percentage: { __type: "Float" },
    main_final_price: { __type: "Float" },
    main_price: { __type: "Float" },
  },
  PriceRange: {
    __typename: { __type: "String!" },
    maximum_price: { __type: "ProductPrice" },
    minimum_price: { __type: "ProductPrice!" },
  },
  ProductAttribute: {
    __typename: { __type: "String!" },
    code: { __type: "String!" },
    value: { __type: "String!" },
  },
  ProductAttributeFilterInput: {
    category_id: { __type: "FilterEqualTypeInput" },
    category_uid: { __type: "FilterEqualTypeInput" },
    category_url_path: { __type: "FilterEqualTypeInput" },
    color: { __type: "FilterEqualTypeInput" },
    description: { __type: "FilterMatchTypeInput" },
    match_collezione2: { __type: "FilterEqualTypeInput" },
    name: { __type: "FilterMatchTypeInput" },
    short_description: { __type: "FilterMatchTypeInput" },
    size: { __type: "FilterEqualTypeInput" },
    sku: { __type: "FilterEqualTypeInput" },
    tema: { __type: "FilterEqualTypeInput" },
    tipologia: { __type: "FilterEqualTypeInput" },
    url_key: { __type: "FilterEqualTypeInput" },
  },
  ProductAttributeSortInput: {
    name: { __type: "SortEnum" },
    position: { __type: "SortEnum" },
    relevance: { __type: "SortEnum" },
    size: { __type: "SortEnum" },
  },
  ProductCustomAttributes: {
    __typename: { __type: "String!" },
    errors: { __type: "[AttributeMetadataError]!" },
    items: { __type: "[AttributeValueInterface]!" },
  },
  ProductDiscount: {
    __typename: { __type: "String!" },
    amount_off: { __type: "Float" },
    percent_off: { __type: "Float" },
  },
  ProductFilterInput: {
    category_id: { __type: "FilterTypeInput" },
    country_of_manufacture: { __type: "FilterTypeInput" },
    created_at: { __type: "FilterTypeInput" },
    custom_layout: { __type: "FilterTypeInput" },
    custom_layout_update: { __type: "FilterTypeInput" },
    description: { __type: "FilterTypeInput" },
    gift_message_available: { __type: "FilterTypeInput" },
    has_options: { __type: "FilterTypeInput" },
    image: { __type: "FilterTypeInput" },
    image_label: { __type: "FilterTypeInput" },
    manufacturer: { __type: "FilterTypeInput" },
    max_price: { __type: "FilterTypeInput" },
    meta_description: { __type: "FilterTypeInput" },
    meta_keyword: { __type: "FilterTypeInput" },
    meta_title: { __type: "FilterTypeInput" },
    min_price: { __type: "FilterTypeInput" },
    name: { __type: "FilterTypeInput" },
    news_from_date: { __type: "FilterTypeInput" },
    news_to_date: { __type: "FilterTypeInput" },
    options_container: { __type: "FilterTypeInput" },
    or: { __type: "ProductFilterInput" },
    price: { __type: "FilterTypeInput" },
    required_options: { __type: "FilterTypeInput" },
    short_description: { __type: "FilterTypeInput" },
    sku: { __type: "FilterTypeInput" },
    small_image: { __type: "FilterTypeInput" },
    small_image_label: { __type: "FilterTypeInput" },
    special_from_date: { __type: "FilterTypeInput" },
    special_price: { __type: "FilterTypeInput" },
    special_to_date: { __type: "FilterTypeInput" },
    swatch_image: { __type: "FilterTypeInput" },
    thumbnail: { __type: "FilterTypeInput" },
    thumbnail_label: { __type: "FilterTypeInput" },
    tier_price: { __type: "FilterTypeInput" },
    updated_at: { __type: "FilterTypeInput" },
    url_key: { __type: "FilterTypeInput" },
    url_path: { __type: "FilterTypeInput" },
    weight: { __type: "FilterTypeInput" },
  },
  ProductImage: {
    __typename: { __type: "String!" },
    disabled: { __type: "Boolean" },
    label: { __type: "String" },
    position: { __type: "Int" },
    url: { __type: "String" },
  },
  ProductInfoInput: { sku: { __type: "String!" } },
  ProductInterface: {
    __typename: { __type: "String!" },
    attribute_set_id: { __type: "Int" },
    canonical_url: { __type: "String" },
    categories: { __type: "[CategoryInterface]" },
    color: { __type: "Int" },
    country_of_manufacture: { __type: "String" },
    created_at: { __type: "String" },
    crosssell_products: { __type: "[ProductInterface]" },
    custom_attributesV2: {
      __type: "ProductCustomAttributes",
      __args: { filters: "AttributeFilterInput" },
    },
    description: { __type: "ComplexTextValue" },
    figure_size: { __type: "String" },
    gift_message_available: { __type: "String" },
    id: { __type: "Int" },
    image: { __type: "ProductImage" },
    is_suggested: { __type: "Int" },
    manufacturer: { __type: "Int" },
    match_collezione2: { __type: "Int" },
    media_gallery: { __type: "[MediaGalleryInterface]" },
    media_gallery_entries: { __type: "[MediaGalleryEntry]" },
    meta_description: { __type: "String" },
    meta_keyword: { __type: "String" },
    meta_title: { __type: "String" },
    name: { __type: "String" },
    new_from_date: { __type: "String" },
    new_to_date: { __type: "String" },
    only_x_left_in_stock: { __type: "Float" },
    options_container: { __type: "String" },
    price: { __type: "ProductPrices" },
    price_range: { __type: "PriceRange!" },
    price_tiers: { __type: "[TierPrice]" },
    product_links: { __type: "[ProductLinksInterface]" },
    rating_summary: { __type: "Float!" },
    related_products: { __type: "[ProductInterface]" },
    review_count: { __type: "Int!" },
    reviews: {
      __type: "ProductReviews!",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
    short_description: { __type: "ComplexTextValue" },
    size: { __type: "Int" },
    sku: { __type: "String" },
    small_image: { __type: "ProductImage" },
    special_from_date: { __type: "String" },
    special_price: { __type: "Float" },
    special_to_date: { __type: "String" },
    stock_status: { __type: "ProductStockStatus" },
    swatch_image: { __type: "String" },
    tema: { __type: "Int" },
    thumbnail: { __type: "ProductImage" },
    tier_price: { __type: "Float" },
    tier_prices: { __type: "[ProductTierPrices]" },
    tipologia: { __type: "Int" },
    type_id: { __type: "String" },
    uid: { __type: "ID!" },
    updated_at: { __type: "String" },
    upsell_products: { __type: "[ProductInterface]" },
    url_key: { __type: "String" },
    url_path: { __type: "String" },
    url_rewrites: { __type: "[UrlRewrite]" },
    url_suffix: { __type: "String" },
    websites: { __type: "[Website]" },
    $on: { __type: "$ProductInterface!" },
  },
  ProductLinks: {
    __typename: { __type: "String!" },
    link_type: { __type: "String" },
    linked_product_sku: { __type: "String" },
    linked_product_type: { __type: "String" },
    position: { __type: "Int" },
    sku: { __type: "String" },
  },
  ProductLinksInterface: {
    __typename: { __type: "String!" },
    link_type: { __type: "String" },
    linked_product_sku: { __type: "String" },
    linked_product_type: { __type: "String" },
    position: { __type: "Int" },
    sku: { __type: "String" },
    $on: { __type: "$ProductLinksInterface!" },
  },
  ProductMediaGalleryEntriesContent: {
    __typename: { __type: "String!" },
    base64_encoded_data: { __type: "String" },
    name: { __type: "String" },
    type: { __type: "String" },
  },
  ProductMediaGalleryEntriesVideoContent: {
    __typename: { __type: "String!" },
    media_type: { __type: "String" },
    video_description: { __type: "String" },
    video_metadata: { __type: "String" },
    video_provider: { __type: "String" },
    video_title: { __type: "String" },
    video_url: { __type: "String" },
  },
  ProductPrice: {
    __typename: { __type: "String!" },
    discount: { __type: "ProductDiscount" },
    final_price: { __type: "Money!" },
    regular_price: { __type: "Money!" },
  },
  ProductPrices: {
    __typename: { __type: "String!" },
    maximalPrice: { __type: "Price" },
    minimalPrice: { __type: "Price" },
    regularPrice: { __type: "Price" },
  },
  ProductReview: {
    __typename: { __type: "String!" },
    average_rating: { __type: "Float!" },
    created_at: { __type: "String!" },
    nickname: { __type: "String!" },
    product: { __type: "ProductInterface!" },
    ratings_breakdown: { __type: "[ProductReviewRating]!" },
    summary: { __type: "String!" },
    text: { __type: "String!" },
  },
  ProductReviewRating: {
    __typename: { __type: "String!" },
    name: { __type: "String!" },
    value: { __type: "String!" },
  },
  ProductReviewRatingInput: {
    id: { __type: "String!" },
    value_id: { __type: "String!" },
  },
  ProductReviewRatingMetadata: {
    __typename: { __type: "String!" },
    id: { __type: "String!" },
    name: { __type: "String!" },
    values: { __type: "[ProductReviewRatingValueMetadata]!" },
  },
  ProductReviewRatingValueMetadata: {
    __typename: { __type: "String!" },
    value: { __type: "String!" },
    value_id: { __type: "String!" },
  },
  ProductReviewRatingsMetadata: {
    __typename: { __type: "String!" },
    items: { __type: "[ProductReviewRatingMetadata]!" },
  },
  ProductReviews: {
    __typename: { __type: "String!" },
    items: { __type: "[ProductReview]!" },
    page_info: { __type: "SearchResultPageInfo!" },
  },
  ProductSortInput: {
    country_of_manufacture: { __type: "SortEnum" },
    created_at: { __type: "SortEnum" },
    custom_layout: { __type: "SortEnum" },
    custom_layout_update: { __type: "SortEnum" },
    description: { __type: "SortEnum" },
    gift_message_available: { __type: "SortEnum" },
    has_options: { __type: "SortEnum" },
    image: { __type: "SortEnum" },
    image_label: { __type: "SortEnum" },
    manufacturer: { __type: "SortEnum" },
    meta_description: { __type: "SortEnum" },
    meta_keyword: { __type: "SortEnum" },
    meta_title: { __type: "SortEnum" },
    name: { __type: "SortEnum" },
    news_from_date: { __type: "SortEnum" },
    news_to_date: { __type: "SortEnum" },
    options_container: { __type: "SortEnum" },
    price: { __type: "SortEnum" },
    required_options: { __type: "SortEnum" },
    short_description: { __type: "SortEnum" },
    sku: { __type: "SortEnum" },
    small_image: { __type: "SortEnum" },
    small_image_label: { __type: "SortEnum" },
    special_from_date: { __type: "SortEnum" },
    special_price: { __type: "SortEnum" },
    special_to_date: { __type: "SortEnum" },
    swatch_image: { __type: "SortEnum" },
    thumbnail: { __type: "SortEnum" },
    thumbnail_label: { __type: "SortEnum" },
    tier_price: { __type: "SortEnum" },
    updated_at: { __type: "SortEnum" },
    url_key: { __type: "SortEnum" },
    url_path: { __type: "SortEnum" },
    weight: { __type: "SortEnum" },
  },
  ProductTierPrices: {
    __typename: { __type: "String!" },
    customer_group_id: { __type: "String" },
    percentage_value: { __type: "Float" },
    qty: { __type: "Float" },
    value: { __type: "Float" },
    website_id: { __type: "Float" },
  },
  ProductVideo: {
    __typename: { __type: "String!" },
    disabled: { __type: "Boolean" },
    label: { __type: "String" },
    position: { __type: "Int" },
    url: { __type: "String" },
    video_content: { __type: "ProductMediaGalleryEntriesVideoContent" },
  },
  Products: {
    __typename: { __type: "String!" },
    aggregations: {
      __type: "[Aggregation]",
      __args: { filter: "AggregationsFilterInput" },
    },
    filters: { __type: "[LayerFilter]" },
    items: { __type: "[ProductInterface]" },
    page_info: { __type: "SearchResultPageInfo" },
    sort_fields: { __type: "SortFields" },
    suggestions: { __type: "[SearchSuggestion]" },
    total_count: { __type: "Int" },
  },
  QuoteItemsSortInput: {
    field: { __type: "SortQuoteItemsEnum!" },
    order: { __type: "SortEnum!" },
  },
  ReCaptchaConfigurationV3: {
    __typename: { __type: "String!" },
    badge_position: { __type: "String!" },
    failure_message: { __type: "String!" },
    forms: { __type: "[ReCaptchaFormEnum]!" },
    is_enabled: { __type: "Boolean!" },
    language_code: { __type: "String" },
    minimum_score: { __type: "Float!" },
    website_key: { __type: "String!" },
  },
  Region: {
    __typename: { __type: "String!" },
    code: { __type: "String" },
    id: { __type: "Int" },
    name: { __type: "String" },
  },
  RemoveCouponFromCartInput: { cart_id: { __type: "String!" } },
  RemoveCouponFromCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart" },
  },
  RemoveItemFromCartInput: {
    cart_id: { __type: "String!" },
    cart_item_id: { __type: "Int" },
    cart_item_uid: { __type: "ID" },
  },
  RemoveItemFromCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  RemoveProductsFromCompareListInput: {
    products: { __type: "[ID]!" },
    uid: { __type: "ID!" },
  },
  RemoveProductsFromWishlistOutput: {
    __typename: { __type: "String!" },
    user_errors: { __type: "[WishListUserInputError]!" },
    wishlist: { __type: "Wishlist!" },
  },
  ReorderItemsOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
    userInputErrors: { __type: "[CheckoutUserInputError]!" },
  },
  RevokeCustomerTokenOutput: {
    __typename: { __type: "String!" },
    result: { __type: "Boolean!" },
  },
  RoutableInterface: {
    __typename: { __type: "String!" },
    redirect_code: { __type: "Int!" },
    relative_url: { __type: "String" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
    $on: { __type: "$RoutableInterface!" },
  },
  RoutableUrl: {
    __typename: { __type: "String!" },
    redirect_code: { __type: "Int!" },
    relative_url: { __type: "String" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
  },
  SDKParams: {
    __typename: { __type: "String!" },
    name: { __type: "String" },
    value: { __type: "String" },
  },
  SalesCommentItem: {
    __typename: { __type: "String!" },
    message: { __type: "String!" },
    timestamp: { __type: "String!" },
  },
  SalesItemInterface: {
    __typename: { __type: "String!" },
    gift_message: { __type: "GiftMessage" },
  },
  SearchResultPageInfo: {
    __typename: { __type: "String!" },
    current_page: { __type: "Int" },
    page_size: { __type: "Int" },
    total_pages: { __type: "Int" },
  },
  SearchSuggestion: {
    __typename: { __type: "String!" },
    search: { __type: "String!" },
  },
  SelectedBundleOption: {
    __typename: { __type: "String!" },
    id: { __type: "Int!" },
    label: { __type: "String!" },
    type: { __type: "String!" },
    uid: { __type: "ID!" },
    values: { __type: "[SelectedBundleOptionValue]!" },
  },
  SelectedBundleOptionValue: {
    __typename: { __type: "String!" },
    id: { __type: "Int!" },
    label: { __type: "String!" },
    price: { __type: "Float!" },
    quantity: { __type: "Float!" },
    uid: { __type: "ID!" },
  },
  SelectedConfigurableOption: {
    __typename: { __type: "String!" },
    configurable_product_option_uid: { __type: "ID!" },
    configurable_product_option_value_uid: { __type: "ID!" },
    id: { __type: "Int!" },
    option_label: { __type: "String!" },
    value_id: { __type: "Int!" },
    value_label: { __type: "String!" },
  },
  SelectedCustomizableOption: {
    __typename: { __type: "String!" },
    customizable_option_uid: { __type: "ID!" },
    id: { __type: "Int!" },
    is_required: { __type: "Boolean!" },
    label: { __type: "String!" },
    sort_order: { __type: "Int!" },
    type: { __type: "String!" },
    values: { __type: "[SelectedCustomizableOptionValue]!" },
  },
  SelectedCustomizableOptionValue: {
    __typename: { __type: "String!" },
    customizable_option_value_uid: { __type: "ID!" },
    id: { __type: "Int!" },
    label: { __type: "String!" },
    price: { __type: "CartItemSelectedOptionValuePrice!" },
    value: { __type: "String!" },
  },
  SelectedPaymentMethod: {
    __typename: { __type: "String!" },
    code: { __type: "String!" },
    purchase_order_number: { __type: "String" },
    title: { __type: "String!" },
  },
  SelectedShippingMethod: {
    __typename: { __type: "String!" },
    amount: { __type: "Money!" },
    base_amount: { __type: "Money" },
    carrier_code: { __type: "String!" },
    carrier_title: { __type: "String!" },
    method_code: { __type: "String!" },
    method_title: { __type: "String!" },
    price_excl_tax: { __type: "Money!" },
    price_incl_tax: { __type: "Money!" },
  },
  SendEmailToFriendInput: {
    product_id: { __type: "Int!" },
    recipients: { __type: "[SendEmailToFriendRecipientInput]!" },
    sender: { __type: "SendEmailToFriendSenderInput!" },
  },
  SendEmailToFriendOutput: {
    __typename: { __type: "String!" },
    recipients: { __type: "[SendEmailToFriendRecipient]" },
    sender: { __type: "SendEmailToFriendSender" },
  },
  SendEmailToFriendRecipient: {
    __typename: { __type: "String!" },
    email: { __type: "String!" },
    name: { __type: "String!" },
  },
  SendEmailToFriendRecipientInput: {
    email: { __type: "String!" },
    name: { __type: "String!" },
  },
  SendEmailToFriendSender: {
    __typename: { __type: "String!" },
    email: { __type: "String!" },
    message: { __type: "String!" },
    name: { __type: "String!" },
  },
  SendEmailToFriendSenderInput: {
    email: { __type: "String!" },
    message: { __type: "String!" },
    name: { __type: "String!" },
  },
  SendFriendConfiguration: {
    __typename: { __type: "String!" },
    enabled_for_customers: { __type: "Boolean!" },
    enabled_for_guests: { __type: "Boolean!" },
  },
  SetBillingAddressOnCartInput: {
    billing_address: { __type: "BillingAddressInput!" },
    cart_id: { __type: "String!" },
  },
  SetBillingAddressOnCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  SetCartAsInactiveOutput: {
    __typename: { __type: "String!" },
    error: { __type: "String" },
    success: { __type: "Boolean!" },
  },
  SetGuestEmailOnCartInput: {
    cart_id: { __type: "String!" },
    email: { __type: "String!" },
  },
  SetGuestEmailOnCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  SetPaymentMethodAndPlaceOrderInput: {
    cart_id: { __type: "String!" },
    payment_method: { __type: "PaymentMethodInput!" },
  },
  SetPaymentMethodOnCartInput: {
    cart_id: { __type: "String!" },
    payment_method: { __type: "PaymentMethodInput!" },
  },
  SetPaymentMethodOnCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  SetShippingAddressesOnCartInput: {
    cart_id: { __type: "String!" },
    shipping_addresses: { __type: "[ShippingAddressInput]!" },
  },
  SetShippingAddressesOnCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  SetShippingMethodsOnCartInput: {
    cart_id: { __type: "String!" },
    shipping_methods: { __type: "[ShippingMethodInput]!" },
  },
  SetShippingMethodsOnCartOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  ShipmentItem: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_shipped: { __type: "Float!" },
  },
  ShipmentItemInterface: {
    __typename: { __type: "String!" },
    id: { __type: "ID!" },
    order_item: { __type: "OrderItemInterface" },
    product_name: { __type: "String" },
    product_sale_price: { __type: "Money!" },
    product_sku: { __type: "String!" },
    quantity_shipped: { __type: "Float!" },
    $on: { __type: "$ShipmentItemInterface!" },
  },
  ShipmentTracking: {
    __typename: { __type: "String!" },
    carrier: { __type: "String!" },
    number: { __type: "String" },
    title: { __type: "String!" },
  },
  ShippingAddressInput: {
    address: { __type: "CartAddressInput" },
    customer_address_id: { __type: "Int" },
    customer_notes: { __type: "String" },
    pickup_location_code: { __type: "String" },
  },
  ShippingCartAddress: {
    __typename: { __type: "String!" },
    available_shipping_methods: { __type: "[AvailableShippingMethod]" },
    cart_items: { __type: "[CartItemQuantity]" },
    cart_items_v2: { __type: "[CartItemInterface]" },
    city: { __type: "String!" },
    company: { __type: "String" },
    country: { __type: "CartAddressCountry!" },
    customer_notes: { __type: "String" },
    fax: { __type: "String" },
    firstname: { __type: "String!" },
    items_weight: { __type: "Float" },
    lastname: { __type: "String!" },
    middlename: { __type: "String" },
    pickup_location_code: { __type: "String" },
    postcode: { __type: "String" },
    prefix: { __type: "String" },
    region: { __type: "CartAddressRegion" },
    selected_shipping_method: { __type: "SelectedShippingMethod" },
    street: { __type: "[String]!" },
    suffix: { __type: "String" },
    telephone: { __type: "String" },
    uid: { __type: "String!" },
    vat_id: { __type: "String" },
  },
  ShippingDiscount: {
    __typename: { __type: "String!" },
    amount: { __type: "Money!" },
  },
  ShippingHandling: {
    __typename: { __type: "String!" },
    amount_excluding_tax: { __type: "Money" },
    amount_including_tax: { __type: "Money" },
    discounts: { __type: "[ShippingDiscount]" },
    taxes: { __type: "[TaxItem]" },
    total_amount: { __type: "Money!" },
  },
  ShippingMethodInput: {
    carrier_code: { __type: "String!" },
    method_code: { __type: "String!" },
  },
  SimpleCartItem: {
    __typename: { __type: "String!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    errors: { __type: "[CartItemError]" },
    gift_message: { __type: "GiftMessage" },
    id: { __type: "String!" },
    is_available: { __type: "Boolean!" },
    prices: { __type: "CartItemPrices" },
    product: { __type: "ProductInterface!" },
    quantity: { __type: "Float!" },
    uid: { __type: "ID!" },
  },
  SimpleProduct: {
    __typename: { __type: "String!" },
    attribute_set_id: { __type: "Int" },
    canonical_url: { __type: "String" },
    categories: { __type: "[CategoryInterface]" },
    color: { __type: "Int" },
    country_of_manufacture: { __type: "String" },
    created_at: { __type: "String" },
    crosssell_products: { __type: "[ProductInterface]" },
    custom_attributesV2: {
      __type: "ProductCustomAttributes",
      __args: { filters: "AttributeFilterInput" },
    },
    description: { __type: "ComplexTextValue" },
    figure_size: { __type: "String" },
    gift_message_available: { __type: "String" },
    id: { __type: "Int" },
    image: { __type: "ProductImage" },
    is_suggested: { __type: "Int" },
    manufacturer: { __type: "Int" },
    match_collezione2: { __type: "Int" },
    media_gallery: { __type: "[MediaGalleryInterface]" },
    media_gallery_entries: { __type: "[MediaGalleryEntry]" },
    meta_description: { __type: "String" },
    meta_keyword: { __type: "String" },
    meta_title: { __type: "String" },
    name: { __type: "String" },
    new_from_date: { __type: "String" },
    new_to_date: { __type: "String" },
    only_x_left_in_stock: { __type: "Float" },
    options: { __type: "[CustomizableOptionInterface]" },
    options_container: { __type: "String" },
    price: { __type: "ProductPrices" },
    price_range: { __type: "PriceRange!" },
    price_tiers: { __type: "[TierPrice]" },
    product_links: { __type: "[ProductLinksInterface]" },
    rating_summary: { __type: "Float!" },
    redirect_code: { __type: "Int!" },
    related_products: { __type: "[ProductInterface]" },
    relative_url: { __type: "String" },
    review_count: { __type: "Int!" },
    reviews: {
      __type: "ProductReviews!",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
    short_description: { __type: "ComplexTextValue" },
    size: { __type: "Int" },
    sku: { __type: "String" },
    small_image: { __type: "ProductImage" },
    special_from_date: { __type: "String" },
    special_price: { __type: "Float" },
    special_to_date: { __type: "String" },
    stock_status: { __type: "ProductStockStatus" },
    swatch_image: { __type: "String" },
    tema: { __type: "Int" },
    thumbnail: { __type: "ProductImage" },
    tier_price: { __type: "Float" },
    tier_prices: { __type: "[ProductTierPrices]" },
    tipologia: { __type: "Int" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
    type_id: { __type: "String" },
    uid: { __type: "ID!" },
    updated_at: { __type: "String" },
    upsell_products: { __type: "[ProductInterface]" },
    url_key: { __type: "String" },
    url_path: { __type: "String" },
    url_rewrites: { __type: "[UrlRewrite]" },
    url_suffix: { __type: "String" },
    websites: { __type: "[Website]" },
    weight: { __type: "Float" },
  },
  SimpleProductCartItemInput: {
    customizable_options: { __type: "[CustomizableOptionInput]" },
    data: { __type: "CartItemInput!" },
  },
  SimpleWishlistItem: {
    __typename: { __type: "String!" },
    added_at: { __type: "String!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    quantity: { __type: "Float!" },
  },
  SmartButtonMethodInput: {
    payment_source: { __type: "String" },
    payments_order_id: { __type: "String" },
    paypal_order_id: { __type: "String" },
  },
  SmartButtonsConfig: {
    __typename: { __type: "String!" },
    app_switch_when_available: { __type: "Boolean" },
    button_styles: { __type: "ButtonStyles" },
    code: { __type: "String" },
    display_message: { __type: "Boolean" },
    display_venmo: { __type: "Boolean" },
    is_visible: { __type: "Boolean" },
    message_styles: { __type: "MessageStyles" },
    payment_intent: { __type: "String" },
    sdk_params: { __type: "[SDKParams]" },
    sort_order: { __type: "String" },
    title: { __type: "String" },
  },
  SnowdogMenu: {
    __typename: { __type: "String!" },
    creation_time: { __type: "String!" },
    css_class: { __type: "String" },
    identifier: { __type: "String!" },
    menu_id: { __type: "Int!" },
    nodes: { __type: "SnowdogMenuNodes" },
    title: { __type: "String!" },
    update_time: { __type: "String!" },
  },
  SnowdogMenuCmsPageNode: {
    __typename: { __type: "String!" },
    additional_data: { __type: "[String]" },
    classes: { __type: "String" },
    content: { __type: "String" },
    creation_time: { __type: "String!" },
    level: { __type: "Int!" },
    menu_id: { __type: "Int!" },
    node_id: { __type: "Int!" },
    node_template: { __type: "String" },
    parent_id: { __type: "Int" },
    position: { __type: "Int!" },
    submenu_template: { __type: "String" },
    title: { __type: "String" },
    type: { __type: "String!" },
    update_time: { __type: "String!" },
    url_key: { __type: "String" },
  },
  SnowdogMenuCustomUrlNode: {
    __typename: { __type: "String!" },
    additional_data: { __type: "[String]" },
    classes: { __type: "String" },
    content: { __type: "String" },
    creation_time: { __type: "String!" },
    image: { __type: "String" },
    image_alt_text: { __type: "String" },
    level: { __type: "Int!" },
    menu_id: { __type: "Int!" },
    node_id: { __type: "Int!" },
    node_template: { __type: "String" },
    parent_id: { __type: "Int" },
    position: { __type: "Int!" },
    submenu_template: { __type: "String" },
    target: { __type: "Boolean!" },
    title: { __type: "String" },
    type: { __type: "String!" },
    update_time: { __type: "String!" },
    url_key: { __type: "String" },
  },
  SnowdogMenuCustomUrlNodeInterface: {
    __typename: { __type: "String!" },
    target: { __type: "Boolean!" },
    $on: { __type: "$SnowdogMenuCustomUrlNodeInterface!" },
  },
  SnowdogMenuNode: {
    __typename: { __type: "String!" },
    additional_data: { __type: "[String]" },
    classes: { __type: "String" },
    content: { __type: "String" },
    creation_time: { __type: "String!" },
    image: { __type: "String" },
    image_alt_text: { __type: "String" },
    level: { __type: "Int!" },
    menu_id: { __type: "Int!" },
    node_id: { __type: "Int!" },
    node_template: { __type: "String" },
    parent_id: { __type: "Int" },
    position: { __type: "Int!" },
    submenu_template: { __type: "String" },
    title: { __type: "String" },
    type: { __type: "String!" },
    update_time: { __type: "String!" },
    url_key: { __type: "String" },
  },
  SnowdogMenuNodeContentFieldInterface: {
    __typename: { __type: "String!" },
    content: { __type: "String" },
    $on: { __type: "$SnowdogMenuNodeContentFieldInterface!" },
  },
  SnowdogMenuNodeImageFieldInterface: {
    __typename: { __type: "String!" },
    image: { __type: "String" },
    image_alt_text: { __type: "String" },
    $on: { __type: "$SnowdogMenuNodeImageFieldInterface!" },
  },
  SnowdogMenuNodeInterface: {
    __typename: { __type: "String!" },
    additional_data: { __type: "[String]" },
    classes: { __type: "String" },
    creation_time: { __type: "String!" },
    level: { __type: "Int!" },
    menu_id: { __type: "Int!" },
    node_id: { __type: "Int!" },
    node_template: { __type: "String" },
    parent_id: { __type: "Int" },
    position: { __type: "Int!" },
    submenu_template: { __type: "String" },
    title: { __type: "String" },
    type: { __type: "String!" },
    update_time: { __type: "String!" },
    url_key: { __type: "String" },
    $on: { __type: "$SnowdogMenuNodeInterface!" },
  },
  SnowdogMenuNodes: {
    __typename: { __type: "String!" },
    items: { __type: "[SnowdogMenuNodeInterface]" },
  },
  SnowdogMenuWrapperNode: {
    __typename: { __type: "String!" },
    additional_data: { __type: "[String]" },
    classes: { __type: "String" },
    creation_time: { __type: "String!" },
    level: { __type: "Int!" },
    menu_id: { __type: "Int!" },
    node_id: { __type: "Int!" },
    node_template: { __type: "String" },
    parent_id: { __type: "Int" },
    position: { __type: "Int!" },
    submenu_template: { __type: "String" },
    title: { __type: "String" },
    type: { __type: "String!" },
    update_time: { __type: "String!" },
    url_key: { __type: "String" },
  },
  SnowdogMenus: {
    __typename: { __type: "String!" },
    items: { __type: "[SnowdogMenu]!" },
  },
  SortField: {
    __typename: { __type: "String!" },
    label: { __type: "String" },
    value: { __type: "String" },
  },
  SortFields: {
    __typename: { __type: "String!" },
    default: { __type: "String" },
    options: { __type: "[SortField]" },
  },
  StoreConfig: {
    __typename: { __type: "String!" },
    absolute_footer: { __type: "String" },
    allow_guests_to_write_product_reviews: { __type: "String" },
    allow_items: { __type: "String" },
    allow_order: { __type: "String" },
    autocomplete_on_storefront: { __type: "Boolean" },
    base_currency_code: { __type: "String" },
    base_link_url: { __type: "String" },
    base_media_url: { __type: "String" },
    base_static_url: { __type: "String" },
    base_url: { __type: "String" },
    cart_expires_in_days: { __type: "Int" },
    cart_summary_display_quantity: { __type: "Int" },
    catalog_default_sort_by: { __type: "String" },
    category_url_suffix: { __type: "String" },
    check_money_order_enable_for_specific_countries: { __type: "Boolean" },
    check_money_order_enabled: { __type: "Boolean" },
    check_money_order_make_check_payable_to: { __type: "String" },
    check_money_order_max_order_total: { __type: "String" },
    check_money_order_min_order_total: { __type: "String" },
    check_money_order_new_order_status: { __type: "String" },
    check_money_order_payment_from_specific_countries: { __type: "String" },
    check_money_order_send_check_to: { __type: "String" },
    check_money_order_sort_order: { __type: "Int" },
    check_money_order_title: { __type: "String" },
    cms_home_page: { __type: "String" },
    cms_no_cookies: { __type: "String" },
    cms_no_route: { __type: "String" },
    code: { __type: "String" },
    configurable_thumbnail_source: { __type: "String" },
    contact_enabled: { __type: "Boolean!" },
    copyright: { __type: "String" },
    countries_with_required_region: { __type: "String" },
    create_account_confirmation: { __type: "Boolean" },
    customer_access_token_lifetime: { __type: "Float" },
    default_country: { __type: "String" },
    default_description: { __type: "String" },
    default_display_currency_code: { __type: "String" },
    default_keywords: { __type: "String" },
    default_title: { __type: "String" },
    demonotice: { __type: "Int" },
    display_state_if_optional: { __type: "Boolean" },
    front: { __type: "String" },
    grid_per_page: { __type: "Int" },
    grid_per_page_values: { __type: "String" },
    head_includes: { __type: "String" },
    head_shortcut_icon: { __type: "String" },
    header_logo_src: { __type: "String" },
    id: { __type: "Int" },
    is_default_store: { __type: "Boolean" },
    is_default_store_group: { __type: "Boolean" },
    is_guest_checkout_enabled: { __type: "Boolean" },
    is_one_page_checkout_enabled: { __type: "Boolean" },
    list_mode: { __type: "String" },
    list_per_page: { __type: "Int" },
    list_per_page_values: { __type: "String" },
    locale: { __type: "String" },
    logo_alt: { __type: "String" },
    logo_height: { __type: "Int" },
    logo_width: { __type: "Int" },
    magento_wishlist_general_is_enabled: { __type: "String" },
    max_items_in_order_summary: { __type: "Int" },
    minicart_display: { __type: "Boolean" },
    minicart_max_items: { __type: "Int" },
    minimum_password_length: { __type: "String" },
    newsletter_enabled: { __type: "Boolean!" },
    no_route: { __type: "String" },
    optional_zip_countries: { __type: "String" },
    order_cancellation_enabled: { __type: "Boolean!" },
    order_cancellation_reasons: { __type: "[CancellationReason]!" },
    payment_payflowpro_cc_vault_active: { __type: "String" },
    product_reviews_enabled: { __type: "String" },
    product_url_suffix: { __type: "String" },
    required_character_classes_number: { __type: "String" },
    root_category_id: { __type: "Int" },
    root_category_uid: { __type: "ID" },
    secure_base_link_url: { __type: "String" },
    secure_base_media_url: { __type: "String" },
    secure_base_static_url: { __type: "String" },
    secure_base_url: { __type: "String" },
    send_friend: { __type: "SendFriendConfiguration" },
    shopping_cart_display_full_summary: { __type: "Boolean" },
    shopping_cart_display_grand_total: { __type: "Boolean" },
    shopping_cart_display_price: { __type: "Int" },
    shopping_cart_display_shipping: { __type: "Int" },
    shopping_cart_display_subtotal: { __type: "Int" },
    shopping_cart_display_tax_gift_wrapping: { __type: "TaxWrappingEnum" },
    shopping_cart_display_zero_tax: { __type: "Boolean" },
    show_cms_breadcrumbs: { __type: "Int" },
    store_code: { __type: "ID" },
    store_group_code: { __type: "ID" },
    store_group_name: { __type: "String" },
    store_name: { __type: "String" },
    store_sort_order: { __type: "Int" },
    timezone: { __type: "String" },
    title_prefix: { __type: "String" },
    title_separator: { __type: "String" },
    title_suffix: { __type: "String" },
    use_store_in_url: { __type: "Boolean" },
    website_code: { __type: "ID" },
    website_id: { __type: "Int" },
    website_name: { __type: "String" },
    weight_unit: { __type: "String" },
    welcome: { __type: "String" },
    zero_subtotal_enable_for_specific_countries: { __type: "Boolean" },
    zero_subtotal_enabled: { __type: "Boolean" },
    zero_subtotal_new_order_status: { __type: "String" },
    zero_subtotal_payment_action: { __type: "String" },
    zero_subtotal_payment_from_specific_countries: { __type: "String" },
    zero_subtotal_sort_order: { __type: "Int" },
    zero_subtotal_title: { __type: "String" },
  },
  StorefrontProperties: {
    __typename: { __type: "String!" },
    position: { __type: "Int" },
    use_in_layered_navigation: { __type: "UseInLayeredNavigationOptions" },
    use_in_product_listing: { __type: "Boolean" },
    use_in_search_results_layered_navigation: { __type: "Boolean" },
    visible_on_catalog_pages: { __type: "Boolean" },
  },
  StripePaymentMethod: {
    __typename: { __type: "String!" },
    brand: { __type: "String" },
    created: { __type: "Int" },
    cvc: { __type: "Boolean" },
    exp_month: { __type: "Int" },
    exp_year: { __type: "Int" },
    fingerprint: { __type: "String" },
    icon: { __type: "String" },
    id: { __type: "ID!" },
    label: { __type: "String" },
    type: { __type: "String" },
  },
  StripePaymentMethodId: {
    fingerprint: { __type: "String" },
    payment_method: { __type: "String!" },
  },
  StripePaymentsInput: {
    cvc_token: { __type: "String" },
    payment_method: { __type: "String" },
    save_payment_method: { __type: "Boolean" },
  },
  SubscribeEmailToNewsletterOutput: {
    __typename: { __type: "String!" },
    status: { __type: "SubscriptionStatusesEnum" },
  },
  SwatchData: {
    __typename: { __type: "String!" },
    type: { __type: "String" },
    value: { __type: "String" },
  },
  SwatchDataInterface: {
    __typename: { __type: "String!" },
    value: { __type: "String" },
    $on: { __type: "$SwatchDataInterface!" },
  },
  SwatchLayerFilterItem: {
    __typename: { __type: "String!" },
    items_count: { __type: "Int" },
    label: { __type: "String" },
    swatch_data: { __type: "SwatchData" },
    value_string: { __type: "String" },
  },
  SwatchLayerFilterItemInterface: {
    __typename: { __type: "String!" },
    swatch_data: { __type: "SwatchData" },
    $on: { __type: "$SwatchLayerFilterItemInterface!" },
  },
  SyncPaymentOrderInput: {
    cartId: { __type: "String!" },
    id: { __type: "String!" },
  },
  TaxItem: {
    __typename: { __type: "String!" },
    amount: { __type: "Money!" },
    rate: { __type: "Float!" },
    title: { __type: "String!" },
  },
  TextSwatchData: {
    __typename: { __type: "String!" },
    value: { __type: "String" },
  },
  TierPrice: {
    __typename: { __type: "String!" },
    discount: { __type: "ProductDiscount" },
    final_price: { __type: "Money" },
    quantity: { __type: "Float" },
  },
  UpdateCartItemsInput: {
    cart_id: { __type: "String!" },
    cart_items: { __type: "[CartItemUpdateInput]!" },
  },
  UpdateCartItemsOutput: {
    __typename: { __type: "String!" },
    cart: { __type: "Cart!" },
  },
  UpdateProductsInWishlistOutput: {
    __typename: { __type: "String!" },
    user_errors: { __type: "[WishListUserInputError]!" },
    wishlist: { __type: "Wishlist!" },
  },
  UrlRewrite: {
    __typename: { __type: "String!" },
    parameters: { __type: "[HttpQueryParameter]" },
    url: { __type: "String" },
  },
  ValidationRule: {
    __typename: { __type: "String!" },
    name: { __type: "ValidationRuleEnum" },
    value: { __type: "String" },
  },
  VaultConfigOutput: {
    __typename: { __type: "String!" },
    credit_card: { __type: "VaultCreditCardConfig" },
  },
  VaultCreditCardConfig: {
    __typename: { __type: "String!" },
    is_vault_enabled: { __type: "Boolean" },
    sdk_params: { __type: "[SDKParams]" },
    three_ds_mode: { __type: "ThreeDSMode" },
  },
  VaultMethodInput: {
    payment_source: { __type: "String" },
    payments_order_id: { __type: "String" },
    paypal_order_id: { __type: "String" },
    public_hash: { __type: "String" },
  },
  VaultSetupTokenInput: { payment_source: { __type: "PaymentSourceInput!" } },
  VaultTokenInput: { public_hash: { __type: "String!" } },
  VirtualCartItem: {
    __typename: { __type: "String!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    errors: { __type: "[CartItemError]" },
    id: { __type: "String!" },
    is_available: { __type: "Boolean!" },
    prices: { __type: "CartItemPrices" },
    product: { __type: "ProductInterface!" },
    quantity: { __type: "Float!" },
    uid: { __type: "ID!" },
  },
  VirtualProduct: {
    __typename: { __type: "String!" },
    attribute_set_id: { __type: "Int" },
    canonical_url: { __type: "String" },
    categories: { __type: "[CategoryInterface]" },
    color: { __type: "Int" },
    country_of_manufacture: { __type: "String" },
    created_at: { __type: "String" },
    crosssell_products: { __type: "[ProductInterface]" },
    custom_attributesV2: {
      __type: "ProductCustomAttributes",
      __args: { filters: "AttributeFilterInput" },
    },
    description: { __type: "ComplexTextValue" },
    figure_size: { __type: "String" },
    gift_message_available: { __type: "String" },
    id: { __type: "Int" },
    image: { __type: "ProductImage" },
    is_suggested: { __type: "Int" },
    manufacturer: { __type: "Int" },
    match_collezione2: { __type: "Int" },
    media_gallery: { __type: "[MediaGalleryInterface]" },
    media_gallery_entries: { __type: "[MediaGalleryEntry]" },
    meta_description: { __type: "String" },
    meta_keyword: { __type: "String" },
    meta_title: { __type: "String" },
    name: { __type: "String" },
    new_from_date: { __type: "String" },
    new_to_date: { __type: "String" },
    only_x_left_in_stock: { __type: "Float" },
    options: { __type: "[CustomizableOptionInterface]" },
    options_container: { __type: "String" },
    price: { __type: "ProductPrices" },
    price_range: { __type: "PriceRange!" },
    price_tiers: { __type: "[TierPrice]" },
    product_links: { __type: "[ProductLinksInterface]" },
    rating_summary: { __type: "Float!" },
    redirect_code: { __type: "Int!" },
    related_products: { __type: "[ProductInterface]" },
    relative_url: { __type: "String" },
    review_count: { __type: "Int!" },
    reviews: {
      __type: "ProductReviews!",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
    short_description: { __type: "ComplexTextValue" },
    size: { __type: "Int" },
    sku: { __type: "String" },
    small_image: { __type: "ProductImage" },
    special_from_date: { __type: "String" },
    special_price: { __type: "Float" },
    special_to_date: { __type: "String" },
    stock_status: { __type: "ProductStockStatus" },
    swatch_image: { __type: "String" },
    tema: { __type: "Int" },
    thumbnail: { __type: "ProductImage" },
    tier_price: { __type: "Float" },
    tier_prices: { __type: "[ProductTierPrices]" },
    tipologia: { __type: "Int" },
    type: { __type: "UrlRewriteEntityTypeEnum" },
    type_id: { __type: "String" },
    uid: { __type: "ID!" },
    updated_at: { __type: "String" },
    upsell_products: { __type: "[ProductInterface]" },
    url_key: { __type: "String" },
    url_path: { __type: "String" },
    url_rewrites: { __type: "[UrlRewrite]" },
    url_suffix: { __type: "String" },
    websites: { __type: "[Website]" },
  },
  VirtualProductCartItemInput: {
    customizable_options: { __type: "[CustomizableOptionInput]" },
    data: { __type: "CartItemInput!" },
  },
  VirtualWishlistItem: {
    __typename: { __type: "String!" },
    added_at: { __type: "String!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    quantity: { __type: "Float!" },
  },
  Website: {
    __typename: { __type: "String!" },
    code: { __type: "String" },
    default_group_id: { __type: "String" },
    id: { __type: "Int" },
    is_default: { __type: "Boolean" },
    name: { __type: "String" },
    sort_order: { __type: "Int" },
  },
  WishListUserInputError: {
    __typename: { __type: "String!" },
    code: { __type: "WishListUserInputErrorType!" },
    message: { __type: "String!" },
  },
  Wishlist: {
    __typename: { __type: "String!" },
    id: { __type: "ID" },
    items: { __type: "[WishlistItem]" },
    items_count: { __type: "Int" },
    items_v2: {
      __type: "WishlistItems",
      __args: { currentPage: "Int", pageSize: "Int" },
    },
    sharing_code: { __type: "String" },
    updated_at: { __type: "String" },
  },
  WishlistCartUserInputError: {
    __typename: { __type: "String!" },
    code: { __type: "WishlistCartUserInputErrorType!" },
    message: { __type: "String!" },
    wishlistId: { __type: "ID!" },
    wishlistItemId: { __type: "ID!" },
  },
  WishlistItem: {
    __typename: { __type: "String!" },
    added_at: { __type: "String" },
    description: { __type: "String" },
    id: { __type: "Int" },
    product: { __type: "ProductInterface" },
    qty: { __type: "Float" },
  },
  WishlistItemInput: {
    entered_options: { __type: "[EnteredOptionInput]" },
    parent_sku: { __type: "String" },
    quantity: { __type: "Float!" },
    selected_options: { __type: "[ID]" },
    sku: { __type: "String!" },
  },
  WishlistItemInterface: {
    __typename: { __type: "String!" },
    added_at: { __type: "String!" },
    customizable_options: { __type: "[SelectedCustomizableOption]!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    product: { __type: "ProductInterface" },
    quantity: { __type: "Float!" },
    $on: { __type: "$WishlistItemInterface!" },
  },
  WishlistItemUpdateInput: {
    description: { __type: "String" },
    entered_options: { __type: "[EnteredOptionInput]" },
    quantity: { __type: "Float" },
    selected_options: { __type: "[ID]" },
    wishlist_item_id: { __type: "ID!" },
  },
  WishlistItems: {
    __typename: { __type: "String!" },
    items: { __type: "[WishlistItemInterface]!" },
    page_info: { __type: "SearchResultPageInfo" },
  },
  WishlistOutput: {
    __typename: { __type: "String!" },
    items: { __type: "[WishlistItem]" },
    items_count: { __type: "Int" },
    name: { __type: "String" },
    sharing_code: { __type: "String" },
    updated_at: { __type: "String" },
  },
  createEmptyCartInput: { cart_id: { __type: "String" } },
  mutation: {
    __typename: { __type: "String!" },
    addBundleProductsToCart: {
      __type: "AddBundleProductsToCartOutput",
      __args: { input: "AddBundleProductsToCartInput" },
    },
    addConfigurableProductsToCart: {
      __type: "AddConfigurableProductsToCartOutput",
      __args: { input: "AddConfigurableProductsToCartInput" },
    },
    addDownloadableProductsToCart: {
      __type: "AddDownloadableProductsToCartOutput",
      __args: { input: "AddDownloadableProductsToCartInput" },
    },
    addProductsToCart: {
      __type: "AddProductsToCartOutput",
      __args: { cartId: "String!", cartItems: "[CartItemInput!]!" },
    },
    addProductsToCompareList: {
      __type: "CompareList",
      __args: { input: "AddProductsToCompareListInput" },
    },
    addProductsToNewCart: {
      __type: "AddProductsToNewCartOutput",
      __args: { cartItems: "[CartItemInput!]!" },
    },
    addProductsToWishlist: {
      __type: "AddProductsToWishlistOutput",
      __args: { wishlistId: "ID!", wishlistItems: "[WishlistItemInput!]!" },
    },
    addSimpleProductsToCart: {
      __type: "AddSimpleProductsToCartOutput",
      __args: { input: "AddSimpleProductsToCartInput" },
    },
    addStripePaymentMethod: {
      __type: "StripePaymentMethod",
      __args: { input: "StripePaymentMethodId!" },
    },
    addVirtualProductsToCart: {
      __type: "AddVirtualProductsToCartOutput",
      __args: { input: "AddVirtualProductsToCartInput" },
    },
    addWishlistItemsToCart: {
      __type: "AddWishlistItemsToCartOutput",
      __args: { wishlistId: "ID!", wishlistItemIds: "[ID!]" },
    },
    applyCouponToCart: {
      __type: "ApplyCouponToCartOutput",
      __args: { input: "ApplyCouponToCartInput" },
    },
    assignCompareListToCustomer: {
      __type: "AssignCompareListToCustomerOutput",
      __args: { uid: "ID!" },
    },
    assignCustomerToGuestCart: {
      __type: "Cart!",
      __args: { cart_id: "String!" },
    },
    cancelOrder: {
      __type: "CancelOrderOutput",
      __args: { input: "CancelOrderInput!" },
    },
    changeCustomerPassword: {
      __type: "Customer",
      __args: { currentPassword: "String!", newPassword: "String!" },
    },
    completeOrder: {
      __type: "PlaceOrderOutput",
      __args: { input: "CompleteOrderInput" },
    },
    confirmEmail: {
      __type: "CustomerOutput",
      __args: { input: "ConfirmEmailInput!" },
    },
    contactUs: {
      __type: "ContactUsOutput",
      __args: { input: "ContactUsInput!" },
    },
    createCompareList: {
      __type: "CompareList",
      __args: { input: "CreateCompareListInput" },
    },
    createCustomer: {
      __type: "CustomerOutput",
      __args: { input: "CustomerInput!" },
    },
    createCustomerAddress: {
      __type: "CustomerAddress",
      __args: { input: "CustomerAddressInput!" },
    },
    createCustomerV2: {
      __type: "CustomerOutput",
      __args: { input: "CustomerCreateInput!" },
    },
    createEmptyCart: {
      __type: "String",
      __args: { input: "createEmptyCartInput" },
    },
    createGuestCart: {
      __type: "CreateGuestCartOutput",
      __args: { input: "CreateGuestCartInput" },
    },
    createPayflowProToken: {
      __type: "CreatePayflowProTokenOutput",
      __args: { input: "PayflowProTokenInput!" },
    },
    createPaymentOrder: {
      __type: "CreatePaymentOrderOutput",
      __args: { input: "CreatePaymentOrderInput!" },
    },
    createPaypalExpressToken: {
      __type: "PaypalExpressTokenOutput",
      __args: { input: "PaypalExpressTokenInput!" },
    },
    createProductReview: {
      __type: "CreateProductReviewOutput!",
      __args: { input: "CreateProductReviewInput!" },
    },
    createVaultCardPaymentToken: {
      __type: "CreateVaultCardPaymentTokenOutput",
      __args: { input: "CreateVaultCardPaymentTokenInput!" },
    },
    createVaultCardSetupToken: {
      __type: "CreateVaultCardSetupTokenOutput",
      __args: { input: "CreateVaultCardSetupTokenInput!" },
    },
    deleteCompareList: {
      __type: "DeleteCompareListOutput",
      __args: { uid: "ID!" },
    },
    deleteCustomer: { __type: "Boolean" },
    deleteCustomerAddress: { __type: "Boolean", __args: { id: "Int!" } },
    deletePaymentToken: {
      __type: "DeletePaymentTokenOutput",
      __args: { public_hash: "String!" },
    },
    deleteStripePaymentMethod: {
      __type: "String",
      __args: { input: "StripePaymentMethodId!" },
    },
    estimateShippingMethods: {
      __type: "[AvailableShippingMethod]",
      __args: { input: "EstimateTotalsInput!" },
    },
    estimateTotals: {
      __type: "EstimateTotalsOutput!",
      __args: { input: "EstimateTotalsInput!" },
    },
    generateCustomerToken: {
      __type: "CustomerToken",
      __args: { email: "String!", password: "String!" },
    },
    generateCustomerTokenAsAdmin: {
      __type: "GenerateCustomerTokenAsAdminOutput",
      __args: { input: "GenerateCustomerTokenAsAdminInput!" },
    },
    handlePayflowProResponse: {
      __type: "PayflowProResponseOutput",
      __args: { input: "PayflowProResponseInput!" },
    },
    listStripePaymentMethods: { __type: "[StripePaymentMethod]" },
    mergeCarts: {
      __type: "Cart!",
      __args: { destination_cart_id: "String", source_cart_id: "String!" },
    },
    placeOrder: {
      __type: "PlaceOrderOutput",
      __args: { input: "PlaceOrderInput" },
    },
    removeCouponFromCart: {
      __type: "RemoveCouponFromCartOutput",
      __args: { input: "RemoveCouponFromCartInput" },
    },
    removeItemFromCart: {
      __type: "RemoveItemFromCartOutput",
      __args: { input: "RemoveItemFromCartInput" },
    },
    removeProductsFromCompareList: {
      __type: "CompareList",
      __args: { input: "RemoveProductsFromCompareListInput" },
    },
    removeProductsFromWishlist: {
      __type: "RemoveProductsFromWishlistOutput",
      __args: { wishlistId: "ID!", wishlistItemsIds: "[ID!]!" },
    },
    reorderItems: {
      __type: "ReorderItemsOutput",
      __args: { orderNumber: "String!" },
    },
    requestPasswordResetEmail: {
      __type: "Boolean",
      __args: { email: "String!" },
    },
    resetPassword: {
      __type: "Boolean",
      __args: {
        email: "String!",
        newPassword: "String!",
        resetPasswordToken: "String!",
      },
    },
    revokeCustomerToken: { __type: "RevokeCustomerTokenOutput" },
    sendEmailToFriend: {
      __type: "SendEmailToFriendOutput",
      __args: { input: "SendEmailToFriendInput" },
    },
    setBillingAddressOnCart: {
      __type: "SetBillingAddressOnCartOutput",
      __args: { input: "SetBillingAddressOnCartInput" },
    },
    setCartAsInactive: {
      __type: "SetCartAsInactiveOutput",
      __args: { cartId: "String!" },
    },
    setGuestEmailOnCart: {
      __type: "SetGuestEmailOnCartOutput",
      __args: { input: "SetGuestEmailOnCartInput" },
    },
    setPaymentMethodAndPlaceOrder: {
      __type: "PlaceOrderOutput",
      __args: { input: "SetPaymentMethodAndPlaceOrderInput" },
    },
    setPaymentMethodOnCart: {
      __type: "SetPaymentMethodOnCartOutput",
      __args: { input: "SetPaymentMethodOnCartInput" },
    },
    setShippingAddressesOnCart: {
      __type: "SetShippingAddressesOnCartOutput",
      __args: { input: "SetShippingAddressesOnCartInput" },
    },
    setShippingMethodsOnCart: {
      __type: "SetShippingMethodsOnCartOutput",
      __args: { input: "SetShippingMethodsOnCartInput" },
    },
    subscribeEmailToNewsletter: {
      __type: "SubscribeEmailToNewsletterOutput",
      __args: { email: "String!" },
    },
    syncPaymentOrder: {
      __type: "Boolean",
      __args: { input: "SyncPaymentOrderInput" },
    },
    updateCartItems: {
      __type: "UpdateCartItemsOutput",
      __args: { input: "UpdateCartItemsInput" },
    },
    updateCustomer: {
      __type: "CustomerOutput",
      __args: { input: "CustomerInput!" },
    },
    updateCustomerAddress: {
      __type: "CustomerAddress",
      __args: { id: "Int!", input: "CustomerAddressInput" },
    },
    updateCustomerEmail: {
      __type: "CustomerOutput",
      __args: { email: "String!", password: "String!" },
    },
    updateCustomerV2: {
      __type: "CustomerOutput",
      __args: { input: "CustomerUpdateInput!" },
    },
    updateProductsInWishlist: {
      __type: "UpdateProductsInWishlistOutput",
      __args: {
        wishlistId: "ID!",
        wishlistItems: "[WishlistItemUpdateInput!]!",
      },
    },
  },
  query: {
    __typename: { __type: "String!" },
    attributesForm: {
      __type: "AttributesFormOutput!",
      __args: { formCode: "String!" },
    },
    attributesList: {
      __type: "AttributesMetadataOutput",
      __args: {
        entityType: "AttributeEntityTypeEnum!",
        filters: "AttributeFilterInput",
      },
    },
    availableStores: {
      __type: "[StoreConfig]",
      __args: { useCurrentGroup: "Boolean" },
    },
    cart: { __type: "Cart", __args: { cart_id: "String!" } },
    categories: {
      __type: "CategoryResult",
      __args: {
        currentPage: "Int",
        filters: "CategoryFilterInput",
        pageSize: "Int",
      },
    },
    category: { __type: "CategoryTree", __args: { id: "Int" } },
    categoryList: {
      __type: "[CategoryTree]",
      __args: {
        currentPage: "Int",
        filters: "CategoryFilterInput",
        pageSize: "Int",
      },
    },
    checkoutAgreements: { __type: "[CheckoutAgreement]" },
    cmsBlocks: { __type: "CmsBlocks", __args: { identifiers: "[String]" } },
    cmsPage: { __type: "CmsPage", __args: { id: "Int", identifier: "String" } },
    compareList: { __type: "CompareList", __args: { uid: "ID!" } },
    countries: { __type: "[Country]" },
    country: { __type: "Country", __args: { id: "String" } },
    currency: { __type: "Currency" },
    customAttributeMetadata: {
      __type: "CustomAttributeMetadata",
      __args: { attributes: "[AttributeInput!]!" },
    },
    customAttributeMetadataV2: {
      __type: "AttributesMetadataOutput!",
      __args: { attributes: "[AttributeInput!]" },
    },
    customer: { __type: "Customer" },
    customerCart: { __type: "Cart!" },
    customerDownloadableProducts: { __type: "CustomerDownloadableProducts" },
    customerOrders: { __type: "CustomerOrders" },
    customerPaymentTokens: { __type: "CustomerPaymentTokens" },
    getHostedProUrl: {
      __type: "HostedProUrl",
      __args: { input: "HostedProUrlInput!" },
    },
    getPayflowLinkToken: {
      __type: "PayflowLinkToken",
      __args: { input: "PayflowLinkTokenInput!" },
    },
    getPaymentConfig: {
      __type: "PaymentConfigOutput",
      __args: { location: "PaymentLocation!" },
    },
    getPaymentOrder: {
      __type: "PaymentOrderOutput",
      __args: { cartId: "String!", id: "String!" },
    },
    getPaymentSDK: {
      __type: "GetPaymentSDKOutput",
      __args: { location: "PaymentLocation!" },
    },
    getStripeConfiguration: { __type: "ModuleConfiguration" },
    getVaultConfig: { __type: "VaultConfigOutput" },
    guestOrder: {
      __type: "CustomerOrder!",
      __args: { input: "OrderInformationInput!" },
    },
    guestOrderByToken: {
      __type: "CustomerOrder!",
      __args: { input: "OrderTokenInput!" },
    },
    isEmailAvailable: {
      __type: "IsEmailAvailableOutput",
      __args: { email: "String!" },
    },
    pickupLocations: {
      __type: "PickupLocations",
      __args: {
        area: "AreaInput",
        currentPage: "Int",
        filters: "PickupLocationFilterInput",
        pageSize: "Int",
        productsInfo: "[ProductInfoInput]",
        sort: "PickupLocationSortInput",
      },
    },
    productReviewRatingsMetadata: { __type: "ProductReviewRatingsMetadata!" },
    products: {
      __type: "Products",
      __args: {
        currentPage: "Int",
        filter: "ProductAttributeFilterInput",
        pageSize: "Int",
        search: "String",
        sort: "ProductAttributeSortInput",
      },
    },
    recaptchaV3Config: { __type: "ReCaptchaConfigurationV3" },
    route: { __type: "RoutableInterface", __args: { url: "String!" } },
    snowdogMenuNodes: {
      __type: "SnowdogMenuNodes",
      __args: { identifier: "String!" },
    },
    snowdogMenus: {
      __type: "SnowdogMenus",
      __args: { identifiers: "[String]" },
    },
    storeConfig: { __type: "StoreConfig" },
    urlResolver: { __type: "EntityUrl", __args: { url: "String!" } },
    wishlist: { __type: "WishlistOutput" },
  },
  subscription: {},
  [SchemaUnionsKey]: {
    AggregationOptionInterface: ["AggregationOption"],
    PaymentConfigItem: [
      "ApplePayConfig",
      "FastlaneConfig",
      "GooglePayConfig",
      "HostedFieldsConfig",
      "PaymentCommonConfig",
      "SmartButtonsConfig",
    ],
    CustomAttributeMetadataInterface: [
      "AttributeMetadata",
      "CatalogAttributeMetadata",
      "CustomerAttributeMetadata",
    ],
    CustomAttributeOptionInterface: ["AttributeOptionMetadata"],
    AttributeSelectedOptionInterface: ["AttributeSelectedOption"],
    AttributeValueInterface: ["AttributeSelectedOptions", "AttributeValue"],
    CartAddressInterface: ["BillingCartAddress", "ShippingCartAddress"],
    CartItemInterface: [
      "BundleCartItem",
      "ConfigurableCartItem",
      "DownloadableCartItem",
      "SimpleCartItem",
      "VirtualCartItem",
    ],
    CreditMemoItemInterface: [
      "BundleCreditMemoItem",
      "CreditMemoItem",
      "DownloadableCreditMemoItem",
    ],
    InvoiceItemInterface: ["BundleInvoiceItem", "DownloadableInvoiceItem", "InvoiceItem"],
    OrderItemInterface: ["BundleOrderItem", "DownloadableOrderItem", "OrderItem"],
    CustomizableProductInterface: [
      "BundleProduct",
      "ConfigurableProduct",
      "DownloadableProduct",
      "SimpleProduct",
      "VirtualProduct",
    ],
    PhysicalProductInterface: [
      "BundleProduct",
      "ConfigurableProduct",
      "GroupedProduct",
      "SimpleProduct",
    ],
    ProductInterface: [
      "BundleProduct",
      "ConfigurableProduct",
      "DownloadableProduct",
      "GroupedProduct",
      "SimpleProduct",
      "VirtualProduct",
    ],
    RoutableInterface: [
      "BundleProduct",
      "CategoryTree",
      "CmsPage",
      "ConfigurableProduct",
      "DownloadableProduct",
      "GroupedProduct",
      "RoutableUrl",
      "SimpleProduct",
      "VirtualProduct",
    ],
    ShipmentItemInterface: ["BundleShipmentItem", "ShipmentItem"],
    WishlistItemInterface: [
      "BundleWishlistItem",
      "ConfigurableWishlistItem",
      "DownloadableWishlistItem",
      "GroupedProductWishlistItem",
      "SimpleWishlistItem",
      "VirtualWishlistItem",
    ],
    CategoryInterface: ["CategoryTree"],
    SwatchDataInterface: ["ColorSwatchData", "ImageSwatchData", "TextSwatchData"],
    CustomizableOptionInterface: [
      "CustomizableAreaOption",
      "CustomizableCheckboxOption",
      "CustomizableDateOption",
      "CustomizableDropDownOption",
      "CustomizableFieldOption",
      "CustomizableFileOption",
      "CustomizableMultipleOption",
      "CustomizableRadioOption",
    ],
    ErrorInterface: ["InternalError", "NoSuchEntityUidError"],
    LayerFilterItemInterface: ["LayerFilterItem", "SwatchLayerFilterItem"],
    MediaGalleryInterface: ["ProductImage", "ProductVideo"],
    ProductLinksInterface: ["ProductLinks"],
    SnowdogMenuNodeContentFieldInterface: [
      "SnowdogMenuCmsPageNode",
      "SnowdogMenuCustomUrlNode",
      "SnowdogMenuNode",
    ],
    SnowdogMenuNodeInterface: [
      "SnowdogMenuCmsPageNode",
      "SnowdogMenuCustomUrlNode",
      "SnowdogMenuNode",
      "SnowdogMenuWrapperNode",
    ],
    SnowdogMenuCustomUrlNodeInterface: ["SnowdogMenuCustomUrlNode"],
    SnowdogMenuNodeImageFieldInterface: ["SnowdogMenuCustomUrlNode", "SnowdogMenuNode"],
    SwatchLayerFilterItemInterface: ["SwatchLayerFilterItem"],
  },
} as const;

/**
 * Contains details about the cart after adding bundle products.
 */
export interface AddBundleProductsToCartOutput {
  __typename?: "AddBundleProductsToCartOutput";
  /**
   * The cart after adding products.
   */
  cart: Cart;
}

/**
 * Contains details about the cart after adding configurable products.
 */
export interface AddConfigurableProductsToCartOutput {
  __typename?: "AddConfigurableProductsToCartOutput";
  /**
   * The cart after adding products.
   */
  cart: Cart;
}

/**
 * Contains details about the cart after adding downloadable products.
 */
export interface AddDownloadableProductsToCartOutput {
  __typename?: "AddDownloadableProductsToCartOutput";
  /**
   * The cart after adding products.
   */
  cart: Cart;
}

/**
 * Contains details about the cart after adding products to it.
 */
export interface AddProductsToCartOutput {
  __typename?: "AddProductsToCartOutput";
  /**
   * The cart after products have been added.
   */
  cart: Cart;
  /**
   * Contains errors encountered while adding an item to the cart.
   */
  user_errors: Array<Maybe<CartUserInputError>>;
}

/**
 * Contains details about the cart after adding products to it.
 */
export interface AddProductsToNewCartOutput {
  __typename?: "AddProductsToNewCartOutput";
  /**
   * The cart after products have been added.
   */
  cart?: Maybe<Cart>;
  /**
   * Contains errors encountered while adding an item to the cart.
   */
  user_errors?: Maybe<Array<Maybe<CartUserInputError>>>;
}

/**
 * Contains the customer's wish list and any errors encountered.
 */
export interface AddProductsToWishlistOutput {
  __typename?: "AddProductsToWishlistOutput";
  /**
   * An array of errors encountered while adding products to a wish list.
   */
  user_errors: Array<Maybe<WishListUserInputError>>;
  /**
   * Contains the wish list with all items that were successfully added.
   */
  wishlist: Wishlist;
}

/**
 * Contains details about the cart after adding simple or group products.
 */
export interface AddSimpleProductsToCartOutput {
  __typename?: "AddSimpleProductsToCartOutput";
  /**
   * The cart after adding products.
   */
  cart: Cart;
}

/**
 * Contains details about the cart after adding virtual products.
 */
export interface AddVirtualProductsToCartOutput {
  __typename?: "AddVirtualProductsToCartOutput";
  /**
   * The cart after adding products.
   */
  cart: Cart;
}

/**
 * Contains the resultant wish list and any error information.
 */
export interface AddWishlistItemsToCartOutput {
  __typename?: "AddWishlistItemsToCartOutput";
  /**
   * An array of errors encountered while adding products to the customer's cart.
   */
  add_wishlist_items_to_cart_user_errors: Array<Maybe<WishlistCartUserInputError>>;
  /**
   * Indicates whether the attempt to add items to the customer's cart was successful.
   */
  status?: Scalars["Boolean"]["output"];
  /**
   * Contains the wish list with all items that were successfully added.
   */
  wishlist: Wishlist;
}

/**
 * Contains information for each filterable option (such as price, category `UID`, and custom attributes).
 */
export interface Aggregation {
  __typename?: "Aggregation";
  /**
   * Attribute code of the aggregation group.
   */
  attribute_code?: Scalars["String"]["output"];
  /**
   * The number of options in the aggregation group.
   */
  count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The aggregation display name.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * Array of options for the aggregation.
   */
  options?: Maybe<Array<Maybe<AggregationOption>>>;
  /**
   * The relative position of the attribute in a layered navigation block.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * An implementation of `AggregationOptionInterface`.
 */
export interface AggregationOption {
  __typename?: "AggregationOption";
  /**
   * The number of items that match the aggregation option.
   */
  count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display label for an aggregation option.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The internal ID that represents the value of the option.
   */
  value?: Scalars["String"]["output"];
}

/**
 * Defines aggregation option fields.
 */
export interface AggregationOptionInterface {
  __typename?: "AggregationOption";
  /**
   * The number of items that match the aggregation option.
   */
  count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display label for an aggregation option.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The internal ID that represents the value of the option.
   */
  value?: Scalars["String"]["output"];
  $on: $AggregationOptionInterface;
}

export interface ApplePayConfig {
  __typename?: "ApplePayConfig";
  /**
   * The styles for the ApplePay Smart Button configuration
   */
  button_styles?: Maybe<ButtonStyles>;
  /**
   * The payment method code as defined in the payment gateway
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the payment method is displayed
   */
  is_visible?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Defines the payment intent (Authorize or Capture
   */
  payment_intent?: Maybe<Scalars["String"]["output"]>;
  /**
   * The payment source for the payment method
   */
  payment_source?: Maybe<Scalars["String"]["output"]>;
  /**
   * The PayPal parameters required to load the JS SDK
   */
  sdk_params?: Maybe<Array<Maybe<SDKParams>>>;
  /**
   * The relative order the payment method is displayed on the checkout page
   */
  sort_order?: Maybe<Scalars["String"]["output"]>;
  /**
   * The name displayed for the payment method
   */
  title?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains the applied coupon code.
 */
export interface AppliedCoupon {
  __typename?: "AppliedCoupon";
  /**
   * The coupon code the shopper applied to the card.
   */
  code?: Scalars["String"]["output"];
}

/**
 * Contains details about the cart after applying a coupon.
 */
export interface ApplyCouponToCartOutput {
  __typename?: "ApplyCouponToCartOutput";
  /**
   * The cart after applying a coupon.
   */
  cart: Cart;
}

/**
 * Contains the results of the request to assign a compare list.
 */
export interface AssignCompareListToCustomerOutput {
  __typename?: "AssignCompareListToCustomerOutput";
  /**
   * The contents of the customer's compare list.
   */
  compare_list?: Maybe<CompareList>;
  /**
   * Indicates whether the compare list was successfully assigned to the customer.
   */
  result?: Scalars["Boolean"]["output"];
}

/**
 * Contains details about the attribute, including the code and type.
 */
export interface Attribute {
  __typename?: "Attribute";
  /**
   * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
   */
  attribute_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * Attribute options list.
   */
  attribute_options?: Maybe<Array<Maybe<AttributeOption>>>;
  /**
   * The data type of the attribute.
   */
  attribute_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * The type of entity that defines the attribute.
   */
  entity_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * The frontend input type of the attribute.
   */
  input_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * Details about the storefront properties configured for the attribute.
   */
  storefront_properties?: Maybe<StorefrontProperties>;
}

/**
 * Base EAV implementation of CustomAttributeMetadataInterface.
 */
export interface AttributeMetadata {
  __typename?: "AttributeMetadata";
  /**
   * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
   */
  code?: Scalars["ID"]["output"];
  /**
   * Default attribute value.
   */
  default_value?: Maybe<Scalars["String"]["output"]>;
  /**
   * The type of entity that defines the attribute.
   */
  entity_type?: AttributeEntityTypeEnum;
  /**
   * The frontend class of the attribute.
   */
  frontend_class?: Maybe<Scalars["String"]["output"]>;
  /**
   * The frontend input type of the attribute.
   */
  frontend_input?: Maybe<AttributeFrontendInputEnum>;
  /**
   * Whether the attribute value is required.
   */
  is_required?: Scalars["Boolean"]["output"];
  /**
   * Whether the attribute value must be unique.
   */
  is_unique?: Scalars["Boolean"]["output"];
  /**
   * The label assigned to the attribute.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * Attribute options.
   */
  options: Array<Maybe<CustomAttributeOptionInterface>>;
}

/**
 * Attribute metadata retrieval error.
 */
export interface AttributeMetadataError {
  __typename?: "AttributeMetadataError";
  /**
   * Attribute metadata retrieval error message.
   */
  message?: Scalars["String"]["output"];
  /**
   * Attribute metadata retrieval error type.
   */
  type?: AttributeMetadataErrorType;
}

/**
 * Defines an attribute option.
 */
export interface AttributeOption {
  __typename?: "AttributeOption";
  /**
   * The label assigned to the attribute option.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The attribute option value.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Base EAV implementation of CustomAttributeOptionInterface.
 */
export interface AttributeOptionMetadata {
  __typename?: "AttributeOptionMetadata";
  /**
   * Is the option value default.
   */
  is_default?: Scalars["Boolean"]["output"];
  /**
   * The label assigned to the attribute option.
   */
  label?: Scalars["String"]["output"];
  /**
   * The attribute option value.
   */
  value?: Scalars["String"]["output"];
}

export interface AttributeSelectedOption {
  __typename?: "AttributeSelectedOption";
  /**
   * The attribute selected option label.
   */
  label?: Scalars["String"]["output"];
  /**
   * The attribute selected option value.
   */
  value?: Scalars["String"]["output"];
}

export interface AttributeSelectedOptionInterface {
  __typename?: "AttributeSelectedOption";
  /**
   * The attribute selected option label.
   */
  label?: Scalars["String"]["output"];
  /**
   * The attribute selected option value.
   */
  value?: Scalars["String"]["output"];
  $on: $AttributeSelectedOptionInterface;
}

export interface AttributeSelectedOptions {
  __typename?: "AttributeSelectedOptions";
  /**
   * The attribute code.
   */
  code?: Scalars["ID"]["output"];
  selected_options: Array<Maybe<AttributeSelectedOptionInterface>>;
}

export interface AttributeValue {
  __typename?: "AttributeValue";
  /**
   * The attribute code.
   */
  code?: Scalars["ID"]["output"];
  /**
   * The attribute value.
   */
  value?: Scalars["String"]["output"];
}

export interface AttributeValueInterface {
  __typename?: "AttributeSelectedOptions" | "AttributeValue";
  /**
   * The attribute code.
   */
  code?: Scalars["ID"]["output"];
  $on: $AttributeValueInterface;
}

/**
 * Metadata of EAV attributes associated to form
 */
export interface AttributesFormOutput {
  __typename?: "AttributesFormOutput";
  /**
   * Errors of retrieving certain attributes metadata.
   */
  errors: Array<Maybe<AttributeMetadataError>>;
  /**
   * Requested attributes metadata.
   */
  items: Array<Maybe<CustomAttributeMetadataInterface>>;
}

/**
 * Metadata of EAV attributes.
 */
export interface AttributesMetadataOutput {
  __typename?: "AttributesMetadataOutput";
  /**
   * Errors of retrieving certain attributes metadata.
   */
  errors: Array<Maybe<AttributeMetadataError>>;
  /**
   * Requested attributes metadata.
   */
  items: Array<Maybe<CustomAttributeMetadataInterface>>;
}

/**
 * Describes a payment method that the shopper can use to pay for the order.
 */
export interface AvailablePaymentMethod {
  __typename?: "AvailablePaymentMethod";
  /**
   * The payment method code.
   */
  code?: Scalars["String"]["output"];
  /**
   * If the payment method is an online integration
   */
  is_deferred?: Scalars["Boolean"]["output"];
  /**
   * The payment method title.
   */
  title?: Scalars["String"]["output"];
}

/**
 * Contains details about the possible shipping methods and carriers.
 */
export interface AvailableShippingMethod {
  __typename?: "AvailableShippingMethod";
  /**
   * The cost of shipping using this shipping method.
   */
  amount: Money;
  /**
   * Indicates whether this shipping method can be applied to the cart.
   */
  available?: Scalars["Boolean"]["output"];
  /**
   * @deprecated The field should not be used on the storefront.
   */
  base_amount?: Maybe<Money>;
  /**
   * A string that identifies a commercial carrier or an offline shipping method.
   */
  carrier_code?: Scalars["String"]["output"];
  /**
   * The label for the carrier code.
   */
  carrier_title?: Scalars["String"]["output"];
  /**
   * Describes an error condition.
   */
  error_message?: Maybe<Scalars["String"]["output"]>;
  /**
   * A shipping method code associated with a carrier. The value could be null if no method is available.
   */
  method_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The label for the shipping method code. The value could be null if no method is available.
   */
  method_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The cost of shipping using this shipping method, excluding tax.
   */
  price_excl_tax: Money;
  /**
   * The cost of shipping using this shipping method, including tax.
   */
  price_incl_tax: Money;
}

/**
 * Contains details about the billing address.
 */
export interface BillingCartAddress {
  __typename?: "BillingCartAddress";
  /**
   * The city specified for the billing or shipping address.
   */
  city?: Scalars["String"]["output"];
  /**
   * The company specified for the billing or shipping address.
   */
  company?: Maybe<Scalars["String"]["output"]>;
  /**
   * An object containing the country label and code.
   */
  country: CartAddressCountry;
  /**
   * @deprecated The field is used only in shipping address.
   */
  customer_notes?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's fax number.
   */
  fax?: Maybe<Scalars["String"]["output"]>;
  /**
   * The first name of the customer or guest.
   */
  firstname?: Scalars["String"]["output"];
  /**
   * The last name of the customer or guest.
   */
  lastname?: Scalars["String"]["output"];
  /**
   * The middle name of the person associated with the billing/shipping address.
   */
  middlename?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ZIP or postal code of the billing or shipping address.
   */
  postcode?: Maybe<Scalars["String"]["output"]>;
  /**
   * An honorific, such as Dr., Mr., or Mrs.
   */
  prefix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An object containing the region label and code.
   */
  region?: Maybe<CartAddressRegion>;
  /**
   * An array containing the street for the billing or shipping address.
   */
  street?: Array<Maybe<Scalars["String"]["output"]>>;
  /**
   * A value such as Sr., Jr., or III.
   */
  suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * The telephone number for the billing or shipping address.
   */
  telephone?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique id of the customer address.
   */
  uid?: Scalars["String"]["output"];
  /**
   * The VAT company number for billing or shipping address.
   */
  vat_id?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains details about an individual category that comprises a breadcrumb.
 */
export interface Breadcrumb {
  __typename?: "Breadcrumb";
  /**
   * The ID of the category.
   * @deprecated Use `category_uid` instead.
   */
  category_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The category level.
   */
  category_level?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name of the category.
   */
  category_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `Breadcrumb` object.
   */
  category_uid?: Scalars["ID"]["output"];
  /**
   * The URL key of the category.
   */
  category_url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * The URL path of the category.
   */
  category_url_path?: Maybe<Scalars["String"]["output"]>;
}

/**
 * An implementation for bundle product cart items.
 */
export interface BundleCartItem {
  __typename?: "BundleCartItem";
  /**
   * An array containing the bundle options the shopper selected.
   */
  bundle_options: Array<Maybe<SelectedBundleOption>>;
  /**
   * An array containing the customizable options the shopper selected.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * An array of errors encountered while loading the cart item
   */
  errors?: Maybe<Array<Maybe<CartItemError>>>;
  /**
   * The entered gift message for the cart item
   */
  gift_message?: Maybe<GiftMessage>;
  /**
   * @deprecated Use `uid` instead.
   */
  id?: Scalars["String"]["output"];
  /**
   * True if requested quantity is less than available stock, false otherwise.
   */
  is_available?: Scalars["Boolean"]["output"];
  /**
   * Contains details about the price of the item, including taxes and discounts.
   */
  prices?: Maybe<CartItemPrices>;
  /**
   * Details about an item in the cart.
   */
  product: ProductInterface;
  /**
   * The quantity of this item in the cart.
   */
  quantity?: Scalars["Float"]["output"];
  /**
   * The unique ID for a `CartItemInterface` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Defines bundle product options for `CreditMemoItemInterface`.
 */
export interface BundleCreditMemoItem {
  __typename?: "BundleCreditMemoItem";
  /**
   * A list of bundle options that are assigned to a bundle product that is part of a credit memo.
   */
  bundle_options?: Maybe<Array<Maybe<ItemSelectedBundleOption>>>;
  /**
   * Details about the final discount amount for the base product, including discounts on options.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The unique ID for a `CreditMemoItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The order item the credit memo is applied to.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product, including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of refunded items.
   */
  quantity_refunded?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Defines bundle product options for `InvoiceItemInterface`.
 */
export interface BundleInvoiceItem {
  __typename?: "BundleInvoiceItem";
  /**
   * A list of bundle options that are assigned to an invoiced bundle product.
   */
  bundle_options?: Maybe<Array<Maybe<ItemSelectedBundleOption>>>;
  /**
   * Information about the final discount amount for the base product, including discounts on options.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The unique ID for an `InvoiceItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Details about an individual order item.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of invoiced items.
   */
  quantity_invoiced?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Defines an individual item within a bundle product.
 */
export interface BundleItem {
  __typename?: "BundleItem";
  /**
   * An ID assigned to each type of item in a bundle product.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of additional options for this bundle item.
   */
  options?: Maybe<Array<Maybe<BundleItemOption>>>;
  /**
   * A number indicating the sequence order of this item compared to the other bundle items.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The range of prices for the product
   */
  price_range: PriceRange;
  /**
   * Indicates whether the item must be included in the bundle.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The SKU of the bundle product.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The display name of the item.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The input type that the customer uses to select the item. Examples include radio button and checkbox.
   */
  type?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `BundleItem` object.
   */
  uid?: Maybe<Scalars["ID"]["output"]>;
}

/**
 * Defines the characteristics that comprise a specific bundle item and its options.
 */
export interface BundleItemOption {
  __typename?: "BundleItemOption";
  /**
   * Indicates whether the customer can change the number of items for this option.
   */
  can_change_quantity?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The ID assigned to the bundled item option.
   * @deprecated Use `uid` instead
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether this option is the default option.
   */
  is_default?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The text that identifies the bundled item option.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * When a bundle item contains multiple options, the relative position of this option compared to the other options.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The price of the selected option.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * One of FIXED, PERCENT, or DYNAMIC.
   */
  price_type?: Maybe<PriceTypeEnum>;
  /**
   * Contains details about this product option.
   */
  product?: Maybe<ProductInterface>;
  /**
   * Indicates the quantity of this specific bundle item.
   * @deprecated Use `quantity` instead.
   */
  qty?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The quantity of this specific bundle item.
   */
  quantity?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The unique ID for a `BundleItemOption` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Defines bundle product options for `OrderItemInterface`.
 */
export interface BundleOrderItem {
  __typename?: "BundleOrderItem";
  /**
   * A list of bundle options that are assigned to the bundle product.
   */
  bundle_options?: Maybe<Array<Maybe<ItemSelectedBundleOption>>>;
  /**
   * The final discount information for the product.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The entered option for the base product, such as a logo or image.
   */
  entered_options?: Maybe<Array<Maybe<OrderItemOption>>>;
  /**
   * The selected gift message for the order item
   */
  gift_message?: Maybe<GiftMessage>;
  /**
   * The unique ID for an `OrderItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The ProductInterface object, which contains details about the base product
   */
  product?: Maybe<ProductInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price of the base product, including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The type of product, such as simple, configurable, etc.
   */
  product_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL key of the base product.
   */
  product_url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * The number of canceled items.
   */
  quantity_canceled?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of invoiced items.
   */
  quantity_invoiced?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of units ordered for this item.
   */
  quantity_ordered?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of refunded items.
   */
  quantity_refunded?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of returned items.
   */
  quantity_returned?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of shipped items.
   */
  quantity_shipped?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The selected options for the base product, such as color or size.
   */
  selected_options?: Maybe<Array<Maybe<OrderItemOption>>>;
  /**
   * The status of the order item.
   */
  status?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Defines basic features of a bundle product and contains multiple BundleItems.
 */
export interface BundleProduct {
  __typename?: "BundleProduct";
  /**
   * The attribute set assigned to the product.
   * @deprecated The field should not be used on the storefront.
   */
  attribute_set_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The categories assigned to a product.
   */
  categories?: Maybe<Array<Maybe<CategoryInterface>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  color?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The product's country of origin.
   */
  country_of_manufacture?: Maybe<Scalars["String"]["output"]>;
  /**
   * Timestamp indicating when the product was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Crosssell Products
   */
  crosssell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * Product custom attributes.
   */
  custom_attributesV2: (args?: {
    filters?: Maybe<AttributeFilterInput>;
  }) => Maybe<ProductCustomAttributes>;
  /**
   * Detailed information about the product. The value can include simple HTML tags.
   */
  description?: Maybe<ComplexTextValue>;
  /**
   * Indicates whether the bundle product has a dynamic price.
   */
  dynamic_price?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the bundle product has a dynamic SKU.
   */
  dynamic_sku?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the bundle product has a dynamically calculated weight.
   */
  dynamic_weight?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  figure_size?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether a gift message is available.
   */
  gift_message_available?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID number assigned to the product.
   * @deprecated Use the `uid` field instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the main image on the product page.
   */
  image?: Maybe<ProductImage>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  is_suggested?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array containing information about individual bundle items.
   */
  items?: Maybe<Array<Maybe<BundleItem>>>;
  /**
   * A number representing the product's manufacturer.
   * @deprecated Use the `custom_attributes` field instead.
   */
  manufacturer?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  match_collezione2?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of media gallery objects.
   */
  media_gallery?: Maybe<Array<Maybe<MediaGalleryInterface>>>;
  /**
   * An array of MediaGalleryEntry objects.
   * @deprecated Use `media_gallery` instead.
   */
  media_gallery_entries?: Maybe<Array<Maybe<MediaGalleryEntry>>>;
  /**
   * A brief overview of the product for search results listings, maximum 255 characters.
   */
  meta_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * A comma-separated list of keywords that are visible only to search engines.
   */
  meta_keyword?: Maybe<Scalars["String"]["output"]>;
  /**
   * A string that is displayed in the title bar and tab of the browser and in search results lists.
   */
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The product name. Customers use this name to identify the product.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The beginning date for new product listings, and determines if the product is featured as a new product.
   */
  new_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The end date for new product listings.
   */
  new_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Product stock only x left count
   */
  only_x_left_in_stock?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of options for a customizable product.
   */
  options?: Maybe<Array<Maybe<CustomizableOptionInterface>>>;
  /**
   * If the product has multiple options, determines where they appear on the product page.
   */
  options_container?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates the price of an item.
   * @deprecated Use `price_range` for product price information.
   */
  price?: Maybe<ProductPrices>;
  /**
   * The price details of the main product
   */
  price_details?: Maybe<PriceDetails>;
  /**
   * The range of prices for the product
   */
  price_range: PriceRange;
  /**
   * An array of `TierPrice` objects.
   */
  price_tiers?: Maybe<Array<Maybe<TierPrice>>>;
  /**
   * One of PRICE_RANGE or AS_LOW_AS.
   */
  price_view?: Maybe<PriceViewEnum>;
  /**
   * An array of `ProductLinks` objects.
   */
  product_links?: Maybe<Array<Maybe<ProductLinksInterface>>>;
  /**
   * The average of all the ratings given to the product.
   */
  rating_summary?: Scalars["Float"]["output"];
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * An array of products to be displayed in a Related Products block.
   */
  related_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The total count of all the reviews given to the product.
   */
  review_count?: Scalars["Int"]["output"];
  /**
   * The list of products reviews.
   */
  reviews: (args?: {
    /**
     * The page of results to return. The default is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => ProductReviews;
  /**
   * Indicates whether to ship bundle items together or individually.
   */
  ship_bundle_items?: Maybe<ShipBundleItemsEnum>;
  /**
   * A short description of the product. Its use depends on the theme.
   */
  short_description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  size?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number or code assigned to a product to identify the product, options, price, and manufacturer.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The relative path to the small image, which is used on catalog pages.
   */
  small_image?: Maybe<ProductImage>;
  /**
   * The beginning date that a product has a special price.
   * @deprecated The field should not be used on the storefront.
   */
  special_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The discounted price of the product.
   */
  special_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The end date for a product with a special price.
   */
  special_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Stock status of the product
   */
  stock_status?: Maybe<ProductStockStatus>;
  /**
   * The file name of a swatch image.
   */
  swatch_image?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tema?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the product's thumbnail image.
   */
  thumbnail?: Maybe<ProductImage>;
  /**
   * The price when tier pricing is in effect and the items purchased threshold has been reached.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of ProductTierPrices objects.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_prices?: Maybe<Array<Maybe<ProductTierPrices>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tipologia?: Maybe<Scalars["Int"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
  /**
   * One of simple, virtual, bundle, downloadable, grouped, or configurable.
   * @deprecated Use `__typename` instead.
   */
  type_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `ProductInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * Timestamp indicating when the product was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Upsell Products
   */
  upsell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The part of the URL that identifies the product
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use product's `canonical_url` or url rewrites instead
   */
  url_path?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL rewrites list
   */
  url_rewrites?: Maybe<Array<Maybe<UrlRewrite>>>;
  /**
   * The part of the product URL that is appended after the url key
   */
  url_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An array of websites in which the product is available.
   * @deprecated The field should not be used on the storefront.
   */
  websites?: Maybe<Array<Maybe<Website>>>;
  /**
   * The weight of the item, in units defined by the store.
   */
  weight?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Defines bundle product options for `ShipmentItemInterface`.
 */
export interface BundleShipmentItem {
  __typename?: "BundleShipmentItem";
  /**
   * A list of bundle options that are assigned to a shipped product.
   */
  bundle_options?: Maybe<Array<Maybe<ItemSelectedBundleOption>>>;
  /**
   * The unique ID for a `ShipmentItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The order item associated with the shipment item.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of shipped items.
   */
  quantity_shipped?: Scalars["Float"]["output"];
}

/**
 * Defines bundle product options for `WishlistItemInterface`.
 */
export interface BundleWishlistItem {
  __typename?: "BundleWishlistItem";
  /**
   * The date and time the item was added to the wish list.
   */
  added_at?: Scalars["String"]["output"];
  /**
   * An array containing information about the selected bundle items.
   */
  bundle_options?: Maybe<Array<Maybe<SelectedBundleOption>>>;
  /**
   * Custom options selected for the wish list item.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * The description of the item.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `WishlistItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Product details of the wish list item.
   */
  product?: Maybe<ProductInterface>;
  /**
   * The quantity of this wish list item.
   */
  quantity?: Scalars["Float"]["output"];
}

export interface ButtonStyles {
  __typename?: "ButtonStyles";
  /**
   * The button color
   */
  color?: Maybe<Scalars["String"]["output"]>;
  /**
   * The button height in pixels
   */
  height?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The button label
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The button layout
   */
  layout?: Maybe<Scalars["String"]["output"]>;
  /**
   * The button shape
   */
  shape?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the tagline is displayed
   */
  tagline?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Defines if the button uses default height. If the value is false, the value of height is used
   */
  use_default_height?: Maybe<Scalars["Boolean"]["output"]>;
}

/**
 * Contains the updated customer order and error message if any.
 */
export interface CancelOrderOutput {
  __typename?: "CancelOrderOutput";
  /**
   * Error encountered while cancelling the order.
   */
  error?: Maybe<Scalars["String"]["output"]>;
  /**
   * Updated customer order.
   */
  order?: Maybe<CustomerOrder>;
}

export interface CancellationReason {
  __typename?: "CancellationReason";
  description?: Scalars["String"]["output"];
}

export interface Card {
  __typename?: "Card";
  /**
   * Card bin details
   */
  bin_details?: Maybe<CardBin>;
  /**
   * Expiration month of the card
   */
  card_expiry_month?: Maybe<Scalars["String"]["output"]>;
  /**
   * Expiration year of the card
   */
  card_expiry_year?: Maybe<Scalars["String"]["output"]>;
  /**
   * Last four digits of the card
   */
  last_digits?: Maybe<Scalars["String"]["output"]>;
  /**
   * Name on the card
   */
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface CardBin {
  __typename?: "CardBin";
  /**
   * Card bin number
   */
  bin?: Maybe<Scalars["String"]["output"]>;
}

/**
 * The card payment source information
 */
export interface CardPaymentSourceOutput {
  __typename?: "CardPaymentSourceOutput";
  /**
   * The brand of the card
   */
  brand?: Maybe<Scalars["String"]["output"]>;
  /**
   * The expiry of the card
   */
  expiry?: Maybe<Scalars["String"]["output"]>;
  /**
   * The last digits of the card
   */
  last_digits?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains the contents and other details about a guest or customer cart.
 */
export interface Cart {
  __typename?: "Cart";
  /**
   * @deprecated Use `applied_coupons` instead.
   */
  applied_coupon?: Maybe<AppliedCoupon>;
  /**
   * An array of `AppliedCoupon` objects. Each object contains the `code` text attribute, which specifies the coupon code.
   */
  applied_coupons?: Maybe<Array<Maybe<AppliedCoupon>>>;
  /**
   * An array of available payment methods.
   */
  available_payment_methods?: Maybe<Array<Maybe<AvailablePaymentMethod>>>;
  /**
   * The billing address assigned to the cart.
   */
  billing_address?: Maybe<BillingCartAddress>;
  /**
   * The email address of the guest or customer.
   */
  email?: Maybe<Scalars["String"]["output"]>;
  /**
   * The entered gift message for the cart
   */
  gift_message?: Maybe<GiftMessage>;
  /**
   * The unique ID for a `Cart` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Indicates whether the cart contains only virtual products.
   */
  is_virtual?: Scalars["Boolean"]["output"];
  /**
   * An array of products that have been added to the cart.
   * @deprecated Use `itemsV2` instead.
   */
  items?: Maybe<Array<Maybe<CartItemInterface>>>;
  itemsV2: (args?: {
    /**
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
    sort?: Maybe<QuoteItemsSortInput>;
  }) => Maybe<CartItems>;
  /**
   * Pricing details for the quote.
   */
  prices?: Maybe<CartPrices>;
  /**
   * Indicates which payment method was applied to the cart.
   */
  selected_payment_method?: Maybe<SelectedPaymentMethod>;
  /**
   * An array of shipping addresses assigned to the cart.
   */
  shipping_addresses: Array<Maybe<ShippingCartAddress>>;
  /**
   * The total number of items in the cart.
   */
  total_quantity?: Scalars["Float"]["output"];
}

/**
 * Contains details the country in a billing or shipping address.
 */
export interface CartAddressCountry {
  __typename?: "CartAddressCountry";
  /**
   * The country code.
   */
  code?: Scalars["String"]["output"];
  /**
   * The display label for the country.
   */
  label?: Scalars["String"]["output"];
}

export interface CartAddressInterface {
  __typename?: "BillingCartAddress" | "ShippingCartAddress";
  /**
   * The city specified for the billing or shipping address.
   */
  city?: Scalars["String"]["output"];
  /**
   * The company specified for the billing or shipping address.
   */
  company?: Maybe<Scalars["String"]["output"]>;
  /**
   * An object containing the country label and code.
   */
  country: CartAddressCountry;
  /**
   * The customer's fax number.
   */
  fax?: Maybe<Scalars["String"]["output"]>;
  /**
   * The first name of the customer or guest.
   */
  firstname?: Scalars["String"]["output"];
  /**
   * The last name of the customer or guest.
   */
  lastname?: Scalars["String"]["output"];
  /**
   * The middle name of the person associated with the billing/shipping address.
   */
  middlename?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ZIP or postal code of the billing or shipping address.
   */
  postcode?: Maybe<Scalars["String"]["output"]>;
  /**
   * An honorific, such as Dr., Mr., or Mrs.
   */
  prefix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An object containing the region label and code.
   */
  region?: Maybe<CartAddressRegion>;
  /**
   * An array containing the street for the billing or shipping address.
   */
  street?: Array<Maybe<Scalars["String"]["output"]>>;
  /**
   * A value such as Sr., Jr., or III.
   */
  suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * The telephone number for the billing or shipping address.
   */
  telephone?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique id of the customer address.
   */
  uid?: Scalars["String"]["output"];
  /**
   * The VAT company number for billing or shipping address.
   */
  vat_id?: Maybe<Scalars["String"]["output"]>;
  $on: $CartAddressInterface;
}

/**
 * Contains details about the region in a billing or shipping address.
 */
export interface CartAddressRegion {
  __typename?: "CartAddressRegion";
  /**
   * The state or province code.
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The display label for the region.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a pre-defined region.
   */
  region_id?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * Contains information about discounts applied to the cart.
 */
export interface CartDiscount {
  __typename?: "CartDiscount";
  /**
   * The amount of the discount applied to the item.
   */
  amount: Money;
  /**
   * The description of the discount.
   */
  label?: Array<Maybe<Scalars["String"]["output"]>>;
}

export interface CartItemError {
  __typename?: "CartItemError";
  /**
   * An error code that describes the error encountered
   */
  code?: CartItemErrorType;
  /**
   * A localized error message
   */
  message?: Scalars["String"]["output"];
}

/**
 * An interface for products in a cart.
 */
export interface CartItemInterface {
  __typename?:
    | "BundleCartItem"
    | "ConfigurableCartItem"
    | "DownloadableCartItem"
    | "SimpleCartItem"
    | "VirtualCartItem";
  /**
   * An array of errors encountered while loading the cart item
   */
  errors?: Maybe<Array<Maybe<CartItemError>>>;
  /**
   * @deprecated Use `uid` instead.
   */
  id?: Scalars["String"]["output"];
  /**
   * True if requested quantity is less than available stock, false otherwise.
   */
  is_available?: Scalars["Boolean"]["output"];
  /**
   * Contains details about the price of the item, including taxes and discounts.
   */
  prices?: Maybe<CartItemPrices>;
  /**
   * Details about an item in the cart.
   */
  product: ProductInterface;
  /**
   * The quantity of this item in the cart.
   */
  quantity?: Scalars["Float"]["output"];
  /**
   * The unique ID for a `CartItemInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  $on: $CartItemInterface;
}

/**
 * Contains details about the price of the item, including taxes and discounts.
 */
export interface CartItemPrices {
  __typename?: "CartItemPrices";
  /**
   * An array of discounts to be applied to the cart item.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The price of the item before any discounts were applied. The price that might include tax, depending on the configured display settings for cart.
   */
  price: Money;
  /**
   * The price of the item before any discounts were applied. The price that might include tax, depending on the configured display settings for cart.
   */
  price_including_tax: Money;
  /**
   * The value of the price multiplied by the quantity of the item.
   */
  row_total: Money;
  /**
   * The value of `row_total` plus the tax applied to the item.
   */
  row_total_including_tax: Money;
  /**
   * The total of all discounts applied to the item.
   */
  total_item_discount?: Maybe<Money>;
}

/**
 * Deprecated: The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`.
 */
export interface CartItemQuantity {
  __typename?: "CartItemQuantity";
  /**
   * @deprecated The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`.
   */
  cart_item_id?: Scalars["Int"]["output"];
  /**
   * @deprecated The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`.
   */
  quantity?: Scalars["Float"]["output"];
}

/**
 * Contains details about the price of a selected customizable value.
 */
export interface CartItemSelectedOptionValuePrice {
  __typename?: "CartItemSelectedOptionValuePrice";
  /**
   * Indicates whether the price type is fixed, percent, or dynamic.
   */
  type?: PriceTypeEnum;
  /**
   * A string that describes the unit of the value.
   */
  units?: Scalars["String"]["output"];
  /**
   * A price value.
   */
  value?: Scalars["Float"]["output"];
}

export interface CartItems {
  __typename?: "CartItems";
  /**
   * An array of products that have been added to the cart.
   */
  items: Array<Maybe<CartItemInterface>>;
  /**
   * Metadata for pagination rendering.
   */
  page_info?: Maybe<SearchResultPageInfo>;
  /**
   * The number of returned cart items.
   */
  total_count?: Scalars["Int"]["output"];
}

/**
 * Contains details about the final price of items in the cart, including discount and tax information.
 */
export interface CartPrices {
  __typename?: "CartPrices";
  /**
   * An array containing the names and amounts of taxes applied to each item in the cart.
   */
  applied_taxes?: Maybe<Array<Maybe<CartTaxItem>>>;
  /**
   * @deprecated Use discounts instead.
   */
  discount?: Maybe<CartDiscount>;
  /**
   * An array containing cart rule discounts, store credit and gift cards applied to the cart.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The total, including discounts, taxes, shipping, and other fees.
   */
  grand_total?: Maybe<Money>;
  /**
   * The subtotal without any applied taxes.
   */
  subtotal_excluding_tax?: Maybe<Money>;
  /**
   * The subtotal including any applied taxes.
   */
  subtotal_including_tax?: Maybe<Money>;
  /**
   * The subtotal with any discounts applied, but not taxes.
   */
  subtotal_with_discount_excluding_tax?: Maybe<Money>;
}

/**
 * Contains tax information about an item in the cart.
 */
export interface CartTaxItem {
  __typename?: "CartTaxItem";
  /**
   * The amount of tax applied to the item.
   */
  amount: Money;
  /**
   * The description of the tax.
   */
  label?: Scalars["String"]["output"];
}

/**
 * An error encountered while adding an item to the the cart.
 */
export interface CartUserInputError {
  __typename?: "CartUserInputError";
  /**
   * A cart-specific error code.
   */
  code?: CartUserInputErrorType;
  /**
   * A localized error message.
   */
  message?: Scalars["String"]["output"];
}

/**
 * Swatch attribute metadata.
 */
export interface CatalogAttributeMetadata {
  __typename?: "CatalogAttributeMetadata";
  /**
   * To which catalog types an attribute can be applied.
   */
  apply_to?: Maybe<Array<Maybe<CatalogAttributeApplyToEnum>>>;
  /**
   * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
   */
  code?: Scalars["ID"]["output"];
  /**
   * Default attribute value.
   */
  default_value?: Maybe<Scalars["String"]["output"]>;
  /**
   * The type of entity that defines the attribute.
   */
  entity_type?: AttributeEntityTypeEnum;
  /**
   * The frontend class of the attribute.
   */
  frontend_class?: Maybe<Scalars["String"]["output"]>;
  /**
   * The frontend input type of the attribute.
   */
  frontend_input?: Maybe<AttributeFrontendInputEnum>;
  /**
   * Whether a product or category attribute can be compared against another or not.
   */
  is_comparable?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether a product or category attribute can be filtered or not.
   */
  is_filterable?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether a product or category attribute can be filtered in search or not.
   */
  is_filterable_in_search?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether a product or category attribute can use HTML on front or not.
   */
  is_html_allowed_on_front?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether the attribute value is required.
   */
  is_required?: Scalars["Boolean"]["output"];
  /**
   * Whether a product or category attribute can be searched or not.
   */
  is_searchable?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether the attribute value must be unique.
   */
  is_unique?: Scalars["Boolean"]["output"];
  /**
   * Whether a product or category attribute can be used for price rules or not.
   */
  is_used_for_price_rules?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether a product or category attribute is used for promo rules or not.
   */
  is_used_for_promo_rules?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether a product or category attribute is visible in advanced search or not.
   */
  is_visible_in_advanced_search?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether a product or category attribute is visible on front or not.
   */
  is_visible_on_front?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether a product or category attribute has WYSIWYG enabled or not.
   */
  is_wysiwyg_enabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The label assigned to the attribute.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * Attribute options.
   */
  options: Array<Maybe<CustomAttributeOptionInterface>>;
  /**
   * Input type of the swatch attribute option.
   */
  swatch_input_type?: Maybe<SwatchInputTypeEnum>;
  /**
   * Whether update product preview image or not.
   */
  update_product_preview_image?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether use product image for swatch or not.
   */
  use_product_image_for_swatch?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Whether a product or category attribute is used in product listing or not.
   */
  used_in_product_listing?: Maybe<Scalars["Boolean"]["output"]>;
}

/**
 * Contains the full set of attributes that can be returned in a category search.
 */
export interface CategoryInterface {
  __typename?: "CategoryTree";
  available_sort_by?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * An array of breadcrumb items.
   */
  breadcrumbs?: Maybe<Array<Maybe<Breadcrumb>>>;
  /**
   * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Categories' is enabled.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  children_count?: Maybe<Scalars["String"]["output"]>;
  /**
   * Contains a category CMS block.
   */
  cms_block?: Maybe<CmsBlock>;
  /**
   * The timestamp indicating when the category was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  custom_layout_update_file?: Maybe<Scalars["String"]["output"]>;
  /**
   * The attribute to use for sorting.
   */
  default_sort_by?: Maybe<Scalars["String"]["output"]>;
  /**
   * An optional description of the category.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  display_mode?: Maybe<Scalars["String"]["output"]>;
  filter_price_range?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An ID that uniquely identifies the category.
   * @deprecated Use `uid` instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  image?: Maybe<Scalars["String"]["output"]>;
  include_in_menu?: Maybe<Scalars["Int"]["output"]>;
  is_anchor?: Maybe<Scalars["Int"]["output"]>;
  is_on_home?: Maybe<Scalars["Int"]["output"]>;
  landing_page?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The depth of the category within the tree.
   */
  level?: Maybe<Scalars["Int"]["output"]>;
  meta_description?: Maybe<Scalars["String"]["output"]>;
  meta_keywords?: Maybe<Scalars["String"]["output"]>;
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The display name of the category.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The full category path.
   */
  path?: Maybe<Scalars["String"]["output"]>;
  /**
   * The category path within the store.
   */
  path_in_store?: Maybe<Scalars["String"]["output"]>;
  /**
   * The position of the category relative to other categories at the same level in tree.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The number of products in the category that are marked as visible. By default, in complex products, parent products are visible, but their child products are not.
   */
  product_count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The list of products assigned to the category.
   */
  products: (args?: {
    /**
     * The page of results to return. The default value is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default value is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The attributes to sort on, and whether to return the results in ascending or descending order.
     */
    sort?: Maybe<ProductAttributeSortInput>;
  }) => Maybe<CategoryProducts>;
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CategoryInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * The timestamp indicating when the category was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * The URL key assigned to the category.
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * The URL path assigned to the category.
   */
  url_path?: Maybe<Scalars["String"]["output"]>;
  /**
   * The part of the category URL that is appended after the url key
   */
  url_suffix?: Maybe<Scalars["String"]["output"]>;
  $on: $CategoryInterface;
}

/**
 * Contains details about the products assigned to a category.
 */
export interface CategoryProducts {
  __typename?: "CategoryProducts";
  /**
   * An array of products that are assigned to the category.
   */
  items?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * Pagination metadata.
   */
  page_info?: Maybe<SearchResultPageInfo>;
  /**
   * The number of products in the category that are marked as visible. By default, in complex products, parent products are visible, but their child products are not.
   */
  total_count?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * Contains a collection of `CategoryTree` objects and pagination information.
 */
export interface CategoryResult {
  __typename?: "CategoryResult";
  /**
   * A list of categories that match the filter criteria.
   */
  items?: Maybe<Array<Maybe<CategoryTree>>>;
  /**
   * An object that includes the `page_info` and `currentPage` values specified in the query.
   */
  page_info?: Maybe<SearchResultPageInfo>;
  /**
   * The total number of categories that match the criteria.
   */
  total_count?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * Contains the hierarchy of categories.
 */
export interface CategoryTree {
  __typename?: "CategoryTree";
  available_sort_by?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * An array of breadcrumb items.
   */
  breadcrumbs?: Maybe<Array<Maybe<Breadcrumb>>>;
  /**
   * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Categories' is enabled.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * A tree of child categories.
   */
  children?: Maybe<Array<Maybe<CategoryTree>>>;
  children_count?: Maybe<Scalars["String"]["output"]>;
  /**
   * Contains a category CMS block.
   */
  cms_block?: Maybe<CmsBlock>;
  /**
   * The timestamp indicating when the category was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  custom_layout_update_file?: Maybe<Scalars["String"]["output"]>;
  /**
   * The attribute to use for sorting.
   */
  default_sort_by?: Maybe<Scalars["String"]["output"]>;
  /**
   * An optional description of the category.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  display_mode?: Maybe<Scalars["String"]["output"]>;
  filter_price_range?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An ID that uniquely identifies the category.
   * @deprecated Use `uid` instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  image?: Maybe<Scalars["String"]["output"]>;
  include_in_menu?: Maybe<Scalars["Int"]["output"]>;
  is_anchor?: Maybe<Scalars["Int"]["output"]>;
  is_on_home?: Maybe<Scalars["Int"]["output"]>;
  landing_page?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The depth of the category within the tree.
   */
  level?: Maybe<Scalars["Int"]["output"]>;
  meta_description?: Maybe<Scalars["String"]["output"]>;
  meta_keywords?: Maybe<Scalars["String"]["output"]>;
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The display name of the category.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The full category path.
   */
  path?: Maybe<Scalars["String"]["output"]>;
  /**
   * The category path within the store.
   */
  path_in_store?: Maybe<Scalars["String"]["output"]>;
  /**
   * The position of the category relative to other categories at the same level in tree.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The number of products in the category that are marked as visible. By default, in complex products, parent products are visible, but their child products are not.
   */
  product_count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The list of products assigned to the category.
   */
  products: (args?: {
    /**
     * The page of results to return. The default value is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default value is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The attributes to sort on, and whether to return the results in ascending or descending order.
     */
    sort?: Maybe<ProductAttributeSortInput>;
  }) => Maybe<CategoryProducts>;
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
  /**
   * The unique ID for a `CategoryInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * The timestamp indicating when the category was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * The URL key assigned to the category.
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * The URL path assigned to the category.
   */
  url_path?: Maybe<Scalars["String"]["output"]>;
  /**
   * The part of the category URL that is appended after the url key
   */
  url_suffix?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Defines details about an individual checkout agreement.
 */
export interface CheckoutAgreement {
  __typename?: "CheckoutAgreement";
  /**
   * The ID for a checkout agreement.
   */
  agreement_id?: Scalars["Int"]["output"];
  /**
   * The checkbox text for the checkout agreement.
   */
  checkbox_text?: Scalars["String"]["output"];
  /**
   * Required. The text of the agreement.
   */
  content?: Scalars["String"]["output"];
  /**
   * The height of the text box where the Terms and Conditions statement appears during checkout.
   */
  content_height?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the `content` text is in HTML format.
   */
  is_html?: Scalars["Boolean"]["output"];
  /**
   * Indicates whether agreements are accepted automatically or manually.
   */
  mode?: CheckoutAgreementMode;
  /**
   * The name given to the condition.
   */
  name?: Scalars["String"]["output"];
}

/**
 * An error encountered while adding an item to the cart.
 */
export interface CheckoutUserInputError {
  __typename?: "CheckoutUserInputError";
  /**
   * An error code that is specific to Checkout.
   */
  code?: CheckoutUserInputErrorCodes;
  /**
   * A localized error message.
   */
  message?: Scalars["String"]["output"];
  /**
   * The path to the input field that caused an error. See the GraphQL specification about path errors for details: http://spec.graphql.org/draft/#sec-Errors
   */
  path?: Array<Maybe<Scalars["String"]["output"]>>;
}

/**
 * Contains details about a specific CMS block.
 */
export interface CmsBlock {
  __typename?: "CmsBlock";
  /**
   * The content of the CMS block in raw HTML.
   */
  content?: Maybe<Scalars["String"]["output"]>;
  /**
   * The CMS block identifier.
   */
  identifier?: Maybe<Scalars["String"]["output"]>;
  /**
   * The title assigned to the CMS block.
   */
  title?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains an array CMS block items.
 */
export interface CmsBlocks {
  __typename?: "CmsBlocks";
  /**
   * An array of CMS blocks.
   */
  items?: Maybe<Array<Maybe<CmsBlock>>>;
}

/**
 * Contains details about a CMS page.
 */
export interface CmsPage {
  __typename?: "CmsPage";
  /**
   * The content of the CMS page in raw HTML.
   */
  content?: Maybe<Scalars["String"]["output"]>;
  /**
   * The heading that displays at the top of the CMS page.
   */
  content_heading?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID of a CMS page.
   */
  identifier?: Maybe<Scalars["String"]["output"]>;
  /**
   * A brief description of the page for search results listings.
   */
  meta_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * A brief description of the page for search results listings.
   */
  meta_keywords?: Maybe<Scalars["String"]["output"]>;
  /**
   * A page title that is indexed by search engines and appears in search results listings.
   */
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The design layout of the page, indicating the number of columns and navigation features used on the page.
   */
  page_layout?: Maybe<Scalars["String"]["output"]>;
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The name that appears in the breadcrumb trail navigation and in the browser title bar and tab.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
  /**
   * The URL key of the CMS page, which is often based on the `content_heading`.
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
}

export interface ColorSwatchData {
  __typename?: "ColorSwatchData";
  /**
   * The value can be represented as color (HEX code), image link, or text.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains an attribute code that is used for product comparisons.
 */
export interface ComparableAttribute {
  __typename?: "ComparableAttribute";
  /**
   * An attribute code that is enabled for product comparisons.
   */
  code?: Scalars["String"]["output"];
  /**
   * The label of the attribute code.
   */
  label?: Scalars["String"]["output"];
}

/**
 * Defines an object used to iterate through items for product comparisons.
 */
export interface ComparableItem {
  __typename?: "ComparableItem";
  /**
   * An array of product attributes that can be used to compare products.
   */
  attributes: Array<Maybe<ProductAttribute>>;
  /**
   * Details about a product in a compare list.
   */
  product: ProductInterface;
  /**
   * The unique ID of an item in a compare list.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains iterable information such as the array of items, the count, and attributes that represent the compare list.
 */
export interface CompareList {
  __typename?: "CompareList";
  /**
   * An array of attributes that can be used for comparing products.
   */
  attributes?: Maybe<Array<Maybe<ComparableAttribute>>>;
  /**
   * The number of items in the compare list.
   */
  item_count?: Scalars["Int"]["output"];
  /**
   * An array of products to compare.
   */
  items?: Maybe<Array<Maybe<ComparableItem>>>;
  /**
   * The unique ID assigned to the compare list.
   */
  uid?: Scalars["ID"]["output"];
}

export interface ComplexTextValue {
  __typename?: "ComplexTextValue";
  /**
   * Text that can contain HTML tags.
   */
  html?: Scalars["String"]["output"];
}

/**
 * Contains details about a configurable product attribute option.
 */
export interface ConfigurableAttributeOption {
  __typename?: "ConfigurableAttributeOption";
  /**
   * The ID assigned to the attribute.
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * A string that describes the configurable attribute option.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `ConfigurableAttributeOption` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * A unique index number assigned to the configurable product option.
   */
  value_index?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * An implementation for configurable product cart items.
 */
export interface ConfigurableCartItem {
  __typename?: "ConfigurableCartItem";
  /**
   * An array containing the configuranle options the shopper selected.
   */
  configurable_options: Array<Maybe<SelectedConfigurableOption>>;
  /**
   * Product details of the cart item.
   */
  configured_variant: ProductInterface;
  /**
   * An array containing the customizable options the shopper selected.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * An array of errors encountered while loading the cart item
   */
  errors?: Maybe<Array<Maybe<CartItemError>>>;
  /**
   * The entered gift message for the cart item
   */
  gift_message?: Maybe<GiftMessage>;
  /**
   * @deprecated Use `uid` instead.
   */
  id?: Scalars["String"]["output"];
  /**
   * True if requested quantity is less than available stock, false otherwise.
   */
  is_available?: Scalars["Boolean"]["output"];
  /**
   * Contains details about the price of the item, including taxes and discounts.
   */
  prices?: Maybe<CartItemPrices>;
  /**
   * Details about an item in the cart.
   */
  product: ProductInterface;
  /**
   * The quantity of this item in the cart.
   */
  quantity?: Scalars["Float"]["output"];
  /**
   * The unique ID for a `CartItemInterface` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Describes configurable options that have been selected and can be selected as a result of the previous selections.
 */
export interface ConfigurableOptionAvailableForSelection {
  __typename?: "ConfigurableOptionAvailableForSelection";
  /**
   * An attribute code that uniquely identifies a configurable option.
   */
  attribute_code?: Scalars["String"]["output"];
  /**
   * An array of selectable option value IDs.
   */
  option_value_uids?: Array<Maybe<Scalars["ID"]["output"]>>;
}

/**
 * Defines basic features of a configurable product and its simple product variants.
 */
export interface ConfigurableProduct {
  __typename?: "ConfigurableProduct";
  /**
   * The attribute set assigned to the product.
   * @deprecated The field should not be used on the storefront.
   */
  attribute_set_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The categories assigned to a product.
   */
  categories?: Maybe<Array<Maybe<CategoryInterface>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  color?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of options for the configurable product.
   */
  configurable_options?: Maybe<Array<Maybe<ConfigurableProductOptions>>>;
  /**
   * An array of media gallery items and other details about selected configurable product options as well as details about remaining selectable options.
   */
  configurable_product_options_selection: (args?: {
    configurableOptionValueUids?: Maybe<Array<Scalars["ID"]["input"]>>;
  }) => Maybe<ConfigurableProductOptionsSelection>;
  /**
   * The product's country of origin.
   */
  country_of_manufacture?: Maybe<Scalars["String"]["output"]>;
  /**
   * Timestamp indicating when the product was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Crosssell Products
   */
  crosssell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * Product custom attributes.
   */
  custom_attributesV2: (args?: {
    filters?: Maybe<AttributeFilterInput>;
  }) => Maybe<ProductCustomAttributes>;
  /**
   * Detailed information about the product. The value can include simple HTML tags.
   */
  description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  figure_size?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether a gift message is available.
   */
  gift_message_available?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID number assigned to the product.
   * @deprecated Use the `uid` field instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the main image on the product page.
   */
  image?: Maybe<ProductImage>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  is_suggested?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number representing the product's manufacturer.
   * @deprecated Use the `custom_attributes` field instead.
   */
  manufacturer?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  match_collezione2?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of media gallery objects.
   */
  media_gallery?: Maybe<Array<Maybe<MediaGalleryInterface>>>;
  /**
   * An array of MediaGalleryEntry objects.
   * @deprecated Use `media_gallery` instead.
   */
  media_gallery_entries?: Maybe<Array<Maybe<MediaGalleryEntry>>>;
  /**
   * A brief overview of the product for search results listings, maximum 255 characters.
   */
  meta_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * A comma-separated list of keywords that are visible only to search engines.
   */
  meta_keyword?: Maybe<Scalars["String"]["output"]>;
  /**
   * A string that is displayed in the title bar and tab of the browser and in search results lists.
   */
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The product name. Customers use this name to identify the product.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The beginning date for new product listings, and determines if the product is featured as a new product.
   */
  new_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The end date for new product listings.
   */
  new_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Product stock only x left count
   */
  only_x_left_in_stock?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of options for a customizable product.
   */
  options?: Maybe<Array<Maybe<CustomizableOptionInterface>>>;
  /**
   * If the product has multiple options, determines where they appear on the product page.
   */
  options_container?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates the price of an item.
   * @deprecated Use `price_range` for product price information.
   */
  price?: Maybe<ProductPrices>;
  /**
   * The range of prices for the product
   */
  price_range: PriceRange;
  /**
   * An array of `TierPrice` objects.
   */
  price_tiers?: Maybe<Array<Maybe<TierPrice>>>;
  /**
   * An array of `ProductLinks` objects.
   */
  product_links?: Maybe<Array<Maybe<ProductLinksInterface>>>;
  /**
   * The average of all the ratings given to the product.
   */
  rating_summary?: Scalars["Float"]["output"];
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * An array of products to be displayed in a Related Products block.
   */
  related_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The total count of all the reviews given to the product.
   */
  review_count?: Scalars["Int"]["output"];
  /**
   * The list of products reviews.
   */
  reviews: (args?: {
    /**
     * The page of results to return. The default is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => ProductReviews;
  /**
   * A short description of the product. Its use depends on the theme.
   */
  short_description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  size?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number or code assigned to a product to identify the product, options, price, and manufacturer.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The relative path to the small image, which is used on catalog pages.
   */
  small_image?: Maybe<ProductImage>;
  /**
   * The beginning date that a product has a special price.
   * @deprecated The field should not be used on the storefront.
   */
  special_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The discounted price of the product.
   */
  special_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The end date for a product with a special price.
   */
  special_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Stock status of the product
   */
  stock_status?: Maybe<ProductStockStatus>;
  /**
   * The file name of a swatch image.
   */
  swatch_image?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tema?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the product's thumbnail image.
   */
  thumbnail?: Maybe<ProductImage>;
  /**
   * The price when tier pricing is in effect and the items purchased threshold has been reached.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of ProductTierPrices objects.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_prices?: Maybe<Array<Maybe<ProductTierPrices>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tipologia?: Maybe<Scalars["Int"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
  /**
   * One of simple, virtual, bundle, downloadable, grouped, or configurable.
   * @deprecated Use `__typename` instead.
   */
  type_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `ProductInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * Timestamp indicating when the product was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Upsell Products
   */
  upsell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The part of the URL that identifies the product
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use product's `canonical_url` or url rewrites instead
   */
  url_path?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL rewrites list
   */
  url_rewrites?: Maybe<Array<Maybe<UrlRewrite>>>;
  /**
   * The part of the product URL that is appended after the url key
   */
  url_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An array of simple product variants.
   */
  variants?: Maybe<Array<Maybe<ConfigurableVariant>>>;
  /**
   * An array of websites in which the product is available.
   * @deprecated The field should not be used on the storefront.
   */
  websites?: Maybe<Array<Maybe<Website>>>;
  /**
   * The weight of the item, in units defined by the store.
   */
  weight?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Contains details about configurable product options.
 */
export interface ConfigurableProductOption {
  __typename?: "ConfigurableProductOption";
  /**
   * An attribute code that uniquely identifies a configurable option.
   */
  attribute_code?: Scalars["String"]["output"];
  /**
   * The display name of the option.
   */
  label?: Scalars["String"]["output"];
  /**
   * The unique ID of the configurable option.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An array of values that are applicable for this option.
   */
  values?: Maybe<Array<Maybe<ConfigurableProductOptionValue>>>;
}

/**
 * Defines a value for a configurable product option.
 */
export interface ConfigurableProductOptionValue {
  __typename?: "ConfigurableProductOptionValue";
  /**
   * Indicates whether the product is available with this selected option.
   */
  is_available?: Scalars["Boolean"]["output"];
  /**
   * Indicates whether the value is the default.
   */
  is_use_default?: Scalars["Boolean"]["output"];
  /**
   * The display name of the value.
   */
  label?: Scalars["String"]["output"];
  /**
   * The URL assigned to the thumbnail of the swatch image.
   */
  swatch?: Maybe<SwatchDataInterface>;
  /**
   * The unique ID of the value.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Defines configurable attributes for the specified product.
 */
export interface ConfigurableProductOptions {
  __typename?: "ConfigurableProductOptions";
  /**
   * A string that identifies the attribute.
   */
  attribute_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID assigned to the attribute.
   * @deprecated Use `attribute_uid` instead.
   */
  attribute_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID assigned to the attribute.
   * @deprecated Use `attribute_uid` instead.
   */
  attribute_id_v2?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The unique ID for an `Attribute` object.
   */
  attribute_uid?: Scalars["ID"]["output"];
  /**
   * The configurable option ID number assigned by the system.
   * @deprecated Use `uid` instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A displayed string that describes the configurable product option.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * A number that indicates the order in which the attribute is displayed.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * This is the same as a product's `id` field.
   * @deprecated `product_id` is not needed and can be obtained from its parent.
   */
  product_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The unique ID for a `ConfigurableProductOptions` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * Indicates whether the option is the default.
   */
  use_default?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * An array that defines the `value_index` codes assigned to the configurable product.
   */
  values?: Maybe<Array<Maybe<ConfigurableProductOptionsValues>>>;
}

/**
 * Contains metadata corresponding to the selected configurable options.
 */
export interface ConfigurableProductOptionsSelection {
  __typename?: "ConfigurableProductOptionsSelection";
  /**
   * An array of all possible configurable options.
   */
  configurable_options?: Maybe<Array<Maybe<ConfigurableProductOption>>>;
  /**
   * Product images and videos corresponding to the specified configurable options selection.
   */
  media_gallery?: Maybe<Array<Maybe<MediaGalleryInterface>>>;
  /**
   * The configurable options available for further selection based on the current selection.
   */
  options_available_for_selection?: Maybe<Array<Maybe<ConfigurableOptionAvailableForSelection>>>;
  /**
   * A variant represented by the specified configurable options selection. The value is expected to be null until selections are made for each configurable option.
   */
  variant?: Maybe<SimpleProduct>;
}

/**
 * Contains the index number assigned to a configurable product option.
 */
export interface ConfigurableProductOptionsValues {
  __typename?: "ConfigurableProductOptionsValues";
  /**
   * The label of the product on the default store.
   */
  default_label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The label of the product.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The label of the product on the current store.
   */
  store_label?: Maybe<Scalars["String"]["output"]>;
  /**
   * Swatch data for a configurable product option.
   */
  swatch_data?: Maybe<SwatchDataInterface>;
  /**
   * The unique ID for a `ConfigurableProductOptionsValues` object.
   */
  uid?: Maybe<Scalars["ID"]["output"]>;
  /**
   * Indicates whether to use the default_label.
   */
  use_default_value?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * A unique index number assigned to the configurable product option.
   * @deprecated Use `uid` instead.
   */
  value_index?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * Contains all the simple product variants of a configurable product.
 */
export interface ConfigurableVariant {
  __typename?: "ConfigurableVariant";
  /**
   * An array of configurable attribute options.
   */
  attributes?: Maybe<Array<Maybe<ConfigurableAttributeOption>>>;
  /**
   * An array of linked simple products.
   */
  product?: Maybe<SimpleProduct>;
}

/**
 * A configurable product wish list item.
 */
export interface ConfigurableWishlistItem {
  __typename?: "ConfigurableWishlistItem";
  /**
   * The date and time the item was added to the wish list.
   */
  added_at?: Scalars["String"]["output"];
  /**
   * The SKU of the simple product corresponding to a set of selected configurable options.
   * @deprecated Use `ConfigurableWishlistItem.configured_variant.sku` instead.
   */
  child_sku?: Scalars["String"]["output"];
  /**
   * An array of selected configurable options.
   */
  configurable_options?: Maybe<Array<Maybe<SelectedConfigurableOption>>>;
  /**
   * Product details of the selected variant. The value is null if some options are not configured.
   */
  configured_variant?: Maybe<ProductInterface>;
  /**
   * Custom options selected for the wish list item.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * The description of the item.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `WishlistItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Product details of the wish list item.
   */
  product?: Maybe<ProductInterface>;
  /**
   * The quantity of this wish list item.
   */
  quantity?: Scalars["Float"]["output"];
}

/**
 * Contains the status of the request.
 */
export interface ContactUsOutput {
  __typename?: "ContactUsOutput";
  /**
   * Indicates whether the request was successful.
   */
  status?: Scalars["Boolean"]["output"];
}

export interface Country {
  __typename?: "Country";
  /**
   * An array of regions within a particular country.
   */
  available_regions?: Maybe<Array<Maybe<Region>>>;
  /**
   * The name of the country in English.
   */
  full_name_english?: Maybe<Scalars["String"]["output"]>;
  /**
   * The name of the country in the current locale.
   */
  full_name_locale?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `Country` object.
   */
  id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The three-letter abbreviation of the country, such as USA.
   */
  three_letter_abbreviation?: Maybe<Scalars["String"]["output"]>;
  /**
   * The two-letter abbreviation of the country, such as US.
   */
  two_letter_abbreviation?: Maybe<Scalars["String"]["output"]>;
}

export interface CreateGuestCartOutput {
  __typename?: "CreateGuestCartOutput";
  /**
   * The newly created cart.
   */
  cart?: Maybe<Cart>;
}

/**
 * Contains the secure information used to authorize transaction. Applies to Payflow Pro and Payments Pro payment methods.
 */
export interface CreatePayflowProTokenOutput {
  __typename?: "CreatePayflowProTokenOutput";
  /**
   * The RESPMSG returned by PayPal. If the `result` is `0`, then `response_message` is `Approved`.
   */
  response_message?: Scalars["String"]["output"];
  /**
   * A non-zero value if any errors occurred.
   */
  result?: Scalars["Int"]["output"];
  /**
   * The RESULT returned by PayPal. A value of `0` indicates the transaction was approved.
   */
  result_code?: Scalars["Int"]["output"];
  /**
   * A secure token generated by PayPal.
   */
  secure_token?: Scalars["String"]["output"];
  /**
   * A secure token ID generated by PayPal.
   */
  secure_token_id?: Scalars["String"]["output"];
}

/**
 * Contains payment order details that are used while processing the payment order
 */
export interface CreatePaymentOrderOutput {
  __typename?: "CreatePaymentOrderOutput";
  /**
   * The amount of the payment order
   */
  amount?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The currency of the payment order
   */
  currency_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * PayPal order ID
   */
  id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The order ID generated by Payment Services
   */
  mp_order_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The status of the payment order
   */
  status?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains the completed product review.
 */
export interface CreateProductReviewOutput {
  __typename?: "CreateProductReviewOutput";
  /**
   * Product review details.
   */
  review: ProductReview;
}

/**
 * The vault token id and information about the payment source
 */
export interface CreateVaultCardPaymentTokenOutput {
  __typename?: "CreateVaultCardPaymentTokenOutput";
  /**
   * The payment source information
   */
  payment_source: PaymentSourceOutput;
  /**
   * The vault payment token information
   */
  vault_token_id?: Scalars["String"]["output"];
}

/**
 * The setup token id information
 */
export interface CreateVaultCardSetupTokenOutput {
  __typename?: "CreateVaultCardSetupTokenOutput";
  /**
   * The setup token id
   */
  setup_token?: Scalars["String"]["output"];
}

/**
 * Contains credit memo details.
 */
export interface CreditMemo {
  __typename?: "CreditMemo";
  /**
   * Comments on the credit memo.
   */
  comments?: Maybe<Array<Maybe<SalesCommentItem>>>;
  /**
   * The unique ID for a `CreditMemo` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * An array containing details about refunded items.
   */
  items?: Maybe<Array<Maybe<CreditMemoItemInterface>>>;
  /**
   * The sequential credit memo number.
   */
  number?: Scalars["String"]["output"];
  /**
   * Details about the total refunded amount.
   */
  total?: Maybe<CreditMemoTotal>;
}

export interface CreditMemoItem {
  __typename?: "CreditMemoItem";
  /**
   * Details about the final discount amount for the base product, including discounts on options.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The unique ID for a `CreditMemoItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The order item the credit memo is applied to.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product, including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of refunded items.
   */
  quantity_refunded?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Credit memo item details.
 */
export interface CreditMemoItemInterface {
  __typename?: "BundleCreditMemoItem" | "CreditMemoItem" | "DownloadableCreditMemoItem";
  /**
   * Details about the final discount amount for the base product, including discounts on options.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The unique ID for a `CreditMemoItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The order item the credit memo is applied to.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product, including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of refunded items.
   */
  quantity_refunded?: Maybe<Scalars["Float"]["output"]>;
  $on: $CreditMemoItemInterface;
}

/**
 * Contains credit memo price details.
 */
export interface CreditMemoTotal {
  __typename?: "CreditMemoTotal";
  /**
   * An adjustment manually applied to the order.
   */
  adjustment: Money;
  /**
   * The final base grand total amount in the base currency.
   */
  base_grand_total: Money;
  /**
   * The applied discounts to the credit memo.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The final total amount, including shipping, discounts, and taxes.
   */
  grand_total: Money;
  /**
   * Details about the shipping and handling costs for the credit memo.
   */
  shipping_handling?: Maybe<ShippingHandling>;
  /**
   * The subtotal of the invoice, excluding shipping, discounts, and taxes.
   */
  subtotal: Money;
  /**
   * The credit memo tax details.
   */
  taxes?: Maybe<Array<Maybe<TaxItem>>>;
  /**
   * The shipping amount for the credit memo.
   */
  total_shipping: Money;
  /**
   * The amount of tax applied to the credit memo.
   */
  total_tax: Money;
}

export interface Currency {
  __typename?: "Currency";
  /**
   * An array of three-letter currency codes accepted by the store, such as USD and EUR.
   */
  available_currency_codes?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * The base currency set for the store, such as USD.
   */
  base_currency_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The symbol for the specified base currency, such as $.
   */
  base_currency_symbol?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Symbol was missed. Use `default_display_currency_code`.
   */
  default_display_currecy_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Symbol was missed. Use `default_display_currency_code`.
   */
  default_display_currecy_symbol?: Maybe<Scalars["String"]["output"]>;
  /**
   * The currency that is displayed by default, such as USD.
   */
  default_display_currency_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The currency symbol that is displayed by default, such as $.
   */
  default_display_currency_symbol?: Maybe<Scalars["String"]["output"]>;
  /**
   * An array of exchange rates for currencies defined in the store.
   */
  exchange_rates?: Maybe<Array<Maybe<ExchangeRate>>>;
}

/**
 * Defines an array of custom attributes.
 */
export interface CustomAttributeMetadata {
  __typename?: "CustomAttributeMetadata";
  /**
   * An array of attributes.
   */
  items?: Maybe<Array<Maybe<Attribute>>>;
}

/**
 * An interface containing fields that define the EAV attribute.
 */
export interface CustomAttributeMetadataInterface {
  __typename?: "AttributeMetadata" | "CatalogAttributeMetadata" | "CustomerAttributeMetadata";
  /**
   * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
   */
  code?: Scalars["ID"]["output"];
  /**
   * Default attribute value.
   */
  default_value?: Maybe<Scalars["String"]["output"]>;
  /**
   * The type of entity that defines the attribute.
   */
  entity_type?: AttributeEntityTypeEnum;
  /**
   * The frontend class of the attribute.
   */
  frontend_class?: Maybe<Scalars["String"]["output"]>;
  /**
   * The frontend input type of the attribute.
   */
  frontend_input?: Maybe<AttributeFrontendInputEnum>;
  /**
   * Whether the attribute value is required.
   */
  is_required?: Scalars["Boolean"]["output"];
  /**
   * Whether the attribute value must be unique.
   */
  is_unique?: Scalars["Boolean"]["output"];
  /**
   * The label assigned to the attribute.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * Attribute options.
   */
  options: Array<Maybe<CustomAttributeOptionInterface>>;
  $on: $CustomAttributeMetadataInterface;
}

export interface CustomAttributeOptionInterface {
  __typename?: "AttributeOptionMetadata";
  /**
   * Is the option value default.
   */
  is_default?: Scalars["Boolean"]["output"];
  /**
   * The label assigned to the attribute option.
   */
  label?: Scalars["String"]["output"];
  /**
   * The attribute option value.
   */
  value?: Scalars["String"]["output"];
  $on: $CustomAttributeOptionInterface;
}

/**
 * Defines the customer name, addresses, and other details.
 */
export interface Customer {
  __typename?: "Customer";
  /**
   * An array containing the customer's shipping and billing addresses.
   */
  addresses?: Maybe<Array<Maybe<CustomerAddress>>>;
  /**
   * Indicates whether the customer has enabled remote shopping assistance.
   */
  allow_remote_shopping_assistance?: Scalars["Boolean"]["output"];
  /**
   * The contents of the customer's compare list.
   */
  compare_list?: Maybe<CompareList>;
  /**
   * The customer's confirmation status.
   */
  confirmation_status?: ConfirmationStatusEnum;
  /**
   * Timestamp indicating when the account was created.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Customer's custom attributes.
   */
  custom_attributes: (args?: {
    attributeCodes?: Maybe<Array<Scalars["ID"]["input"]>>;
  }) => Maybe<Array<Maybe<AttributeValueInterface>>>;
  /**
   * The customer's date of birth.
   */
  date_of_birth?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID assigned to the billing address.
   */
  default_billing?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID assigned to the shipping address.
   */
  default_shipping?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's date of birth.
   * @deprecated Use `date_of_birth` instead.
   */
  dob?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's email address. Required.
   */
  email?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's first name.
   */
  firstname?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's gender (Male - 1, Female - 2).
   */
  gender?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated Customer group should not be exposed in the storefront scenarios.
   */
  group_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The ID assigned to the customer.
   * @deprecated `id` is not needed as part of `Customer`, because on the server side, it can be identified based on the customer token used for authentication. There is no need to know customer ID on the client side.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether the customer is subscribed to the company's newsletter.
   */
  is_subscribed?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The customer's family name.
   */
  lastname?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's middle name.
   */
  middlename?: Maybe<Scalars["String"]["output"]>;
  orders: (args?: {
    /**
     * Specifies which page of results to return. The default value is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * Defines the filter to use for searching customer orders.
     */
    filter?: Maybe<CustomerOrdersFilterInput>;
    /**
     * Specifies the maximum number of results to return at once. The default value is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
    /**
     * Specifies the scope to search for customer orders. The Store request header identifies the customer's store view code. The default value of STORE limits the search to the value specified in the header. Specify WEBSITE to expand the search to include all customer orders assigned to the website that is defined in the header, or specify GLOBAL to include all customer orders across all websites and stores.
     */
    scope?: Maybe<ScopeTypeEnum>;
    /**
     * Specifies which field to sort on, and whether to return the results in ascending or descending order.
     */
    sort?: Maybe<CustomerOrderSortInput>;
  }) => Maybe<CustomerOrders>;
  /**
   * An honorific, such as Dr., Mr., or Mrs.
   */
  prefix?: Maybe<Scalars["String"]["output"]>;
  /**
   * Contains the customer's product reviews.
   */
  reviews: (args?: {
    /**
     * The page of results to return. The default value is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default value is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => ProductReviews;
  /**
   * A value such as Sr., Jr., or III.
   */
  suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's Value-added tax (VAT) number (for corporate customers).
   */
  taxvat?: Maybe<Scalars["String"]["output"]>;
  /**
   * Return a customer's wish lists.
   * @deprecated Use `Customer.wishlists` or `Customer.wishlist_v2` instead.
   */
  wishlist: Wishlist;
  /**
   * Retrieve the wish list identified by the unique ID for a `Wishlist` object.
   */
  wishlist_v2: (args: { id: Scalars["ID"]["input"] }) => Maybe<Wishlist>;
  /**
   * An array of wishlists. In Magento Open Source, customers are limited to one wish list. The number of wish lists is configurable for Adobe Commerce.
   */
  wishlists: (args?: {
    /**
     * Specifies which page of results to return. The default value is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * Specifies the maximum number of results to return at once. This attribute is optional.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => Array<Maybe<Wishlist>>;
}

/**
 * Contains detailed information about a customer's billing or shipping address.
 */
export interface CustomerAddress {
  __typename?: "CustomerAddress";
  /**
   * The customer's city or town.
   */
  city?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's company.
   */
  company?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's country.
   */
  country_code?: Maybe<CountryCodeEnum>;
  /**
   * The customer's country.
   * @deprecated Use `country_code` instead.
   */
  country_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use custom_attributesV2 instead.
   */
  custom_attributes?: Maybe<Array<Maybe<CustomerAddressAttribute>>>;
  /**
   * Custom attributes assigned to the customer address.
   */
  custom_attributesV2: (args?: {
    attributeCodes?: Maybe<Array<Scalars["ID"]["input"]>>;
  }) => Array<Maybe<AttributeValueInterface>>;
  /**
   * The customer ID
   * @deprecated `customer_id` is not needed as part of `CustomerAddress`. The `id` is a unique identifier for the addresses.
   */
  customer_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether the address is the customer's default billing address.
   */
  default_billing?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the address is the customer's default shipping address.
   */
  default_shipping?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Contains any extension attributes for the address.
   */
  extension_attributes?: Maybe<Array<Maybe<CustomerAddressAttribute>>>;
  /**
   * The customer's fax number.
   */
  fax?: Maybe<Scalars["String"]["output"]>;
  /**
   * The first name of the person associated with the shipping/billing address.
   */
  firstname?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID of a `CustomerAddress` object.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The family name of the person associated with the shipping/billing address.
   */
  lastname?: Maybe<Scalars["String"]["output"]>;
  /**
   * The middle name of the person associated with the shipping/billing address.
   */
  middlename?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's ZIP or postal code.
   */
  postcode?: Maybe<Scalars["String"]["output"]>;
  /**
   * An honorific, such as Dr., Mr., or Mrs.
   */
  prefix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An object containing the region name, region code, and region ID.
   */
  region?: Maybe<CustomerAddressRegion>;
  /**
   * The unique ID for a pre-defined region.
   */
  region_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of strings that define the street number and name.
   */
  street?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * A value such as Sr., Jr., or III.
   */
  suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's telephone number.
   */
  telephone?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's Value-added tax (VAT) number (for corporate customers).
   */
  vat_id?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Specifies the attribute code and value of a customer address attribute.
 */
export interface CustomerAddressAttribute {
  __typename?: "CustomerAddressAttribute";
  /**
   * The name assigned to the customer address attribute.
   */
  attribute_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The value assigned to the customer address attribute.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Defines the customer's state or province.
 */
export interface CustomerAddressRegion {
  __typename?: "CustomerAddressRegion";
  /**
   * The state or province name.
   */
  region?: Maybe<Scalars["String"]["output"]>;
  /**
   * The address region code.
   */
  region_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a pre-defined region.
   */
  region_id?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * Customer attribute metadata.
 */
export interface CustomerAttributeMetadata {
  __typename?: "CustomerAttributeMetadata";
  /**
   * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
   */
  code?: Scalars["ID"]["output"];
  /**
   * Default attribute value.
   */
  default_value?: Maybe<Scalars["String"]["output"]>;
  /**
   * The type of entity that defines the attribute.
   */
  entity_type?: AttributeEntityTypeEnum;
  /**
   * The frontend class of the attribute.
   */
  frontend_class?: Maybe<Scalars["String"]["output"]>;
  /**
   * The frontend input type of the attribute.
   */
  frontend_input?: Maybe<AttributeFrontendInputEnum>;
  /**
   * The template used for the input of the attribute (e.g., 'date').
   */
  input_filter?: Maybe<InputFilterEnum>;
  /**
   * Whether the attribute value is required.
   */
  is_required?: Scalars["Boolean"]["output"];
  /**
   * Whether the attribute value must be unique.
   */
  is_unique?: Scalars["Boolean"]["output"];
  /**
   * The label assigned to the attribute.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The number of lines of the attribute value.
   */
  multiline_count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Attribute options.
   */
  options: Array<Maybe<CustomAttributeOptionInterface>>;
  /**
   * The position of the attribute in the form.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The validation rules of the attribute value.
   */
  validate_rules?: Maybe<Array<Maybe<ValidationRule>>>;
}

/**
 * Contains details about a single downloadable product.
 */
export interface CustomerDownloadableProduct {
  __typename?: "CustomerDownloadableProduct";
  /**
   * The date and time the purchase was made.
   */
  date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The fully qualified URL to the download file.
   */
  download_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID assigned to the item.
   */
  order_increment_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The remaining number of times the customer can download the product.
   */
  remaining_downloads?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates when the product becomes available for download. Options are `Pending` and `Invoiced`.
   */
  status?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains a list of downloadable products.
 */
export interface CustomerDownloadableProducts {
  __typename?: "CustomerDownloadableProducts";
  /**
   * An array of purchased downloadable items.
   */
  items?: Maybe<Array<Maybe<CustomerDownloadableProduct>>>;
}

/**
 * Contains details about each of the customer's orders.
 */
export interface CustomerOrder {
  __typename?: "CustomerOrder";
  /**
   * Coupons applied to the order.
   */
  applied_coupons: Array<Maybe<AppliedCoupon>>;
  /**
   * The billing address for the order.
   */
  billing_address?: Maybe<OrderAddress>;
  /**
   * The shipping carrier for the order delivery.
   */
  carrier?: Maybe<Scalars["String"]["output"]>;
  /**
   * Comments about the order.
   */
  comments?: Maybe<Array<Maybe<SalesCommentItem>>>;
  /**
   * @deprecated Use the `order_date` field instead.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * A list of credit memos.
   */
  credit_memos?: Maybe<Array<Maybe<CreditMemo>>>;
  /**
   * Order customer email.
   */
  email?: Maybe<Scalars["String"]["output"]>;
  /**
   * The entered gift message for the order
   */
  gift_message?: Maybe<GiftMessage>;
  /**
   * @deprecated Use the `totals.grand_total` field instead.
   */
  grand_total?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The unique ID for a `CustomerOrder` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * @deprecated Use the `id` field instead.
   */
  increment_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * A list of invoices for the order.
   */
  invoices: Array<Maybe<Invoice>>;
  /**
   * An array containing the items purchased in this order.
   */
  items?: Maybe<Array<Maybe<OrderItemInterface>>>;
  /**
   * The order number.
   */
  number?: Scalars["String"]["output"];
  /**
   * The date the order was placed.
   */
  order_date?: Scalars["String"]["output"];
  /**
   * @deprecated Use the `number` field instead.
   */
  order_number?: Scalars["String"]["output"];
  /**
   * Payment details for the order.
   */
  payment_methods?: Maybe<Array<Maybe<OrderPaymentMethod>>>;
  /**
   * A list of shipments for the order.
   */
  shipments?: Maybe<Array<Maybe<OrderShipment>>>;
  /**
   * The shipping address for the order.
   */
  shipping_address?: Maybe<OrderAddress>;
  /**
   * The delivery method for the order.
   */
  shipping_method?: Maybe<Scalars["String"]["output"]>;
  /**
   * The current status of the order.
   */
  status?: Scalars["String"]["output"];
  /**
   * The token that can be used to retrieve the order using order query.
   */
  token?: Scalars["String"]["output"];
  /**
   * Details about the calculated totals for this order.
   */
  total?: Maybe<OrderTotal>;
}

/**
 * The collection of orders that match the conditions defined in the filter.
 */
export interface CustomerOrders {
  __typename?: "CustomerOrders";
  /**
   * An array of customer orders.
   */
  items: Array<Maybe<CustomerOrder>>;
  /**
   * Contains pagination metadata.
   */
  page_info?: Maybe<SearchResultPageInfo>;
  /**
   * The total count of customer orders.
   */
  total_count?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * Contains details about a newly-created or updated customer.
 */
export interface CustomerOutput {
  __typename?: "CustomerOutput";
  /**
   * Customer details after creating or updating a customer.
   */
  customer: Customer;
}

/**
 * Contains payment tokens stored in the customer's vault.
 */
export interface CustomerPaymentTokens {
  __typename?: "CustomerPaymentTokens";
  /**
   * An array of payment tokens.
   */
  items: Array<Maybe<PaymentToken>>;
}

/**
 * Contains a customer authorization token.
 */
export interface CustomerToken {
  __typename?: "CustomerToken";
  /**
   * The customer authorization token.
   */
  token?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains information about a text area that is defined as part of a customizable option.
 */
export interface CustomizableAreaOption {
  __typename?: "CustomizableAreaOption";
  /**
   * Option ID.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The Stock Keeping Unit of the base product.
   */
  product_sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the option is required.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableOptionInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An object that defines a text area.
   */
  value?: Maybe<CustomizableAreaValue>;
}

/**
 * Defines the price and sku of a product whose page contains a customized text area.
 */
export interface CustomizableAreaValue {
  __typename?: "CustomizableAreaValue";
  /**
   * The maximum number of characters that can be entered for this customizable option.
   */
  max_characters?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The price assigned to this option.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * FIXED, PERCENT, or DYNAMIC.
   */
  price_type?: Maybe<PriceTypeEnum>;
  /**
   * The Stock Keeping Unit for this option.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableAreaValue` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains information about a set of checkbox values that are defined as part of a customizable option.
 */
export interface CustomizableCheckboxOption {
  __typename?: "CustomizableCheckboxOption";
  /**
   * Option ID.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether the option is required.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableOptionInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An array that defines a set of checkbox values.
   */
  value?: Maybe<Array<Maybe<CustomizableCheckboxValue>>>;
}

/**
 * Defines the price and sku of a product whose page contains a customized set of checkbox values.
 */
export interface CustomizableCheckboxValue {
  __typename?: "CustomizableCheckboxValue";
  /**
   * The ID assigned to the value.
   */
  option_type_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The price assigned to this option.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * FIXED, PERCENT, or DYNAMIC.
   */
  price_type?: Maybe<PriceTypeEnum>;
  /**
   * The Stock Keeping Unit for this option.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The order in which the checkbox value is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableCheckboxValue` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains information about a date picker that is defined as part of a customizable option.
 */
export interface CustomizableDateOption {
  __typename?: "CustomizableDateOption";
  /**
   * Option ID.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The Stock Keeping Unit of the base product.
   */
  product_sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the option is required.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableOptionInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An object that defines a date field in a customizable option.
   */
  value?: Maybe<CustomizableDateValue>;
}

/**
 * Defines the price and sku of a product whose page contains a customized date picker.
 */
export interface CustomizableDateValue {
  __typename?: "CustomizableDateValue";
  /**
   * The price assigned to this option.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * FIXED, PERCENT, or DYNAMIC.
   */
  price_type?: Maybe<PriceTypeEnum>;
  /**
   * The Stock Keeping Unit for this option.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * DATE, DATE_TIME or TIME
   */
  type?: Maybe<CustomizableDateTypeEnum>;
  /**
   * The unique ID for a `CustomizableDateValue` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains information about a drop down menu that is defined as part of a customizable option.
 */
export interface CustomizableDropDownOption {
  __typename?: "CustomizableDropDownOption";
  /**
   * Option ID.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether the option is required.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableOptionInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An array that defines the set of options for a drop down menu.
   */
  value?: Maybe<Array<Maybe<CustomizableDropDownValue>>>;
}

/**
 * Defines the price and sku of a product whose page contains a customized drop down menu.
 */
export interface CustomizableDropDownValue {
  __typename?: "CustomizableDropDownValue";
  /**
   * The ID assigned to the value.
   */
  option_type_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The price assigned to this option.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * FIXED, PERCENT, or DYNAMIC.
   */
  price_type?: Maybe<PriceTypeEnum>;
  /**
   * The Stock Keeping Unit for this option.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableDropDownValue` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains information about a text field that is defined as part of a customizable option.
 */
export interface CustomizableFieldOption {
  __typename?: "CustomizableFieldOption";
  /**
   * Option ID.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The Stock Keeping Unit of the base product.
   */
  product_sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the option is required.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableOptionInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An object that defines a text field.
   */
  value?: Maybe<CustomizableFieldValue>;
}

/**
 * Defines the price and sku of a product whose page contains a customized text field.
 */
export interface CustomizableFieldValue {
  __typename?: "CustomizableFieldValue";
  /**
   * The maximum number of characters that can be entered for this customizable option.
   */
  max_characters?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The price of the custom value.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * FIXED, PERCENT, or DYNAMIC.
   */
  price_type?: Maybe<PriceTypeEnum>;
  /**
   * The Stock Keeping Unit for this option.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableFieldValue` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains information about a file picker that is defined as part of a customizable option.
 */
export interface CustomizableFileOption {
  __typename?: "CustomizableFileOption";
  /**
   * Option ID.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The Stock Keeping Unit of the base product.
   */
  product_sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the option is required.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableOptionInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An object that defines a file value.
   */
  value?: Maybe<CustomizableFileValue>;
}

/**
 * Defines the price and sku of a product whose page contains a customized file picker.
 */
export interface CustomizableFileValue {
  __typename?: "CustomizableFileValue";
  /**
   * The file extension to accept.
   */
  file_extension?: Maybe<Scalars["String"]["output"]>;
  /**
   * The maximum width of an image.
   */
  image_size_x?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The maximum height of an image.
   */
  image_size_y?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The price assigned to this option.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * FIXED, PERCENT, or DYNAMIC.
   */
  price_type?: Maybe<PriceTypeEnum>;
  /**
   * The Stock Keeping Unit for this option.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableFileValue` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains information about a multiselect that is defined as part of a customizable option.
 */
export interface CustomizableMultipleOption {
  __typename?: "CustomizableMultipleOption";
  /**
   * Option ID.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether the option is required.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableOptionInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An array that defines the set of options for a multiselect.
   */
  value?: Maybe<Array<Maybe<CustomizableMultipleValue>>>;
}

/**
 * Defines the price and sku of a product whose page contains a customized multiselect.
 */
export interface CustomizableMultipleValue {
  __typename?: "CustomizableMultipleValue";
  /**
   * The ID assigned to the value.
   */
  option_type_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The price assigned to this option.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * FIXED, PERCENT, or DYNAMIC.
   */
  price_type?: Maybe<PriceTypeEnum>;
  /**
   * The Stock Keeping Unit for this option.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableMultipleValue` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains basic information about a customizable option. It can be implemented by several types of configurable options.
 */
export interface CustomizableOptionInterface {
  __typename?:
    | "CustomizableAreaOption"
    | "CustomizableCheckboxOption"
    | "CustomizableDateOption"
    | "CustomizableDropDownOption"
    | "CustomizableFieldOption"
    | "CustomizableFileOption"
    | "CustomizableMultipleOption"
    | "CustomizableRadioOption";
  /**
   * Option ID.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether the option is required.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableOptionInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  $on: $CustomizableOptionInterface;
}

/**
 * Contains information about customizable product options.
 */
export interface CustomizableProductInterface {
  __typename?:
    | "BundleProduct"
    | "ConfigurableProduct"
    | "DownloadableProduct"
    | "SimpleProduct"
    | "VirtualProduct";
  /**
   * An array of options for a customizable product.
   */
  options?: Maybe<Array<Maybe<CustomizableOptionInterface>>>;
  $on: $CustomizableProductInterface;
}

/**
 * Contains information about a set of radio buttons that are defined as part of a customizable option.
 */
export interface CustomizableRadioOption {
  __typename?: "CustomizableRadioOption";
  /**
   * Option ID.
   * @deprecated Use `uid` instead
   */
  option_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether the option is required.
   */
  required?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The order in which the option is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableOptionInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An array that defines a set of radio buttons.
   */
  value?: Maybe<Array<Maybe<CustomizableRadioValue>>>;
}

/**
 * Defines the price and sku of a product whose page contains a customized set of radio buttons.
 */
export interface CustomizableRadioValue {
  __typename?: "CustomizableRadioValue";
  /**
   * The ID assigned to the value.
   */
  option_type_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The price assigned to this option.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * FIXED, PERCENT, or DYNAMIC.
   */
  price_type?: Maybe<PriceTypeEnum>;
  /**
   * The Stock Keeping Unit for this option.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The order in which the radio button is displayed.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name for this option.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `CustomizableRadioValue` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains the results of the request to delete a compare list.
 */
export interface DeleteCompareListOutput {
  __typename?: "DeleteCompareListOutput";
  /**
   * Indicates whether the compare list was successfully deleted.
   */
  result?: Scalars["Boolean"]["output"];
}

/**
 * Indicates whether the request succeeded and returns the remaining customer payment tokens.
 */
export interface DeletePaymentTokenOutput {
  __typename?: "DeletePaymentTokenOutput";
  /**
   * A container for the customer's remaining payment tokens.
   */
  customerPaymentTokens?: Maybe<CustomerPaymentTokens>;
  /**
   * Indicates whether the request succeeded.
   */
  result?: Scalars["Boolean"]["output"];
}

/**
 * Defines an individual discount. A discount can be applied to the cart as a whole or to an item, shipping.
 */
export interface Discount {
  __typename?: "Discount";
  /**
   * The amount of the discount.
   */
  amount: Money;
  /**
   * The type of the entity the discount is applied to.
   */
  applied_to?: CartDiscountType;
  /**
   * The coupon related to the discount.
   */
  coupon?: Maybe<AppliedCoupon>;
  /**
   * A description of the discount.
   */
  label?: Scalars["String"]["output"];
}

/**
 * An implementation for downloadable product cart items.
 */
export interface DownloadableCartItem {
  __typename?: "DownloadableCartItem";
  /**
   * An array containing the customizable options the shopper selected.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * An array of errors encountered while loading the cart item
   */
  errors?: Maybe<Array<Maybe<CartItemError>>>;
  /**
   * @deprecated Use `uid` instead.
   */
  id?: Scalars["String"]["output"];
  /**
   * True if requested quantity is less than available stock, false otherwise.
   */
  is_available?: Scalars["Boolean"]["output"];
  /**
   * An array containing information about the links for the downloadable product added to the cart.
   */
  links?: Maybe<Array<Maybe<DownloadableProductLinks>>>;
  /**
   * Contains details about the price of the item, including taxes and discounts.
   */
  prices?: Maybe<CartItemPrices>;
  /**
   * Details about an item in the cart.
   */
  product: ProductInterface;
  /**
   * The quantity of this item in the cart.
   */
  quantity?: Scalars["Float"]["output"];
  /**
   * An array containing information about samples of the selected downloadable product.
   */
  samples?: Maybe<Array<Maybe<DownloadableProductSamples>>>;
  /**
   * The unique ID for a `CartItemInterface` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Defines downloadable product options for `CreditMemoItemInterface`.
 */
export interface DownloadableCreditMemoItem {
  __typename?: "DownloadableCreditMemoItem";
  /**
   * Details about the final discount amount for the base product, including discounts on options.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * A list of downloadable links that are refunded from the downloadable product.
   */
  downloadable_links?: Maybe<Array<Maybe<DownloadableItemsLinks>>>;
  /**
   * The unique ID for a `CreditMemoItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The order item the credit memo is applied to.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product, including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of refunded items.
   */
  quantity_refunded?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Defines downloadable product options for `InvoiceItemInterface`.
 */
export interface DownloadableInvoiceItem {
  __typename?: "DownloadableInvoiceItem";
  /**
   * Information about the final discount amount for the base product, including discounts on options.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * A list of downloadable links that are invoiced from the downloadable product.
   */
  downloadable_links?: Maybe<Array<Maybe<DownloadableItemsLinks>>>;
  /**
   * The unique ID for an `InvoiceItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Details about an individual order item.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of invoiced items.
   */
  quantity_invoiced?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Defines characteristics of the links for downloadable product.
 */
export interface DownloadableItemsLinks {
  __typename?: "DownloadableItemsLinks";
  /**
   * A number indicating the sort order.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name of the link.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `DownloadableItemsLinks` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Defines downloadable product options for `OrderItemInterface`.
 */
export interface DownloadableOrderItem {
  __typename?: "DownloadableOrderItem";
  /**
   * The final discount information for the product.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * A list of downloadable links that are ordered from the downloadable product.
   */
  downloadable_links?: Maybe<Array<Maybe<DownloadableItemsLinks>>>;
  /**
   * The entered option for the base product, such as a logo or image.
   */
  entered_options?: Maybe<Array<Maybe<OrderItemOption>>>;
  /**
   * The selected gift message for the order item
   */
  gift_message?: Maybe<GiftMessage>;
  /**
   * The unique ID for an `OrderItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The ProductInterface object, which contains details about the base product
   */
  product?: Maybe<ProductInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price of the base product, including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The type of product, such as simple, configurable, etc.
   */
  product_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL key of the base product.
   */
  product_url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * The number of canceled items.
   */
  quantity_canceled?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of invoiced items.
   */
  quantity_invoiced?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of units ordered for this item.
   */
  quantity_ordered?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of refunded items.
   */
  quantity_refunded?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of returned items.
   */
  quantity_returned?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of shipped items.
   */
  quantity_shipped?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The selected options for the base product, such as color or size.
   */
  selected_options?: Maybe<Array<Maybe<OrderItemOption>>>;
  /**
   * The status of the order item.
   */
  status?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Defines a product that the shopper downloads.
 */
export interface DownloadableProduct {
  __typename?: "DownloadableProduct";
  /**
   * The attribute set assigned to the product.
   * @deprecated The field should not be used on the storefront.
   */
  attribute_set_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The categories assigned to a product.
   */
  categories?: Maybe<Array<Maybe<CategoryInterface>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  color?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The product's country of origin.
   */
  country_of_manufacture?: Maybe<Scalars["String"]["output"]>;
  /**
   * Timestamp indicating when the product was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Crosssell Products
   */
  crosssell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * Product custom attributes.
   */
  custom_attributesV2: (args?: {
    filters?: Maybe<AttributeFilterInput>;
  }) => Maybe<ProductCustomAttributes>;
  /**
   * Detailed information about the product. The value can include simple HTML tags.
   */
  description?: Maybe<ComplexTextValue>;
  /**
   * An array containing information about the links for this downloadable product.
   */
  downloadable_product_links?: Maybe<Array<Maybe<DownloadableProductLinks>>>;
  /**
   * An array containing information about samples of this downloadable product.
   */
  downloadable_product_samples?: Maybe<Array<Maybe<DownloadableProductSamples>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  figure_size?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether a gift message is available.
   */
  gift_message_available?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID number assigned to the product.
   * @deprecated Use the `uid` field instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the main image on the product page.
   */
  image?: Maybe<ProductImage>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  is_suggested?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A value of 1 indicates that each link in the array must be purchased separately.
   */
  links_purchased_separately?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The heading above the list of downloadable products.
   */
  links_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * A number representing the product's manufacturer.
   * @deprecated Use the `custom_attributes` field instead.
   */
  manufacturer?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  match_collezione2?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of media gallery objects.
   */
  media_gallery?: Maybe<Array<Maybe<MediaGalleryInterface>>>;
  /**
   * An array of MediaGalleryEntry objects.
   * @deprecated Use `media_gallery` instead.
   */
  media_gallery_entries?: Maybe<Array<Maybe<MediaGalleryEntry>>>;
  /**
   * A brief overview of the product for search results listings, maximum 255 characters.
   */
  meta_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * A comma-separated list of keywords that are visible only to search engines.
   */
  meta_keyword?: Maybe<Scalars["String"]["output"]>;
  /**
   * A string that is displayed in the title bar and tab of the browser and in search results lists.
   */
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The product name. Customers use this name to identify the product.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The beginning date for new product listings, and determines if the product is featured as a new product.
   */
  new_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The end date for new product listings.
   */
  new_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Product stock only x left count
   */
  only_x_left_in_stock?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of options for a customizable product.
   */
  options?: Maybe<Array<Maybe<CustomizableOptionInterface>>>;
  /**
   * If the product has multiple options, determines where they appear on the product page.
   */
  options_container?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates the price of an item.
   * @deprecated Use `price_range` for product price information.
   */
  price?: Maybe<ProductPrices>;
  /**
   * The range of prices for the product
   */
  price_range: PriceRange;
  /**
   * An array of `TierPrice` objects.
   */
  price_tiers?: Maybe<Array<Maybe<TierPrice>>>;
  /**
   * An array of `ProductLinks` objects.
   */
  product_links?: Maybe<Array<Maybe<ProductLinksInterface>>>;
  /**
   * The average of all the ratings given to the product.
   */
  rating_summary?: Scalars["Float"]["output"];
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * An array of products to be displayed in a Related Products block.
   */
  related_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The total count of all the reviews given to the product.
   */
  review_count?: Scalars["Int"]["output"];
  /**
   * The list of products reviews.
   */
  reviews: (args?: {
    /**
     * The page of results to return. The default is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => ProductReviews;
  /**
   * A short description of the product. Its use depends on the theme.
   */
  short_description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  size?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number or code assigned to a product to identify the product, options, price, and manufacturer.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The relative path to the small image, which is used on catalog pages.
   */
  small_image?: Maybe<ProductImage>;
  /**
   * The beginning date that a product has a special price.
   * @deprecated The field should not be used on the storefront.
   */
  special_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The discounted price of the product.
   */
  special_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The end date for a product with a special price.
   */
  special_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Stock status of the product
   */
  stock_status?: Maybe<ProductStockStatus>;
  /**
   * The file name of a swatch image.
   */
  swatch_image?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tema?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the product's thumbnail image.
   */
  thumbnail?: Maybe<ProductImage>;
  /**
   * The price when tier pricing is in effect and the items purchased threshold has been reached.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of ProductTierPrices objects.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_prices?: Maybe<Array<Maybe<ProductTierPrices>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tipologia?: Maybe<Scalars["Int"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
  /**
   * One of simple, virtual, bundle, downloadable, grouped, or configurable.
   * @deprecated Use `__typename` instead.
   */
  type_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `ProductInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * Timestamp indicating when the product was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Upsell Products
   */
  upsell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The part of the URL that identifies the product
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use product's `canonical_url` or url rewrites instead
   */
  url_path?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL rewrites list
   */
  url_rewrites?: Maybe<Array<Maybe<UrlRewrite>>>;
  /**
   * The part of the product URL that is appended after the url key
   */
  url_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An array of websites in which the product is available.
   * @deprecated The field should not be used on the storefront.
   */
  websites?: Maybe<Array<Maybe<Website>>>;
}

/**
 * Defines characteristics of a downloadable product.
 */
export interface DownloadableProductLinks {
  __typename?: "DownloadableProductLinks";
  /**
   * @deprecated This information should not be exposed on frontend.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated This information should not be exposed on frontend.
   */
  is_shareable?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * @deprecated `sample_url` serves to get the downloadable sample
   */
  link_type?: Maybe<DownloadableFileTypeEnum>;
  /**
   * @deprecated This information should not be exposed on frontend.
   */
  number_of_downloads?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The price of the downloadable product.
   */
  price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * @deprecated `sample_url` serves to get the downloadable sample
   */
  sample_file?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated `sample_url` serves to get the downloadable sample
   */
  sample_type?: Maybe<DownloadableFileTypeEnum>;
  /**
   * The full URL to the downloadable sample.
   */
  sample_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * A number indicating the sort order.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name of the link.
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `DownloadableProductLinks` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Defines characteristics of a downloadable product.
 */
export interface DownloadableProductSamples {
  __typename?: "DownloadableProductSamples";
  /**
   * @deprecated This information should not be exposed on frontend.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated `sample_url` serves to get the downloadable sample
   */
  sample_file?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated `sample_url` serves to get the downloadable sample
   */
  sample_type?: Maybe<DownloadableFileTypeEnum>;
  /**
   * The full URL to the downloadable sample.
   */
  sample_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * A number indicating the sort order.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The display name of the sample.
   */
  title?: Maybe<Scalars["String"]["output"]>;
}

/**
 * A downloadable product wish list item.
 */
export interface DownloadableWishlistItem {
  __typename?: "DownloadableWishlistItem";
  /**
   * The date and time the item was added to the wish list.
   */
  added_at?: Scalars["String"]["output"];
  /**
   * Custom options selected for the wish list item.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * The description of the item.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `WishlistItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * An array containing information about the selected links.
   */
  links_v2?: Maybe<Array<Maybe<DownloadableProductLinks>>>;
  /**
   * Product details of the wish list item.
   */
  product?: Maybe<ProductInterface>;
  /**
   * The quantity of this wish list item.
   */
  quantity?: Scalars["Float"]["output"];
  /**
   * An array containing information about the selected samples.
   */
  samples?: Maybe<Array<Maybe<DownloadableProductSamples>>>;
}

/**
 * Contains the `uid`, `relative_url`, and `type` attributes.
 */
export interface EntityUrl {
  __typename?: "EntityUrl";
  /**
   * @deprecated Use `relative_url` instead.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `ProductInterface`, `CategoryInterface`, `CmsPage`, or similar object associated with the specified URL. This could be a product, category, or CMS page UID.
   */
  entity_uid?: Maybe<Scalars["ID"]["output"]>;
  /**
   * The ID assigned to the object associated with the specified url. This could be a product ID, category ID, or page ID.
   * @deprecated Use `entity_uid` instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirectCode?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
}

export interface ErrorInterface {
  __typename?: "InternalError" | "NoSuchEntityUidError";
  /**
   * The returned error message.
   */
  message?: Scalars["String"]["output"];
  $on: $ErrorInterface;
}

/**
 * Estimate totals output.
 */
export interface EstimateTotalsOutput {
  __typename?: "EstimateTotalsOutput";
  /**
   * Cart after totals estimation
   */
  cart?: Maybe<Cart>;
}

/**
 * Lists the exchange rate.
 */
export interface ExchangeRate {
  __typename?: "ExchangeRate";
  /**
   * Specifies the store’s default currency to exchange to.
   */
  currency_to?: Maybe<Scalars["String"]["output"]>;
  /**
   * The exchange rate for the store’s default currency.
   */
  rate?: Maybe<Scalars["Float"]["output"]>;
}

export interface FastlaneConfig {
  __typename?: "FastlaneConfig";
  /**
   * The payment method code as defined in the payment gateway
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the payment method is displayed
   */
  is_visible?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Defines the payment intent (Authorize or Capture
   */
  payment_intent?: Maybe<Scalars["String"]["output"]>;
  /**
   * The payment source for the payment method
   */
  payment_source?: Maybe<Scalars["String"]["output"]>;
  /**
   * The PayPal parameters required to load the JS SDK
   */
  sdk_params?: Maybe<Array<Maybe<SDKParams>>>;
  /**
   * The relative order the payment method is displayed on the checkout page
   */
  sort_order?: Maybe<Scalars["String"]["output"]>;
  /**
   * 3DS mode
   */
  three_ds_mode?: Maybe<ThreeDSMode>;
  /**
   * The name displayed for the payment method
   */
  title?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains the generated customer token.
 */
export interface GenerateCustomerTokenAsAdminOutput {
  __typename?: "GenerateCustomerTokenAsAdminOutput";
  /**
   * The generated customer token.
   */
  customer_token?: Scalars["String"]["output"];
}

/**
 * Gets the payment SDK URLs and values
 */
export interface GetPaymentSDKOutput {
  __typename?: "GetPaymentSDKOutput";
  /**
   * The payment SDK parameters
   */
  sdkParams?: Maybe<Array<Maybe<PaymentSDKParamsItem>>>;
}

/**
 * Contains the text of a gift message, its sender, and recipient
 */
export interface GiftMessage {
  __typename?: "GiftMessage";
  /**
   * Sender name
   */
  from?: Scalars["String"]["output"];
  /**
   * Gift message text
   */
  message?: Scalars["String"]["output"];
  /**
   * Recipient name
   */
  to?: Scalars["String"]["output"];
}

export interface GooglePayButtonStyles {
  __typename?: "GooglePayButtonStyles";
  /**
   * The button color
   */
  color?: Maybe<Scalars["String"]["output"]>;
  /**
   * The button height in pixels
   */
  height?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The button type
   */
  type?: Maybe<Scalars["String"]["output"]>;
}

export interface GooglePayConfig {
  __typename?: "GooglePayConfig";
  /**
   * The styles for the GooglePay Button configuration
   */
  button_styles?: Maybe<GooglePayButtonStyles>;
  /**
   * The payment method code as defined in the payment gateway
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the payment method is displayed
   */
  is_visible?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Defines the payment intent (Authorize or Capture
   */
  payment_intent?: Maybe<Scalars["String"]["output"]>;
  /**
   * The payment source for the payment method
   */
  payment_source?: Maybe<Scalars["String"]["output"]>;
  /**
   * The PayPal parameters required to load the JS SDK
   */
  sdk_params?: Maybe<Array<Maybe<SDKParams>>>;
  /**
   * The relative order the payment method is displayed on the checkout page
   */
  sort_order?: Maybe<Scalars["String"]["output"]>;
  /**
   * 3DS mode
   */
  three_ds_mode?: Maybe<ThreeDSMode>;
  /**
   * The name displayed for the payment method
   */
  title?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Defines a grouped product, which consists of simple standalone products that are presented as a group.
 */
export interface GroupedProduct {
  __typename?: "GroupedProduct";
  /**
   * The attribute set assigned to the product.
   * @deprecated The field should not be used on the storefront.
   */
  attribute_set_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The categories assigned to a product.
   */
  categories?: Maybe<Array<Maybe<CategoryInterface>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  color?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The product's country of origin.
   */
  country_of_manufacture?: Maybe<Scalars["String"]["output"]>;
  /**
   * Timestamp indicating when the product was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Crosssell Products
   */
  crosssell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * Product custom attributes.
   */
  custom_attributesV2: (args?: {
    filters?: Maybe<AttributeFilterInput>;
  }) => Maybe<ProductCustomAttributes>;
  /**
   * Detailed information about the product. The value can include simple HTML tags.
   */
  description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  figure_size?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether a gift message is available.
   */
  gift_message_available?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID number assigned to the product.
   * @deprecated Use the `uid` field instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the main image on the product page.
   */
  image?: Maybe<ProductImage>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  is_suggested?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array containing grouped product items.
   */
  items?: Maybe<Array<Maybe<GroupedProductItem>>>;
  /**
   * A number representing the product's manufacturer.
   * @deprecated Use the `custom_attributes` field instead.
   */
  manufacturer?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  match_collezione2?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of media gallery objects.
   */
  media_gallery?: Maybe<Array<Maybe<MediaGalleryInterface>>>;
  /**
   * An array of MediaGalleryEntry objects.
   * @deprecated Use `media_gallery` instead.
   */
  media_gallery_entries?: Maybe<Array<Maybe<MediaGalleryEntry>>>;
  /**
   * A brief overview of the product for search results listings, maximum 255 characters.
   */
  meta_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * A comma-separated list of keywords that are visible only to search engines.
   */
  meta_keyword?: Maybe<Scalars["String"]["output"]>;
  /**
   * A string that is displayed in the title bar and tab of the browser and in search results lists.
   */
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The product name. Customers use this name to identify the product.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The beginning date for new product listings, and determines if the product is featured as a new product.
   */
  new_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The end date for new product listings.
   */
  new_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Product stock only x left count
   */
  only_x_left_in_stock?: Maybe<Scalars["Float"]["output"]>;
  /**
   * If the product has multiple options, determines where they appear on the product page.
   */
  options_container?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates the price of an item.
   * @deprecated Use `price_range` for product price information.
   */
  price?: Maybe<ProductPrices>;
  /**
   * The range of prices for the product
   */
  price_range: PriceRange;
  /**
   * An array of `TierPrice` objects.
   */
  price_tiers?: Maybe<Array<Maybe<TierPrice>>>;
  /**
   * An array of `ProductLinks` objects.
   */
  product_links?: Maybe<Array<Maybe<ProductLinksInterface>>>;
  /**
   * The average of all the ratings given to the product.
   */
  rating_summary?: Scalars["Float"]["output"];
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * An array of products to be displayed in a Related Products block.
   */
  related_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The total count of all the reviews given to the product.
   */
  review_count?: Scalars["Int"]["output"];
  /**
   * The list of products reviews.
   */
  reviews: (args?: {
    /**
     * The page of results to return. The default is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => ProductReviews;
  /**
   * A short description of the product. Its use depends on the theme.
   */
  short_description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  size?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number or code assigned to a product to identify the product, options, price, and manufacturer.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The relative path to the small image, which is used on catalog pages.
   */
  small_image?: Maybe<ProductImage>;
  /**
   * The beginning date that a product has a special price.
   * @deprecated The field should not be used on the storefront.
   */
  special_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The discounted price of the product.
   */
  special_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The end date for a product with a special price.
   */
  special_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Stock status of the product
   */
  stock_status?: Maybe<ProductStockStatus>;
  /**
   * The file name of a swatch image.
   */
  swatch_image?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tema?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the product's thumbnail image.
   */
  thumbnail?: Maybe<ProductImage>;
  /**
   * The price when tier pricing is in effect and the items purchased threshold has been reached.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of ProductTierPrices objects.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_prices?: Maybe<Array<Maybe<ProductTierPrices>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tipologia?: Maybe<Scalars["Int"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
  /**
   * One of simple, virtual, bundle, downloadable, grouped, or configurable.
   * @deprecated Use `__typename` instead.
   */
  type_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `ProductInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * Timestamp indicating when the product was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Upsell Products
   */
  upsell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The part of the URL that identifies the product
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use product's `canonical_url` or url rewrites instead
   */
  url_path?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL rewrites list
   */
  url_rewrites?: Maybe<Array<Maybe<UrlRewrite>>>;
  /**
   * The part of the product URL that is appended after the url key
   */
  url_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An array of websites in which the product is available.
   * @deprecated The field should not be used on the storefront.
   */
  websites?: Maybe<Array<Maybe<Website>>>;
  /**
   * The weight of the item, in units defined by the store.
   */
  weight?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Contains information about an individual grouped product item.
 */
export interface GroupedProductItem {
  __typename?: "GroupedProductItem";
  /**
   * The relative position of this item compared to the other group items.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Details about this product option.
   */
  product?: Maybe<ProductInterface>;
  /**
   * The quantity of this grouped product item.
   */
  qty?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * A grouped product wish list item.
 */
export interface GroupedProductWishlistItem {
  __typename?: "GroupedProductWishlistItem";
  /**
   * The date and time the item was added to the wish list.
   */
  added_at?: Scalars["String"]["output"];
  /**
   * Custom options selected for the wish list item.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * The description of the item.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `WishlistItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Product details of the wish list item.
   */
  product?: Maybe<ProductInterface>;
  /**
   * The quantity of this wish list item.
   */
  quantity?: Scalars["Float"]["output"];
}

export interface HostedFieldsConfig {
  __typename?: "HostedFieldsConfig";
  /**
   * Vault payment method code
   */
  cc_vault_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The payment method code as defined in the payment gateway
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * Card vault enabled
   */
  is_vault_enabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the payment method is displayed
   */
  is_visible?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Defines the payment intent (Authorize or Capture
   */
  payment_intent?: Maybe<Scalars["String"]["output"]>;
  /**
   * The payment source for the payment method
   */
  payment_source?: Maybe<Scalars["String"]["output"]>;
  /**
   * Card and bin details required
   */
  requires_card_details?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The PayPal parameters required to load the JS SDK
   */
  sdk_params?: Maybe<Array<Maybe<SDKParams>>>;
  /**
   * The relative order the payment method is displayed on the checkout page
   */
  sort_order?: Maybe<Scalars["String"]["output"]>;
  /**
   * Whether 3DS is activated; true if 3DS mode is not OFF.
   * @deprecated Use 'three_ds_mode' instead.
   */
  three_ds?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * 3DS mode
   */
  three_ds_mode?: Maybe<ThreeDSMode>;
  /**
   * The name displayed for the payment method
   */
  title?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains the secure URL used for the Payments Pro Hosted Solution payment method.
 */
export interface HostedProUrl {
  __typename?: "HostedProUrl";
  /**
   * The secure URL generated by PayPal.
   */
  secure_form_url?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains target path parameters.
 */
export interface HttpQueryParameter {
  __typename?: "HttpQueryParameter";
  /**
   * A parameter name.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * A parameter value.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

export interface ImageSwatchData {
  __typename?: "ImageSwatchData";
  /**
   * The URL assigned to the thumbnail of the swatch image.
   */
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  /**
   * The value can be represented as color (HEX code), image link, or text.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains an error message when an internal error occurred.
 */
export interface InternalError {
  __typename?: "InternalError";
  /**
   * The returned error message.
   */
  message?: Scalars["String"]["output"];
}

/**
 * Contains invoice details.
 */
export interface Invoice {
  __typename?: "Invoice";
  /**
   * Comments on the invoice.
   */
  comments?: Maybe<Array<Maybe<SalesCommentItem>>>;
  /**
   * The unique ID for a `Invoice` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Invoiced product details.
   */
  items?: Maybe<Array<Maybe<InvoiceItemInterface>>>;
  /**
   * Sequential invoice number.
   */
  number?: Scalars["String"]["output"];
  /**
   * Invoice total amount details.
   */
  total?: Maybe<InvoiceTotal>;
}

export interface InvoiceItem {
  __typename?: "InvoiceItem";
  /**
   * Information about the final discount amount for the base product, including discounts on options.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The unique ID for an `InvoiceItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Details about an individual order item.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of invoiced items.
   */
  quantity_invoiced?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Contains detailes about invoiced items.
 */
export interface InvoiceItemInterface {
  __typename?: "BundleInvoiceItem" | "DownloadableInvoiceItem" | "InvoiceItem";
  /**
   * Information about the final discount amount for the base product, including discounts on options.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The unique ID for an `InvoiceItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Details about an individual order item.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of invoiced items.
   */
  quantity_invoiced?: Maybe<Scalars["Float"]["output"]>;
  $on: $InvoiceItemInterface;
}

/**
 * Contains price details from an invoice.
 */
export interface InvoiceTotal {
  __typename?: "InvoiceTotal";
  /**
   * The final base grand total amount in the base currency.
   */
  base_grand_total: Money;
  /**
   * The applied discounts to the invoice.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The final total amount, including shipping, discounts, and taxes.
   */
  grand_total: Money;
  /**
   * Details about the shipping and handling costs for the invoice.
   */
  shipping_handling?: Maybe<ShippingHandling>;
  /**
   * The subtotal of the invoice, excluding shipping, discounts, and taxes.
   */
  subtotal: Money;
  /**
   * The invoice tax details.
   */
  taxes?: Maybe<Array<Maybe<TaxItem>>>;
  /**
   * The shipping amount for the invoice.
   */
  total_shipping: Money;
  /**
   * The amount of tax applied to the invoice.
   */
  total_tax: Money;
}

/**
 * Contains the result of the `isEmailAvailable` query.
 */
export interface IsEmailAvailableOutput {
  __typename?: "IsEmailAvailableOutput";
  /**
   * Indicates whether the specified email address can be used to create a customer.
   */
  is_email_available?: Maybe<Scalars["Boolean"]["output"]>;
}

/**
 * A list of options of the selected bundle product.
 */
export interface ItemSelectedBundleOption {
  __typename?: "ItemSelectedBundleOption";
  /**
   * The unique ID for a `ItemSelectedBundleOption` object.
   * @deprecated Use `uid` instead.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The label of the option.
   */
  label?: Scalars["String"]["output"];
  /**
   * The unique ID for a `ItemSelectedBundleOption` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * A list of products that represent the values of the parent option.
   */
  values?: Maybe<Array<Maybe<ItemSelectedBundleOptionValue>>>;
}

/**
 * A list of values for the selected bundle product.
 */
export interface ItemSelectedBundleOptionValue {
  __typename?: "ItemSelectedBundleOptionValue";
  /**
   * The unique ID for a `ItemSelectedBundleOptionValue` object.
   * @deprecated Use `uid` instead.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The price of the child bundle product.
   */
  price: Money;
  /**
   * The name of the child bundle product.
   */
  product_name?: Scalars["String"]["output"];
  /**
   * The SKU of the child bundle product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of this bundle product that were ordered.
   */
  quantity?: Scalars["Float"]["output"];
  /**
   * The unique ID for a `ItemSelectedBundleOptionValue` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains a key-value pair.
 */
export interface KeyValue {
  __typename?: "KeyValue";
  /**
   * The name part of the key/value pair.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The value part of the key/value pair.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains information for rendering layered navigation.
 */
export interface LayerFilter {
  __typename?: "LayerFilter";
  /**
   * An array of filter items.
   * @deprecated Use `Aggregation.options` instead.
   */
  filter_items?: Maybe<Array<Maybe<LayerFilterItemInterface>>>;
  /**
   * The count of filter items in filter group.
   * @deprecated Use `Aggregation.count` instead.
   */
  filter_items_count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The name of a layered navigation filter.
   * @deprecated Use `Aggregation.label` instead.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The request variable name for a filter query.
   * @deprecated Use `Aggregation.attribute_code` instead.
   */
  request_var?: Maybe<Scalars["String"]["output"]>;
}

export interface LayerFilterItem {
  __typename?: "LayerFilterItem";
  /**
   * The count of items per filter.
   * @deprecated Use `AggregationOption.count` instead.
   */
  items_count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The label for a filter.
   * @deprecated Use `AggregationOption.label` instead.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The value of a filter request variable to be used in query.
   * @deprecated Use `AggregationOption.value` instead.
   */
  value_string?: Maybe<Scalars["String"]["output"]>;
}

export interface LayerFilterItemInterface {
  __typename?: "LayerFilterItem" | "SwatchLayerFilterItem";
  /**
   * The count of items per filter.
   * @deprecated Use `AggregationOption.count` instead.
   */
  items_count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The label for a filter.
   * @deprecated Use `AggregationOption.label` instead.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The value of a filter request variable to be used in query.
   * @deprecated Use `AggregationOption.value` instead.
   */
  value_string?: Maybe<Scalars["String"]["output"]>;
  $on: $LayerFilterItemInterface;
}

/**
 * Defines characteristics about images and videos associated with a specific product.
 */
export interface MediaGalleryEntry {
  __typename?: "MediaGalleryEntry";
  /**
   * Details about the content of the media gallery item.
   */
  content?: Maybe<ProductMediaGalleryEntriesContent>;
  /**
   * Indicates whether the image is hidden from view.
   */
  disabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The path of the image on the server.
   */
  file?: Maybe<Scalars["String"]["output"]>;
  /**
   * The identifier assigned to the object.
   * @deprecated Use `uid` instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The alt text displayed on the storefront when the user points to the image.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * Either `image` or `video`.
   */
  media_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * The media item's position after it has been sorted.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Array of image types. It can have the following values: image, small_image, thumbnail.
   */
  types?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * The unique ID for a `MediaGalleryEntry` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * Details about the content of a video item.
   */
  video_content?: Maybe<ProductMediaGalleryEntriesVideoContent>;
}

/**
 * Contains basic information about a product image or video.
 */
export interface MediaGalleryInterface {
  __typename?: "ProductImage" | "ProductVideo";
  /**
   * Indicates whether the image is hidden from view.
   */
  disabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The label of the product image or video.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The media item's position after it has been sorted.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The URL of the product image or video.
   */
  url?: Maybe<Scalars["String"]["output"]>;
  $on: $MediaGalleryInterface;
}

export interface MessageStyleLogo {
  __typename?: "MessageStyleLogo";
  /**
   * The type of logo for the PayPal Pay Later messaging
   */
  type?: Maybe<Scalars["String"]["output"]>;
}

export interface MessageStyles {
  __typename?: "MessageStyles";
  /**
   * The message layout
   */
  layout?: Maybe<Scalars["String"]["output"]>;
  /**
   * The message logo
   */
  logo?: Maybe<MessageStyleLogo>;
}

export interface ModuleConfiguration {
  __typename?: "ModuleConfiguration";
  /**
   * The Public Key of the Stripe payment.
   */
  apiKey?: Maybe<Scalars["String"]["output"]>;
  /**
   * Module Version and Partner ID etc
   */
  appInfo?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * Serialized options that can be used to initialize the Elements object
   */
  elementsOptions?: Maybe<Scalars["String"]["output"]>;
  /**
   * Locale
   */
  locale?: Maybe<Scalars["String"]["output"]>;
  /**
   * Betas and API version
   */
  options?: Maybe<ModuleOptions>;
}

export interface ModuleOptions {
  __typename?: "ModuleOptions";
  /**
   * API Version
   */
  apiVersion?: Maybe<Scalars["String"]["output"]>;
  /**
   * Betas.
   */
  betas?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
}

/**
 * Defines a monetary value, including a numeric value and a currency code.
 */
export interface Money {
  __typename?: "Money";
  /**
   * A three-letter currency code, such as USD or EUR.
   */
  currency?: Maybe<CurrencyEnum>;
  /**
   * A number expressing a monetary value.
   */
  value?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Contains an error message when an invalid UID was specified.
 */
export interface NoSuchEntityUidError {
  __typename?: "NoSuchEntityUidError";
  /**
   * The returned error message.
   */
  message?: Scalars["String"]["output"];
  /**
   * The specified invalid unique ID of an object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains the order ID.
 */
export interface Order {
  __typename?: "Order";
  /**
   * The client secret of the PaymentIntent or SetupIntent that is associated with this order
   */
  client_secret?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use `order_number` instead.
   */
  order_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for an `Order` object.
   */
  order_number?: Scalars["String"]["output"];
}

/**
 * Contains detailed information about an order's billing and shipping addresses.
 */
export interface OrderAddress {
  __typename?: "OrderAddress";
  /**
   * The city or town.
   */
  city?: Scalars["String"]["output"];
  /**
   * The customer's company.
   */
  company?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's country.
   */
  country_code?: Maybe<CountryCodeEnum>;
  /**
   * The fax number.
   */
  fax?: Maybe<Scalars["String"]["output"]>;
  /**
   * The first name of the person associated with the shipping/billing address.
   */
  firstname?: Scalars["String"]["output"];
  /**
   * The family name of the person associated with the shipping/billing address.
   */
  lastname?: Scalars["String"]["output"];
  /**
   * The middle name of the person associated with the shipping/billing address.
   */
  middlename?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's ZIP or postal code.
   */
  postcode?: Maybe<Scalars["String"]["output"]>;
  /**
   * An honorific, such as Dr., Mr., or Mrs.
   */
  prefix?: Maybe<Scalars["String"]["output"]>;
  /**
   * The state or province name.
   */
  region?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `Region` object of a pre-defined region.
   */
  region_id?: Maybe<Scalars["ID"]["output"]>;
  /**
   * An array of strings that define the street number and name.
   */
  street?: Array<Maybe<Scalars["String"]["output"]>>;
  /**
   * A value such as Sr., Jr., or III.
   */
  suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * The telephone number.
   */
  telephone?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's Value-added tax (VAT) number (for corporate customers).
   */
  vat_id?: Maybe<Scalars["String"]["output"]>;
}

export interface OrderItem {
  __typename?: "OrderItem";
  /**
   * The final discount information for the product.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The entered option for the base product, such as a logo or image.
   */
  entered_options?: Maybe<Array<Maybe<OrderItemOption>>>;
  /**
   * The selected gift message for the order item
   */
  gift_message?: Maybe<GiftMessage>;
  /**
   * The unique ID for an `OrderItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The ProductInterface object, which contains details about the base product
   */
  product?: Maybe<ProductInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price of the base product, including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The type of product, such as simple, configurable, etc.
   */
  product_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL key of the base product.
   */
  product_url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * The number of canceled items.
   */
  quantity_canceled?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of invoiced items.
   */
  quantity_invoiced?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of units ordered for this item.
   */
  quantity_ordered?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of refunded items.
   */
  quantity_refunded?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of returned items.
   */
  quantity_returned?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of shipped items.
   */
  quantity_shipped?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The selected options for the base product, such as color or size.
   */
  selected_options?: Maybe<Array<Maybe<OrderItemOption>>>;
  /**
   * The status of the order item.
   */
  status?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Order item details.
 */
export interface OrderItemInterface {
  __typename?: "BundleOrderItem" | "DownloadableOrderItem" | "OrderItem";
  /**
   * The final discount information for the product.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The entered option for the base product, such as a logo or image.
   */
  entered_options?: Maybe<Array<Maybe<OrderItemOption>>>;
  /**
   * The selected gift message for the order item
   */
  gift_message?: Maybe<GiftMessage>;
  /**
   * The unique ID for an `OrderItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The ProductInterface object, which contains details about the base product
   */
  product?: Maybe<ProductInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price of the base product, including selected options.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The type of product, such as simple, configurable, etc.
   */
  product_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL key of the base product.
   */
  product_url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * The number of canceled items.
   */
  quantity_canceled?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of invoiced items.
   */
  quantity_invoiced?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of units ordered for this item.
   */
  quantity_ordered?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of refunded items.
   */
  quantity_refunded?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of returned items.
   */
  quantity_returned?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of shipped items.
   */
  quantity_shipped?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The selected options for the base product, such as color or size.
   */
  selected_options?: Maybe<Array<Maybe<OrderItemOption>>>;
  /**
   * The status of the order item.
   */
  status?: Maybe<Scalars["String"]["output"]>;
  $on: $OrderItemInterface;
}

/**
 * Represents order item options like selected or entered.
 */
export interface OrderItemOption {
  __typename?: "OrderItemOption";
  /**
   * The name of the option.
   */
  label?: Scalars["String"]["output"];
  /**
   * The value of the option.
   */
  value?: Scalars["String"]["output"];
}

/**
 * Contains details about the payment method used to pay for the order.
 */
export interface OrderPaymentMethod {
  __typename?: "OrderPaymentMethod";
  /**
   * Additional data per payment method type.
   */
  additional_data?: Maybe<Array<Maybe<KeyValue>>>;
  /**
   * The label that describes the payment method.
   */
  name?: Scalars["String"]["output"];
  /**
   * The payment method code that indicates how the order was paid for.
   */
  type?: Scalars["String"]["output"];
}

/**
 * Contains order shipment details.
 */
export interface OrderShipment {
  __typename?: "OrderShipment";
  /**
   * Comments added to the shipment.
   */
  comments?: Maybe<Array<Maybe<SalesCommentItem>>>;
  /**
   * The unique ID for a `OrderShipment` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * An array of items included in the shipment.
   */
  items?: Maybe<Array<Maybe<ShipmentItemInterface>>>;
  /**
   * The sequential credit shipment number.
   */
  number?: Scalars["String"]["output"];
  /**
   * An array of shipment tracking details.
   */
  tracking?: Maybe<Array<Maybe<ShipmentTracking>>>;
}

/**
 * Contains details about the sales total amounts used to calculate the final price.
 */
export interface OrderTotal {
  __typename?: "OrderTotal";
  /**
   * The final base grand total amount in the base currency.
   */
  base_grand_total: Money;
  /**
   * The applied discounts to the order.
   */
  discounts?: Maybe<Array<Maybe<Discount>>>;
  /**
   * The final total amount, including shipping, discounts, and taxes.
   */
  grand_total: Money;
  /**
   * Details about the shipping and handling costs for the order.
   */
  shipping_handling?: Maybe<ShippingHandling>;
  /**
   * The subtotal of the order, excluding shipping, discounts, and taxes.
   */
  subtotal: Money;
  /**
   * The order tax details.
   */
  taxes?: Maybe<Array<Maybe<TaxItem>>>;
  /**
   * The shipping amount for the order.
   */
  total_shipping: Money;
  /**
   * The amount of tax applied to the order.
   */
  total_tax: Money;
}

/**
 * Contains information used to generate PayPal iframe for transaction. Applies to Payflow Link and Payments Advanced payment methods.
 */
export interface PayflowLinkToken {
  __typename?: "PayflowLinkToken";
  /**
   * The mode for the Payflow transaction.
   */
  mode?: Maybe<PayflowLinkMode>;
  /**
   * The PayPal URL used for requesting a Payflow form.
   */
  paypal_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The secure token generated by PayPal.
   */
  secure_token?: Maybe<Scalars["String"]["output"]>;
  /**
   * The secure token ID generated by PayPal.
   */
  secure_token_id?: Maybe<Scalars["String"]["output"]>;
}

export interface PayflowProResponseOutput {
  __typename?: "PayflowProResponseOutput";
  /**
   * The cart with the updated selected payment method.
   */
  cart: Cart;
}

/**
 * Contains the secure information used to authorize transaction. Applies to Payflow Pro and Payments Pro payment methods.
 */
export interface PayflowProToken {
  __typename?: "PayflowProToken";
  /**
   * The RESPMSG returned by PayPal. If the `result` is `0`, then `response_message` is `Approved`.
   */
  response_message?: Scalars["String"]["output"];
  /**
   * A non-zero value if any errors occurred.
   */
  result?: Scalars["Int"]["output"];
  /**
   * The RESULT returned by PayPal. A value of `0` indicates the transaction was approved.
   */
  result_code?: Scalars["Int"]["output"];
  /**
   * A secure token generated by PayPal.
   */
  secure_token?: Scalars["String"]["output"];
  /**
   * A secure token ID generated by PayPal.
   */
  secure_token_id?: Scalars["String"]["output"];
}

export interface PaymentCommonConfig {
  __typename?: "PaymentCommonConfig";
  /**
   * The payment method code as defined in the payment gateway
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the payment method is displayed
   */
  is_visible?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Defines the payment intent (Authorize or Capture
   */
  payment_intent?: Maybe<Scalars["String"]["output"]>;
  /**
   * The PayPal parameters required to load the JS SDK
   */
  sdk_params?: Maybe<Array<Maybe<SDKParams>>>;
  /**
   * The relative order the payment method is displayed on the checkout page
   */
  sort_order?: Maybe<Scalars["String"]["output"]>;
  /**
   * The name displayed for the payment method
   */
  title?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains payment fields that are common to all types of payment methods.
 */
export interface PaymentConfigItem {
  __typename?:
    | "ApplePayConfig"
    | "FastlaneConfig"
    | "GooglePayConfig"
    | "HostedFieldsConfig"
    | "PaymentCommonConfig"
    | "SmartButtonsConfig";
  /**
   * The payment method code as defined in the payment gateway
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the payment method is displayed
   */
  is_visible?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Defines the payment intent (Authorize or Capture
   */
  payment_intent?: Maybe<Scalars["String"]["output"]>;
  /**
   * The PayPal parameters required to load the JS SDK
   */
  sdk_params?: Maybe<Array<Maybe<SDKParams>>>;
  /**
   * The relative order the payment method is displayed on the checkout page
   */
  sort_order?: Maybe<Scalars["String"]["output"]>;
  /**
   * The name displayed for the payment method
   */
  title?: Maybe<Scalars["String"]["output"]>;
  $on: $PaymentConfigItem;
}

/**
 * Retrieves the payment configuration for a given location
 */
export interface PaymentConfigOutput {
  __typename?: "PaymentConfigOutput";
  /**
   * ApplePay payment method configuration
   */
  apple_pay?: Maybe<ApplePayConfig>;
  /**
   * Fastlane payment method configuration
   */
  fastlane?: Maybe<FastlaneConfig>;
  /**
   * GooglePay payment method configuration
   */
  google_pay?: Maybe<GooglePayConfig>;
  /**
   * Hosted fields payment method configuration
   */
  hosted_fields?: Maybe<HostedFieldsConfig>;
  /**
   * Smart Buttons payment method configuration
   */
  smart_buttons?: Maybe<SmartButtonsConfig>;
}

/**
 * Contains the payment order details
 */
export interface PaymentOrderOutput {
  __typename?: "PaymentOrderOutput";
  /**
   * PayPal order ID
   */
  id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The order ID generated by Payment Services
   */
  mp_order_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * Details about the card used on the order
   */
  payment_source_details?: Maybe<PaymentSourceDetails>;
  /**
   * The status of the payment order
   */
  status?: Maybe<Scalars["String"]["output"]>;
}

export interface PaymentSDKParamsItem {
  __typename?: "PaymentSDKParamsItem";
  /**
   * The payment method code used in the order
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The payment SDK parameters
   */
  params?: Maybe<Array<Maybe<SDKParams>>>;
}

export interface PaymentSourceDetails {
  __typename?: "PaymentSourceDetails";
  /**
   * Details about the card used on the order
   */
  card?: Maybe<Card>;
}

/**
 * The payment source information
 */
export interface PaymentSourceOutput {
  __typename?: "PaymentSourceOutput";
  /**
   * The card payment source information
   */
  card: CardPaymentSourceOutput;
}

/**
 * The stored payment method available to the customer.
 */
export interface PaymentToken {
  __typename?: "PaymentToken";
  /**
   * A description of the stored account details.
   */
  details?: Maybe<Scalars["String"]["output"]>;
  /**
   * The payment method code associated with the token.
   */
  payment_method_code?: Scalars["String"]["output"];
  /**
   * The public hash of the token.
   */
  public_hash?: Scalars["String"]["output"];
  /**
   * Specifies the payment token type.
   */
  type?: PaymentTokenTypeEnum;
}

/**
 * Deprecated. Use `PaypalExpressTokenOutput` instead.
 */
export interface PaypalExpressToken {
  __typename?: "PaypalExpressToken";
  /**
   * A set of URLs that allow the buyer to authorize payment and adjust checkout details.
   * @deprecated Use `PaypalExpressTokenOutput.paypal_urls` instead.
   */
  paypal_urls?: Maybe<PaypalExpressUrlList>;
  /**
   * The token returned by PayPal.
   * @deprecated Use `PaypalExpressTokenOutput.token` instead.
   */
  token?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains the token returned by PayPal and a set of URLs that allow the buyer to authorize payment and adjust checkout details. Applies to Express Checkout and Payments Standard payment methods.
 */
export interface PaypalExpressTokenOutput {
  __typename?: "PaypalExpressTokenOutput";
  /**
   * A set of URLs that allow the buyer to authorize payment and adjust checkout details.
   */
  paypal_urls?: Maybe<PaypalExpressUrlList>;
  /**
   * The token returned by PayPal.
   */
  token?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains a set of URLs that allow the buyer to authorize payment and adjust checkout details for Express Checkout and Payments Standard transactions.
 */
export interface PaypalExpressUrlList {
  __typename?: "PaypalExpressUrlList";
  /**
   * The PayPal URL that allows the buyer to edit their checkout details.
   */
  edit?: Maybe<Scalars["String"]["output"]>;
  /**
   * The URL to the PayPal login page.
   */
  start?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains attributes specific to tangible products.
 */
export interface PhysicalProductInterface {
  __typename?: "BundleProduct" | "ConfigurableProduct" | "GroupedProduct" | "SimpleProduct";
  /**
   * The weight of the item, in units defined by the store.
   */
  weight?: Maybe<Scalars["Float"]["output"]>;
  $on: $PhysicalProductInterface;
}

/**
 * Defines Pickup Location information.
 */
export interface PickupLocation {
  __typename?: "PickupLocation";
  city?: Maybe<Scalars["String"]["output"]>;
  contact_name?: Maybe<Scalars["String"]["output"]>;
  country_id?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  fax?: Maybe<Scalars["String"]["output"]>;
  latitude?: Maybe<Scalars["Float"]["output"]>;
  longitude?: Maybe<Scalars["Float"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  phone?: Maybe<Scalars["String"]["output"]>;
  pickup_location_code?: Maybe<Scalars["String"]["output"]>;
  postcode?: Maybe<Scalars["String"]["output"]>;
  region?: Maybe<Scalars["String"]["output"]>;
  region_id?: Maybe<Scalars["Int"]["output"]>;
  street?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Top level object returned in a pickup locations search.
 */
export interface PickupLocations {
  __typename?: "PickupLocations";
  /**
   * An array of pickup locations that match the specific search request.
   */
  items?: Maybe<Array<Maybe<PickupLocation>>>;
  /**
   * An object that includes the page_info and currentPage values specified in the query.
   */
  page_info?: Maybe<SearchResultPageInfo>;
  /**
   * The number of products returned.
   */
  total_count?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * An error encountered while placing an order.
 */
export interface PlaceOrderError {
  __typename?: "PlaceOrderError";
  /**
   * An error code that is specific to place order.
   */
  code?: PlaceOrderErrorCodes;
  /**
   * A localized error message.
   */
  message?: Scalars["String"]["output"];
}

/**
 * Contains the results of the request to place an order.
 */
export interface PlaceOrderOutput {
  __typename?: "PlaceOrderOutput";
  /**
   * An array of place order errors.
   */
  errors: Array<Maybe<PlaceOrderError>>;
  /**
   * The ID of the order.
   * @deprecated Use `orderV2` instead.
   */
  order?: Maybe<Order>;
  /**
   * Full order information.
   */
  orderV2?: Maybe<CustomerOrder>;
}

/**
 * Deprecated. Use `ProductPrice` instead. Defines the price of a product as well as any tax-related adjustments.
 */
export interface Price {
  __typename?: "Price";
  /**
   * An array that provides information about tax, weee, or weee_tax adjustments.
   * @deprecated Use `ProductPrice` instead.
   */
  adjustments?: Maybe<Array<Maybe<PriceAdjustment>>>;
  /**
   * The price of a product plus a three-letter currency code.
   * @deprecated Use `ProductPrice` instead.
   */
  amount?: Maybe<Money>;
}

/**
 * Deprecated. Taxes will be included or excluded in the price. Defines the amount of money to apply as an adjustment, the type of adjustment to apply, and whether the item is included or excluded from the adjustment.
 */
export interface PriceAdjustment {
  __typename?: "PriceAdjustment";
  /**
   * The amount of the price adjustment and its currency code.
   */
  amount?: Maybe<Money>;
  /**
   * Indicates whether the adjustment involves tax, weee, or weee_tax.
   * @deprecated `PriceAdjustment` is deprecated.
   */
  code?: Maybe<PriceAdjustmentCodesEnum>;
  /**
   * Indicates whether the entity described by the code attribute is included or excluded from the adjustment.
   * @deprecated `PriceAdjustment` is deprecated.
   */
  description?: Maybe<PriceAdjustmentDescriptionEnum>;
}

/**
 * Can be used to retrieve the main price details in case of bundle product
 */
export interface PriceDetails {
  __typename?: "PriceDetails";
  /**
   * The percentage of discount applied to the main product price
   */
  discount_percentage?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The final price after applying the discount to the main product
   */
  main_final_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The regular price of the main product
   */
  main_price?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Contains the price range for a product. If the product has a single price, the minimum and maximum price will be the same.
 */
export interface PriceRange {
  __typename?: "PriceRange";
  /**
   * The highest possible price for the product.
   */
  maximum_price?: Maybe<ProductPrice>;
  /**
   * The lowest possible price for the product.
   */
  minimum_price: ProductPrice;
}

/**
 * Contains a product attribute code and value.
 */
export interface ProductAttribute {
  __typename?: "ProductAttribute";
  /**
   * The unique identifier for a product attribute code.
   */
  code?: Scalars["String"]["output"];
  /**
   * The display value of the attribute.
   */
  value?: Scalars["String"]["output"];
}

/**
 * Product custom attributes
 */
export interface ProductCustomAttributes {
  __typename?: "ProductCustomAttributes";
  /**
   * Errors when retrieving custom attributes metadata.
   */
  errors: Array<Maybe<AttributeMetadataError>>;
  /**
   * Requested custom attributes
   */
  items: Array<Maybe<AttributeValueInterface>>;
}

/**
 * Contains the discount applied to a product price.
 */
export interface ProductDiscount {
  __typename?: "ProductDiscount";
  /**
   * The actual value of the discount.
   */
  amount_off?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The discount expressed a percentage.
   */
  percent_off?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Contains product image information, including the image URL and label.
 */
export interface ProductImage {
  __typename?: "ProductImage";
  /**
   * Indicates whether the image is hidden from view.
   */
  disabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The label of the product image or video.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The media item's position after it has been sorted.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The URL of the product image or video.
   */
  url?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains fields that are common to all types of products.
 */
export interface ProductInterface {
  __typename?:
    | "BundleProduct"
    | "ConfigurableProduct"
    | "DownloadableProduct"
    | "GroupedProduct"
    | "SimpleProduct"
    | "VirtualProduct";
  /**
   * The attribute set assigned to the product.
   * @deprecated The field should not be used on the storefront.
   */
  attribute_set_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The categories assigned to a product.
   */
  categories?: Maybe<Array<Maybe<CategoryInterface>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  color?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The product's country of origin.
   */
  country_of_manufacture?: Maybe<Scalars["String"]["output"]>;
  /**
   * Timestamp indicating when the product was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Crosssell Products
   */
  crosssell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * Product custom attributes.
   */
  custom_attributesV2: (args?: {
    filters?: Maybe<AttributeFilterInput>;
  }) => Maybe<ProductCustomAttributes>;
  /**
   * Detailed information about the product. The value can include simple HTML tags.
   */
  description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  figure_size?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether a gift message is available.
   */
  gift_message_available?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID number assigned to the product.
   * @deprecated Use the `uid` field instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the main image on the product page.
   */
  image?: Maybe<ProductImage>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  is_suggested?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number representing the product's manufacturer.
   * @deprecated Use the `custom_attributes` field instead.
   */
  manufacturer?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  match_collezione2?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of media gallery objects.
   */
  media_gallery?: Maybe<Array<Maybe<MediaGalleryInterface>>>;
  /**
   * An array of MediaGalleryEntry objects.
   * @deprecated Use `media_gallery` instead.
   */
  media_gallery_entries?: Maybe<Array<Maybe<MediaGalleryEntry>>>;
  /**
   * A brief overview of the product for search results listings, maximum 255 characters.
   */
  meta_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * A comma-separated list of keywords that are visible only to search engines.
   */
  meta_keyword?: Maybe<Scalars["String"]["output"]>;
  /**
   * A string that is displayed in the title bar and tab of the browser and in search results lists.
   */
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The product name. Customers use this name to identify the product.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The beginning date for new product listings, and determines if the product is featured as a new product.
   */
  new_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The end date for new product listings.
   */
  new_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Product stock only x left count
   */
  only_x_left_in_stock?: Maybe<Scalars["Float"]["output"]>;
  /**
   * If the product has multiple options, determines where they appear on the product page.
   */
  options_container?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates the price of an item.
   * @deprecated Use `price_range` for product price information.
   */
  price?: Maybe<ProductPrices>;
  /**
   * The range of prices for the product
   */
  price_range: PriceRange;
  /**
   * An array of `TierPrice` objects.
   */
  price_tiers?: Maybe<Array<Maybe<TierPrice>>>;
  /**
   * An array of `ProductLinks` objects.
   */
  product_links?: Maybe<Array<Maybe<ProductLinksInterface>>>;
  /**
   * The average of all the ratings given to the product.
   */
  rating_summary?: Scalars["Float"]["output"];
  /**
   * An array of products to be displayed in a Related Products block.
   */
  related_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The total count of all the reviews given to the product.
   */
  review_count?: Scalars["Int"]["output"];
  /**
   * The list of products reviews.
   */
  reviews: (args?: {
    /**
     * The page of results to return. The default is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => ProductReviews;
  /**
   * A short description of the product. Its use depends on the theme.
   */
  short_description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  size?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number or code assigned to a product to identify the product, options, price, and manufacturer.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The relative path to the small image, which is used on catalog pages.
   */
  small_image?: Maybe<ProductImage>;
  /**
   * The beginning date that a product has a special price.
   * @deprecated The field should not be used on the storefront.
   */
  special_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The discounted price of the product.
   */
  special_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The end date for a product with a special price.
   */
  special_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Stock status of the product
   */
  stock_status?: Maybe<ProductStockStatus>;
  /**
   * The file name of a swatch image.
   */
  swatch_image?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tema?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the product's thumbnail image.
   */
  thumbnail?: Maybe<ProductImage>;
  /**
   * The price when tier pricing is in effect and the items purchased threshold has been reached.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of ProductTierPrices objects.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_prices?: Maybe<Array<Maybe<ProductTierPrices>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tipologia?: Maybe<Scalars["Int"]["output"]>;
  /**
   * One of simple, virtual, bundle, downloadable, grouped, or configurable.
   * @deprecated Use `__typename` instead.
   */
  type_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `ProductInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * Timestamp indicating when the product was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Upsell Products
   */
  upsell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The part of the URL that identifies the product
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use product's `canonical_url` or url rewrites instead
   */
  url_path?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL rewrites list
   */
  url_rewrites?: Maybe<Array<Maybe<UrlRewrite>>>;
  /**
   * The part of the product URL that is appended after the url key
   */
  url_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An array of websites in which the product is available.
   * @deprecated The field should not be used on the storefront.
   */
  websites?: Maybe<Array<Maybe<Website>>>;
  $on: $ProductInterface;
}

/**
 * An implementation of `ProductLinksInterface`.
 */
export interface ProductLinks {
  __typename?: "ProductLinks";
  /**
   * One of related, associated, upsell, or crosssell.
   */
  link_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * The SKU of the linked product.
   */
  linked_product_sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The type of linked product (simple, virtual, bundle, downloadable, grouped, configurable).
   */
  linked_product_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * The position within the list of product links.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The identifier of the linked product.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains information about linked products, including the link type and product type of each item.
 */
export interface ProductLinksInterface {
  __typename?: "ProductLinks";
  /**
   * One of related, associated, upsell, or crosssell.
   */
  link_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * The SKU of the linked product.
   */
  linked_product_sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The type of linked product (simple, virtual, bundle, downloadable, grouped, configurable).
   */
  linked_product_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * The position within the list of product links.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The identifier of the linked product.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  $on: $ProductLinksInterface;
}

/**
 * Contains an image in base64 format and basic information about the image.
 */
export interface ProductMediaGalleryEntriesContent {
  __typename?: "ProductMediaGalleryEntriesContent";
  /**
   * The image in base64 format.
   */
  base64_encoded_data?: Maybe<Scalars["String"]["output"]>;
  /**
   * The file name of the image.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The MIME type of the file, such as image/png.
   */
  type?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains a link to a video file and basic information about the video.
 */
export interface ProductMediaGalleryEntriesVideoContent {
  __typename?: "ProductMediaGalleryEntriesVideoContent";
  /**
   * Must be external-video.
   */
  media_type?: Maybe<Scalars["String"]["output"]>;
  /**
   * A description of the video.
   */
  video_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * Optional data about the video.
   */
  video_metadata?: Maybe<Scalars["String"]["output"]>;
  /**
   * Describes the video source.
   */
  video_provider?: Maybe<Scalars["String"]["output"]>;
  /**
   * The title of the video.
   */
  video_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The URL to the video.
   */
  video_url?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Represents a product price.
 */
export interface ProductPrice {
  __typename?: "ProductPrice";
  /**
   * The price discount. Represents the difference between the regular and final price.
   */
  discount?: Maybe<ProductDiscount>;
  /**
   * The final price of the product after applying discounts.
   */
  final_price: Money;
  /**
   * The regular price of the product.
   */
  regular_price: Money;
}

/**
 * Deprecated. Use `PriceRange` instead. Contains the regular price of an item, as well as its minimum and maximum prices. Only composite products, which include bundle, configurable, and grouped products, can contain a minimum and maximum price.
 */
export interface ProductPrices {
  __typename?: "ProductPrices";
  /**
   * The highest possible final price for all the options defined within a composite product. If you are specifying a price range, this would be the `to` value.
   * @deprecated Use `PriceRange.maximum_price` instead.
   */
  maximalPrice?: Maybe<Price>;
  /**
   * The lowest possible final price for all the options defined within a composite product. If you are specifying a price range, this would be the `from` value.
   * @deprecated Use `PriceRange.minimum_price` instead.
   */
  minimalPrice?: Maybe<Price>;
  /**
   * The base price of a product.
   * @deprecated Use `regular_price` from `PriceRange.minimum_price` or `PriceRange.maximum_price` instead.
   */
  regularPrice?: Maybe<Price>;
}

/**
 * Contains details of a product review.
 */
export interface ProductReview {
  __typename?: "ProductReview";
  /**
   * The average of all ratings for this product.
   */
  average_rating?: Scalars["Float"]["output"];
  /**
   * The date the review was created.
   */
  created_at?: Scalars["String"]["output"];
  /**
   * The customer's nickname. Defaults to the customer name, if logged in.
   */
  nickname?: Scalars["String"]["output"];
  /**
   * The reviewed product.
   */
  product: ProductInterface;
  /**
   * An array of ratings by rating category, such as quality, price, and value.
   */
  ratings_breakdown: Array<Maybe<ProductReviewRating>>;
  /**
   * The summary (title) of the review.
   */
  summary?: Scalars["String"]["output"];
  /**
   * The review text.
   */
  text?: Scalars["String"]["output"];
}

/**
 * Contains data about a single aspect of a product review.
 */
export interface ProductReviewRating {
  __typename?: "ProductReviewRating";
  /**
   * The label assigned to an aspect of a product that is being rated, such as quality or price.
   */
  name?: Scalars["String"]["output"];
  /**
   * The rating value given by customer. By default, possible values range from 1 to 5.
   */
  value?: Scalars["String"]["output"];
}

/**
 * Contains details about a single aspect of a product review.
 */
export interface ProductReviewRatingMetadata {
  __typename?: "ProductReviewRatingMetadata";
  /**
   * An encoded rating ID.
   */
  id?: Scalars["String"]["output"];
  /**
   * The label assigned to an aspect of a product that is being rated, such as quality or price.
   */
  name?: Scalars["String"]["output"];
  /**
   * List of product review ratings sorted by position.
   */
  values: Array<Maybe<ProductReviewRatingValueMetadata>>;
}

/**
 * Contains details about a single value in a product review.
 */
export interface ProductReviewRatingValueMetadata {
  __typename?: "ProductReviewRatingValueMetadata";
  /**
   * A ratings scale, such as the number of stars awarded.
   */
  value?: Scalars["String"]["output"];
  /**
   * An encoded rating value ID.
   */
  value_id?: Scalars["String"]["output"];
}

/**
 * Contains an array of metadata about each aspect of a product review.
 */
export interface ProductReviewRatingsMetadata {
  __typename?: "ProductReviewRatingsMetadata";
  /**
   * An array of product reviews sorted by position.
   */
  items: Array<Maybe<ProductReviewRatingMetadata>>;
}

/**
 * Contains an array of product reviews.
 */
export interface ProductReviews {
  __typename?: "ProductReviews";
  /**
   * An array of product reviews.
   */
  items: Array<Maybe<ProductReview>>;
  /**
   * Metadata for pagination rendering.
   */
  page_info: SearchResultPageInfo;
}

/**
 * Deprecated. Use `TierPrice` instead. Defines a tier price, which is a quantity discount offered to a specific customer group.
 */
export interface ProductTierPrices {
  __typename?: "ProductTierPrices";
  /**
   * The ID of the customer group.
   * @deprecated Not relevant for the storefront.
   */
  customer_group_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The percentage discount of the item.
   * @deprecated Use `TierPrice.discount` instead.
   */
  percentage_value?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The number of items that must be purchased to qualify for tier pricing.
   * @deprecated Use `TierPrice.quantity` instead.
   */
  qty?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The price of the fixed price item.
   * @deprecated Use `TierPrice.final_price` instead.
   */
  value?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The ID assigned to the website.
   * @deprecated Not relevant for the storefront.
   */
  website_id?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Contains information about a product video.
 */
export interface ProductVideo {
  __typename?: "ProductVideo";
  /**
   * Indicates whether the image is hidden from view.
   */
  disabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The label of the product image or video.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The media item's position after it has been sorted.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The URL of the product image or video.
   */
  url?: Maybe<Scalars["String"]["output"]>;
  /**
   * Contains a `ProductMediaGalleryEntriesVideoContent` object.
   */
  video_content?: Maybe<ProductMediaGalleryEntriesVideoContent>;
}

/**
 * Contains the results of a `products` query.
 */
export interface Products {
  __typename?: "Products";
  /**
   * A bucket that contains the attribute code and label for each filterable option.
   */
  aggregations: (args?: {
    filter?: Maybe<AggregationsFilterInput>;
  }) => Maybe<Array<Maybe<Aggregation>>>;
  /**
   * Layered navigation filters array.
   * @deprecated Use `aggregations` instead.
   */
  filters?: Maybe<Array<Maybe<LayerFilter>>>;
  /**
   * An array of products that match the specified search criteria.
   */
  items?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * An object that includes the page_info and currentPage values specified in the query.
   */
  page_info?: Maybe<SearchResultPageInfo>;
  /**
   * An object that includes the default sort field and all available sort fields.
   */
  sort_fields?: Maybe<SortFields>;
  /**
   * An array of search suggestions for case when search query have no results.
   */
  suggestions?: Maybe<Array<Maybe<SearchSuggestion>>>;
  /**
   * The number of products that are marked as visible. By default, in complex products, parent products are visible, but their child products are not.
   */
  total_count?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * Contains reCAPTCHA V3-Invisible configuration details.
 */
export interface ReCaptchaConfigurationV3 {
  __typename?: "ReCaptchaConfigurationV3";
  /**
   * The position of the invisible reCAPTCHA badge on each page.
   */
  badge_position?: Scalars["String"]["output"];
  /**
   * The message that appears to the user if validation fails.
   */
  failure_message?: Scalars["String"]["output"];
  /**
   * A list of forms on the storefront that have been configured to use reCAPTCHA V3.
   */
  forms?: Array<Maybe<ReCaptchaFormEnum>>;
  /**
   * Return whether recaptcha is enabled or not
   */
  is_enabled?: Scalars["Boolean"]["output"];
  /**
   * A two-character code that specifies the language that is used for Google reCAPTCHA text and messaging.
   */
  language_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The minimum score that identifies a user interaction as a potential risk.
   */
  minimum_score?: Scalars["Float"]["output"];
  /**
   * The website key generated when the Google reCAPTCHA account was registered.
   */
  website_key?: Scalars["String"]["output"];
}

export interface Region {
  __typename?: "Region";
  /**
   * The two-letter code for the region, such as TX for Texas.
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `Region` object.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The name of the region, such as Texas.
   */
  name?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains details about the cart after removing a coupon.
 */
export interface RemoveCouponFromCartOutput {
  __typename?: "RemoveCouponFromCartOutput";
  /**
   * The cart after removing a coupon.
   */
  cart?: Maybe<Cart>;
}

/**
 * Contains details about the cart after removing an item.
 */
export interface RemoveItemFromCartOutput {
  __typename?: "RemoveItemFromCartOutput";
  /**
   * The cart after removing an item.
   */
  cart: Cart;
}

/**
 * Contains the customer's wish list and any errors encountered.
 */
export interface RemoveProductsFromWishlistOutput {
  __typename?: "RemoveProductsFromWishlistOutput";
  /**
   * An array of errors encountered while deleting products from a wish list.
   */
  user_errors: Array<Maybe<WishListUserInputError>>;
  /**
   * Contains the wish list with after items were successfully deleted.
   */
  wishlist: Wishlist;
}

/**
 * Contains the cart and any errors after adding products.
 */
export interface ReorderItemsOutput {
  __typename?: "ReorderItemsOutput";
  /**
   * Detailed information about the customer's cart.
   */
  cart: Cart;
  /**
   * An array of reordering errors.
   */
  userInputErrors: Array<Maybe<CheckoutUserInputError>>;
}

/**
 * Contains the result of a request to revoke a customer token.
 */
export interface RevokeCustomerTokenOutput {
  __typename?: "RevokeCustomerTokenOutput";
  /**
   * The result of a request to revoke a customer token.
   */
  result?: Scalars["Boolean"]["output"];
}

/**
 * Routable entities serve as the model for a rendered page.
 */
export interface RoutableInterface {
  __typename?:
    | "BundleProduct"
    | "CategoryTree"
    | "CmsPage"
    | "ConfigurableProduct"
    | "DownloadableProduct"
    | "GroupedProduct"
    | "RoutableUrl"
    | "SimpleProduct"
    | "VirtualProduct";
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
  $on: $RoutableInterface;
}

/**
 * Default implementation of RoutableInterface. This type is returned when the URL is not linked to an entity.
 */
export interface RoutableUrl {
  __typename?: "RoutableUrl";
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
}

/**
 * Defines the name and value of a SDK parameter
 */
export interface SDKParams {
  __typename?: "SDKParams";
  /**
   * The name of the SDK parameter
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The value of the SDK parameter
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains details about a comment.
 */
export interface SalesCommentItem {
  __typename?: "SalesCommentItem";
  /**
   * The text of the message.
   */
  message?: Scalars["String"]["output"];
  /**
   * The timestamp of the comment.
   */
  timestamp?: Scalars["String"]["output"];
}

export interface SalesItemInterface {
  __typename?: "SalesItemInterface";
  /**
   * The entered gift message for the order item
   */
  gift_message?: Maybe<GiftMessage>;
}

/**
 * Provides navigation for the query response.
 */
export interface SearchResultPageInfo {
  __typename?: "SearchResultPageInfo";
  /**
   * The specific page to return.
   */
  current_page?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The maximum number of items to return per page of results.
   */
  page_size?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The total number of pages in the response.
   */
  total_pages?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * A string that contains search suggestion
 */
export interface SearchSuggestion {
  __typename?: "SearchSuggestion";
  /**
   * The search suggestion of existing product.
   */
  search?: Scalars["String"]["output"];
}

/**
 * Contains details about a selected bundle option.
 */
export interface SelectedBundleOption {
  __typename?: "SelectedBundleOption";
  /**
   * @deprecated Use `uid` instead
   */
  id?: Scalars["Int"]["output"];
  /**
   * The display name of the selected bundle product option.
   */
  label?: Scalars["String"]["output"];
  /**
   * The type of selected bundle product option.
   */
  type?: Scalars["String"]["output"];
  /**
   * The unique ID for a `SelectedBundleOption` object
   */
  uid?: Scalars["ID"]["output"];
  /**
   * An array of selected bundle option values.
   */
  values: Array<Maybe<SelectedBundleOptionValue>>;
}

/**
 * Contains details about a value for a selected bundle option.
 */
export interface SelectedBundleOptionValue {
  __typename?: "SelectedBundleOptionValue";
  /**
   * Use `uid` instead
   */
  id?: Scalars["Int"]["output"];
  /**
   * The display name of the value for the selected bundle product option.
   */
  label?: Scalars["String"]["output"];
  /**
   * The price of the value for the selected bundle product option.
   */
  price?: Scalars["Float"]["output"];
  /**
   * The quantity of the value for the selected bundle product option.
   */
  quantity?: Scalars["Float"]["output"];
  /**
   * The unique ID for a `SelectedBundleOptionValue` object
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Contains details about a selected configurable option.
 */
export interface SelectedConfigurableOption {
  __typename?: "SelectedConfigurableOption";
  /**
   * The unique ID for a `ConfigurableProductOptions` object.
   */
  configurable_product_option_uid?: Scalars["ID"]["output"];
  /**
   * The unique ID for a `ConfigurableProductOptionsValues` object.
   */
  configurable_product_option_value_uid?: Scalars["ID"]["output"];
  /**
   * @deprecated Use `SelectedConfigurableOption.configurable_product_option_uid` instead.
   */
  id?: Scalars["Int"]["output"];
  /**
   * The display text for the option.
   */
  option_label?: Scalars["String"]["output"];
  /**
   * @deprecated Use `SelectedConfigurableOption.configurable_product_option_value_uid` instead.
   */
  value_id?: Scalars["Int"]["output"];
  /**
   * The display name of the selected configurable option.
   */
  value_label?: Scalars["String"]["output"];
}

/**
 * Identifies a customized product that has been placed in a cart.
 */
export interface SelectedCustomizableOption {
  __typename?: "SelectedCustomizableOption";
  /**
   * The unique ID for a specific `CustomizableOptionInterface` object, such as a `CustomizableFieldOption`, `CustomizableFileOption`, or `CustomizableAreaOption` object.
   */
  customizable_option_uid?: Scalars["ID"]["output"];
  /**
   * @deprecated Use `SelectedCustomizableOption.customizable_option_uid` instead.
   */
  id?: Scalars["Int"]["output"];
  /**
   * Indicates whether the customizable option is required.
   */
  is_required?: Scalars["Boolean"]["output"];
  /**
   * The display name of the selected customizable option.
   */
  label?: Scalars["String"]["output"];
  /**
   * A value indicating the order to display this option.
   */
  sort_order?: Scalars["Int"]["output"];
  /**
   * The type of `CustomizableOptionInterface` object.
   */
  type?: Scalars["String"]["output"];
  /**
   * An array of selectable values.
   */
  values: Array<Maybe<SelectedCustomizableOptionValue>>;
}

/**
 * Identifies the value of the selected customized option.
 */
export interface SelectedCustomizableOptionValue {
  __typename?: "SelectedCustomizableOptionValue";
  /**
   * The unique ID for a value object that corresponds to the object represented by the `customizable_option_uid` attribute.
   */
  customizable_option_value_uid?: Scalars["ID"]["output"];
  /**
   * @deprecated Use `SelectedCustomizableOptionValue.customizable_option_value_uid` instead.
   */
  id?: Scalars["Int"]["output"];
  /**
   * The display name of the selected value.
   */
  label?: Scalars["String"]["output"];
  /**
   * The price of the selected customizable value.
   */
  price: CartItemSelectedOptionValuePrice;
  /**
   * The text identifying the selected value.
   */
  value?: Scalars["String"]["output"];
}

/**
 * Describes the payment method the shopper selected.
 */
export interface SelectedPaymentMethod {
  __typename?: "SelectedPaymentMethod";
  /**
   * The payment method code.
   */
  code?: Scalars["String"]["output"];
  /**
   * The purchase order number.
   */
  purchase_order_number?: Maybe<Scalars["String"]["output"]>;
  /**
   * The payment method title.
   */
  title?: Scalars["String"]["output"];
}

/**
 * Contains details about the selected shipping method and carrier.
 */
export interface SelectedShippingMethod {
  __typename?: "SelectedShippingMethod";
  /**
   * The cost of shipping using this shipping method.
   */
  amount: Money;
  /**
   * @deprecated The field should not be used on the storefront.
   */
  base_amount?: Maybe<Money>;
  /**
   * A string that identifies a commercial carrier or an offline shipping method.
   */
  carrier_code?: Scalars["String"]["output"];
  /**
   * The label for the carrier code.
   */
  carrier_title?: Scalars["String"]["output"];
  /**
   * A shipping method code associated with a carrier.
   */
  method_code?: Scalars["String"]["output"];
  /**
   * The label for the method code.
   */
  method_title?: Scalars["String"]["output"];
  /**
   * The cost of shipping using this shipping method, excluding tax.
   */
  price_excl_tax: Money;
  /**
   * The cost of shipping using this shipping method, including tax.
   */
  price_incl_tax: Money;
}

/**
 * Contains information about the sender and recipients.
 */
export interface SendEmailToFriendOutput {
  __typename?: "SendEmailToFriendOutput";
  /**
   * An array containing information about each recipient.
   */
  recipients?: Maybe<Array<Maybe<SendEmailToFriendRecipient>>>;
  /**
   * Information about the customer and the content of the message.
   */
  sender?: Maybe<SendEmailToFriendSender>;
}

/**
 * An output object that contains information about the recipient.
 */
export interface SendEmailToFriendRecipient {
  __typename?: "SendEmailToFriendRecipient";
  /**
   * The email address of the recipient.
   */
  email?: Scalars["String"]["output"];
  /**
   * The name of the recipient.
   */
  name?: Scalars["String"]["output"];
}

/**
 * An output object that contains information about the sender.
 */
export interface SendEmailToFriendSender {
  __typename?: "SendEmailToFriendSender";
  /**
   * The email address of the sender.
   */
  email?: Scalars["String"]["output"];
  /**
   * The text of the message to be sent.
   */
  message?: Scalars["String"]["output"];
  /**
   * The name of the sender.
   */
  name?: Scalars["String"]["output"];
}

/**
 * Contains details about the configuration of the Email to a Friend feature.
 */
export interface SendFriendConfiguration {
  __typename?: "SendFriendConfiguration";
  /**
   * Indicates whether the Email to a Friend feature is enabled.
   */
  enabled_for_customers?: Scalars["Boolean"]["output"];
  /**
   * Indicates whether the Email to a Friend feature is enabled for guests.
   */
  enabled_for_guests?: Scalars["Boolean"]["output"];
}

/**
 * Contains details about the cart after setting the billing address.
 */
export interface SetBillingAddressOnCartOutput {
  __typename?: "SetBillingAddressOnCartOutput";
  /**
   * The cart after setting the billing address.
   */
  cart: Cart;
}

/**
 * Sets the cart as inactive
 */
export interface SetCartAsInactiveOutput {
  __typename?: "SetCartAsInactiveOutput";
  /**
   * The error message returned after failing to set the cart as inactive
   */
  error?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the cart was set as inactive
   */
  success?: Scalars["Boolean"]["output"];
}

/**
 * Contains details about the cart after setting the email of a guest.
 */
export interface SetGuestEmailOnCartOutput {
  __typename?: "SetGuestEmailOnCartOutput";
  /**
   * The cart after setting the guest email.
   */
  cart: Cart;
}

/**
 * Contains details about the cart after setting the payment method.
 */
export interface SetPaymentMethodOnCartOutput {
  __typename?: "SetPaymentMethodOnCartOutput";
  /**
   * The cart after setting the payment method.
   */
  cart: Cart;
}

/**
 * Contains details about the cart after setting the shipping addresses.
 */
export interface SetShippingAddressesOnCartOutput {
  __typename?: "SetShippingAddressesOnCartOutput";
  /**
   * The cart after setting the shipping addresses.
   */
  cart: Cart;
}

/**
 * Contains details about the cart after setting the shipping methods.
 */
export interface SetShippingMethodsOnCartOutput {
  __typename?: "SetShippingMethodsOnCartOutput";
  /**
   * The cart after setting the shipping methods.
   */
  cart: Cart;
}

export interface ShipmentItem {
  __typename?: "ShipmentItem";
  /**
   * The unique ID for a `ShipmentItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The order item associated with the shipment item.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of shipped items.
   */
  quantity_shipped?: Scalars["Float"]["output"];
}

/**
 * Order shipment item details.
 */
export interface ShipmentItemInterface {
  __typename?: "BundleShipmentItem" | "ShipmentItem";
  /**
   * The unique ID for a `ShipmentItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * The order item associated with the shipment item.
   */
  order_item?: Maybe<OrderItemInterface>;
  /**
   * The name of the base product.
   */
  product_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The sale price for the base product.
   */
  product_sale_price: Money;
  /**
   * The SKU of the base product.
   */
  product_sku?: Scalars["String"]["output"];
  /**
   * The number of shipped items.
   */
  quantity_shipped?: Scalars["Float"]["output"];
  $on: $ShipmentItemInterface;
}

/**
 * Contains order shipment tracking details.
 */
export interface ShipmentTracking {
  __typename?: "ShipmentTracking";
  /**
   * The shipping carrier for the order delivery.
   */
  carrier?: Scalars["String"]["output"];
  /**
   * The tracking number of the order shipment.
   */
  number?: Maybe<Scalars["String"]["output"]>;
  /**
   * The shipment tracking title.
   */
  title?: Scalars["String"]["output"];
}

/**
 * Contains shipping addresses and methods.
 */
export interface ShippingCartAddress {
  __typename?: "ShippingCartAddress";
  /**
   * An array that lists the shipping methods that can be applied to the cart.
   */
  available_shipping_methods?: Maybe<Array<Maybe<AvailableShippingMethod>>>;
  /**
   * @deprecated Use `cart_items_v2` instead.
   */
  cart_items?: Maybe<Array<Maybe<CartItemQuantity>>>;
  /**
   * An array that lists the items in the cart.
   */
  cart_items_v2?: Maybe<Array<Maybe<CartItemInterface>>>;
  /**
   * The city specified for the billing or shipping address.
   */
  city?: Scalars["String"]["output"];
  /**
   * The company specified for the billing or shipping address.
   */
  company?: Maybe<Scalars["String"]["output"]>;
  /**
   * An object containing the country label and code.
   */
  country: CartAddressCountry;
  /**
   * Text provided by the shopper.
   */
  customer_notes?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's fax number.
   */
  fax?: Maybe<Scalars["String"]["output"]>;
  /**
   * The first name of the customer or guest.
   */
  firstname?: Scalars["String"]["output"];
  /**
   * @deprecated This information should not be exposed on the frontend.
   */
  items_weight?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The last name of the customer or guest.
   */
  lastname?: Scalars["String"]["output"];
  /**
   * The middle name of the person associated with the billing/shipping address.
   */
  middlename?: Maybe<Scalars["String"]["output"]>;
  pickup_location_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ZIP or postal code of the billing or shipping address.
   */
  postcode?: Maybe<Scalars["String"]["output"]>;
  /**
   * An honorific, such as Dr., Mr., or Mrs.
   */
  prefix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An object containing the region label and code.
   */
  region?: Maybe<CartAddressRegion>;
  /**
   * An object that describes the selected shipping method.
   */
  selected_shipping_method?: Maybe<SelectedShippingMethod>;
  /**
   * An array containing the street for the billing or shipping address.
   */
  street?: Array<Maybe<Scalars["String"]["output"]>>;
  /**
   * A value such as Sr., Jr., or III.
   */
  suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * The telephone number for the billing or shipping address.
   */
  telephone?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique id of the customer address.
   */
  uid?: Scalars["String"]["output"];
  /**
   * The VAT company number for billing or shipping address.
   */
  vat_id?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Defines an individual shipping discount. This discount can be applied to shipping.
 */
export interface ShippingDiscount {
  __typename?: "ShippingDiscount";
  /**
   * The amount of the discount.
   */
  amount: Money;
}

/**
 * Contains details about shipping and handling costs.
 */
export interface ShippingHandling {
  __typename?: "ShippingHandling";
  /**
   * The shipping amount, excluding tax.
   */
  amount_excluding_tax?: Maybe<Money>;
  /**
   * The shipping amount, including tax.
   */
  amount_including_tax?: Maybe<Money>;
  /**
   * The applied discounts to the shipping.
   */
  discounts?: Maybe<Array<Maybe<ShippingDiscount>>>;
  /**
   * Details about taxes applied for shipping.
   */
  taxes?: Maybe<Array<Maybe<TaxItem>>>;
  /**
   * The total amount for shipping.
   */
  total_amount: Money;
}

/**
 * An implementation for simple product cart items.
 */
export interface SimpleCartItem {
  __typename?: "SimpleCartItem";
  /**
   * An array containing the customizable options the shopper selected.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * An array of errors encountered while loading the cart item
   */
  errors?: Maybe<Array<Maybe<CartItemError>>>;
  /**
   * The entered gift message for the cart item
   */
  gift_message?: Maybe<GiftMessage>;
  /**
   * @deprecated Use `uid` instead.
   */
  id?: Scalars["String"]["output"];
  /**
   * True if requested quantity is less than available stock, false otherwise.
   */
  is_available?: Scalars["Boolean"]["output"];
  /**
   * Contains details about the price of the item, including taxes and discounts.
   */
  prices?: Maybe<CartItemPrices>;
  /**
   * Details about an item in the cart.
   */
  product: ProductInterface;
  /**
   * The quantity of this item in the cart.
   */
  quantity?: Scalars["Float"]["output"];
  /**
   * The unique ID for a `CartItemInterface` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Defines a simple product, which is tangible and is usually sold in single units or in fixed quantities.
 */
export interface SimpleProduct {
  __typename?: "SimpleProduct";
  /**
   * The attribute set assigned to the product.
   * @deprecated The field should not be used on the storefront.
   */
  attribute_set_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The categories assigned to a product.
   */
  categories?: Maybe<Array<Maybe<CategoryInterface>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  color?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The product's country of origin.
   */
  country_of_manufacture?: Maybe<Scalars["String"]["output"]>;
  /**
   * Timestamp indicating when the product was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Crosssell Products
   */
  crosssell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * Product custom attributes.
   */
  custom_attributesV2: (args?: {
    filters?: Maybe<AttributeFilterInput>;
  }) => Maybe<ProductCustomAttributes>;
  /**
   * Detailed information about the product. The value can include simple HTML tags.
   */
  description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  figure_size?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether a gift message is available.
   */
  gift_message_available?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID number assigned to the product.
   * @deprecated Use the `uid` field instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the main image on the product page.
   */
  image?: Maybe<ProductImage>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  is_suggested?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number representing the product's manufacturer.
   * @deprecated Use the `custom_attributes` field instead.
   */
  manufacturer?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  match_collezione2?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of media gallery objects.
   */
  media_gallery?: Maybe<Array<Maybe<MediaGalleryInterface>>>;
  /**
   * An array of MediaGalleryEntry objects.
   * @deprecated Use `media_gallery` instead.
   */
  media_gallery_entries?: Maybe<Array<Maybe<MediaGalleryEntry>>>;
  /**
   * A brief overview of the product for search results listings, maximum 255 characters.
   */
  meta_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * A comma-separated list of keywords that are visible only to search engines.
   */
  meta_keyword?: Maybe<Scalars["String"]["output"]>;
  /**
   * A string that is displayed in the title bar and tab of the browser and in search results lists.
   */
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The product name. Customers use this name to identify the product.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The beginning date for new product listings, and determines if the product is featured as a new product.
   */
  new_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The end date for new product listings.
   */
  new_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Product stock only x left count
   */
  only_x_left_in_stock?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of options for a customizable product.
   */
  options?: Maybe<Array<Maybe<CustomizableOptionInterface>>>;
  /**
   * If the product has multiple options, determines where they appear on the product page.
   */
  options_container?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates the price of an item.
   * @deprecated Use `price_range` for product price information.
   */
  price?: Maybe<ProductPrices>;
  /**
   * The range of prices for the product
   */
  price_range: PriceRange;
  /**
   * An array of `TierPrice` objects.
   */
  price_tiers?: Maybe<Array<Maybe<TierPrice>>>;
  /**
   * An array of `ProductLinks` objects.
   */
  product_links?: Maybe<Array<Maybe<ProductLinksInterface>>>;
  /**
   * The average of all the ratings given to the product.
   */
  rating_summary?: Scalars["Float"]["output"];
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * An array of products to be displayed in a Related Products block.
   */
  related_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The total count of all the reviews given to the product.
   */
  review_count?: Scalars["Int"]["output"];
  /**
   * The list of products reviews.
   */
  reviews: (args?: {
    /**
     * The page of results to return. The default is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => ProductReviews;
  /**
   * A short description of the product. Its use depends on the theme.
   */
  short_description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  size?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number or code assigned to a product to identify the product, options, price, and manufacturer.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The relative path to the small image, which is used on catalog pages.
   */
  small_image?: Maybe<ProductImage>;
  /**
   * The beginning date that a product has a special price.
   * @deprecated The field should not be used on the storefront.
   */
  special_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The discounted price of the product.
   */
  special_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The end date for a product with a special price.
   */
  special_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Stock status of the product
   */
  stock_status?: Maybe<ProductStockStatus>;
  /**
   * The file name of a swatch image.
   */
  swatch_image?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tema?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the product's thumbnail image.
   */
  thumbnail?: Maybe<ProductImage>;
  /**
   * The price when tier pricing is in effect and the items purchased threshold has been reached.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of ProductTierPrices objects.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_prices?: Maybe<Array<Maybe<ProductTierPrices>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tipologia?: Maybe<Scalars["Int"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
  /**
   * One of simple, virtual, bundle, downloadable, grouped, or configurable.
   * @deprecated Use `__typename` instead.
   */
  type_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `ProductInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * Timestamp indicating when the product was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Upsell Products
   */
  upsell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The part of the URL that identifies the product
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use product's `canonical_url` or url rewrites instead
   */
  url_path?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL rewrites list
   */
  url_rewrites?: Maybe<Array<Maybe<UrlRewrite>>>;
  /**
   * The part of the product URL that is appended after the url key
   */
  url_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An array of websites in which the product is available.
   * @deprecated The field should not be used on the storefront.
   */
  websites?: Maybe<Array<Maybe<Website>>>;
  /**
   * The weight of the item, in units defined by the store.
   */
  weight?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Contains a simple product wish list item.
 */
export interface SimpleWishlistItem {
  __typename?: "SimpleWishlistItem";
  /**
   * The date and time the item was added to the wish list.
   */
  added_at?: Scalars["String"]["output"];
  /**
   * Custom options selected for the wish list item.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * The description of the item.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `WishlistItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Product details of the wish list item.
   */
  product?: Maybe<ProductInterface>;
  /**
   * The quantity of this wish list item.
   */
  quantity?: Scalars["Float"]["output"];
}

export interface SmartButtonsConfig {
  __typename?: "SmartButtonsConfig";
  /**
   * Indicated whether to use App Switch on enabled mobile devices
   */
  app_switch_when_available?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The styles for the PayPal Smart Button configuration
   */
  button_styles?: Maybe<ButtonStyles>;
  /**
   * The payment method code as defined in the payment gateway
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether to display the PayPal Pay Later message
   */
  display_message?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether to display Venmo
   */
  display_venmo?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the payment method is displayed
   */
  is_visible?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Contains details about the styles for the PayPal Pay Later message
   */
  message_styles?: Maybe<MessageStyles>;
  /**
   * Defines the payment intent (Authorize or Capture
   */
  payment_intent?: Maybe<Scalars["String"]["output"]>;
  /**
   * The PayPal parameters required to load the JS SDK
   */
  sdk_params?: Maybe<Array<Maybe<SDKParams>>>;
  /**
   * The relative order the payment method is displayed on the checkout page
   */
  sort_order?: Maybe<Scalars["String"]["output"]>;
  /**
   * The name displayed for the payment method
   */
  title?: Maybe<Scalars["String"]["output"]>;
}

/**
 * SnowdogMenu defines all menu information
 */
export interface SnowdogMenu {
  __typename?: "SnowdogMenu";
  /**
   * Menu creation time
   */
  creation_time?: Scalars["String"]["output"];
  /**
   * Menu CSS class
   */
  css_class?: Maybe<Scalars["String"]["output"]>;
  /**
   * Menu identifier
   */
  identifier?: Scalars["String"]["output"];
  /**
   * Menu ID
   */
  menu_id?: Scalars["Int"]["output"];
  /**
   * Menu nodes
   */
  nodes?: Maybe<SnowdogMenuNodes>;
  /**
   * Menu title
   */
  title?: Scalars["String"]["output"];
  /**
   * Menu update time
   */
  update_time?: Scalars["String"]["output"];
}

/**
 * Snowdog menu CMS page node type
 */
export interface SnowdogMenuCmsPageNode {
  __typename?: "SnowdogMenuCmsPageNode";
  /**
   * Node additional data
   */
  additional_data?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * Node classes
   */
  classes?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node content
   */
  content?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node creation time
   */
  creation_time?: Scalars["String"]["output"];
  /**
   * Node level
   */
  level?: Scalars["Int"]["output"];
  /**
   * Menu ID
   */
  menu_id?: Scalars["Int"]["output"];
  /**
   * Node ID
   */
  node_id?: Scalars["Int"]["output"];
  /**
   * Node template
   */
  node_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node parent ID
   */
  parent_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Node position
   */
  position?: Scalars["Int"]["output"];
  /**
   * Node submenu template
   */
  submenu_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node title
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node type
   */
  type?: Scalars["String"]["output"];
  /**
   * Node update time
   */
  update_time?: Scalars["String"]["output"];
  /**
   * Returns the url key when available
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Snowdog menu custom URL node type
 */
export interface SnowdogMenuCustomUrlNode {
  __typename?: "SnowdogMenuCustomUrlNode";
  /**
   * Node additional data
   */
  additional_data?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * Node classes
   */
  classes?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node content
   */
  content?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node creation time
   */
  creation_time?: Scalars["String"]["output"];
  /**
   * Node image
   */
  image?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node image alt text
   */
  image_alt_text?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node level
   */
  level?: Scalars["Int"]["output"];
  /**
   * Menu ID
   */
  menu_id?: Scalars["Int"]["output"];
  /**
   * Node ID
   */
  node_id?: Scalars["Int"]["output"];
  /**
   * Node template
   */
  node_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node parent ID
   */
  parent_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Node position
   */
  position?: Scalars["Int"]["output"];
  /**
   * Node submenu template
   */
  submenu_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node target (false for '_self', true for '_blank')
   */
  target?: Scalars["Boolean"]["output"];
  /**
   * Node title
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node type
   */
  type?: Scalars["String"]["output"];
  /**
   * Node update time
   */
  update_time?: Scalars["String"]["output"];
  /**
   * Returns the url key when available
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
}

/**
 * SnowdogMenuCustomUrlNodeInterface contains custom URL nodes specific fields
 */
export interface SnowdogMenuCustomUrlNodeInterface {
  __typename?: "SnowdogMenuCustomUrlNode";
  /**
   * Node target (false for '_self', true for '_blank')
   */
  target?: Scalars["Boolean"]["output"];
  $on: $SnowdogMenuCustomUrlNodeInterface;
}

/**
 * Snowdog menu default node type
 */
export interface SnowdogMenuNode {
  __typename?: "SnowdogMenuNode";
  /**
   * Node additional data
   */
  additional_data?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * Node classes
   */
  classes?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node content
   */
  content?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node creation time
   */
  creation_time?: Scalars["String"]["output"];
  /**
   * Node image
   */
  image?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node image alt text
   */
  image_alt_text?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node level
   */
  level?: Scalars["Int"]["output"];
  /**
   * Menu ID
   */
  menu_id?: Scalars["Int"]["output"];
  /**
   * Node ID
   */
  node_id?: Scalars["Int"]["output"];
  /**
   * Node template
   */
  node_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node parent ID
   */
  parent_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Node position
   */
  position?: Scalars["Int"]["output"];
  /**
   * Node submenu template
   */
  submenu_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node title
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node type
   */
  type?: Scalars["String"]["output"];
  /**
   * Node update time
   */
  update_time?: Scalars["String"]["output"];
  /**
   * Returns the url key when available
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
}

/**
 * SnowdogMenuNodeContentFieldsInterface defines node content field
 */
export interface SnowdogMenuNodeContentFieldInterface {
  __typename?: "SnowdogMenuCmsPageNode" | "SnowdogMenuCustomUrlNode" | "SnowdogMenuNode";
  /**
   * Node content
   */
  content?: Maybe<Scalars["String"]["output"]>;
  $on: $SnowdogMenuNodeContentFieldInterface;
}

/**
 * SnowdogMenuNodeContentFieldsInterface defines node image fields
 */
export interface SnowdogMenuNodeImageFieldInterface {
  __typename?: "SnowdogMenuCustomUrlNode" | "SnowdogMenuNode";
  /**
   * Node image
   */
  image?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node image alt text
   */
  image_alt_text?: Maybe<Scalars["String"]["output"]>;
  $on: $SnowdogMenuNodeImageFieldInterface;
}

/**
 * SnowdogMenuNodeInterface contains the fields that are common to all types of nodes
 */
export interface SnowdogMenuNodeInterface {
  __typename?:
    | "SnowdogMenuCmsPageNode"
    | "SnowdogMenuCustomUrlNode"
    | "SnowdogMenuNode"
    | "SnowdogMenuWrapperNode";
  /**
   * Node additional data
   */
  additional_data?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * Node classes
   */
  classes?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node creation time
   */
  creation_time?: Scalars["String"]["output"];
  /**
   * Node level
   */
  level?: Scalars["Int"]["output"];
  /**
   * Menu ID
   */
  menu_id?: Scalars["Int"]["output"];
  /**
   * Node ID
   */
  node_id?: Scalars["Int"]["output"];
  /**
   * Node template
   */
  node_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node parent ID
   */
  parent_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Node position
   */
  position?: Scalars["Int"]["output"];
  /**
   * Node submenu template
   */
  submenu_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node title
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node type
   */
  type?: Scalars["String"]["output"];
  /**
   * Node update time
   */
  update_time?: Scalars["String"]["output"];
  /**
   * Returns the url key when available
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  $on: $SnowdogMenuNodeInterface;
}

/**
 * Menu nodes information
 */
export interface SnowdogMenuNodes {
  __typename?: "SnowdogMenuNodes";
  /**
   * An array of menu nodes
   */
  items?: Maybe<Array<Maybe<SnowdogMenuNodeInterface>>>;
}

/**
 * Snowdog menu wrapper node type
 */
export interface SnowdogMenuWrapperNode {
  __typename?: "SnowdogMenuWrapperNode";
  /**
   * Node additional data
   */
  additional_data?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /**
   * Node classes
   */
  classes?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node creation time
   */
  creation_time?: Scalars["String"]["output"];
  /**
   * Node level
   */
  level?: Scalars["Int"]["output"];
  /**
   * Menu ID
   */
  menu_id?: Scalars["Int"]["output"];
  /**
   * Node ID
   */
  node_id?: Scalars["Int"]["output"];
  /**
   * Node template
   */
  node_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node parent ID
   */
  parent_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Node position
   */
  position?: Scalars["Int"]["output"];
  /**
   * Node submenu template
   */
  submenu_template?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node title
   */
  title?: Maybe<Scalars["String"]["output"]>;
  /**
   * Node type
   */
  type?: Scalars["String"]["output"];
  /**
   * Node update time
   */
  update_time?: Scalars["String"]["output"];
  /**
   * Returns the url key when available
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Menus information
 */
export interface SnowdogMenus {
  __typename?: "SnowdogMenus";
  /**
   * An array of menus
   */
  items: Array<Maybe<SnowdogMenu>>;
}

/**
 * Defines a possible sort field.
 */
export interface SortField {
  __typename?: "SortField";
  /**
   * The label of the sort field.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The attribute code of the sort field.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains a default value for sort fields and all available sort fields.
 */
export interface SortFields {
  __typename?: "SortFields";
  /**
   * The default sort field value.
   */
  default?: Maybe<Scalars["String"]["output"]>;
  /**
   * An array of possible sort fields.
   */
  options?: Maybe<Array<Maybe<SortField>>>;
}

/**
 * Contains information about a store's configuration.
 */
export interface StoreConfig {
  __typename?: "StoreConfig";
  /**
   * Contains scripts that must be included in the HTML before the closing `<body>` tag.
   */
  absolute_footer?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether guest users can write product reviews. Possible values: 1 (Yes) and 0 (No).
   */
  allow_guests_to_write_product_reviews?: Maybe<Scalars["String"]["output"]>;
  /**
   * The value of the Allow Gift Messages for Order Items option
   */
  allow_items?: Maybe<Scalars["String"]["output"]>;
  /**
   * The value of the Allow Gift Messages on Order Level option
   */
  allow_order?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether to enable autocomplete on login and forgot password forms.
   */
  autocomplete_on_storefront?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The base currency code.
   */
  base_currency_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * A fully-qualified URL that is used to create relative links to the `base_url`.
   */
  base_link_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The fully-qualified URL that specifies the location of media files.
   */
  base_media_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The fully-qualified URL that specifies the location of static view files.
   */
  base_static_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The store’s fully-qualified base URL.
   */
  base_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * Extended Config Data - checkout/cart/delete_quote_after
   */
  cart_expires_in_days?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Extended Config Data - checkout/cart_link/use_qty
   */
  cart_summary_display_quantity?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The default sort order of the search results list.
   */
  catalog_default_sort_by?: Maybe<Scalars["String"]["output"]>;
  /**
   * The suffix applied to category pages, such as `.htm` or `.html`.
   */
  category_url_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether only specific countries can use this payment method.
   */
  check_money_order_enable_for_specific_countries?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the Check/Money Order payment method is enabled.
   */
  check_money_order_enabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The name of the party to whom the check must be payable.
   */
  check_money_order_make_check_payable_to?: Maybe<Scalars["String"]["output"]>;
  /**
   * The maximum order amount required to qualify for the Check/Money Order payment method.
   */
  check_money_order_max_order_total?: Maybe<Scalars["String"]["output"]>;
  /**
   * The minimum order amount required to qualify for the Check/Money Order payment method.
   */
  check_money_order_min_order_total?: Maybe<Scalars["String"]["output"]>;
  /**
   * The status of new orders placed using the Check/Money Order payment method.
   */
  check_money_order_new_order_status?: Maybe<Scalars["String"]["output"]>;
  /**
   * A comma-separated list of specific countries allowed to use the Check/Money Order payment method.
   */
  check_money_order_payment_from_specific_countries?: Maybe<Scalars["String"]["output"]>;
  /**
   * The full street address or PO Box where the checks are mailed.
   */
  check_money_order_send_check_to?: Maybe<Scalars["String"]["output"]>;
  /**
   * A number indicating the position of the Check/Money Order payment method in the list of available payment methods during checkout.
   */
  check_money_order_sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The title of the Check/Money Order payment method displayed on the storefront.
   */
  check_money_order_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The name of the CMS page that identifies the home page for the store.
   */
  cms_home_page?: Maybe<Scalars["String"]["output"]>;
  /**
   * A specific CMS page that displays when cookies are not enabled for the browser.
   */
  cms_no_cookies?: Maybe<Scalars["String"]["output"]>;
  /**
   * A specific CMS page that displays when a 404 'Page Not Found' error occurs.
   */
  cms_no_route?: Maybe<Scalars["String"]["output"]>;
  /**
   * A code assigned to the store to identify it.
   * @deprecated Use `store_code` instead.
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the `parent` or child (`itself`) thumbnail should be used in the cart for configurable products.
   */
  configurable_thumbnail_source?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the Contact Us form in enabled.
   */
  contact_enabled?: Scalars["Boolean"]["output"];
  /**
   * The copyright statement that appears at the bottom of each page.
   */
  copyright?: Maybe<Scalars["String"]["output"]>;
  /**
   * Extended Config Data - general/region/state_required
   */
  countries_with_required_region?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates if the new accounts need confirmation.
   */
  create_account_confirmation?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Customer access token lifetime.
   */
  customer_access_token_lifetime?: Maybe<Scalars["Float"]["output"]>;
  /**
   * Extended Config Data - general/country/default
   */
  default_country?: Maybe<Scalars["String"]["output"]>;
  /**
   * The description that provides a summary of your site for search engine listings. It should not be more than 160 characters in length.
   */
  default_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * The default display currency code.
   */
  default_display_currency_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * A series of keywords that describe your store, each separated by a comma.
   */
  default_keywords?: Maybe<Scalars["String"]["output"]>;
  /**
   * The title that appears at the title bar of each page when viewed in a browser.
   */
  default_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * Controls the display of the demo store notice at the top of the page. Options: 0 (No) or 1 (Yes).
   */
  demonotice?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Extended Config Data - general/region/display_all
   */
  display_state_if_optional?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The landing page that is associated with the base URL.
   */
  front?: Maybe<Scalars["String"]["output"]>;
  /**
   * The default number of products per page in Grid View.
   */
  grid_per_page?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A list of numbers that define how many products can be displayed in Grid View.
   */
  grid_per_page_values?: Maybe<Scalars["String"]["output"]>;
  /**
   * Scripts that must be included in the HTML before the closing `<head>` tag.
   */
  head_includes?: Maybe<Scalars["String"]["output"]>;
  /**
   * The small graphic image (favicon) that appears in the address bar and tab of the browser.
   */
  head_shortcut_icon?: Maybe<Scalars["String"]["output"]>;
  /**
   * The path to the logo that appears in the header.
   */
  header_logo_src?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID number assigned to the store.
   * @deprecated Use `store_code` instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether the store view has been designated as the default within the store group.
   */
  is_default_store?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the store group has been designated as the default within the website.
   */
  is_default_store_group?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Extended Config Data - checkout/options/guest_checkout
   */
  is_guest_checkout_enabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Extended Config Data - checkout/options/onepage_checkout_enabled
   */
  is_one_page_checkout_enabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The format of the search results list.
   */
  list_mode?: Maybe<Scalars["String"]["output"]>;
  /**
   * The default number of products per page in List View.
   */
  list_per_page?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A list of numbers that define how many products can be displayed in List View.
   */
  list_per_page_values?: Maybe<Scalars["String"]["output"]>;
  /**
   * The store locale.
   */
  locale?: Maybe<Scalars["String"]["output"]>;
  /**
   * The Alt text that is associated with the logo.
   */
  logo_alt?: Maybe<Scalars["String"]["output"]>;
  /**
   * The height of the logo image, in pixels.
   */
  logo_height?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The width of the logo image, in pixels.
   */
  logo_width?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether wishlists are enabled (1) or disabled (0).
   */
  magento_wishlist_general_is_enabled?: Maybe<Scalars["String"]["output"]>;
  /**
   * Extended Config Data - checkout/options/max_items_display_count
   */
  max_items_in_order_summary?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Extended Config Data - checkout/sidebar/display
   */
  minicart_display?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Extended Config Data - checkout/sidebar/count
   */
  minicart_max_items?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The minimum number of characters required for a valid password.
   */
  minimum_password_length?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether newsletters are enabled.
   */
  newsletter_enabled?: Scalars["Boolean"]["output"];
  /**
   * The default page that displays when a 404 'Page not Found' error occurs.
   */
  no_route?: Maybe<Scalars["String"]["output"]>;
  /**
   * Extended Config Data - general/country/optional_zip_countries
   */
  optional_zip_countries?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether orders can be cancelled by customers or not.
   */
  order_cancellation_enabled?: Scalars["Boolean"]["output"];
  /**
   * An array containing available cancellation reasons.
   */
  order_cancellation_reasons: Array<Maybe<CancellationReason>>;
  /**
   * Payflow Pro vault status.
   */
  payment_payflowpro_cc_vault_active?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether product reviews are enabled. Possible values: 1 (Yes) and 0 (No).
   */
  product_reviews_enabled?: Maybe<Scalars["String"]["output"]>;
  /**
   * The suffix applied to product pages, such as `.htm` or `.html`.
   */
  product_url_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * The number of different character classes (lowercase, uppercase, digits, special characters) required in a password.
   */
  required_character_classes_number?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID of the root category.
   * @deprecated Use `root_category_uid` instead.
   */
  root_category_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The unique ID for a `CategoryInterface` object.
   */
  root_category_uid?: Maybe<Scalars["ID"]["output"]>;
  /**
   * A secure fully-qualified URL that is used to create relative links to the `base_url`.
   */
  secure_base_link_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The secure fully-qualified URL that specifies the location of media files.
   */
  secure_base_media_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The secure fully-qualified URL that specifies the location of static view files.
   */
  secure_base_static_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The store’s fully-qualified secure base URL.
   */
  secure_base_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * Email to a Friend configuration.
   */
  send_friend?: Maybe<SendFriendConfiguration>;
  /**
   * Extended Config Data - tax/cart_display/full_summary
   */
  shopping_cart_display_full_summary?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Extended Config Data - tax/cart_display/grandtotal
   */
  shopping_cart_display_grand_total?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Extended Config Data - tax/cart_display/price
   */
  shopping_cart_display_price?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Extended Config Data - tax/cart_display/shipping
   */
  shopping_cart_display_shipping?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Extended Config Data - tax/cart_display/subtotal
   */
  shopping_cart_display_subtotal?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Extended Config Data - tax/cart_display/gift_wrapping
   */
  shopping_cart_display_tax_gift_wrapping?: Maybe<TaxWrappingEnum>;
  /**
   * Extended Config Data - tax/cart_display/zero_tax
   */
  shopping_cart_display_zero_tax?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether a breadcrumb trail appears on all CMS pages in the catalog. 0 (No) or 1 (Yes).
   */
  show_cms_breadcrumbs?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The unique ID of the store view. In the Admin, this is called the Store View Code. When making a GraphQL call, assign this value to the `Store` header to provide the scope.
   */
  store_code?: Maybe<Scalars["ID"]["output"]>;
  /**
   * The unique ID assigned to the store group. In the Admin, this is called the Store Name.
   */
  store_group_code?: Maybe<Scalars["ID"]["output"]>;
  /**
   * The label assigned to the store group.
   */
  store_group_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The label assigned to the store view.
   */
  store_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The store view sort order.
   */
  store_sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The time zone of the store.
   */
  timezone?: Maybe<Scalars["String"]["output"]>;
  /**
   * A prefix that appears before the title to create a two- or three-part title.
   */
  title_prefix?: Maybe<Scalars["String"]["output"]>;
  /**
   * The character that separates the category name and subcategory in the browser title bar.
   */
  title_separator?: Maybe<Scalars["String"]["output"]>;
  /**
   * A suffix that appears after the title to create a two- or three-part title.
   */
  title_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether the store code should be used in the URL.
   */
  use_store_in_url?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The unique ID for the website.
   */
  website_code?: Maybe<Scalars["ID"]["output"]>;
  /**
   * The ID number assigned to the website store.
   * @deprecated The field should not be used on the storefront.
   */
  website_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The label assigned to the website.
   */
  website_name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unit of weight.
   */
  weight_unit?: Maybe<Scalars["String"]["output"]>;
  /**
   * Text that appears in the header of the page and includes the name of the logged in customer.
   */
  welcome?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether only specific countries can use this payment method.
   */
  zero_subtotal_enable_for_specific_countries?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the Zero Subtotal payment method is enabled.
   */
  zero_subtotal_enabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The status of new orders placed using the Zero Subtotal payment method.
   */
  zero_subtotal_new_order_status?: Maybe<Scalars["String"]["output"]>;
  /**
   * When the new order status is 'Processing', this can be set to `authorize_capture` to automatically invoice all items that have a zero balance.
   */
  zero_subtotal_payment_action?: Maybe<Scalars["String"]["output"]>;
  /**
   * A comma-separated list of specific countries allowed to use the Zero Subtotal payment method.
   */
  zero_subtotal_payment_from_specific_countries?: Maybe<Scalars["String"]["output"]>;
  /**
   * A number indicating the position of the Zero Subtotal payment method in the list of available payment methods during checkout.
   */
  zero_subtotal_sort_order?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The title of the Zero Subtotal payment method displayed on the storefront.
   */
  zero_subtotal_title?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Indicates where an attribute can be displayed.
 */
export interface StorefrontProperties {
  __typename?: "StorefrontProperties";
  /**
   * The relative position of the attribute in the layered navigation block.
   */
  position?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether the attribute is filterable with results, without results, or not at all.
   */
  use_in_layered_navigation?: Maybe<UseInLayeredNavigationOptions>;
  /**
   * Indicates whether the attribute is displayed in product listings.
   */
  use_in_product_listing?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the attribute can be used in layered navigation on search results pages.
   */
  use_in_search_results_layered_navigation?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Indicates whether the attribute is displayed on product pages.
   */
  visible_on_catalog_pages?: Maybe<Scalars["Boolean"]["output"]>;
}

export interface StripePaymentMethod {
  __typename?: "StripePaymentMethod";
  /**
   * Card brand
   */
  brand?: Maybe<Scalars["String"]["output"]>;
  /**
   * UNIX timestamp representing the date that the payment method was created.
   */
  created?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether this saved payment method requires a CVC token to be submitted when placing an order.
   */
  cvc?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Card expiration month
   */
  exp_month?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Card expiration year
   */
  exp_year?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A unique identifier for the card number, tax id, bank account etc.
   */
  fingerprint?: Maybe<Scalars["String"]["output"]>;
  /**
   * A payment method icon URL that can be used at the front-end.
   */
  icon?: Maybe<Scalars["String"]["output"]>;
  /**
   * Payment method ID
   */
  id?: Scalars["ID"]["output"];
  /**
   * A formatted payment method label that you can display to the customer.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * The type of the payment method, i.e. card, klarna, sepa_debit.
   */
  type?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains the result of the `subscribeEmailToNewsletter` operation.
 */
export interface SubscribeEmailToNewsletterOutput {
  __typename?: "SubscribeEmailToNewsletterOutput";
  /**
   * The status of the subscription request.
   */
  status?: Maybe<SubscriptionStatusesEnum>;
}

/**
 * Describes the swatch type and a value.
 */
export interface SwatchData {
  __typename?: "SwatchData";
  /**
   * The type of swatch filter item: 1 - text; 2 - image.
   */
  type?: Maybe<Scalars["String"]["output"]>;
  /**
   * The value for the swatch item. It could be text or an image link.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

export interface SwatchDataInterface {
  __typename?: "ColorSwatchData" | "ImageSwatchData" | "TextSwatchData";
  /**
   * The value can be represented as color (HEX code), image link, or text.
   */
  value?: Maybe<Scalars["String"]["output"]>;
  $on: $SwatchDataInterface;
}

export interface SwatchLayerFilterItem {
  __typename?: "SwatchLayerFilterItem";
  /**
   * The count of items per filter.
   * @deprecated Use `AggregationOption.count` instead.
   */
  items_count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The label for a filter.
   * @deprecated Use `AggregationOption.label` instead.
   */
  label?: Maybe<Scalars["String"]["output"]>;
  /**
   * Data required to render a swatch filter item.
   */
  swatch_data?: Maybe<SwatchData>;
  /**
   * The value of a filter request variable to be used in query.
   * @deprecated Use `AggregationOption.value` instead.
   */
  value_string?: Maybe<Scalars["String"]["output"]>;
}

export interface SwatchLayerFilterItemInterface {
  __typename?: "SwatchLayerFilterItem";
  /**
   * Data required to render a swatch filter item.
   */
  swatch_data?: Maybe<SwatchData>;
  $on: $SwatchLayerFilterItemInterface;
}

/**
 * Contains tax item details.
 */
export interface TaxItem {
  __typename?: "TaxItem";
  /**
   * The amount of tax applied to the item.
   */
  amount: Money;
  /**
   * The rate used to calculate the tax.
   */
  rate?: Scalars["Float"]["output"];
  /**
   * A title that describes the tax.
   */
  title?: Scalars["String"]["output"];
}

export interface TextSwatchData {
  __typename?: "TextSwatchData";
  /**
   * The value can be represented as color (HEX code), image link, or text.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Defines a price based on the quantity purchased.
 */
export interface TierPrice {
  __typename?: "TierPrice";
  /**
   * The price discount that this tier represents.
   */
  discount?: Maybe<ProductDiscount>;
  /**
   * The price of the product at this tier.
   */
  final_price?: Maybe<Money>;
  /**
   * The minimum number of items that must be purchased to qualify for this price tier.
   */
  quantity?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * Contains details about the cart after updating items.
 */
export interface UpdateCartItemsOutput {
  __typename?: "UpdateCartItemsOutput";
  /**
   * The cart after updating products.
   */
  cart: Cart;
}

/**
 * Contains the customer's wish list and any errors encountered.
 */
export interface UpdateProductsInWishlistOutput {
  __typename?: "UpdateProductsInWishlistOutput";
  /**
   * An array of errors encountered while updating products in a wish list.
   */
  user_errors: Array<Maybe<WishListUserInputError>>;
  /**
   * Contains the wish list with all items that were successfully updated.
   */
  wishlist: Wishlist;
}

/**
 * Contains URL rewrite details.
 */
export interface UrlRewrite {
  __typename?: "UrlRewrite";
  /**
   * An array of request parameters.
   */
  parameters?: Maybe<Array<Maybe<HttpQueryParameter>>>;
  /**
   * The request URL.
   */
  url?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Defines a customer attribute validation rule.
 */
export interface ValidationRule {
  __typename?: "ValidationRule";
  /**
   * Validation rule name applied to a customer attribute.
   */
  name?: Maybe<ValidationRuleEnum>;
  /**
   * Validation rule value.
   */
  value?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Retrieves the vault configuration
 */
export interface VaultConfigOutput {
  __typename?: "VaultConfigOutput";
  /**
   * Credit card vault method configuration
   */
  credit_card?: Maybe<VaultCreditCardConfig>;
}

export interface VaultCreditCardConfig {
  __typename?: "VaultCreditCardConfig";
  /**
   * Is vault enabled
   */
  is_vault_enabled?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The parameters required to load the Paypal JS SDK
   */
  sdk_params?: Maybe<Array<Maybe<SDKParams>>>;
  /**
   * 3DS mode
   */
  three_ds_mode?: Maybe<ThreeDSMode>;
}

/**
 * An implementation for virtual product cart items.
 */
export interface VirtualCartItem {
  __typename?: "VirtualCartItem";
  /**
   * An array containing customizable options the shopper selected.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * An array of errors encountered while loading the cart item
   */
  errors?: Maybe<Array<Maybe<CartItemError>>>;
  /**
   * @deprecated Use `uid` instead.
   */
  id?: Scalars["String"]["output"];
  /**
   * True if requested quantity is less than available stock, false otherwise.
   */
  is_available?: Scalars["Boolean"]["output"];
  /**
   * Contains details about the price of the item, including taxes and discounts.
   */
  prices?: Maybe<CartItemPrices>;
  /**
   * Details about an item in the cart.
   */
  product: ProductInterface;
  /**
   * The quantity of this item in the cart.
   */
  quantity?: Scalars["Float"]["output"];
  /**
   * The unique ID for a `CartItemInterface` object.
   */
  uid?: Scalars["ID"]["output"];
}

/**
 * Defines a virtual product, which is a non-tangible product that does not require shipping and is not kept in inventory.
 */
export interface VirtualProduct {
  __typename?: "VirtualProduct";
  /**
   * The attribute set assigned to the product.
   * @deprecated The field should not be used on the storefront.
   */
  attribute_set_id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
   */
  canonical_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The categories assigned to a product.
   */
  categories?: Maybe<Array<Maybe<CategoryInterface>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  color?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The product's country of origin.
   */
  country_of_manufacture?: Maybe<Scalars["String"]["output"]>;
  /**
   * Timestamp indicating when the product was created.
   * @deprecated The field should not be used on the storefront.
   */
  created_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Crosssell Products
   */
  crosssell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * Product custom attributes.
   */
  custom_attributesV2: (args?: {
    filters?: Maybe<AttributeFilterInput>;
  }) => Maybe<ProductCustomAttributes>;
  /**
   * Detailed information about the product. The value can include simple HTML tags.
   */
  description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  figure_size?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates whether a gift message is available.
   */
  gift_message_available?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID number assigned to the product.
   * @deprecated Use the `uid` field instead.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the main image on the product page.
   */
  image?: Maybe<ProductImage>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  is_suggested?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number representing the product's manufacturer.
   * @deprecated Use the `custom_attributes` field instead.
   */
  manufacturer?: Maybe<Scalars["Int"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  match_collezione2?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of media gallery objects.
   */
  media_gallery?: Maybe<Array<Maybe<MediaGalleryInterface>>>;
  /**
   * An array of MediaGalleryEntry objects.
   * @deprecated Use `media_gallery` instead.
   */
  media_gallery_entries?: Maybe<Array<Maybe<MediaGalleryEntry>>>;
  /**
   * A brief overview of the product for search results listings, maximum 255 characters.
   */
  meta_description?: Maybe<Scalars["String"]["output"]>;
  /**
   * A comma-separated list of keywords that are visible only to search engines.
   */
  meta_keyword?: Maybe<Scalars["String"]["output"]>;
  /**
   * A string that is displayed in the title bar and tab of the browser and in search results lists.
   */
  meta_title?: Maybe<Scalars["String"]["output"]>;
  /**
   * The product name. Customers use this name to identify the product.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The beginning date for new product listings, and determines if the product is featured as a new product.
   */
  new_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The end date for new product listings.
   */
  new_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Product stock only x left count
   */
  only_x_left_in_stock?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of options for a customizable product.
   */
  options?: Maybe<Array<Maybe<CustomizableOptionInterface>>>;
  /**
   * If the product has multiple options, determines where they appear on the product page.
   */
  options_container?: Maybe<Scalars["String"]["output"]>;
  /**
   * Indicates the price of an item.
   * @deprecated Use `price_range` for product price information.
   */
  price?: Maybe<ProductPrices>;
  /**
   * The range of prices for the product
   */
  price_range: PriceRange;
  /**
   * An array of `TierPrice` objects.
   */
  price_tiers?: Maybe<Array<Maybe<TierPrice>>>;
  /**
   * An array of `ProductLinks` objects.
   */
  product_links?: Maybe<Array<Maybe<ProductLinksInterface>>>;
  /**
   * The average of all the ratings given to the product.
   */
  rating_summary?: Scalars["Float"]["output"];
  /**
   * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
   */
  redirect_code?: Scalars["Int"]["output"];
  /**
   * An array of products to be displayed in a Related Products block.
   */
  related_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
   */
  relative_url?: Maybe<Scalars["String"]["output"]>;
  /**
   * The total count of all the reviews given to the product.
   */
  review_count?: Scalars["Int"]["output"];
  /**
   * The list of products reviews.
   */
  reviews: (args?: {
    /**
     * The page of results to return. The default is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The maximum number of results to return at once. The default is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => ProductReviews;
  /**
   * A short description of the product. Its use depends on the theme.
   */
  short_description?: Maybe<ComplexTextValue>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  size?: Maybe<Scalars["Int"]["output"]>;
  /**
   * A number or code assigned to a product to identify the product, options, price, and manufacturer.
   */
  sku?: Maybe<Scalars["String"]["output"]>;
  /**
   * The relative path to the small image, which is used on catalog pages.
   */
  small_image?: Maybe<ProductImage>;
  /**
   * The beginning date that a product has a special price.
   * @deprecated The field should not be used on the storefront.
   */
  special_from_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * The discounted price of the product.
   */
  special_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * The end date for a product with a special price.
   */
  special_to_date?: Maybe<Scalars["String"]["output"]>;
  /**
   * Stock status of the product
   */
  stock_status?: Maybe<ProductStockStatus>;
  /**
   * The file name of a swatch image.
   */
  swatch_image?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tema?: Maybe<Scalars["Int"]["output"]>;
  /**
   * The relative path to the product's thumbnail image.
   */
  thumbnail?: Maybe<ProductImage>;
  /**
   * The price when tier pricing is in effect and the items purchased threshold has been reached.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_price?: Maybe<Scalars["Float"]["output"]>;
  /**
   * An array of ProductTierPrices objects.
   * @deprecated Use `price_tiers` for product tier price information.
   */
  tier_prices?: Maybe<Array<Maybe<ProductTierPrices>>>;
  /**
   * @deprecated Use the `custom_attributes` field instead.
   */
  tipologia?: Maybe<Scalars["Int"]["output"]>;
  /**
   * One of PRODUCT, CATEGORY, or CMS_PAGE.
   */
  type?: Maybe<UrlRewriteEntityTypeEnum>;
  /**
   * One of simple, virtual, bundle, downloadable, grouped, or configurable.
   * @deprecated Use `__typename` instead.
   */
  type_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `ProductInterface` object.
   */
  uid?: Scalars["ID"]["output"];
  /**
   * Timestamp indicating when the product was updated.
   * @deprecated The field should not be used on the storefront.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * Upsell Products
   */
  upsell_products?: Maybe<Array<Maybe<ProductInterface>>>;
  /**
   * The part of the URL that identifies the product
   */
  url_key?: Maybe<Scalars["String"]["output"]>;
  /**
   * @deprecated Use product's `canonical_url` or url rewrites instead
   */
  url_path?: Maybe<Scalars["String"]["output"]>;
  /**
   * URL rewrites list
   */
  url_rewrites?: Maybe<Array<Maybe<UrlRewrite>>>;
  /**
   * The part of the product URL that is appended after the url key
   */
  url_suffix?: Maybe<Scalars["String"]["output"]>;
  /**
   * An array of websites in which the product is available.
   * @deprecated The field should not be used on the storefront.
   */
  websites?: Maybe<Array<Maybe<Website>>>;
}

/**
 * Contains a virtual product wish list item.
 */
export interface VirtualWishlistItem {
  __typename?: "VirtualWishlistItem";
  /**
   * The date and time the item was added to the wish list.
   */
  added_at?: Scalars["String"]["output"];
  /**
   * Custom options selected for the wish list item.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * The description of the item.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `WishlistItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Product details of the wish list item.
   */
  product?: Maybe<ProductInterface>;
  /**
   * The quantity of this wish list item.
   */
  quantity?: Scalars["Float"]["output"];
}

/**
 * Deprecated. It should not be used on the storefront. Contains information about a website.
 */
export interface Website {
  __typename?: "Website";
  /**
   * A code assigned to the website to identify it.
   * @deprecated The field should not be used on the storefront.
   */
  code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The default group ID of the website.
   * @deprecated The field should not be used on the storefront.
   */
  default_group_id?: Maybe<Scalars["String"]["output"]>;
  /**
   * The ID number assigned to the website.
   * @deprecated The field should not be used on the storefront.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Indicates whether this is the default website.
   * @deprecated The field should not be used on the storefront.
   */
  is_default?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The website name. Websites use this name to identify it easier.
   * @deprecated The field should not be used on the storefront.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The attribute to use for sorting websites.
   * @deprecated The field should not be used on the storefront.
   */
  sort_order?: Maybe<Scalars["Int"]["output"]>;
}

/**
 * An error encountered while performing operations with WishList.
 */
export interface WishListUserInputError {
  __typename?: "WishListUserInputError";
  /**
   * A wish list-specific error code.
   */
  code?: WishListUserInputErrorType;
  /**
   * A localized error message.
   */
  message?: Scalars["String"]["output"];
}

/**
 * Contains a customer wish list.
 */
export interface Wishlist {
  __typename?: "Wishlist";
  /**
   * The unique ID for a `Wishlist` object.
   */
  id?: Maybe<Scalars["ID"]["output"]>;
  /**
   * @deprecated Use the `items_v2` field instead.
   */
  items?: Maybe<Array<Maybe<WishlistItem>>>;
  /**
   * The number of items in the wish list.
   */
  items_count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * An array of items in the customer's wish list.
   */
  items_v2: (args?: {
    /**
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<WishlistItems>;
  /**
   * An encrypted code that Magento uses to link to the wish list.
   */
  sharing_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The time of the last modification to the wish list.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
}

/**
 * Contains details about errors encountered when a customer added wish list items to the cart.
 */
export interface WishlistCartUserInputError {
  __typename?: "WishlistCartUserInputError";
  /**
   * An error code that describes the error encountered.
   */
  code?: WishlistCartUserInputErrorType;
  /**
   * A localized error message.
   */
  message?: Scalars["String"]["output"];
  /**
   * The unique ID of the `Wishlist` object containing an error.
   */
  wishlistId?: Scalars["ID"]["output"];
  /**
   * The unique ID of the wish list item containing an error.
   */
  wishlistItemId?: Scalars["ID"]["output"];
}

/**
 * Contains details about a wish list item.
 */
export interface WishlistItem {
  __typename?: "WishlistItem";
  /**
   * The time when the customer added the item to the wish list.
   */
  added_at?: Maybe<Scalars["String"]["output"]>;
  /**
   * The customer's comment about this item.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `WishlistItem` object.
   */
  id?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Details about the wish list item.
   */
  product?: Maybe<ProductInterface>;
  /**
   * The quantity of this wish list item
   */
  qty?: Maybe<Scalars["Float"]["output"]>;
}

/**
 * The interface for wish list items.
 */
export interface WishlistItemInterface {
  __typename?:
    | "BundleWishlistItem"
    | "ConfigurableWishlistItem"
    | "DownloadableWishlistItem"
    | "GroupedProductWishlistItem"
    | "SimpleWishlistItem"
    | "VirtualWishlistItem";
  /**
   * The date and time the item was added to the wish list.
   */
  added_at?: Scalars["String"]["output"];
  /**
   * Custom options selected for the wish list item.
   */
  customizable_options: Array<Maybe<SelectedCustomizableOption>>;
  /**
   * The description of the item.
   */
  description?: Maybe<Scalars["String"]["output"]>;
  /**
   * The unique ID for a `WishlistItemInterface` object.
   */
  id?: Scalars["ID"]["output"];
  /**
   * Product details of the wish list item.
   */
  product?: Maybe<ProductInterface>;
  /**
   * The quantity of this wish list item.
   */
  quantity?: Scalars["Float"]["output"];
  $on: $WishlistItemInterface;
}

/**
 * Contains an array of items in a wish list.
 */
export interface WishlistItems {
  __typename?: "WishlistItems";
  /**
   * A list of items in the wish list.
   */
  items: Array<Maybe<WishlistItemInterface>>;
  /**
   * Contains pagination metadata.
   */
  page_info?: Maybe<SearchResultPageInfo>;
}

/**
 * Deprecated: Use the `Wishlist` type instead.
 */
export interface WishlistOutput {
  __typename?: "WishlistOutput";
  /**
   * An array of items in the customer's wish list
   * @deprecated Use the `Wishlist.items` field instead.
   */
  items?: Maybe<Array<Maybe<WishlistItem>>>;
  /**
   * The number of items in the wish list.
   * @deprecated Use the `Wishlist.items_count` field instead.
   */
  items_count?: Maybe<Scalars["Int"]["output"]>;
  /**
   * When multiple wish lists are enabled, the name the customer assigns to the wishlist.
   * @deprecated This field is related to Commerce functionality and is always `null` in Open Source.
   */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * An encrypted code that links to the wish list.
   * @deprecated Use the `Wishlist.sharing_code` field instead.
   */
  sharing_code?: Maybe<Scalars["String"]["output"]>;
  /**
   * The time of the last modification to the wish list.
   * @deprecated Use the `Wishlist.updated_at` field instead.
   */
  updated_at?: Maybe<Scalars["String"]["output"]>;
}

export interface Mutation {
  __typename?: "Mutation";
  /**
   * Add one or more bundle products to the specified cart. We recommend using `addProductsToCart` instead.
   */
  addBundleProductsToCart: (args?: {
    /**
     * An input object that defines which bundle products to add to the cart.
     */
    input?: Maybe<AddBundleProductsToCartInput>;
  }) => Maybe<AddBundleProductsToCartOutput>;
  /**
   * Add one or more configurable products to the specified cart. We recommend using `addProductsToCart` instead.
   */
  addConfigurableProductsToCart: (args?: {
    /**
     * An input object that defines which configurable products to add to the cart.
     */
    input?: Maybe<AddConfigurableProductsToCartInput>;
  }) => Maybe<AddConfigurableProductsToCartOutput>;
  /**
   * Add one or more downloadable products to the specified cart. We recommend using `addProductsToCart` instead.
   */
  addDownloadableProductsToCart: (args?: {
    /**
     * An input object that defines which downloadable products to add to the cart.
     */
    input?: Maybe<AddDownloadableProductsToCartInput>;
  }) => Maybe<AddDownloadableProductsToCartOutput>;
  /**
   * Add any type of product to the cart.
   */
  addProductsToCart: (args: {
    /**
     * The cart ID of the shopper.
     */
    cartId: Scalars["String"]["input"];
    /**
     * An array that defines the products to add to the cart.
     */
    cartItems: Array<CartItemInput>;
  }) => Maybe<AddProductsToCartOutput>;
  /**
   * Add products to the specified compare list.
   */
  addProductsToCompareList: (args?: {
    /**
     * An input object that defines which products to add to an existing compare list.
     */
    input?: Maybe<AddProductsToCompareListInput>;
  }) => Maybe<CompareList>;
  /**
   * Creates a new cart and add any type of product to it
   */
  addProductsToNewCart: (args: {
    /**
     * An array that defines the products to add to the new cart
     */
    cartItems: Array<CartItemInput>;
  }) => Maybe<AddProductsToNewCartOutput>;
  /**
   * Add one or more products to the specified wish list. This mutation supports all product types.
   */
  addProductsToWishlist: (args: {
    /**
     * The ID of a wish list.
     */
    wishlistId: Scalars["ID"]["input"];
    /**
     * An array of products to add to the wish list.
     */
    wishlistItems: Array<WishlistItemInput>;
  }) => Maybe<AddProductsToWishlistOutput>;
  /**
   * Add one or more simple products to the specified cart. We recommend using `addProductsToCart` instead.
   */
  addSimpleProductsToCart: (args?: {
    /**
     * An input object that defines which simple products to add to the cart.
     */
    input?: Maybe<AddSimpleProductsToCartInput>;
  }) => Maybe<AddSimpleProductsToCartOutput>;
  /**
   * Saves a payment method on the logged in customer
   */
  addStripePaymentMethod: (args: { input: StripePaymentMethodId }) => Maybe<StripePaymentMethod>;
  /**
   * Add one or more virtual products to the specified cart. We recommend using `addProductsToCart` instead.
   */
  addVirtualProductsToCart: (args?: {
    /**
     * An input object that defines which virtual products to add to the cart.
     */
    input?: Maybe<AddVirtualProductsToCartInput>;
  }) => Maybe<AddVirtualProductsToCartOutput>;
  /**
   * Add items in the specified wishlist to the customer's cart.
   */
  addWishlistItemsToCart: (args: {
    /**
     * The unique ID of the wish list
     */
    wishlistId: Scalars["ID"]["input"];
    /**
     * An array of IDs representing products to be added to the cart. If no IDs are specified, all items in the wishlist will be added to the cart
     */
    wishlistItemIds?: Maybe<Array<Scalars["ID"]["input"]>>;
  }) => Maybe<AddWishlistItemsToCartOutput>;
  /**
   * Apply a pre-defined coupon code to the specified cart.
   */
  applyCouponToCart: (args?: {
    /**
     * An input object that defines the coupon code to apply to the cart.
     */
    input?: Maybe<ApplyCouponToCartInput>;
  }) => Maybe<ApplyCouponToCartOutput>;
  /**
   * Assign the specified compare list to the logged in customer.
   */
  assignCompareListToCustomer: (args: {
    /**
     * The unique ID of the compare list to be assigned.
     */
    uid: Scalars["ID"]["input"];
  }) => Maybe<AssignCompareListToCustomerOutput>;
  /**
   * Assign a logged-in customer to the specified guest shopping cart.
   */
  assignCustomerToGuestCart: (args: { cart_id: Scalars["String"]["input"] }) => Cart;
  /**
   * Cancel the specified customer order.
   */
  cancelOrder: (args: { input: CancelOrderInput }) => Maybe<CancelOrderOutput>;
  /**
   * Change the password for the logged-in customer.
   */
  changeCustomerPassword: (args: {
    /**
     * The customer's original password.
     */
    currentPassword: Scalars["String"]["input"];
    /**
     * The customer's updated password.
     */
    newPassword: Scalars["String"]["input"];
  }) => Maybe<Customer>;
  /**
   * Synchronizes order details and place the order
   */
  completeOrder: (args?: {
    /**
     * Describes the variables needed to complete or place the order
     */
    input?: Maybe<CompleteOrderInput>;
  }) => Maybe<PlaceOrderOutput>;
  /**
   * Confirms the email address for a customer.
   */
  confirmEmail: (args: {
    /**
     * An input object to identify the customer to confirm the email.
     */
    input: ConfirmEmailInput;
  }) => Maybe<CustomerOutput>;
  /**
   * Send a 'Contact Us' email to the merchant.
   */
  contactUs: (args: {
    /**
     * An input object that defines shopper information.
     */
    input: ContactUsInput;
  }) => Maybe<ContactUsOutput>;
  /**
   * Create a new compare list. The compare list is saved for logged in customers.
   */
  createCompareList: (args?: { input?: Maybe<CreateCompareListInput> }) => Maybe<CompareList>;
  /**
   * Use `createCustomerV2` instead.
   */
  createCustomer: (args: {
    /**
     * An input object that defines the customer to be created.
     */
    input: CustomerInput;
  }) => Maybe<CustomerOutput>;
  /**
   * Create a billing or shipping address for a customer or guest.
   */
  createCustomerAddress: (args: { input: CustomerAddressInput }) => Maybe<CustomerAddress>;
  /**
   * Create a customer account.
   */
  createCustomerV2: (args: {
    /**
     * An input object that defines the customer to be created.
     */
    input: CustomerCreateInput;
  }) => Maybe<CustomerOutput>;
  /**
   * Create an empty shopping cart for a guest or logged in user
   * @deprecated Use `Mutation.createGuestCart` or `Query.customerCart` for logged in customer
   */
  createEmptyCart: (args?: {
    /**
     * An optional input object that assigns the specified ID to the cart.
     */
    input?: Maybe<createEmptyCartInput>;
  }) => Maybe<Scalars["String"]["output"]>;
  /**
   * Create a new shopping cart
   */
  createGuestCart: (args?: { input?: Maybe<CreateGuestCartInput> }) => Maybe<CreateGuestCartOutput>;
  /**
   * Initiate a transaction and receive a token. Use this mutation for Payflow Pro and Payments Pro payment methods
   */
  createPayflowProToken: (args: {
    /**
     * An input object that defines the requirements to fetch payment token information.
     */
    input: PayflowProTokenInput;
  }) => Maybe<CreatePayflowProTokenOutput>;
  /**
   * Creates a payment order for further payment processing
   */
  createPaymentOrder: (args: {
    /**
     * Contains payment order details that are used while processing the payment order
     */
    input: CreatePaymentOrderInput;
  }) => Maybe<CreatePaymentOrderOutput>;
  /**
   * Initiate an Express Checkout transaction and receive a token. Use this mutation for Express Checkout and Payments Standard payment methods.
   */
  createPaypalExpressToken: (args: {
    /**
     * An input object that defines the requirements to receive a payment token.
     */
    input: PaypalExpressTokenInput;
  }) => Maybe<PaypalExpressTokenOutput>;
  /**
   * Create a product review for the specified product.
   */
  createProductReview: (args: {
    /**
     * An input object that contains the details necessary to create a product review.
     */
    input: CreateProductReviewInput;
  }) => CreateProductReviewOutput;
  /**
   * Creates a vault payment token
   */
  createVaultCardPaymentToken: (args: {
    /**
     * Describe the variables needed to create a vault card payment token
     */
    input: CreateVaultCardPaymentTokenInput;
  }) => Maybe<CreateVaultCardPaymentTokenOutput>;
  /**
   * Creates a vault card setup token
   */
  createVaultCardSetupToken: (args: {
    /**
     * Describe the variables needed to create a vault card setup token
     */
    input: CreateVaultCardSetupTokenInput;
  }) => Maybe<CreateVaultCardSetupTokenOutput>;
  /**
   * Delete the specified compare list.
   */
  deleteCompareList: (args: {
    /**
     * The unique ID of the compare list to be deleted.
     */
    uid: Scalars["ID"]["input"];
  }) => Maybe<DeleteCompareListOutput>;
  /**
   * Delete customer account
   */
  deleteCustomer?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Delete the billing or shipping address of a customer.
   */
  deleteCustomerAddress: (args: {
    /**
     * The ID of the customer address to be deleted.
     */
    id: Scalars["Int"]["input"];
  }) => Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Delete a customer's payment token.
   */
  deletePaymentToken: (args: {
    /**
     * The reusable payment token securely stored in the vault.
     */
    public_hash: Scalars["String"]["input"];
  }) => Maybe<DeletePaymentTokenOutput>;
  /**
   * Deletes a saved payment method from a logged in customer
   */
  deleteStripePaymentMethod: (args: {
    input: StripePaymentMethodId;
  }) => Maybe<Scalars["String"]["output"]>;
  /**
   * Estimate shipping method(s) for cart based on address
   */
  estimateShippingMethods: (args: {
    /**
     * An input object that specifies details for estimation of available shipping methods
     */
    input: EstimateTotalsInput;
  }) => Maybe<Array<Maybe<AvailableShippingMethod>>>;
  /**
   * Estimate totals for cart based on the address
   */
  estimateTotals: (args: {
    /**
     * An input object that specifies details for cart totals estimation
     */
    input: EstimateTotalsInput;
  }) => EstimateTotalsOutput;
  /**
   * Generate a token for specified customer.
   */
  generateCustomerToken: (args: {
    /**
     * The customer's email address.
     */
    email: Scalars["String"]["input"];
    /**
     * The customer's password.
     */
    password: Scalars["String"]["input"];
  }) => Maybe<CustomerToken>;
  /**
   * Request a customer token so that an administrator can perform remote shopping assistance.
   */
  generateCustomerTokenAsAdmin: (args: {
    /**
     * An input object that defines the customer email address.
     */
    input: GenerateCustomerTokenAsAdminInput;
  }) => Maybe<GenerateCustomerTokenAsAdminOutput>;
  /**
   * Handle a payment response and save the payment in Quote. Use this mutation for Payflow Pro and Payments Pro payment methods.
   */
  handlePayflowProResponse: (args: {
    /**
     * An input object that includes the payload returned by PayPal and the cart ID.
     */
    input: PayflowProResponseInput;
  }) => Maybe<PayflowProResponseOutput>;
  /**
   * List all saved payment methods of a logged in customer
   */
  listStripePaymentMethods?: Maybe<Array<Maybe<StripePaymentMethod>>>;
  /**
   * Transfer the contents of a guest cart into the cart of a logged-in customer.
   */
  mergeCarts: (args: {
    /**
     * The cart ID after the guest logs in.
     */
    destination_cart_id?: Maybe<Scalars["String"]["input"]>;
    /**
     * The guest's cart ID before they login.
     */
    source_cart_id: Scalars["String"]["input"];
  }) => Cart;
  /**
   * Convert the quote into an order.
   */
  placeOrder: (args?: {
    /**
     * An input object that defines the shopper's cart ID.
     */
    input?: Maybe<PlaceOrderInput>;
  }) => Maybe<PlaceOrderOutput>;
  /**
   * Remove a previously-applied coupon from the cart. The cart must contain at least one item in order to remove the coupon.
   */
  removeCouponFromCart: (args?: {
    /**
     * An input object that defines which coupon code to remove from the cart.
     */
    input?: Maybe<RemoveCouponFromCartInput>;
  }) => Maybe<RemoveCouponFromCartOutput>;
  /**
   * Delete the entire quantity of a specified item from the cart. If you remove all items from the cart, the cart continues to exist.
   */
  removeItemFromCart: (args?: {
    /**
     * An input object that defines which products to remove from the cart.
     */
    input?: Maybe<RemoveItemFromCartInput>;
  }) => Maybe<RemoveItemFromCartOutput>;
  /**
   * Remove products from the specified compare list.
   */
  removeProductsFromCompareList: (args?: {
    /**
     * An input object that defines which products to remove from a compare list.
     */
    input?: Maybe<RemoveProductsFromCompareListInput>;
  }) => Maybe<CompareList>;
  /**
   * Remove one or more products from the specified wish list.
   */
  removeProductsFromWishlist: (args: {
    /**
     * The ID of a wish list.
     */
    wishlistId: Scalars["ID"]["input"];
    /**
     * An array of item IDs representing products to be removed.
     */
    wishlistItemsIds: Array<Scalars["ID"]["input"]>;
  }) => Maybe<RemoveProductsFromWishlistOutput>;
  /**
   * Add all products from a customer's previous order to the cart.
   */
  reorderItems: (args: { orderNumber: Scalars["String"]["input"] }) => Maybe<ReorderItemsOutput>;
  /**
   * Request an email with a reset password token for the registered customer identified by the specified email.
   */
  requestPasswordResetEmail: (args: {
    /**
     * The customer's email address.
     */
    email: Scalars["String"]["input"];
  }) => Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Reset a customer's password using the reset password token that the customer received in an email after requesting it using `requestPasswordResetEmail`.
   */
  resetPassword: (args: {
    /**
     * The customer's email address.
     */
    email: Scalars["String"]["input"];
    /**
     * The customer's new password.
     */
    newPassword: Scalars["String"]["input"];
    /**
     * A runtime token generated by the `requestPasswordResetEmail` mutation.
     */
    resetPasswordToken: Scalars["String"]["input"];
  }) => Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Revoke the customer token.
   */
  revokeCustomerToken?: Maybe<RevokeCustomerTokenOutput>;
  /**
   * Send a message on behalf of a customer to the specified email addresses.
   */
  sendEmailToFriend: (args?: {
    /**
     * An input object that defines sender, recipients, and product.
     */
    input?: Maybe<SendEmailToFriendInput>;
  }) => Maybe<SendEmailToFriendOutput>;
  /**
   * Set the billing address on a specific cart.
   */
  setBillingAddressOnCart: (args?: {
    /**
     * An input object that defines the billing address to be assigned to the cart.
     */
    input?: Maybe<SetBillingAddressOnCartInput>;
  }) => Maybe<SetBillingAddressOnCartOutput>;
  /**
   * Sets the cart as inactive
   */
  setCartAsInactive: (args: {
    /**
     * The customer cart ID
     */
    cartId: Scalars["String"]["input"];
  }) => Maybe<SetCartAsInactiveOutput>;
  /**
   * Assign the email address of a guest to the cart.
   */
  setGuestEmailOnCart: (args?: {
    /**
     * An input object that defines a guest email address.
     */
    input?: Maybe<SetGuestEmailOnCartInput>;
  }) => Maybe<SetGuestEmailOnCartOutput>;
  /**
   * Set the cart payment method and convert the cart into an order.
   * @deprecated Should use setPaymentMethodOnCart and placeOrder mutations in single request.
   */
  setPaymentMethodAndPlaceOrder: (args?: {
    input?: Maybe<SetPaymentMethodAndPlaceOrderInput>;
  }) => Maybe<PlaceOrderOutput>;
  /**
   * Apply a payment method to the cart.
   */
  setPaymentMethodOnCart: (args?: {
    /**
     * An input object that defines which payment method to apply to the cart.
     */
    input?: Maybe<SetPaymentMethodOnCartInput>;
  }) => Maybe<SetPaymentMethodOnCartOutput>;
  /**
   * Set one or more shipping addresses on a specific cart.
   */
  setShippingAddressesOnCart: (args?: {
    /**
     * An input object that defines one or more shipping addresses to be assigned to the cart.
     */
    input?: Maybe<SetShippingAddressesOnCartInput>;
  }) => Maybe<SetShippingAddressesOnCartOutput>;
  /**
   * Set one or more delivery methods on a cart.
   */
  setShippingMethodsOnCart: (args?: {
    /**
     * An input object that applies one or more shipping methods to the cart.
     */
    input?: Maybe<SetShippingMethodsOnCartInput>;
  }) => Maybe<SetShippingMethodsOnCartOutput>;
  /**
   * Subscribe the specified email to the store's newsletter.
   */
  subscribeEmailToNewsletter: (args: {
    /**
     * The email address that will receive the store's newsletter.
     */
    email: Scalars["String"]["input"];
  }) => Maybe<SubscribeEmailToNewsletterOutput>;
  /**
   * Synchronizes the payment order details for further payment processing
   */
  syncPaymentOrder: (args?: {
    /**
     * Describes the variables needed to synchronize the payment order details
     */
    input?: Maybe<SyncPaymentOrderInput>;
  }) => Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Modify items in the cart.
   */
  updateCartItems: (args?: {
    /**
     * An input object that defines products to be updated.
     */
    input?: Maybe<UpdateCartItemsInput>;
  }) => Maybe<UpdateCartItemsOutput>;
  /**
   * Use `updateCustomerV2` instead.
   */
  updateCustomer: (args: {
    /**
     * An input object that defines the customer characteristics to update.
     */
    input: CustomerInput;
  }) => Maybe<CustomerOutput>;
  /**
   * Update the billing or shipping address of a customer or guest.
   */
  updateCustomerAddress: (args: {
    /**
     * The ID assigned to the customer address.
     */
    id: Scalars["Int"]["input"];
    /**
     * An input object that contains changes to the customer address.
     */
    input?: Maybe<CustomerAddressInput>;
  }) => Maybe<CustomerAddress>;
  /**
   * Change the email address for the logged-in customer.
   */
  updateCustomerEmail: (args: {
    /**
     * The customer's email address.
     */
    email: Scalars["String"]["input"];
    /**
     * The customer's password.
     */
    password: Scalars["String"]["input"];
  }) => Maybe<CustomerOutput>;
  /**
   * Update the customer's personal information.
   */
  updateCustomerV2: (args: {
    /**
     * An input object that defines the customer characteristics to update.
     */
    input: CustomerUpdateInput;
  }) => Maybe<CustomerOutput>;
  /**
   * Update one or more products in the specified wish list.
   */
  updateProductsInWishlist: (args: {
    /**
     * The ID of a wish list.
     */
    wishlistId: Scalars["ID"]["input"];
    /**
     * An array of items to be updated.
     */
    wishlistItems: Array<WishlistItemUpdateInput>;
  }) => Maybe<UpdateProductsInWishlistOutput>;
}

export interface Query {
  __typename?: "Query";
  /**
   * Retrieve EAV attributes associated to a frontend form. Use countries query provided by DirectoryGraphQl module to retrieve region_id and country_id attribute options.
   */
  attributesForm: (args: {
    /**
     * Form code.
     */
    formCode: Scalars["String"]["input"];
  }) => AttributesFormOutput;
  /**
   * Returns a list of attributes metadata for a given entity type.
   */
  attributesList: (args: {
    /**
     * Entity type.
     */
    entityType: AttributeEntityTypeEnum;
    /**
     * Identifies which filter inputs to search for and return.
     */
    filters?: Maybe<AttributeFilterInput>;
  }) => Maybe<AttributesMetadataOutput>;
  /**
   * Get a list of available store views and their config information.
   */
  availableStores: (args?: {
    /**
     * Filter store views by the current store group.
     */
    useCurrentGroup?: Maybe<Scalars["Boolean"]["input"]>;
  }) => Maybe<Array<Maybe<StoreConfig>>>;
  /**
   * Return information about the specified shopping cart.
   */
  cart: (args: {
    /**
     * The unique ID of the cart to query.
     */
    cart_id: Scalars["String"]["input"];
  }) => Maybe<Cart>;
  /**
   * Return a list of categories that match the specified filter.
   */
  categories: (args?: {
    /**
     * Specifies which page of results to return. The default value is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * Identifies which Category filter inputs to search for and return.
     */
    filters?: Maybe<CategoryFilterInput>;
    /**
     * Specifies the maximum number of results to return at once. The default value is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<CategoryResult>;
  /**
   * Search for categories that match the criteria specified in the `search` and `filter` attributes.
   * @deprecated Use `categories` instead.
   */
  category: (args?: {
    /**
     * The category ID to use as the root of the search.
     */
    id?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<CategoryTree>;
  /**
   * Return an array of categories based on the specified filters.
   * @deprecated Use `categories` instead.
   */
  categoryList: (args?: {
    /**
     * Specifies which page of results to return. The default value is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * Identifies which Category filter inputs to search for and return.
     */
    filters?: Maybe<CategoryFilterInput>;
    /**
     * Specifies the maximum number of results to return at once. The default value is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<Array<Maybe<CategoryTree>>>;
  /**
   * Return Terms and Conditions configuration information.
   */
  checkoutAgreements?: Maybe<Array<Maybe<CheckoutAgreement>>>;
  /**
   * Return information about CMS blocks.
   */
  cmsBlocks: (args?: {
    /**
     * An array of CMS block IDs.
     */
    identifiers?: Maybe<Array<Maybe<Scalars["String"]["input"]>>>;
  }) => Maybe<CmsBlocks>;
  /**
   * Return details about a CMS page.
   */
  cmsPage: (args?: {
    /**
     * The ID of the CMS page.
     */
    id?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The identifier of the CMS page.
     */
    identifier?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<CmsPage>;
  /**
   * Return products that have been added to the specified compare list.
   */
  compareList: (args: {
    /**
     * The unique ID of the compare list to be queried.
     */
    uid: Scalars["ID"]["input"];
  }) => Maybe<CompareList>;
  /**
   * The countries query provides information for all countries.
   */
  countries?: Maybe<Array<Maybe<Country>>>;
  /**
   * The countries query provides information for a single country.
   */
  country: (args?: { id?: Maybe<Scalars["String"]["input"]> }) => Maybe<Country>;
  /**
   * Return information about the store's currency.
   */
  currency?: Maybe<Currency>;
  /**
   * Return the attribute type, given an attribute code and entity type.
   * @deprecated Use `customAttributeMetadataV2` query instead.
   */
  customAttributeMetadata: (args: {
    /**
     * An input object that specifies the attribute code and entity type to search.
     */
    attributes: Array<AttributeInput>;
  }) => Maybe<CustomAttributeMetadata>;
  /**
   * Retrieve EAV attributes metadata.
   */
  customAttributeMetadataV2: (args?: {
    attributes?: Maybe<Array<AttributeInput>>;
  }) => AttributesMetadataOutput;
  /**
   * Return detailed information about a customer account.
   */
  customer?: Maybe<Customer>;
  /**
   * Return information about the customer's shopping cart.
   */
  customerCart: Cart;
  /**
   * Return a list of downloadable products the customer has purchased.
   */
  customerDownloadableProducts?: Maybe<CustomerDownloadableProducts>;
  /**
   * @deprecated Use the `customer` query instead.
   */
  customerOrders?: Maybe<CustomerOrders>;
  /**
   * Return a list of customer payment tokens stored in the vault.
   */
  customerPaymentTokens?: Maybe<CustomerPaymentTokens>;
  /**
   * Retrieve the secure PayPal URL for a Payments Pro Hosted Solution transaction.
   */
  getHostedProUrl: (args: {
    /**
     * An input object that specifies the cart ID.
     */
    input: HostedProUrlInput;
  }) => Maybe<HostedProUrl>;
  /**
   * Retrieve payment credentials for a transaction. Use this query for Payflow Link and Payments Advanced payment methods.
   */
  getPayflowLinkToken: (args: {
    /**
     * An input object that defines the requirements to receive a payment token.
     */
    input: PayflowLinkTokenInput;
  }) => Maybe<PayflowLinkToken>;
  /**
   * Retrieves the payment configuration for a given location
   */
  getPaymentConfig: (args: {
    /**
     * Defines the origin location for that payment request
     */
    location: PaymentLocation;
  }) => Maybe<PaymentConfigOutput>;
  /**
   * Retrieves the payment details for the order
   */
  getPaymentOrder: (args: {
    /**
     * The customer cart ID
     */
    cartId: Scalars["String"]["input"];
    /**
     * PayPal order ID
     */
    id: Scalars["String"]["input"];
  }) => Maybe<PaymentOrderOutput>;
  /**
   * Gets the payment SDK urls and values
   */
  getPaymentSDK: (args: {
    /**
     * Defines the origin location for that payment request
     */
    location: PaymentLocation;
  }) => Maybe<GetPaymentSDKOutput>;
  /**
   * Get the module's configuration to initialize Stripe Elements.
   */
  getStripeConfiguration?: Maybe<ModuleConfiguration>;
  /**
   * Retrieves the vault configuration
   */
  getVaultConfig?: Maybe<VaultConfigOutput>;
  /**
   * Retrieve guest order details based on number, email and postcode.
   */
  guestOrder: (args: { input: OrderInformationInput }) => CustomerOrder;
  /**
   * Retrieve guest order details based on token.
   */
  guestOrderByToken: (args: { input: OrderTokenInput }) => CustomerOrder;
  /**
   * Check whether the specified email has already been used to create a customer account.
   */
  isEmailAvailable: (args: {
    /**
     * The email address to check.
     */
    email: Scalars["String"]["input"];
  }) => Maybe<IsEmailAvailableOutput>;
  /**
   * The pickup locations query searches for locations that match the search request requirements.
   */
  pickupLocations: (args?: {
    /**
     * Perform search by location using radius and search term.
     */
    area?: Maybe<AreaInput>;
    /**
     * Specifies which page of results to return. The default value is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * Apply filters by attributes.
     */
    filters?: Maybe<PickupLocationFilterInput>;
    /**
     * The maximum number of pickup locations to return at once. The attribute is optional.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
    /**
     * Information about products which should be delivered.
     */
    productsInfo?: Maybe<Array<Maybe<ProductInfoInput>>>;
    /**
     * Specifies which attribute to sort on, and whether to return the results in ascending or descending order.
     */
    sort?: Maybe<PickupLocationSortInput>;
  }) => Maybe<PickupLocations>;
  /**
   * Return the active ratings attributes and the values each rating can have.
   */
  productReviewRatingsMetadata: ProductReviewRatingsMetadata;
  /**
   * Search for products that match the criteria specified in the `search` and `filter` attributes.
   */
  products: (args?: {
    /**
     * The page of results to return. The default value is 1.
     * @defaultValue `1`
     */
    currentPage?: Maybe<Scalars["Int"]["input"]>;
    /**
     * The product attributes to search for and return.
     */
    filter?: Maybe<ProductAttributeFilterInput>;
    /**
     * The maximum number of results to return at once. The default value is 20.
     * @defaultValue `20`
     */
    pageSize?: Maybe<Scalars["Int"]["input"]>;
    /**
     * One or more keywords to use in a full-text search.
     */
    search?: Maybe<Scalars["String"]["input"]>;
    /**
     * Specifies which attributes to sort on, and whether to return the results in ascending or descending order.
     */
    sort?: Maybe<ProductAttributeSortInput>;
  }) => Maybe<Products>;
  /**
   * Returns details about Google reCAPTCHA V3-Invisible configuration.
   */
  recaptchaV3Config?: Maybe<ReCaptchaConfigurationV3>;
  /**
   * Return the full details for a specified product, category, or CMS page.
   */
  route: (args: {
    /**
     * A `url_key` appended by the `url_suffix, if one exists.
     */
    url: Scalars["String"]["input"];
  }) => Maybe<RoutableInterface>;
  /**
   * The snowdogMenuNodes query returns information about active nodes of a menu
   */
  snowdogMenuNodes: (args: {
    /**
     * Identifier of nodes menu
     */
    identifier: Scalars["String"]["input"];
  }) => Maybe<SnowdogMenuNodes>;
  /**
   * The snowdogMenus query returns information about active menus
   */
  snowdogMenus: (args?: {
    /**
     * Identifier of the menu
     */
    identifiers?: Maybe<Array<Maybe<Scalars["String"]["input"]>>>;
  }) => Maybe<SnowdogMenus>;
  /**
   * Return details about the store's configuration.
   */
  storeConfig?: Maybe<StoreConfig>;
  /**
   * Return the relative URL for a specified product, category or CMS page.
   * @deprecated Use the `route` query instead.
   */
  urlResolver: (args: {
    /**
     * A `url_key` appended by the `url_suffix, if one exists.
     */
    url: Scalars["String"]["input"];
  }) => Maybe<EntityUrl>;
  /**
   * Return the contents of a customer's wish list.
   * @deprecated Moved under `Customer.wishlist`.
   */
  wishlist?: Maybe<WishlistOutput>;
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface $AggregationOptionInterface {
  AggregationOption?: AggregationOption;
}

export interface $AttributeSelectedOptionInterface {
  AttributeSelectedOption?: AttributeSelectedOption;
}

export interface $AttributeValueInterface {
  AttributeSelectedOptions?: AttributeSelectedOptions;
  AttributeValue?: AttributeValue;
}

export interface $CartAddressInterface {
  BillingCartAddress?: BillingCartAddress;
  ShippingCartAddress?: ShippingCartAddress;
}

export interface $CartItemInterface {
  BundleCartItem?: BundleCartItem;
  ConfigurableCartItem?: ConfigurableCartItem;
  DownloadableCartItem?: DownloadableCartItem;
  SimpleCartItem?: SimpleCartItem;
  VirtualCartItem?: VirtualCartItem;
}

export interface $CategoryInterface {
  CategoryTree?: CategoryTree;
}

export interface $CreditMemoItemInterface {
  BundleCreditMemoItem?: BundleCreditMemoItem;
  CreditMemoItem?: CreditMemoItem;
  DownloadableCreditMemoItem?: DownloadableCreditMemoItem;
}

export interface $CustomAttributeMetadataInterface {
  AttributeMetadata?: AttributeMetadata;
  CatalogAttributeMetadata?: CatalogAttributeMetadata;
  CustomerAttributeMetadata?: CustomerAttributeMetadata;
}

export interface $CustomAttributeOptionInterface {
  AttributeOptionMetadata?: AttributeOptionMetadata;
}

export interface $CustomizableOptionInterface {
  CustomizableAreaOption?: CustomizableAreaOption;
  CustomizableCheckboxOption?: CustomizableCheckboxOption;
  CustomizableDateOption?: CustomizableDateOption;
  CustomizableDropDownOption?: CustomizableDropDownOption;
  CustomizableFieldOption?: CustomizableFieldOption;
  CustomizableFileOption?: CustomizableFileOption;
  CustomizableMultipleOption?: CustomizableMultipleOption;
  CustomizableRadioOption?: CustomizableRadioOption;
}

export interface $CustomizableProductInterface {
  BundleProduct?: BundleProduct;
  ConfigurableProduct?: ConfigurableProduct;
  DownloadableProduct?: DownloadableProduct;
  SimpleProduct?: SimpleProduct;
  VirtualProduct?: VirtualProduct;
}

export interface $ErrorInterface {
  InternalError?: InternalError;
  NoSuchEntityUidError?: NoSuchEntityUidError;
}

export interface $InvoiceItemInterface {
  BundleInvoiceItem?: BundleInvoiceItem;
  DownloadableInvoiceItem?: DownloadableInvoiceItem;
  InvoiceItem?: InvoiceItem;
}

export interface $LayerFilterItemInterface {
  LayerFilterItem?: LayerFilterItem;
  SwatchLayerFilterItem?: SwatchLayerFilterItem;
}

export interface $MediaGalleryInterface {
  ProductImage?: ProductImage;
  ProductVideo?: ProductVideo;
}

export interface $OrderItemInterface {
  BundleOrderItem?: BundleOrderItem;
  DownloadableOrderItem?: DownloadableOrderItem;
  OrderItem?: OrderItem;
}

export interface $PaymentConfigItem {
  ApplePayConfig?: ApplePayConfig;
  FastlaneConfig?: FastlaneConfig;
  GooglePayConfig?: GooglePayConfig;
  HostedFieldsConfig?: HostedFieldsConfig;
  PaymentCommonConfig?: PaymentCommonConfig;
  SmartButtonsConfig?: SmartButtonsConfig;
}

export interface $PhysicalProductInterface {
  BundleProduct?: BundleProduct;
  ConfigurableProduct?: ConfigurableProduct;
  GroupedProduct?: GroupedProduct;
  SimpleProduct?: SimpleProduct;
}

export interface $ProductInterface {
  BundleProduct?: BundleProduct;
  ConfigurableProduct?: ConfigurableProduct;
  DownloadableProduct?: DownloadableProduct;
  GroupedProduct?: GroupedProduct;
  SimpleProduct?: SimpleProduct;
  VirtualProduct?: VirtualProduct;
}

export interface $ProductLinksInterface {
  ProductLinks?: ProductLinks;
}

export interface $RoutableInterface {
  BundleProduct?: BundleProduct;
  CategoryTree?: CategoryTree;
  CmsPage?: CmsPage;
  ConfigurableProduct?: ConfigurableProduct;
  DownloadableProduct?: DownloadableProduct;
  GroupedProduct?: GroupedProduct;
  RoutableUrl?: RoutableUrl;
  SimpleProduct?: SimpleProduct;
  VirtualProduct?: VirtualProduct;
}

export interface $ShipmentItemInterface {
  BundleShipmentItem?: BundleShipmentItem;
  ShipmentItem?: ShipmentItem;
}

export interface $SnowdogMenuCustomUrlNodeInterface {
  SnowdogMenuCustomUrlNode?: SnowdogMenuCustomUrlNode;
}

export interface $SnowdogMenuNodeContentFieldInterface {
  SnowdogMenuCmsPageNode?: SnowdogMenuCmsPageNode;
  SnowdogMenuCustomUrlNode?: SnowdogMenuCustomUrlNode;
  SnowdogMenuNode?: SnowdogMenuNode;
}

export interface $SnowdogMenuNodeImageFieldInterface {
  SnowdogMenuCustomUrlNode?: SnowdogMenuCustomUrlNode;
  SnowdogMenuNode?: SnowdogMenuNode;
}

export interface $SnowdogMenuNodeInterface {
  SnowdogMenuCmsPageNode?: SnowdogMenuCmsPageNode;
  SnowdogMenuCustomUrlNode?: SnowdogMenuCustomUrlNode;
  SnowdogMenuNode?: SnowdogMenuNode;
  SnowdogMenuWrapperNode?: SnowdogMenuWrapperNode;
}

export interface $SwatchDataInterface {
  ColorSwatchData?: ColorSwatchData;
  ImageSwatchData?: ImageSwatchData;
  TextSwatchData?: TextSwatchData;
}

export interface $SwatchLayerFilterItemInterface {
  SwatchLayerFilterItem?: SwatchLayerFilterItem;
}

export interface $WishlistItemInterface {
  BundleWishlistItem?: BundleWishlistItem;
  ConfigurableWishlistItem?: ConfigurableWishlistItem;
  DownloadableWishlistItem?: DownloadableWishlistItem;
  GroupedProductWishlistItem?: GroupedProductWishlistItem;
  SimpleWishlistItem?: SimpleWishlistItem;
  VirtualWishlistItem?: VirtualWishlistItem;
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}
