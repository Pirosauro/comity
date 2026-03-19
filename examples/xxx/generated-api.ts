

import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { gql } from 'graphql-tag'

/* tslint:disable */
/* eslint-disable */

const VariableName = ' $1fcbcbff-3e78-462f-b45c-668a3e09bfd8'

const ScalarBrandingField = ' $1fcbcbff-3e78-462f-b45c-668a3e09bfd9'

type CustomScalar<T> = { [ScalarBrandingField]: T }

class Variable<T, Name extends string> {
  private [VariableName]: Name
  // @ts-ignore
  private _type?: T

  // @ts-ignore
  constructor(name: Name, private readonly isRequired?: boolean) {
    this[VariableName] = name
  }
}

type ArrayInput<I> = [I] extends [$Atomic] ? never : ReadonlyArray<VariabledInput<I>>

type AllowedInlineScalars<S> = S extends string | number ? S : never

export type UnwrapCustomScalars<T> = T extends CustomScalar<infer S>
  ? S
  : T extends ReadonlyArray<infer I>
  ? ReadonlyArray<UnwrapCustomScalars<I>>
  : T extends Record<string, any>
  ? { [K in keyof T]: UnwrapCustomScalars<T[K]> }
  : T

type VariableWithoutScalars<T, Str extends string> = Variable<UnwrapCustomScalars<T>, Str>

// the array wrapper prevents distributive conditional types
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type VariabledInput<T> = [T] extends [CustomScalar<infer S> | null | undefined]
  ? // scalars only support variable input
    Variable<S | null | undefined, any> | AllowedInlineScalars<S> | null | undefined
  : [T] extends [CustomScalar<infer S>]
  ? Variable<S, any> | AllowedInlineScalars<S>
  : [T] extends [$Atomic]
  ? Variable<T, any> | T
  : T extends ReadonlyArray<infer I>
  ? VariableWithoutScalars<T, any> | T | ArrayInput<I>
  : T extends Record<string, any> | null | undefined
  ?
      | VariableWithoutScalars<T | null | undefined, any>
      | null
      | undefined
      | { [K in keyof T]: VariabledInput<T[K]> }
      | T
  : T extends Record<string, any>
  ? VariableWithoutScalars<T, any> | { [K in keyof T]: VariabledInput<T[K]> } | T
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

/**
 * Creates a new query variable
 *
 * @param name The variable name
 */
export const $ = <Type, Name extends string>(name: Name): Variable<Type, Name> => {
  return new Variable(name)
}

/**
 * Creates a new query variable. A value will be required even if the input is optional
 *
 * @param name The variable name
 */
export const $$ = <Type, Name extends string>(name: Name): Variable<NonNullable<Type>, Name> => {
  return new Variable(name, true)
}

type SelectOptions = {
  argTypes?: { [key: string]: string }
  args?: { [key: string]: any }
  selection?: Selection<any>
}

class $Field<Name extends string, Type, Vars = {}> {
  public kind: 'field' = 'field'
  public type!: Type

  public vars!: Vars
  public alias: string | null = null

  constructor(public name: Name, public options: SelectOptions) {}

  as<Rename extends string>(alias: Rename): $Field<Rename, Type, Vars> {
    const f = new $Field(this.name, this.options)
    f.alias = alias
    return f as any
  }
}

class $Base<Name extends string> {
  // @ts-ignore
  constructor(private $$name: Name) {}

  protected $_select<Key extends string>(
    name: Key,
    options: SelectOptions = {}
  ): $Field<Key, any, any> {
    return new $Field(name, options)
  }
}

// @ts-ignore
class $Union<T, Name extends String> extends $Base<Name> {
  // @ts-ignore
  private $$type!: T
  // @ts-ignore
  private $$name!: Name

  constructor(private selectorClasses: { [K in keyof T]: { new (): T[K] } }, $$name: Name) {
    super($$name)
  }

  $on<Type extends keyof T, Sel extends Selection<T[Type]>>(
    alternative: Type,
    selectorFn: (selector: T[Type]) => [...Sel]
  ): $UnionSelection<GetOutput<Sel>, GetVariables<Sel>> {
    const selection = selectorFn(new this.selectorClasses[alternative]())

    return new $UnionSelection(alternative as string, selection)
  }
}

// @ts-ignore
class $Interface<T, Name extends string> extends $Base<Name> {
  // @ts-ignore
  private $$type!: T
  // @ts-ignore
  private $$name!: Name

  constructor(private selectorClasses: { [K in keyof T]: { new (): T[K] } }, $$name: Name) {
    super($$name)
  }
  $on<Type extends keyof T, Sel extends Selection<T[Type]>>(
    alternative: Type,
    selectorFn: (selector: T[Type]) => [...Sel]
  ): $UnionSelection<GetOutput<Sel>, GetVariables<Sel>> {
    const selection = selectorFn(new this.selectorClasses[alternative]())

    return new $UnionSelection(alternative as string, selection)
  }
}

class $UnionSelection<T, Vars> {
  public kind: 'union' = 'union'
  // @ts-ignore
  private vars!: Vars
  constructor(public alternativeName: string, public alternativeSelection: Selection<T>) {}
}

type Selection<_any> = ReadonlyArray<$Field<any, any, any> | $UnionSelection<any, any>>

type NeverNever<T> = [T] extends [never] ? {} : T

type Simplify<T> = { [K in keyof T]: T[K] } & {}

type LeafType<T> = T extends CustomScalar<infer S> ? S : T

export type GetOutput<X extends Selection<any>> = Simplify<
  UnionToIntersection<
    {
      [I in keyof X]: X[I] extends $Field<infer Name, infer Type, any>
        ? { [K in Name]: LeafType<Type> }
        : never
    }[keyof X & number]
  > &
    NeverNever<
      {
        [I in keyof X]: X[I] extends $UnionSelection<infer Type, any> ? LeafType<Type> : never
      }[keyof X & number]
    >
>

type PossiblyOptionalVar<VName extends string, VType> = null extends VType
  ? { [key in VName]?: VType }
  : { [key in VName]: VType }

type ExtractInputVariables<Inputs> = Inputs extends Variable<infer VType, infer VName>
  ? PossiblyOptionalVar<VName, VType>
  : // Avoid generating an index signature for possibly undefined or null inputs.
  // The compiler incorrectly infers null or undefined, and we must force access the Inputs
  // type to convince the compiler its "never", while still retaining {} as the result
  // for null and undefined cases
  // Works around issue 79
  Inputs extends null | undefined
  ? { [K in keyof Inputs]: Inputs[K] }
  : Inputs extends $Atomic
  ? {}
  : Inputs extends any[] | readonly any[]
  ? UnionToIntersection<
      { [K in keyof Inputs]: ExtractInputVariables<Inputs[K]> }[keyof Inputs & number]
    >
  : UnionToIntersection<{ [K in keyof Inputs]: ExtractInputVariables<Inputs[K]> }[keyof Inputs]>

export type GetVariables<Sel extends Selection<any>, ExtraVars = {}> = UnionToIntersection<
  {
    [I in keyof Sel]: Sel[I] extends $Field<any, any, infer Vars>
      ? Vars
      : Sel[I] extends $UnionSelection<any, infer Vars>
      ? Vars
      : never
  }[keyof Sel & number]
> &
  ExtractInputVariables<ExtraVars>

type ArgVarType = {
  type: string
  isRequired: boolean
  array: {
    isRequired: boolean
  } | null
}

const arrRegex = /\[(.*?)\]/

/**
 * Converts graphql string type to `ArgVarType`
 * @param input
 * @returns
 */
function getArgVarType(input: string): ArgVarType {
  const array = input.includes('[')
    ? {
        isRequired: input.endsWith('!'),
      }
    : null

  const type = array ? arrRegex.exec(input)![1]! : input
  const isRequired = type.endsWith('!')

  return {
    array,
    isRequired: isRequired,
    type: type.replace('!', ''),
  }
}

function fieldToQuery(prefix: string, field: $Field<any, any, any>) {
  const variables = new Map<string, { variable: Variable<any, any>; type: ArgVarType }>()

  function stringifyArgs(
    args: any,
    argTypes: { [key: string]: string },
    argVarType?: ArgVarType
  ): string {
    switch (typeof args) {
      case 'string':
        const cleanType = argVarType!.type
        if ($Enums.has(cleanType!)) return args
        else return JSON.stringify(args)
      case 'number':
      case 'boolean':
        return JSON.stringify(args)
      default:
        if (args == null) return 'null'
        if (VariableName in (args as any)) {
          if (!argVarType)
            throw new globalThis.Error('Cannot use variabe as sole unnamed field argument')
          const variable = args as Variable<any, any>
          const argVarName = variable[VariableName]
          variables.set(argVarName, { type: argVarType, variable: variable })
          return '$' + argVarName
        }
        if (Array.isArray(args))
          return '[' + args.map(arg => stringifyArgs(arg, argTypes, argVarType)).join(',') + ']'
        const wrapped = (content: string) => (argVarType ? '{' + content + '}' : content)
        return wrapped(
          Array.from(Object.entries(args))
            .map(([key, val]) => {
              let argTypeForKey = argTypes[key]
              if (!argTypeForKey) {
                throw new globalThis.Error(`Argument type for ${key} not found`)
              }
              const cleanType = argTypeForKey.replace('[', '').replace(']', '').replace(/!/g, '')
              return (
                key +
                ':' +
                stringifyArgs(val, $InputTypes[cleanType]!, getArgVarType(argTypeForKey))
              )
            })
            .join(',')
        )
    }
  }

  function extractTextAndVars(field: $Field<any, any, any> | $UnionSelection<any, any>) {
    if (field.kind === 'field') {
      let retVal = field.name
      if (field.alias) retVal = field.alias + ':' + retVal
      const args = field.options.args,
        argTypes = field.options.argTypes
      if (args && Object.keys(args).length > 0) {
        retVal += '(' + stringifyArgs(args, argTypes!) + ')'
      }
      let sel = field.options.selection
      if (sel) {
        retVal += '{'
        for (let subField of sel) {
          retVal += extractTextAndVars(subField)
        }
        retVal += '}'
      }
      return retVal + ' '
    } else if (field.kind === 'union') {
      let retVal = '... on ' + field.alternativeName + ' {'
      for (let subField of field.alternativeSelection) {
        retVal += extractTextAndVars(subField)
      }
      retVal += '}'

      return retVal + ' '
    } else {
      throw new globalThis.Error('Uknown field kind')
    }
  }

  const queryRaw = extractTextAndVars(field)!

  const queryBody = queryRaw.substring(queryRaw.indexOf('{'))

  const varList = Array.from(variables.entries())
  let ret = prefix
  if (varList.length) {
    ret +=
      '(' +
      varList
        .map(([name, { type: kind, variable }]) => {
          let type = kind.array ? '[' : ''
          type += kind.type
          if (kind.isRequired) type += '!'
          if (kind.array) type += kind.array.isRequired ? ']!' : ']'

          if (!type.endsWith('!') && (variable as any).isRequired === true) {
            type += '!'
          }

          return '$' + name + ':' + type
        })
        .join(',') +
      ')'
  }
  ret += queryBody

  return ret
}

export type OutputTypeOf<T> = T extends $Interface<infer Subtypes, any>
  ? { [K in keyof Subtypes]: OutputTypeOf<Subtypes[K]> }[keyof Subtypes]
  : T extends $Union<infer Subtypes, any>
  ? { [K in keyof Subtypes]: OutputTypeOf<Subtypes[K]> }[keyof Subtypes]
  : T extends $Base<any>
  ? { [K in keyof T]?: OutputTypeOf<T[K]> }
  : [T] extends [$Field<any, infer FieldType, any>]
  ? FieldType
  : [T] extends [(selFn: (arg: infer Inner) => any) => any]
  ? OutputTypeOf<Inner>
  : [T] extends [(args: any, selFn: (arg: infer Inner) => any) => any]
  ? OutputTypeOf<Inner>
  : never

export type QueryOutputType<T extends TypedDocumentNode<any>> = T extends TypedDocumentNode<
  infer Out
>
  ? Out
  : never

export type QueryInputType<T extends TypedDocumentNode<any>> = T extends TypedDocumentNode<
  any,
  infer In
>
  ? In
  : never

export function fragment<T, Sel extends Selection<T>>(
  GQLType: { new (): T },
  selectFn: (selector: T) => [...Sel]
) {
  return selectFn(new GQLType())
}

type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R
  ? R
  : never

// TS4.0+
type Push<T extends any[], V> = [...T, V]

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : Push<TuplifyUnion<Exclude<T, L>>, L>

type AllFieldProperties<I> = {
  [K in keyof I]: I[K] extends $Field<infer Name, infer Type, any> ? $Field<Name, Type, any> : never
}

type ValueOf<T> = T[keyof T]

export type AllFields<T> = TuplifyUnion<ValueOf<AllFieldProperties<T>>>

export function all<I extends $Base<any>>(instance: I) {
  const prototype = Object.getPrototypeOf(instance)
  const allFields = Object.getOwnPropertyNames(prototype)
    .map(k => prototype[k])
    .filter(o => o?.kind === 'field')
    .map(o => o?.name) as (keyof typeof instance)[]
  return allFields.map(fieldName => instance?.[fieldName]) as any as AllFields<I>
}

// We use a dummy conditional type that involves GenericType to defer the compiler's inference of
// any possible variables nested in this type. This addresses a problem where variables are
// inferred with type unknown
// @ts-ignore
type ExactArgNames<GenericType, Constraint> = GenericType extends never
  ? never
  : [Constraint] extends [$Atomic | CustomScalar<any>]
  ? GenericType
  : Constraint extends ReadonlyArray<infer InnerConstraint>
  ? GenericType extends ReadonlyArray<infer Inner>
    ? ReadonlyArray<ExactArgNames<Inner, InnerConstraint>>
    : GenericType
  : GenericType & {
      [Key in keyof GenericType]: Key extends keyof Constraint
        ? ExactArgNames<GenericType[Key], Constraint[Key]>
        : never
    }


export type NameOf<T> = 
  T extends $Interface<any, infer Name>
  ? Name
  : T extends $Union<any, infer Name>
  ? Name
  : T extends $Base<infer Name>
  ? Name
  : never
type $Atomic = FilterMatchTypeEnum | SortEnum | CurrencyEnum | BatchMutationStatus | UseInLayeredNavigationOptions | AttributeMetadataErrorType | AttributeEntityTypeEnum | AttributeFrontendInputEnum | CheckoutAgreementMode | UrlRewriteEntityTypeEnum | PriceAdjustmentCodesEnum | PriceAdjustmentDescriptionEnum | PriceTypeEnum | CustomizableDateTypeEnum | CatalogAttributeApplyToEnum | SortQuoteItemsEnum | CartItemErrorType | CartDiscountType | CartUserInputErrorType | ProductImageThumbnail | DownloadableFileTypeEnum | PriceViewEnum | ShipBundleItemsEnum | ProductStockStatus | CountryCodeEnum | InputFilterEnum | ValidationRuleEnum | ConfirmationStatusEnum | SubscriptionStatusesEnum | CancelOrderErrorCode | OrderActionType | ReCaptchaFormEnum | ReCaptchaTypeEmum | CustomerOrderSortableField | CheckoutUserInputErrorCodes | ScopeTypeEnum | SwatchInputTypeEnum | TaxWrappingEnum | PayflowLinkMode | PaymentTokenTypeEnum | FixedProductTaxDisplaySettings | WishlistCartUserInputErrorType | WishListUserInputErrorType | PaymentStatusEnum | number | string | boolean | null | undefined

let $Enums = new Set<string>(["FilterMatchTypeEnum","SortEnum","CurrencyEnum","BatchMutationStatus","UseInLayeredNavigationOptions","AttributeMetadataErrorType","AttributeEntityTypeEnum","AttributeFrontendInputEnum","CheckoutAgreementMode","UrlRewriteEntityTypeEnum","PriceAdjustmentCodesEnum","PriceAdjustmentDescriptionEnum","PriceTypeEnum","CustomizableDateTypeEnum","CatalogAttributeApplyToEnum","SortQuoteItemsEnum","CartItemErrorType","CartDiscountType","CartUserInputErrorType","ProductImageThumbnail","DownloadableFileTypeEnum","PriceViewEnum","ShipBundleItemsEnum","ProductStockStatus","CountryCodeEnum","InputFilterEnum","ValidationRuleEnum","ConfirmationStatusEnum","SubscriptionStatusesEnum","CancelOrderErrorCode","OrderActionType","ReCaptchaFormEnum","ReCaptchaTypeEmum","CustomerOrderSortableField","CheckoutUserInputErrorCodes","ScopeTypeEnum","SwatchInputTypeEnum","TaxWrappingEnum","PayflowLinkMode","PaymentTokenTypeEnum","FixedProductTaxDisplaySettings","WishlistCartUserInputErrorType","WishListUserInputErrorType","PaymentStatusEnum"])



export class Query extends $Base<"Query"> {
  constructor() {
    super("Query")
  }

  
      
/**
 * Retrieve EAV attributes associated to a frontend form. Use countries query provided by DirectoryGraphQl module to retrieve region_id and country_id attribute options.
 */
      attributesForm<Args extends VariabledInput<{
        formCode: string,
      }>,Sel extends Selection<AttributesFormOutput>>(args: ExactArgNames<Args, {
        formCode: string,
      }>, selectorFn: (s: AttributesFormOutput) => [...Sel]):$Field<"attributesForm", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              formCode: "String!"
            },
        args,

        selection: selectorFn(new AttributesFormOutput)
      };
      return this.$_select("attributesForm", options as any) as any
    }
  

      
/**
 * Returns a list of attributes metadata for a given entity type.
 */
      attributesList<Args extends VariabledInput<{
        entityType: AttributeEntityTypeEnum
filters?: AttributeFilterInput | null,
      }>,Sel extends Selection<AttributesMetadataOutput>>(args: ExactArgNames<Args, {
        entityType: AttributeEntityTypeEnum
filters?: AttributeFilterInput | null,
      }>, selectorFn: (s: AttributesMetadataOutput) => [...Sel]):$Field<"attributesList", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              entityType: "AttributeEntityTypeEnum!",
filters: "AttributeFilterInput"
            },
        args,

        selection: selectorFn(new AttributesMetadataOutput)
      };
      return this.$_select("attributesList", options as any) as any
    }
  

      
/**
 * Get a list of available store views and their config information.
 */
      availableStores<Args extends VariabledInput<{
        useCurrentGroup?: boolean | null,
      }>,Sel extends Selection<StoreConfig>>(args: ExactArgNames<Args, {
        useCurrentGroup?: boolean | null,
      }>, selectorFn: (s: StoreConfig) => [...Sel]):$Field<"availableStores", Array<GetOutput<Sel> | null> | null , GetVariables<Sel, Args>>
availableStores<Sel extends Selection<StoreConfig>>(selectorFn: (s: StoreConfig) => [...Sel]):$Field<"availableStores", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>>
availableStores(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              useCurrentGroup: "Boolean"
            },
        args,

        selection: selectorFn(new StoreConfig)
      };
      return this.$_select("availableStores", options as any) as any
    }
  

      
/**
 * The cachedCurrency query returns information about store currency and contains a 'config' cache key.
 */
      cachedCurrency<Sel extends Selection<Currency>>(selectorFn: (s: Currency) => [...Sel]):$Field<"cachedCurrency", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Currency)
      };
      return this.$_select("cachedCurrency", options as any) as any
    }
  

      
/**
 * Return information about the specified shopping cart.
 */
      cart<Args extends VariabledInput<{
        cart_id: string,
      }>,Sel extends Selection<Cart>>(args: ExactArgNames<Args, {
        cart_id: string,
      }>, selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              cart_id: "String!"
            },
        args,

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  

      
/**
 * Return a list of categories that match the specified filter.
 */
      categories<Args extends VariabledInput<{
        filters?: CategoryFilterInput | null
pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<CategoryResult>>(args: ExactArgNames<Args, {
        filters?: CategoryFilterInput | null
pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: CategoryResult) => [...Sel]):$Field<"categories", GetOutput<Sel> | null , GetVariables<Sel, Args>>
categories<Sel extends Selection<CategoryResult>>(selectorFn: (s: CategoryResult) => [...Sel]):$Field<"categories", GetOutput<Sel> | null , GetVariables<Sel>>
categories(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filters: "CategoryFilterInput",
pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new CategoryResult)
      };
      return this.$_select("categories", options as any) as any
    }
  

      
/**
 * Search for categories that match the criteria specified in the `search` and `filter` attributes.
 */
      category<Args extends VariabledInput<{
        id?: number | null,
      }>,Sel extends Selection<CategoryTree>>(args: ExactArgNames<Args, {
        id?: number | null,
      }>, selectorFn: (s: CategoryTree) => [...Sel]):$Field<"category", GetOutput<Sel> | null , GetVariables<Sel, Args>>
category<Sel extends Selection<CategoryTree>>(selectorFn: (s: CategoryTree) => [...Sel]):$Field<"category", GetOutput<Sel> | null , GetVariables<Sel>>
category(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              id: "Int"
            },
        args,

        selection: selectorFn(new CategoryTree)
      };
      return this.$_select("category", options as any) as any
    }
  

      
/**
 * Return an array of categories based on the specified filters.
 */
      categoryList<Args extends VariabledInput<{
        filters?: CategoryFilterInput | null
pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<CategoryTree>>(args: ExactArgNames<Args, {
        filters?: CategoryFilterInput | null
pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: CategoryTree) => [...Sel]):$Field<"categoryList", Array<GetOutput<Sel> | null> | null , GetVariables<Sel, Args>>
categoryList<Sel extends Selection<CategoryTree>>(selectorFn: (s: CategoryTree) => [...Sel]):$Field<"categoryList", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>>
categoryList(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filters: "CategoryFilterInput",
pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new CategoryTree)
      };
      return this.$_select("categoryList", options as any) as any
    }
  

      
/**
 * Return Terms and Conditions configuration information.
 */
      checkoutAgreements<Sel extends Selection<CheckoutAgreement>>(selectorFn: (s: CheckoutAgreement) => [...Sel]):$Field<"checkoutAgreements", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CheckoutAgreement)
      };
      return this.$_select("checkoutAgreements", options as any) as any
    }
  

      
/**
 * Return information about CMS blocks.
 */
      cmsBlocks<Args extends VariabledInput<{
        identifiers?: Readonly<Array<string | null>> | null,
      }>,Sel extends Selection<CmsBlocks>>(args: ExactArgNames<Args, {
        identifiers?: Readonly<Array<string | null>> | null,
      }>, selectorFn: (s: CmsBlocks) => [...Sel]):$Field<"cmsBlocks", GetOutput<Sel> | null , GetVariables<Sel, Args>>
cmsBlocks<Sel extends Selection<CmsBlocks>>(selectorFn: (s: CmsBlocks) => [...Sel]):$Field<"cmsBlocks", GetOutput<Sel> | null , GetVariables<Sel>>
cmsBlocks(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              identifiers: "[String]"
            },
        args,

        selection: selectorFn(new CmsBlocks)
      };
      return this.$_select("cmsBlocks", options as any) as any
    }
  

      
/**
 * Return details about a CMS page.
 */
      cmsPage<Args extends VariabledInput<{
        id?: number | null
identifier?: string | null,
      }>,Sel extends Selection<CmsPage>>(args: ExactArgNames<Args, {
        id?: number | null
identifier?: string | null,
      }>, selectorFn: (s: CmsPage) => [...Sel]):$Field<"cmsPage", GetOutput<Sel> | null , GetVariables<Sel, Args>>
cmsPage<Sel extends Selection<CmsPage>>(selectorFn: (s: CmsPage) => [...Sel]):$Field<"cmsPage", GetOutput<Sel> | null , GetVariables<Sel>>
cmsPage(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              id: "Int",
identifier: "String"
            },
        args,

        selection: selectorFn(new CmsPage)
      };
      return this.$_select("cmsPage", options as any) as any
    }
  

      
/**
 * Return products that have been added to the specified compare list.
 */
      compareList<Args extends VariabledInput<{
        uid: string,
      }>,Sel extends Selection<CompareList>>(args: ExactArgNames<Args, {
        uid: string,
      }>, selectorFn: (s: CompareList) => [...Sel]):$Field<"compareList", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              uid: "ID!"
            },
        args,

        selection: selectorFn(new CompareList)
      };
      return this.$_select("compareList", options as any) as any
    }
  

      
/**
 * The countries query provides information for all countries.
 */
      countries<Sel extends Selection<Country>>(selectorFn: (s: Country) => [...Sel]):$Field<"countries", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Country)
      };
      return this.$_select("countries", options as any) as any
    }
  

      
/**
 * The countries query provides information for a single country.
 */
      country<Args extends VariabledInput<{
        id?: string | null,
      }>,Sel extends Selection<Country>>(args: ExactArgNames<Args, {
        id?: string | null,
      }>, selectorFn: (s: Country) => [...Sel]):$Field<"country", GetOutput<Sel> | null , GetVariables<Sel, Args>>
country<Sel extends Selection<Country>>(selectorFn: (s: Country) => [...Sel]):$Field<"country", GetOutput<Sel> | null , GetVariables<Sel>>
country(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              id: "String"
            },
        args,

        selection: selectorFn(new Country)
      };
      return this.$_select("country", options as any) as any
    }
  

      
/**
 * Return information about the store's currency.
 */
      currency<Sel extends Selection<Currency>>(selectorFn: (s: Currency) => [...Sel]):$Field<"currency", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Currency)
      };
      return this.$_select("currency", options as any) as any
    }
  

      
/**
 * Return the attribute type, given an attribute code and entity type.
 */
      customAttributeMetadata<Args extends VariabledInput<{
        attributes: Readonly<Array<AttributeInput>>,
      }>,Sel extends Selection<CustomAttributeMetadata>>(args: ExactArgNames<Args, {
        attributes: Readonly<Array<AttributeInput>>,
      }>, selectorFn: (s: CustomAttributeMetadata) => [...Sel]):$Field<"customAttributeMetadata", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              attributes: "[AttributeInput!]!"
            },
        args,

        selection: selectorFn(new CustomAttributeMetadata)
      };
      return this.$_select("customAttributeMetadata", options as any) as any
    }
  

      
/**
 * Retrieve EAV attributes metadata.
 */
      customAttributeMetadataV2<Args extends VariabledInput<{
        attributes?: Readonly<Array<AttributeInput>> | null,
      }>,Sel extends Selection<AttributesMetadataOutput>>(args: ExactArgNames<Args, {
        attributes?: Readonly<Array<AttributeInput>> | null,
      }>, selectorFn: (s: AttributesMetadataOutput) => [...Sel]):$Field<"customAttributeMetadataV2", GetOutput<Sel> , GetVariables<Sel, Args>>
customAttributeMetadataV2<Sel extends Selection<AttributesMetadataOutput>>(selectorFn: (s: AttributesMetadataOutput) => [...Sel]):$Field<"customAttributeMetadataV2", GetOutput<Sel> , GetVariables<Sel>>
customAttributeMetadataV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              attributes: "[AttributeInput!]"
            },
        args,

        selection: selectorFn(new AttributesMetadataOutput)
      };
      return this.$_select("customAttributeMetadataV2", options as any) as any
    }
  

      
/**
 * Return detailed information about a customer account.
 */
      customer<Sel extends Selection<Customer>>(selectorFn: (s: Customer) => [...Sel]):$Field<"customer", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Customer)
      };
      return this.$_select("customer", options as any) as any
    }
  

      
/**
 * Return information about the customer's shopping cart.
 */
      customerCart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"customerCart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("customerCart", options as any) as any
    }
  

      
/**
 * Return a list of downloadable products the customer has purchased.
 */
      customerDownloadableProducts<Sel extends Selection<CustomerDownloadableProducts>>(selectorFn: (s: CustomerDownloadableProducts) => [...Sel]):$Field<"customerDownloadableProducts", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerDownloadableProducts)
      };
      return this.$_select("customerDownloadableProducts", options as any) as any
    }
  

      
      customerOrders<Sel extends Selection<CustomerOrders>>(selectorFn: (s: CustomerOrders) => [...Sel]):$Field<"customerOrders", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerOrders)
      };
      return this.$_select("customerOrders", options as any) as any
    }
  

      
/**
 * Return a list of customer payment tokens stored in the vault.
 */
      customerPaymentTokens<Sel extends Selection<CustomerPaymentTokens>>(selectorFn: (s: CustomerPaymentTokens) => [...Sel]):$Field<"customerPaymentTokens", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerPaymentTokens)
      };
      return this.$_select("customerPaymentTokens", options as any) as any
    }
  

      
/**
 * Retrieve the secure PayPal URL for a Payments Pro Hosted Solution transaction.
 */
      getHostedProUrl<Args extends VariabledInput<{
        input: HostedProUrlInput,
      }>,Sel extends Selection<HostedProUrl>>(args: ExactArgNames<Args, {
        input: HostedProUrlInput,
      }>, selectorFn: (s: HostedProUrl) => [...Sel]):$Field<"getHostedProUrl", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "HostedProUrlInput!"
            },
        args,

        selection: selectorFn(new HostedProUrl)
      };
      return this.$_select("getHostedProUrl", options as any) as any
    }
  

      
/**
 * Retrieve payment credentials for a transaction. Use this query for Payflow Link and Payments Advanced payment methods.
 */
      getPayflowLinkToken<Args extends VariabledInput<{
        input: PayflowLinkTokenInput,
      }>,Sel extends Selection<PayflowLinkToken>>(args: ExactArgNames<Args, {
        input: PayflowLinkTokenInput,
      }>, selectorFn: (s: PayflowLinkToken) => [...Sel]):$Field<"getPayflowLinkToken", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "PayflowLinkTokenInput!"
            },
        args,

        selection: selectorFn(new PayflowLinkToken)
      };
      return this.$_select("getPayflowLinkToken", options as any) as any
    }
  

      
/**
 * Retrieve guest order details based on number, email and billing last name.
 */
      guestOrder<Args extends VariabledInput<{
        input: OrderInformationInput,
      }>,Sel extends Selection<CustomerOrder>>(args: ExactArgNames<Args, {
        input: OrderInformationInput,
      }>, selectorFn: (s: CustomerOrder) => [...Sel]):$Field<"guestOrder", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "OrderInformationInput!"
            },
        args,

        selection: selectorFn(new CustomerOrder)
      };
      return this.$_select("guestOrder", options as any) as any
    }
  

      
/**
 * Retrieve guest order details based on token.
 */
      guestOrderByToken<Args extends VariabledInput<{
        input: OrderTokenInput,
      }>,Sel extends Selection<CustomerOrder>>(args: ExactArgNames<Args, {
        input: OrderTokenInput,
      }>, selectorFn: (s: CustomerOrder) => [...Sel]):$Field<"guestOrderByToken", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "OrderTokenInput!"
            },
        args,

        selection: selectorFn(new CustomerOrder)
      };
      return this.$_select("guestOrderByToken", options as any) as any
    }
  

      
/**
 * Check whether the specified email has already been used to create a customer account.
 */
      isEmailAvailable<Args extends VariabledInput<{
        email: string,
      }>,Sel extends Selection<IsEmailAvailableOutput>>(args: ExactArgNames<Args, {
        email: string,
      }>, selectorFn: (s: IsEmailAvailableOutput) => [...Sel]):$Field<"isEmailAvailable", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              email: "String!"
            },
        args,

        selection: selectorFn(new IsEmailAvailableOutput)
      };
      return this.$_select("isEmailAvailable", options as any) as any
    }
  

      
      mollieCustomerOrder<Args extends VariabledInput<{
        hash?: string | null,
      }>,Sel extends Selection<CustomerOrder>>(args: ExactArgNames<Args, {
        hash?: string | null,
      }>, selectorFn: (s: CustomerOrder) => [...Sel]):$Field<"mollieCustomerOrder", GetOutput<Sel> | null , GetVariables<Sel, Args>>
mollieCustomerOrder<Sel extends Selection<CustomerOrder>>(selectorFn: (s: CustomerOrder) => [...Sel]):$Field<"mollieCustomerOrder", GetOutput<Sel> | null , GetVariables<Sel>>
mollieCustomerOrder(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              hash: "String"
            },
        args,

        selection: selectorFn(new CustomerOrder)
      };
      return this.$_select("mollieCustomerOrder", options as any) as any
    }
  

      
      molliePaymentMethods<Args extends VariabledInput<{
        input?: MolliePaymentMethodsInput | null,
      }>,Sel extends Selection<MolliePaymentMethodsOutput>>(args: ExactArgNames<Args, {
        input?: MolliePaymentMethodsInput | null,
      }>, selectorFn: (s: MolliePaymentMethodsOutput) => [...Sel]):$Field<"molliePaymentMethods", GetOutput<Sel> | null , GetVariables<Sel, Args>>
molliePaymentMethods<Sel extends Selection<MolliePaymentMethodsOutput>>(selectorFn: (s: MolliePaymentMethodsOutput) => [...Sel]):$Field<"molliePaymentMethods", GetOutput<Sel> | null , GetVariables<Sel>>
molliePaymentMethods(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "MolliePaymentMethodsInput"
            },
        args,

        selection: selectorFn(new MolliePaymentMethodsOutput)
      };
      return this.$_select("molliePaymentMethods", options as any) as any
    }
  

      
/**
 * The pickup locations query searches for locations that match the search request requirements.
 */
      pickupLocations<Args extends VariabledInput<{
        area?: AreaInput | null
filters?: PickupLocationFilterInput | null
sort?: PickupLocationSortInput | null
pageSize?: number | null
currentPage?: number | null
productsInfo?: Readonly<Array<ProductInfoInput | null>> | null,
      }>,Sel extends Selection<PickupLocations>>(args: ExactArgNames<Args, {
        area?: AreaInput | null
filters?: PickupLocationFilterInput | null
sort?: PickupLocationSortInput | null
pageSize?: number | null
currentPage?: number | null
productsInfo?: Readonly<Array<ProductInfoInput | null>> | null,
      }>, selectorFn: (s: PickupLocations) => [...Sel]):$Field<"pickupLocations", GetOutput<Sel> | null , GetVariables<Sel, Args>>
pickupLocations<Sel extends Selection<PickupLocations>>(selectorFn: (s: PickupLocations) => [...Sel]):$Field<"pickupLocations", GetOutput<Sel> | null , GetVariables<Sel>>
pickupLocations(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              area: "AreaInput",
filters: "PickupLocationFilterInput",
sort: "PickupLocationSortInput",
pageSize: "Int",
currentPage: "Int",
productsInfo: "[ProductInfoInput]"
            },
        args,

        selection: selectorFn(new PickupLocations)
      };
      return this.$_select("pickupLocations", options as any) as any
    }
  

      
/**
 * Return the active ratings attributes and the values each rating can have.
 */
      productReviewRatingsMetadata<Sel extends Selection<ProductReviewRatingsMetadata>>(selectorFn: (s: ProductReviewRatingsMetadata) => [...Sel]):$Field<"productReviewRatingsMetadata", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductReviewRatingsMetadata)
      };
      return this.$_select("productReviewRatingsMetadata", options as any) as any
    }
  

      
/**
 * Search for products that match the criteria specified in the `search` and `filter` attributes.
 */
      products<Args extends VariabledInput<{
        search?: string | null
filter?: ProductAttributeFilterInput | null
pageSize?: number | null
currentPage?: number | null
sort?: ProductAttributeSortInput | null,
      }>,Sel extends Selection<Products>>(args: ExactArgNames<Args, {
        search?: string | null
filter?: ProductAttributeFilterInput | null
pageSize?: number | null
currentPage?: number | null
sort?: ProductAttributeSortInput | null,
      }>, selectorFn: (s: Products) => [...Sel]):$Field<"products", GetOutput<Sel> | null , GetVariables<Sel, Args>>
products<Sel extends Selection<Products>>(selectorFn: (s: Products) => [...Sel]):$Field<"products", GetOutput<Sel> | null , GetVariables<Sel>>
products(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              search: "String",
filter: "ProductAttributeFilterInput",
pageSize: "Int",
currentPage: "Int",
sort: "ProductAttributeSortInput"
            },
        args,

        selection: selectorFn(new Products)
      };
      return this.$_select("products", options as any) as any
    }
  

      
      recaptchaFormConfig<Args extends VariabledInput<{
        formType: ReCaptchaFormEnum,
      }>,Sel extends Selection<ReCaptchaConfigOutput>>(args: ExactArgNames<Args, {
        formType: ReCaptchaFormEnum,
      }>, selectorFn: (s: ReCaptchaConfigOutput) => [...Sel]):$Field<"recaptchaFormConfig", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              formType: "ReCaptchaFormEnum!"
            },
        args,

        selection: selectorFn(new ReCaptchaConfigOutput)
      };
      return this.$_select("recaptchaFormConfig", options as any) as any
    }
  

      
/**
 * Returns details about Google reCAPTCHA V3-Invisible configuration.
 */
      recaptchaV3Config<Sel extends Selection<ReCaptchaConfigurationV3>>(selectorFn: (s: ReCaptchaConfigurationV3) => [...Sel]):$Field<"recaptchaV3Config", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ReCaptchaConfigurationV3)
      };
      return this.$_select("recaptchaV3Config", options as any) as any
    }
  

      
/**
 * Return the full details for a specified product, category, or CMS page.
 */
      route<Args extends VariabledInput<{
        url: string,
      }>,Sel extends Selection<RoutableInterface>>(args: ExactArgNames<Args, {
        url: string,
      }>, selectorFn: (s: RoutableInterface) => [...Sel]):$Field<"route", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              url: "String!"
            },
        args,

        selection: selectorFn(new RoutableInterface)
      };
      return this.$_select("route", options as any) as any
    }
  

      
/**
 * Return details about the store's configuration.
 */
      storeConfig<Sel extends Selection<StoreConfig>>(selectorFn: (s: StoreConfig) => [...Sel]):$Field<"storeConfig", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new StoreConfig)
      };
      return this.$_select("storeConfig", options as any) as any
    }
  

      
/**
 * Return the relative URL for a specified product, category or CMS page.
 */
      urlResolver<Args extends VariabledInput<{
        url: string,
      }>,Sel extends Selection<EntityUrl>>(args: ExactArgNames<Args, {
        url: string,
      }>, selectorFn: (s: EntityUrl) => [...Sel]):$Field<"urlResolver", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              url: "String!"
            },
        args,

        selection: selectorFn(new EntityUrl)
      };
      return this.$_select("urlResolver", options as any) as any
    }
  

      
/**
 * Return the contents of a customer's wish list.
 */
      wishlist<Sel extends Selection<WishlistOutput>>(selectorFn: (s: WishlistOutput) => [...Sel]):$Field<"wishlist", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new WishlistOutput)
      };
      return this.$_select("wishlist", options as any) as any
    }
  
}


export class Mutation extends $Base<"Mutation"> {
  constructor() {
    super("Mutation")
  }

  
      
/**
 * Add one or more bundle products to the specified cart. We recommend using `addProductsToCart` instead.
 */
      addBundleProductsToCart<Args extends VariabledInput<{
        input?: AddBundleProductsToCartInput | null,
      }>,Sel extends Selection<AddBundleProductsToCartOutput>>(args: ExactArgNames<Args, {
        input?: AddBundleProductsToCartInput | null,
      }>, selectorFn: (s: AddBundleProductsToCartOutput) => [...Sel]):$Field<"addBundleProductsToCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
addBundleProductsToCart<Sel extends Selection<AddBundleProductsToCartOutput>>(selectorFn: (s: AddBundleProductsToCartOutput) => [...Sel]):$Field<"addBundleProductsToCart", GetOutput<Sel> | null , GetVariables<Sel>>
addBundleProductsToCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "AddBundleProductsToCartInput"
            },
        args,

        selection: selectorFn(new AddBundleProductsToCartOutput)
      };
      return this.$_select("addBundleProductsToCart", options as any) as any
    }
  

      
/**
 * Add one or more configurable products to the specified cart. We recommend using `addProductsToCart` instead.
 */
      addConfigurableProductsToCart<Args extends VariabledInput<{
        input?: AddConfigurableProductsToCartInput | null,
      }>,Sel extends Selection<AddConfigurableProductsToCartOutput>>(args: ExactArgNames<Args, {
        input?: AddConfigurableProductsToCartInput | null,
      }>, selectorFn: (s: AddConfigurableProductsToCartOutput) => [...Sel]):$Field<"addConfigurableProductsToCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
addConfigurableProductsToCart<Sel extends Selection<AddConfigurableProductsToCartOutput>>(selectorFn: (s: AddConfigurableProductsToCartOutput) => [...Sel]):$Field<"addConfigurableProductsToCart", GetOutput<Sel> | null , GetVariables<Sel>>
addConfigurableProductsToCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "AddConfigurableProductsToCartInput"
            },
        args,

        selection: selectorFn(new AddConfigurableProductsToCartOutput)
      };
      return this.$_select("addConfigurableProductsToCart", options as any) as any
    }
  

      
/**
 * Add one or more downloadable products to the specified cart. We recommend using `addProductsToCart` instead.
 */
      addDownloadableProductsToCart<Args extends VariabledInput<{
        input?: AddDownloadableProductsToCartInput | null,
      }>,Sel extends Selection<AddDownloadableProductsToCartOutput>>(args: ExactArgNames<Args, {
        input?: AddDownloadableProductsToCartInput | null,
      }>, selectorFn: (s: AddDownloadableProductsToCartOutput) => [...Sel]):$Field<"addDownloadableProductsToCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
addDownloadableProductsToCart<Sel extends Selection<AddDownloadableProductsToCartOutput>>(selectorFn: (s: AddDownloadableProductsToCartOutput) => [...Sel]):$Field<"addDownloadableProductsToCart", GetOutput<Sel> | null , GetVariables<Sel>>
addDownloadableProductsToCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "AddDownloadableProductsToCartInput"
            },
        args,

        selection: selectorFn(new AddDownloadableProductsToCartOutput)
      };
      return this.$_select("addDownloadableProductsToCart", options as any) as any
    }
  

      
/**
 * Add any type of product to the cart.
 */
      addProductsToCart<Args extends VariabledInput<{
        cartId: string
cartItems: Readonly<Array<CartItemInput>>,
      }>,Sel extends Selection<AddProductsToCartOutput>>(args: ExactArgNames<Args, {
        cartId: string
cartItems: Readonly<Array<CartItemInput>>,
      }>, selectorFn: (s: AddProductsToCartOutput) => [...Sel]):$Field<"addProductsToCart", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              cartId: "String!",
cartItems: "[CartItemInput!]!"
            },
        args,

        selection: selectorFn(new AddProductsToCartOutput)
      };
      return this.$_select("addProductsToCart", options as any) as any
    }
  

      
/**
 * Add products to the specified compare list.
 */
      addProductsToCompareList<Args extends VariabledInput<{
        input?: AddProductsToCompareListInput | null,
      }>,Sel extends Selection<CompareList>>(args: ExactArgNames<Args, {
        input?: AddProductsToCompareListInput | null,
      }>, selectorFn: (s: CompareList) => [...Sel]):$Field<"addProductsToCompareList", GetOutput<Sel> | null , GetVariables<Sel, Args>>
addProductsToCompareList<Sel extends Selection<CompareList>>(selectorFn: (s: CompareList) => [...Sel]):$Field<"addProductsToCompareList", GetOutput<Sel> | null , GetVariables<Sel>>
addProductsToCompareList(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "AddProductsToCompareListInput"
            },
        args,

        selection: selectorFn(new CompareList)
      };
      return this.$_select("addProductsToCompareList", options as any) as any
    }
  

      
/**
 * Add one or more products to the specified wish list. This mutation supports all product types.
 */
      addProductsToWishlist<Args extends VariabledInput<{
        wishlistId: string
wishlistItems: Readonly<Array<WishlistItemInput>>,
      }>,Sel extends Selection<AddProductsToWishlistOutput>>(args: ExactArgNames<Args, {
        wishlistId: string
wishlistItems: Readonly<Array<WishlistItemInput>>,
      }>, selectorFn: (s: AddProductsToWishlistOutput) => [...Sel]):$Field<"addProductsToWishlist", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              wishlistId: "ID!",
wishlistItems: "[WishlistItemInput!]!"
            },
        args,

        selection: selectorFn(new AddProductsToWishlistOutput)
      };
      return this.$_select("addProductsToWishlist", options as any) as any
    }
  

      
/**
 * Add one or more simple products to the specified cart. We recommend using `addProductsToCart` instead.
 */
      addSimpleProductsToCart<Args extends VariabledInput<{
        input?: AddSimpleProductsToCartInput | null,
      }>,Sel extends Selection<AddSimpleProductsToCartOutput>>(args: ExactArgNames<Args, {
        input?: AddSimpleProductsToCartInput | null,
      }>, selectorFn: (s: AddSimpleProductsToCartOutput) => [...Sel]):$Field<"addSimpleProductsToCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
addSimpleProductsToCart<Sel extends Selection<AddSimpleProductsToCartOutput>>(selectorFn: (s: AddSimpleProductsToCartOutput) => [...Sel]):$Field<"addSimpleProductsToCart", GetOutput<Sel> | null , GetVariables<Sel>>
addSimpleProductsToCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "AddSimpleProductsToCartInput"
            },
        args,

        selection: selectorFn(new AddSimpleProductsToCartOutput)
      };
      return this.$_select("addSimpleProductsToCart", options as any) as any
    }
  

      
/**
 * Add one or more virtual products to the specified cart. We recommend using `addProductsToCart` instead.
 */
      addVirtualProductsToCart<Args extends VariabledInput<{
        input?: AddVirtualProductsToCartInput | null,
      }>,Sel extends Selection<AddVirtualProductsToCartOutput>>(args: ExactArgNames<Args, {
        input?: AddVirtualProductsToCartInput | null,
      }>, selectorFn: (s: AddVirtualProductsToCartOutput) => [...Sel]):$Field<"addVirtualProductsToCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
addVirtualProductsToCart<Sel extends Selection<AddVirtualProductsToCartOutput>>(selectorFn: (s: AddVirtualProductsToCartOutput) => [...Sel]):$Field<"addVirtualProductsToCart", GetOutput<Sel> | null , GetVariables<Sel>>
addVirtualProductsToCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "AddVirtualProductsToCartInput"
            },
        args,

        selection: selectorFn(new AddVirtualProductsToCartOutput)
      };
      return this.$_select("addVirtualProductsToCart", options as any) as any
    }
  

      
/**
 * Add items in the specified wishlist to the customer's cart.
 */
      addWishlistItemsToCart<Args extends VariabledInput<{
        wishlistId: string
wishlistItemIds?: Readonly<Array<string>> | null,
      }>,Sel extends Selection<AddWishlistItemsToCartOutput>>(args: ExactArgNames<Args, {
        wishlistId: string
wishlistItemIds?: Readonly<Array<string>> | null,
      }>, selectorFn: (s: AddWishlistItemsToCartOutput) => [...Sel]):$Field<"addWishlistItemsToCart", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              wishlistId: "ID!",
wishlistItemIds: "[ID!]"
            },
        args,

        selection: selectorFn(new AddWishlistItemsToCartOutput)
      };
      return this.$_select("addWishlistItemsToCart", options as any) as any
    }
  

      
/**
 * Apply a pre-defined coupon code to the specified cart.
 */
      applyCouponToCart<Args extends VariabledInput<{
        input?: ApplyCouponToCartInput | null,
      }>,Sel extends Selection<ApplyCouponToCartOutput>>(args: ExactArgNames<Args, {
        input?: ApplyCouponToCartInput | null,
      }>, selectorFn: (s: ApplyCouponToCartOutput) => [...Sel]):$Field<"applyCouponToCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
applyCouponToCart<Sel extends Selection<ApplyCouponToCartOutput>>(selectorFn: (s: ApplyCouponToCartOutput) => [...Sel]):$Field<"applyCouponToCart", GetOutput<Sel> | null , GetVariables<Sel>>
applyCouponToCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "ApplyCouponToCartInput"
            },
        args,

        selection: selectorFn(new ApplyCouponToCartOutput)
      };
      return this.$_select("applyCouponToCart", options as any) as any
    }
  

      
/**
 * Assign the specified compare list to the logged in customer.
 */
      assignCompareListToCustomer<Args extends VariabledInput<{
        uid: string,
      }>,Sel extends Selection<AssignCompareListToCustomerOutput>>(args: ExactArgNames<Args, {
        uid: string,
      }>, selectorFn: (s: AssignCompareListToCustomerOutput) => [...Sel]):$Field<"assignCompareListToCustomer", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              uid: "ID!"
            },
        args,

        selection: selectorFn(new AssignCompareListToCustomerOutput)
      };
      return this.$_select("assignCompareListToCustomer", options as any) as any
    }
  

      
/**
 * Assign a logged-in customer to the specified guest shopping cart.
 */
      assignCustomerToGuestCart<Args extends VariabledInput<{
        cart_id: string,
      }>,Sel extends Selection<Cart>>(args: ExactArgNames<Args, {
        cart_id: string,
      }>, selectorFn: (s: Cart) => [...Sel]):$Field<"assignCustomerToGuestCart", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              cart_id: "String!"
            },
        args,

        selection: selectorFn(new Cart)
      };
      return this.$_select("assignCustomerToGuestCart", options as any) as any
    }
  

      
/**
 * Cancel the specified customer order.
 */
      cancelOrder<Args extends VariabledInput<{
        input: CancelOrderInput,
      }>,Sel extends Selection<CancelOrderOutput>>(args: ExactArgNames<Args, {
        input: CancelOrderInput,
      }>, selectorFn: (s: CancelOrderOutput) => [...Sel]):$Field<"cancelOrder", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "CancelOrderInput!"
            },
        args,

        selection: selectorFn(new CancelOrderOutput)
      };
      return this.$_select("cancelOrder", options as any) as any
    }
  

      
/**
 * Change the password for the logged-in customer.
 */
      changeCustomerPassword<Args extends VariabledInput<{
        currentPassword: string
newPassword: string,
      }>,Sel extends Selection<Customer>>(args: ExactArgNames<Args, {
        currentPassword: string
newPassword: string,
      }>, selectorFn: (s: Customer) => [...Sel]):$Field<"changeCustomerPassword", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              currentPassword: "String!",
newPassword: "String!"
            },
        args,

        selection: selectorFn(new Customer)
      };
      return this.$_select("changeCustomerPassword", options as any) as any
    }
  

      
/**
 * Cancel the specified guest customer order.
 */
      confirmCancelOrder<Args extends VariabledInput<{
        input: ConfirmCancelOrderInput,
      }>,Sel extends Selection<CancelOrderOutput>>(args: ExactArgNames<Args, {
        input: ConfirmCancelOrderInput,
      }>, selectorFn: (s: CancelOrderOutput) => [...Sel]):$Field<"confirmCancelOrder", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "ConfirmCancelOrderInput!"
            },
        args,

        selection: selectorFn(new CancelOrderOutput)
      };
      return this.$_select("confirmCancelOrder", options as any) as any
    }
  

      
/**
 * Confirms the email address for a customer.
 */
      confirmEmail<Args extends VariabledInput<{
        input: ConfirmEmailInput,
      }>,Sel extends Selection<CustomerOutput>>(args: ExactArgNames<Args, {
        input: ConfirmEmailInput,
      }>, selectorFn: (s: CustomerOutput) => [...Sel]):$Field<"confirmEmail", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "ConfirmEmailInput!"
            },
        args,

        selection: selectorFn(new CustomerOutput)
      };
      return this.$_select("confirmEmail", options as any) as any
    }
  

      
/**
 * Send a 'Contact Us' email to the merchant.
 */
      contactUs<Args extends VariabledInput<{
        input: ContactUsInput,
      }>,Sel extends Selection<ContactUsOutput>>(args: ExactArgNames<Args, {
        input: ContactUsInput,
      }>, selectorFn: (s: ContactUsOutput) => [...Sel]):$Field<"contactUs", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "ContactUsInput!"
            },
        args,

        selection: selectorFn(new ContactUsOutput)
      };
      return this.$_select("contactUs", options as any) as any
    }
  

      
/**
 * Create a new compare list. The compare list is saved for logged in customers.
 */
      createCompareList<Args extends VariabledInput<{
        input?: CreateCompareListInput | null,
      }>,Sel extends Selection<CompareList>>(args: ExactArgNames<Args, {
        input?: CreateCompareListInput | null,
      }>, selectorFn: (s: CompareList) => [...Sel]):$Field<"createCompareList", GetOutput<Sel> | null , GetVariables<Sel, Args>>
createCompareList<Sel extends Selection<CompareList>>(selectorFn: (s: CompareList) => [...Sel]):$Field<"createCompareList", GetOutput<Sel> | null , GetVariables<Sel>>
createCompareList(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "CreateCompareListInput"
            },
        args,

        selection: selectorFn(new CompareList)
      };
      return this.$_select("createCompareList", options as any) as any
    }
  

      
      createCustomer<Args extends VariabledInput<{
        input: CustomerInput,
      }>,Sel extends Selection<CustomerOutput>>(args: ExactArgNames<Args, {
        input: CustomerInput,
      }>, selectorFn: (s: CustomerOutput) => [...Sel]):$Field<"createCustomer", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "CustomerInput!"
            },
        args,

        selection: selectorFn(new CustomerOutput)
      };
      return this.$_select("createCustomer", options as any) as any
    }
  

      
/**
 * Create a billing or shipping address for a customer or guest.
 */
      createCustomerAddress<Args extends VariabledInput<{
        input: CustomerAddressInput,
      }>,Sel extends Selection<CustomerAddress>>(args: ExactArgNames<Args, {
        input: CustomerAddressInput,
      }>, selectorFn: (s: CustomerAddress) => [...Sel]):$Field<"createCustomerAddress", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "CustomerAddressInput!"
            },
        args,

        selection: selectorFn(new CustomerAddress)
      };
      return this.$_select("createCustomerAddress", options as any) as any
    }
  

      
/**
 * Create a customer account.
 */
      createCustomerV2<Args extends VariabledInput<{
        input: CustomerCreateInput,
      }>,Sel extends Selection<CustomerOutput>>(args: ExactArgNames<Args, {
        input: CustomerCreateInput,
      }>, selectorFn: (s: CustomerOutput) => [...Sel]):$Field<"createCustomerV2", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "CustomerCreateInput!"
            },
        args,

        selection: selectorFn(new CustomerOutput)
      };
      return this.$_select("createCustomerV2", options as any) as any
    }
  

      
/**
 * Create an empty shopping cart for a guest or logged in user
 */
      createEmptyCart<Args extends VariabledInput<{
        input?: createEmptyCartInput | null,
      }>>(args: ExactArgNames<Args, {
        input?: createEmptyCartInput | null,
      }>):$Field<"createEmptyCart", string | null , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              input: "createEmptyCartInput"
            },
        args,

        
      };
      return this.$_select("createEmptyCart", options as any) as any
    }
  

      
/**
 * Create a new shopping cart
 */
      createGuestCart<Args extends VariabledInput<{
        input?: CreateGuestCartInput | null,
      }>,Sel extends Selection<CreateGuestCartOutput>>(args: ExactArgNames<Args, {
        input?: CreateGuestCartInput | null,
      }>, selectorFn: (s: CreateGuestCartOutput) => [...Sel]):$Field<"createGuestCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
createGuestCart<Sel extends Selection<CreateGuestCartOutput>>(selectorFn: (s: CreateGuestCartOutput) => [...Sel]):$Field<"createGuestCart", GetOutput<Sel> | null , GetVariables<Sel>>
createGuestCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "CreateGuestCartInput"
            },
        args,

        selection: selectorFn(new CreateGuestCartOutput)
      };
      return this.$_select("createGuestCart", options as any) as any
    }
  

      
      createMollieTransaction<Args extends VariabledInput<{
        input?: MollieTransactionInput | null,
      }>,Sel extends Selection<MollieTransactionOutput>>(args: ExactArgNames<Args, {
        input?: MollieTransactionInput | null,
      }>, selectorFn: (s: MollieTransactionOutput) => [...Sel]):$Field<"createMollieTransaction", GetOutput<Sel> | null , GetVariables<Sel, Args>>
createMollieTransaction<Sel extends Selection<MollieTransactionOutput>>(selectorFn: (s: MollieTransactionOutput) => [...Sel]):$Field<"createMollieTransaction", GetOutput<Sel> | null , GetVariables<Sel>>
createMollieTransaction(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "MollieTransactionInput"
            },
        args,

        selection: selectorFn(new MollieTransactionOutput)
      };
      return this.$_select("createMollieTransaction", options as any) as any
    }
  

      
/**
 * Initiate a transaction and receive a token. Use this mutation for Payflow Pro and Payments Pro payment methods
 */
      createPayflowProToken<Args extends VariabledInput<{
        input: PayflowProTokenInput,
      }>,Sel extends Selection<CreatePayflowProTokenOutput>>(args: ExactArgNames<Args, {
        input: PayflowProTokenInput,
      }>, selectorFn: (s: CreatePayflowProTokenOutput) => [...Sel]):$Field<"createPayflowProToken", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "PayflowProTokenInput!"
            },
        args,

        selection: selectorFn(new CreatePayflowProTokenOutput)
      };
      return this.$_select("createPayflowProToken", options as any) as any
    }
  

      
/**
 * Initiate an Express Checkout transaction and receive a token. Use this mutation for Express Checkout and Payments Standard payment methods.
 */
      createPaypalExpressToken<Args extends VariabledInput<{
        input: PaypalExpressTokenInput,
      }>,Sel extends Selection<PaypalExpressTokenOutput>>(args: ExactArgNames<Args, {
        input: PaypalExpressTokenInput,
      }>, selectorFn: (s: PaypalExpressTokenOutput) => [...Sel]):$Field<"createPaypalExpressToken", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "PaypalExpressTokenInput!"
            },
        args,

        selection: selectorFn(new PaypalExpressTokenOutput)
      };
      return this.$_select("createPaypalExpressToken", options as any) as any
    }
  

      
/**
 * Create a product review for the specified product.
 */
      createProductReview<Args extends VariabledInput<{
        input: CreateProductReviewInput,
      }>,Sel extends Selection<CreateProductReviewOutput>>(args: ExactArgNames<Args, {
        input: CreateProductReviewInput,
      }>, selectorFn: (s: CreateProductReviewOutput) => [...Sel]):$Field<"createProductReview", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "CreateProductReviewInput!"
            },
        args,

        selection: selectorFn(new CreateProductReviewOutput)
      };
      return this.$_select("createProductReview", options as any) as any
    }
  

      
/**
 * Delete the specified compare list.
 */
      deleteCompareList<Args extends VariabledInput<{
        uid: string,
      }>,Sel extends Selection<DeleteCompareListOutput>>(args: ExactArgNames<Args, {
        uid: string,
      }>, selectorFn: (s: DeleteCompareListOutput) => [...Sel]):$Field<"deleteCompareList", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              uid: "ID!"
            },
        args,

        selection: selectorFn(new DeleteCompareListOutput)
      };
      return this.$_select("deleteCompareList", options as any) as any
    }
  

      
/**
 * Delete customer account
 */
      get deleteCustomer(): $Field<"deleteCustomer", boolean | null>  {
       return this.$_select("deleteCustomer") as any
      }

      
/**
 * Delete the billing or shipping address of a customer.
 */
      deleteCustomerAddress<Args extends VariabledInput<{
        id: number,
      }>>(args: ExactArgNames<Args, {
        id: number,
      }>):$Field<"deleteCustomerAddress", boolean | null , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              id: "Int!"
            },
        args,

        
      };
      return this.$_select("deleteCustomerAddress", options as any) as any
    }
  

      
/**
 * Delete a customer's payment token.
 */
      deletePaymentToken<Args extends VariabledInput<{
        public_hash: string,
      }>,Sel extends Selection<DeletePaymentTokenOutput>>(args: ExactArgNames<Args, {
        public_hash: string,
      }>, selectorFn: (s: DeletePaymentTokenOutput) => [...Sel]):$Field<"deletePaymentToken", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              public_hash: "String!"
            },
        args,

        selection: selectorFn(new DeletePaymentTokenOutput)
      };
      return this.$_select("deletePaymentToken", options as any) as any
    }
  

      
/**
 * Estimate shipping method(s) for cart based on address
 */
      estimateShippingMethods<Args extends VariabledInput<{
        input: EstimateTotalsInput,
      }>,Sel extends Selection<AvailableShippingMethod>>(args: ExactArgNames<Args, {
        input: EstimateTotalsInput,
      }>, selectorFn: (s: AvailableShippingMethod) => [...Sel]):$Field<"estimateShippingMethods", Array<GetOutput<Sel> | null> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "EstimateTotalsInput!"
            },
        args,

        selection: selectorFn(new AvailableShippingMethod)
      };
      return this.$_select("estimateShippingMethods", options as any) as any
    }
  

      
/**
 * Estimate totals for cart based on the address
 */
      estimateTotals<Args extends VariabledInput<{
        input: EstimateTotalsInput,
      }>,Sel extends Selection<EstimateTotalsOutput>>(args: ExactArgNames<Args, {
        input: EstimateTotalsInput,
      }>, selectorFn: (s: EstimateTotalsOutput) => [...Sel]):$Field<"estimateTotals", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "EstimateTotalsInput!"
            },
        args,

        selection: selectorFn(new EstimateTotalsOutput)
      };
      return this.$_select("estimateTotals", options as any) as any
    }
  

      
/**
 * Generate a token for specified customer.
 */
      generateCustomerToken<Args extends VariabledInput<{
        email: string
password: string,
      }>,Sel extends Selection<CustomerToken>>(args: ExactArgNames<Args, {
        email: string
password: string,
      }>, selectorFn: (s: CustomerToken) => [...Sel]):$Field<"generateCustomerToken", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              email: "String!",
password: "String!"
            },
        args,

        selection: selectorFn(new CustomerToken)
      };
      return this.$_select("generateCustomerToken", options as any) as any
    }
  

      
/**
 * Request a customer token so that an administrator can perform remote shopping assistance.
 */
      generateCustomerTokenAsAdmin<Args extends VariabledInput<{
        input: GenerateCustomerTokenAsAdminInput,
      }>,Sel extends Selection<GenerateCustomerTokenAsAdminOutput>>(args: ExactArgNames<Args, {
        input: GenerateCustomerTokenAsAdminInput,
      }>, selectorFn: (s: GenerateCustomerTokenAsAdminOutput) => [...Sel]):$Field<"generateCustomerTokenAsAdmin", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "GenerateCustomerTokenAsAdminInput!"
            },
        args,

        selection: selectorFn(new GenerateCustomerTokenAsAdminOutput)
      };
      return this.$_select("generateCustomerTokenAsAdmin", options as any) as any
    }
  

      
/**
 * Handle a payment response and save the payment in Quote. Use this mutation for Payflow Pro and Payments Pro payment methods.
 */
      handlePayflowProResponse<Args extends VariabledInput<{
        input: PayflowProResponseInput,
      }>,Sel extends Selection<PayflowProResponseOutput>>(args: ExactArgNames<Args, {
        input: PayflowProResponseInput,
      }>, selectorFn: (s: PayflowProResponseOutput) => [...Sel]):$Field<"handlePayflowProResponse", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "PayflowProResponseInput!"
            },
        args,

        selection: selectorFn(new PayflowProResponseOutput)
      };
      return this.$_select("handlePayflowProResponse", options as any) as any
    }
  

      
/**
 * Transfer the contents of a guest cart into the cart of a logged-in customer.
 */
      mergeCarts<Args extends VariabledInput<{
        source_cart_id: string
destination_cart_id?: string | null,
      }>,Sel extends Selection<Cart>>(args: ExactArgNames<Args, {
        source_cart_id: string
destination_cart_id?: string | null,
      }>, selectorFn: (s: Cart) => [...Sel]):$Field<"mergeCarts", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              source_cart_id: "String!",
destination_cart_id: "String"
            },
        args,

        selection: selectorFn(new Cart)
      };
      return this.$_select("mergeCarts", options as any) as any
    }
  

      
      mollieApplePayValidation<Args extends VariabledInput<{
        domain?: string | null
validationUrl: string,
      }>,Sel extends Selection<MollieApplePayValidationOutput>>(args: ExactArgNames<Args, {
        domain?: string | null
validationUrl: string,
      }>, selectorFn: (s: MollieApplePayValidationOutput) => [...Sel]):$Field<"mollieApplePayValidation", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              domain: "String",
validationUrl: "String!"
            },
        args,

        selection: selectorFn(new MollieApplePayValidationOutput)
      };
      return this.$_select("mollieApplePayValidation", options as any) as any
    }
  

      
      molliePaymentLinkRedirect<Args extends VariabledInput<{
        order?: string | null,
      }>,Sel extends Selection<MolliePaymentLinkRedirectOutput>>(args: ExactArgNames<Args, {
        order?: string | null,
      }>, selectorFn: (s: MolliePaymentLinkRedirectOutput) => [...Sel]):$Field<"molliePaymentLinkRedirect", GetOutput<Sel> | null , GetVariables<Sel, Args>>
molliePaymentLinkRedirect<Sel extends Selection<MolliePaymentLinkRedirectOutput>>(selectorFn: (s: MolliePaymentLinkRedirectOutput) => [...Sel]):$Field<"molliePaymentLinkRedirect", GetOutput<Sel> | null , GetVariables<Sel>>
molliePaymentLinkRedirect(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              order: "String"
            },
        args,

        selection: selectorFn(new MolliePaymentLinkRedirectOutput)
      };
      return this.$_select("molliePaymentLinkRedirect", options as any) as any
    }
  

      
      mollieProcessTransaction<Args extends VariabledInput<{
        input?: MollieProcessTransactionInput | null,
      }>,Sel extends Selection<MollieProcessTransactionOutput>>(args: ExactArgNames<Args, {
        input?: MollieProcessTransactionInput | null,
      }>, selectorFn: (s: MollieProcessTransactionOutput) => [...Sel]):$Field<"mollieProcessTransaction", GetOutput<Sel> | null , GetVariables<Sel, Args>>
mollieProcessTransaction<Sel extends Selection<MollieProcessTransactionOutput>>(selectorFn: (s: MollieProcessTransactionOutput) => [...Sel]):$Field<"mollieProcessTransaction", GetOutput<Sel> | null , GetVariables<Sel>>
mollieProcessTransaction(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "MollieProcessTransactionInput"
            },
        args,

        selection: selectorFn(new MollieProcessTransactionOutput)
      };
      return this.$_select("mollieProcessTransaction", options as any) as any
    }
  

      
      mollieRestoreCart<Args extends VariabledInput<{
        input?: MollieResetCartInput | null,
      }>,Sel extends Selection<MollieResetCartOutput>>(args: ExactArgNames<Args, {
        input?: MollieResetCartInput | null,
      }>, selectorFn: (s: MollieResetCartOutput) => [...Sel]):$Field<"mollieRestoreCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
mollieRestoreCart<Sel extends Selection<MollieResetCartOutput>>(selectorFn: (s: MollieResetCartOutput) => [...Sel]):$Field<"mollieRestoreCart", GetOutput<Sel> | null , GetVariables<Sel>>
mollieRestoreCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "MollieResetCartInput"
            },
        args,

        selection: selectorFn(new MollieResetCartOutput)
      };
      return this.$_select("mollieRestoreCart", options as any) as any
    }
  

      
/**
 * Convert the quote into an order.
 */
      placeOrder<Args extends VariabledInput<{
        input?: PlaceOrderInput | null,
      }>,Sel extends Selection<PlaceOrderOutput>>(args: ExactArgNames<Args, {
        input?: PlaceOrderInput | null,
      }>, selectorFn: (s: PlaceOrderOutput) => [...Sel]):$Field<"placeOrder", GetOutput<Sel> | null , GetVariables<Sel, Args>>
placeOrder<Sel extends Selection<PlaceOrderOutput>>(selectorFn: (s: PlaceOrderOutput) => [...Sel]):$Field<"placeOrder", GetOutput<Sel> | null , GetVariables<Sel>>
placeOrder(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "PlaceOrderInput"
            },
        args,

        selection: selectorFn(new PlaceOrderOutput)
      };
      return this.$_select("placeOrder", options as any) as any
    }
  

      
/**
 * Remove a previously-applied coupon from the cart. The cart must contain at least one item in order to remove the coupon.
 */
      removeCouponFromCart<Args extends VariabledInput<{
        input?: RemoveCouponFromCartInput | null,
      }>,Sel extends Selection<RemoveCouponFromCartOutput>>(args: ExactArgNames<Args, {
        input?: RemoveCouponFromCartInput | null,
      }>, selectorFn: (s: RemoveCouponFromCartOutput) => [...Sel]):$Field<"removeCouponFromCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
removeCouponFromCart<Sel extends Selection<RemoveCouponFromCartOutput>>(selectorFn: (s: RemoveCouponFromCartOutput) => [...Sel]):$Field<"removeCouponFromCart", GetOutput<Sel> | null , GetVariables<Sel>>
removeCouponFromCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "RemoveCouponFromCartInput"
            },
        args,

        selection: selectorFn(new RemoveCouponFromCartOutput)
      };
      return this.$_select("removeCouponFromCart", options as any) as any
    }
  

      
/**
 * Delete the entire quantity of a specified item from the cart. If you remove all items from the cart, the cart continues to exist.
 */
      removeItemFromCart<Args extends VariabledInput<{
        input?: RemoveItemFromCartInput | null,
      }>,Sel extends Selection<RemoveItemFromCartOutput>>(args: ExactArgNames<Args, {
        input?: RemoveItemFromCartInput | null,
      }>, selectorFn: (s: RemoveItemFromCartOutput) => [...Sel]):$Field<"removeItemFromCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
removeItemFromCart<Sel extends Selection<RemoveItemFromCartOutput>>(selectorFn: (s: RemoveItemFromCartOutput) => [...Sel]):$Field<"removeItemFromCart", GetOutput<Sel> | null , GetVariables<Sel>>
removeItemFromCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "RemoveItemFromCartInput"
            },
        args,

        selection: selectorFn(new RemoveItemFromCartOutput)
      };
      return this.$_select("removeItemFromCart", options as any) as any
    }
  

      
/**
 * Remove products from the specified compare list.
 */
      removeProductsFromCompareList<Args extends VariabledInput<{
        input?: RemoveProductsFromCompareListInput | null,
      }>,Sel extends Selection<CompareList>>(args: ExactArgNames<Args, {
        input?: RemoveProductsFromCompareListInput | null,
      }>, selectorFn: (s: CompareList) => [...Sel]):$Field<"removeProductsFromCompareList", GetOutput<Sel> | null , GetVariables<Sel, Args>>
removeProductsFromCompareList<Sel extends Selection<CompareList>>(selectorFn: (s: CompareList) => [...Sel]):$Field<"removeProductsFromCompareList", GetOutput<Sel> | null , GetVariables<Sel>>
removeProductsFromCompareList(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "RemoveProductsFromCompareListInput"
            },
        args,

        selection: selectorFn(new CompareList)
      };
      return this.$_select("removeProductsFromCompareList", options as any) as any
    }
  

      
/**
 * Remove one or more products from the specified wish list.
 */
      removeProductsFromWishlist<Args extends VariabledInput<{
        wishlistId: string
wishlistItemsIds: Readonly<Array<string>>,
      }>,Sel extends Selection<RemoveProductsFromWishlistOutput>>(args: ExactArgNames<Args, {
        wishlistId: string
wishlistItemsIds: Readonly<Array<string>>,
      }>, selectorFn: (s: RemoveProductsFromWishlistOutput) => [...Sel]):$Field<"removeProductsFromWishlist", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              wishlistId: "ID!",
wishlistItemsIds: "[ID!]!"
            },
        args,

        selection: selectorFn(new RemoveProductsFromWishlistOutput)
      };
      return this.$_select("removeProductsFromWishlist", options as any) as any
    }
  

      
/**
 * Add all products from a customer's previous order to the cart.
 */
      reorderItems<Args extends VariabledInput<{
        orderNumber: string,
      }>,Sel extends Selection<ReorderItemsOutput>>(args: ExactArgNames<Args, {
        orderNumber: string,
      }>, selectorFn: (s: ReorderItemsOutput) => [...Sel]):$Field<"reorderItems", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              orderNumber: "String!"
            },
        args,

        selection: selectorFn(new ReorderItemsOutput)
      };
      return this.$_select("reorderItems", options as any) as any
    }
  

      
/**
 * Request to cancel specified guest order.
 */
      requestGuestOrderCancel<Args extends VariabledInput<{
        input: GuestOrderCancelInput,
      }>,Sel extends Selection<CancelOrderOutput>>(args: ExactArgNames<Args, {
        input: GuestOrderCancelInput,
      }>, selectorFn: (s: CancelOrderOutput) => [...Sel]):$Field<"requestGuestOrderCancel", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "GuestOrderCancelInput!"
            },
        args,

        selection: selectorFn(new CancelOrderOutput)
      };
      return this.$_select("requestGuestOrderCancel", options as any) as any
    }
  

      
/**
 * Request an email with a reset password token for the registered customer identified by the specified email.
 */
      requestPasswordResetEmail<Args extends VariabledInput<{
        email: string,
      }>>(args: ExactArgNames<Args, {
        email: string,
      }>):$Field<"requestPasswordResetEmail", boolean | null , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              email: "String!"
            },
        args,

        
      };
      return this.$_select("requestPasswordResetEmail", options as any) as any
    }
  

      
/**
 * Resends the confirmation email to a customer.
 */
      resendConfirmationEmail<Args extends VariabledInput<{
        email: string,
      }>>(args: ExactArgNames<Args, {
        email: string,
      }>):$Field<"resendConfirmationEmail", boolean | null , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              email: "String!"
            },
        args,

        
      };
      return this.$_select("resendConfirmationEmail", options as any) as any
    }
  

      
/**
 * Reset a customer's password using the reset password token that the customer received in an email after requesting it using `requestPasswordResetEmail`.
 */
      resetPassword<Args extends VariabledInput<{
        email: string
resetPasswordToken: string
newPassword: string,
      }>>(args: ExactArgNames<Args, {
        email: string
resetPasswordToken: string
newPassword: string,
      }>):$Field<"resetPassword", boolean | null , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              email: "String!",
resetPasswordToken: "String!",
newPassword: "String!"
            },
        args,

        
      };
      return this.$_select("resetPassword", options as any) as any
    }
  

      
/**
 * Revoke the customer token.
 */
      revokeCustomerToken<Sel extends Selection<RevokeCustomerTokenOutput>>(selectorFn: (s: RevokeCustomerTokenOutput) => [...Sel]):$Field<"revokeCustomerToken", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new RevokeCustomerTokenOutput)
      };
      return this.$_select("revokeCustomerToken", options as any) as any
    }
  

      
/**
 * Send a message on behalf of a customer to the specified email addresses.
 */
      sendEmailToFriend<Args extends VariabledInput<{
        input?: SendEmailToFriendInput | null,
      }>,Sel extends Selection<SendEmailToFriendOutput>>(args: ExactArgNames<Args, {
        input?: SendEmailToFriendInput | null,
      }>, selectorFn: (s: SendEmailToFriendOutput) => [...Sel]):$Field<"sendEmailToFriend", GetOutput<Sel> | null , GetVariables<Sel, Args>>
sendEmailToFriend<Sel extends Selection<SendEmailToFriendOutput>>(selectorFn: (s: SendEmailToFriendOutput) => [...Sel]):$Field<"sendEmailToFriend", GetOutput<Sel> | null , GetVariables<Sel>>
sendEmailToFriend(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "SendEmailToFriendInput"
            },
        args,

        selection: selectorFn(new SendEmailToFriendOutput)
      };
      return this.$_select("sendEmailToFriend", options as any) as any
    }
  

      
/**
 * Set the billing address on a specific cart.
 */
      setBillingAddressOnCart<Args extends VariabledInput<{
        input?: SetBillingAddressOnCartInput | null,
      }>,Sel extends Selection<SetBillingAddressOnCartOutput>>(args: ExactArgNames<Args, {
        input?: SetBillingAddressOnCartInput | null,
      }>, selectorFn: (s: SetBillingAddressOnCartOutput) => [...Sel]):$Field<"setBillingAddressOnCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
setBillingAddressOnCart<Sel extends Selection<SetBillingAddressOnCartOutput>>(selectorFn: (s: SetBillingAddressOnCartOutput) => [...Sel]):$Field<"setBillingAddressOnCart", GetOutput<Sel> | null , GetVariables<Sel>>
setBillingAddressOnCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "SetBillingAddressOnCartInput"
            },
        args,

        selection: selectorFn(new SetBillingAddressOnCartOutput)
      };
      return this.$_select("setBillingAddressOnCart", options as any) as any
    }
  

      
/**
 * Assign the email address of a guest to the cart.
 */
      setGuestEmailOnCart<Args extends VariabledInput<{
        input?: SetGuestEmailOnCartInput | null,
      }>,Sel extends Selection<SetGuestEmailOnCartOutput>>(args: ExactArgNames<Args, {
        input?: SetGuestEmailOnCartInput | null,
      }>, selectorFn: (s: SetGuestEmailOnCartOutput) => [...Sel]):$Field<"setGuestEmailOnCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
setGuestEmailOnCart<Sel extends Selection<SetGuestEmailOnCartOutput>>(selectorFn: (s: SetGuestEmailOnCartOutput) => [...Sel]):$Field<"setGuestEmailOnCart", GetOutput<Sel> | null , GetVariables<Sel>>
setGuestEmailOnCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "SetGuestEmailOnCartInput"
            },
        args,

        selection: selectorFn(new SetGuestEmailOnCartOutput)
      };
      return this.$_select("setGuestEmailOnCart", options as any) as any
    }
  

      
/**
 * Set the cart payment method and convert the cart into an order.
 */
      setPaymentMethodAndPlaceOrder<Args extends VariabledInput<{
        input?: SetPaymentMethodAndPlaceOrderInput | null,
      }>,Sel extends Selection<PlaceOrderOutput>>(args: ExactArgNames<Args, {
        input?: SetPaymentMethodAndPlaceOrderInput | null,
      }>, selectorFn: (s: PlaceOrderOutput) => [...Sel]):$Field<"setPaymentMethodAndPlaceOrder", GetOutput<Sel> | null , GetVariables<Sel, Args>>
setPaymentMethodAndPlaceOrder<Sel extends Selection<PlaceOrderOutput>>(selectorFn: (s: PlaceOrderOutput) => [...Sel]):$Field<"setPaymentMethodAndPlaceOrder", GetOutput<Sel> | null , GetVariables<Sel>>
setPaymentMethodAndPlaceOrder(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "SetPaymentMethodAndPlaceOrderInput"
            },
        args,

        selection: selectorFn(new PlaceOrderOutput)
      };
      return this.$_select("setPaymentMethodAndPlaceOrder", options as any) as any
    }
  

      
/**
 * Apply a payment method to the cart.
 */
      setPaymentMethodOnCart<Args extends VariabledInput<{
        input?: SetPaymentMethodOnCartInput | null,
      }>,Sel extends Selection<SetPaymentMethodOnCartOutput>>(args: ExactArgNames<Args, {
        input?: SetPaymentMethodOnCartInput | null,
      }>, selectorFn: (s: SetPaymentMethodOnCartOutput) => [...Sel]):$Field<"setPaymentMethodOnCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
setPaymentMethodOnCart<Sel extends Selection<SetPaymentMethodOnCartOutput>>(selectorFn: (s: SetPaymentMethodOnCartOutput) => [...Sel]):$Field<"setPaymentMethodOnCart", GetOutput<Sel> | null , GetVariables<Sel>>
setPaymentMethodOnCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "SetPaymentMethodOnCartInput"
            },
        args,

        selection: selectorFn(new SetPaymentMethodOnCartOutput)
      };
      return this.$_select("setPaymentMethodOnCart", options as any) as any
    }
  

      
/**
 * Set one or more shipping addresses on a specific cart.
 */
      setShippingAddressesOnCart<Args extends VariabledInput<{
        input?: SetShippingAddressesOnCartInput | null,
      }>,Sel extends Selection<SetShippingAddressesOnCartOutput>>(args: ExactArgNames<Args, {
        input?: SetShippingAddressesOnCartInput | null,
      }>, selectorFn: (s: SetShippingAddressesOnCartOutput) => [...Sel]):$Field<"setShippingAddressesOnCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
setShippingAddressesOnCart<Sel extends Selection<SetShippingAddressesOnCartOutput>>(selectorFn: (s: SetShippingAddressesOnCartOutput) => [...Sel]):$Field<"setShippingAddressesOnCart", GetOutput<Sel> | null , GetVariables<Sel>>
setShippingAddressesOnCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "SetShippingAddressesOnCartInput"
            },
        args,

        selection: selectorFn(new SetShippingAddressesOnCartOutput)
      };
      return this.$_select("setShippingAddressesOnCart", options as any) as any
    }
  

      
/**
 * Set one or more delivery methods on a cart.
 */
      setShippingMethodsOnCart<Args extends VariabledInput<{
        input?: SetShippingMethodsOnCartInput | null,
      }>,Sel extends Selection<SetShippingMethodsOnCartOutput>>(args: ExactArgNames<Args, {
        input?: SetShippingMethodsOnCartInput | null,
      }>, selectorFn: (s: SetShippingMethodsOnCartOutput) => [...Sel]):$Field<"setShippingMethodsOnCart", GetOutput<Sel> | null , GetVariables<Sel, Args>>
setShippingMethodsOnCart<Sel extends Selection<SetShippingMethodsOnCartOutput>>(selectorFn: (s: SetShippingMethodsOnCartOutput) => [...Sel]):$Field<"setShippingMethodsOnCart", GetOutput<Sel> | null , GetVariables<Sel>>
setShippingMethodsOnCart(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "SetShippingMethodsOnCartInput"
            },
        args,

        selection: selectorFn(new SetShippingMethodsOnCartOutput)
      };
      return this.$_select("setShippingMethodsOnCart", options as any) as any
    }
  

      
/**
 * Subscribe the specified email to the store's newsletter.
 */
      subscribeEmailToNewsletter<Args extends VariabledInput<{
        email: string,
      }>,Sel extends Selection<SubscribeEmailToNewsletterOutput>>(args: ExactArgNames<Args, {
        email: string,
      }>, selectorFn: (s: SubscribeEmailToNewsletterOutput) => [...Sel]):$Field<"subscribeEmailToNewsletter", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              email: "String!"
            },
        args,

        selection: selectorFn(new SubscribeEmailToNewsletterOutput)
      };
      return this.$_select("subscribeEmailToNewsletter", options as any) as any
    }
  

      
/**
 * Modify items in the cart.
 */
      updateCartItems<Args extends VariabledInput<{
        input?: UpdateCartItemsInput | null,
      }>,Sel extends Selection<UpdateCartItemsOutput>>(args: ExactArgNames<Args, {
        input?: UpdateCartItemsInput | null,
      }>, selectorFn: (s: UpdateCartItemsOutput) => [...Sel]):$Field<"updateCartItems", GetOutput<Sel> | null , GetVariables<Sel, Args>>
updateCartItems<Sel extends Selection<UpdateCartItemsOutput>>(selectorFn: (s: UpdateCartItemsOutput) => [...Sel]):$Field<"updateCartItems", GetOutput<Sel> | null , GetVariables<Sel>>
updateCartItems(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              input: "UpdateCartItemsInput"
            },
        args,

        selection: selectorFn(new UpdateCartItemsOutput)
      };
      return this.$_select("updateCartItems", options as any) as any
    }
  

      
      updateCustomer<Args extends VariabledInput<{
        input: CustomerInput,
      }>,Sel extends Selection<CustomerOutput>>(args: ExactArgNames<Args, {
        input: CustomerInput,
      }>, selectorFn: (s: CustomerOutput) => [...Sel]):$Field<"updateCustomer", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "CustomerInput!"
            },
        args,

        selection: selectorFn(new CustomerOutput)
      };
      return this.$_select("updateCustomer", options as any) as any
    }
  

      
/**
 * Update the billing or shipping address of a customer or guest.
 */
      updateCustomerAddress<Args extends VariabledInput<{
        id: number
input?: CustomerAddressInput | null,
      }>,Sel extends Selection<CustomerAddress>>(args: ExactArgNames<Args, {
        id: number
input?: CustomerAddressInput | null,
      }>, selectorFn: (s: CustomerAddress) => [...Sel]):$Field<"updateCustomerAddress", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "Int!",
input: "CustomerAddressInput"
            },
        args,

        selection: selectorFn(new CustomerAddress)
      };
      return this.$_select("updateCustomerAddress", options as any) as any
    }
  

      
/**
 * Change the email address for the logged-in customer.
 */
      updateCustomerEmail<Args extends VariabledInput<{
        email: string
password: string,
      }>,Sel extends Selection<CustomerOutput>>(args: ExactArgNames<Args, {
        email: string
password: string,
      }>, selectorFn: (s: CustomerOutput) => [...Sel]):$Field<"updateCustomerEmail", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              email: "String!",
password: "String!"
            },
        args,

        selection: selectorFn(new CustomerOutput)
      };
      return this.$_select("updateCustomerEmail", options as any) as any
    }
  

      
/**
 * Update the customer's personal information.
 */
      updateCustomerV2<Args extends VariabledInput<{
        input: CustomerUpdateInput,
      }>,Sel extends Selection<CustomerOutput>>(args: ExactArgNames<Args, {
        input: CustomerUpdateInput,
      }>, selectorFn: (s: CustomerOutput) => [...Sel]):$Field<"updateCustomerV2", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              input: "CustomerUpdateInput!"
            },
        args,

        selection: selectorFn(new CustomerOutput)
      };
      return this.$_select("updateCustomerV2", options as any) as any
    }
  

      
/**
 * Update one or more products in the specified wish list.
 */
      updateProductsInWishlist<Args extends VariabledInput<{
        wishlistId: string
wishlistItems: Readonly<Array<WishlistItemUpdateInput>>,
      }>,Sel extends Selection<UpdateProductsInWishlistOutput>>(args: ExactArgNames<Args, {
        wishlistId: string
wishlistItems: Readonly<Array<WishlistItemUpdateInput>>,
      }>, selectorFn: (s: UpdateProductsInWishlistOutput) => [...Sel]):$Field<"updateProductsInWishlist", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              wishlistId: "ID!",
wishlistItems: "[WishlistItemUpdateInput!]!"
            },
        args,

        selection: selectorFn(new UpdateProductsInWishlistOutput)
      };
      return this.$_select("updateProductsInWishlist", options as any) as any
    }
  
}


/**
 * Defines the comparison operators that can be used in a filter.
 */
export type FilterTypeInput = {
  eq?: string | null,
finset?: Readonly<Array<string | null>> | null,
from?: string | null,
gt?: string | null,
gteq?: string | null,
in?: Readonly<Array<string | null>> | null,
like?: string | null,
lt?: string | null,
lteq?: string | null,
moreq?: string | null,
neq?: string | null,
nin?: Readonly<Array<string | null>> | null,
notnull?: string | null,
null?: string | null,
to?: string | null
}
    


/**
 * Defines a filter that matches the input exactly.
 */
export type FilterEqualTypeInput = {
  eq?: string | null,
in?: Readonly<Array<string | null>> | null
}
    


/**
 * Defines a filter that matches a range of values, such as prices or dates.
 */
export type FilterRangeTypeInput = {
  from?: string | null,
to?: string | null
}
    


/**
 * Defines a filter that performs a fuzzy search.
 */
export type FilterMatchTypeInput = {
  match?: string | null,
match_type?: FilterMatchTypeEnum | null
}
    

  
export enum FilterMatchTypeEnum {
  
  FULL = "FULL",

  PARTIAL = "PARTIAL"
}
  


/**
 * Defines a filter for an input string.
 */
export type FilterStringTypeInput = {
  eq?: string | null,
in?: Readonly<Array<string | null>> | null,
match?: string | null
}
    


/**
 * Provides navigation for the query response.
 */
export class SearchResultPageInfo extends $Base<"SearchResultPageInfo"> {
  constructor() {
    super("SearchResultPageInfo")
  }

  
      
/**
 * The specific page to return.
 */
      get current_page(): $Field<"current_page", number | null>  {
       return this.$_select("current_page") as any
      }

      
/**
 * The maximum number of items to return per page of results.
 */
      get page_size(): $Field<"page_size", number | null>  {
       return this.$_select("page_size") as any
      }

      
/**
 * The total number of pages in the response.
 */
      get total_pages(): $Field<"total_pages", number | null>  {
       return this.$_select("total_pages") as any
      }
}

  
/**
 * Indicates whether to return results in ascending or descending order.
 */
export enum SortEnum {
  
  ASC = "ASC",

  DESC = "DESC"
}
  


export class ComplexTextValue extends $Base<"ComplexTextValue"> {
  constructor() {
    super("ComplexTextValue")
  }

  
      
/**
 * Text that can contain HTML tags.
 */
      get html(): $Field<"html", string>  {
       return this.$_select("html") as any
      }
}


/**
 * Defines a monetary value, including a numeric value and a currency code.
 */
export class Money extends $Base<"Money"> {
  constructor() {
    super("Money")
  }

  
      
/**
 * A three-letter currency code, such as USD or EUR.
 */
      get currency(): $Field<"currency", CurrencyEnum | null>  {
       return this.$_select("currency") as any
      }

      
/**
 * A number expressing a monetary value.
 */
      get value(): $Field<"value", number | null>  {
       return this.$_select("value") as any
      }
}

  
/**
 * The list of available currency codes.
 */
export enum CurrencyEnum {
  
  AFN = "AFN",

  ALL = "ALL",

  AZN = "AZN",

  DZD = "DZD",

  AOA = "AOA",

  ARS = "ARS",

  AMD = "AMD",

  AWG = "AWG",

  AUD = "AUD",

  BSD = "BSD",

  BHD = "BHD",

  BDT = "BDT",

  BBD = "BBD",

  BYN = "BYN",

  BZD = "BZD",

  BMD = "BMD",

  BTN = "BTN",

  BOB = "BOB",

  BAM = "BAM",

  BWP = "BWP",

  BRL = "BRL",

  GBP = "GBP",

  BND = "BND",

  BGN = "BGN",

  BUK = "BUK",

  BIF = "BIF",

  KHR = "KHR",

  CAD = "CAD",

  CVE = "CVE",

  CZK = "CZK",

  KYD = "KYD",

  GQE = "GQE",

  CLP = "CLP",

  CNY = "CNY",

  COP = "COP",

  KMF = "KMF",

  CDF = "CDF",

  CRC = "CRC",

  HRK = "HRK",

  CUP = "CUP",

  DKK = "DKK",

  DJF = "DJF",

  DOP = "DOP",

  XCD = "XCD",

  EGP = "EGP",

  SVC = "SVC",

  ERN = "ERN",

  EEK = "EEK",

  ETB = "ETB",

  EUR = "EUR",

  FKP = "FKP",

  FJD = "FJD",

  GMD = "GMD",

  GEK = "GEK",

  GEL = "GEL",

  GHS = "GHS",

  GIP = "GIP",

  GTQ = "GTQ",

  GNF = "GNF",

  GYD = "GYD",

  HTG = "HTG",

  HNL = "HNL",

  HKD = "HKD",

  HUF = "HUF",

  ISK = "ISK",

  INR = "INR",

  IDR = "IDR",

  IRR = "IRR",

  IQD = "IQD",

  ILS = "ILS",

  JMD = "JMD",

  JPY = "JPY",

  JOD = "JOD",

  KZT = "KZT",

  KES = "KES",

  KWD = "KWD",

  KGS = "KGS",

  LAK = "LAK",

  LVL = "LVL",

  LBP = "LBP",

  LSL = "LSL",

  LRD = "LRD",

  LYD = "LYD",

  LTL = "LTL",

  MOP = "MOP",

  MKD = "MKD",

  MGA = "MGA",

  MWK = "MWK",

  MYR = "MYR",

  MVR = "MVR",

  LSM = "LSM",

  MRO = "MRO",

  MUR = "MUR",

  MXN = "MXN",

  MDL = "MDL",

  MNT = "MNT",

  MAD = "MAD",

  MZN = "MZN",

  MMK = "MMK",

  NAD = "NAD",

  NPR = "NPR",

  ANG = "ANG",

  YTL = "YTL",

  NZD = "NZD",

  NIC = "NIC",

  NGN = "NGN",

  KPW = "KPW",

  NOK = "NOK",

  OMR = "OMR",

  PKR = "PKR",

  PAB = "PAB",

  PGK = "PGK",

  PYG = "PYG",

  PEN = "PEN",

  PHP = "PHP",

  PLN = "PLN",

  QAR = "QAR",

  RHD = "RHD",

  RON = "RON",

  RUB = "RUB",

  RWF = "RWF",

  SHP = "SHP",

  STD = "STD",

  SAR = "SAR",

  RSD = "RSD",

  SCR = "SCR",

  SLL = "SLL",

  SGD = "SGD",

  SKK = "SKK",

  SBD = "SBD",

  SOS = "SOS",

  ZAR = "ZAR",

  KRW = "KRW",

  LKR = "LKR",

  SDG = "SDG",

  SRD = "SRD",

  SZL = "SZL",

  SEK = "SEK",

  CHF = "CHF",

  SYP = "SYP",

  TWD = "TWD",

  TJS = "TJS",

  TZS = "TZS",

  THB = "THB",

  TOP = "TOP",

  TTD = "TTD",

  TND = "TND",

  TMM = "TMM",

  USD = "USD",

  UGX = "UGX",

  UAH = "UAH",

  AED = "AED",

  UYU = "UYU",

  UZS = "UZS",

  VUV = "VUV",

  VEB = "VEB",

  VEF = "VEF",

  VND = "VND",

  CHE = "CHE",

  CHW = "CHW",

  XOF = "XOF",

  WST = "WST",

  YER = "YER",

  ZMK = "ZMK",

  ZWD = "ZWD",

  TRY = "TRY",

  AZM = "AZM",

  ROL = "ROL",

  TRL = "TRL",

  XPF = "XPF"
}
  


/**
 * Defines a customer-entered option.
 */
export type EnteredOptionInput = {
  uid: string,
value: string
}
    

  
export enum BatchMutationStatus {
  
  SUCCESS = "SUCCESS",

  FAILURE = "FAILURE",

  MIXED_RESULTS = "MIXED_RESULTS"
}
  


export class ErrorInterface extends $Interface<{NoSuchEntityUidError: NoSuchEntityUidError,InternalError: InternalError}, "ErrorInterface"> {
  constructor() {
    super({NoSuchEntityUidError: NoSuchEntityUidError,InternalError: InternalError}, "ErrorInterface")
  }
  
      
/**
 * The returned error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }
}


/**
 * Contains an error message when an invalid UID was specified.
 */
export class NoSuchEntityUidError extends $Base<"NoSuchEntityUidError"> {
  constructor() {
    super("NoSuchEntityUidError")
  }

  
      
/**
 * The returned error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }

      
/**
 * The specified invalid unique ID of an object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains an error message when an internal error occurred.
 */
export class InternalError extends $Base<"InternalError"> {
  constructor() {
    super("InternalError")
  }

  
      
/**
 * The returned error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }
}


/**
 * Defines an array of custom attributes.
 */
export class CustomAttributeMetadata extends $Base<"CustomAttributeMetadata"> {
  constructor() {
    super("CustomAttributeMetadata")
  }

  
      
/**
 * An array of attributes.
 */
      items<Sel extends Selection<Attribute>>(selectorFn: (s: Attribute) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Attribute)
      };
      return this.$_select("items", options as any) as any
    }
  
}


/**
 * Contains details about the attribute, including the code and type.
 */
export class Attribute extends $Base<"Attribute"> {
  constructor() {
    super("Attribute")
  }

  
      
/**
 * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
 */
      get attribute_code(): $Field<"attribute_code", string | null>  {
       return this.$_select("attribute_code") as any
      }

      
/**
 * Attribute options list.
 */
      attribute_options<Sel extends Selection<AttributeOption>>(selectorFn: (s: AttributeOption) => [...Sel]):$Field<"attribute_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AttributeOption)
      };
      return this.$_select("attribute_options", options as any) as any
    }
  

      
/**
 * The data type of the attribute.
 */
      get attribute_type(): $Field<"attribute_type", string | null>  {
       return this.$_select("attribute_type") as any
      }

      
/**
 * The type of entity that defines the attribute.
 */
      get entity_type(): $Field<"entity_type", string | null>  {
       return this.$_select("entity_type") as any
      }

      
/**
 * The frontend input type of the attribute.
 */
      get input_type(): $Field<"input_type", string | null>  {
       return this.$_select("input_type") as any
      }

      
/**
 * Details about the storefront properties configured for the attribute.
 */
      storefront_properties<Sel extends Selection<StorefrontProperties>>(selectorFn: (s: StorefrontProperties) => [...Sel]):$Field<"storefront_properties", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new StorefrontProperties)
      };
      return this.$_select("storefront_properties", options as any) as any
    }
  
}


/**
 * Indicates where an attribute can be displayed.
 */
export class StorefrontProperties extends $Base<"StorefrontProperties"> {
  constructor() {
    super("StorefrontProperties")
  }

  
      
/**
 * The relative position of the attribute in the layered navigation block.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * Indicates whether the attribute is filterable with results, without results, or not at all.
 */
      get use_in_layered_navigation(): $Field<"use_in_layered_navigation", UseInLayeredNavigationOptions | null>  {
       return this.$_select("use_in_layered_navigation") as any
      }

      
/**
 * Indicates whether the attribute is displayed in product listings.
 */
      get use_in_product_listing(): $Field<"use_in_product_listing", boolean | null>  {
       return this.$_select("use_in_product_listing") as any
      }

      
/**
 * Indicates whether the attribute can be used in layered navigation on search results pages.
 */
      get use_in_search_results_layered_navigation(): $Field<"use_in_search_results_layered_navigation", boolean | null>  {
       return this.$_select("use_in_search_results_layered_navigation") as any
      }

      
/**
 * Indicates whether the attribute is displayed on product pages.
 */
      get visible_on_catalog_pages(): $Field<"visible_on_catalog_pages", boolean | null>  {
       return this.$_select("visible_on_catalog_pages") as any
      }
}

  
/**
 * Defines whether the attribute is filterable in layered navigation.
 */
export enum UseInLayeredNavigationOptions {
  
  NO = "NO",

  FILTERABLE_WITH_RESULTS = "FILTERABLE_WITH_RESULTS",

  FILTERABLE_NO_RESULT = "FILTERABLE_NO_RESULT"
}
  


/**
 * Defines an attribute option.
 */
export class AttributeOption extends $Base<"AttributeOption"> {
  constructor() {
    super("AttributeOption")
  }

  
      
/**
 * The label assigned to the attribute option.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The attribute option value.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}


/**
 * Defines the attribute characteristics to search for the `attribute_code` and `entity_type` to search.
 */
export type AttributeInput = {
  attribute_code?: string | null,
entity_type?: string | null
}
    


/**
 * Metadata of EAV attributes.
 */
export class AttributesMetadataOutput extends $Base<"AttributesMetadataOutput"> {
  constructor() {
    super("AttributesMetadataOutput")
  }

  
      
/**
 * Errors of retrieving certain attributes metadata.
 */
      errors<Sel extends Selection<AttributeMetadataError>>(selectorFn: (s: AttributeMetadataError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AttributeMetadataError)
      };
      return this.$_select("errors", options as any) as any
    }
  

      
/**
 * Requested attributes metadata.
 */
      items<Sel extends Selection<CustomAttributeMetadataInterface>>(selectorFn: (s: CustomAttributeMetadataInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomAttributeMetadataInterface)
      };
      return this.$_select("items", options as any) as any
    }
  
}


/**
 * Attribute metadata retrieval error.
 */
export class AttributeMetadataError extends $Base<"AttributeMetadataError"> {
  constructor() {
    super("AttributeMetadataError")
  }

  
      
/**
 * Attribute metadata retrieval error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }

      
/**
 * Attribute metadata retrieval error type.
 */
      get type(): $Field<"type", AttributeMetadataErrorType>  {
       return this.$_select("type") as any
      }
}

  
/**
 * Attribute metadata retrieval error types.
 */
export enum AttributeMetadataErrorType {
  
/**
 * The requested entity was not found.
 */
  ENTITY_NOT_FOUND = "ENTITY_NOT_FOUND",

/**
 * The requested attribute was not found.
 */
  ATTRIBUTE_NOT_FOUND = "ATTRIBUTE_NOT_FOUND",

/**
 * The filter cannot be applied as it does not belong to the entity
 */
  FILTER_NOT_FOUND = "FILTER_NOT_FOUND",

/**
 * Not categorized error, see the error message.
 */
  UNDEFINED = "UNDEFINED"
}
  


/**
 * An interface containing fields that define the EAV attribute.
 */
export class CustomAttributeMetadataInterface extends $Interface<{AttributeMetadata: AttributeMetadata,CatalogAttributeMetadata: CatalogAttributeMetadata,CustomerAttributeMetadata: CustomerAttributeMetadata}, "CustomAttributeMetadataInterface"> {
  constructor() {
    super({AttributeMetadata: AttributeMetadata,CatalogAttributeMetadata: CatalogAttributeMetadata,CustomerAttributeMetadata: CustomerAttributeMetadata}, "CustomAttributeMetadataInterface")
  }
  
      
/**
 * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * Default attribute value.
 */
      get default_value(): $Field<"default_value", string | null>  {
       return this.$_select("default_value") as any
      }

      
/**
 * The type of entity that defines the attribute.
 */
      get entity_type(): $Field<"entity_type", AttributeEntityTypeEnum>  {
       return this.$_select("entity_type") as any
      }

      
/**
 * The frontend class of the attribute.
 */
      get frontend_class(): $Field<"frontend_class", string | null>  {
       return this.$_select("frontend_class") as any
      }

      
/**
 * The frontend input type of the attribute.
 */
      get frontend_input(): $Field<"frontend_input", AttributeFrontendInputEnum | null>  {
       return this.$_select("frontend_input") as any
      }

      
/**
 * Whether the attribute value is required.
 */
      get is_required(): $Field<"is_required", boolean>  {
       return this.$_select("is_required") as any
      }

      
/**
 * Whether the attribute value must be unique.
 */
      get is_unique(): $Field<"is_unique", boolean>  {
       return this.$_select("is_unique") as any
      }

      
/**
 * The label assigned to the attribute.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * Attribute options.
 */
      options<Sel extends Selection<CustomAttributeOptionInterface>>(selectorFn: (s: CustomAttributeOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomAttributeOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  
}


export class CustomAttributeOptionInterface extends $Interface<{AttributeOptionMetadata: AttributeOptionMetadata}, "CustomAttributeOptionInterface"> {
  constructor() {
    super({AttributeOptionMetadata: AttributeOptionMetadata}, "CustomAttributeOptionInterface")
  }
  
      
/**
 * Is the option value default.
 */
      get is_default(): $Field<"is_default", boolean>  {
       return this.$_select("is_default") as any
      }

      
/**
 * The label assigned to the attribute option.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The attribute option value.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


/**
 * Base EAV implementation of CustomAttributeOptionInterface.
 */
export class AttributeOptionMetadata extends $Base<"AttributeOptionMetadata"> {
  constructor() {
    super("AttributeOptionMetadata")
  }

  
      
/**
 * Is the option value default.
 */
      get is_default(): $Field<"is_default", boolean>  {
       return this.$_select("is_default") as any
      }

      
/**
 * The label assigned to the attribute option.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The attribute option value.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


/**
 * Base EAV implementation of CustomAttributeMetadataInterface.
 */
export class AttributeMetadata extends $Base<"AttributeMetadata"> {
  constructor() {
    super("AttributeMetadata")
  }

  
      
/**
 * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * Default attribute value.
 */
      get default_value(): $Field<"default_value", string | null>  {
       return this.$_select("default_value") as any
      }

      
/**
 * The type of entity that defines the attribute.
 */
      get entity_type(): $Field<"entity_type", AttributeEntityTypeEnum>  {
       return this.$_select("entity_type") as any
      }

      
/**
 * The frontend class of the attribute.
 */
      get frontend_class(): $Field<"frontend_class", string | null>  {
       return this.$_select("frontend_class") as any
      }

      
/**
 * The frontend input type of the attribute.
 */
      get frontend_input(): $Field<"frontend_input", AttributeFrontendInputEnum | null>  {
       return this.$_select("frontend_input") as any
      }

      
/**
 * Whether the attribute value is required.
 */
      get is_required(): $Field<"is_required", boolean>  {
       return this.$_select("is_required") as any
      }

      
/**
 * Whether the attribute value must be unique.
 */
      get is_unique(): $Field<"is_unique", boolean>  {
       return this.$_select("is_unique") as any
      }

      
/**
 * The label assigned to the attribute.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * Attribute options.
 */
      options<Sel extends Selection<CustomAttributeOptionInterface>>(selectorFn: (s: CustomAttributeOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomAttributeOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  
}

  
/**
 * List of all entity types. Populated by the modules introducing EAV entities.
 */
export enum AttributeEntityTypeEnum {
  
  CATALOG_PRODUCT = "CATALOG_PRODUCT",

  CATALOG_CATEGORY = "CATALOG_CATEGORY",

  CUSTOMER = "CUSTOMER",

  CUSTOMER_ADDRESS = "CUSTOMER_ADDRESS"
}
  

  
/**
 * EAV attribute frontend input types.
 */
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

  WEIGHT = "WEIGHT",

  UNDEFINED = "UNDEFINED"
}
  


/**
 * Metadata of EAV attributes associated to form
 */
export class AttributesFormOutput extends $Base<"AttributesFormOutput"> {
  constructor() {
    super("AttributesFormOutput")
  }

  
      
/**
 * Errors of retrieving certain attributes metadata.
 */
      errors<Sel extends Selection<AttributeMetadataError>>(selectorFn: (s: AttributeMetadataError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AttributeMetadataError)
      };
      return this.$_select("errors", options as any) as any
    }
  

      
/**
 * Requested attributes metadata.
 */
      items<Sel extends Selection<CustomAttributeMetadataInterface>>(selectorFn: (s: CustomAttributeMetadataInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomAttributeMetadataInterface)
      };
      return this.$_select("items", options as any) as any
    }
  
}


export class AttributeValueInterface extends $Interface<{AttributeValue: AttributeValue,AttributeSelectedOptions: AttributeSelectedOptions}, "AttributeValueInterface"> {
  constructor() {
    super({AttributeValue: AttributeValue,AttributeSelectedOptions: AttributeSelectedOptions}, "AttributeValueInterface")
  }
  
      
/**
 * The attribute code.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }
}


export class AttributeValue extends $Base<"AttributeValue"> {
  constructor() {
    super("AttributeValue")
  }

  
      
/**
 * The attribute code.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * The attribute value.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


export class AttributeSelectedOptions extends $Base<"AttributeSelectedOptions"> {
  constructor() {
    super("AttributeSelectedOptions")
  }

  
      
/**
 * The attribute code.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
      selected_options<Sel extends Selection<AttributeSelectedOptionInterface>>(selectorFn: (s: AttributeSelectedOptionInterface) => [...Sel]):$Field<"selected_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AttributeSelectedOptionInterface)
      };
      return this.$_select("selected_options", options as any) as any
    }
  
}


export class AttributeSelectedOptionInterface extends $Interface<{AttributeSelectedOption: AttributeSelectedOption}, "AttributeSelectedOptionInterface"> {
  constructor() {
    super({AttributeSelectedOption: AttributeSelectedOption}, "AttributeSelectedOptionInterface")
  }
  
      
/**
 * The attribute selected option label.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The attribute selected option value.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


export class AttributeSelectedOption extends $Base<"AttributeSelectedOption"> {
  constructor() {
    super("AttributeSelectedOption")
  }

  
      
/**
 * The attribute selected option label.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The attribute selected option value.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


/**
 * Specifies the value for attribute.
 */
export type AttributeValueInput = {
  attribute_code: string,
selected_options?: Readonly<Array<AttributeInputSelectedOption | null>> | null,
value?: string | null
}
    


/**
 * Specifies selected option for a select or multiselect attribute value.
 */
export type AttributeInputSelectedOption = {
  value: string
}
    


/**
 * An input object that specifies the filters used for attributes.
 */
export type AttributeFilterInput = {
  is_comparable?: boolean | null,
is_filterable?: boolean | null,
is_filterable_in_search?: boolean | null,
is_html_allowed_on_front?: boolean | null,
is_searchable?: boolean | null,
is_used_for_price_rules?: boolean | null,
is_used_for_promo_rules?: boolean | null,
is_visible_in_advanced_search?: boolean | null,
is_visible_on_front?: boolean | null,
is_wysiwyg_enabled?: boolean | null,
used_in_product_listing?: boolean | null
}
    


/**
 * Deprecated. It should not be used on the storefront. Contains information about a website.
 */
export class Website extends $Base<"Website"> {
  constructor() {
    super("Website")
  }

  
      
/**
 * A code assigned to the website to identify it.
 */
      get code(): $Field<"code", string | null>  {
       return this.$_select("code") as any
      }

      
/**
 * The default group ID of the website.
 */
      get default_group_id(): $Field<"default_group_id", string | null>  {
       return this.$_select("default_group_id") as any
      }

      
/**
 * The ID number assigned to the website.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * Indicates whether this is the default website.
 */
      get is_default(): $Field<"is_default", boolean | null>  {
       return this.$_select("is_default") as any
      }

      
/**
 * The website name. Websites use this name to identify it easier.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The attribute to use for sorting websites.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }
}


/**
 * Contains information about a store's configuration.
 */
export class StoreConfig extends $Base<"StoreConfig"> {
  constructor() {
    super("StoreConfig")
  }

  
      
/**
 * Contains scripts that must be included in the HTML before the closing `<body>` tag.
 */
      get absolute_footer(): $Field<"absolute_footer", string | null>  {
       return this.$_select("absolute_footer") as any
      }

      
/**
 * Indicates whether guest users can write product reviews. Possible values: 1 (Yes) and 0 (No).
 */
      get allow_guests_to_write_product_reviews(): $Field<"allow_guests_to_write_product_reviews", string | null>  {
       return this.$_select("allow_guests_to_write_product_reviews") as any
      }

      
/**
 * The value of the Allow Gift Messages for Order Items option
 */
      get allow_items(): $Field<"allow_items", string | null>  {
       return this.$_select("allow_items") as any
      }

      
/**
 * The value of the Allow Gift Messages on Order Level option
 */
      get allow_order(): $Field<"allow_order", string | null>  {
       return this.$_select("allow_order") as any
      }

      
/**
 * Indicates whether to enable autocomplete on login and forgot password forms.
 */
      get autocomplete_on_storefront(): $Field<"autocomplete_on_storefront", boolean | null>  {
       return this.$_select("autocomplete_on_storefront") as any
      }

      
/**
 * The base currency code.
 */
      get base_currency_code(): $Field<"base_currency_code", string | null>  {
       return this.$_select("base_currency_code") as any
      }

      
/**
 * A fully-qualified URL that is used to create relative links to the `base_url`.
 */
      get base_link_url(): $Field<"base_link_url", string | null>  {
       return this.$_select("base_link_url") as any
      }

      
/**
 * The fully-qualified URL that specifies the location of media files.
 */
      get base_media_url(): $Field<"base_media_url", string | null>  {
       return this.$_select("base_media_url") as any
      }

      
/**
 * The fully-qualified URL that specifies the location of static view files.
 */
      get base_static_url(): $Field<"base_static_url", string | null>  {
       return this.$_select("base_static_url") as any
      }

      
/**
 * The store’s fully-qualified base URL.
 */
      get base_url(): $Field<"base_url", string | null>  {
       return this.$_select("base_url") as any
      }

      
/**
 * checkout/cart/delete_quote_after: quote lifetime in days.
 */
      get cart_expires_in_days(): $Field<"cart_expires_in_days", number | null>  {
       return this.$_select("cart_expires_in_days") as any
      }

      
/**
 * checkout/cart_link/use_qty: what to show in the display cart summary, number of items or item quantities.
 */
      get cart_summary_display_quantity(): $Field<"cart_summary_display_quantity", number | null>  {
       return this.$_select("cart_summary_display_quantity") as any
      }

      
/**
 * The default sort order of the search results list.
 */
      get catalog_default_sort_by(): $Field<"catalog_default_sort_by", string | null>  {
       return this.$_select("catalog_default_sort_by") as any
      }

      
/**
 * Corresponds to the 'Display Prices In Product Lists' field in the Admin. It indicates how FPT information is displayed on category pages.
 */
      get category_fixed_product_tax_display_setting(): $Field<"category_fixed_product_tax_display_setting", FixedProductTaxDisplaySettings | null>  {
       return this.$_select("category_fixed_product_tax_display_setting") as any
      }

      
/**
 * The suffix applied to category pages, such as `.htm` or `.html`.
 */
      get category_url_suffix(): $Field<"category_url_suffix", string | null>  {
       return this.$_select("category_url_suffix") as any
      }

      
/**
 * Indicates whether only specific countries can use this payment method.
 */
      get check_money_order_enable_for_specific_countries(): $Field<"check_money_order_enable_for_specific_countries", boolean | null>  {
       return this.$_select("check_money_order_enable_for_specific_countries") as any
      }

      
/**
 * Indicates whether the Check/Money Order payment method is enabled.
 */
      get check_money_order_enabled(): $Field<"check_money_order_enabled", boolean | null>  {
       return this.$_select("check_money_order_enabled") as any
      }

      
/**
 * The name of the party to whom the check must be payable.
 */
      get check_money_order_make_check_payable_to(): $Field<"check_money_order_make_check_payable_to", string | null>  {
       return this.$_select("check_money_order_make_check_payable_to") as any
      }

      
/**
 * The maximum order amount required to qualify for the Check/Money Order payment method.
 */
      get check_money_order_max_order_total(): $Field<"check_money_order_max_order_total", string | null>  {
       return this.$_select("check_money_order_max_order_total") as any
      }

      
/**
 * The minimum order amount required to qualify for the Check/Money Order payment method.
 */
      get check_money_order_min_order_total(): $Field<"check_money_order_min_order_total", string | null>  {
       return this.$_select("check_money_order_min_order_total") as any
      }

      
/**
 * The status of new orders placed using the Check/Money Order payment method.
 */
      get check_money_order_new_order_status(): $Field<"check_money_order_new_order_status", string | null>  {
       return this.$_select("check_money_order_new_order_status") as any
      }

      
/**
 * A comma-separated list of specific countries allowed to use the Check/Money Order payment method.
 */
      get check_money_order_payment_from_specific_countries(): $Field<"check_money_order_payment_from_specific_countries", string | null>  {
       return this.$_select("check_money_order_payment_from_specific_countries") as any
      }

      
/**
 * The full street address or PO Box where the checks are mailed.
 */
      get check_money_order_send_check_to(): $Field<"check_money_order_send_check_to", string | null>  {
       return this.$_select("check_money_order_send_check_to") as any
      }

      
/**
 * A number indicating the position of the Check/Money Order payment method in the list of available payment methods during checkout.
 */
      get check_money_order_sort_order(): $Field<"check_money_order_sort_order", number | null>  {
       return this.$_select("check_money_order_sort_order") as any
      }

      
/**
 * The title of the Check/Money Order payment method displayed on the storefront.
 */
      get check_money_order_title(): $Field<"check_money_order_title", string | null>  {
       return this.$_select("check_money_order_title") as any
      }

      
/**
 * The name of the CMS page that identifies the home page for the store.
 */
      get cms_home_page(): $Field<"cms_home_page", string | null>  {
       return this.$_select("cms_home_page") as any
      }

      
/**
 * A specific CMS page that displays when cookies are not enabled for the browser.
 */
      get cms_no_cookies(): $Field<"cms_no_cookies", string | null>  {
       return this.$_select("cms_no_cookies") as any
      }

      
/**
 * A specific CMS page that displays when a 404 'Page Not Found' error occurs.
 */
      get cms_no_route(): $Field<"cms_no_route", string | null>  {
       return this.$_select("cms_no_route") as any
      }

      
/**
 * A code assigned to the store to identify it.
 */
      get code(): $Field<"code", string | null>  {
       return this.$_select("code") as any
      }

      
/**
 * checkout/cart/configurable_product_image: which image to use for configurable products.
 */
      get configurable_product_image(): $Field<"configurable_product_image", ProductImageThumbnail>  {
       return this.$_select("configurable_product_image") as any
      }

      
/**
 * Indicates whether the `parent` or child (`itself`) thumbnail should be used in the cart for configurable products.
 */
      get configurable_thumbnail_source(): $Field<"configurable_thumbnail_source", string | null>  {
       return this.$_select("configurable_thumbnail_source") as any
      }

      
/**
 * Indicates whether the Contact Us form in enabled.
 */
      get contact_enabled(): $Field<"contact_enabled", boolean>  {
       return this.$_select("contact_enabled") as any
      }

      
/**
 * The copyright statement that appears at the bottom of each page.
 */
      get copyright(): $Field<"copyright", string | null>  {
       return this.$_select("copyright") as any
      }

      
/**
 * Extended Config Data - general/region/state_required
 */
      get countries_with_required_region(): $Field<"countries_with_required_region", string | null>  {
       return this.$_select("countries_with_required_region") as any
      }

      
/**
 * Indicates if the new accounts need confirmation.
 */
      get create_account_confirmation(): $Field<"create_account_confirmation", boolean | null>  {
       return this.$_select("create_account_confirmation") as any
      }

      
/**
 * Customer access token lifetime.
 */
      get customer_access_token_lifetime(): $Field<"customer_access_token_lifetime", number | null>  {
       return this.$_select("customer_access_token_lifetime") as any
      }

      
/**
 * Extended Config Data - general/country/default
 */
      get default_country(): $Field<"default_country", string | null>  {
       return this.$_select("default_country") as any
      }

      
/**
 * The description that provides a summary of your site for search engine listings. It should not be more than 160 characters in length.
 */
      get default_description(): $Field<"default_description", string | null>  {
       return this.$_select("default_description") as any
      }

      
/**
 * The default display currency code.
 */
      get default_display_currency_code(): $Field<"default_display_currency_code", string | null>  {
       return this.$_select("default_display_currency_code") as any
      }

      
/**
 * A series of keywords that describe your store, each separated by a comma.
 */
      get default_keywords(): $Field<"default_keywords", string | null>  {
       return this.$_select("default_keywords") as any
      }

      
/**
 * The title that appears at the title bar of each page when viewed in a browser.
 */
      get default_title(): $Field<"default_title", string | null>  {
       return this.$_select("default_title") as any
      }

      
/**
 * Controls the display of the demo store notice at the top of the page. Options: 0 (No) or 1 (Yes).
 */
      get demonotice(): $Field<"demonotice", number | null>  {
       return this.$_select("demonotice") as any
      }

      
/**
 * Configuration data from tax/display/type
 */
      get display_product_prices_in_catalog(): $Field<"display_product_prices_in_catalog", number>  {
       return this.$_select("display_product_prices_in_catalog") as any
      }

      
/**
 * Configuration data from tax/display/shipping
 */
      get display_shipping_prices(): $Field<"display_shipping_prices", number>  {
       return this.$_select("display_shipping_prices") as any
      }

      
/**
 * Extended Config Data - general/region/display_all
 */
      get display_state_if_optional(): $Field<"display_state_if_optional", boolean | null>  {
       return this.$_select("display_state_if_optional") as any
      }

      
/**
 * Configuration data from tax/weee/apply_vat
 */
      get fixed_product_taxes_apply_tax_to_fpt(): $Field<"fixed_product_taxes_apply_tax_to_fpt", boolean>  {
       return this.$_select("fixed_product_taxes_apply_tax_to_fpt") as any
      }

      
/**
 * Configuration data from tax/weee/display_email
 */
      get fixed_product_taxes_display_prices_in_emails(): $Field<"fixed_product_taxes_display_prices_in_emails", number>  {
       return this.$_select("fixed_product_taxes_display_prices_in_emails") as any
      }

      
/**
 * Configuration data from tax/weee/display_list
 */
      get fixed_product_taxes_display_prices_in_product_lists(): $Field<"fixed_product_taxes_display_prices_in_product_lists", number>  {
       return this.$_select("fixed_product_taxes_display_prices_in_product_lists") as any
      }

      
/**
 * Configuration data from tax/weee/display_sales
 */
      get fixed_product_taxes_display_prices_in_sales_modules(): $Field<"fixed_product_taxes_display_prices_in_sales_modules", number>  {
       return this.$_select("fixed_product_taxes_display_prices_in_sales_modules") as any
      }

      
/**
 * Configuration data from tax/weee/display
 */
      get fixed_product_taxes_display_prices_on_product_view_page(): $Field<"fixed_product_taxes_display_prices_on_product_view_page", number>  {
       return this.$_select("fixed_product_taxes_display_prices_on_product_view_page") as any
      }

      
/**
 * Configuration data from tax/weee/enable
 */
      get fixed_product_taxes_enable(): $Field<"fixed_product_taxes_enable", boolean>  {
       return this.$_select("fixed_product_taxes_enable") as any
      }

      
/**
 * Configuration data from tax/weee/include_in_subtotal
 */
      get fixed_product_taxes_include_fpt_in_subtotal(): $Field<"fixed_product_taxes_include_fpt_in_subtotal", boolean>  {
       return this.$_select("fixed_product_taxes_include_fpt_in_subtotal") as any
      }

      
/**
 * The landing page that is associated with the base URL.
 */
      get front(): $Field<"front", string | null>  {
       return this.$_select("front") as any
      }

      
/**
 * The default number of products per page in Grid View.
 */
      get grid_per_page(): $Field<"grid_per_page", number | null>  {
       return this.$_select("grid_per_page") as any
      }

      
/**
 * A list of numbers that define how many products can be displayed in Grid View.
 */
      get grid_per_page_values(): $Field<"grid_per_page_values", string | null>  {
       return this.$_select("grid_per_page_values") as any
      }

      
/**
 * checkout/cart/grouped_product_image: which image to use for grouped products.
 */
      get grouped_product_image(): $Field<"grouped_product_image", ProductImageThumbnail>  {
       return this.$_select("grouped_product_image") as any
      }

      
/**
 * Scripts that must be included in the HTML before the closing `<head>` tag.
 */
      get head_includes(): $Field<"head_includes", string | null>  {
       return this.$_select("head_includes") as any
      }

      
/**
 * The small graphic image (favicon) that appears in the address bar and tab of the browser.
 */
      get head_shortcut_icon(): $Field<"head_shortcut_icon", string | null>  {
       return this.$_select("head_shortcut_icon") as any
      }

      
/**
 * The path to the logo that appears in the header.
 */
      get header_logo_src(): $Field<"header_logo_src", string | null>  {
       return this.$_select("header_logo_src") as any
      }

      
/**
 * The ID number assigned to the store.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * Configuration data from checkout/options/enable_agreements
 */
      get is_checkout_agreements_enabled(): $Field<"is_checkout_agreements_enabled", boolean>  {
       return this.$_select("is_checkout_agreements_enabled") as any
      }

      
/**
 * Indicates whether the store view has been designated as the default within the store group.
 */
      get is_default_store(): $Field<"is_default_store", boolean | null>  {
       return this.$_select("is_default_store") as any
      }

      
/**
 * Indicates whether the store group has been designated as the default within the website.
 */
      get is_default_store_group(): $Field<"is_default_store_group", boolean | null>  {
       return this.$_select("is_default_store_group") as any
      }

      
/**
 * checkout/options/guest_checkout: whether the guest checkout is enabled or not.
 */
      get is_guest_checkout_enabled(): $Field<"is_guest_checkout_enabled", boolean | null>  {
       return this.$_select("is_guest_checkout_enabled") as any
      }

      
/**
 * checkout/options/onepage_checkout_enabled: whether the one page checkout is enabled or not
 */
      get is_one_page_checkout_enabled(): $Field<"is_one_page_checkout_enabled", boolean | null>  {
       return this.$_select("is_one_page_checkout_enabled") as any
      }

      
/**
 * The format of the search results list.
 */
      get list_mode(): $Field<"list_mode", string | null>  {
       return this.$_select("list_mode") as any
      }

      
/**
 * The default number of products per page in List View.
 */
      get list_per_page(): $Field<"list_per_page", number | null>  {
       return this.$_select("list_per_page") as any
      }

      
/**
 * A list of numbers that define how many products can be displayed in List View.
 */
      get list_per_page_values(): $Field<"list_per_page_values", string | null>  {
       return this.$_select("list_per_page_values") as any
      }

      
/**
 * The store locale.
 */
      get locale(): $Field<"locale", string | null>  {
       return this.$_select("locale") as any
      }

      
/**
 * The Alt text that is associated with the logo.
 */
      get logo_alt(): $Field<"logo_alt", string | null>  {
       return this.$_select("logo_alt") as any
      }

      
/**
 * The height of the logo image, in pixels.
 */
      get logo_height(): $Field<"logo_height", number | null>  {
       return this.$_select("logo_height") as any
      }

      
/**
 * The width of the logo image, in pixels.
 */
      get logo_width(): $Field<"logo_width", number | null>  {
       return this.$_select("logo_width") as any
      }

      
/**
 * Indicates whether wishlists are enabled (1) or disabled (0).
 */
      get magento_wishlist_general_is_enabled(): $Field<"magento_wishlist_general_is_enabled", string | null>  {
       return this.$_select("magento_wishlist_general_is_enabled") as any
      }

      
/**
 * checkout/options/max_items_display_count: maximum number of items to display in order summary.
 */
      get max_items_in_order_summary(): $Field<"max_items_in_order_summary", number | null>  {
       return this.$_select("max_items_in_order_summary") as any
      }

      
/**
 * checkout/sidebar/display: whether to display the minicart or not.
 */
      get minicart_display(): $Field<"minicart_display", boolean | null>  {
       return this.$_select("minicart_display") as any
      }

      
/**
 * checkout/sidebar/count: maximum number of items to show in minicart.
 */
      get minicart_max_items(): $Field<"minicart_max_items", number | null>  {
       return this.$_select("minicart_max_items") as any
      }

      
/**
 * The minimum number of characters required for a valid password.
 */
      get minimum_password_length(): $Field<"minimum_password_length", string | null>  {
       return this.$_select("minimum_password_length") as any
      }

      
/**
 * Mollie store config
 */
      mollie<Sel extends Selection<MollieStoreConfig>>(selectorFn: (s: MollieStoreConfig) => [...Sel]):$Field<"mollie", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MollieStoreConfig)
      };
      return this.$_select("mollie", options as any) as any
    }
  

      
/**
 * Indicates whether newsletters are enabled.
 */
      get newsletter_enabled(): $Field<"newsletter_enabled", boolean>  {
       return this.$_select("newsletter_enabled") as any
      }

      
/**
 * The default page that displays when a 404 'Page not Found' error occurs.
 */
      get no_route(): $Field<"no_route", string | null>  {
       return this.$_select("no_route") as any
      }

      
/**
 * Extended Config Data - general/country/optional_zip_countries
 */
      get optional_zip_countries(): $Field<"optional_zip_countries", string | null>  {
       return this.$_select("optional_zip_countries") as any
      }

      
/**
 * Indicates whether orders can be cancelled by customers or not.
 */
      get order_cancellation_enabled(): $Field<"order_cancellation_enabled", boolean>  {
       return this.$_select("order_cancellation_enabled") as any
      }

      
/**
 * An array containing available cancellation reasons.
 */
      order_cancellation_reasons<Sel extends Selection<CancellationReason>>(selectorFn: (s: CancellationReason) => [...Sel]):$Field<"order_cancellation_reasons", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CancellationReason)
      };
      return this.$_select("order_cancellation_reasons", options as any) as any
    }
  

      
/**
 * Configuration data from tax/sales_display/full_summary
 */
      get orders_invoices_credit_memos_display_full_summary(): $Field<"orders_invoices_credit_memos_display_full_summary", boolean>  {
       return this.$_select("orders_invoices_credit_memos_display_full_summary") as any
      }

      
/**
 * Configuration data from tax/sales_display/grandtotal
 */
      get orders_invoices_credit_memos_display_grandtotal(): $Field<"orders_invoices_credit_memos_display_grandtotal", boolean>  {
       return this.$_select("orders_invoices_credit_memos_display_grandtotal") as any
      }

      
/**
 * Configuration data from tax/sales_display/price
 */
      get orders_invoices_credit_memos_display_price(): $Field<"orders_invoices_credit_memos_display_price", number>  {
       return this.$_select("orders_invoices_credit_memos_display_price") as any
      }

      
/**
 * Configuration data from tax/sales_display/shipping
 */
      get orders_invoices_credit_memos_display_shipping_amount(): $Field<"orders_invoices_credit_memos_display_shipping_amount", number>  {
       return this.$_select("orders_invoices_credit_memos_display_shipping_amount") as any
      }

      
/**
 * Configuration data from tax/sales_display/subtotal
 */
      get orders_invoices_credit_memos_display_subtotal(): $Field<"orders_invoices_credit_memos_display_subtotal", number>  {
       return this.$_select("orders_invoices_credit_memos_display_subtotal") as any
      }

      
/**
 * Configuration data from tax/sales_display/zero_tax
 */
      get orders_invoices_credit_memos_display_zero_tax(): $Field<"orders_invoices_credit_memos_display_zero_tax", boolean>  {
       return this.$_select("orders_invoices_credit_memos_display_zero_tax") as any
      }

      
/**
 * Payflow Pro vault status.
 */
      get payment_payflowpro_cc_vault_active(): $Field<"payment_payflowpro_cc_vault_active", string | null>  {
       return this.$_select("payment_payflowpro_cc_vault_active") as any
      }

      
/**
 * Corresponds to the 'Display Prices On Product View Page' field in the Admin. It indicates how FPT information is displayed on product pages.
 */
      get product_fixed_product_tax_display_setting(): $Field<"product_fixed_product_tax_display_setting", FixedProductTaxDisplaySettings | null>  {
       return this.$_select("product_fixed_product_tax_display_setting") as any
      }

      
/**
 * Indicates whether product reviews are enabled. Possible values: 1 (Yes) and 0 (No).
 */
      get product_reviews_enabled(): $Field<"product_reviews_enabled", string | null>  {
       return this.$_select("product_reviews_enabled") as any
      }

      
/**
 * The suffix applied to product pages, such as `.htm` or `.html`.
 */
      get product_url_suffix(): $Field<"product_url_suffix", string | null>  {
       return this.$_select("product_url_suffix") as any
      }

      
/**
 * The number of different character classes (lowercase, uppercase, digits, special characters) required in a password.
 */
      get required_character_classes_number(): $Field<"required_character_classes_number", string | null>  {
       return this.$_select("required_character_classes_number") as any
      }

      
/**
 * The ID of the root category.
 */
      get root_category_id(): $Field<"root_category_id", number | null>  {
       return this.$_select("root_category_id") as any
      }

      
/**
 * The unique ID for a `CategoryInterface` object.
 */
      get root_category_uid(): $Field<"root_category_uid", string | null>  {
       return this.$_select("root_category_uid") as any
      }

      
/**
 * Corresponds to the 'Display Prices In Sales Modules' field in the Admin. It indicates how FPT information is displayed on cart, checkout, and order pages.
 */
      get sales_fixed_product_tax_display_setting(): $Field<"sales_fixed_product_tax_display_setting", FixedProductTaxDisplaySettings | null>  {
       return this.$_select("sales_fixed_product_tax_display_setting") as any
      }

      
/**
 * A secure fully-qualified URL that is used to create relative links to the `base_url`.
 */
      get secure_base_link_url(): $Field<"secure_base_link_url", string | null>  {
       return this.$_select("secure_base_link_url") as any
      }

      
/**
 * The secure fully-qualified URL that specifies the location of media files.
 */
      get secure_base_media_url(): $Field<"secure_base_media_url", string | null>  {
       return this.$_select("secure_base_media_url") as any
      }

      
/**
 * The secure fully-qualified URL that specifies the location of static view files.
 */
      get secure_base_static_url(): $Field<"secure_base_static_url", string | null>  {
       return this.$_select("secure_base_static_url") as any
      }

      
/**
 * The store’s fully-qualified secure base URL.
 */
      get secure_base_url(): $Field<"secure_base_url", string | null>  {
       return this.$_select("secure_base_url") as any
      }

      
/**
 * Email to a Friend configuration.
 */
      send_friend<Sel extends Selection<SendFriendConfiguration>>(selectorFn: (s: SendFriendConfiguration) => [...Sel]):$Field<"send_friend", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SendFriendConfiguration)
      };
      return this.$_select("send_friend", options as any) as any
    }
  

      
/**
 * Extended Config Data - tax/cart_display/full_summary
 */
      get shopping_cart_display_full_summary(): $Field<"shopping_cart_display_full_summary", boolean | null>  {
       return this.$_select("shopping_cart_display_full_summary") as any
      }

      
/**
 * Extended Config Data - tax/cart_display/grandtotal
 */
      get shopping_cart_display_grand_total(): $Field<"shopping_cart_display_grand_total", boolean | null>  {
       return this.$_select("shopping_cart_display_grand_total") as any
      }

      
/**
 * Extended Config Data - tax/cart_display/price
 */
      get shopping_cart_display_price(): $Field<"shopping_cart_display_price", number | null>  {
       return this.$_select("shopping_cart_display_price") as any
      }

      
/**
 * Extended Config Data - tax/cart_display/shipping
 */
      get shopping_cart_display_shipping(): $Field<"shopping_cart_display_shipping", number | null>  {
       return this.$_select("shopping_cart_display_shipping") as any
      }

      
/**
 * Extended Config Data - tax/cart_display/subtotal
 */
      get shopping_cart_display_subtotal(): $Field<"shopping_cart_display_subtotal", number | null>  {
       return this.$_select("shopping_cart_display_subtotal") as any
      }

      
/**
 * Extended Config Data - tax/cart_display/gift_wrapping
 */
      get shopping_cart_display_tax_gift_wrapping(): $Field<"shopping_cart_display_tax_gift_wrapping", TaxWrappingEnum | null>  {
       return this.$_select("shopping_cart_display_tax_gift_wrapping") as any
      }

      
/**
 * Extended Config Data - tax/cart_display/zero_tax
 */
      get shopping_cart_display_zero_tax(): $Field<"shopping_cart_display_zero_tax", boolean | null>  {
       return this.$_select("shopping_cart_display_zero_tax") as any
      }

      
/**
 * Indicates whether a breadcrumb trail appears on all CMS pages in the catalog. 0 (No) or 1 (Yes).
 */
      get show_cms_breadcrumbs(): $Field<"show_cms_breadcrumbs", number | null>  {
       return this.$_select("show_cms_breadcrumbs") as any
      }

      
/**
 * The unique ID of the store view. In the Admin, this is called the Store View Code. When making a GraphQL call, assign this value to the `Store` header to provide the scope.
 */
      get store_code(): $Field<"store_code", string | null>  {
       return this.$_select("store_code") as any
      }

      
/**
 * The unique ID assigned to the store group. In the Admin, this is called the Store Name.
 */
      get store_group_code(): $Field<"store_group_code", string | null>  {
       return this.$_select("store_group_code") as any
      }

      
/**
 * The label assigned to the store group.
 */
      get store_group_name(): $Field<"store_group_name", string | null>  {
       return this.$_select("store_group_name") as any
      }

      
/**
 * The label assigned to the store view.
 */
      get store_name(): $Field<"store_name", string | null>  {
       return this.$_select("store_name") as any
      }

      
/**
 * The store view sort order.
 */
      get store_sort_order(): $Field<"store_sort_order", number | null>  {
       return this.$_select("store_sort_order") as any
      }

      
/**
 * The time zone of the store.
 */
      get timezone(): $Field<"timezone", string | null>  {
       return this.$_select("timezone") as any
      }

      
/**
 * A prefix that appears before the title to create a two- or three-part title.
 */
      get title_prefix(): $Field<"title_prefix", string | null>  {
       return this.$_select("title_prefix") as any
      }

      
/**
 * The character that separates the category name and subcategory in the browser title bar.
 */
      get title_separator(): $Field<"title_separator", string | null>  {
       return this.$_select("title_separator") as any
      }

      
/**
 * A suffix that appears after the title to create a two- or three-part title.
 */
      get title_suffix(): $Field<"title_suffix", string | null>  {
       return this.$_select("title_suffix") as any
      }

      
/**
 * Indicates whether the store code should be used in the URL.
 */
      get use_store_in_url(): $Field<"use_store_in_url", boolean | null>  {
       return this.$_select("use_store_in_url") as any
      }

      
/**
 * The unique ID for the website.
 */
      get website_code(): $Field<"website_code", string | null>  {
       return this.$_select("website_code") as any
      }

      
/**
 * The ID number assigned to the website store.
 */
      get website_id(): $Field<"website_id", number | null>  {
       return this.$_select("website_id") as any
      }

      
/**
 * The label assigned to the website.
 */
      get website_name(): $Field<"website_name", string | null>  {
       return this.$_select("website_name") as any
      }

      
/**
 * The unit of weight.
 */
      get weight_unit(): $Field<"weight_unit", string | null>  {
       return this.$_select("weight_unit") as any
      }

      
/**
 * Text that appears in the header of the page and includes the name of the logged in customer.
 */
      get welcome(): $Field<"welcome", string | null>  {
       return this.$_select("welcome") as any
      }

      
/**
 * Indicates whether only specific countries can use this payment method.
 */
      get zero_subtotal_enable_for_specific_countries(): $Field<"zero_subtotal_enable_for_specific_countries", boolean | null>  {
       return this.$_select("zero_subtotal_enable_for_specific_countries") as any
      }

      
/**
 * Indicates whether the Zero Subtotal payment method is enabled.
 */
      get zero_subtotal_enabled(): $Field<"zero_subtotal_enabled", boolean | null>  {
       return this.$_select("zero_subtotal_enabled") as any
      }

      
/**
 * The status of new orders placed using the Zero Subtotal payment method.
 */
      get zero_subtotal_new_order_status(): $Field<"zero_subtotal_new_order_status", string | null>  {
       return this.$_select("zero_subtotal_new_order_status") as any
      }

      
/**
 * When the new order status is 'Processing', this can be set to `authorize_capture` to automatically invoice all items that have a zero balance.
 */
      get zero_subtotal_payment_action(): $Field<"zero_subtotal_payment_action", string | null>  {
       return this.$_select("zero_subtotal_payment_action") as any
      }

      
/**
 * A comma-separated list of specific countries allowed to use the Zero Subtotal payment method.
 */
      get zero_subtotal_payment_from_specific_countries(): $Field<"zero_subtotal_payment_from_specific_countries", string | null>  {
       return this.$_select("zero_subtotal_payment_from_specific_countries") as any
      }

      
/**
 * A number indicating the position of the Zero Subtotal payment method in the list of available payment methods during checkout.
 */
      get zero_subtotal_sort_order(): $Field<"zero_subtotal_sort_order", number | null>  {
       return this.$_select("zero_subtotal_sort_order") as any
      }

      
/**
 * The title of the Zero Subtotal payment method displayed on the storefront.
 */
      get zero_subtotal_title(): $Field<"zero_subtotal_title", string | null>  {
       return this.$_select("zero_subtotal_title") as any
      }
}


/**
 * Defines details about an individual checkout agreement.
 */
export class CheckoutAgreement extends $Base<"CheckoutAgreement"> {
  constructor() {
    super("CheckoutAgreement")
  }

  
      
/**
 * The ID for a checkout agreement.
 */
      get agreement_id(): $Field<"agreement_id", number>  {
       return this.$_select("agreement_id") as any
      }

      
/**
 * The checkbox text for the checkout agreement.
 */
      get checkbox_text(): $Field<"checkbox_text", string>  {
       return this.$_select("checkbox_text") as any
      }

      
/**
 * Required. The text of the agreement.
 */
      get content(): $Field<"content", string>  {
       return this.$_select("content") as any
      }

      
/**
 * The height of the text box where the Terms and Conditions statement appears during checkout.
 */
      get content_height(): $Field<"content_height", string | null>  {
       return this.$_select("content_height") as any
      }

      
/**
 * Indicates whether the `content` text is in HTML format.
 */
      get is_html(): $Field<"is_html", boolean>  {
       return this.$_select("is_html") as any
      }

      
/**
 * Indicates whether agreements are accepted automatically or manually.
 */
      get mode(): $Field<"mode", CheckoutAgreementMode>  {
       return this.$_select("mode") as any
      }

      
/**
 * The name given to the condition.
 */
      get name(): $Field<"name", string>  {
       return this.$_select("name") as any
      }
}

  
/**
 * Indicates how agreements are accepted.
 */
export enum CheckoutAgreementMode {
  
/**
 * Conditions are automatically accepted upon checkout.
 */
  AUTO = "AUTO",

/**
 * Shoppers must manually accept the conditions to place an order.
 */
  MANUAL = "MANUAL"
}
  


/**
 * Contains details about a CMS page.
 */
export class CmsPage extends $Base<"CmsPage"> {
  constructor() {
    super("CmsPage")
  }

  
      
/**
 * The content of the CMS page in raw HTML.
 */
      get content(): $Field<"content", string | null>  {
       return this.$_select("content") as any
      }

      
/**
 * The heading that displays at the top of the CMS page.
 */
      get content_heading(): $Field<"content_heading", string | null>  {
       return this.$_select("content_heading") as any
      }

      
/**
 * The ID of a CMS page.
 */
      get identifier(): $Field<"identifier", string | null>  {
       return this.$_select("identifier") as any
      }

      
/**
 * A brief description of the page for search results listings.
 */
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
/**
 * A brief description of the page for search results listings.
 */
      get meta_keywords(): $Field<"meta_keywords", string | null>  {
       return this.$_select("meta_keywords") as any
      }

      
/**
 * A page title that is indexed by search engines and appears in search results listings.
 */
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * The design layout of the page, indicating the number of columns and navigation features used on the page.
 */
      get page_layout(): $Field<"page_layout", string | null>  {
       return this.$_select("page_layout") as any
      }

      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * The name that appears in the breadcrumb trail navigation and in the browser title bar and tab.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }

      
/**
 * The URL key of the CMS page, which is often based on the `content_heading`.
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }
}


/**
 * Contains an array CMS block items.
 */
export class CmsBlocks extends $Base<"CmsBlocks"> {
  constructor() {
    super("CmsBlocks")
  }

  
      
/**
 * An array of CMS blocks.
 */
      items<Sel extends Selection<CmsBlock>>(selectorFn: (s: CmsBlock) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CmsBlock)
      };
      return this.$_select("items", options as any) as any
    }
  
}


/**
 * Contains details about a specific CMS block.
 */
export class CmsBlock extends $Base<"CmsBlock"> {
  constructor() {
    super("CmsBlock")
  }

  
      
/**
 * The content of the CMS block in raw HTML.
 */
      get content(): $Field<"content", string | null>  {
       return this.$_select("content") as any
      }

      
/**
 * The CMS block identifier.
 */
      get identifier(): $Field<"identifier", string | null>  {
       return this.$_select("identifier") as any
      }

      
/**
 * The title assigned to the CMS block.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }
}

  
/**
 * This enumeration defines the entity type.
 */
export enum UrlRewriteEntityTypeEnum {
  
  CMS_PAGE = "CMS_PAGE",

  PRODUCT = "PRODUCT",

  CATEGORY = "CATEGORY"
}
  


/**
 * Deprecated. Use `ProductPrice` instead. Defines the price of a product as well as any tax-related adjustments.
 */
export class Price extends $Base<"Price"> {
  constructor() {
    super("Price")
  }

  
      
/**
 * An array that provides information about tax, weee, or weee_tax adjustments.
 */
      adjustments<Sel extends Selection<PriceAdjustment>>(selectorFn: (s: PriceAdjustment) => [...Sel]):$Field<"adjustments", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceAdjustment)
      };
      return this.$_select("adjustments", options as any) as any
    }
  

      
/**
 * The price of a product plus a three-letter currency code.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  
}


/**
 * Deprecated. Taxes will be included or excluded in the price. Defines the amount of money to apply as an adjustment, the type of adjustment to apply, and whether the item is included or excluded from the adjustment.
 */
export class PriceAdjustment extends $Base<"PriceAdjustment"> {
  constructor() {
    super("PriceAdjustment")
  }

  
      
/**
 * The amount of the price adjustment and its currency code.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  

      
/**
 * Indicates whether the adjustment involves tax, weee, or weee_tax.
 */
      get code(): $Field<"code", PriceAdjustmentCodesEnum | null>  {
       return this.$_select("code") as any
      }

      
/**
 * Indicates whether the entity described by the code attribute is included or excluded from the adjustment.
 */
      get description(): $Field<"description", PriceAdjustmentDescriptionEnum | null>  {
       return this.$_select("description") as any
      }
}

  
/**
 * `PriceAdjustment.code` is deprecated.
 */
export enum PriceAdjustmentCodesEnum {
  
  TAX = "TAX",

  WEEE = "WEEE",

  WEEE_TAX = "WEEE_TAX"
}
  

  
/**
 * `PriceAdjustmentDescriptionEnum` is deprecated. States whether a price adjustment is included or excluded.
 */
export enum PriceAdjustmentDescriptionEnum {
  
  INCLUDED = "INCLUDED",

  EXCLUDED = "EXCLUDED"
}
  

  
/**
 * Defines the price type.
 */
export enum PriceTypeEnum {
  
  FIXED = "FIXED",

  PERCENT = "PERCENT",

  DYNAMIC = "DYNAMIC"
}
  

  
/**
 * Defines the customizable date type.
 */
export enum CustomizableDateTypeEnum {
  
  DATE = "DATE",

  DATE_TIME = "DATE_TIME",

  TIME = "TIME"
}
  


/**
 * Deprecated. Use `PriceRange` instead. Contains the regular price of an item, as well as its minimum and maximum prices. Only composite products, which include bundle, configurable, and grouped products, can contain a minimum and maximum price.
 */
export class ProductPrices extends $Base<"ProductPrices"> {
  constructor() {
    super("ProductPrices")
  }

  
      
/**
 * The highest possible final price for all the options defined within a composite product. If you are specifying a price range, this would be the `to` value.
 */
      maximalPrice<Sel extends Selection<Price>>(selectorFn: (s: Price) => [...Sel]):$Field<"maximalPrice", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Price)
      };
      return this.$_select("maximalPrice", options as any) as any
    }
  

      
/**
 * The lowest possible final price for all the options defined within a composite product. If you are specifying a price range, this would be the `from` value.
 */
      minimalPrice<Sel extends Selection<Price>>(selectorFn: (s: Price) => [...Sel]):$Field<"minimalPrice", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Price)
      };
      return this.$_select("minimalPrice", options as any) as any
    }
  

      
/**
 * The base price of a product.
 */
      regularPrice<Sel extends Selection<Price>>(selectorFn: (s: Price) => [...Sel]):$Field<"regularPrice", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Price)
      };
      return this.$_select("regularPrice", options as any) as any
    }
  
}


/**
 * Contains the price range for a product. If the product has a single price, the minimum and maximum price will be the same.
 */
export class PriceRange extends $Base<"PriceRange"> {
  constructor() {
    super("PriceRange")
  }

  
      
/**
 * The highest possible price for the product.
 */
      maximum_price<Sel extends Selection<ProductPrice>>(selectorFn: (s: ProductPrice) => [...Sel]):$Field<"maximum_price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductPrice)
      };
      return this.$_select("maximum_price", options as any) as any
    }
  

      
/**
 * The lowest possible price for the product.
 */
      minimum_price<Sel extends Selection<ProductPrice>>(selectorFn: (s: ProductPrice) => [...Sel]):$Field<"minimum_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductPrice)
      };
      return this.$_select("minimum_price", options as any) as any
    }
  
}


/**
 * Represents a product price.
 */
export class ProductPrice extends $Base<"ProductPrice"> {
  constructor() {
    super("ProductPrice")
  }

  
      
/**
 * The price discount. Represents the difference between the regular and final price.
 */
      discount<Sel extends Selection<ProductDiscount>>(selectorFn: (s: ProductDiscount) => [...Sel]):$Field<"discount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductDiscount)
      };
      return this.$_select("discount", options as any) as any
    }
  

      
/**
 * The final price of the product after applying discounts.
 */
      final_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"final_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("final_price", options as any) as any
    }
  

      
/**
 * An array of the multiple Fixed Product Taxes that can be applied to a product price.
 */
      fixed_product_taxes<Sel extends Selection<FixedProductTax>>(selectorFn: (s: FixedProductTax) => [...Sel]):$Field<"fixed_product_taxes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new FixedProductTax)
      };
      return this.$_select("fixed_product_taxes", options as any) as any
    }
  

      
/**
 * The regular price of the product.
 */
      regular_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"regular_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("regular_price", options as any) as any
    }
  
}


/**
 * Contains the discount applied to a product price.
 */
export class ProductDiscount extends $Base<"ProductDiscount"> {
  constructor() {
    super("ProductDiscount")
  }

  
      
/**
 * The actual value of the discount.
 */
      get amount_off(): $Field<"amount_off", number | null>  {
       return this.$_select("amount_off") as any
      }

      
/**
 * The discount expressed a percentage.
 */
      get percent_off(): $Field<"percent_off", number | null>  {
       return this.$_select("percent_off") as any
      }
}


/**
 * An implementation of `ProductLinksInterface`.
 */
export class ProductLinks extends $Base<"ProductLinks"> {
  constructor() {
    super("ProductLinks")
  }

  
      
/**
 * One of related, associated, upsell, or crosssell.
 */
      get link_type(): $Field<"link_type", string | null>  {
       return this.$_select("link_type") as any
      }

      
/**
 * The SKU of the linked product.
 */
      get linked_product_sku(): $Field<"linked_product_sku", string | null>  {
       return this.$_select("linked_product_sku") as any
      }

      
/**
 * The type of linked product (simple, virtual, bundle, downloadable, grouped, configurable).
 */
      get linked_product_type(): $Field<"linked_product_type", string | null>  {
       return this.$_select("linked_product_type") as any
      }

      
/**
 * The position within the list of product links.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * The identifier of the linked product.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }
}


/**
 * Contains information about linked products, including the link type and product type of each item.
 */
export class ProductLinksInterface extends $Interface<{ProductLinks: ProductLinks}, "ProductLinksInterface"> {
  constructor() {
    super({ProductLinks: ProductLinks}, "ProductLinksInterface")
  }
  
      
/**
 * One of related, associated, upsell, or crosssell.
 */
      get link_type(): $Field<"link_type", string | null>  {
       return this.$_select("link_type") as any
      }

      
/**
 * The SKU of the linked product.
 */
      get linked_product_sku(): $Field<"linked_product_sku", string | null>  {
       return this.$_select("linked_product_sku") as any
      }

      
/**
 * The type of linked product (simple, virtual, bundle, downloadable, grouped, configurable).
 */
      get linked_product_type(): $Field<"linked_product_type", string | null>  {
       return this.$_select("linked_product_type") as any
      }

      
/**
 * The position within the list of product links.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * The identifier of the linked product.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }
}


/**
 * Contains fields that are common to all types of products.
 */
export class ProductInterface extends $Interface<{VirtualProduct: VirtualProduct,SimpleProduct: SimpleProduct,DownloadableProduct: DownloadableProduct,BundleProduct: BundleProduct,GroupedProduct: GroupedProduct,ConfigurableProduct: ConfigurableProduct}, "ProductInterface"> {
  constructor() {
    super({VirtualProduct: VirtualProduct,SimpleProduct: SimpleProduct,DownloadableProduct: DownloadableProduct,BundleProduct: BundleProduct,GroupedProduct: GroupedProduct,ConfigurableProduct: ConfigurableProduct}, "ProductInterface")
  }
  
      
/**
 * The attribute set assigned to the product.
 */
      get attribute_set_id(): $Field<"attribute_set_id", number | null>  {
       return this.$_select("attribute_set_id") as any
      }

      
      get brand(): $Field<"brand", number | null>  {
       return this.$_select("brand") as any
      }

      
/**
 * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
 */
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
/**
 * The categories assigned to a product.
 */
      categories<Sel extends Selection<CategoryInterface>>(selectorFn: (s: CategoryInterface) => [...Sel]):$Field<"categories", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CategoryInterface)
      };
      return this.$_select("categories", options as any) as any
    }
  

      
      get color(): $Field<"color", number | null>  {
       return this.$_select("color") as any
      }

      
/**
 * The product's country of origin.
 */
      get country_of_manufacture(): $Field<"country_of_manufacture", string | null>  {
       return this.$_select("country_of_manufacture") as any
      }

      
/**
 * Timestamp indicating when the product was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
/**
 * Crosssell Products
 */
      crosssell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"crosssell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("crosssell_products", options as any) as any
    }
  

      
/**
 * Product custom attributes.
 */
      custom_attributesV2<Args extends VariabledInput<{
        filters?: AttributeFilterInput | null,
      }>,Sel extends Selection<ProductCustomAttributes>>(args: ExactArgNames<Args, {
        filters?: AttributeFilterInput | null,
      }>, selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
custom_attributesV2<Sel extends Selection<ProductCustomAttributes>>(selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel>>
custom_attributesV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filters: "AttributeFilterInput"
            },
        args,

        selection: selectorFn(new ProductCustomAttributes)
      };
      return this.$_select("custom_attributesV2", options as any) as any
    }
  

      
/**
 * Detailed information about the product. The value can include simple HTML tags.
 */
      description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("description", options as any) as any
    }
  

      
/**
 * Returns a value indicating gift message availability for the product.
 */
      get gift_message_available(): $Field<"gift_message_available", boolean>  {
       return this.$_select("gift_message_available") as any
      }

      
/**
 * The ID number assigned to the product.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The relative path to the main image on the product page.
 */
      image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("image", options as any) as any
    }
  

      
/**
 * A number representing the product's manufacturer.
 */
      get manufacturer(): $Field<"manufacturer", number | null>  {
       return this.$_select("manufacturer") as any
      }

      
/**
 * Maximum Qty Allowed in Shopping Cart
 */
      get max_sale_qty(): $Field<"max_sale_qty", number | null>  {
       return this.$_select("max_sale_qty") as any
      }

      
/**
 * An array of media gallery objects.
 */
      media_gallery<Sel extends Selection<MediaGalleryInterface>>(selectorFn: (s: MediaGalleryInterface) => [...Sel]):$Field<"media_gallery", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryInterface)
      };
      return this.$_select("media_gallery", options as any) as any
    }
  

      
/**
 * An array of MediaGalleryEntry objects.
 */
      media_gallery_entries<Sel extends Selection<MediaGalleryEntry>>(selectorFn: (s: MediaGalleryEntry) => [...Sel]):$Field<"media_gallery_entries", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryEntry)
      };
      return this.$_select("media_gallery_entries", options as any) as any
    }
  

      
/**
 * A brief overview of the product for search results listings, maximum 255 characters.
 */
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
/**
 * A comma-separated list of keywords that are visible only to search engines.
 */
      get meta_keyword(): $Field<"meta_keyword", string | null>  {
       return this.$_select("meta_keyword") as any
      }

      
/**
 * A string that is displayed in the title bar and tab of the browser and in search results lists.
 */
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * Minimum Qty Allowed in Shopping Cart
 */
      get min_sale_qty(): $Field<"min_sale_qty", number | null>  {
       return this.$_select("min_sale_qty") as any
      }

      
/**
 * The product name. Customers use this name to identify the product.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The beginning date for new product listings, and determines if the product is featured as a new product.
 */
      get new_from_date(): $Field<"new_from_date", string | null>  {
       return this.$_select("new_from_date") as any
      }

      
/**
 * The end date for new product listings.
 */
      get new_to_date(): $Field<"new_to_date", string | null>  {
       return this.$_select("new_to_date") as any
      }

      
/**
 * Product stock only x left count
 */
      get only_x_left_in_stock(): $Field<"only_x_left_in_stock", number | null>  {
       return this.$_select("only_x_left_in_stock") as any
      }

      
/**
 * If the product has multiple options, determines where they appear on the product page.
 */
      get options_container(): $Field<"options_container", string | null>  {
       return this.$_select("options_container") as any
      }

      
/**
 * Indicates the price of an item.
 */
      price<Sel extends Selection<ProductPrices>>(selectorFn: (s: ProductPrices) => [...Sel]):$Field<"price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductPrices)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The range of prices for the product
 */
      price_range<Sel extends Selection<PriceRange>>(selectorFn: (s: PriceRange) => [...Sel]):$Field<"price_range", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceRange)
      };
      return this.$_select("price_range", options as any) as any
    }
  

      
/**
 * An array of `TierPrice` objects.
 */
      price_tiers<Sel extends Selection<TierPrice>>(selectorFn: (s: TierPrice) => [...Sel]):$Field<"price_tiers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TierPrice)
      };
      return this.$_select("price_tiers", options as any) as any
    }
  

      
/**
 * An array of `ProductLinks` objects.
 */
      product_links<Sel extends Selection<ProductLinksInterface>>(selectorFn: (s: ProductLinksInterface) => [...Sel]):$Field<"product_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductLinksInterface)
      };
      return this.$_select("product_links", options as any) as any
    }
  

      
/**
 * Amount of available stock
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The average of all the ratings given to the product.
 */
      get rating_summary(): $Field<"rating_summary", number>  {
       return this.$_select("rating_summary") as any
      }

      
/**
 * An array of products to be displayed in a Related Products block.
 */
      related_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"related_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("related_products", options as any) as any
    }
  

      
/**
 * The total count of all the reviews given to the product.
 */
      get review_count(): $Field<"review_count", number>  {
       return this.$_select("review_count") as any
      }

      
/**
 * The list of products reviews.
 */
      reviews<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<ProductReviews>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel, Args>>
reviews<Sel extends Selection<ProductReviews>>(selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel>>
reviews(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new ProductReviews)
      };
      return this.$_select("reviews", options as any) as any
    }
  

      
/**
 * A short description of the product. Its use depends on the theme.
 */
      short_description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"short_description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("short_description", options as any) as any
    }
  

      
/**
 * A number or code assigned to a product to identify the product, options, price, and manufacturer.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The relative path to the small image, which is used on catalog pages.
 */
      small_image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"small_image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("small_image", options as any) as any
    }
  

      
/**
 * The beginning date that a product has a special price.
 */
      get special_from_date(): $Field<"special_from_date", string | null>  {
       return this.$_select("special_from_date") as any
      }

      
/**
 * The discounted price of the product.
 */
      get special_price(): $Field<"special_price", number | null>  {
       return this.$_select("special_price") as any
      }

      
/**
 * The end date for a product with a special price.
 */
      get special_to_date(): $Field<"special_to_date", string | null>  {
       return this.$_select("special_to_date") as any
      }

      
/**
 * The status assigned to the product, 0 for disabled, 1 for enabled.
 */
      get status(): $Field<"status", number | null>  {
       return this.$_select("status") as any
      }

      
/**
 * Stock status of the product
 */
      get stock_status(): $Field<"stock_status", ProductStockStatus | null>  {
       return this.$_select("stock_status") as any
      }

      
/**
 * The file name of a swatch image.
 */
      get swatch_image(): $Field<"swatch_image", string | null>  {
       return this.$_select("swatch_image") as any
      }

      
/**
 * The relative path to the product's thumbnail image.
 */
      thumbnail<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"thumbnail", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("thumbnail", options as any) as any
    }
  

      
/**
 * The price when tier pricing is in effect and the items purchased threshold has been reached.
 */
      get tier_price(): $Field<"tier_price", number | null>  {
       return this.$_select("tier_price") as any
      }

      
/**
 * An array of ProductTierPrices objects.
 */
      tier_prices<Sel extends Selection<ProductTierPrices>>(selectorFn: (s: ProductTierPrices) => [...Sel]):$Field<"tier_prices", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductTierPrices)
      };
      return this.$_select("tier_prices", options as any) as any
    }
  

      
/**
 * One of simple, virtual, bundle, downloadable, grouped, or configurable.
 */
      get type_id(): $Field<"type_id", string | null>  {
       return this.$_select("type_id") as any
      }

      
/**
 * The unique ID for a `ProductInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * Timestamp indicating when the product was updated.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }

      
/**
 * Upsell Products
 */
      upsell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"upsell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("upsell_products", options as any) as any
    }
  

      
/**
 * The part of the URL that identifies the product
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }

      
      get url_path(): $Field<"url_path", string | null>  {
       return this.$_select("url_path") as any
      }

      
/**
 * URL rewrites list
 */
      url_rewrites<Sel extends Selection<UrlRewrite>>(selectorFn: (s: UrlRewrite) => [...Sel]):$Field<"url_rewrites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new UrlRewrite)
      };
      return this.$_select("url_rewrites", options as any) as any
    }
  

      
/**
 * The part of the product URL that is appended after the url key
 */
      get url_suffix(): $Field<"url_suffix", string | null>  {
       return this.$_select("url_suffix") as any
      }

      
/**
 * The visibility assigned to the product.
 */
      get visibility(): $Field<"visibility", number | null>  {
       return this.$_select("visibility") as any
      }

      
/**
 * An array of websites in which the product is available.
 */
      websites<Sel extends Selection<Website>>(selectorFn: (s: Website) => [...Sel]):$Field<"websites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Website)
      };
      return this.$_select("websites", options as any) as any
    }
  
}


/**
 * Contains attributes specific to tangible products.
 */
export class PhysicalProductInterface extends $Interface<{SimpleProduct: SimpleProduct,BundleProduct: BundleProduct,GroupedProduct: GroupedProduct,ConfigurableProduct: ConfigurableProduct}, "PhysicalProductInterface"> {
  constructor() {
    super({SimpleProduct: SimpleProduct,BundleProduct: BundleProduct,GroupedProduct: GroupedProduct,ConfigurableProduct: ConfigurableProduct}, "PhysicalProductInterface")
  }
  
      
/**
 * The weight of the item, in units defined by the store.
 */
      get weight(): $Field<"weight", number | null>  {
       return this.$_select("weight") as any
      }
}


/**
 * Contains information about a text area that is defined as part of a customizable option.
 */
export class CustomizableAreaOption extends $Base<"CustomizableAreaOption"> {
  constructor() {
    super("CustomizableAreaOption")
  }

  
      
/**
 * Option ID.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * The Stock Keeping Unit of the base product.
 */
      get product_sku(): $Field<"product_sku", string | null>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * Indicates whether the option is required.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableOptionInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An object that defines a text area.
 */
      value<Sel extends Selection<CustomizableAreaValue>>(selectorFn: (s: CustomizableAreaValue) => [...Sel]):$Field<"value", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableAreaValue)
      };
      return this.$_select("value", options as any) as any
    }
  
}


/**
 * Defines the price and sku of a product whose page contains a customized text area.
 */
export class CustomizableAreaValue extends $Base<"CustomizableAreaValue"> {
  constructor() {
    super("CustomizableAreaValue")
  }

  
      
/**
 * The maximum number of characters that can be entered for this customizable option.
 */
      get max_characters(): $Field<"max_characters", number | null>  {
       return this.$_select("max_characters") as any
      }

      
/**
 * The price assigned to this option.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
/**
 * FIXED, PERCENT, or DYNAMIC.
 */
      get price_type(): $Field<"price_type", PriceTypeEnum | null>  {
       return this.$_select("price_type") as any
      }

      
/**
 * The Stock Keeping Unit for this option.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The unique ID for a `CustomizableAreaValue` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains the hierarchy of categories.
 */
export class CategoryTree extends $Base<"CategoryTree"> {
  constructor() {
    super("CategoryTree")
  }

  
      
      get available_sort_by(): $Field<"available_sort_by", Readonly<Array<string | null>> | null>  {
       return this.$_select("available_sort_by") as any
      }

      
/**
 * An array of breadcrumb items.
 */
      breadcrumbs<Sel extends Selection<Breadcrumb>>(selectorFn: (s: Breadcrumb) => [...Sel]):$Field<"breadcrumbs", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Breadcrumb)
      };
      return this.$_select("breadcrumbs", options as any) as any
    }
  

      
/**
 * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Categories' is enabled.
 */
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
/**
 * A tree of child categories.
 */
      children<Sel extends Selection<CategoryTree>>(selectorFn: (s: CategoryTree) => [...Sel]):$Field<"children", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CategoryTree)
      };
      return this.$_select("children", options as any) as any
    }
  

      
      get children_count(): $Field<"children_count", string | null>  {
       return this.$_select("children_count") as any
      }

      
/**
 * Contains a category CMS block.
 */
      cms_block<Sel extends Selection<CmsBlock>>(selectorFn: (s: CmsBlock) => [...Sel]):$Field<"cms_block", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CmsBlock)
      };
      return this.$_select("cms_block", options as any) as any
    }
  

      
/**
 * The timestamp indicating when the category was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
      get custom_layout_update_file(): $Field<"custom_layout_update_file", string | null>  {
       return this.$_select("custom_layout_update_file") as any
      }

      
/**
 * The attribute to use for sorting.
 */
      get default_sort_by(): $Field<"default_sort_by", string | null>  {
       return this.$_select("default_sort_by") as any
      }

      
/**
 * An optional description of the category.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
      get display_mode(): $Field<"display_mode", string | null>  {
       return this.$_select("display_mode") as any
      }

      
      get filter_price_range(): $Field<"filter_price_range", number | null>  {
       return this.$_select("filter_price_range") as any
      }

      
/**
 * An ID that uniquely identifies the category.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
      get image(): $Field<"image", string | null>  {
       return this.$_select("image") as any
      }

      
      get include_in_menu(): $Field<"include_in_menu", number | null>  {
       return this.$_select("include_in_menu") as any
      }

      
      get is_anchor(): $Field<"is_anchor", number | null>  {
       return this.$_select("is_anchor") as any
      }

      
      get landing_page(): $Field<"landing_page", number | null>  {
       return this.$_select("landing_page") as any
      }

      
/**
 * The depth of the category within the tree.
 */
      get level(): $Field<"level", number | null>  {
       return this.$_select("level") as any
      }

      
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
      get meta_keywords(): $Field<"meta_keywords", string | null>  {
       return this.$_select("meta_keywords") as any
      }

      
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * The display name of the category.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
      get no_archive(): $Field<"no_archive", number | null>  {
       return this.$_select("no_archive") as any
      }

      
      get no_follow(): $Field<"no_follow", number | null>  {
       return this.$_select("no_follow") as any
      }

      
      get no_index(): $Field<"no_index", number | null>  {
       return this.$_select("no_index") as any
      }

      
/**
 * The full category path.
 */
      get path(): $Field<"path", string | null>  {
       return this.$_select("path") as any
      }

      
/**
 * The category path within the store.
 */
      get path_in_store(): $Field<"path_in_store", string | null>  {
       return this.$_select("path_in_store") as any
      }

      
/**
 * The position of the category relative to other categories at the same level in tree.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * The number of products in the category that are marked as visible. By default, in complex products, parent products are visible, but their child products are not.
 */
      get product_count(): $Field<"product_count", number | null>  {
       return this.$_select("product_count") as any
      }

      
/**
 * The list of products assigned to the category.
 */
      products<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null
sort?: ProductAttributeSortInput | null,
      }>,Sel extends Selection<CategoryProducts>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null
sort?: ProductAttributeSortInput | null,
      }>, selectorFn: (s: CategoryProducts) => [...Sel]):$Field<"products", GetOutput<Sel> | null , GetVariables<Sel, Args>>
products<Sel extends Selection<CategoryProducts>>(selectorFn: (s: CategoryProducts) => [...Sel]):$Field<"products", GetOutput<Sel> | null , GetVariables<Sel>>
products(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int",
sort: "ProductAttributeSortInput"
            },
        args,

        selection: selectorFn(new CategoryProducts)
      };
      return this.$_select("products", options as any) as any
    }
  

      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }

      
/**
 * The unique ID for a `CategoryInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * The timestamp indicating when the category was updated.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }

      
/**
 * The URL key assigned to the category.
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }

      
/**
 * The URL path assigned to the category.
 */
      get url_path(): $Field<"url_path", string | null>  {
       return this.$_select("url_path") as any
      }

      
/**
 * The part of the category URL that is appended after the url key
 */
      get url_suffix(): $Field<"url_suffix", string | null>  {
       return this.$_select("url_suffix") as any
      }
}


/**
 * Contains a collection of `CategoryTree` objects and pagination information.
 */
export class CategoryResult extends $Base<"CategoryResult"> {
  constructor() {
    super("CategoryResult")
  }

  
      
/**
 * A list of categories that match the filter criteria.
 */
      items<Sel extends Selection<CategoryTree>>(selectorFn: (s: CategoryTree) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CategoryTree)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * An object that includes the `page_info` and `currentPage` values specified in the query.
 */
      page_info<Sel extends Selection<SearchResultPageInfo>>(selectorFn: (s: SearchResultPageInfo) => [...Sel]):$Field<"page_info", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchResultPageInfo)
      };
      return this.$_select("page_info", options as any) as any
    }
  

      
/**
 * The total number of categories that match the criteria.
 */
      get total_count(): $Field<"total_count", number | null>  {
       return this.$_select("total_count") as any
      }
}


/**
 * Contains information about a date picker that is defined as part of a customizable option.
 */
export class CustomizableDateOption extends $Base<"CustomizableDateOption"> {
  constructor() {
    super("CustomizableDateOption")
  }

  
      
/**
 * Option ID.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * The Stock Keeping Unit of the base product.
 */
      get product_sku(): $Field<"product_sku", string | null>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * Indicates whether the option is required.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableOptionInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An object that defines a date field in a customizable option.
 */
      value<Sel extends Selection<CustomizableDateValue>>(selectorFn: (s: CustomizableDateValue) => [...Sel]):$Field<"value", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableDateValue)
      };
      return this.$_select("value", options as any) as any
    }
  
}


/**
 * Defines the price and sku of a product whose page contains a customized date picker.
 */
export class CustomizableDateValue extends $Base<"CustomizableDateValue"> {
  constructor() {
    super("CustomizableDateValue")
  }

  
      
/**
 * The price assigned to this option.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
/**
 * FIXED, PERCENT, or DYNAMIC.
 */
      get price_type(): $Field<"price_type", PriceTypeEnum | null>  {
       return this.$_select("price_type") as any
      }

      
/**
 * The Stock Keeping Unit for this option.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * DATE, DATE_TIME or TIME
 */
      get type(): $Field<"type", CustomizableDateTypeEnum | null>  {
       return this.$_select("type") as any
      }

      
/**
 * The unique ID for a `CustomizableDateValue` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains information about a drop down menu that is defined as part of a customizable option.
 */
export class CustomizableDropDownOption extends $Base<"CustomizableDropDownOption"> {
  constructor() {
    super("CustomizableDropDownOption")
  }

  
      
/**
 * Option ID.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * Indicates whether the option is required.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableOptionInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An array that defines the set of options for a drop down menu.
 */
      value<Sel extends Selection<CustomizableDropDownValue>>(selectorFn: (s: CustomizableDropDownValue) => [...Sel]):$Field<"value", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableDropDownValue)
      };
      return this.$_select("value", options as any) as any
    }
  
}


/**
 * Defines the price and sku of a product whose page contains a customized drop down menu.
 */
export class CustomizableDropDownValue extends $Base<"CustomizableDropDownValue"> {
  constructor() {
    super("CustomizableDropDownValue")
  }

  
      
/**
 * The ID assigned to the value.
 */
      get option_type_id(): $Field<"option_type_id", number | null>  {
       return this.$_select("option_type_id") as any
      }

      
/**
 * The price assigned to this option.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
/**
 * FIXED, PERCENT, or DYNAMIC.
 */
      get price_type(): $Field<"price_type", PriceTypeEnum | null>  {
       return this.$_select("price_type") as any
      }

      
/**
 * The Stock Keeping Unit for this option.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableDropDownValue` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains information about a multiselect that is defined as part of a customizable option.
 */
export class CustomizableMultipleOption extends $Base<"CustomizableMultipleOption"> {
  constructor() {
    super("CustomizableMultipleOption")
  }

  
      
/**
 * Option ID.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * Indicates whether the option is required.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableOptionInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An array that defines the set of options for a multiselect.
 */
      value<Sel extends Selection<CustomizableMultipleValue>>(selectorFn: (s: CustomizableMultipleValue) => [...Sel]):$Field<"value", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableMultipleValue)
      };
      return this.$_select("value", options as any) as any
    }
  
}


/**
 * Defines the price and sku of a product whose page contains a customized multiselect.
 */
export class CustomizableMultipleValue extends $Base<"CustomizableMultipleValue"> {
  constructor() {
    super("CustomizableMultipleValue")
  }

  
      
/**
 * The ID assigned to the value.
 */
      get option_type_id(): $Field<"option_type_id", number | null>  {
       return this.$_select("option_type_id") as any
      }

      
/**
 * The price assigned to this option.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
/**
 * FIXED, PERCENT, or DYNAMIC.
 */
      get price_type(): $Field<"price_type", PriceTypeEnum | null>  {
       return this.$_select("price_type") as any
      }

      
/**
 * The Stock Keeping Unit for this option.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableMultipleValue` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains information about a text field that is defined as part of a customizable option.
 */
export class CustomizableFieldOption extends $Base<"CustomizableFieldOption"> {
  constructor() {
    super("CustomizableFieldOption")
  }

  
      
/**
 * Option ID.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * The Stock Keeping Unit of the base product.
 */
      get product_sku(): $Field<"product_sku", string | null>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * Indicates whether the option is required.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableOptionInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An object that defines a text field.
 */
      value<Sel extends Selection<CustomizableFieldValue>>(selectorFn: (s: CustomizableFieldValue) => [...Sel]):$Field<"value", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableFieldValue)
      };
      return this.$_select("value", options as any) as any
    }
  
}


/**
 * Defines the price and sku of a product whose page contains a customized text field.
 */
export class CustomizableFieldValue extends $Base<"CustomizableFieldValue"> {
  constructor() {
    super("CustomizableFieldValue")
  }

  
      
/**
 * The maximum number of characters that can be entered for this customizable option.
 */
      get max_characters(): $Field<"max_characters", number | null>  {
       return this.$_select("max_characters") as any
      }

      
/**
 * The price of the custom value.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
/**
 * FIXED, PERCENT, or DYNAMIC.
 */
      get price_type(): $Field<"price_type", PriceTypeEnum | null>  {
       return this.$_select("price_type") as any
      }

      
/**
 * The Stock Keeping Unit for this option.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The unique ID for a `CustomizableFieldValue` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains information about a file picker that is defined as part of a customizable option.
 */
export class CustomizableFileOption extends $Base<"CustomizableFileOption"> {
  constructor() {
    super("CustomizableFileOption")
  }

  
      
/**
 * Option ID.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * The Stock Keeping Unit of the base product.
 */
      get product_sku(): $Field<"product_sku", string | null>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * Indicates whether the option is required.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableOptionInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An object that defines a file value.
 */
      value<Sel extends Selection<CustomizableFileValue>>(selectorFn: (s: CustomizableFileValue) => [...Sel]):$Field<"value", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableFileValue)
      };
      return this.$_select("value", options as any) as any
    }
  
}


/**
 * Defines the price and sku of a product whose page contains a customized file picker.
 */
export class CustomizableFileValue extends $Base<"CustomizableFileValue"> {
  constructor() {
    super("CustomizableFileValue")
  }

  
      
/**
 * The file extension to accept.
 */
      get file_extension(): $Field<"file_extension", string | null>  {
       return this.$_select("file_extension") as any
      }

      
/**
 * The maximum width of an image.
 */
      get image_size_x(): $Field<"image_size_x", number | null>  {
       return this.$_select("image_size_x") as any
      }

      
/**
 * The maximum height of an image.
 */
      get image_size_y(): $Field<"image_size_y", number | null>  {
       return this.$_select("image_size_y") as any
      }

      
/**
 * The price assigned to this option.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
/**
 * FIXED, PERCENT, or DYNAMIC.
 */
      get price_type(): $Field<"price_type", PriceTypeEnum | null>  {
       return this.$_select("price_type") as any
      }

      
/**
 * The Stock Keeping Unit for this option.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The unique ID for a `CustomizableFileValue` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains basic information about a product image or video.
 */
export class MediaGalleryInterface extends $Interface<{ProductImage: ProductImage,ProductVideo: ProductVideo}, "MediaGalleryInterface"> {
  constructor() {
    super({ProductImage: ProductImage,ProductVideo: ProductVideo}, "MediaGalleryInterface")
  }
  
      
/**
 * Indicates whether the image is hidden from view.
 */
      get disabled(): $Field<"disabled", boolean | null>  {
       return this.$_select("disabled") as any
      }

      
/**
 * The label of the product image or video.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The media item's position after it has been sorted.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * The URL of the product image or video.
 */
      get url(): $Field<"url", string | null>  {
       return this.$_select("url") as any
      }
}


/**
 * Contains product image information, including the image URL and label.
 */
export class ProductImage extends $Base<"ProductImage"> {
  constructor() {
    super("ProductImage")
  }

  
      
/**
 * Indicates whether the image is hidden from view.
 */
      get disabled(): $Field<"disabled", boolean | null>  {
       return this.$_select("disabled") as any
      }

      
/**
 * The label of the product image or video.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The media item's position after it has been sorted.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * The URL of the product image or video.
 */
      get url(): $Field<"url", string | null>  {
       return this.$_select("url") as any
      }
}


/**
 * Contains information about a product video.
 */
export class ProductVideo extends $Base<"ProductVideo"> {
  constructor() {
    super("ProductVideo")
  }

  
      
/**
 * Indicates whether the image is hidden from view.
 */
      get disabled(): $Field<"disabled", boolean | null>  {
       return this.$_select("disabled") as any
      }

      
/**
 * The label of the product image or video.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The media item's position after it has been sorted.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * The URL of the product image or video.
 */
      get url(): $Field<"url", string | null>  {
       return this.$_select("url") as any
      }

      
/**
 * Contains a `ProductMediaGalleryEntriesVideoContent` object.
 */
      video_content<Sel extends Selection<ProductMediaGalleryEntriesVideoContent>>(selectorFn: (s: ProductMediaGalleryEntriesVideoContent) => [...Sel]):$Field<"video_content", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductMediaGalleryEntriesVideoContent)
      };
      return this.$_select("video_content", options as any) as any
    }
  
}


/**
 * Contains basic information about a customizable option. It can be implemented by several types of configurable options.
 */
export class CustomizableOptionInterface extends $Interface<{CustomizableAreaOption: CustomizableAreaOption,CustomizableDateOption: CustomizableDateOption,CustomizableDropDownOption: CustomizableDropDownOption,CustomizableMultipleOption: CustomizableMultipleOption,CustomizableFieldOption: CustomizableFieldOption,CustomizableFileOption: CustomizableFileOption,CustomizableRadioOption: CustomizableRadioOption,CustomizableCheckboxOption: CustomizableCheckboxOption}, "CustomizableOptionInterface"> {
  constructor() {
    super({CustomizableAreaOption: CustomizableAreaOption,CustomizableDateOption: CustomizableDateOption,CustomizableDropDownOption: CustomizableDropDownOption,CustomizableMultipleOption: CustomizableMultipleOption,CustomizableFieldOption: CustomizableFieldOption,CustomizableFileOption: CustomizableFileOption,CustomizableRadioOption: CustomizableRadioOption,CustomizableCheckboxOption: CustomizableCheckboxOption}, "CustomizableOptionInterface")
  }
  
      
/**
 * Option ID.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * Indicates whether the option is required.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableOptionInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains information about customizable product options.
 */
export class CustomizableProductInterface extends $Interface<{VirtualProduct: VirtualProduct,SimpleProduct: SimpleProduct,DownloadableProduct: DownloadableProduct,BundleProduct: BundleProduct,ConfigurableProduct: ConfigurableProduct}, "CustomizableProductInterface"> {
  constructor() {
    super({VirtualProduct: VirtualProduct,SimpleProduct: SimpleProduct,DownloadableProduct: DownloadableProduct,BundleProduct: BundleProduct,ConfigurableProduct: ConfigurableProduct}, "CustomizableProductInterface")
  }
  
      
/**
 * An array of options for a customizable product.
 */
      options<Sel extends Selection<CustomizableOptionInterface>>(selectorFn: (s: CustomizableOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  
}


/**
 * Contains the full set of attributes that can be returned in a category search.
 */
export class CategoryInterface extends $Interface<{CategoryTree: CategoryTree}, "CategoryInterface"> {
  constructor() {
    super({CategoryTree: CategoryTree}, "CategoryInterface")
  }
  
      
      get available_sort_by(): $Field<"available_sort_by", Readonly<Array<string | null>> | null>  {
       return this.$_select("available_sort_by") as any
      }

      
/**
 * An array of breadcrumb items.
 */
      breadcrumbs<Sel extends Selection<Breadcrumb>>(selectorFn: (s: Breadcrumb) => [...Sel]):$Field<"breadcrumbs", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Breadcrumb)
      };
      return this.$_select("breadcrumbs", options as any) as any
    }
  

      
/**
 * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Categories' is enabled.
 */
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
      get children_count(): $Field<"children_count", string | null>  {
       return this.$_select("children_count") as any
      }

      
/**
 * Contains a category CMS block.
 */
      cms_block<Sel extends Selection<CmsBlock>>(selectorFn: (s: CmsBlock) => [...Sel]):$Field<"cms_block", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CmsBlock)
      };
      return this.$_select("cms_block", options as any) as any
    }
  

      
/**
 * The timestamp indicating when the category was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
      get custom_layout_update_file(): $Field<"custom_layout_update_file", string | null>  {
       return this.$_select("custom_layout_update_file") as any
      }

      
/**
 * The attribute to use for sorting.
 */
      get default_sort_by(): $Field<"default_sort_by", string | null>  {
       return this.$_select("default_sort_by") as any
      }

      
/**
 * An optional description of the category.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
      get display_mode(): $Field<"display_mode", string | null>  {
       return this.$_select("display_mode") as any
      }

      
      get filter_price_range(): $Field<"filter_price_range", number | null>  {
       return this.$_select("filter_price_range") as any
      }

      
/**
 * An ID that uniquely identifies the category.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
      get image(): $Field<"image", string | null>  {
       return this.$_select("image") as any
      }

      
      get include_in_menu(): $Field<"include_in_menu", number | null>  {
       return this.$_select("include_in_menu") as any
      }

      
      get is_anchor(): $Field<"is_anchor", number | null>  {
       return this.$_select("is_anchor") as any
      }

      
      get landing_page(): $Field<"landing_page", number | null>  {
       return this.$_select("landing_page") as any
      }

      
/**
 * The depth of the category within the tree.
 */
      get level(): $Field<"level", number | null>  {
       return this.$_select("level") as any
      }

      
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
      get meta_keywords(): $Field<"meta_keywords", string | null>  {
       return this.$_select("meta_keywords") as any
      }

      
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * The display name of the category.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
      get no_archive(): $Field<"no_archive", number | null>  {
       return this.$_select("no_archive") as any
      }

      
      get no_follow(): $Field<"no_follow", number | null>  {
       return this.$_select("no_follow") as any
      }

      
      get no_index(): $Field<"no_index", number | null>  {
       return this.$_select("no_index") as any
      }

      
/**
 * The full category path.
 */
      get path(): $Field<"path", string | null>  {
       return this.$_select("path") as any
      }

      
/**
 * The category path within the store.
 */
      get path_in_store(): $Field<"path_in_store", string | null>  {
       return this.$_select("path_in_store") as any
      }

      
/**
 * The position of the category relative to other categories at the same level in tree.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * The number of products in the category that are marked as visible. By default, in complex products, parent products are visible, but their child products are not.
 */
      get product_count(): $Field<"product_count", number | null>  {
       return this.$_select("product_count") as any
      }

      
/**
 * The list of products assigned to the category.
 */
      products<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null
sort?: ProductAttributeSortInput | null,
      }>,Sel extends Selection<CategoryProducts>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null
sort?: ProductAttributeSortInput | null,
      }>, selectorFn: (s: CategoryProducts) => [...Sel]):$Field<"products", GetOutput<Sel> | null , GetVariables<Sel, Args>>
products<Sel extends Selection<CategoryProducts>>(selectorFn: (s: CategoryProducts) => [...Sel]):$Field<"products", GetOutput<Sel> | null , GetVariables<Sel>>
products(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int",
sort: "ProductAttributeSortInput"
            },
        args,

        selection: selectorFn(new CategoryProducts)
      };
      return this.$_select("products", options as any) as any
    }
  

      
/**
 * The unique ID for a `CategoryInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * The timestamp indicating when the category was updated.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }

      
/**
 * The URL key assigned to the category.
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }

      
/**
 * The URL path assigned to the category.
 */
      get url_path(): $Field<"url_path", string | null>  {
       return this.$_select("url_path") as any
      }

      
/**
 * The part of the category URL that is appended after the url key
 */
      get url_suffix(): $Field<"url_suffix", string | null>  {
       return this.$_select("url_suffix") as any
      }
}


/**
 * Contains details about an individual category that comprises a breadcrumb.
 */
export class Breadcrumb extends $Base<"Breadcrumb"> {
  constructor() {
    super("Breadcrumb")
  }

  
      
/**
 * The ID of the category.
 */
      get category_id(): $Field<"category_id", number | null>  {
       return this.$_select("category_id") as any
      }

      
/**
 * The category level.
 */
      get category_level(): $Field<"category_level", number | null>  {
       return this.$_select("category_level") as any
      }

      
/**
 * The display name of the category.
 */
      get category_name(): $Field<"category_name", string | null>  {
       return this.$_select("category_name") as any
      }

      
/**
 * The unique ID for a `Breadcrumb` object.
 */
      get category_uid(): $Field<"category_uid", string>  {
       return this.$_select("category_uid") as any
      }

      
/**
 * The URL key of the category.
 */
      get category_url_key(): $Field<"category_url_key", string | null>  {
       return this.$_select("category_url_key") as any
      }

      
/**
 * The URL path of the category.
 */
      get category_url_path(): $Field<"category_url_path", string | null>  {
       return this.$_select("category_url_path") as any
      }
}


/**
 * Contains information about a set of radio buttons that are defined as part of a customizable option.
 */
export class CustomizableRadioOption extends $Base<"CustomizableRadioOption"> {
  constructor() {
    super("CustomizableRadioOption")
  }

  
      
/**
 * Option ID.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * Indicates whether the option is required.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableOptionInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An array that defines a set of radio buttons.
 */
      value<Sel extends Selection<CustomizableRadioValue>>(selectorFn: (s: CustomizableRadioValue) => [...Sel]):$Field<"value", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableRadioValue)
      };
      return this.$_select("value", options as any) as any
    }
  
}


/**
 * Defines the price and sku of a product whose page contains a customized set of radio buttons.
 */
export class CustomizableRadioValue extends $Base<"CustomizableRadioValue"> {
  constructor() {
    super("CustomizableRadioValue")
  }

  
      
/**
 * The ID assigned to the value.
 */
      get option_type_id(): $Field<"option_type_id", number | null>  {
       return this.$_select("option_type_id") as any
      }

      
/**
 * The price assigned to this option.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
/**
 * FIXED, PERCENT, or DYNAMIC.
 */
      get price_type(): $Field<"price_type", PriceTypeEnum | null>  {
       return this.$_select("price_type") as any
      }

      
/**
 * The Stock Keeping Unit for this option.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The order in which the radio button is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableRadioValue` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains information about a set of checkbox values that are defined as part of a customizable option.
 */
export class CustomizableCheckboxOption extends $Base<"CustomizableCheckboxOption"> {
  constructor() {
    super("CustomizableCheckboxOption")
  }

  
      
/**
 * Option ID.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * Indicates whether the option is required.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The order in which the option is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableOptionInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An array that defines a set of checkbox values.
 */
      value<Sel extends Selection<CustomizableCheckboxValue>>(selectorFn: (s: CustomizableCheckboxValue) => [...Sel]):$Field<"value", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableCheckboxValue)
      };
      return this.$_select("value", options as any) as any
    }
  
}


/**
 * Defines the price and sku of a product whose page contains a customized set of checkbox values.
 */
export class CustomizableCheckboxValue extends $Base<"CustomizableCheckboxValue"> {
  constructor() {
    super("CustomizableCheckboxValue")
  }

  
      
/**
 * The ID assigned to the value.
 */
      get option_type_id(): $Field<"option_type_id", number | null>  {
       return this.$_select("option_type_id") as any
      }

      
/**
 * The price assigned to this option.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
/**
 * FIXED, PERCENT, or DYNAMIC.
 */
      get price_type(): $Field<"price_type", PriceTypeEnum | null>  {
       return this.$_select("price_type") as any
      }

      
/**
 * The Stock Keeping Unit for this option.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The order in which the checkbox value is displayed.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name for this option.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `CustomizableCheckboxValue` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Defines a virtual product, which is a non-tangible product that does not require shipping and is not kept in inventory.
 */
export class VirtualProduct extends $Base<"VirtualProduct"> {
  constructor() {
    super("VirtualProduct")
  }

  
      
/**
 * The attribute set assigned to the product.
 */
      get attribute_set_id(): $Field<"attribute_set_id", number | null>  {
       return this.$_select("attribute_set_id") as any
      }

      
      get brand(): $Field<"brand", number | null>  {
       return this.$_select("brand") as any
      }

      
/**
 * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
 */
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
/**
 * The categories assigned to a product.
 */
      categories<Sel extends Selection<CategoryInterface>>(selectorFn: (s: CategoryInterface) => [...Sel]):$Field<"categories", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CategoryInterface)
      };
      return this.$_select("categories", options as any) as any
    }
  

      
      get color(): $Field<"color", number | null>  {
       return this.$_select("color") as any
      }

      
/**
 * The product's country of origin.
 */
      get country_of_manufacture(): $Field<"country_of_manufacture", string | null>  {
       return this.$_select("country_of_manufacture") as any
      }

      
/**
 * Timestamp indicating when the product was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
/**
 * Crosssell Products
 */
      crosssell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"crosssell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("crosssell_products", options as any) as any
    }
  

      
/**
 * Product custom attributes.
 */
      custom_attributesV2<Args extends VariabledInput<{
        filters?: AttributeFilterInput | null,
      }>,Sel extends Selection<ProductCustomAttributes>>(args: ExactArgNames<Args, {
        filters?: AttributeFilterInput | null,
      }>, selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
custom_attributesV2<Sel extends Selection<ProductCustomAttributes>>(selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel>>
custom_attributesV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filters: "AttributeFilterInput"
            },
        args,

        selection: selectorFn(new ProductCustomAttributes)
      };
      return this.$_select("custom_attributesV2", options as any) as any
    }
  

      
/**
 * Detailed information about the product. The value can include simple HTML tags.
 */
      description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("description", options as any) as any
    }
  

      
/**
 * Returns a value indicating gift message availability for the product.
 */
      get gift_message_available(): $Field<"gift_message_available", boolean>  {
       return this.$_select("gift_message_available") as any
      }

      
/**
 * The ID number assigned to the product.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The relative path to the main image on the product page.
 */
      image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("image", options as any) as any
    }
  

      
/**
 * A number representing the product's manufacturer.
 */
      get manufacturer(): $Field<"manufacturer", number | null>  {
       return this.$_select("manufacturer") as any
      }

      
/**
 * Maximum Qty Allowed in Shopping Cart
 */
      get max_sale_qty(): $Field<"max_sale_qty", number | null>  {
       return this.$_select("max_sale_qty") as any
      }

      
/**
 * An array of media gallery objects.
 */
      media_gallery<Sel extends Selection<MediaGalleryInterface>>(selectorFn: (s: MediaGalleryInterface) => [...Sel]):$Field<"media_gallery", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryInterface)
      };
      return this.$_select("media_gallery", options as any) as any
    }
  

      
/**
 * An array of MediaGalleryEntry objects.
 */
      media_gallery_entries<Sel extends Selection<MediaGalleryEntry>>(selectorFn: (s: MediaGalleryEntry) => [...Sel]):$Field<"media_gallery_entries", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryEntry)
      };
      return this.$_select("media_gallery_entries", options as any) as any
    }
  

      
/**
 * A brief overview of the product for search results listings, maximum 255 characters.
 */
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
/**
 * A comma-separated list of keywords that are visible only to search engines.
 */
      get meta_keyword(): $Field<"meta_keyword", string | null>  {
       return this.$_select("meta_keyword") as any
      }

      
/**
 * A string that is displayed in the title bar and tab of the browser and in search results lists.
 */
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * Minimum Qty Allowed in Shopping Cart
 */
      get min_sale_qty(): $Field<"min_sale_qty", number | null>  {
       return this.$_select("min_sale_qty") as any
      }

      
/**
 * The product name. Customers use this name to identify the product.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The beginning date for new product listings, and determines if the product is featured as a new product.
 */
      get new_from_date(): $Field<"new_from_date", string | null>  {
       return this.$_select("new_from_date") as any
      }

      
/**
 * The end date for new product listings.
 */
      get new_to_date(): $Field<"new_to_date", string | null>  {
       return this.$_select("new_to_date") as any
      }

      
/**
 * Product stock only x left count
 */
      get only_x_left_in_stock(): $Field<"only_x_left_in_stock", number | null>  {
       return this.$_select("only_x_left_in_stock") as any
      }

      
/**
 * An array of options for a customizable product.
 */
      options<Sel extends Selection<CustomizableOptionInterface>>(selectorFn: (s: CustomizableOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  

      
/**
 * If the product has multiple options, determines where they appear on the product page.
 */
      get options_container(): $Field<"options_container", string | null>  {
       return this.$_select("options_container") as any
      }

      
/**
 * Indicates the price of an item.
 */
      price<Sel extends Selection<ProductPrices>>(selectorFn: (s: ProductPrices) => [...Sel]):$Field<"price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductPrices)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The range of prices for the product
 */
      price_range<Sel extends Selection<PriceRange>>(selectorFn: (s: PriceRange) => [...Sel]):$Field<"price_range", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceRange)
      };
      return this.$_select("price_range", options as any) as any
    }
  

      
/**
 * An array of `TierPrice` objects.
 */
      price_tiers<Sel extends Selection<TierPrice>>(selectorFn: (s: TierPrice) => [...Sel]):$Field<"price_tiers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TierPrice)
      };
      return this.$_select("price_tiers", options as any) as any
    }
  

      
/**
 * An array of `ProductLinks` objects.
 */
      product_links<Sel extends Selection<ProductLinksInterface>>(selectorFn: (s: ProductLinksInterface) => [...Sel]):$Field<"product_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductLinksInterface)
      };
      return this.$_select("product_links", options as any) as any
    }
  

      
/**
 * Amount of available stock
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The average of all the ratings given to the product.
 */
      get rating_summary(): $Field<"rating_summary", number>  {
       return this.$_select("rating_summary") as any
      }

      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * An array of products to be displayed in a Related Products block.
 */
      related_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"related_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("related_products", options as any) as any
    }
  

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * The total count of all the reviews given to the product.
 */
      get review_count(): $Field<"review_count", number>  {
       return this.$_select("review_count") as any
      }

      
/**
 * The list of products reviews.
 */
      reviews<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<ProductReviews>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel, Args>>
reviews<Sel extends Selection<ProductReviews>>(selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel>>
reviews(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new ProductReviews)
      };
      return this.$_select("reviews", options as any) as any
    }
  

      
/**
 * A short description of the product. Its use depends on the theme.
 */
      short_description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"short_description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("short_description", options as any) as any
    }
  

      
/**
 * A number or code assigned to a product to identify the product, options, price, and manufacturer.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The relative path to the small image, which is used on catalog pages.
 */
      small_image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"small_image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("small_image", options as any) as any
    }
  

      
/**
 * The beginning date that a product has a special price.
 */
      get special_from_date(): $Field<"special_from_date", string | null>  {
       return this.$_select("special_from_date") as any
      }

      
/**
 * The discounted price of the product.
 */
      get special_price(): $Field<"special_price", number | null>  {
       return this.$_select("special_price") as any
      }

      
/**
 * The end date for a product with a special price.
 */
      get special_to_date(): $Field<"special_to_date", string | null>  {
       return this.$_select("special_to_date") as any
      }

      
/**
 * The status assigned to the product, 0 for disabled, 1 for enabled.
 */
      get status(): $Field<"status", number | null>  {
       return this.$_select("status") as any
      }

      
/**
 * Stock status of the product
 */
      get stock_status(): $Field<"stock_status", ProductStockStatus | null>  {
       return this.$_select("stock_status") as any
      }

      
/**
 * The file name of a swatch image.
 */
      get swatch_image(): $Field<"swatch_image", string | null>  {
       return this.$_select("swatch_image") as any
      }

      
/**
 * The relative path to the product's thumbnail image.
 */
      thumbnail<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"thumbnail", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("thumbnail", options as any) as any
    }
  

      
/**
 * The price when tier pricing is in effect and the items purchased threshold has been reached.
 */
      get tier_price(): $Field<"tier_price", number | null>  {
       return this.$_select("tier_price") as any
      }

      
/**
 * An array of ProductTierPrices objects.
 */
      tier_prices<Sel extends Selection<ProductTierPrices>>(selectorFn: (s: ProductTierPrices) => [...Sel]):$Field<"tier_prices", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductTierPrices)
      };
      return this.$_select("tier_prices", options as any) as any
    }
  

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }

      
/**
 * One of simple, virtual, bundle, downloadable, grouped, or configurable.
 */
      get type_id(): $Field<"type_id", string | null>  {
       return this.$_select("type_id") as any
      }

      
/**
 * The unique ID for a `ProductInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * Timestamp indicating when the product was updated.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }

      
/**
 * Upsell Products
 */
      upsell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"upsell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("upsell_products", options as any) as any
    }
  

      
/**
 * The part of the URL that identifies the product
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }

      
      get url_path(): $Field<"url_path", string | null>  {
       return this.$_select("url_path") as any
      }

      
/**
 * URL rewrites list
 */
      url_rewrites<Sel extends Selection<UrlRewrite>>(selectorFn: (s: UrlRewrite) => [...Sel]):$Field<"url_rewrites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new UrlRewrite)
      };
      return this.$_select("url_rewrites", options as any) as any
    }
  

      
/**
 * The part of the product URL that is appended after the url key
 */
      get url_suffix(): $Field<"url_suffix", string | null>  {
       return this.$_select("url_suffix") as any
      }

      
/**
 * The visibility assigned to the product.
 */
      get visibility(): $Field<"visibility", number | null>  {
       return this.$_select("visibility") as any
      }

      
/**
 * An array of websites in which the product is available.
 */
      websites<Sel extends Selection<Website>>(selectorFn: (s: Website) => [...Sel]):$Field<"websites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Website)
      };
      return this.$_select("websites", options as any) as any
    }
  
}


/**
 * Defines a simple product, which is tangible and is usually sold in single units or in fixed quantities.
 */
export class SimpleProduct extends $Base<"SimpleProduct"> {
  constructor() {
    super("SimpleProduct")
  }

  
      
/**
 * The attribute set assigned to the product.
 */
      get attribute_set_id(): $Field<"attribute_set_id", number | null>  {
       return this.$_select("attribute_set_id") as any
      }

      
      get brand(): $Field<"brand", number | null>  {
       return this.$_select("brand") as any
      }

      
/**
 * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
 */
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
/**
 * The categories assigned to a product.
 */
      categories<Sel extends Selection<CategoryInterface>>(selectorFn: (s: CategoryInterface) => [...Sel]):$Field<"categories", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CategoryInterface)
      };
      return this.$_select("categories", options as any) as any
    }
  

      
      get color(): $Field<"color", number | null>  {
       return this.$_select("color") as any
      }

      
/**
 * The product's country of origin.
 */
      get country_of_manufacture(): $Field<"country_of_manufacture", string | null>  {
       return this.$_select("country_of_manufacture") as any
      }

      
/**
 * Timestamp indicating when the product was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
/**
 * Crosssell Products
 */
      crosssell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"crosssell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("crosssell_products", options as any) as any
    }
  

      
/**
 * Product custom attributes.
 */
      custom_attributesV2<Args extends VariabledInput<{
        filters?: AttributeFilterInput | null,
      }>,Sel extends Selection<ProductCustomAttributes>>(args: ExactArgNames<Args, {
        filters?: AttributeFilterInput | null,
      }>, selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
custom_attributesV2<Sel extends Selection<ProductCustomAttributes>>(selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel>>
custom_attributesV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filters: "AttributeFilterInput"
            },
        args,

        selection: selectorFn(new ProductCustomAttributes)
      };
      return this.$_select("custom_attributesV2", options as any) as any
    }
  

      
/**
 * Detailed information about the product. The value can include simple HTML tags.
 */
      description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("description", options as any) as any
    }
  

      
/**
 * Returns a value indicating gift message availability for the product.
 */
      get gift_message_available(): $Field<"gift_message_available", boolean>  {
       return this.$_select("gift_message_available") as any
      }

      
/**
 * The ID number assigned to the product.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The relative path to the main image on the product page.
 */
      image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("image", options as any) as any
    }
  

      
/**
 * A number representing the product's manufacturer.
 */
      get manufacturer(): $Field<"manufacturer", number | null>  {
       return this.$_select("manufacturer") as any
      }

      
/**
 * Maximum Qty Allowed in Shopping Cart
 */
      get max_sale_qty(): $Field<"max_sale_qty", number | null>  {
       return this.$_select("max_sale_qty") as any
      }

      
/**
 * An array of media gallery objects.
 */
      media_gallery<Sel extends Selection<MediaGalleryInterface>>(selectorFn: (s: MediaGalleryInterface) => [...Sel]):$Field<"media_gallery", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryInterface)
      };
      return this.$_select("media_gallery", options as any) as any
    }
  

      
/**
 * An array of MediaGalleryEntry objects.
 */
      media_gallery_entries<Sel extends Selection<MediaGalleryEntry>>(selectorFn: (s: MediaGalleryEntry) => [...Sel]):$Field<"media_gallery_entries", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryEntry)
      };
      return this.$_select("media_gallery_entries", options as any) as any
    }
  

      
/**
 * A brief overview of the product for search results listings, maximum 255 characters.
 */
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
/**
 * A comma-separated list of keywords that are visible only to search engines.
 */
      get meta_keyword(): $Field<"meta_keyword", string | null>  {
       return this.$_select("meta_keyword") as any
      }

      
/**
 * A string that is displayed in the title bar and tab of the browser and in search results lists.
 */
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * Minimum Qty Allowed in Shopping Cart
 */
      get min_sale_qty(): $Field<"min_sale_qty", number | null>  {
       return this.$_select("min_sale_qty") as any
      }

      
/**
 * The product name. Customers use this name to identify the product.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The beginning date for new product listings, and determines if the product is featured as a new product.
 */
      get new_from_date(): $Field<"new_from_date", string | null>  {
       return this.$_select("new_from_date") as any
      }

      
/**
 * The end date for new product listings.
 */
      get new_to_date(): $Field<"new_to_date", string | null>  {
       return this.$_select("new_to_date") as any
      }

      
/**
 * Product stock only x left count
 */
      get only_x_left_in_stock(): $Field<"only_x_left_in_stock", number | null>  {
       return this.$_select("only_x_left_in_stock") as any
      }

      
/**
 * An array of options for a customizable product.
 */
      options<Sel extends Selection<CustomizableOptionInterface>>(selectorFn: (s: CustomizableOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  

      
/**
 * If the product has multiple options, determines where they appear on the product page.
 */
      get options_container(): $Field<"options_container", string | null>  {
       return this.$_select("options_container") as any
      }

      
/**
 * Indicates the price of an item.
 */
      price<Sel extends Selection<ProductPrices>>(selectorFn: (s: ProductPrices) => [...Sel]):$Field<"price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductPrices)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The range of prices for the product
 */
      price_range<Sel extends Selection<PriceRange>>(selectorFn: (s: PriceRange) => [...Sel]):$Field<"price_range", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceRange)
      };
      return this.$_select("price_range", options as any) as any
    }
  

      
/**
 * An array of `TierPrice` objects.
 */
      price_tiers<Sel extends Selection<TierPrice>>(selectorFn: (s: TierPrice) => [...Sel]):$Field<"price_tiers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TierPrice)
      };
      return this.$_select("price_tiers", options as any) as any
    }
  

      
/**
 * An array of `ProductLinks` objects.
 */
      product_links<Sel extends Selection<ProductLinksInterface>>(selectorFn: (s: ProductLinksInterface) => [...Sel]):$Field<"product_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductLinksInterface)
      };
      return this.$_select("product_links", options as any) as any
    }
  

      
/**
 * Amount of available stock
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The average of all the ratings given to the product.
 */
      get rating_summary(): $Field<"rating_summary", number>  {
       return this.$_select("rating_summary") as any
      }

      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * An array of products to be displayed in a Related Products block.
 */
      related_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"related_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("related_products", options as any) as any
    }
  

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * The total count of all the reviews given to the product.
 */
      get review_count(): $Field<"review_count", number>  {
       return this.$_select("review_count") as any
      }

      
/**
 * The list of products reviews.
 */
      reviews<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<ProductReviews>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel, Args>>
reviews<Sel extends Selection<ProductReviews>>(selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel>>
reviews(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new ProductReviews)
      };
      return this.$_select("reviews", options as any) as any
    }
  

      
/**
 * A short description of the product. Its use depends on the theme.
 */
      short_description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"short_description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("short_description", options as any) as any
    }
  

      
/**
 * A number or code assigned to a product to identify the product, options, price, and manufacturer.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The relative path to the small image, which is used on catalog pages.
 */
      small_image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"small_image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("small_image", options as any) as any
    }
  

      
/**
 * The beginning date that a product has a special price.
 */
      get special_from_date(): $Field<"special_from_date", string | null>  {
       return this.$_select("special_from_date") as any
      }

      
/**
 * The discounted price of the product.
 */
      get special_price(): $Field<"special_price", number | null>  {
       return this.$_select("special_price") as any
      }

      
/**
 * The end date for a product with a special price.
 */
      get special_to_date(): $Field<"special_to_date", string | null>  {
       return this.$_select("special_to_date") as any
      }

      
/**
 * The status assigned to the product, 0 for disabled, 1 for enabled.
 */
      get status(): $Field<"status", number | null>  {
       return this.$_select("status") as any
      }

      
/**
 * Stock status of the product
 */
      get stock_status(): $Field<"stock_status", ProductStockStatus | null>  {
       return this.$_select("stock_status") as any
      }

      
/**
 * The file name of a swatch image.
 */
      get swatch_image(): $Field<"swatch_image", string | null>  {
       return this.$_select("swatch_image") as any
      }

      
/**
 * The relative path to the product's thumbnail image.
 */
      thumbnail<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"thumbnail", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("thumbnail", options as any) as any
    }
  

      
/**
 * The price when tier pricing is in effect and the items purchased threshold has been reached.
 */
      get tier_price(): $Field<"tier_price", number | null>  {
       return this.$_select("tier_price") as any
      }

      
/**
 * An array of ProductTierPrices objects.
 */
      tier_prices<Sel extends Selection<ProductTierPrices>>(selectorFn: (s: ProductTierPrices) => [...Sel]):$Field<"tier_prices", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductTierPrices)
      };
      return this.$_select("tier_prices", options as any) as any
    }
  

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }

      
/**
 * One of simple, virtual, bundle, downloadable, grouped, or configurable.
 */
      get type_id(): $Field<"type_id", string | null>  {
       return this.$_select("type_id") as any
      }

      
/**
 * The unique ID for a `ProductInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * Timestamp indicating when the product was updated.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }

      
/**
 * Upsell Products
 */
      upsell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"upsell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("upsell_products", options as any) as any
    }
  

      
/**
 * The part of the URL that identifies the product
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }

      
      get url_path(): $Field<"url_path", string | null>  {
       return this.$_select("url_path") as any
      }

      
/**
 * URL rewrites list
 */
      url_rewrites<Sel extends Selection<UrlRewrite>>(selectorFn: (s: UrlRewrite) => [...Sel]):$Field<"url_rewrites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new UrlRewrite)
      };
      return this.$_select("url_rewrites", options as any) as any
    }
  

      
/**
 * The part of the product URL that is appended after the url key
 */
      get url_suffix(): $Field<"url_suffix", string | null>  {
       return this.$_select("url_suffix") as any
      }

      
/**
 * The visibility assigned to the product.
 */
      get visibility(): $Field<"visibility", number | null>  {
       return this.$_select("visibility") as any
      }

      
/**
 * An array of websites in which the product is available.
 */
      websites<Sel extends Selection<Website>>(selectorFn: (s: Website) => [...Sel]):$Field<"websites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Website)
      };
      return this.$_select("websites", options as any) as any
    }
  

      
/**
 * The weight of the item, in units defined by the store.
 */
      get weight(): $Field<"weight", number | null>  {
       return this.$_select("weight") as any
      }
}


/**
 * Contains the results of a `products` query.
 */
export class Products extends $Base<"Products"> {
  constructor() {
    super("Products")
  }

  
      
/**
 * A bucket that contains the attribute code and label for each filterable option.
 */
      aggregations<Args extends VariabledInput<{
        filter?: AggregationsFilterInput | null,
      }>,Sel extends Selection<Aggregation>>(args: ExactArgNames<Args, {
        filter?: AggregationsFilterInput | null,
      }>, selectorFn: (s: Aggregation) => [...Sel]):$Field<"aggregations", Array<GetOutput<Sel> | null> | null , GetVariables<Sel, Args>>
aggregations<Sel extends Selection<Aggregation>>(selectorFn: (s: Aggregation) => [...Sel]):$Field<"aggregations", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>>
aggregations(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filter: "AggregationsFilterInput"
            },
        args,

        selection: selectorFn(new Aggregation)
      };
      return this.$_select("aggregations", options as any) as any
    }
  

      
/**
 * Layered navigation filters array.
 */
      filters<Sel extends Selection<LayerFilter>>(selectorFn: (s: LayerFilter) => [...Sel]):$Field<"filters", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new LayerFilter)
      };
      return this.$_select("filters", options as any) as any
    }
  

      
/**
 * An array of products that match the specified search criteria.
 */
      items<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * An object that includes the page_info and currentPage values specified in the query.
 */
      page_info<Sel extends Selection<SearchResultPageInfo>>(selectorFn: (s: SearchResultPageInfo) => [...Sel]):$Field<"page_info", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchResultPageInfo)
      };
      return this.$_select("page_info", options as any) as any
    }
  

      
/**
 * An object that includes the default sort field and all available sort fields.
 */
      sort_fields<Sel extends Selection<SortFields>>(selectorFn: (s: SortFields) => [...Sel]):$Field<"sort_fields", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SortFields)
      };
      return this.$_select("sort_fields", options as any) as any
    }
  

      
/**
 * An array of search suggestions for case when search query have no results.
 */
      suggestions<Sel extends Selection<SearchSuggestion>>(selectorFn: (s: SearchSuggestion) => [...Sel]):$Field<"suggestions", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchSuggestion)
      };
      return this.$_select("suggestions", options as any) as any
    }
  

      
/**
 * The number of products that are marked as visible. By default, in complex products, parent products are visible, but their child products are not.
 */
      get total_count(): $Field<"total_count", number | null>  {
       return this.$_select("total_count") as any
      }
}


/**
 * An input object that specifies the filters used in product aggregations.
 */
export type AggregationsFilterInput = {
  category?: AggregationsCategoryFilterInput | null
}
    


/**
 * Filter category aggregations in layered navigation.
 */
export type AggregationsCategoryFilterInput = {
  includeDirectChildrenOnly?: boolean | null
}
    


/**
 * Contains details about the products assigned to a category.
 */
export class CategoryProducts extends $Base<"CategoryProducts"> {
  constructor() {
    super("CategoryProducts")
  }

  
      
/**
 * An array of products that are assigned to the category.
 */
      items<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * Pagination metadata.
 */
      page_info<Sel extends Selection<SearchResultPageInfo>>(selectorFn: (s: SearchResultPageInfo) => [...Sel]):$Field<"page_info", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchResultPageInfo)
      };
      return this.$_select("page_info", options as any) as any
    }
  

      
/**
 * The number of products in the category that are marked as visible. By default, in complex products, parent products are visible, but their child products are not.
 */
      get total_count(): $Field<"total_count", number | null>  {
       return this.$_select("total_count") as any
      }
}


/**
 * Defines the filters to be used in the search. A filter contains at least one attribute, a comparison operator, and the value that is being searched for.
 */
export type ProductAttributeFilterInput = {
  category_id?: FilterEqualTypeInput | null,
category_uid?: FilterEqualTypeInput | null,
category_url_path?: FilterEqualTypeInput | null,
description?: FilterMatchTypeInput | null,
name?: FilterMatchTypeInput | null,
price?: FilterRangeTypeInput | null,
short_description?: FilterMatchTypeInput | null,
sku?: FilterEqualTypeInput | null,
url_key?: FilterEqualTypeInput | null
}
    


/**
 * Defines the filters to be used in the search. A filter contains at least one attribute, a comparison operator, and the value that is being searched for.
 */
export type CategoryFilterInput = {
  category_uid?: FilterEqualTypeInput | null,
ids?: FilterEqualTypeInput | null,
name?: FilterMatchTypeInput | null,
parent_category_uid?: FilterEqualTypeInput | null,
parent_id?: FilterEqualTypeInput | null,
url_key?: FilterEqualTypeInput | null,
url_path?: FilterEqualTypeInput | null
}
    


/**
 * ProductFilterInput is deprecated, use @ProductAttributeFilterInput instead. ProductFilterInput defines the filters to be used in the search. A filter contains at least one attribute, a comparison operator, and the value that is being searched for.
 */
export type ProductFilterInput = {
  category_id?: FilterTypeInput | null,
country_of_manufacture?: FilterTypeInput | null,
created_at?: FilterTypeInput | null,
custom_layout?: FilterTypeInput | null,
custom_layout_update?: FilterTypeInput | null,
description?: FilterTypeInput | null,
gift_message_available?: FilterTypeInput | null,
has_options?: FilterTypeInput | null,
image?: FilterTypeInput | null,
image_label?: FilterTypeInput | null,
manufacturer?: FilterTypeInput | null,
max_price?: FilterTypeInput | null,
meta_description?: FilterTypeInput | null,
meta_keyword?: FilterTypeInput | null,
meta_title?: FilterTypeInput | null,
min_price?: FilterTypeInput | null,
name?: FilterTypeInput | null,
news_from_date?: FilterTypeInput | null,
news_to_date?: FilterTypeInput | null,
options_container?: FilterTypeInput | null,
or?: ProductFilterInput | null,
price?: FilterTypeInput | null,
required_options?: FilterTypeInput | null,
short_description?: FilterTypeInput | null,
sku?: FilterTypeInput | null,
small_image?: FilterTypeInput | null,
small_image_label?: FilterTypeInput | null,
special_from_date?: FilterTypeInput | null,
special_price?: FilterTypeInput | null,
special_to_date?: FilterTypeInput | null,
swatch_image?: FilterTypeInput | null,
thumbnail?: FilterTypeInput | null,
thumbnail_label?: FilterTypeInput | null,
tier_price?: FilterTypeInput | null,
updated_at?: FilterTypeInput | null,
url_key?: FilterTypeInput | null,
url_path?: FilterTypeInput | null,
weight?: FilterTypeInput | null
}
    


/**
 * Contains an image in base64 format and basic information about the image.
 */
export class ProductMediaGalleryEntriesContent extends $Base<"ProductMediaGalleryEntriesContent"> {
  constructor() {
    super("ProductMediaGalleryEntriesContent")
  }

  
      
/**
 * The image in base64 format.
 */
      get base64_encoded_data(): $Field<"base64_encoded_data", string | null>  {
       return this.$_select("base64_encoded_data") as any
      }

      
/**
 * The file name of the image.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The MIME type of the file, such as image/png.
 */
      get type(): $Field<"type", string | null>  {
       return this.$_select("type") as any
      }
}


/**
 * Contains a link to a video file and basic information about the video.
 */
export class ProductMediaGalleryEntriesVideoContent extends $Base<"ProductMediaGalleryEntriesVideoContent"> {
  constructor() {
    super("ProductMediaGalleryEntriesVideoContent")
  }

  
      
/**
 * Must be external-video.
 */
      get media_type(): $Field<"media_type", string | null>  {
       return this.$_select("media_type") as any
      }

      
/**
 * A description of the video.
 */
      get video_description(): $Field<"video_description", string | null>  {
       return this.$_select("video_description") as any
      }

      
/**
 * Optional data about the video.
 */
      get video_metadata(): $Field<"video_metadata", string | null>  {
       return this.$_select("video_metadata") as any
      }

      
/**
 * Describes the video source.
 */
      get video_provider(): $Field<"video_provider", string | null>  {
       return this.$_select("video_provider") as any
      }

      
/**
 * The title of the video.
 */
      get video_title(): $Field<"video_title", string | null>  {
       return this.$_select("video_title") as any
      }

      
/**
 * The URL to the video.
 */
      get video_url(): $Field<"video_url", string | null>  {
       return this.$_select("video_url") as any
      }
}


/**
 * Deprecated. Use `ProductAttributeSortInput` instead. Specifies the attribute to use for sorting search results and indicates whether the results are sorted in ascending or descending order.
 */
export type ProductSortInput = {
  country_of_manufacture?: SortEnum | null,
created_at?: SortEnum | null,
custom_layout?: SortEnum | null,
custom_layout_update?: SortEnum | null,
description?: SortEnum | null,
gift_message_available?: SortEnum | null,
has_options?: SortEnum | null,
image?: SortEnum | null,
image_label?: SortEnum | null,
manufacturer?: SortEnum | null,
meta_description?: SortEnum | null,
meta_keyword?: SortEnum | null,
meta_title?: SortEnum | null,
name?: SortEnum | null,
news_from_date?: SortEnum | null,
news_to_date?: SortEnum | null,
options_container?: SortEnum | null,
price?: SortEnum | null,
required_options?: SortEnum | null,
short_description?: SortEnum | null,
sku?: SortEnum | null,
small_image?: SortEnum | null,
small_image_label?: SortEnum | null,
special_from_date?: SortEnum | null,
special_price?: SortEnum | null,
special_to_date?: SortEnum | null,
swatch_image?: SortEnum | null,
thumbnail?: SortEnum | null,
thumbnail_label?: SortEnum | null,
tier_price?: SortEnum | null,
updated_at?: SortEnum | null,
url_key?: SortEnum | null,
url_path?: SortEnum | null,
weight?: SortEnum | null
}
    


/**
 * Specifies the attribute to use for sorting search results and indicates whether the results are sorted in ascending or descending order. It's possible to sort products using searchable attributes with enabled 'Use in Filter Options' option
 */
export type ProductAttributeSortInput = {
  name?: SortEnum | null,
position?: SortEnum | null,
price?: SortEnum | null,
relevance?: SortEnum | null
}
    


/**
 * Defines characteristics about images and videos associated with a specific product.
 */
export class MediaGalleryEntry extends $Base<"MediaGalleryEntry"> {
  constructor() {
    super("MediaGalleryEntry")
  }

  
      
/**
 * Details about the content of the media gallery item.
 */
      content<Sel extends Selection<ProductMediaGalleryEntriesContent>>(selectorFn: (s: ProductMediaGalleryEntriesContent) => [...Sel]):$Field<"content", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductMediaGalleryEntriesContent)
      };
      return this.$_select("content", options as any) as any
    }
  

      
/**
 * Indicates whether the image is hidden from view.
 */
      get disabled(): $Field<"disabled", boolean | null>  {
       return this.$_select("disabled") as any
      }

      
/**
 * The path of the image on the server.
 */
      get file(): $Field<"file", string | null>  {
       return this.$_select("file") as any
      }

      
/**
 * The identifier assigned to the object.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The alt text displayed on the storefront when the user points to the image.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * Either `image` or `video`.
 */
      get media_type(): $Field<"media_type", string | null>  {
       return this.$_select("media_type") as any
      }

      
/**
 * The media item's position after it has been sorted.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * Array of image types. It can have the following values: image, small_image, thumbnail.
 */
      get types(): $Field<"types", Readonly<Array<string | null>> | null>  {
       return this.$_select("types") as any
      }

      
/**
 * The unique ID for a `MediaGalleryEntry` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * Details about the content of a video item.
 */
      video_content<Sel extends Selection<ProductMediaGalleryEntriesVideoContent>>(selectorFn: (s: ProductMediaGalleryEntriesVideoContent) => [...Sel]):$Field<"video_content", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductMediaGalleryEntriesVideoContent)
      };
      return this.$_select("video_content", options as any) as any
    }
  
}


/**
 * Contains information for rendering layered navigation.
 */
export class LayerFilter extends $Base<"LayerFilter"> {
  constructor() {
    super("LayerFilter")
  }

  
      
/**
 * An array of filter items.
 */
      filter_items<Sel extends Selection<LayerFilterItemInterface>>(selectorFn: (s: LayerFilterItemInterface) => [...Sel]):$Field<"filter_items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new LayerFilterItemInterface)
      };
      return this.$_select("filter_items", options as any) as any
    }
  

      
/**
 * The count of filter items in filter group.
 */
      get filter_items_count(): $Field<"filter_items_count", number | null>  {
       return this.$_select("filter_items_count") as any
      }

      
/**
 * The name of a layered navigation filter.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The request variable name for a filter query.
 */
      get request_var(): $Field<"request_var", string | null>  {
       return this.$_select("request_var") as any
      }
}


export class LayerFilterItemInterface extends $Interface<{LayerFilterItem: LayerFilterItem,SwatchLayerFilterItem: SwatchLayerFilterItem}, "LayerFilterItemInterface"> {
  constructor() {
    super({LayerFilterItem: LayerFilterItem,SwatchLayerFilterItem: SwatchLayerFilterItem}, "LayerFilterItemInterface")
  }
  
      
/**
 * The count of items per filter.
 */
      get items_count(): $Field<"items_count", number | null>  {
       return this.$_select("items_count") as any
      }

      
/**
 * The label for a filter.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The value of a filter request variable to be used in query.
 */
      get value_string(): $Field<"value_string", string | null>  {
       return this.$_select("value_string") as any
      }
}


export class LayerFilterItem extends $Base<"LayerFilterItem"> {
  constructor() {
    super("LayerFilterItem")
  }

  
      
/**
 * The count of items per filter.
 */
      get items_count(): $Field<"items_count", number | null>  {
       return this.$_select("items_count") as any
      }

      
/**
 * The label for a filter.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The value of a filter request variable to be used in query.
 */
      get value_string(): $Field<"value_string", string | null>  {
       return this.$_select("value_string") as any
      }
}


/**
 * Contains information for each filterable option (such as price, category `UID`, and custom attributes).
 */
export class Aggregation extends $Base<"Aggregation"> {
  constructor() {
    super("Aggregation")
  }

  
      
/**
 * Attribute code of the aggregation group.
 */
      get attribute_code(): $Field<"attribute_code", string>  {
       return this.$_select("attribute_code") as any
      }

      
/**
 * The number of options in the aggregation group.
 */
      get count(): $Field<"count", number | null>  {
       return this.$_select("count") as any
      }

      
/**
 * The aggregation display name.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * Array of options for the aggregation.
 */
      options<Sel extends Selection<AggregationOption>>(selectorFn: (s: AggregationOption) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AggregationOption)
      };
      return this.$_select("options", options as any) as any
    }
  

      
/**
 * The relative position of the attribute in a layered navigation block.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }
}


/**
 * A string that contains search suggestion
 */
export class SearchSuggestion extends $Base<"SearchSuggestion"> {
  constructor() {
    super("SearchSuggestion")
  }

  
      
/**
 * The search suggestion of existing product.
 */
      get search(): $Field<"search", string>  {
       return this.$_select("search") as any
      }
}


/**
 * Defines aggregation option fields.
 */
export class AggregationOptionInterface extends $Interface<{AggregationOption: AggregationOption}, "AggregationOptionInterface"> {
  constructor() {
    super({AggregationOption: AggregationOption}, "AggregationOptionInterface")
  }
  
      
/**
 * The number of items that match the aggregation option.
 */
      get count(): $Field<"count", number | null>  {
       return this.$_select("count") as any
      }

      
/**
 * The display label for an aggregation option.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The internal ID that represents the value of the option.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


/**
 * An implementation of `AggregationOptionInterface`.
 */
export class AggregationOption extends $Base<"AggregationOption"> {
  constructor() {
    super("AggregationOption")
  }

  
      
/**
 * The number of items that match the aggregation option.
 */
      get count(): $Field<"count", number | null>  {
       return this.$_select("count") as any
      }

      
/**
 * The display label for an aggregation option.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The internal ID that represents the value of the option.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


/**
 * Defines a possible sort field.
 */
export class SortField extends $Base<"SortField"> {
  constructor() {
    super("SortField")
  }

  
      
/**
 * The label of the sort field.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The attribute code of the sort field.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}


/**
 * Contains a default value for sort fields and all available sort fields.
 */
export class SortFields extends $Base<"SortFields"> {
  constructor() {
    super("SortFields")
  }

  
      
/**
 * The default sort field value.
 */
      get default(): $Field<"default", string | null>  {
       return this.$_select("default") as any
      }

      
/**
 * An array of possible sort fields.
 */
      options<Sel extends Selection<SortField>>(selectorFn: (s: SortField) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SortField)
      };
      return this.$_select("options", options as any) as any
    }
  
}


/**
 * Contains a simple product wish list item.
 */
export class SimpleWishlistItem extends $Base<"SimpleWishlistItem"> {
  constructor() {
    super("SimpleWishlistItem")
  }

  
      
/**
 * The date and time the item was added to the wish list.
 */
      get added_at(): $Field<"added_at", string>  {
       return this.$_select("added_at") as any
      }

      
/**
 * Custom options selected for the wish list item.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * The description of the item.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
/**
 * The unique ID for a `WishlistItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Product details of the wish list item.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The quantity of this wish list item.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }
}


/**
 * Contains a virtual product wish list item.
 */
export class VirtualWishlistItem extends $Base<"VirtualWishlistItem"> {
  constructor() {
    super("VirtualWishlistItem")
  }

  
      
/**
 * The date and time the item was added to the wish list.
 */
      get added_at(): $Field<"added_at", string>  {
       return this.$_select("added_at") as any
      }

      
/**
 * Custom options selected for the wish list item.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * The description of the item.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
/**
 * The unique ID for a `WishlistItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Product details of the wish list item.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The quantity of this wish list item.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }
}


/**
 * Swatch attribute metadata.
 */
export class CatalogAttributeMetadata extends $Base<"CatalogAttributeMetadata"> {
  constructor() {
    super("CatalogAttributeMetadata")
  }

  
      
/**
 * To which catalog types an attribute can be applied.
 */
      get apply_to(): $Field<"apply_to", Readonly<Array<CatalogAttributeApplyToEnum | null>> | null>  {
       return this.$_select("apply_to") as any
      }

      
/**
 * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * Default attribute value.
 */
      get default_value(): $Field<"default_value", string | null>  {
       return this.$_select("default_value") as any
      }

      
/**
 * The type of entity that defines the attribute.
 */
      get entity_type(): $Field<"entity_type", AttributeEntityTypeEnum>  {
       return this.$_select("entity_type") as any
      }

      
/**
 * The frontend class of the attribute.
 */
      get frontend_class(): $Field<"frontend_class", string | null>  {
       return this.$_select("frontend_class") as any
      }

      
/**
 * The frontend input type of the attribute.
 */
      get frontend_input(): $Field<"frontend_input", AttributeFrontendInputEnum | null>  {
       return this.$_select("frontend_input") as any
      }

      
/**
 * Whether a product or category attribute can be compared against another or not.
 */
      get is_comparable(): $Field<"is_comparable", boolean | null>  {
       return this.$_select("is_comparable") as any
      }

      
/**
 * Whether a product or category attribute can be filtered or not.
 */
      get is_filterable(): $Field<"is_filterable", boolean | null>  {
       return this.$_select("is_filterable") as any
      }

      
/**
 * Whether a product or category attribute can be filtered in search or not.
 */
      get is_filterable_in_search(): $Field<"is_filterable_in_search", boolean | null>  {
       return this.$_select("is_filterable_in_search") as any
      }

      
/**
 * Whether a product or category attribute can use HTML on front or not.
 */
      get is_html_allowed_on_front(): $Field<"is_html_allowed_on_front", boolean | null>  {
       return this.$_select("is_html_allowed_on_front") as any
      }

      
/**
 * Whether the attribute value is required.
 */
      get is_required(): $Field<"is_required", boolean>  {
       return this.$_select("is_required") as any
      }

      
/**
 * Whether a product or category attribute can be searched or not.
 */
      get is_searchable(): $Field<"is_searchable", boolean | null>  {
       return this.$_select("is_searchable") as any
      }

      
/**
 * Whether the attribute value must be unique.
 */
      get is_unique(): $Field<"is_unique", boolean>  {
       return this.$_select("is_unique") as any
      }

      
/**
 * Whether a product or category attribute can be used for price rules or not.
 */
      get is_used_for_price_rules(): $Field<"is_used_for_price_rules", boolean | null>  {
       return this.$_select("is_used_for_price_rules") as any
      }

      
/**
 * Whether a product or category attribute is used for promo rules or not.
 */
      get is_used_for_promo_rules(): $Field<"is_used_for_promo_rules", boolean | null>  {
       return this.$_select("is_used_for_promo_rules") as any
      }

      
/**
 * Whether a product or category attribute is visible in advanced search or not.
 */
      get is_visible_in_advanced_search(): $Field<"is_visible_in_advanced_search", boolean | null>  {
       return this.$_select("is_visible_in_advanced_search") as any
      }

      
/**
 * Whether a product or category attribute is visible on front or not.
 */
      get is_visible_on_front(): $Field<"is_visible_on_front", boolean | null>  {
       return this.$_select("is_visible_on_front") as any
      }

      
/**
 * Whether a product or category attribute has WYSIWYG enabled or not.
 */
      get is_wysiwyg_enabled(): $Field<"is_wysiwyg_enabled", boolean | null>  {
       return this.$_select("is_wysiwyg_enabled") as any
      }

      
/**
 * The label assigned to the attribute.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * Attribute options.
 */
      options<Sel extends Selection<CustomAttributeOptionInterface>>(selectorFn: (s: CustomAttributeOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomAttributeOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  

      
/**
 * Input type of the swatch attribute option.
 */
      get swatch_input_type(): $Field<"swatch_input_type", SwatchInputTypeEnum | null>  {
       return this.$_select("swatch_input_type") as any
      }

      
/**
 * Whether update product preview image or not.
 */
      get update_product_preview_image(): $Field<"update_product_preview_image", boolean | null>  {
       return this.$_select("update_product_preview_image") as any
      }

      
/**
 * Whether use product image for swatch or not.
 */
      get use_product_image_for_swatch(): $Field<"use_product_image_for_swatch", boolean | null>  {
       return this.$_select("use_product_image_for_swatch") as any
      }

      
/**
 * Whether a product or category attribute is used in product listing or not.
 */
      get used_in_product_listing(): $Field<"used_in_product_listing", boolean | null>  {
       return this.$_select("used_in_product_listing") as any
      }
}

  
export enum CatalogAttributeApplyToEnum {
  
  SIMPLE = "SIMPLE",

  VIRTUAL = "VIRTUAL",

  BUNDLE = "BUNDLE",

  DOWNLOADABLE = "DOWNLOADABLE",

  CONFIGURABLE = "CONFIGURABLE",

  GROUPED = "GROUPED",

  CATEGORY = "CATEGORY"
}
  


/**
 * Product custom attributes
 */
export class ProductCustomAttributes extends $Base<"ProductCustomAttributes"> {
  constructor() {
    super("ProductCustomAttributes")
  }

  
      
/**
 * Errors when retrieving custom attributes metadata.
 */
      errors<Sel extends Selection<AttributeMetadataError>>(selectorFn: (s: AttributeMetadataError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AttributeMetadataError)
      };
      return this.$_select("errors", options as any) as any
    }
  

      
/**
 * Requested custom attributes
 */
      items<Sel extends Selection<AttributeValueInterface>>(selectorFn: (s: AttributeValueInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AttributeValueInterface)
      };
      return this.$_select("items", options as any) as any
    }
  
}


export type CreateGuestCartInput = {
  cart_uid?: string | null
}
    


/**
 * Assigns a specific `cart_id` to the empty cart.
 */
export type createEmptyCartInput = {
  cart_id?: string | null
}
    


/**
 * Defines the simple and group products to add to the cart.
 */
export type AddSimpleProductsToCartInput = {
  cart_id: string,
cart_items: Readonly<Array<SimpleProductCartItemInput | null>>
}
    


/**
 * Defines a single product to add to the cart.
 */
export type SimpleProductCartItemInput = {
  customizable_options?: Readonly<Array<CustomizableOptionInput | null>> | null,
data: CartItemInput
}
    


/**
 * Defines the virtual products to add to the cart.
 */
export type AddVirtualProductsToCartInput = {
  cart_id: string,
cart_items: Readonly<Array<VirtualProductCartItemInput | null>>
}
    


/**
 * Defines a single product to add to the cart.
 */
export type VirtualProductCartItemInput = {
  customizable_options?: Readonly<Array<CustomizableOptionInput | null>> | null,
data: CartItemInput
}
    


/**
 * Defines an item to be added to the cart.
 */
export type CartItemInput = {
  entered_options?: Readonly<Array<EnteredOptionInput | null>> | null,
parent_sku?: string | null,
quantity: number,
selected_options?: Readonly<Array<string | null>> | null,
sku: string
}
    

  
/**
 * Specifies the field to use for sorting quote items
 */
export enum SortQuoteItemsEnum {
  
  ITEM_ID = "ITEM_ID",

  CREATED_AT = "CREATED_AT",

  UPDATED_AT = "UPDATED_AT",

  PRODUCT_ID = "PRODUCT_ID",

  SKU = "SKU",

  NAME = "NAME",

  DESCRIPTION = "DESCRIPTION",

  WEIGHT = "WEIGHT",

  QTY = "QTY",

  PRICE = "PRICE",

  BASE_PRICE = "BASE_PRICE",

  CUSTOM_PRICE = "CUSTOM_PRICE",

  DISCOUNT_PERCENT = "DISCOUNT_PERCENT",

  DISCOUNT_AMOUNT = "DISCOUNT_AMOUNT",

  BASE_DISCOUNT_AMOUNT = "BASE_DISCOUNT_AMOUNT",

  TAX_PERCENT = "TAX_PERCENT",

  TAX_AMOUNT = "TAX_AMOUNT",

  BASE_TAX_AMOUNT = "BASE_TAX_AMOUNT",

  ROW_TOTAL = "ROW_TOTAL",

  BASE_ROW_TOTAL = "BASE_ROW_TOTAL",

  ROW_TOTAL_WITH_DISCOUNT = "ROW_TOTAL_WITH_DISCOUNT",

  ROW_WEIGHT = "ROW_WEIGHT",

  PRODUCT_TYPE = "PRODUCT_TYPE",

  BASE_TAX_BEFORE_DISCOUNT = "BASE_TAX_BEFORE_DISCOUNT",

  TAX_BEFORE_DISCOUNT = "TAX_BEFORE_DISCOUNT",

  ORIGINAL_CUSTOM_PRICE = "ORIGINAL_CUSTOM_PRICE",

  PRICE_INC_TAX = "PRICE_INC_TAX",

  BASE_PRICE_INC_TAX = "BASE_PRICE_INC_TAX",

  ROW_TOTAL_INC_TAX = "ROW_TOTAL_INC_TAX",

  BASE_ROW_TOTAL_INC_TAX = "BASE_ROW_TOTAL_INC_TAX",

  DISCOUNT_TAX_COMPENSATION_AMOUNT = "DISCOUNT_TAX_COMPENSATION_AMOUNT",

  BASE_DISCOUNT_TAX_COMPENSATION_AMOUNT = "BASE_DISCOUNT_TAX_COMPENSATION_AMOUNT",

  FREE_SHIPPING = "FREE_SHIPPING"
}
  


/**
 * Specifies the field to use for sorting quote items
 */
export type QuoteItemsSortInput = {
  field: SortQuoteItemsEnum,
order: SortEnum
}
    


/**
 * Defines a customizable option.
 */
export type CustomizableOptionInput = {
  id?: number | null,
uid?: string | null,
value_string: string
}
    


/**
 * Specifies the coupon code to apply to the cart.
 */
export type ApplyCouponToCartInput = {
  cart_id: string,
coupon_code: string
}
    


/**
 * Modifies the specified items in the cart.
 */
export type UpdateCartItemsInput = {
  cart_id: string,
cart_items: Readonly<Array<CartItemUpdateInput | null>>
}
    


/**
 * A single item to be updated.
 */
export type CartItemUpdateInput = {
  cart_item_id?: number | null,
cart_item_uid?: string | null,
customizable_options?: Readonly<Array<CustomizableOptionInput | null>> | null,
gift_message?: GiftMessageInput | null,
quantity?: number | null
}
    


/**
 * Specifies which items to remove from the cart.
 */
export type RemoveItemFromCartInput = {
  cart_id: string,
cart_item_id?: number | null,
cart_item_uid?: string | null
}
    


/**
 * Specifies an array of addresses to use for shipping.
 */
export type SetShippingAddressesOnCartInput = {
  cart_id: string,
shipping_addresses: Readonly<Array<ShippingAddressInput | null>>
}
    


/**
 * Defines a single shipping address.
 */
export type ShippingAddressInput = {
  address?: CartAddressInput | null,
customer_address_id?: number | null,
customer_notes?: string | null,
pickup_location_code?: string | null
}
    


/**
 * Sets the billing address.
 */
export type SetBillingAddressOnCartInput = {
  billing_address: BillingAddressInput,
cart_id: string
}
    


/**
 * Defines the billing address.
 */
export type BillingAddressInput = {
  address?: CartAddressInput | null,
customer_address_id?: number | null,
same_as_shipping?: boolean | null,
use_for_shipping?: boolean | null
}
    


/**
 * Defines the billing or shipping address to be applied to the cart.
 */
export type CartAddressInput = {
  city: string,
company?: string | null,
country_code: string,
fax?: string | null,
firstname: string,
lastname: string,
middlename?: string | null,
postcode?: string | null,
prefix?: string | null,
region?: string | null,
region_id?: number | null,
save_in_address_book?: boolean | null,
street: Readonly<Array<string | null>>,
suffix?: string | null,
telephone?: string | null,
vat_id?: string | null
}
    


/**
 * Applies one or shipping methods to the cart.
 */
export type SetShippingMethodsOnCartInput = {
  cart_id: string,
shipping_methods: Readonly<Array<ShippingMethodInput | null>>
}
    


/**
 * Defines the shipping carrier and method.
 */
export type ShippingMethodInput = {
  carrier_code: string,
method_code: string
}
    


/**
 * Applies a payment method to the quote.
 */
export type SetPaymentMethodAndPlaceOrderInput = {
  cart_id: string,
payment_method: PaymentMethodInput
}
    


/**
 * Specifies the quote to be converted to an order.
 */
export type PlaceOrderInput = {
  cart_id: string,
mollie_return_url?: string | null
}
    


/**
 * Applies a payment method to the cart.
 */
export type SetPaymentMethodOnCartInput = {
  cart_id: string,
payment_method: PaymentMethodInput
}
    


/**
 * Defines the payment method.
 */
export type PaymentMethodInput = {
  code: string,
hosted_pro?: HostedProInput | null,
mollie_applepay_payment_token?: string | null,
mollie_card_token?: string | null,
mollie_selected_issuer?: string | null,
mollie_selected_terminal?: string | null,
payflow_express?: PayflowExpressInput | null,
payflow_link?: PayflowLinkInput | null,
payflowpro?: PayflowProInput | null,
payflowpro_cc_vault?: VaultTokenInput | null,
paypal_express?: PaypalExpressInput | null,
purchase_order_number?: string | null
}
    


/**
 * Defines the guest email and cart.
 */
export type SetGuestEmailOnCartInput = {
  cart_id: string,
email: string
}
    


/**
 * Contains details about the final price of items in the cart, including discount and tax information.
 */
export class CartPrices extends $Base<"CartPrices"> {
  constructor() {
    super("CartPrices")
  }

  
      
/**
 * An array containing the names and amounts of taxes applied to each item in the cart.
 */
      applied_taxes<Sel extends Selection<CartTaxItem>>(selectorFn: (s: CartTaxItem) => [...Sel]):$Field<"applied_taxes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartTaxItem)
      };
      return this.$_select("applied_taxes", options as any) as any
    }
  

      
      discount<Sel extends Selection<CartDiscount>>(selectorFn: (s: CartDiscount) => [...Sel]):$Field<"discount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartDiscount)
      };
      return this.$_select("discount", options as any) as any
    }
  

      
/**
 * An array containing cart rule discounts, store credit and gift cards applied to the cart.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The total, including discounts, taxes, shipping, and other fees.
 */
      grand_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"grand_total", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("grand_total", options as any) as any
    }
  

      
/**
 * The total of the cart, including discounts, shipping, and other fees without tax.
 */
      grand_total_excluding_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"grand_total_excluding_tax", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("grand_total_excluding_tax", options as any) as any
    }
  

      
      mollie_payment_fee<Sel extends Selection<MolliePaymentFee>>(selectorFn: (s: MolliePaymentFee) => [...Sel]):$Field<"mollie_payment_fee", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MolliePaymentFee)
      };
      return this.$_select("mollie_payment_fee", options as any) as any
    }
  

      
/**
 * The subtotal without any applied taxes.
 */
      subtotal_excluding_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"subtotal_excluding_tax", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("subtotal_excluding_tax", options as any) as any
    }
  

      
/**
 * The subtotal including any applied taxes.
 */
      subtotal_including_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"subtotal_including_tax", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("subtotal_including_tax", options as any) as any
    }
  

      
/**
 * The subtotal with any discounts applied, but not taxes.
 */
      subtotal_with_discount_excluding_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"subtotal_with_discount_excluding_tax", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("subtotal_with_discount_excluding_tax", options as any) as any
    }
  
}


/**
 * Contains tax information about an item in the cart.
 */
export class CartTaxItem extends $Base<"CartTaxItem"> {
  constructor() {
    super("CartTaxItem")
  }

  
      
/**
 * The amount of tax applied to the item.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  

      
/**
 * The description of the tax.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }
}


/**
 * Contains information about discounts applied to the cart.
 */
export class CartDiscount extends $Base<"CartDiscount"> {
  constructor() {
    super("CartDiscount")
  }

  
      
/**
 * The amount of the discount applied to the item.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  

      
/**
 * The description of the discount.
 */
      get label(): $Field<"label", Readonly<Array<string | null>>>  {
       return this.$_select("label") as any
      }
}


export class CreateGuestCartOutput extends $Base<"CreateGuestCartOutput"> {
  constructor() {
    super("CreateGuestCartOutput")
  }

  
      
/**
 * The newly created cart.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about the cart after setting the payment method.
 */
export class SetPaymentMethodOnCartOutput extends $Base<"SetPaymentMethodOnCartOutput"> {
  constructor() {
    super("SetPaymentMethodOnCartOutput")
  }

  
      
/**
 * The cart after setting the payment method.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about the cart after setting the billing address.
 */
export class SetBillingAddressOnCartOutput extends $Base<"SetBillingAddressOnCartOutput"> {
  constructor() {
    super("SetBillingAddressOnCartOutput")
  }

  
      
/**
 * The cart after setting the billing address.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about the cart after setting the shipping addresses.
 */
export class SetShippingAddressesOnCartOutput extends $Base<"SetShippingAddressesOnCartOutput"> {
  constructor() {
    super("SetShippingAddressesOnCartOutput")
  }

  
      
/**
 * The cart after setting the shipping addresses.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about the cart after setting the shipping methods.
 */
export class SetShippingMethodsOnCartOutput extends $Base<"SetShippingMethodsOnCartOutput"> {
  constructor() {
    super("SetShippingMethodsOnCartOutput")
  }

  
      
/**
 * The cart after setting the shipping methods.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about the cart after applying a coupon.
 */
export class ApplyCouponToCartOutput extends $Base<"ApplyCouponToCartOutput"> {
  constructor() {
    super("ApplyCouponToCartOutput")
  }

  
      
/**
 * The cart after applying a coupon.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains the results of the request to place an order.
 */
export class PlaceOrderOutput extends $Base<"PlaceOrderOutput"> {
  constructor() {
    super("PlaceOrderOutput")
  }

  
      
/**
 * The ID of the order.
 */
      order<Sel extends Selection<Order>>(selectorFn: (s: Order) => [...Sel]):$Field<"order", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Order)
      };
      return this.$_select("order", options as any) as any
    }
  

      
/**
 * Full order information.
 */
      orderV2<Sel extends Selection<CustomerOrder>>(selectorFn: (s: CustomerOrder) => [...Sel]):$Field<"orderV2", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerOrder)
      };
      return this.$_select("orderV2", options as any) as any
    }
  
}


/**
 * Contains the contents and other details about a guest or customer cart.
 */
export class Cart extends $Base<"Cart"> {
  constructor() {
    super("Cart")
  }

  
      
      applied_coupon<Sel extends Selection<AppliedCoupon>>(selectorFn: (s: AppliedCoupon) => [...Sel]):$Field<"applied_coupon", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AppliedCoupon)
      };
      return this.$_select("applied_coupon", options as any) as any
    }
  

      
/**
 * An array of `AppliedCoupon` objects. Each object contains the `code` text attribute, which specifies the coupon code.
 */
      applied_coupons<Sel extends Selection<AppliedCoupon>>(selectorFn: (s: AppliedCoupon) => [...Sel]):$Field<"applied_coupons", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AppliedCoupon)
      };
      return this.$_select("applied_coupons", options as any) as any
    }
  

      
/**
 * An array of available payment methods.
 */
      available_payment_methods<Sel extends Selection<AvailablePaymentMethod>>(selectorFn: (s: AvailablePaymentMethod) => [...Sel]):$Field<"available_payment_methods", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AvailablePaymentMethod)
      };
      return this.$_select("available_payment_methods", options as any) as any
    }
  

      
/**
 * The billing address assigned to the cart.
 */
      billing_address<Sel extends Selection<BillingCartAddress>>(selectorFn: (s: BillingCartAddress) => [...Sel]):$Field<"billing_address", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new BillingCartAddress)
      };
      return this.$_select("billing_address", options as any) as any
    }
  

      
/**
 * The email address of the guest or customer.
 */
      get email(): $Field<"email", string | null>  {
       return this.$_select("email") as any
      }

      
/**
 * The entered gift message for the cart
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
/**
 * The unique ID for a `Cart` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Indicates whether the cart contains only virtual products.
 */
      get is_virtual(): $Field<"is_virtual", boolean>  {
       return this.$_select("is_virtual") as any
      }

      
/**
 * An array of products that have been added to the cart.
 */
      items<Sel extends Selection<CartItemInterface>>(selectorFn: (s: CartItemInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemInterface)
      };
      return this.$_select("items", options as any) as any
    }
  

      
      itemsV2<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null
sort?: QuoteItemsSortInput | null,
      }>,Sel extends Selection<CartItems>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null
sort?: QuoteItemsSortInput | null,
      }>, selectorFn: (s: CartItems) => [...Sel]):$Field<"itemsV2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
itemsV2<Sel extends Selection<CartItems>>(selectorFn: (s: CartItems) => [...Sel]):$Field<"itemsV2", GetOutput<Sel> | null , GetVariables<Sel>>
itemsV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int",
sort: "QuoteItemsSortInput"
            },
        args,

        selection: selectorFn(new CartItems)
      };
      return this.$_select("itemsV2", options as any) as any
    }
  

      
/**
 * Available issuers for the selected payment method
 */
      mollie_available_issuers<Sel extends Selection<MollieIssuer>>(selectorFn: (s: MollieIssuer) => [...Sel]):$Field<"mollie_available_issuers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MollieIssuer)
      };
      return this.$_select("mollie_available_issuers", options as any) as any
    }
  

      
/**
 * Pricing details for the quote.
 */
      prices<Sel extends Selection<CartPrices>>(selectorFn: (s: CartPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * Indicates which payment method was applied to the cart.
 */
      selected_payment_method<Sel extends Selection<SelectedPaymentMethod>>(selectorFn: (s: SelectedPaymentMethod) => [...Sel]):$Field<"selected_payment_method", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedPaymentMethod)
      };
      return this.$_select("selected_payment_method", options as any) as any
    }
  

      
/**
 * An array of shipping addresses assigned to the cart.
 */
      shipping_addresses<Sel extends Selection<ShippingCartAddress>>(selectorFn: (s: ShippingCartAddress) => [...Sel]):$Field<"shipping_addresses", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ShippingCartAddress)
      };
      return this.$_select("shipping_addresses", options as any) as any
    }
  

      
/**
 * The total number of items in the cart.
 */
      get total_quantity(): $Field<"total_quantity", number>  {
       return this.$_select("total_quantity") as any
      }
}


export class CartItems extends $Base<"CartItems"> {
  constructor() {
    super("CartItems")
  }

  
      
/**
 * An array of products that have been added to the cart.
 */
      items<Sel extends Selection<CartItemInterface>>(selectorFn: (s: CartItemInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemInterface)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * Metadata for pagination rendering.
 */
      page_info<Sel extends Selection<SearchResultPageInfo>>(selectorFn: (s: SearchResultPageInfo) => [...Sel]):$Field<"page_info", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchResultPageInfo)
      };
      return this.$_select("page_info", options as any) as any
    }
  

      
/**
 * The number of returned cart items.
 */
      get total_count(): $Field<"total_count", number>  {
       return this.$_select("total_count") as any
      }
}


export class CartAddressInterface extends $Interface<{ShippingCartAddress: ShippingCartAddress,BillingCartAddress: BillingCartAddress}, "CartAddressInterface"> {
  constructor() {
    super({ShippingCartAddress: ShippingCartAddress,BillingCartAddress: BillingCartAddress}, "CartAddressInterface")
  }
  
      
/**
 * The city specified for the billing or shipping address.
 */
      get city(): $Field<"city", string>  {
       return this.$_select("city") as any
      }

      
/**
 * The company specified for the billing or shipping address.
 */
      get company(): $Field<"company", string | null>  {
       return this.$_select("company") as any
      }

      
/**
 * An object containing the country label and code.
 */
      country<Sel extends Selection<CartAddressCountry>>(selectorFn: (s: CartAddressCountry) => [...Sel]):$Field<"country", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartAddressCountry)
      };
      return this.$_select("country", options as any) as any
    }
  

      
/**
 * The customer's fax number.
 */
      get fax(): $Field<"fax", string | null>  {
       return this.$_select("fax") as any
      }

      
/**
 * The first name of the customer or guest.
 */
      get firstname(): $Field<"firstname", string>  {
       return this.$_select("firstname") as any
      }

      
/**
 * Id of the customer address.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The last name of the customer or guest.
 */
      get lastname(): $Field<"lastname", string>  {
       return this.$_select("lastname") as any
      }

      
/**
 * The middle name of the person associated with the billing/shipping address.
 */
      get middlename(): $Field<"middlename", string | null>  {
       return this.$_select("middlename") as any
      }

      
/**
 * The ZIP or postal code of the billing or shipping address.
 */
      get postcode(): $Field<"postcode", string | null>  {
       return this.$_select("postcode") as any
      }

      
/**
 * An honorific, such as Dr., Mr., or Mrs.
 */
      get prefix(): $Field<"prefix", string | null>  {
       return this.$_select("prefix") as any
      }

      
/**
 * An object containing the region label and code.
 */
      region<Sel extends Selection<CartAddressRegion>>(selectorFn: (s: CartAddressRegion) => [...Sel]):$Field<"region", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartAddressRegion)
      };
      return this.$_select("region", options as any) as any
    }
  

      
/**
 * An array containing the street for the billing or shipping address.
 */
      get street(): $Field<"street", Readonly<Array<string | null>>>  {
       return this.$_select("street") as any
      }

      
/**
 * A value such as Sr., Jr., or III.
 */
      get suffix(): $Field<"suffix", string | null>  {
       return this.$_select("suffix") as any
      }

      
/**
 * The telephone number for the billing or shipping address.
 */
      get telephone(): $Field<"telephone", string | null>  {
       return this.$_select("telephone") as any
      }

      
/**
 * The unique id of the customer address.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * The VAT company number for billing or shipping address.
 */
      get vat_id(): $Field<"vat_id", string | null>  {
       return this.$_select("vat_id") as any
      }
}


/**
 * Contains shipping addresses and methods.
 */
export class ShippingCartAddress extends $Base<"ShippingCartAddress"> {
  constructor() {
    super("ShippingCartAddress")
  }

  
      
/**
 * An array that lists the shipping methods that can be applied to the cart.
 */
      available_shipping_methods<Sel extends Selection<AvailableShippingMethod>>(selectorFn: (s: AvailableShippingMethod) => [...Sel]):$Field<"available_shipping_methods", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AvailableShippingMethod)
      };
      return this.$_select("available_shipping_methods", options as any) as any
    }
  

      
      cart_items<Sel extends Selection<CartItemQuantity>>(selectorFn: (s: CartItemQuantity) => [...Sel]):$Field<"cart_items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemQuantity)
      };
      return this.$_select("cart_items", options as any) as any
    }
  

      
/**
 * An array that lists the items in the cart.
 */
      cart_items_v2<Sel extends Selection<CartItemInterface>>(selectorFn: (s: CartItemInterface) => [...Sel]):$Field<"cart_items_v2", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemInterface)
      };
      return this.$_select("cart_items_v2", options as any) as any
    }
  

      
/**
 * The city specified for the billing or shipping address.
 */
      get city(): $Field<"city", string>  {
       return this.$_select("city") as any
      }

      
/**
 * The company specified for the billing or shipping address.
 */
      get company(): $Field<"company", string | null>  {
       return this.$_select("company") as any
      }

      
/**
 * An object containing the country label and code.
 */
      country<Sel extends Selection<CartAddressCountry>>(selectorFn: (s: CartAddressCountry) => [...Sel]):$Field<"country", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartAddressCountry)
      };
      return this.$_select("country", options as any) as any
    }
  

      
/**
 * Text provided by the shopper.
 */
      get customer_notes(): $Field<"customer_notes", string | null>  {
       return this.$_select("customer_notes") as any
      }

      
/**
 * The customer's fax number.
 */
      get fax(): $Field<"fax", string | null>  {
       return this.$_select("fax") as any
      }

      
/**
 * The first name of the customer or guest.
 */
      get firstname(): $Field<"firstname", string>  {
       return this.$_select("firstname") as any
      }

      
/**
 * Id of the customer address.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
      get items_weight(): $Field<"items_weight", number | null>  {
       return this.$_select("items_weight") as any
      }

      
/**
 * The last name of the customer or guest.
 */
      get lastname(): $Field<"lastname", string>  {
       return this.$_select("lastname") as any
      }

      
/**
 * The middle name of the person associated with the billing/shipping address.
 */
      get middlename(): $Field<"middlename", string | null>  {
       return this.$_select("middlename") as any
      }

      
      get pickup_location_code(): $Field<"pickup_location_code", string | null>  {
       return this.$_select("pickup_location_code") as any
      }

      
/**
 * The ZIP or postal code of the billing or shipping address.
 */
      get postcode(): $Field<"postcode", string | null>  {
       return this.$_select("postcode") as any
      }

      
/**
 * An honorific, such as Dr., Mr., or Mrs.
 */
      get prefix(): $Field<"prefix", string | null>  {
       return this.$_select("prefix") as any
      }

      
/**
 * An object containing the region label and code.
 */
      region<Sel extends Selection<CartAddressRegion>>(selectorFn: (s: CartAddressRegion) => [...Sel]):$Field<"region", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartAddressRegion)
      };
      return this.$_select("region", options as any) as any
    }
  

      
/**
 * Indicates whether the shipping address is same as billing address.
 */
      get same_as_billing(): $Field<"same_as_billing", boolean>  {
       return this.$_select("same_as_billing") as any
      }

      
/**
 * An object that describes the selected shipping method.
 */
      selected_shipping_method<Sel extends Selection<SelectedShippingMethod>>(selectorFn: (s: SelectedShippingMethod) => [...Sel]):$Field<"selected_shipping_method", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedShippingMethod)
      };
      return this.$_select("selected_shipping_method", options as any) as any
    }
  

      
/**
 * An array containing the street for the billing or shipping address.
 */
      get street(): $Field<"street", Readonly<Array<string | null>>>  {
       return this.$_select("street") as any
      }

      
/**
 * A value such as Sr., Jr., or III.
 */
      get suffix(): $Field<"suffix", string | null>  {
       return this.$_select("suffix") as any
      }

      
/**
 * The telephone number for the billing or shipping address.
 */
      get telephone(): $Field<"telephone", string | null>  {
       return this.$_select("telephone") as any
      }

      
/**
 * The unique id of the customer address.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * The VAT company number for billing or shipping address.
 */
      get vat_id(): $Field<"vat_id", string | null>  {
       return this.$_select("vat_id") as any
      }
}


/**
 * Contains details about the billing address.
 */
export class BillingCartAddress extends $Base<"BillingCartAddress"> {
  constructor() {
    super("BillingCartAddress")
  }

  
      
/**
 * The city specified for the billing or shipping address.
 */
      get city(): $Field<"city", string>  {
       return this.$_select("city") as any
      }

      
/**
 * The company specified for the billing or shipping address.
 */
      get company(): $Field<"company", string | null>  {
       return this.$_select("company") as any
      }

      
/**
 * An object containing the country label and code.
 */
      country<Sel extends Selection<CartAddressCountry>>(selectorFn: (s: CartAddressCountry) => [...Sel]):$Field<"country", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartAddressCountry)
      };
      return this.$_select("country", options as any) as any
    }
  

      
      get customer_notes(): $Field<"customer_notes", string | null>  {
       return this.$_select("customer_notes") as any
      }

      
/**
 * The customer's fax number.
 */
      get fax(): $Field<"fax", string | null>  {
       return this.$_select("fax") as any
      }

      
/**
 * The first name of the customer or guest.
 */
      get firstname(): $Field<"firstname", string>  {
       return this.$_select("firstname") as any
      }

      
/**
 * Id of the customer address.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The last name of the customer or guest.
 */
      get lastname(): $Field<"lastname", string>  {
       return this.$_select("lastname") as any
      }

      
/**
 * The middle name of the person associated with the billing/shipping address.
 */
      get middlename(): $Field<"middlename", string | null>  {
       return this.$_select("middlename") as any
      }

      
/**
 * The ZIP or postal code of the billing or shipping address.
 */
      get postcode(): $Field<"postcode", string | null>  {
       return this.$_select("postcode") as any
      }

      
/**
 * An honorific, such as Dr., Mr., or Mrs.
 */
      get prefix(): $Field<"prefix", string | null>  {
       return this.$_select("prefix") as any
      }

      
/**
 * An object containing the region label and code.
 */
      region<Sel extends Selection<CartAddressRegion>>(selectorFn: (s: CartAddressRegion) => [...Sel]):$Field<"region", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartAddressRegion)
      };
      return this.$_select("region", options as any) as any
    }
  

      
/**
 * An array containing the street for the billing or shipping address.
 */
      get street(): $Field<"street", Readonly<Array<string | null>>>  {
       return this.$_select("street") as any
      }

      
/**
 * A value such as Sr., Jr., or III.
 */
      get suffix(): $Field<"suffix", string | null>  {
       return this.$_select("suffix") as any
      }

      
/**
 * The telephone number for the billing or shipping address.
 */
      get telephone(): $Field<"telephone", string | null>  {
       return this.$_select("telephone") as any
      }

      
/**
 * The unique id of the customer address.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * The VAT company number for billing or shipping address.
 */
      get vat_id(): $Field<"vat_id", string | null>  {
       return this.$_select("vat_id") as any
      }
}


/**
 * Deprecated: The `ShippingCartAddress.cart_items` field now returns `CartItemInterface`.
 */
export class CartItemQuantity extends $Base<"CartItemQuantity"> {
  constructor() {
    super("CartItemQuantity")
  }

  
      
      get cart_item_id(): $Field<"cart_item_id", number>  {
       return this.$_select("cart_item_id") as any
      }

      
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }
}


/**
 * Contains details about the region in a billing or shipping address.
 */
export class CartAddressRegion extends $Base<"CartAddressRegion"> {
  constructor() {
    super("CartAddressRegion")
  }

  
      
/**
 * The state or province code.
 */
      get code(): $Field<"code", string | null>  {
       return this.$_select("code") as any
      }

      
/**
 * The display label for the region.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The unique ID for a pre-defined region.
 */
      get region_id(): $Field<"region_id", number | null>  {
       return this.$_select("region_id") as any
      }
}


/**
 * Contains details the country in a billing or shipping address.
 */
export class CartAddressCountry extends $Base<"CartAddressCountry"> {
  constructor() {
    super("CartAddressCountry")
  }

  
      
/**
 * The country code.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * The display label for the country.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }
}


/**
 * Contains details about the selected shipping method and carrier.
 */
export class SelectedShippingMethod extends $Base<"SelectedShippingMethod"> {
  constructor() {
    super("SelectedShippingMethod")
  }

  
      
/**
 * The cost of shipping using this shipping method.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  

      
      base_amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"base_amount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("base_amount", options as any) as any
    }
  

      
/**
 * A string that identifies a commercial carrier or an offline shipping method.
 */
      get carrier_code(): $Field<"carrier_code", string>  {
       return this.$_select("carrier_code") as any
      }

      
/**
 * The label for the carrier code.
 */
      get carrier_title(): $Field<"carrier_title", string>  {
       return this.$_select("carrier_title") as any
      }

      
/**
 * A shipping method code associated with a carrier.
 */
      get method_code(): $Field<"method_code", string>  {
       return this.$_select("method_code") as any
      }

      
/**
 * The label for the method code.
 */
      get method_title(): $Field<"method_title", string>  {
       return this.$_select("method_title") as any
      }

      
/**
 * The cost of shipping using this shipping method, excluding tax.
 */
      price_excl_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price_excl_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price_excl_tax", options as any) as any
    }
  

      
/**
 * The cost of shipping using this shipping method, including tax.
 */
      price_incl_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price_incl_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price_incl_tax", options as any) as any
    }
  
}


/**
 * Contains details about the possible shipping methods and carriers.
 */
export class AvailableShippingMethod extends $Base<"AvailableShippingMethod"> {
  constructor() {
    super("AvailableShippingMethod")
  }

  
      
/**
 * The cost of shipping using this shipping method.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  

      
/**
 * Indicates whether this shipping method can be applied to the cart.
 */
      get available(): $Field<"available", boolean>  {
       return this.$_select("available") as any
      }

      
      base_amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"base_amount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("base_amount", options as any) as any
    }
  

      
/**
 * A string that identifies a commercial carrier or an offline shipping method.
 */
      get carrier_code(): $Field<"carrier_code", string>  {
       return this.$_select("carrier_code") as any
      }

      
/**
 * The label for the carrier code.
 */
      get carrier_title(): $Field<"carrier_title", string>  {
       return this.$_select("carrier_title") as any
      }

      
/**
 * Describes an error condition.
 */
      get error_message(): $Field<"error_message", string | null>  {
       return this.$_select("error_message") as any
      }

      
/**
 * A shipping method code associated with a carrier. The value could be null if no method is available.
 */
      get method_code(): $Field<"method_code", string | null>  {
       return this.$_select("method_code") as any
      }

      
/**
 * The label for the shipping method code. The value could be null if no method is available.
 */
      get method_title(): $Field<"method_title", string | null>  {
       return this.$_select("method_title") as any
      }

      
/**
 * The cost of shipping using this shipping method, excluding tax.
 */
      price_excl_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price_excl_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price_excl_tax", options as any) as any
    }
  

      
/**
 * The cost of shipping using this shipping method, including tax.
 */
      price_incl_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price_incl_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price_incl_tax", options as any) as any
    }
  
}


/**
 * Describes a payment method that the shopper can use to pay for the order.
 */
export class AvailablePaymentMethod extends $Base<"AvailablePaymentMethod"> {
  constructor() {
    super("AvailablePaymentMethod")
  }

  
      
/**
 * The payment method code.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * If the payment method is an online integration
 */
      get is_deferred(): $Field<"is_deferred", boolean>  {
       return this.$_select("is_deferred") as any
      }

      
/**
 * Available issuers for this payment method
 */
      mollie_available_issuers<Sel extends Selection<MollieIssuer>>(selectorFn: (s: MollieIssuer) => [...Sel]):$Field<"mollie_available_issuers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MollieIssuer)
      };
      return this.$_select("mollie_available_issuers", options as any) as any
    }
  

      
/**
 * Available terminals for this payment method
 */
      mollie_available_terminals<Sel extends Selection<MollieTerminalOutput>>(selectorFn: (s: MollieTerminalOutput) => [...Sel]):$Field<"mollie_available_terminals", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MollieTerminalOutput)
      };
      return this.$_select("mollie_available_terminals", options as any) as any
    }
  

      
/**
 * Retrieve meta information for this payment method (image)
 */
      mollie_meta<Sel extends Selection<MolliePaymentMethodMeta>>(selectorFn: (s: MolliePaymentMethodMeta) => [...Sel]):$Field<"mollie_meta", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MolliePaymentMethodMeta)
      };
      return this.$_select("mollie_meta", options as any) as any
    }
  

      
/**
 * The payment method title.
 */
      get title(): $Field<"title", string>  {
       return this.$_select("title") as any
      }
}


/**
 * Describes the payment method the shopper selected.
 */
export class SelectedPaymentMethod extends $Base<"SelectedPaymentMethod"> {
  constructor() {
    super("SelectedPaymentMethod")
  }

  
      
/**
 * The payment method code.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * Retrieve meta information for this payment method (image)
 */
      mollie_meta<Sel extends Selection<MolliePaymentMethodMeta>>(selectorFn: (s: MolliePaymentMethodMeta) => [...Sel]):$Field<"mollie_meta", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MolliePaymentMethodMeta)
      };
      return this.$_select("mollie_meta", options as any) as any
    }
  

      
/**
 * The purchase order number.
 */
      get purchase_order_number(): $Field<"purchase_order_number", string | null>  {
       return this.$_select("purchase_order_number") as any
      }

      
/**
 * The payment method title.
 */
      get title(): $Field<"title", string>  {
       return this.$_select("title") as any
      }
}


/**
 * Contains the applied coupon code.
 */
export class AppliedCoupon extends $Base<"AppliedCoupon"> {
  constructor() {
    super("AppliedCoupon")
  }

  
      
/**
 * The coupon code the shopper applied to the card.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }
}


/**
 * Specifies the cart from which to remove a coupon.
 */
export type RemoveCouponFromCartInput = {
  cart_id: string
}
    


/**
 * Contains details about the cart after removing a coupon.
 */
export class RemoveCouponFromCartOutput extends $Base<"RemoveCouponFromCartOutput"> {
  constructor() {
    super("RemoveCouponFromCartOutput")
  }

  
      
/**
 * The cart after removing a coupon.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about the cart after adding simple or group products.
 */
export class AddSimpleProductsToCartOutput extends $Base<"AddSimpleProductsToCartOutput"> {
  constructor() {
    super("AddSimpleProductsToCartOutput")
  }

  
      
/**
 * The cart after adding products.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about the cart after adding virtual products.
 */
export class AddVirtualProductsToCartOutput extends $Base<"AddVirtualProductsToCartOutput"> {
  constructor() {
    super("AddVirtualProductsToCartOutput")
  }

  
      
/**
 * The cart after adding products.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about the cart after updating items.
 */
export class UpdateCartItemsOutput extends $Base<"UpdateCartItemsOutput"> {
  constructor() {
    super("UpdateCartItemsOutput")
  }

  
      
/**
 * The cart after updating products.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  

      
/**
 * Contains errors encountered while updating an item to the cart.
 */
      errors<Sel extends Selection<CartUserInputError>>(selectorFn: (s: CartUserInputError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartUserInputError)
      };
      return this.$_select("errors", options as any) as any
    }
  
}


/**
 * Contains details about the cart after removing an item.
 */
export class RemoveItemFromCartOutput extends $Base<"RemoveItemFromCartOutput"> {
  constructor() {
    super("RemoveItemFromCartOutput")
  }

  
      
/**
 * The cart after removing an item.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about the cart after setting the email of a guest.
 */
export class SetGuestEmailOnCartOutput extends $Base<"SetGuestEmailOnCartOutput"> {
  constructor() {
    super("SetGuestEmailOnCartOutput")
  }

  
      
/**
 * The cart after setting the guest email.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * An implementation for simple product cart items.
 */
export class SimpleCartItem extends $Base<"SimpleCartItem"> {
  constructor() {
    super("SimpleCartItem")
  }

  
      
/**
 * An array containing the customizable options the shopper selected.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * Errors assigned to this quote item
 */
      errors<Sel extends Selection<CartItemError>>(selectorFn: (s: CartItemError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemError)
      };
      return this.$_select("errors", options as any) as any
    }
  

      
/**
 * The entered gift message for the cart item
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * True if requested quantity is less than available stock, false otherwise.
 */
      get is_available(): $Field<"is_available", boolean>  {
       return this.$_select("is_available") as any
      }

      
/**
 * Message to display when the product is not available with this selected option.
 */
      get not_available_message(): $Field<"not_available_message", string | null>  {
       return this.$_select("not_available_message") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<CartItemPrices>>(selectorFn: (s: CartItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * Details about an item in the cart.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
      get product_type(): $Field<"product_type", string>  {
       return this.$_select("product_type") as any
      }

      
/**
 * The quantity of this item in the cart.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The unique ID for a `CartItemInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * An implementation for virtual product cart items.
 */
export class VirtualCartItem extends $Base<"VirtualCartItem"> {
  constructor() {
    super("VirtualCartItem")
  }

  
      
/**
 * An array containing customizable options the shopper selected.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * Errors assigned to this quote item
 */
      errors<Sel extends Selection<CartItemError>>(selectorFn: (s: CartItemError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemError)
      };
      return this.$_select("errors", options as any) as any
    }
  

      
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * True if requested quantity is less than available stock, false otherwise.
 */
      get is_available(): $Field<"is_available", boolean>  {
       return this.$_select("is_available") as any
      }

      
/**
 * Message to display when the product is not available with this selected option.
 */
      get not_available_message(): $Field<"not_available_message", string | null>  {
       return this.$_select("not_available_message") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<CartItemPrices>>(selectorFn: (s: CartItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * Details about an item in the cart.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
      get product_type(): $Field<"product_type", string>  {
       return this.$_select("product_type") as any
      }

      
/**
 * The quantity of this item in the cart.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The unique ID for a `CartItemInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * An interface for products in a cart.
 */
export class CartItemInterface extends $Interface<{SimpleCartItem: SimpleCartItem,VirtualCartItem: VirtualCartItem,DownloadableCartItem: DownloadableCartItem,BundleCartItem: BundleCartItem,ConfigurableCartItem: ConfigurableCartItem}, "CartItemInterface"> {
  constructor() {
    super({SimpleCartItem: SimpleCartItem,VirtualCartItem: VirtualCartItem,DownloadableCartItem: DownloadableCartItem,BundleCartItem: BundleCartItem,ConfigurableCartItem: ConfigurableCartItem}, "CartItemInterface")
  }
  
      
/**
 * Errors assigned to this quote item
 */
      errors<Sel extends Selection<CartItemError>>(selectorFn: (s: CartItemError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemError)
      };
      return this.$_select("errors", options as any) as any
    }
  

      
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * True if requested quantity is less than available stock, false otherwise.
 */
      get is_available(): $Field<"is_available", boolean>  {
       return this.$_select("is_available") as any
      }

      
/**
 * Message to display when the product is not available with this selected option.
 */
      get not_available_message(): $Field<"not_available_message", string | null>  {
       return this.$_select("not_available_message") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<CartItemPrices>>(selectorFn: (s: CartItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * Details about an item in the cart.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
      get product_type(): $Field<"product_type", string>  {
       return this.$_select("product_type") as any
      }

      
/**
 * The quantity of this item in the cart.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The unique ID for a `CartItemInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


export class CartItemError extends $Base<"CartItemError"> {
  constructor() {
    super("CartItemError")
  }

  
      
/**
 * An error code that describes the error encountered
 */
      get code(): $Field<"code", CartItemErrorType>  {
       return this.$_select("code") as any
      }

      
/**
 * A localized error message
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }
}

  
export enum CartItemErrorType {
  
  UNDEFINED = "UNDEFINED",

  ITEM_QTY = "ITEM_QTY",

  ITEM_INCREMENTS = "ITEM_INCREMENTS"
}
  


/**
 * Defines an individual discount. A discount can be applied to the cart as a whole or to an item, shipping.
 */
export class Discount extends $Base<"Discount"> {
  constructor() {
    super("Discount")
  }

  
      
/**
 * The amount of the discount.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  

      
/**
 * The type of the entity the discount is applied to.
 */
      get applied_to(): $Field<"applied_to", CartDiscountType>  {
       return this.$_select("applied_to") as any
      }

      
/**
 * The coupon related to the discount.
 */
      coupon<Sel extends Selection<AppliedCoupon>>(selectorFn: (s: AppliedCoupon) => [...Sel]):$Field<"coupon", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AppliedCoupon)
      };
      return this.$_select("coupon", options as any) as any
    }
  

      
/**
 * A description of the discount.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }
}

  
export enum CartDiscountType {
  
  ITEM = "ITEM",

  SHIPPING = "SHIPPING"
}
  


/**
 * Contains details about the price of the item, including taxes and discounts.
 */
export class CartItemPrices extends $Base<"CartItemPrices"> {
  constructor() {
    super("CartItemPrices")
  }

  
      
/**
 * The price discount for the unit price of the item represents the difference between its regular price and final price.
 */
      catalog_discount<Sel extends Selection<ProductDiscount>>(selectorFn: (s: ProductDiscount) => [...Sel]):$Field<"catalog_discount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductDiscount)
      };
      return this.$_select("catalog_discount", options as any) as any
    }
  

      
/**
 * An array of discounts to be applied to the cart item.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * An array of FPTs applied to the cart item.
 */
      fixed_product_taxes<Sel extends Selection<FixedProductTax>>(selectorFn: (s: FixedProductTax) => [...Sel]):$Field<"fixed_product_taxes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new FixedProductTax)
      };
      return this.$_select("fixed_product_taxes", options as any) as any
    }
  

      
/**
 * The value of the original unit price for the item, including discounts.
 */
      original_item_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"original_item_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("original_item_price", options as any) as any
    }
  

      
/**
 * The value of the original price multiplied by the quantity of the item.
 */
      original_row_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"original_row_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("original_row_total", options as any) as any
    }
  

      
/**
 * The price of the item before any discounts were applied. The price that might include tax, depending on the configured display settings for cart.
 */
      price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price", options as any) as any
    }
  

      
      price_incl_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price_incl_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price_incl_tax", options as any) as any
    }
  

      
/**
 * The price of the item before any discounts were applied. The price that might include tax, depending on the configured display settings for cart.
 */
      price_including_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price_including_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price_including_tax", options as any) as any
    }
  

      
/**
 * The price discount multiplied by the item quantity represents the total difference between the regular price and the final price for the entire quote item.
 */
      row_catalog_discount<Sel extends Selection<ProductDiscount>>(selectorFn: (s: ProductDiscount) => [...Sel]):$Field<"row_catalog_discount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductDiscount)
      };
      return this.$_select("row_catalog_discount", options as any) as any
    }
  

      
/**
 * The value of the price multiplied by the quantity of the item.
 */
      row_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"row_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("row_total", options as any) as any
    }
  

      
      row_total_incl_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"row_total_incl_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("row_total_incl_tax", options as any) as any
    }
  

      
/**
 * The value of `row_total` plus the tax applied to the item.
 */
      row_total_including_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"row_total_including_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("row_total_including_tax", options as any) as any
    }
  

      
/**
 * The total of all discounts applied to the item.
 */
      total_item_discount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"total_item_discount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("total_item_discount", options as any) as any
    }
  
}


/**
 * Identifies a customized product that has been placed in a cart.
 */
export class SelectedCustomizableOption extends $Base<"SelectedCustomizableOption"> {
  constructor() {
    super("SelectedCustomizableOption")
  }

  
      
/**
 * The unique ID for a specific `CustomizableOptionInterface` object, such as a `CustomizableFieldOption`, `CustomizableFileOption`, or `CustomizableAreaOption` object.
 */
      get customizable_option_uid(): $Field<"customizable_option_uid", string>  {
       return this.$_select("customizable_option_uid") as any
      }

      
      get id(): $Field<"id", number>  {
       return this.$_select("id") as any
      }

      
/**
 * Indicates whether the customizable option is required.
 */
      get is_required(): $Field<"is_required", boolean>  {
       return this.$_select("is_required") as any
      }

      
/**
 * The display name of the selected customizable option.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * A value indicating the order to display this option.
 */
      get sort_order(): $Field<"sort_order", number>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The type of `CustomizableOptionInterface` object.
 */
      get type(): $Field<"type", string>  {
       return this.$_select("type") as any
      }

      
/**
 * An array of selectable values.
 */
      values<Sel extends Selection<SelectedCustomizableOptionValue>>(selectorFn: (s: SelectedCustomizableOptionValue) => [...Sel]):$Field<"values", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOptionValue)
      };
      return this.$_select("values", options as any) as any
    }
  
}


/**
 * Identifies the value of the selected customized option.
 */
export class SelectedCustomizableOptionValue extends $Base<"SelectedCustomizableOptionValue"> {
  constructor() {
    super("SelectedCustomizableOptionValue")
  }

  
      
/**
 * The unique ID for a value object that corresponds to the object represented by the `customizable_option_uid` attribute.
 */
      get customizable_option_value_uid(): $Field<"customizable_option_value_uid", string>  {
       return this.$_select("customizable_option_value_uid") as any
      }

      
      get has_file(): $Field<"has_file", boolean | null>  {
       return this.$_select("has_file") as any
      }

      
      get id(): $Field<"id", number>  {
       return this.$_select("id") as any
      }

      
/**
 * The display name of the selected value.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The price of the selected customizable value.
 */
      price<Sel extends Selection<CartItemSelectedOptionValuePrice>>(selectorFn: (s: CartItemSelectedOptionValuePrice) => [...Sel]):$Field<"price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemSelectedOptionValuePrice)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The text identifying the selected value.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


/**
 * Contains details about the price of a selected customizable value.
 */
export class CartItemSelectedOptionValuePrice extends $Base<"CartItemSelectedOptionValuePrice"> {
  constructor() {
    super("CartItemSelectedOptionValuePrice")
  }

  
      
/**
 * Indicates whether the price type is fixed, percent, or dynamic.
 */
      get type(): $Field<"type", PriceTypeEnum>  {
       return this.$_select("type") as any
      }

      
/**
 * A string that describes the unit of the value.
 */
      get units(): $Field<"units", string>  {
       return this.$_select("units") as any
      }

      
/**
 * A price value.
 */
      get value(): $Field<"value", number>  {
       return this.$_select("value") as any
      }
}


/**
 * Contains the order ID.
 */
export class Order extends $Base<"Order"> {
  constructor() {
    super("Order")
  }

  
      
      get mollie_payment_token(): $Field<"mollie_payment_token", string | null>  {
       return this.$_select("mollie_payment_token") as any
      }

      
      get mollie_redirect_url(): $Field<"mollie_redirect_url", string | null>  {
       return this.$_select("mollie_redirect_url") as any
      }

      
      get order_id(): $Field<"order_id", string | null>  {
       return this.$_select("order_id") as any
      }

      
/**
 * The unique ID for an `Order` object.
 */
      get order_number(): $Field<"order_number", string>  {
       return this.$_select("order_number") as any
      }
}


/**
 * An error encountered while adding an item to the the cart.
 */
export class Error extends $Interface<{CartUserInputError: CartUserInputError,InsufficientStockError: InsufficientStockError}, "Error"> {
  constructor() {
    super({CartUserInputError: CartUserInputError,InsufficientStockError: InsufficientStockError}, "Error")
  }
  
      
/**
 * A cart-specific error code.
 */
      get code(): $Field<"code", CartUserInputErrorType>  {
       return this.$_select("code") as any
      }

      
/**
 * A localized error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }
}


export class CartUserInputError extends $Base<"CartUserInputError"> {
  constructor() {
    super("CartUserInputError")
  }

  
      
/**
 * A cart-specific error code.
 */
      get code(): $Field<"code", CartUserInputErrorType>  {
       return this.$_select("code") as any
      }

      
/**
 * A localized error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }
}


export class InsufficientStockError extends $Base<"InsufficientStockError"> {
  constructor() {
    super("InsufficientStockError")
  }

  
      
/**
 * A cart-specific error code.
 */
      get code(): $Field<"code", CartUserInputErrorType>  {
       return this.$_select("code") as any
      }

      
/**
 * A localized error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }

      
/**
 * Amount of available stock
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }
}


/**
 * Contains details about the cart after adding products to it.
 */
export class AddProductsToCartOutput extends $Base<"AddProductsToCartOutput"> {
  constructor() {
    super("AddProductsToCartOutput")
  }

  
      
/**
 * The cart after products have been added.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  

      
/**
 * Contains errors encountered while adding an item to the cart.
 */
      user_errors<Sel extends Selection<Error>>(selectorFn: (s: Error) => [...Sel]):$Field<"user_errors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Error)
      };
      return this.$_select("user_errors", options as any) as any
    }
  
}

  
export enum CartUserInputErrorType {
  
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",

  NOT_SALABLE = "NOT_SALABLE",

  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",

  COULD_NOT_FIND_CART_ITEM = "COULD_NOT_FIND_CART_ITEM",

  REQUIRED_PARAMETER_MISSING = "REQUIRED_PARAMETER_MISSING",

  INVALID_PARAMETER_VALUE = "INVALID_PARAMETER_VALUE",

  UNDEFINED = "UNDEFINED"
}
  

  
export enum ProductImageThumbnail {
  
/**
 * Use thumbnail of product as image.
 */
  ITSELF = "ITSELF",

/**
 * Use thumbnail of product's parent as image.
 */
  PARENT = "PARENT"
}
  


export type EstimateTotalsInput = {
  address: EstimateAddressInput,
cart_id: string,
shipping_method?: ShippingMethodInput | null
}
    


/**
 * Estimate totals output.
 */
export class EstimateTotalsOutput extends $Base<"EstimateTotalsOutput"> {
  constructor() {
    super("EstimateTotalsOutput")
  }

  
      
/**
 * Cart after totals estimation
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains details about an address.
 */
export type EstimateAddressInput = {
  country_code: CountryCodeEnum,
postcode?: string | null,
region?: CustomerAddressRegionInput | null
}
    


export type ContactUsInput = {
  comment: string,
email: string,
name: string,
telephone?: string | null
}
    


/**
 * Contains the status of the request.
 */
export class ContactUsOutput extends $Base<"ContactUsOutput"> {
  constructor() {
    super("ContactUsOutput")
  }

  
      
/**
 * Indicates whether the request was successful.
 */
      get status(): $Field<"status", boolean>  {
       return this.$_select("status") as any
      }
}


/**
 * Deprecated. Use `TierPrice` instead. Defines a tier price, which is a quantity discount offered to a specific customer group.
 */
export class ProductTierPrices extends $Base<"ProductTierPrices"> {
  constructor() {
    super("ProductTierPrices")
  }

  
      
/**
 * The ID of the customer group.
 */
      get customer_group_id(): $Field<"customer_group_id", string | null>  {
       return this.$_select("customer_group_id") as any
      }

      
/**
 * The percentage discount of the item.
 */
      get percentage_value(): $Field<"percentage_value", number | null>  {
       return this.$_select("percentage_value") as any
      }

      
/**
 * The number of items that must be purchased to qualify for tier pricing.
 */
      get qty(): $Field<"qty", number | null>  {
       return this.$_select("qty") as any
      }

      
/**
 * The price of the fixed price item.
 */
      get value(): $Field<"value", number | null>  {
       return this.$_select("value") as any
      }

      
/**
 * The ID assigned to the website.
 */
      get website_id(): $Field<"website_id", number | null>  {
       return this.$_select("website_id") as any
      }
}


/**
 * Defines a price based on the quantity purchased.
 */
export class TierPrice extends $Base<"TierPrice"> {
  constructor() {
    super("TierPrice")
  }

  
      
/**
 * The price discount that this tier represents.
 */
      discount<Sel extends Selection<ProductDiscount>>(selectorFn: (s: ProductDiscount) => [...Sel]):$Field<"discount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductDiscount)
      };
      return this.$_select("discount", options as any) as any
    }
  

      
/**
 * The price of the product at this tier.
 */
      final_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"final_price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("final_price", options as any) as any
    }
  

      
/**
 * The minimum number of items that must be purchased to qualify for this price tier.
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }
}


export class Currency extends $Base<"Currency"> {
  constructor() {
    super("Currency")
  }

  
      
/**
 * An array of three-letter currency codes accepted by the store, such as USD and EUR.
 */
      get available_currency_codes(): $Field<"available_currency_codes", Readonly<Array<string | null>> | null>  {
       return this.$_select("available_currency_codes") as any
      }

      
/**
 * The base currency set for the store, such as USD.
 */
      get base_currency_code(): $Field<"base_currency_code", string | null>  {
       return this.$_select("base_currency_code") as any
      }

      
/**
 * The symbol for the specified base currency, such as $.
 */
      get base_currency_symbol(): $Field<"base_currency_symbol", string | null>  {
       return this.$_select("base_currency_symbol") as any
      }

      
      get default_display_currecy_code(): $Field<"default_display_currecy_code", string | null>  {
       return this.$_select("default_display_currecy_code") as any
      }

      
      get default_display_currecy_symbol(): $Field<"default_display_currecy_symbol", string | null>  {
       return this.$_select("default_display_currecy_symbol") as any
      }

      
/**
 * The currency that is displayed by default, such as USD.
 */
      get default_display_currency_code(): $Field<"default_display_currency_code", string | null>  {
       return this.$_select("default_display_currency_code") as any
      }

      
/**
 * The currency symbol that is displayed by default, such as $.
 */
      get default_display_currency_symbol(): $Field<"default_display_currency_symbol", string | null>  {
       return this.$_select("default_display_currency_symbol") as any
      }

      
/**
 * An array of exchange rates for currencies defined in the store.
 */
      exchange_rates<Sel extends Selection<ExchangeRate>>(selectorFn: (s: ExchangeRate) => [...Sel]):$Field<"exchange_rates", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ExchangeRate)
      };
      return this.$_select("exchange_rates", options as any) as any
    }
  
}


/**
 * Lists the exchange rate.
 */
export class ExchangeRate extends $Base<"ExchangeRate"> {
  constructor() {
    super("ExchangeRate")
  }

  
      
/**
 * Specifies the store’s default currency to exchange to.
 */
      get currency_to(): $Field<"currency_to", string | null>  {
       return this.$_select("currency_to") as any
      }

      
/**
 * The exchange rate for the store’s default currency.
 */
      get rate(): $Field<"rate", number | null>  {
       return this.$_select("rate") as any
      }
}


export class Country extends $Base<"Country"> {
  constructor() {
    super("Country")
  }

  
      
/**
 * An array of regions within a particular country.
 */
      available_regions<Sel extends Selection<Region>>(selectorFn: (s: Region) => [...Sel]):$Field<"available_regions", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Region)
      };
      return this.$_select("available_regions", options as any) as any
    }
  

      
/**
 * The name of the country in English.
 */
      get full_name_english(): $Field<"full_name_english", string | null>  {
       return this.$_select("full_name_english") as any
      }

      
/**
 * The name of the country in the current locale.
 */
      get full_name_locale(): $Field<"full_name_locale", string | null>  {
       return this.$_select("full_name_locale") as any
      }

      
/**
 * The unique ID for a `Country` object.
 */
      get id(): $Field<"id", string | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The three-letter abbreviation of the country, such as USA.
 */
      get three_letter_abbreviation(): $Field<"three_letter_abbreviation", string | null>  {
       return this.$_select("three_letter_abbreviation") as any
      }

      
/**
 * The two-letter abbreviation of the country, such as US.
 */
      get two_letter_abbreviation(): $Field<"two_letter_abbreviation", string | null>  {
       return this.$_select("two_letter_abbreviation") as any
      }
}


export class Region extends $Base<"Region"> {
  constructor() {
    super("Region")
  }

  
      
/**
 * The two-letter code for the region, such as TX for Texas.
 */
      get code(): $Field<"code", string | null>  {
       return this.$_select("code") as any
      }

      
/**
 * The unique ID for a `Region` object.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The name of the region, such as Texas.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }
}


export type AddDownloadableProductsToCartInput = {
  cart_id: string,
cart_items: Readonly<Array<DownloadableProductCartItemInput | null>>
}
    


/**
 * Defines a single downloadable product.
 */
export type DownloadableProductCartItemInput = {
  customizable_options?: Readonly<Array<CustomizableOptionInput | null>> | null,
data: CartItemInput,
downloadable_product_links?: Readonly<Array<DownloadableProductLinksInput | null>> | null
}
    


/**
 * Contains the link ID for the downloadable product.
 */
export type DownloadableProductLinksInput = {
  link_id: number
}
    


/**
 * Contains details about the cart after adding downloadable products.
 */
export class AddDownloadableProductsToCartOutput extends $Base<"AddDownloadableProductsToCartOutput"> {
  constructor() {
    super("AddDownloadableProductsToCartOutput")
  }

  
      
/**
 * The cart after adding products.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * An implementation for downloadable product cart items.
 */
export class DownloadableCartItem extends $Base<"DownloadableCartItem"> {
  constructor() {
    super("DownloadableCartItem")
  }

  
      
/**
 * An array containing the customizable options the shopper selected.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * Errors assigned to this quote item
 */
      errors<Sel extends Selection<CartItemError>>(selectorFn: (s: CartItemError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemError)
      };
      return this.$_select("errors", options as any) as any
    }
  

      
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * True if requested quantity is less than available stock, false otherwise.
 */
      get is_available(): $Field<"is_available", boolean>  {
       return this.$_select("is_available") as any
      }

      
/**
 * An array containing information about the links for the downloadable product added to the cart.
 */
      links<Sel extends Selection<DownloadableProductLinks>>(selectorFn: (s: DownloadableProductLinks) => [...Sel]):$Field<"links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new DownloadableProductLinks)
      };
      return this.$_select("links", options as any) as any
    }
  

      
/**
 * Message to display when the product is not available with this selected option.
 */
      get not_available_message(): $Field<"not_available_message", string | null>  {
       return this.$_select("not_available_message") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<CartItemPrices>>(selectorFn: (s: CartItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * Details about an item in the cart.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
      get product_type(): $Field<"product_type", string>  {
       return this.$_select("product_type") as any
      }

      
/**
 * The quantity of this item in the cart.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }

      
/**
 * An array containing information about samples of the selected downloadable product.
 */
      samples<Sel extends Selection<DownloadableProductSamples>>(selectorFn: (s: DownloadableProductSamples) => [...Sel]):$Field<"samples", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new DownloadableProductSamples)
      };
      return this.$_select("samples", options as any) as any
    }
  

      
/**
 * The unique ID for a `CartItemInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Defines a product that the shopper downloads.
 */
export class DownloadableProduct extends $Base<"DownloadableProduct"> {
  constructor() {
    super("DownloadableProduct")
  }

  
      
/**
 * The attribute set assigned to the product.
 */
      get attribute_set_id(): $Field<"attribute_set_id", number | null>  {
       return this.$_select("attribute_set_id") as any
      }

      
      get brand(): $Field<"brand", number | null>  {
       return this.$_select("brand") as any
      }

      
/**
 * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
 */
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
/**
 * The categories assigned to a product.
 */
      categories<Sel extends Selection<CategoryInterface>>(selectorFn: (s: CategoryInterface) => [...Sel]):$Field<"categories", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CategoryInterface)
      };
      return this.$_select("categories", options as any) as any
    }
  

      
      get color(): $Field<"color", number | null>  {
       return this.$_select("color") as any
      }

      
/**
 * The product's country of origin.
 */
      get country_of_manufacture(): $Field<"country_of_manufacture", string | null>  {
       return this.$_select("country_of_manufacture") as any
      }

      
/**
 * Timestamp indicating when the product was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
/**
 * Crosssell Products
 */
      crosssell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"crosssell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("crosssell_products", options as any) as any
    }
  

      
/**
 * Product custom attributes.
 */
      custom_attributesV2<Args extends VariabledInput<{
        filters?: AttributeFilterInput | null,
      }>,Sel extends Selection<ProductCustomAttributes>>(args: ExactArgNames<Args, {
        filters?: AttributeFilterInput | null,
      }>, selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
custom_attributesV2<Sel extends Selection<ProductCustomAttributes>>(selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel>>
custom_attributesV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filters: "AttributeFilterInput"
            },
        args,

        selection: selectorFn(new ProductCustomAttributes)
      };
      return this.$_select("custom_attributesV2", options as any) as any
    }
  

      
/**
 * Detailed information about the product. The value can include simple HTML tags.
 */
      description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("description", options as any) as any
    }
  

      
/**
 * An array containing information about the links for this downloadable product.
 */
      downloadable_product_links<Sel extends Selection<DownloadableProductLinks>>(selectorFn: (s: DownloadableProductLinks) => [...Sel]):$Field<"downloadable_product_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new DownloadableProductLinks)
      };
      return this.$_select("downloadable_product_links", options as any) as any
    }
  

      
/**
 * An array containing information about samples of this downloadable product.
 */
      downloadable_product_samples<Sel extends Selection<DownloadableProductSamples>>(selectorFn: (s: DownloadableProductSamples) => [...Sel]):$Field<"downloadable_product_samples", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new DownloadableProductSamples)
      };
      return this.$_select("downloadable_product_samples", options as any) as any
    }
  

      
/**
 * Returns a value indicating gift message availability for the product.
 */
      get gift_message_available(): $Field<"gift_message_available", boolean>  {
       return this.$_select("gift_message_available") as any
      }

      
/**
 * The ID number assigned to the product.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The relative path to the main image on the product page.
 */
      image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("image", options as any) as any
    }
  

      
/**
 * A value of 1 indicates that each link in the array must be purchased separately.
 */
      get links_purchased_separately(): $Field<"links_purchased_separately", number | null>  {
       return this.$_select("links_purchased_separately") as any
      }

      
/**
 * The heading above the list of downloadable products.
 */
      get links_title(): $Field<"links_title", string | null>  {
       return this.$_select("links_title") as any
      }

      
/**
 * A number representing the product's manufacturer.
 */
      get manufacturer(): $Field<"manufacturer", number | null>  {
       return this.$_select("manufacturer") as any
      }

      
/**
 * Maximum Qty Allowed in Shopping Cart
 */
      get max_sale_qty(): $Field<"max_sale_qty", number | null>  {
       return this.$_select("max_sale_qty") as any
      }

      
/**
 * An array of media gallery objects.
 */
      media_gallery<Sel extends Selection<MediaGalleryInterface>>(selectorFn: (s: MediaGalleryInterface) => [...Sel]):$Field<"media_gallery", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryInterface)
      };
      return this.$_select("media_gallery", options as any) as any
    }
  

      
/**
 * An array of MediaGalleryEntry objects.
 */
      media_gallery_entries<Sel extends Selection<MediaGalleryEntry>>(selectorFn: (s: MediaGalleryEntry) => [...Sel]):$Field<"media_gallery_entries", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryEntry)
      };
      return this.$_select("media_gallery_entries", options as any) as any
    }
  

      
/**
 * A brief overview of the product for search results listings, maximum 255 characters.
 */
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
/**
 * A comma-separated list of keywords that are visible only to search engines.
 */
      get meta_keyword(): $Field<"meta_keyword", string | null>  {
       return this.$_select("meta_keyword") as any
      }

      
/**
 * A string that is displayed in the title bar and tab of the browser and in search results lists.
 */
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * Minimum Qty Allowed in Shopping Cart
 */
      get min_sale_qty(): $Field<"min_sale_qty", number | null>  {
       return this.$_select("min_sale_qty") as any
      }

      
/**
 * The product name. Customers use this name to identify the product.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The beginning date for new product listings, and determines if the product is featured as a new product.
 */
      get new_from_date(): $Field<"new_from_date", string | null>  {
       return this.$_select("new_from_date") as any
      }

      
/**
 * The end date for new product listings.
 */
      get new_to_date(): $Field<"new_to_date", string | null>  {
       return this.$_select("new_to_date") as any
      }

      
/**
 * Product stock only x left count
 */
      get only_x_left_in_stock(): $Field<"only_x_left_in_stock", number | null>  {
       return this.$_select("only_x_left_in_stock") as any
      }

      
/**
 * An array of options for a customizable product.
 */
      options<Sel extends Selection<CustomizableOptionInterface>>(selectorFn: (s: CustomizableOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  

      
/**
 * If the product has multiple options, determines where they appear on the product page.
 */
      get options_container(): $Field<"options_container", string | null>  {
       return this.$_select("options_container") as any
      }

      
/**
 * Indicates the price of an item.
 */
      price<Sel extends Selection<ProductPrices>>(selectorFn: (s: ProductPrices) => [...Sel]):$Field<"price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductPrices)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The range of prices for the product
 */
      price_range<Sel extends Selection<PriceRange>>(selectorFn: (s: PriceRange) => [...Sel]):$Field<"price_range", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceRange)
      };
      return this.$_select("price_range", options as any) as any
    }
  

      
/**
 * An array of `TierPrice` objects.
 */
      price_tiers<Sel extends Selection<TierPrice>>(selectorFn: (s: TierPrice) => [...Sel]):$Field<"price_tiers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TierPrice)
      };
      return this.$_select("price_tiers", options as any) as any
    }
  

      
/**
 * An array of `ProductLinks` objects.
 */
      product_links<Sel extends Selection<ProductLinksInterface>>(selectorFn: (s: ProductLinksInterface) => [...Sel]):$Field<"product_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductLinksInterface)
      };
      return this.$_select("product_links", options as any) as any
    }
  

      
/**
 * Amount of available stock
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The average of all the ratings given to the product.
 */
      get rating_summary(): $Field<"rating_summary", number>  {
       return this.$_select("rating_summary") as any
      }

      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * An array of products to be displayed in a Related Products block.
 */
      related_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"related_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("related_products", options as any) as any
    }
  

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * The total count of all the reviews given to the product.
 */
      get review_count(): $Field<"review_count", number>  {
       return this.$_select("review_count") as any
      }

      
/**
 * The list of products reviews.
 */
      reviews<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<ProductReviews>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel, Args>>
reviews<Sel extends Selection<ProductReviews>>(selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel>>
reviews(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new ProductReviews)
      };
      return this.$_select("reviews", options as any) as any
    }
  

      
/**
 * A short description of the product. Its use depends on the theme.
 */
      short_description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"short_description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("short_description", options as any) as any
    }
  

      
/**
 * A number or code assigned to a product to identify the product, options, price, and manufacturer.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The relative path to the small image, which is used on catalog pages.
 */
      small_image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"small_image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("small_image", options as any) as any
    }
  

      
/**
 * The beginning date that a product has a special price.
 */
      get special_from_date(): $Field<"special_from_date", string | null>  {
       return this.$_select("special_from_date") as any
      }

      
/**
 * The discounted price of the product.
 */
      get special_price(): $Field<"special_price", number | null>  {
       return this.$_select("special_price") as any
      }

      
/**
 * The end date for a product with a special price.
 */
      get special_to_date(): $Field<"special_to_date", string | null>  {
       return this.$_select("special_to_date") as any
      }

      
/**
 * The status assigned to the product, 0 for disabled, 1 for enabled.
 */
      get status(): $Field<"status", number | null>  {
       return this.$_select("status") as any
      }

      
/**
 * Stock status of the product
 */
      get stock_status(): $Field<"stock_status", ProductStockStatus | null>  {
       return this.$_select("stock_status") as any
      }

      
/**
 * The file name of a swatch image.
 */
      get swatch_image(): $Field<"swatch_image", string | null>  {
       return this.$_select("swatch_image") as any
      }

      
/**
 * The relative path to the product's thumbnail image.
 */
      thumbnail<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"thumbnail", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("thumbnail", options as any) as any
    }
  

      
/**
 * The price when tier pricing is in effect and the items purchased threshold has been reached.
 */
      get tier_price(): $Field<"tier_price", number | null>  {
       return this.$_select("tier_price") as any
      }

      
/**
 * An array of ProductTierPrices objects.
 */
      tier_prices<Sel extends Selection<ProductTierPrices>>(selectorFn: (s: ProductTierPrices) => [...Sel]):$Field<"tier_prices", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductTierPrices)
      };
      return this.$_select("tier_prices", options as any) as any
    }
  

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }

      
/**
 * One of simple, virtual, bundle, downloadable, grouped, or configurable.
 */
      get type_id(): $Field<"type_id", string | null>  {
       return this.$_select("type_id") as any
      }

      
/**
 * The unique ID for a `ProductInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * Timestamp indicating when the product was updated.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }

      
/**
 * Upsell Products
 */
      upsell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"upsell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("upsell_products", options as any) as any
    }
  

      
/**
 * The part of the URL that identifies the product
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }

      
      get url_path(): $Field<"url_path", string | null>  {
       return this.$_select("url_path") as any
      }

      
/**
 * URL rewrites list
 */
      url_rewrites<Sel extends Selection<UrlRewrite>>(selectorFn: (s: UrlRewrite) => [...Sel]):$Field<"url_rewrites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new UrlRewrite)
      };
      return this.$_select("url_rewrites", options as any) as any
    }
  

      
/**
 * The part of the product URL that is appended after the url key
 */
      get url_suffix(): $Field<"url_suffix", string | null>  {
       return this.$_select("url_suffix") as any
      }

      
/**
 * The visibility assigned to the product.
 */
      get visibility(): $Field<"visibility", number | null>  {
       return this.$_select("visibility") as any
      }

      
/**
 * An array of websites in which the product is available.
 */
      websites<Sel extends Selection<Website>>(selectorFn: (s: Website) => [...Sel]):$Field<"websites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Website)
      };
      return this.$_select("websites", options as any) as any
    }
  
}

  
export enum DownloadableFileTypeEnum {
  
  FILE = "FILE",

  URL = "URL"
}
  


/**
 * Defines characteristics of a downloadable product.
 */
export class DownloadableProductLinks extends $Base<"DownloadableProductLinks"> {
  constructor() {
    super("DownloadableProductLinks")
  }

  
      
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
      get is_shareable(): $Field<"is_shareable", boolean | null>  {
       return this.$_select("is_shareable") as any
      }

      
      get link_type(): $Field<"link_type", DownloadableFileTypeEnum | null>  {
       return this.$_select("link_type") as any
      }

      
      get number_of_downloads(): $Field<"number_of_downloads", number | null>  {
       return this.$_select("number_of_downloads") as any
      }

      
/**
 * The price of the downloadable product.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
      get sample_file(): $Field<"sample_file", string | null>  {
       return this.$_select("sample_file") as any
      }

      
      get sample_type(): $Field<"sample_type", DownloadableFileTypeEnum | null>  {
       return this.$_select("sample_type") as any
      }

      
/**
 * The full URL to the downloadable sample.
 */
      get sample_url(): $Field<"sample_url", string | null>  {
       return this.$_select("sample_url") as any
      }

      
/**
 * A number indicating the sort order.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name of the link.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `DownloadableProductLinks` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Defines characteristics of a downloadable product.
 */
export class DownloadableProductSamples extends $Base<"DownloadableProductSamples"> {
  constructor() {
    super("DownloadableProductSamples")
  }

  
      
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
      get sample_file(): $Field<"sample_file", string | null>  {
       return this.$_select("sample_file") as any
      }

      
      get sample_type(): $Field<"sample_type", DownloadableFileTypeEnum | null>  {
       return this.$_select("sample_type") as any
      }

      
/**
 * The full URL to the downloadable sample.
 */
      get sample_url(): $Field<"sample_url", string | null>  {
       return this.$_select("sample_url") as any
      }

      
/**
 * A number indicating the sort order.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name of the sample.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }
}


/**
 * Defines downloadable product options for `OrderItemInterface`.
 */
export class DownloadableOrderItem extends $Base<"DownloadableOrderItem"> {
  constructor() {
    super("DownloadableOrderItem")
  }

  
      
/**
 * The final discount information for the product.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * A list of downloadable links that are ordered from the downloadable product.
 */
      downloadable_links<Sel extends Selection<DownloadableItemsLinks>>(selectorFn: (s: DownloadableItemsLinks) => [...Sel]):$Field<"downloadable_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new DownloadableItemsLinks)
      };
      return this.$_select("downloadable_links", options as any) as any
    }
  

      
/**
 * The entered option for the base product, such as a logo or image.
 */
      entered_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"entered_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("entered_options", options as any) as any
    }
  

      
/**
 * The selected gift message for the order item
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
/**
 * The unique ID for an `OrderItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<OrderItemPrices>>(selectorFn: (s: OrderItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * The ProductInterface object, which contains details about the base product
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price of the base product, including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The type of product, such as simple, configurable, etc.
 */
      get product_type(): $Field<"product_type", string | null>  {
       return this.$_select("product_type") as any
      }

      
/**
 * URL key of the base product.
 */
      get product_url_key(): $Field<"product_url_key", string | null>  {
       return this.$_select("product_url_key") as any
      }

      
/**
 * The number of canceled items.
 */
      get quantity_canceled(): $Field<"quantity_canceled", number | null>  {
       return this.$_select("quantity_canceled") as any
      }

      
/**
 * The number of invoiced items.
 */
      get quantity_invoiced(): $Field<"quantity_invoiced", number | null>  {
       return this.$_select("quantity_invoiced") as any
      }

      
/**
 * The number of units ordered for this item.
 */
      get quantity_ordered(): $Field<"quantity_ordered", number | null>  {
       return this.$_select("quantity_ordered") as any
      }

      
/**
 * The number of refunded items.
 */
      get quantity_refunded(): $Field<"quantity_refunded", number | null>  {
       return this.$_select("quantity_refunded") as any
      }

      
/**
 * The number of returned items.
 */
      get quantity_returned(): $Field<"quantity_returned", number | null>  {
       return this.$_select("quantity_returned") as any
      }

      
/**
 * The number of shipped items.
 */
      get quantity_shipped(): $Field<"quantity_shipped", number | null>  {
       return this.$_select("quantity_shipped") as any
      }

      
/**
 * The selected options for the base product, such as color or size.
 */
      selected_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"selected_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("selected_options", options as any) as any
    }
  

      
/**
 * The status of the order item.
 */
      get status(): $Field<"status", string | null>  {
       return this.$_select("status") as any
      }
}


/**
 * Defines downloadable product options for `InvoiceItemInterface`.
 */
export class DownloadableInvoiceItem extends $Base<"DownloadableInvoiceItem"> {
  constructor() {
    super("DownloadableInvoiceItem")
  }

  
      
/**
 * Information about the final discount amount for the base product, including discounts on options.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * A list of downloadable links that are invoiced from the downloadable product.
 */
      downloadable_links<Sel extends Selection<DownloadableItemsLinks>>(selectorFn: (s: DownloadableItemsLinks) => [...Sel]):$Field<"downloadable_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new DownloadableItemsLinks)
      };
      return this.$_select("downloadable_links", options as any) as any
    }
  

      
/**
 * The unique ID for an `InvoiceItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Details about an individual order item.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of invoiced items.
 */
      get quantity_invoiced(): $Field<"quantity_invoiced", number | null>  {
       return this.$_select("quantity_invoiced") as any
      }
}


/**
 * Defines downloadable product options for `CreditMemoItemInterface`.
 */
export class DownloadableCreditMemoItem extends $Base<"DownloadableCreditMemoItem"> {
  constructor() {
    super("DownloadableCreditMemoItem")
  }

  
      
/**
 * Details about the final discount amount for the base product, including discounts on options.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * A list of downloadable links that are refunded from the downloadable product.
 */
      downloadable_links<Sel extends Selection<DownloadableItemsLinks>>(selectorFn: (s: DownloadableItemsLinks) => [...Sel]):$Field<"downloadable_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new DownloadableItemsLinks)
      };
      return this.$_select("downloadable_links", options as any) as any
    }
  

      
/**
 * The unique ID for a `CreditMemoItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The order item the credit memo is applied to.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product, including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of refunded items.
 */
      get quantity_refunded(): $Field<"quantity_refunded", number | null>  {
       return this.$_select("quantity_refunded") as any
      }
}


/**
 * Defines characteristics of the links for downloadable product.
 */
export class DownloadableItemsLinks extends $Base<"DownloadableItemsLinks"> {
  constructor() {
    super("DownloadableItemsLinks")
  }

  
      
/**
 * A number indicating the sort order.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The display name of the link.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The unique ID for a `DownloadableItemsLinks` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * A downloadable product wish list item.
 */
export class DownloadableWishlistItem extends $Base<"DownloadableWishlistItem"> {
  constructor() {
    super("DownloadableWishlistItem")
  }

  
      
/**
 * The date and time the item was added to the wish list.
 */
      get added_at(): $Field<"added_at", string>  {
       return this.$_select("added_at") as any
      }

      
/**
 * Custom options selected for the wish list item.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * The description of the item.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
/**
 * The unique ID for a `WishlistItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * An array containing information about the selected links.
 */
      links_v2<Sel extends Selection<DownloadableProductLinks>>(selectorFn: (s: DownloadableProductLinks) => [...Sel]):$Field<"links_v2", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new DownloadableProductLinks)
      };
      return this.$_select("links_v2", options as any) as any
    }
  

      
/**
 * Product details of the wish list item.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The quantity of this wish list item.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }

      
/**
 * An array containing information about the selected samples.
 */
      samples<Sel extends Selection<DownloadableProductSamples>>(selectorFn: (s: DownloadableProductSamples) => [...Sel]):$Field<"samples", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new DownloadableProductSamples)
      };
      return this.$_select("samples", options as any) as any
    }
  
}


/**
 * Contains a list of downloadable products.
 */
export class CustomerDownloadableProducts extends $Base<"CustomerDownloadableProducts"> {
  constructor() {
    super("CustomerDownloadableProducts")
  }

  
      
/**
 * An array of purchased downloadable items.
 */
      items<Sel extends Selection<CustomerDownloadableProduct>>(selectorFn: (s: CustomerDownloadableProduct) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerDownloadableProduct)
      };
      return this.$_select("items", options as any) as any
    }
  
}


/**
 * Contains details about a single downloadable product.
 */
export class CustomerDownloadableProduct extends $Base<"CustomerDownloadableProduct"> {
  constructor() {
    super("CustomerDownloadableProduct")
  }

  
      
/**
 * The date and time the purchase was made.
 */
      get date(): $Field<"date", string | null>  {
       return this.$_select("date") as any
      }

      
/**
 * The fully qualified URL to the download file.
 */
      get download_url(): $Field<"download_url", string | null>  {
       return this.$_select("download_url") as any
      }

      
/**
 * The unique ID assigned to the item.
 */
      get order_increment_id(): $Field<"order_increment_id", string | null>  {
       return this.$_select("order_increment_id") as any
      }

      
/**
 * The remaining number of times the customer can download the product.
 */
      get remaining_downloads(): $Field<"remaining_downloads", string | null>  {
       return this.$_select("remaining_downloads") as any
      }

      
/**
 * Indicates when the product becomes available for download. Options are `Pending` and `Invoiced`.
 */
      get status(): $Field<"status", string | null>  {
       return this.$_select("status") as any
      }
}


/**
 * Defines the bundle products to add to the cart.
 */
export type AddBundleProductsToCartInput = {
  cart_id: string,
cart_items: Readonly<Array<BundleProductCartItemInput | null>>
}
    


/**
 * Defines a single bundle product.
 */
export type BundleProductCartItemInput = {
  bundle_options: Readonly<Array<BundleOptionInput | null>>,
customizable_options?: Readonly<Array<CustomizableOptionInput | null>> | null,
data: CartItemInput
}
    


/**
 * Defines the input for a bundle option.
 */
export type BundleOptionInput = {
  id: number,
quantity: number,
value: Readonly<Array<string | null>>
}
    


/**
 * Contains details about the cart after adding bundle products.
 */
export class AddBundleProductsToCartOutput extends $Base<"AddBundleProductsToCartOutput"> {
  constructor() {
    super("AddBundleProductsToCartOutput")
  }

  
      
/**
 * The cart after adding products.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * An implementation for bundle product cart items.
 */
export class BundleCartItem extends $Base<"BundleCartItem"> {
  constructor() {
    super("BundleCartItem")
  }

  
      
/**
 * An array containing the bundle options the shopper selected.
 */
      bundle_options<Sel extends Selection<SelectedBundleOption>>(selectorFn: (s: SelectedBundleOption) => [...Sel]):$Field<"bundle_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedBundleOption)
      };
      return this.$_select("bundle_options", options as any) as any
    }
  

      
/**
 * An array containing the customizable options the shopper selected.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * Errors assigned to this quote item
 */
      errors<Sel extends Selection<CartItemError>>(selectorFn: (s: CartItemError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemError)
      };
      return this.$_select("errors", options as any) as any
    }
  

      
/**
 * The entered gift message for the cart item
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * True if requested quantity is less than available stock, false otherwise.
 */
      get is_available(): $Field<"is_available", boolean>  {
       return this.$_select("is_available") as any
      }

      
/**
 * Message to display when the product is not available with this selected option.
 */
      get not_available_message(): $Field<"not_available_message", string | null>  {
       return this.$_select("not_available_message") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<CartItemPrices>>(selectorFn: (s: CartItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * Details about an item in the cart.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
      get product_type(): $Field<"product_type", string>  {
       return this.$_select("product_type") as any
      }

      
/**
 * The quantity of this item in the cart.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The unique ID for a `CartItemInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains details about a selected bundle option.
 */
export class SelectedBundleOption extends $Base<"SelectedBundleOption"> {
  constructor() {
    super("SelectedBundleOption")
  }

  
      
      get id(): $Field<"id", number>  {
       return this.$_select("id") as any
      }

      
/**
 * The display name of the selected bundle product option.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The type of selected bundle product option.
 */
      get type(): $Field<"type", string>  {
       return this.$_select("type") as any
      }

      
/**
 * The unique ID for a `SelectedBundleOption` object
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An array of selected bundle option values.
 */
      values<Sel extends Selection<SelectedBundleOptionValue>>(selectorFn: (s: SelectedBundleOptionValue) => [...Sel]):$Field<"values", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedBundleOptionValue)
      };
      return this.$_select("values", options as any) as any
    }
  
}


/**
 * Contains details about a value for a selected bundle option.
 */
export class SelectedBundleOptionValue extends $Base<"SelectedBundleOptionValue"> {
  constructor() {
    super("SelectedBundleOptionValue")
  }

  
      
/**
 * Use `uid` instead
 */
      get id(): $Field<"id", number>  {
       return this.$_select("id") as any
      }

      
/**
 * The display name of the value for the selected bundle product option.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The original price of the value for the selected bundle product option.
 */
      original_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"original_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("original_price", options as any) as any
    }
  

      
/**
 * The price of the value for the selected bundle product option.
 */
      get price(): $Field<"price", number>  {
       return this.$_select("price") as any
      }

      
/**
 * The price of the value for the selected bundle product option.
 */
      priceV2<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"priceV2", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("priceV2", options as any) as any
    }
  

      
/**
 * The quantity of the value for the selected bundle product option.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The unique ID for a `SelectedBundleOptionValue` object
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Can be used to retrieve the main price details in case of bundle product
 */
export class PriceDetails extends $Base<"PriceDetails"> {
  constructor() {
    super("PriceDetails")
  }

  
      
/**
 * The percentage of discount applied to the main product price
 */
      get discount_percentage(): $Field<"discount_percentage", number | null>  {
       return this.$_select("discount_percentage") as any
      }

      
/**
 * The final price after applying the discount to the main product
 */
      get main_final_price(): $Field<"main_final_price", number | null>  {
       return this.$_select("main_final_price") as any
      }

      
/**
 * The regular price of the main product
 */
      get main_price(): $Field<"main_price", number | null>  {
       return this.$_select("main_price") as any
      }
}


/**
 * Defines an individual item within a bundle product.
 */
export class BundleItem extends $Base<"BundleItem"> {
  constructor() {
    super("BundleItem")
  }

  
      
/**
 * An ID assigned to each type of item in a bundle product.
 */
      get option_id(): $Field<"option_id", number | null>  {
       return this.$_select("option_id") as any
      }

      
/**
 * An array of additional options for this bundle item.
 */
      options<Sel extends Selection<BundleItemOption>>(selectorFn: (s: BundleItemOption) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new BundleItemOption)
      };
      return this.$_select("options", options as any) as any
    }
  

      
/**
 * A number indicating the sequence order of this item compared to the other bundle items.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * The range of prices for the product
 */
      price_range<Sel extends Selection<PriceRange>>(selectorFn: (s: PriceRange) => [...Sel]):$Field<"price_range", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceRange)
      };
      return this.$_select("price_range", options as any) as any
    }
  

      
/**
 * Indicates whether the item must be included in the bundle.
 */
      get required(): $Field<"required", boolean | null>  {
       return this.$_select("required") as any
      }

      
/**
 * The SKU of the bundle product.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The display name of the item.
 */
      get title(): $Field<"title", string | null>  {
       return this.$_select("title") as any
      }

      
/**
 * The input type that the customer uses to select the item. Examples include radio button and checkbox.
 */
      get type(): $Field<"type", string | null>  {
       return this.$_select("type") as any
      }

      
/**
 * The unique ID for a `BundleItem` object.
 */
      get uid(): $Field<"uid", string | null>  {
       return this.$_select("uid") as any
      }
}


/**
 * Defines the characteristics that comprise a specific bundle item and its options.
 */
export class BundleItemOption extends $Base<"BundleItemOption"> {
  constructor() {
    super("BundleItemOption")
  }

  
      
/**
 * Indicates whether the customer can change the number of items for this option.
 */
      get can_change_quantity(): $Field<"can_change_quantity", boolean | null>  {
       return this.$_select("can_change_quantity") as any
      }

      
/**
 * The ID assigned to the bundled item option.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * Indicates whether this option is the default option.
 */
      get is_default(): $Field<"is_default", boolean | null>  {
       return this.$_select("is_default") as any
      }

      
/**
 * The text that identifies the bundled item option.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * When a bundle item contains multiple options, the relative position of this option compared to the other options.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * The price of the selected option.
 */
      get price(): $Field<"price", number | null>  {
       return this.$_select("price") as any
      }

      
/**
 * One of FIXED, PERCENT, or DYNAMIC.
 */
      get price_type(): $Field<"price_type", PriceTypeEnum | null>  {
       return this.$_select("price_type") as any
      }

      
/**
 * Contains details about this product option.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * Indicates the quantity of this specific bundle item.
 */
      get qty(): $Field<"qty", number | null>  {
       return this.$_select("qty") as any
      }

      
/**
 * The quantity of this specific bundle item.
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The unique ID for a `BundleItemOption` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Defines basic features of a bundle product and contains multiple BundleItems.
 */
export class BundleProduct extends $Base<"BundleProduct"> {
  constructor() {
    super("BundleProduct")
  }

  
      
/**
 * The attribute set assigned to the product.
 */
      get attribute_set_id(): $Field<"attribute_set_id", number | null>  {
       return this.$_select("attribute_set_id") as any
      }

      
      get brand(): $Field<"brand", number | null>  {
       return this.$_select("brand") as any
      }

      
/**
 * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
 */
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
/**
 * The categories assigned to a product.
 */
      categories<Sel extends Selection<CategoryInterface>>(selectorFn: (s: CategoryInterface) => [...Sel]):$Field<"categories", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CategoryInterface)
      };
      return this.$_select("categories", options as any) as any
    }
  

      
      get color(): $Field<"color", number | null>  {
       return this.$_select("color") as any
      }

      
/**
 * The product's country of origin.
 */
      get country_of_manufacture(): $Field<"country_of_manufacture", string | null>  {
       return this.$_select("country_of_manufacture") as any
      }

      
/**
 * Timestamp indicating when the product was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
/**
 * Crosssell Products
 */
      crosssell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"crosssell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("crosssell_products", options as any) as any
    }
  

      
/**
 * Product custom attributes.
 */
      custom_attributesV2<Args extends VariabledInput<{
        filters?: AttributeFilterInput | null,
      }>,Sel extends Selection<ProductCustomAttributes>>(args: ExactArgNames<Args, {
        filters?: AttributeFilterInput | null,
      }>, selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
custom_attributesV2<Sel extends Selection<ProductCustomAttributes>>(selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel>>
custom_attributesV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filters: "AttributeFilterInput"
            },
        args,

        selection: selectorFn(new ProductCustomAttributes)
      };
      return this.$_select("custom_attributesV2", options as any) as any
    }
  

      
/**
 * Detailed information about the product. The value can include simple HTML tags.
 */
      description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("description", options as any) as any
    }
  

      
/**
 * Indicates whether the bundle product has a dynamic price.
 */
      get dynamic_price(): $Field<"dynamic_price", boolean | null>  {
       return this.$_select("dynamic_price") as any
      }

      
/**
 * Indicates whether the bundle product has a dynamic SKU.
 */
      get dynamic_sku(): $Field<"dynamic_sku", boolean | null>  {
       return this.$_select("dynamic_sku") as any
      }

      
/**
 * Indicates whether the bundle product has a dynamically calculated weight.
 */
      get dynamic_weight(): $Field<"dynamic_weight", boolean | null>  {
       return this.$_select("dynamic_weight") as any
      }

      
/**
 * Returns a value indicating gift message availability for the product.
 */
      get gift_message_available(): $Field<"gift_message_available", boolean>  {
       return this.$_select("gift_message_available") as any
      }

      
/**
 * The ID number assigned to the product.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The relative path to the main image on the product page.
 */
      image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("image", options as any) as any
    }
  

      
/**
 * An array containing information about individual bundle items.
 */
      items<Sel extends Selection<BundleItem>>(selectorFn: (s: BundleItem) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new BundleItem)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * A number representing the product's manufacturer.
 */
      get manufacturer(): $Field<"manufacturer", number | null>  {
       return this.$_select("manufacturer") as any
      }

      
/**
 * Maximum Qty Allowed in Shopping Cart
 */
      get max_sale_qty(): $Field<"max_sale_qty", number | null>  {
       return this.$_select("max_sale_qty") as any
      }

      
/**
 * An array of media gallery objects.
 */
      media_gallery<Sel extends Selection<MediaGalleryInterface>>(selectorFn: (s: MediaGalleryInterface) => [...Sel]):$Field<"media_gallery", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryInterface)
      };
      return this.$_select("media_gallery", options as any) as any
    }
  

      
/**
 * An array of MediaGalleryEntry objects.
 */
      media_gallery_entries<Sel extends Selection<MediaGalleryEntry>>(selectorFn: (s: MediaGalleryEntry) => [...Sel]):$Field<"media_gallery_entries", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryEntry)
      };
      return this.$_select("media_gallery_entries", options as any) as any
    }
  

      
/**
 * A brief overview of the product for search results listings, maximum 255 characters.
 */
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
/**
 * A comma-separated list of keywords that are visible only to search engines.
 */
      get meta_keyword(): $Field<"meta_keyword", string | null>  {
       return this.$_select("meta_keyword") as any
      }

      
/**
 * A string that is displayed in the title bar and tab of the browser and in search results lists.
 */
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * Minimum Qty Allowed in Shopping Cart
 */
      get min_sale_qty(): $Field<"min_sale_qty", number | null>  {
       return this.$_select("min_sale_qty") as any
      }

      
/**
 * The product name. Customers use this name to identify the product.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The beginning date for new product listings, and determines if the product is featured as a new product.
 */
      get new_from_date(): $Field<"new_from_date", string | null>  {
       return this.$_select("new_from_date") as any
      }

      
/**
 * The end date for new product listings.
 */
      get new_to_date(): $Field<"new_to_date", string | null>  {
       return this.$_select("new_to_date") as any
      }

      
/**
 * Product stock only x left count
 */
      get only_x_left_in_stock(): $Field<"only_x_left_in_stock", number | null>  {
       return this.$_select("only_x_left_in_stock") as any
      }

      
/**
 * An array of options for a customizable product.
 */
      options<Sel extends Selection<CustomizableOptionInterface>>(selectorFn: (s: CustomizableOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  

      
/**
 * If the product has multiple options, determines where they appear on the product page.
 */
      get options_container(): $Field<"options_container", string | null>  {
       return this.$_select("options_container") as any
      }

      
/**
 * Indicates the price of an item.
 */
      price<Sel extends Selection<ProductPrices>>(selectorFn: (s: ProductPrices) => [...Sel]):$Field<"price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductPrices)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The price details of the main product
 */
      price_details<Sel extends Selection<PriceDetails>>(selectorFn: (s: PriceDetails) => [...Sel]):$Field<"price_details", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceDetails)
      };
      return this.$_select("price_details", options as any) as any
    }
  

      
/**
 * The range of prices for the product
 */
      price_range<Sel extends Selection<PriceRange>>(selectorFn: (s: PriceRange) => [...Sel]):$Field<"price_range", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceRange)
      };
      return this.$_select("price_range", options as any) as any
    }
  

      
/**
 * An array of `TierPrice` objects.
 */
      price_tiers<Sel extends Selection<TierPrice>>(selectorFn: (s: TierPrice) => [...Sel]):$Field<"price_tiers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TierPrice)
      };
      return this.$_select("price_tiers", options as any) as any
    }
  

      
/**
 * One of PRICE_RANGE or AS_LOW_AS.
 */
      get price_view(): $Field<"price_view", PriceViewEnum | null>  {
       return this.$_select("price_view") as any
      }

      
/**
 * An array of `ProductLinks` objects.
 */
      product_links<Sel extends Selection<ProductLinksInterface>>(selectorFn: (s: ProductLinksInterface) => [...Sel]):$Field<"product_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductLinksInterface)
      };
      return this.$_select("product_links", options as any) as any
    }
  

      
/**
 * Amount of available stock
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The average of all the ratings given to the product.
 */
      get rating_summary(): $Field<"rating_summary", number>  {
       return this.$_select("rating_summary") as any
      }

      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * An array of products to be displayed in a Related Products block.
 */
      related_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"related_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("related_products", options as any) as any
    }
  

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * The total count of all the reviews given to the product.
 */
      get review_count(): $Field<"review_count", number>  {
       return this.$_select("review_count") as any
      }

      
/**
 * The list of products reviews.
 */
      reviews<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<ProductReviews>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel, Args>>
reviews<Sel extends Selection<ProductReviews>>(selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel>>
reviews(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new ProductReviews)
      };
      return this.$_select("reviews", options as any) as any
    }
  

      
/**
 * Indicates whether to ship bundle items together or individually.
 */
      get ship_bundle_items(): $Field<"ship_bundle_items", ShipBundleItemsEnum | null>  {
       return this.$_select("ship_bundle_items") as any
      }

      
/**
 * A short description of the product. Its use depends on the theme.
 */
      short_description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"short_description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("short_description", options as any) as any
    }
  

      
/**
 * A number or code assigned to a product to identify the product, options, price, and manufacturer.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The relative path to the small image, which is used on catalog pages.
 */
      small_image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"small_image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("small_image", options as any) as any
    }
  

      
/**
 * The beginning date that a product has a special price.
 */
      get special_from_date(): $Field<"special_from_date", string | null>  {
       return this.$_select("special_from_date") as any
      }

      
/**
 * The discounted price of the product.
 */
      get special_price(): $Field<"special_price", number | null>  {
       return this.$_select("special_price") as any
      }

      
/**
 * The end date for a product with a special price.
 */
      get special_to_date(): $Field<"special_to_date", string | null>  {
       return this.$_select("special_to_date") as any
      }

      
/**
 * The status assigned to the product, 0 for disabled, 1 for enabled.
 */
      get status(): $Field<"status", number | null>  {
       return this.$_select("status") as any
      }

      
/**
 * Stock status of the product
 */
      get stock_status(): $Field<"stock_status", ProductStockStatus | null>  {
       return this.$_select("stock_status") as any
      }

      
/**
 * The file name of a swatch image.
 */
      get swatch_image(): $Field<"swatch_image", string | null>  {
       return this.$_select("swatch_image") as any
      }

      
/**
 * The relative path to the product's thumbnail image.
 */
      thumbnail<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"thumbnail", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("thumbnail", options as any) as any
    }
  

      
/**
 * The price when tier pricing is in effect and the items purchased threshold has been reached.
 */
      get tier_price(): $Field<"tier_price", number | null>  {
       return this.$_select("tier_price") as any
      }

      
/**
 * An array of ProductTierPrices objects.
 */
      tier_prices<Sel extends Selection<ProductTierPrices>>(selectorFn: (s: ProductTierPrices) => [...Sel]):$Field<"tier_prices", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductTierPrices)
      };
      return this.$_select("tier_prices", options as any) as any
    }
  

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }

      
/**
 * One of simple, virtual, bundle, downloadable, grouped, or configurable.
 */
      get type_id(): $Field<"type_id", string | null>  {
       return this.$_select("type_id") as any
      }

      
/**
 * The unique ID for a `ProductInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * Timestamp indicating when the product was updated.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }

      
/**
 * Upsell Products
 */
      upsell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"upsell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("upsell_products", options as any) as any
    }
  

      
/**
 * The part of the URL that identifies the product
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }

      
      get url_path(): $Field<"url_path", string | null>  {
       return this.$_select("url_path") as any
      }

      
/**
 * URL rewrites list
 */
      url_rewrites<Sel extends Selection<UrlRewrite>>(selectorFn: (s: UrlRewrite) => [...Sel]):$Field<"url_rewrites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new UrlRewrite)
      };
      return this.$_select("url_rewrites", options as any) as any
    }
  

      
/**
 * The part of the product URL that is appended after the url key
 */
      get url_suffix(): $Field<"url_suffix", string | null>  {
       return this.$_select("url_suffix") as any
      }

      
/**
 * The visibility assigned to the product.
 */
      get visibility(): $Field<"visibility", number | null>  {
       return this.$_select("visibility") as any
      }

      
/**
 * An array of websites in which the product is available.
 */
      websites<Sel extends Selection<Website>>(selectorFn: (s: Website) => [...Sel]):$Field<"websites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Website)
      };
      return this.$_select("websites", options as any) as any
    }
  

      
/**
 * The weight of the item, in units defined by the store.
 */
      get weight(): $Field<"weight", number | null>  {
       return this.$_select("weight") as any
      }
}

  
/**
 * Defines whether a bundle product's price is displayed as the lowest possible value or as a range.
 */
export enum PriceViewEnum {
  
  PRICE_RANGE = "PRICE_RANGE",

  AS_LOW_AS = "AS_LOW_AS"
}
  

  
/**
 * Defines whether bundle items must be shipped together.
 */
export enum ShipBundleItemsEnum {
  
  TOGETHER = "TOGETHER",

  SEPARATELY = "SEPARATELY"
}
  


/**
 * Defines bundle product options for `OrderItemInterface`.
 */
export class BundleOrderItem extends $Base<"BundleOrderItem"> {
  constructor() {
    super("BundleOrderItem")
  }

  
      
/**
 * A list of bundle options that are assigned to the bundle product.
 */
      bundle_options<Sel extends Selection<ItemSelectedBundleOption>>(selectorFn: (s: ItemSelectedBundleOption) => [...Sel]):$Field<"bundle_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ItemSelectedBundleOption)
      };
      return this.$_select("bundle_options", options as any) as any
    }
  

      
/**
 * The final discount information for the product.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The entered option for the base product, such as a logo or image.
 */
      entered_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"entered_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("entered_options", options as any) as any
    }
  

      
/**
 * The selected gift message for the order item
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
/**
 * The unique ID for an `OrderItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The SKU of parent product.
 */
      get parent_sku(): $Field<"parent_sku", string | null>  {
       return this.$_select("parent_sku") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<OrderItemPrices>>(selectorFn: (s: OrderItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * The ProductInterface object, which contains details about the base product
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price of the base product, including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The type of product, such as simple, configurable, etc.
 */
      get product_type(): $Field<"product_type", string | null>  {
       return this.$_select("product_type") as any
      }

      
/**
 * URL key of the base product.
 */
      get product_url_key(): $Field<"product_url_key", string | null>  {
       return this.$_select("product_url_key") as any
      }

      
/**
 * The number of canceled items.
 */
      get quantity_canceled(): $Field<"quantity_canceled", number | null>  {
       return this.$_select("quantity_canceled") as any
      }

      
/**
 * The number of invoiced items.
 */
      get quantity_invoiced(): $Field<"quantity_invoiced", number | null>  {
       return this.$_select("quantity_invoiced") as any
      }

      
/**
 * The number of units ordered for this item.
 */
      get quantity_ordered(): $Field<"quantity_ordered", number | null>  {
       return this.$_select("quantity_ordered") as any
      }

      
/**
 * The number of refunded items.
 */
      get quantity_refunded(): $Field<"quantity_refunded", number | null>  {
       return this.$_select("quantity_refunded") as any
      }

      
/**
 * The number of returned items.
 */
      get quantity_returned(): $Field<"quantity_returned", number | null>  {
       return this.$_select("quantity_returned") as any
      }

      
/**
 * The number of shipped items.
 */
      get quantity_shipped(): $Field<"quantity_shipped", number | null>  {
       return this.$_select("quantity_shipped") as any
      }

      
/**
 * The selected options for the base product, such as color or size.
 */
      selected_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"selected_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("selected_options", options as any) as any
    }
  

      
/**
 * The status of the order item.
 */
      get status(): $Field<"status", string | null>  {
       return this.$_select("status") as any
      }
}


/**
 * Defines bundle product options for `InvoiceItemInterface`.
 */
export class BundleInvoiceItem extends $Base<"BundleInvoiceItem"> {
  constructor() {
    super("BundleInvoiceItem")
  }

  
      
/**
 * A list of bundle options that are assigned to an invoiced bundle product.
 */
      bundle_options<Sel extends Selection<ItemSelectedBundleOption>>(selectorFn: (s: ItemSelectedBundleOption) => [...Sel]):$Field<"bundle_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ItemSelectedBundleOption)
      };
      return this.$_select("bundle_options", options as any) as any
    }
  

      
/**
 * Information about the final discount amount for the base product, including discounts on options.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The unique ID for an `InvoiceItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Details about an individual order item.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of invoiced items.
 */
      get quantity_invoiced(): $Field<"quantity_invoiced", number | null>  {
       return this.$_select("quantity_invoiced") as any
      }
}


/**
 * Defines bundle product options for `ShipmentItemInterface`.
 */
export class BundleShipmentItem extends $Base<"BundleShipmentItem"> {
  constructor() {
    super("BundleShipmentItem")
  }

  
      
/**
 * A list of bundle options that are assigned to a shipped product.
 */
      bundle_options<Sel extends Selection<ItemSelectedBundleOption>>(selectorFn: (s: ItemSelectedBundleOption) => [...Sel]):$Field<"bundle_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ItemSelectedBundleOption)
      };
      return this.$_select("bundle_options", options as any) as any
    }
  

      
/**
 * The unique ID for a `ShipmentItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The order item associated with the shipment item.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of shipped items.
 */
      get quantity_shipped(): $Field<"quantity_shipped", number>  {
       return this.$_select("quantity_shipped") as any
      }
}


/**
 * Defines bundle product options for `CreditMemoItemInterface`.
 */
export class BundleCreditMemoItem extends $Base<"BundleCreditMemoItem"> {
  constructor() {
    super("BundleCreditMemoItem")
  }

  
      
/**
 * A list of bundle options that are assigned to a bundle product that is part of a credit memo.
 */
      bundle_options<Sel extends Selection<ItemSelectedBundleOption>>(selectorFn: (s: ItemSelectedBundleOption) => [...Sel]):$Field<"bundle_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ItemSelectedBundleOption)
      };
      return this.$_select("bundle_options", options as any) as any
    }
  

      
/**
 * Details about the final discount amount for the base product, including discounts on options.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The unique ID for a `CreditMemoItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The order item the credit memo is applied to.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product, including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of refunded items.
 */
      get quantity_refunded(): $Field<"quantity_refunded", number | null>  {
       return this.$_select("quantity_refunded") as any
      }
}


/**
 * A list of options of the selected bundle product.
 */
export class ItemSelectedBundleOption extends $Base<"ItemSelectedBundleOption"> {
  constructor() {
    super("ItemSelectedBundleOption")
  }

  
      
/**
 * The unique ID for a `ItemSelectedBundleOption` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The label of the option.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The unique ID for a `ItemSelectedBundleOption` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * A list of products that represent the values of the parent option.
 */
      values<Sel extends Selection<ItemSelectedBundleOptionValue>>(selectorFn: (s: ItemSelectedBundleOptionValue) => [...Sel]):$Field<"values", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ItemSelectedBundleOptionValue)
      };
      return this.$_select("values", options as any) as any
    }
  
}


/**
 * A list of values for the selected bundle product.
 */
export class ItemSelectedBundleOptionValue extends $Base<"ItemSelectedBundleOptionValue"> {
  constructor() {
    super("ItemSelectedBundleOptionValue")
  }

  
      
/**
 * The unique ID for a `ItemSelectedBundleOptionValue` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The price of the child bundle product.
 */
      price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The name of the child bundle product.
 */
      get product_name(): $Field<"product_name", string>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The SKU of the child bundle product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of this bundle product that were ordered.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The unique ID for a `ItemSelectedBundleOptionValue` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Defines bundle product options for `WishlistItemInterface`.
 */
export class BundleWishlistItem extends $Base<"BundleWishlistItem"> {
  constructor() {
    super("BundleWishlistItem")
  }

  
      
/**
 * The date and time the item was added to the wish list.
 */
      get added_at(): $Field<"added_at", string>  {
       return this.$_select("added_at") as any
      }

      
/**
 * An array containing information about the selected bundle items.
 */
      bundle_options<Sel extends Selection<SelectedBundleOption>>(selectorFn: (s: SelectedBundleOption) => [...Sel]):$Field<"bundle_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedBundleOption)
      };
      return this.$_select("bundle_options", options as any) as any
    }
  

      
/**
 * Custom options selected for the wish list item.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * The description of the item.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
/**
 * The unique ID for a `WishlistItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Product details of the wish list item.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The quantity of this wish list item.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }
}


/**
 * An implementation for configurable product cart items.
 */
export class ConfigurableCartItem extends $Base<"ConfigurableCartItem"> {
  constructor() {
    super("ConfigurableCartItem")
  }

  
      
/**
 * An array containing the configuranle options the shopper selected.
 */
      configurable_options<Sel extends Selection<SelectedConfigurableOption>>(selectorFn: (s: SelectedConfigurableOption) => [...Sel]):$Field<"configurable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedConfigurableOption)
      };
      return this.$_select("configurable_options", options as any) as any
    }
  

      
/**
 * Product details of the cart item.
 */
      configured_variant<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"configured_variant", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("configured_variant", options as any) as any
    }
  

      
/**
 * An array containing the customizable options the shopper selected.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * Errors assigned to this quote item
 */
      errors<Sel extends Selection<CartItemError>>(selectorFn: (s: CartItemError) => [...Sel]):$Field<"errors", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemError)
      };
      return this.$_select("errors", options as any) as any
    }
  

      
/**
 * The entered gift message for the cart item
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * True if requested quantity is less than available stock, false otherwise.
 */
      get is_available(): $Field<"is_available", boolean>  {
       return this.$_select("is_available") as any
      }

      
/**
 * Message to display when the product is not available with this selected option.
 */
      get not_available_message(): $Field<"not_available_message", string | null>  {
       return this.$_select("not_available_message") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<CartItemPrices>>(selectorFn: (s: CartItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CartItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * Details about an item in the cart.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
      get product_type(): $Field<"product_type", string>  {
       return this.$_select("product_type") as any
      }

      
/**
 * The quantity of this item in the cart.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The unique ID for a `CartItemInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains the text of a gift message, its sender, and recipient
 */
export class GiftMessage extends $Base<"GiftMessage"> {
  constructor() {
    super("GiftMessage")
  }

  
      
/**
 * Sender name
 */
      get from(): $Field<"from", string>  {
       return this.$_select("from") as any
      }

      
/**
 * Gift message text
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }

      
/**
 * Recipient name
 */
      get to(): $Field<"to", string>  {
       return this.$_select("to") as any
      }
}


/**
 * Contains the text of a gift message, its sender, and recipient
 */
export type GiftMessageInput = {
  from: string,
message: string,
to: string
}
    


export class SalesItemInterface extends $Base<"SalesItemInterface"> {
  constructor() {
    super("SalesItemInterface")
  }

  
      
/**
 * The entered gift message for the order item
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  
}


/**
 * Contains details about each of the customer's orders.
 */
export class CustomerOrder extends $Base<"CustomerOrder"> {
  constructor() {
    super("CustomerOrder")
  }

  
      
/**
 * Coupons applied to the order.
 */
      applied_coupons<Sel extends Selection<AppliedCoupon>>(selectorFn: (s: AppliedCoupon) => [...Sel]):$Field<"applied_coupons", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new AppliedCoupon)
      };
      return this.$_select("applied_coupons", options as any) as any
    }
  

      
/**
 * List of available order actions.
 */
      get available_actions(): $Field<"available_actions", Readonly<Array<OrderActionType | null>>>  {
       return this.$_select("available_actions") as any
      }

      
/**
 * The billing address for the order.
 */
      billing_address<Sel extends Selection<OrderAddress>>(selectorFn: (s: OrderAddress) => [...Sel]):$Field<"billing_address", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderAddress)
      };
      return this.$_select("billing_address", options as any) as any
    }
  

      
/**
 * The shipping carrier for the order delivery.
 */
      get carrier(): $Field<"carrier", string | null>  {
       return this.$_select("carrier") as any
      }

      
/**
 * Comments about the order.
 */
      comments<Sel extends Selection<SalesCommentItem>>(selectorFn: (s: SalesCommentItem) => [...Sel]):$Field<"comments", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SalesCommentItem)
      };
      return this.$_select("comments", options as any) as any
    }
  

      
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
/**
 * A list of credit memos.
 */
      credit_memos<Sel extends Selection<CreditMemo>>(selectorFn: (s: CreditMemo) => [...Sel]):$Field<"credit_memos", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CreditMemo)
      };
      return this.$_select("credit_memos", options as any) as any
    }
  

      
/**
 * Returns customer information from order.
 */
      customer_info<Sel extends Selection<OrderCustomerInfo>>(selectorFn: (s: OrderCustomerInfo) => [...Sel]):$Field<"customer_info", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderCustomerInfo)
      };
      return this.$_select("customer_info", options as any) as any
    }
  

      
/**
 * Order customer email.
 */
      get email(): $Field<"email", string | null>  {
       return this.$_select("email") as any
      }

      
/**
 * The entered gift message for the order
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
      get grand_total(): $Field<"grand_total", number | null>  {
       return this.$_select("grand_total") as any
      }

      
/**
 * The unique ID for a `CustomerOrder` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
      get increment_id(): $Field<"increment_id", string | null>  {
       return this.$_select("increment_id") as any
      }

      
/**
 * A list of invoices for the order.
 */
      invoices<Sel extends Selection<Invoice>>(selectorFn: (s: Invoice) => [...Sel]):$Field<"invoices", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Invoice)
      };
      return this.$_select("invoices", options as any) as any
    }
  

      
/**
 * `TRUE` if the order is virtual
 */
      get is_virtual(): $Field<"is_virtual", boolean>  {
       return this.$_select("is_virtual") as any
      }

      
/**
 * An array containing the items purchased in this order.
 */
      items<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * The order number.
 */
      get number(): $Field<"number", string>  {
       return this.$_select("number") as any
      }

      
/**
 * The date the order was placed.
 */
      get order_date(): $Field<"order_date", string>  {
       return this.$_select("order_date") as any
      }

      
      get order_number(): $Field<"order_number", string>  {
       return this.$_select("order_number") as any
      }

      
/**
 * The date the order status was last updated.
 */
      get order_status_change_date(): $Field<"order_status_change_date", string>  {
       return this.$_select("order_status_change_date") as any
      }

      
/**
 * Payment details for the order.
 */
      payment_methods<Sel extends Selection<OrderPaymentMethod>>(selectorFn: (s: OrderPaymentMethod) => [...Sel]):$Field<"payment_methods", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderPaymentMethod)
      };
      return this.$_select("payment_methods", options as any) as any
    }
  

      
/**
 * A list of shipments for the order.
 */
      shipments<Sel extends Selection<OrderShipment>>(selectorFn: (s: OrderShipment) => [...Sel]):$Field<"shipments", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderShipment)
      };
      return this.$_select("shipments", options as any) as any
    }
  

      
/**
 * The shipping address for the order.
 */
      shipping_address<Sel extends Selection<OrderAddress>>(selectorFn: (s: OrderAddress) => [...Sel]):$Field<"shipping_address", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderAddress)
      };
      return this.$_select("shipping_address", options as any) as any
    }
  

      
/**
 * The delivery method for the order.
 */
      get shipping_method(): $Field<"shipping_method", string | null>  {
       return this.$_select("shipping_method") as any
      }

      
/**
 * The current status of the order.
 */
      get status(): $Field<"status", string>  {
       return this.$_select("status") as any
      }

      
/**
 * The token that can be used to retrieve the order using order query.
 */
      get token(): $Field<"token", string>  {
       return this.$_select("token") as any
      }

      
/**
 * Details about the calculated totals for this order.
 */
      total<Sel extends Selection<OrderTotal>>(selectorFn: (s: OrderTotal) => [...Sel]):$Field<"total", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderTotal)
      };
      return this.$_select("total", options as any) as any
    }
  
}


/**
 * Order item details.
 */
export class OrderItemInterface extends $Interface<{DownloadableOrderItem: DownloadableOrderItem,BundleOrderItem: BundleOrderItem,ConfigurableOrderItem: ConfigurableOrderItem,OrderItem: OrderItem}, "OrderItemInterface"> {
  constructor() {
    super({DownloadableOrderItem: DownloadableOrderItem,BundleOrderItem: BundleOrderItem,ConfigurableOrderItem: ConfigurableOrderItem,OrderItem: OrderItem}, "OrderItemInterface")
  }
  
      
/**
 * The final discount information for the product.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The entered option for the base product, such as a logo or image.
 */
      entered_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"entered_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("entered_options", options as any) as any
    }
  

      
/**
 * The selected gift message for the order item
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
/**
 * The unique ID for an `OrderItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<OrderItemPrices>>(selectorFn: (s: OrderItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * The ProductInterface object, which contains details about the base product
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price of the base product, including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The type of product, such as simple, configurable, etc.
 */
      get product_type(): $Field<"product_type", string | null>  {
       return this.$_select("product_type") as any
      }

      
/**
 * URL key of the base product.
 */
      get product_url_key(): $Field<"product_url_key", string | null>  {
       return this.$_select("product_url_key") as any
      }

      
/**
 * The number of canceled items.
 */
      get quantity_canceled(): $Field<"quantity_canceled", number | null>  {
       return this.$_select("quantity_canceled") as any
      }

      
/**
 * The number of invoiced items.
 */
      get quantity_invoiced(): $Field<"quantity_invoiced", number | null>  {
       return this.$_select("quantity_invoiced") as any
      }

      
/**
 * The number of units ordered for this item.
 */
      get quantity_ordered(): $Field<"quantity_ordered", number | null>  {
       return this.$_select("quantity_ordered") as any
      }

      
/**
 * The number of refunded items.
 */
      get quantity_refunded(): $Field<"quantity_refunded", number | null>  {
       return this.$_select("quantity_refunded") as any
      }

      
/**
 * The number of returned items.
 */
      get quantity_returned(): $Field<"quantity_returned", number | null>  {
       return this.$_select("quantity_returned") as any
      }

      
/**
 * The number of shipped items.
 */
      get quantity_shipped(): $Field<"quantity_shipped", number | null>  {
       return this.$_select("quantity_shipped") as any
      }

      
/**
 * The selected options for the base product, such as color or size.
 */
      selected_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"selected_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("selected_options", options as any) as any
    }
  

      
/**
 * The status of the order item.
 */
      get status(): $Field<"status", string | null>  {
       return this.$_select("status") as any
      }
}


/**
 * Contains the `uid`, `relative_url`, and `type` attributes.
 */
export class EntityUrl extends $Base<"EntityUrl"> {
  constructor() {
    super("EntityUrl")
  }

  
      
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
/**
 * The unique ID for a `ProductInterface`, `CategoryInterface`, `CmsPage`, or similar object associated with the specified URL. This could be a product, category, or CMS page UID.
 */
      get entity_uid(): $Field<"entity_uid", string | null>  {
       return this.$_select("entity_uid") as any
      }

      
/**
 * The ID assigned to the object associated with the specified url. This could be a product ID, category ID, or page ID.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirectCode(): $Field<"redirectCode", number | null>  {
       return this.$_select("redirectCode") as any
      }

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }
}


/**
 * Contains URL rewrite details.
 */
export class UrlRewrite extends $Base<"UrlRewrite"> {
  constructor() {
    super("UrlRewrite")
  }

  
      
/**
 * An array of request parameters.
 */
      parameters<Sel extends Selection<HttpQueryParameter>>(selectorFn: (s: HttpQueryParameter) => [...Sel]):$Field<"parameters", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new HttpQueryParameter)
      };
      return this.$_select("parameters", options as any) as any
    }
  

      
/**
 * The request URL.
 */
      get url(): $Field<"url", string | null>  {
       return this.$_select("url") as any
      }
}


/**
 * Contains target path parameters.
 */
export class HttpQueryParameter extends $Base<"HttpQueryParameter"> {
  constructor() {
    super("HttpQueryParameter")
  }

  
      
/**
 * A parameter name.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * A parameter value.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}


/**
 * Default implementation of RoutableInterface. This type is returned when the URL is not linked to an entity.
 */
export class RoutableUrl extends $Base<"RoutableUrl"> {
  constructor() {
    super("RoutableUrl")
  }

  
      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }
}


/**
 * Routable entities serve as the model for a rendered page.
 */
export class RoutableInterface extends $Interface<{CmsPage: CmsPage,CategoryTree: CategoryTree,VirtualProduct: VirtualProduct,SimpleProduct: SimpleProduct,DownloadableProduct: DownloadableProduct,BundleProduct: BundleProduct,RoutableUrl: RoutableUrl,GroupedProduct: GroupedProduct,ConfigurableProduct: ConfigurableProduct}, "RoutableInterface"> {
  constructor() {
    super({CmsPage: CmsPage,CategoryTree: CategoryTree,VirtualProduct: VirtualProduct,SimpleProduct: SimpleProduct,DownloadableProduct: DownloadableProduct,BundleProduct: BundleProduct,RoutableUrl: RoutableUrl,GroupedProduct: GroupedProduct,ConfigurableProduct: ConfigurableProduct}, "RoutableInterface")
  }
  
      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }
}


/**
 * Defines a grouped product, which consists of simple standalone products that are presented as a group.
 */
export class GroupedProduct extends $Base<"GroupedProduct"> {
  constructor() {
    super("GroupedProduct")
  }

  
      
/**
 * The attribute set assigned to the product.
 */
      get attribute_set_id(): $Field<"attribute_set_id", number | null>  {
       return this.$_select("attribute_set_id") as any
      }

      
      get brand(): $Field<"brand", number | null>  {
       return this.$_select("brand") as any
      }

      
/**
 * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
 */
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
/**
 * The categories assigned to a product.
 */
      categories<Sel extends Selection<CategoryInterface>>(selectorFn: (s: CategoryInterface) => [...Sel]):$Field<"categories", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CategoryInterface)
      };
      return this.$_select("categories", options as any) as any
    }
  

      
      get color(): $Field<"color", number | null>  {
       return this.$_select("color") as any
      }

      
/**
 * The product's country of origin.
 */
      get country_of_manufacture(): $Field<"country_of_manufacture", string | null>  {
       return this.$_select("country_of_manufacture") as any
      }

      
/**
 * Timestamp indicating when the product was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
/**
 * Crosssell Products
 */
      crosssell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"crosssell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("crosssell_products", options as any) as any
    }
  

      
/**
 * Product custom attributes.
 */
      custom_attributesV2<Args extends VariabledInput<{
        filters?: AttributeFilterInput | null,
      }>,Sel extends Selection<ProductCustomAttributes>>(args: ExactArgNames<Args, {
        filters?: AttributeFilterInput | null,
      }>, selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
custom_attributesV2<Sel extends Selection<ProductCustomAttributes>>(selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel>>
custom_attributesV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filters: "AttributeFilterInput"
            },
        args,

        selection: selectorFn(new ProductCustomAttributes)
      };
      return this.$_select("custom_attributesV2", options as any) as any
    }
  

      
/**
 * Detailed information about the product. The value can include simple HTML tags.
 */
      description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("description", options as any) as any
    }
  

      
/**
 * Returns a value indicating gift message availability for the product.
 */
      get gift_message_available(): $Field<"gift_message_available", boolean>  {
       return this.$_select("gift_message_available") as any
      }

      
/**
 * The ID number assigned to the product.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The relative path to the main image on the product page.
 */
      image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("image", options as any) as any
    }
  

      
/**
 * An array containing grouped product items.
 */
      items<Sel extends Selection<GroupedProductItem>>(selectorFn: (s: GroupedProductItem) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GroupedProductItem)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * A number representing the product's manufacturer.
 */
      get manufacturer(): $Field<"manufacturer", number | null>  {
       return this.$_select("manufacturer") as any
      }

      
/**
 * Maximum Qty Allowed in Shopping Cart
 */
      get max_sale_qty(): $Field<"max_sale_qty", number | null>  {
       return this.$_select("max_sale_qty") as any
      }

      
/**
 * An array of media gallery objects.
 */
      media_gallery<Sel extends Selection<MediaGalleryInterface>>(selectorFn: (s: MediaGalleryInterface) => [...Sel]):$Field<"media_gallery", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryInterface)
      };
      return this.$_select("media_gallery", options as any) as any
    }
  

      
/**
 * An array of MediaGalleryEntry objects.
 */
      media_gallery_entries<Sel extends Selection<MediaGalleryEntry>>(selectorFn: (s: MediaGalleryEntry) => [...Sel]):$Field<"media_gallery_entries", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryEntry)
      };
      return this.$_select("media_gallery_entries", options as any) as any
    }
  

      
/**
 * A brief overview of the product for search results listings, maximum 255 characters.
 */
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
/**
 * A comma-separated list of keywords that are visible only to search engines.
 */
      get meta_keyword(): $Field<"meta_keyword", string | null>  {
       return this.$_select("meta_keyword") as any
      }

      
/**
 * A string that is displayed in the title bar and tab of the browser and in search results lists.
 */
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * Minimum Qty Allowed in Shopping Cart
 */
      get min_sale_qty(): $Field<"min_sale_qty", number | null>  {
       return this.$_select("min_sale_qty") as any
      }

      
/**
 * The product name. Customers use this name to identify the product.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The beginning date for new product listings, and determines if the product is featured as a new product.
 */
      get new_from_date(): $Field<"new_from_date", string | null>  {
       return this.$_select("new_from_date") as any
      }

      
/**
 * The end date for new product listings.
 */
      get new_to_date(): $Field<"new_to_date", string | null>  {
       return this.$_select("new_to_date") as any
      }

      
/**
 * Product stock only x left count
 */
      get only_x_left_in_stock(): $Field<"only_x_left_in_stock", number | null>  {
       return this.$_select("only_x_left_in_stock") as any
      }

      
/**
 * If the product has multiple options, determines where they appear on the product page.
 */
      get options_container(): $Field<"options_container", string | null>  {
       return this.$_select("options_container") as any
      }

      
/**
 * Indicates the price of an item.
 */
      price<Sel extends Selection<ProductPrices>>(selectorFn: (s: ProductPrices) => [...Sel]):$Field<"price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductPrices)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The range of prices for the product
 */
      price_range<Sel extends Selection<PriceRange>>(selectorFn: (s: PriceRange) => [...Sel]):$Field<"price_range", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceRange)
      };
      return this.$_select("price_range", options as any) as any
    }
  

      
/**
 * An array of `TierPrice` objects.
 */
      price_tiers<Sel extends Selection<TierPrice>>(selectorFn: (s: TierPrice) => [...Sel]):$Field<"price_tiers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TierPrice)
      };
      return this.$_select("price_tiers", options as any) as any
    }
  

      
/**
 * An array of `ProductLinks` objects.
 */
      product_links<Sel extends Selection<ProductLinksInterface>>(selectorFn: (s: ProductLinksInterface) => [...Sel]):$Field<"product_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductLinksInterface)
      };
      return this.$_select("product_links", options as any) as any
    }
  

      
/**
 * Amount of available stock
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The average of all the ratings given to the product.
 */
      get rating_summary(): $Field<"rating_summary", number>  {
       return this.$_select("rating_summary") as any
      }

      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * An array of products to be displayed in a Related Products block.
 */
      related_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"related_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("related_products", options as any) as any
    }
  

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * The total count of all the reviews given to the product.
 */
      get review_count(): $Field<"review_count", number>  {
       return this.$_select("review_count") as any
      }

      
/**
 * The list of products reviews.
 */
      reviews<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<ProductReviews>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel, Args>>
reviews<Sel extends Selection<ProductReviews>>(selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel>>
reviews(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new ProductReviews)
      };
      return this.$_select("reviews", options as any) as any
    }
  

      
/**
 * A short description of the product. Its use depends on the theme.
 */
      short_description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"short_description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("short_description", options as any) as any
    }
  

      
/**
 * A number or code assigned to a product to identify the product, options, price, and manufacturer.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The relative path to the small image, which is used on catalog pages.
 */
      small_image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"small_image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("small_image", options as any) as any
    }
  

      
/**
 * The beginning date that a product has a special price.
 */
      get special_from_date(): $Field<"special_from_date", string | null>  {
       return this.$_select("special_from_date") as any
      }

      
/**
 * The discounted price of the product.
 */
      get special_price(): $Field<"special_price", number | null>  {
       return this.$_select("special_price") as any
      }

      
/**
 * The end date for a product with a special price.
 */
      get special_to_date(): $Field<"special_to_date", string | null>  {
       return this.$_select("special_to_date") as any
      }

      
/**
 * The status assigned to the product, 0 for disabled, 1 for enabled.
 */
      get status(): $Field<"status", number | null>  {
       return this.$_select("status") as any
      }

      
/**
 * Stock status of the product
 */
      get stock_status(): $Field<"stock_status", ProductStockStatus | null>  {
       return this.$_select("stock_status") as any
      }

      
/**
 * The file name of a swatch image.
 */
      get swatch_image(): $Field<"swatch_image", string | null>  {
       return this.$_select("swatch_image") as any
      }

      
/**
 * The relative path to the product's thumbnail image.
 */
      thumbnail<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"thumbnail", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("thumbnail", options as any) as any
    }
  

      
/**
 * The price when tier pricing is in effect and the items purchased threshold has been reached.
 */
      get tier_price(): $Field<"tier_price", number | null>  {
       return this.$_select("tier_price") as any
      }

      
/**
 * An array of ProductTierPrices objects.
 */
      tier_prices<Sel extends Selection<ProductTierPrices>>(selectorFn: (s: ProductTierPrices) => [...Sel]):$Field<"tier_prices", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductTierPrices)
      };
      return this.$_select("tier_prices", options as any) as any
    }
  

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }

      
/**
 * One of simple, virtual, bundle, downloadable, grouped, or configurable.
 */
      get type_id(): $Field<"type_id", string | null>  {
       return this.$_select("type_id") as any
      }

      
/**
 * The unique ID for a `ProductInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * Timestamp indicating when the product was updated.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }

      
/**
 * Upsell Products
 */
      upsell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"upsell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("upsell_products", options as any) as any
    }
  

      
/**
 * The part of the URL that identifies the product
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }

      
      get url_path(): $Field<"url_path", string | null>  {
       return this.$_select("url_path") as any
      }

      
/**
 * URL rewrites list
 */
      url_rewrites<Sel extends Selection<UrlRewrite>>(selectorFn: (s: UrlRewrite) => [...Sel]):$Field<"url_rewrites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new UrlRewrite)
      };
      return this.$_select("url_rewrites", options as any) as any
    }
  

      
/**
 * The part of the product URL that is appended after the url key
 */
      get url_suffix(): $Field<"url_suffix", string | null>  {
       return this.$_select("url_suffix") as any
      }

      
/**
 * The visibility assigned to the product.
 */
      get visibility(): $Field<"visibility", number | null>  {
       return this.$_select("visibility") as any
      }

      
/**
 * An array of websites in which the product is available.
 */
      websites<Sel extends Selection<Website>>(selectorFn: (s: Website) => [...Sel]):$Field<"websites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Website)
      };
      return this.$_select("websites", options as any) as any
    }
  

      
/**
 * The weight of the item, in units defined by the store.
 */
      get weight(): $Field<"weight", number | null>  {
       return this.$_select("weight") as any
      }
}


/**
 * Contains information about an individual grouped product item.
 */
export class GroupedProductItem extends $Base<"GroupedProductItem"> {
  constructor() {
    super("GroupedProductItem")
  }

  
      
/**
 * The relative position of this item compared to the other group items.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * Details about this product option.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The quantity of this grouped product item.
 */
      get qty(): $Field<"qty", number | null>  {
       return this.$_select("qty") as any
      }
}


/**
 * A grouped product wish list item.
 */
export class GroupedProductWishlistItem extends $Base<"GroupedProductWishlistItem"> {
  constructor() {
    super("GroupedProductWishlistItem")
  }

  
      
/**
 * The date and time the item was added to the wish list.
 */
      get added_at(): $Field<"added_at", string>  {
       return this.$_select("added_at") as any
      }

      
/**
 * Custom options selected for the wish list item.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * The description of the item.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
/**
 * The unique ID for a `WishlistItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Product details of the wish list item.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The quantity of this wish list item.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }
}


/**
 * Defines basic features of a configurable product and its simple product variants.
 */
export class ConfigurableProduct extends $Base<"ConfigurableProduct"> {
  constructor() {
    super("ConfigurableProduct")
  }

  
      
/**
 * The attribute set assigned to the product.
 */
      get attribute_set_id(): $Field<"attribute_set_id", number | null>  {
       return this.$_select("attribute_set_id") as any
      }

      
      get brand(): $Field<"brand", number | null>  {
       return this.$_select("brand") as any
      }

      
/**
 * The relative canonical URL. This value is returned only if the system setting 'Use Canonical Link Meta Tag For Products' is enabled.
 */
      get canonical_url(): $Field<"canonical_url", string | null>  {
       return this.$_select("canonical_url") as any
      }

      
/**
 * The categories assigned to a product.
 */
      categories<Sel extends Selection<CategoryInterface>>(selectorFn: (s: CategoryInterface) => [...Sel]):$Field<"categories", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CategoryInterface)
      };
      return this.$_select("categories", options as any) as any
    }
  

      
      get color(): $Field<"color", number | null>  {
       return this.$_select("color") as any
      }

      
/**
 * An array of options for the configurable product.
 */
      configurable_options<Sel extends Selection<ConfigurableProductOptions>>(selectorFn: (s: ConfigurableProductOptions) => [...Sel]):$Field<"configurable_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ConfigurableProductOptions)
      };
      return this.$_select("configurable_options", options as any) as any
    }
  

      
/**
 * An array of media gallery items and other details about selected configurable product options as well as details about remaining selectable options.
 */
      configurable_product_options_selection<Args extends VariabledInput<{
        configurableOptionValueUids?: Readonly<Array<string>> | null,
      }>,Sel extends Selection<ConfigurableProductOptionsSelection>>(args: ExactArgNames<Args, {
        configurableOptionValueUids?: Readonly<Array<string>> | null,
      }>, selectorFn: (s: ConfigurableProductOptionsSelection) => [...Sel]):$Field<"configurable_product_options_selection", GetOutput<Sel> | null , GetVariables<Sel, Args>>
configurable_product_options_selection<Sel extends Selection<ConfigurableProductOptionsSelection>>(selectorFn: (s: ConfigurableProductOptionsSelection) => [...Sel]):$Field<"configurable_product_options_selection", GetOutput<Sel> | null , GetVariables<Sel>>
configurable_product_options_selection(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              configurableOptionValueUids: "[ID!]"
            },
        args,

        selection: selectorFn(new ConfigurableProductOptionsSelection)
      };
      return this.$_select("configurable_product_options_selection", options as any) as any
    }
  

      
/**
 * The product's country of origin.
 */
      get country_of_manufacture(): $Field<"country_of_manufacture", string | null>  {
       return this.$_select("country_of_manufacture") as any
      }

      
/**
 * Timestamp indicating when the product was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
/**
 * Crosssell Products
 */
      crosssell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"crosssell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("crosssell_products", options as any) as any
    }
  

      
/**
 * Product custom attributes.
 */
      custom_attributesV2<Args extends VariabledInput<{
        filters?: AttributeFilterInput | null,
      }>,Sel extends Selection<ProductCustomAttributes>>(args: ExactArgNames<Args, {
        filters?: AttributeFilterInput | null,
      }>, selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
custom_attributesV2<Sel extends Selection<ProductCustomAttributes>>(selectorFn: (s: ProductCustomAttributes) => [...Sel]):$Field<"custom_attributesV2", GetOutput<Sel> | null , GetVariables<Sel>>
custom_attributesV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filters: "AttributeFilterInput"
            },
        args,

        selection: selectorFn(new ProductCustomAttributes)
      };
      return this.$_select("custom_attributesV2", options as any) as any
    }
  

      
/**
 * Detailed information about the product. The value can include simple HTML tags.
 */
      description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("description", options as any) as any
    }
  

      
/**
 * Returns a value indicating gift message availability for the product.
 */
      get gift_message_available(): $Field<"gift_message_available", boolean>  {
       return this.$_select("gift_message_available") as any
      }

      
/**
 * The ID number assigned to the product.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The relative path to the main image on the product page.
 */
      image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("image", options as any) as any
    }
  

      
/**
 * A number representing the product's manufacturer.
 */
      get manufacturer(): $Field<"manufacturer", number | null>  {
       return this.$_select("manufacturer") as any
      }

      
/**
 * Maximum Qty Allowed in Shopping Cart
 */
      get max_sale_qty(): $Field<"max_sale_qty", number | null>  {
       return this.$_select("max_sale_qty") as any
      }

      
/**
 * An array of media gallery objects.
 */
      media_gallery<Sel extends Selection<MediaGalleryInterface>>(selectorFn: (s: MediaGalleryInterface) => [...Sel]):$Field<"media_gallery", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryInterface)
      };
      return this.$_select("media_gallery", options as any) as any
    }
  

      
/**
 * An array of MediaGalleryEntry objects.
 */
      media_gallery_entries<Sel extends Selection<MediaGalleryEntry>>(selectorFn: (s: MediaGalleryEntry) => [...Sel]):$Field<"media_gallery_entries", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryEntry)
      };
      return this.$_select("media_gallery_entries", options as any) as any
    }
  

      
/**
 * A brief overview of the product for search results listings, maximum 255 characters.
 */
      get meta_description(): $Field<"meta_description", string | null>  {
       return this.$_select("meta_description") as any
      }

      
/**
 * A comma-separated list of keywords that are visible only to search engines.
 */
      get meta_keyword(): $Field<"meta_keyword", string | null>  {
       return this.$_select("meta_keyword") as any
      }

      
/**
 * A string that is displayed in the title bar and tab of the browser and in search results lists.
 */
      get meta_title(): $Field<"meta_title", string | null>  {
       return this.$_select("meta_title") as any
      }

      
/**
 * Minimum Qty Allowed in Shopping Cart
 */
      get min_sale_qty(): $Field<"min_sale_qty", number | null>  {
       return this.$_select("min_sale_qty") as any
      }

      
/**
 * The product name. Customers use this name to identify the product.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The beginning date for new product listings, and determines if the product is featured as a new product.
 */
      get new_from_date(): $Field<"new_from_date", string | null>  {
       return this.$_select("new_from_date") as any
      }

      
/**
 * The end date for new product listings.
 */
      get new_to_date(): $Field<"new_to_date", string | null>  {
       return this.$_select("new_to_date") as any
      }

      
/**
 * Product stock only x left count
 */
      get only_x_left_in_stock(): $Field<"only_x_left_in_stock", number | null>  {
       return this.$_select("only_x_left_in_stock") as any
      }

      
/**
 * An array of options for a customizable product.
 */
      options<Sel extends Selection<CustomizableOptionInterface>>(selectorFn: (s: CustomizableOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomizableOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  

      
/**
 * If the product has multiple options, determines where they appear on the product page.
 */
      get options_container(): $Field<"options_container", string | null>  {
       return this.$_select("options_container") as any
      }

      
/**
 * Indicates the price of an item.
 */
      price<Sel extends Selection<ProductPrices>>(selectorFn: (s: ProductPrices) => [...Sel]):$Field<"price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductPrices)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The range of prices for the product
 */
      price_range<Sel extends Selection<PriceRange>>(selectorFn: (s: PriceRange) => [...Sel]):$Field<"price_range", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PriceRange)
      };
      return this.$_select("price_range", options as any) as any
    }
  

      
/**
 * An array of `TierPrice` objects.
 */
      price_tiers<Sel extends Selection<TierPrice>>(selectorFn: (s: TierPrice) => [...Sel]):$Field<"price_tiers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TierPrice)
      };
      return this.$_select("price_tiers", options as any) as any
    }
  

      
/**
 * An array of `ProductLinks` objects.
 */
      product_links<Sel extends Selection<ProductLinksInterface>>(selectorFn: (s: ProductLinksInterface) => [...Sel]):$Field<"product_links", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductLinksInterface)
      };
      return this.$_select("product_links", options as any) as any
    }
  

      
/**
 * Amount of available stock
 */
      get quantity(): $Field<"quantity", number | null>  {
       return this.$_select("quantity") as any
      }

      
/**
 * The average of all the ratings given to the product.
 */
      get rating_summary(): $Field<"rating_summary", number>  {
       return this.$_select("rating_summary") as any
      }

      
/**
 * Contains 0 when there is no redirect error. A value of 301 indicates the URL of the requested resource has been changed permanently, while a value of 302 indicates a temporary redirect.
 */
      get redirect_code(): $Field<"redirect_code", number>  {
       return this.$_select("redirect_code") as any
      }

      
/**
 * An array of products to be displayed in a Related Products block.
 */
      related_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"related_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("related_products", options as any) as any
    }
  

      
/**
 * The internal relative URL. If the specified URL is a redirect, the query returns the redirected URL, not the original.
 */
      get relative_url(): $Field<"relative_url", string | null>  {
       return this.$_select("relative_url") as any
      }

      
/**
 * The total count of all the reviews given to the product.
 */
      get review_count(): $Field<"review_count", number>  {
       return this.$_select("review_count") as any
      }

      
/**
 * The list of products reviews.
 */
      reviews<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<ProductReviews>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel, Args>>
reviews<Sel extends Selection<ProductReviews>>(selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel>>
reviews(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new ProductReviews)
      };
      return this.$_select("reviews", options as any) as any
    }
  

      
/**
 * A short description of the product. Its use depends on the theme.
 */
      short_description<Sel extends Selection<ComplexTextValue>>(selectorFn: (s: ComplexTextValue) => [...Sel]):$Field<"short_description", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComplexTextValue)
      };
      return this.$_select("short_description", options as any) as any
    }
  

      
/**
 * A number or code assigned to a product to identify the product, options, price, and manufacturer.
 */
      get sku(): $Field<"sku", string | null>  {
       return this.$_select("sku") as any
      }

      
/**
 * The relative path to the small image, which is used on catalog pages.
 */
      small_image<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"small_image", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("small_image", options as any) as any
    }
  

      
/**
 * The beginning date that a product has a special price.
 */
      get special_from_date(): $Field<"special_from_date", string | null>  {
       return this.$_select("special_from_date") as any
      }

      
/**
 * The discounted price of the product.
 */
      get special_price(): $Field<"special_price", number | null>  {
       return this.$_select("special_price") as any
      }

      
/**
 * The end date for a product with a special price.
 */
      get special_to_date(): $Field<"special_to_date", string | null>  {
       return this.$_select("special_to_date") as any
      }

      
/**
 * The status assigned to the product, 0 for disabled, 1 for enabled.
 */
      get status(): $Field<"status", number | null>  {
       return this.$_select("status") as any
      }

      
/**
 * Stock status of the product
 */
      get stock_status(): $Field<"stock_status", ProductStockStatus | null>  {
       return this.$_select("stock_status") as any
      }

      
/**
 * The file name of a swatch image.
 */
      get swatch_image(): $Field<"swatch_image", string | null>  {
       return this.$_select("swatch_image") as any
      }

      
/**
 * The relative path to the product's thumbnail image.
 */
      thumbnail<Sel extends Selection<ProductImage>>(selectorFn: (s: ProductImage) => [...Sel]):$Field<"thumbnail", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductImage)
      };
      return this.$_select("thumbnail", options as any) as any
    }
  

      
/**
 * The price when tier pricing is in effect and the items purchased threshold has been reached.
 */
      get tier_price(): $Field<"tier_price", number | null>  {
       return this.$_select("tier_price") as any
      }

      
/**
 * An array of ProductTierPrices objects.
 */
      tier_prices<Sel extends Selection<ProductTierPrices>>(selectorFn: (s: ProductTierPrices) => [...Sel]):$Field<"tier_prices", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductTierPrices)
      };
      return this.$_select("tier_prices", options as any) as any
    }
  

      
/**
 * One of PRODUCT, CATEGORY, or CMS_PAGE.
 */
      get type(): $Field<"type", UrlRewriteEntityTypeEnum | null>  {
       return this.$_select("type") as any
      }

      
/**
 * One of simple, virtual, bundle, downloadable, grouped, or configurable.
 */
      get type_id(): $Field<"type_id", string | null>  {
       return this.$_select("type_id") as any
      }

      
/**
 * The unique ID for a `ProductInterface` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * Timestamp indicating when the product was updated.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }

      
/**
 * Upsell Products
 */
      upsell_products<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"upsell_products", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("upsell_products", options as any) as any
    }
  

      
/**
 * The part of the URL that identifies the product
 */
      get url_key(): $Field<"url_key", string | null>  {
       return this.$_select("url_key") as any
      }

      
      get url_path(): $Field<"url_path", string | null>  {
       return this.$_select("url_path") as any
      }

      
/**
 * URL rewrites list
 */
      url_rewrites<Sel extends Selection<UrlRewrite>>(selectorFn: (s: UrlRewrite) => [...Sel]):$Field<"url_rewrites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new UrlRewrite)
      };
      return this.$_select("url_rewrites", options as any) as any
    }
  

      
/**
 * The part of the product URL that is appended after the url key
 */
      get url_suffix(): $Field<"url_suffix", string | null>  {
       return this.$_select("url_suffix") as any
      }

      
/**
 * An array of simple product variants.
 */
      variants<Sel extends Selection<ConfigurableVariant>>(selectorFn: (s: ConfigurableVariant) => [...Sel]):$Field<"variants", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ConfigurableVariant)
      };
      return this.$_select("variants", options as any) as any
    }
  

      
/**
 * The visibility assigned to the product.
 */
      get visibility(): $Field<"visibility", number | null>  {
       return this.$_select("visibility") as any
      }

      
/**
 * An array of websites in which the product is available.
 */
      websites<Sel extends Selection<Website>>(selectorFn: (s: Website) => [...Sel]):$Field<"websites", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Website)
      };
      return this.$_select("websites", options as any) as any
    }
  

      
/**
 * The weight of the item, in units defined by the store.
 */
      get weight(): $Field<"weight", number | null>  {
       return this.$_select("weight") as any
      }
}


/**
 * Contains all the simple product variants of a configurable product.
 */
export class ConfigurableVariant extends $Base<"ConfigurableVariant"> {
  constructor() {
    super("ConfigurableVariant")
  }

  
      
/**
 * An array of configurable attribute options.
 */
      attributes<Sel extends Selection<ConfigurableAttributeOption>>(selectorFn: (s: ConfigurableAttributeOption) => [...Sel]):$Field<"attributes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ConfigurableAttributeOption)
      };
      return this.$_select("attributes", options as any) as any
    }
  

      
/**
 * An array of linked simple products.
 */
      product<Sel extends Selection<SimpleProduct>>(selectorFn: (s: SimpleProduct) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SimpleProduct)
      };
      return this.$_select("product", options as any) as any
    }
  
}


/**
 * Contains details about a configurable product attribute option.
 */
export class ConfigurableAttributeOption extends $Base<"ConfigurableAttributeOption"> {
  constructor() {
    super("ConfigurableAttributeOption")
  }

  
      
/**
 * The ID assigned to the attribute.
 */
      get code(): $Field<"code", string | null>  {
       return this.$_select("code") as any
      }

      
/**
 * A string that describes the configurable attribute option.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The unique ID for a `ConfigurableAttributeOption` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * A unique index number assigned to the configurable product option.
 */
      get value_index(): $Field<"value_index", number | null>  {
       return this.$_select("value_index") as any
      }
}


/**
 * Defines configurable attributes for the specified product.
 */
export class ConfigurableProductOptions extends $Base<"ConfigurableProductOptions"> {
  constructor() {
    super("ConfigurableProductOptions")
  }

  
      
/**
 * A string that identifies the attribute.
 */
      get attribute_code(): $Field<"attribute_code", string | null>  {
       return this.$_select("attribute_code") as any
      }

      
/**
 * The ID assigned to the attribute.
 */
      get attribute_id(): $Field<"attribute_id", string | null>  {
       return this.$_select("attribute_id") as any
      }

      
/**
 * The ID assigned to the attribute.
 */
      get attribute_id_v2(): $Field<"attribute_id_v2", number | null>  {
       return this.$_select("attribute_id_v2") as any
      }

      
/**
 * The unique ID for an `Attribute` object.
 */
      get attribute_uid(): $Field<"attribute_uid", string>  {
       return this.$_select("attribute_uid") as any
      }

      
/**
 * The configurable option ID number assigned by the system.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * A displayed string that describes the configurable product option.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * A number that indicates the order in which the attribute is displayed.
 */
      get position(): $Field<"position", number | null>  {
       return this.$_select("position") as any
      }

      
/**
 * This is the same as a product's `id` field.
 */
      get product_id(): $Field<"product_id", number | null>  {
       return this.$_select("product_id") as any
      }

      
/**
 * The unique ID for a `ConfigurableProductOptions` object.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * Indicates whether the option is the default.
 */
      get use_default(): $Field<"use_default", boolean | null>  {
       return this.$_select("use_default") as any
      }

      
/**
 * An array that defines the `value_index` codes assigned to the configurable product.
 */
      values<Sel extends Selection<ConfigurableProductOptionsValues>>(selectorFn: (s: ConfigurableProductOptionsValues) => [...Sel]):$Field<"values", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ConfigurableProductOptionsValues)
      };
      return this.$_select("values", options as any) as any
    }
  
}


/**
 * Contains the index number assigned to a configurable product option.
 */
export class ConfigurableProductOptionsValues extends $Base<"ConfigurableProductOptionsValues"> {
  constructor() {
    super("ConfigurableProductOptionsValues")
  }

  
      
/**
 * The label of the product on the default store.
 */
      get default_label(): $Field<"default_label", string | null>  {
       return this.$_select("default_label") as any
      }

      
/**
 * The label of the product.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The label of the product on the current store.
 */
      get store_label(): $Field<"store_label", string | null>  {
       return this.$_select("store_label") as any
      }

      
/**
 * Swatch data for a configurable product option.
 */
      swatch_data<Sel extends Selection<SwatchDataInterface>>(selectorFn: (s: SwatchDataInterface) => [...Sel]):$Field<"swatch_data", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SwatchDataInterface)
      };
      return this.$_select("swatch_data", options as any) as any
    }
  

      
/**
 * The unique ID for a `ConfigurableProductOptionsValues` object.
 */
      get uid(): $Field<"uid", string | null>  {
       return this.$_select("uid") as any
      }

      
/**
 * Indicates whether to use the default_label.
 */
      get use_default_value(): $Field<"use_default_value", boolean | null>  {
       return this.$_select("use_default_value") as any
      }

      
/**
 * A unique index number assigned to the configurable product option.
 */
      get value_index(): $Field<"value_index", number | null>  {
       return this.$_select("value_index") as any
      }
}


/**
 * Defines the configurable products to add to the cart.
 */
export type AddConfigurableProductsToCartInput = {
  cart_id: string,
cart_items: Readonly<Array<ConfigurableProductCartItemInput | null>>
}
    


/**
 * Contains details about the cart after adding configurable products.
 */
export class AddConfigurableProductsToCartOutput extends $Base<"AddConfigurableProductsToCartOutput"> {
  constructor() {
    super("AddConfigurableProductsToCartOutput")
  }

  
      
/**
 * The cart after adding products.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


export type ConfigurableProductCartItemInput = {
  customizable_options?: Readonly<Array<CustomizableOptionInput | null>> | null,
data: CartItemInput,
parent_sku?: string | null,
variant_sku?: string | null
}
    


/**
 * Contains details about a selected configurable option.
 */
export class SelectedConfigurableOption extends $Base<"SelectedConfigurableOption"> {
  constructor() {
    super("SelectedConfigurableOption")
  }

  
      
/**
 * The unique ID for a `ConfigurableProductOptions` object.
 */
      get configurable_product_option_uid(): $Field<"configurable_product_option_uid", string>  {
       return this.$_select("configurable_product_option_uid") as any
      }

      
/**
 * The unique ID for a `ConfigurableProductOptionsValues` object.
 */
      get configurable_product_option_value_uid(): $Field<"configurable_product_option_value_uid", string>  {
       return this.$_select("configurable_product_option_value_uid") as any
      }

      
      get id(): $Field<"id", number>  {
       return this.$_select("id") as any
      }

      
/**
 * The display text for the option.
 */
      get option_label(): $Field<"option_label", string>  {
       return this.$_select("option_label") as any
      }

      
      get value_id(): $Field<"value_id", number>  {
       return this.$_select("value_id") as any
      }

      
/**
 * The display name of the selected configurable option.
 */
      get value_label(): $Field<"value_label", string>  {
       return this.$_select("value_label") as any
      }
}


/**
 * A configurable product wish list item.
 */
export class ConfigurableWishlistItem extends $Base<"ConfigurableWishlistItem"> {
  constructor() {
    super("ConfigurableWishlistItem")
  }

  
      
/**
 * The date and time the item was added to the wish list.
 */
      get added_at(): $Field<"added_at", string>  {
       return this.$_select("added_at") as any
      }

      
/**
 * The SKU of the simple product corresponding to a set of selected configurable options.
 */
      get child_sku(): $Field<"child_sku", string>  {
       return this.$_select("child_sku") as any
      }

      
/**
 * An array of selected configurable options.
 */
      configurable_options<Sel extends Selection<SelectedConfigurableOption>>(selectorFn: (s: SelectedConfigurableOption) => [...Sel]):$Field<"configurable_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedConfigurableOption)
      };
      return this.$_select("configurable_options", options as any) as any
    }
  

      
/**
 * Product details of the selected variant. The value is null if some options are not configured.
 */
      configured_variant<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"configured_variant", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("configured_variant", options as any) as any
    }
  

      
/**
 * Custom options selected for the wish list item.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * The description of the item.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
/**
 * The unique ID for a `WishlistItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Product details of the wish list item.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The quantity of this wish list item.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }
}


/**
 * Contains metadata corresponding to the selected configurable options.
 */
export class ConfigurableProductOptionsSelection extends $Base<"ConfigurableProductOptionsSelection"> {
  constructor() {
    super("ConfigurableProductOptionsSelection")
  }

  
      
/**
 * An array of all possible configurable options.
 */
      configurable_options<Sel extends Selection<ConfigurableProductOption>>(selectorFn: (s: ConfigurableProductOption) => [...Sel]):$Field<"configurable_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ConfigurableProductOption)
      };
      return this.$_select("configurable_options", options as any) as any
    }
  

      
/**
 * Product images and videos corresponding to the specified configurable options selection.
 */
      media_gallery<Sel extends Selection<MediaGalleryInterface>>(selectorFn: (s: MediaGalleryInterface) => [...Sel]):$Field<"media_gallery", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MediaGalleryInterface)
      };
      return this.$_select("media_gallery", options as any) as any
    }
  

      
/**
 * The configurable options available for further selection based on the current selection.
 */
      options_available_for_selection<Sel extends Selection<ConfigurableOptionAvailableForSelection>>(selectorFn: (s: ConfigurableOptionAvailableForSelection) => [...Sel]):$Field<"options_available_for_selection", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ConfigurableOptionAvailableForSelection)
      };
      return this.$_select("options_available_for_selection", options as any) as any
    }
  

      
/**
 * A variant represented by the specified configurable options selection. The value is expected to be null until selections are made for each configurable option.
 */
      variant<Sel extends Selection<SimpleProduct>>(selectorFn: (s: SimpleProduct) => [...Sel]):$Field<"variant", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SimpleProduct)
      };
      return this.$_select("variant", options as any) as any
    }
  
}


/**
 * Describes configurable options that have been selected and can be selected as a result of the previous selections.
 */
export class ConfigurableOptionAvailableForSelection extends $Base<"ConfigurableOptionAvailableForSelection"> {
  constructor() {
    super("ConfigurableOptionAvailableForSelection")
  }

  
      
/**
 * An attribute code that uniquely identifies a configurable option.
 */
      get attribute_code(): $Field<"attribute_code", string>  {
       return this.$_select("attribute_code") as any
      }

      
/**
 * An array of selectable option value IDs.
 */
      get option_value_uids(): $Field<"option_value_uids", Readonly<Array<string | null>>>  {
       return this.$_select("option_value_uids") as any
      }
}


/**
 * Contains details about configurable product options.
 */
export class ConfigurableProductOption extends $Base<"ConfigurableProductOption"> {
  constructor() {
    super("ConfigurableProductOption")
  }

  
      
/**
 * An attribute code that uniquely identifies a configurable option.
 */
      get attribute_code(): $Field<"attribute_code", string>  {
       return this.$_select("attribute_code") as any
      }

      
/**
 * The display name of the option.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The unique ID of the configurable option.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }

      
/**
 * An array of values that are applicable for this option.
 */
      values<Sel extends Selection<ConfigurableProductOptionValue>>(selectorFn: (s: ConfigurableProductOptionValue) => [...Sel]):$Field<"values", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ConfigurableProductOptionValue)
      };
      return this.$_select("values", options as any) as any
    }
  
}


/**
 * Defines a value for a configurable product option.
 */
export class ConfigurableProductOptionValue extends $Base<"ConfigurableProductOptionValue"> {
  constructor() {
    super("ConfigurableProductOptionValue")
  }

  
      
/**
 * Indicates whether the product is available with this selected option.
 */
      get is_available(): $Field<"is_available", boolean>  {
       return this.$_select("is_available") as any
      }

      
/**
 * Indicates whether the value is the default.
 */
      get is_use_default(): $Field<"is_use_default", boolean>  {
       return this.$_select("is_use_default") as any
      }

      
/**
 * The display name of the value.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The URL assigned to the thumbnail of the swatch image.
 */
      swatch<Sel extends Selection<SwatchDataInterface>>(selectorFn: (s: SwatchDataInterface) => [...Sel]):$Field<"swatch", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SwatchDataInterface)
      };
      return this.$_select("swatch", options as any) as any
    }
  

      
/**
 * The unique ID of the value.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


export class ConfigurableOrderItem extends $Base<"ConfigurableOrderItem"> {
  constructor() {
    super("ConfigurableOrderItem")
  }

  
      
/**
 * The final discount information for the product.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The entered option for the base product, such as a logo or image.
 */
      entered_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"entered_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("entered_options", options as any) as any
    }
  

      
/**
 * The selected gift message for the order item
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
/**
 * The unique ID for an `OrderItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The SKU of parent product.
 */
      get parent_sku(): $Field<"parent_sku", string | null>  {
       return this.$_select("parent_sku") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<OrderItemPrices>>(selectorFn: (s: OrderItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * The ProductInterface object, which contains details about the base product
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price of the base product, including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The type of product, such as simple, configurable, etc.
 */
      get product_type(): $Field<"product_type", string | null>  {
       return this.$_select("product_type") as any
      }

      
/**
 * URL key of the base product.
 */
      get product_url_key(): $Field<"product_url_key", string | null>  {
       return this.$_select("product_url_key") as any
      }

      
/**
 * The number of canceled items.
 */
      get quantity_canceled(): $Field<"quantity_canceled", number | null>  {
       return this.$_select("quantity_canceled") as any
      }

      
/**
 * The number of invoiced items.
 */
      get quantity_invoiced(): $Field<"quantity_invoiced", number | null>  {
       return this.$_select("quantity_invoiced") as any
      }

      
/**
 * The number of units ordered for this item.
 */
      get quantity_ordered(): $Field<"quantity_ordered", number | null>  {
       return this.$_select("quantity_ordered") as any
      }

      
/**
 * The number of refunded items.
 */
      get quantity_refunded(): $Field<"quantity_refunded", number | null>  {
       return this.$_select("quantity_refunded") as any
      }

      
/**
 * The number of returned items.
 */
      get quantity_returned(): $Field<"quantity_returned", number | null>  {
       return this.$_select("quantity_returned") as any
      }

      
/**
 * The number of shipped items.
 */
      get quantity_shipped(): $Field<"quantity_shipped", number | null>  {
       return this.$_select("quantity_shipped") as any
      }

      
/**
 * The selected options for the base product, such as color or size.
 */
      selected_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"selected_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("selected_options", options as any) as any
    }
  

      
/**
 * The status of the order item.
 */
      get status(): $Field<"status", string | null>  {
       return this.$_select("status") as any
      }
}


/**
 * AreaInput defines the parameters which will be used for filter by specified location.
 */
export type AreaInput = {
  radius: number,
search_term: string
}
    


/**
 * PickupLocationFilterInput defines the list of attributes and filters for the search.
 */
export type PickupLocationFilterInput = {
  city?: FilterTypeInput | null,
country_id?: FilterTypeInput | null,
name?: FilterTypeInput | null,
pickup_location_code?: FilterTypeInput | null,
postcode?: FilterTypeInput | null,
region?: FilterTypeInput | null,
region_id?: FilterTypeInput | null,
street?: FilterTypeInput | null
}
    


/**
 * PickupLocationSortInput specifies attribute to use for sorting search results and indicates whether the results are sorted in ascending or descending order.
 */
export type PickupLocationSortInput = {
  city?: SortEnum | null,
contact_name?: SortEnum | null,
country_id?: SortEnum | null,
description?: SortEnum | null,
distance?: SortEnum | null,
email?: SortEnum | null,
fax?: SortEnum | null,
latitude?: SortEnum | null,
longitude?: SortEnum | null,
name?: SortEnum | null,
phone?: SortEnum | null,
pickup_location_code?: SortEnum | null,
postcode?: SortEnum | null,
region?: SortEnum | null,
region_id?: SortEnum | null,
street?: SortEnum | null
}
    


/**
 * Top level object returned in a pickup locations search.
 */
export class PickupLocations extends $Base<"PickupLocations"> {
  constructor() {
    super("PickupLocations")
  }

  
      
/**
 * An array of pickup locations that match the specific search request.
 */
      items<Sel extends Selection<PickupLocation>>(selectorFn: (s: PickupLocation) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PickupLocation)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * An object that includes the page_info and currentPage values specified in the query.
 */
      page_info<Sel extends Selection<SearchResultPageInfo>>(selectorFn: (s: SearchResultPageInfo) => [...Sel]):$Field<"page_info", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchResultPageInfo)
      };
      return this.$_select("page_info", options as any) as any
    }
  

      
/**
 * The number of products returned.
 */
      get total_count(): $Field<"total_count", number | null>  {
       return this.$_select("total_count") as any
      }
}


/**
 * Defines Pickup Location information.
 */
export class PickupLocation extends $Base<"PickupLocation"> {
  constructor() {
    super("PickupLocation")
  }

  
      
      get city(): $Field<"city", string | null>  {
       return this.$_select("city") as any
      }

      
      get contact_name(): $Field<"contact_name", string | null>  {
       return this.$_select("contact_name") as any
      }

      
      get country_id(): $Field<"country_id", string | null>  {
       return this.$_select("country_id") as any
      }

      
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
      get email(): $Field<"email", string | null>  {
       return this.$_select("email") as any
      }

      
      get fax(): $Field<"fax", string | null>  {
       return this.$_select("fax") as any
      }

      
      get latitude(): $Field<"latitude", number | null>  {
       return this.$_select("latitude") as any
      }

      
      get longitude(): $Field<"longitude", number | null>  {
       return this.$_select("longitude") as any
      }

      
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
      get phone(): $Field<"phone", string | null>  {
       return this.$_select("phone") as any
      }

      
      get pickup_location_code(): $Field<"pickup_location_code", string | null>  {
       return this.$_select("pickup_location_code") as any
      }

      
      get postcode(): $Field<"postcode", string | null>  {
       return this.$_select("postcode") as any
      }

      
      get region(): $Field<"region", string | null>  {
       return this.$_select("region") as any
      }

      
      get region_id(): $Field<"region_id", number | null>  {
       return this.$_select("region_id") as any
      }

      
      get street(): $Field<"street", string | null>  {
       return this.$_select("street") as any
      }
}


/**
 * Product Information used for Pickup Locations search.
 */
export type ProductInfoInput = {
  sku: string
}
    

  
/**
 * This enumeration states whether a product stock status is in stock or out of stock
 */
export enum ProductStockStatus {
  
  IN_STOCK = "IN_STOCK",

  OUT_OF_STOCK = "OUT_OF_STOCK"
}
  


/**
 * Identifies which customer requires remote shopping assistance.
 */
export type GenerateCustomerTokenAsAdminInput = {
  customer_email: string
}
    


/**
 * Contains the generated customer token.
 */
export class GenerateCustomerTokenAsAdminOutput extends $Base<"GenerateCustomerTokenAsAdminOutput"> {
  constructor() {
    super("GenerateCustomerTokenAsAdminOutput")
  }

  
      
/**
 * The generated customer token.
 */
      get customer_token(): $Field<"customer_token", string>  {
       return this.$_select("customer_token") as any
      }
}


/**
 * Defines the customer name, addresses, and other details.
 */
export class Customer extends $Base<"Customer"> {
  constructor() {
    super("Customer")
  }

  
      
/**
 * An array containing the customer's shipping and billing addresses.
 */
      addresses<Sel extends Selection<CustomerAddress>>(selectorFn: (s: CustomerAddress) => [...Sel]):$Field<"addresses", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerAddress)
      };
      return this.$_select("addresses", options as any) as any
    }
  

      
/**
 * An array containing the customer's shipping and billing addresses.
 */
      addressesV2<Args extends VariabledInput<{
        currentPage?: number | null
pageSize?: number | null,
      }>,Sel extends Selection<CustomerAddresses>>(args: ExactArgNames<Args, {
        currentPage?: number | null
pageSize?: number | null,
      }>, selectorFn: (s: CustomerAddresses) => [...Sel]):$Field<"addressesV2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
addressesV2<Sel extends Selection<CustomerAddresses>>(selectorFn: (s: CustomerAddresses) => [...Sel]):$Field<"addressesV2", GetOutput<Sel> | null , GetVariables<Sel>>
addressesV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              currentPage: "Int",
pageSize: "Int"
            },
        args,

        selection: selectorFn(new CustomerAddresses)
      };
      return this.$_select("addressesV2", options as any) as any
    }
  

      
/**
 * Indicates whether the customer has enabled remote shopping assistance.
 */
      get allow_remote_shopping_assistance(): $Field<"allow_remote_shopping_assistance", boolean>  {
       return this.$_select("allow_remote_shopping_assistance") as any
      }

      
/**
 * The contents of the customer's compare list.
 */
      compare_list<Sel extends Selection<CompareList>>(selectorFn: (s: CompareList) => [...Sel]):$Field<"compare_list", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CompareList)
      };
      return this.$_select("compare_list", options as any) as any
    }
  

      
/**
 * The customer's confirmation status.
 */
      get confirmation_status(): $Field<"confirmation_status", ConfirmationStatusEnum>  {
       return this.$_select("confirmation_status") as any
      }

      
/**
 * Timestamp indicating when the account was created.
 */
      get created_at(): $Field<"created_at", string | null>  {
       return this.$_select("created_at") as any
      }

      
/**
 * Customer's custom attributes.
 */
      custom_attributes<Args extends VariabledInput<{
        attributeCodes?: Readonly<Array<string>> | null,
      }>,Sel extends Selection<AttributeValueInterface>>(args: ExactArgNames<Args, {
        attributeCodes?: Readonly<Array<string>> | null,
      }>, selectorFn: (s: AttributeValueInterface) => [...Sel]):$Field<"custom_attributes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel, Args>>
custom_attributes<Sel extends Selection<AttributeValueInterface>>(selectorFn: (s: AttributeValueInterface) => [...Sel]):$Field<"custom_attributes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>>
custom_attributes(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              attributeCodes: "[ID!]"
            },
        args,

        selection: selectorFn(new AttributeValueInterface)
      };
      return this.$_select("custom_attributes", options as any) as any
    }
  

      
/**
 * The customer's date of birth.
 */
      get date_of_birth(): $Field<"date_of_birth", string | null>  {
       return this.$_select("date_of_birth") as any
      }

      
/**
 * The ID assigned to the billing address.
 */
      get default_billing(): $Field<"default_billing", string | null>  {
       return this.$_select("default_billing") as any
      }

      
/**
 * The ID assigned to the shipping address.
 */
      get default_shipping(): $Field<"default_shipping", string | null>  {
       return this.$_select("default_shipping") as any
      }

      
/**
 * The customer's date of birth.
 */
      get dob(): $Field<"dob", string | null>  {
       return this.$_select("dob") as any
      }

      
/**
 * The customer's email address. Required.
 */
      get email(): $Field<"email", string | null>  {
       return this.$_select("email") as any
      }

      
/**
 * The customer's first name.
 */
      get firstname(): $Field<"firstname", string | null>  {
       return this.$_select("firstname") as any
      }

      
/**
 * The customer's gender (Male - 1, Female - 2).
 */
      get gender(): $Field<"gender", number | null>  {
       return this.$_select("gender") as any
      }

      
      get group_id(): $Field<"group_id", number | null>  {
       return this.$_select("group_id") as any
      }

      
/**
 * The ID assigned to the customer.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * Indicates whether the customer is subscribed to the company's newsletter.
 */
      get is_subscribed(): $Field<"is_subscribed", boolean | null>  {
       return this.$_select("is_subscribed") as any
      }

      
/**
 * The customer's family name.
 */
      get lastname(): $Field<"lastname", string | null>  {
       return this.$_select("lastname") as any
      }

      
/**
 * The customer's middle name.
 */
      get middlename(): $Field<"middlename", string | null>  {
       return this.$_select("middlename") as any
      }

      
      orders<Args extends VariabledInput<{
        filter?: CustomerOrdersFilterInput | null
currentPage?: number | null
pageSize?: number | null
sort?: CustomerOrderSortInput | null
scope?: ScopeTypeEnum | null,
      }>,Sel extends Selection<CustomerOrders>>(args: ExactArgNames<Args, {
        filter?: CustomerOrdersFilterInput | null
currentPage?: number | null
pageSize?: number | null
sort?: CustomerOrderSortInput | null
scope?: ScopeTypeEnum | null,
      }>, selectorFn: (s: CustomerOrders) => [...Sel]):$Field<"orders", GetOutput<Sel> | null , GetVariables<Sel, Args>>
orders<Sel extends Selection<CustomerOrders>>(selectorFn: (s: CustomerOrders) => [...Sel]):$Field<"orders", GetOutput<Sel> | null , GetVariables<Sel>>
orders(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              filter: "CustomerOrdersFilterInput",
currentPage: "Int",
pageSize: "Int",
sort: "CustomerOrderSortInput",
scope: "ScopeTypeEnum"
            },
        args,

        selection: selectorFn(new CustomerOrders)
      };
      return this.$_select("orders", options as any) as any
    }
  

      
/**
 * An honorific, such as Dr., Mr., or Mrs.
 */
      get prefix(): $Field<"prefix", string | null>  {
       return this.$_select("prefix") as any
      }

      
/**
 * Contains the customer's product reviews.
 */
      reviews<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<ProductReviews>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel, Args>>
reviews<Sel extends Selection<ProductReviews>>(selectorFn: (s: ProductReviews) => [...Sel]):$Field<"reviews", GetOutput<Sel> , GetVariables<Sel>>
reviews(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new ProductReviews)
      };
      return this.$_select("reviews", options as any) as any
    }
  

      
/**
 * A value such as Sr., Jr., or III.
 */
      get suffix(): $Field<"suffix", string | null>  {
       return this.$_select("suffix") as any
      }

      
/**
 * The customer's Value-added tax (VAT) number (for corporate customers).
 */
      get taxvat(): $Field<"taxvat", string | null>  {
       return this.$_select("taxvat") as any
      }

      
/**
 * Return a customer's wish lists.
 */
      wishlist<Sel extends Selection<Wishlist>>(selectorFn: (s: Wishlist) => [...Sel]):$Field<"wishlist", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Wishlist)
      };
      return this.$_select("wishlist", options as any) as any
    }
  

      
/**
 * Retrieve the wish list identified by the unique ID for a `Wishlist` object.
 */
      wishlist_v2<Args extends VariabledInput<{
        id: string,
      }>,Sel extends Selection<Wishlist>>(args: ExactArgNames<Args, {
        id: string,
      }>, selectorFn: (s: Wishlist) => [...Sel]):$Field<"wishlist_v2", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "ID!"
            },
        args,

        selection: selectorFn(new Wishlist)
      };
      return this.$_select("wishlist_v2", options as any) as any
    }
  

      
/**
 * An array of wishlists. In Magento Open Source, customers are limited to one wish list. The number of wish lists is configurable for Adobe Commerce.
 */
      wishlists<Args extends VariabledInput<{
        pageSize?: number | null
currentPage?: number | null,
      }>,Sel extends Selection<Wishlist>>(args: ExactArgNames<Args, {
        pageSize?: number | null
currentPage?: number | null,
      }>, selectorFn: (s: Wishlist) => [...Sel]):$Field<"wishlists", Array<GetOutput<Sel> | null> , GetVariables<Sel, Args>>
wishlists<Sel extends Selection<Wishlist>>(selectorFn: (s: Wishlist) => [...Sel]):$Field<"wishlists", Array<GetOutput<Sel> | null> , GetVariables<Sel>>
wishlists(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              pageSize: "Int",
currentPage: "Int"
            },
        args,

        selection: selectorFn(new Wishlist)
      };
      return this.$_select("wishlists", options as any) as any
    }
  
}


/**
 * An input object for creating a customer.
 */
export type CustomerCreateInput = {
  allow_remote_shopping_assistance?: boolean | null,
custom_attributes?: Readonly<Array<AttributeValueInput | null>> | null,
date_of_birth?: string | null,
dob?: string | null,
email: string,
firstname: string,
gender?: number | null,
is_subscribed?: boolean | null,
lastname: string,
middlename?: string | null,
password?: string | null,
prefix?: string | null,
suffix?: string | null,
taxvat?: string | null
}
    


/**
 * An input object for updating a customer.
 */
export type CustomerUpdateInput = {
  allow_remote_shopping_assistance?: boolean | null,
custom_attributes?: Readonly<Array<AttributeValueInput | null>> | null,
date_of_birth?: string | null,
dob?: string | null,
firstname?: string | null,
gender?: number | null,
is_subscribed?: boolean | null,
lastname?: string | null,
middlename?: string | null,
prefix?: string | null,
suffix?: string | null,
taxvat?: string | null
}
    


/**
 * Contains details about a customer email address to confirm.
 */
export type ConfirmEmailInput = {
  confirmation_key: string,
email: string
}
    


/**
 * Contains details about a billing or shipping address.
 */
export type CustomerAddressInput = {
  city?: string | null,
company?: string | null,
country_code?: CountryCodeEnum | null,
country_id?: CountryCodeEnum | null,
custom_attributes?: Readonly<Array<CustomerAddressAttributeInput | null>> | null,
custom_attributesV2?: Readonly<Array<AttributeValueInput | null>> | null,
default_billing?: boolean | null,
default_shipping?: boolean | null,
fax?: string | null,
firstname?: string | null,
lastname?: string | null,
middlename?: string | null,
postcode?: string | null,
prefix?: string | null,
region?: CustomerAddressRegionInput | null,
street?: Readonly<Array<string | null>> | null,
suffix?: string | null,
telephone?: string | null,
vat_id?: string | null
}
    


/**
 * Defines the customer's state or province.
 */
export type CustomerAddressRegionInput = {
  region?: string | null,
region_code?: string | null,
region_id?: number | null
}
    


/**
 * Specifies the attribute code and value of a customer attribute.
 */
export type CustomerAddressAttributeInput = {
  attribute_code: string,
value: string
}
    


/**
 * Contains a customer authorization token.
 */
export class CustomerToken extends $Base<"CustomerToken"> {
  constructor() {
    super("CustomerToken")
  }

  
      
/**
 * The customer authorization token.
 */
      get token(): $Field<"token", string | null>  {
       return this.$_select("token") as any
      }
}


/**
 * An input object that assigns or updates customer attributes.
 */
export type CustomerInput = {
  date_of_birth?: string | null,
dob?: string | null,
email?: string | null,
firstname?: string | null,
gender?: number | null,
is_subscribed?: boolean | null,
lastname?: string | null,
middlename?: string | null,
password?: string | null,
prefix?: string | null,
suffix?: string | null,
taxvat?: string | null
}
    


/**
 * Contains details about a newly-created or updated customer.
 */
export class CustomerOutput extends $Base<"CustomerOutput"> {
  constructor() {
    super("CustomerOutput")
  }

  
      
/**
 * Customer details after creating or updating a customer.
 */
      customer<Sel extends Selection<Customer>>(selectorFn: (s: Customer) => [...Sel]):$Field<"customer", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Customer)
      };
      return this.$_select("customer", options as any) as any
    }
  
}


/**
 * Contains the result of a request to revoke a customer token.
 */
export class RevokeCustomerTokenOutput extends $Base<"RevokeCustomerTokenOutput"> {
  constructor() {
    super("RevokeCustomerTokenOutput")
  }

  
      
/**
 * The result of a request to revoke a customer token.
 */
      get result(): $Field<"result", boolean>  {
       return this.$_select("result") as any
      }
}


export class CustomerAddresses extends $Base<"CustomerAddresses"> {
  constructor() {
    super("CustomerAddresses")
  }

  
      
/**
 * An array containing the customer's shipping and billing addresses.
 */
      items<Sel extends Selection<CustomerAddress>>(selectorFn: (s: CustomerAddress) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerAddress)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * Contains pagination metadata.
 */
      page_info<Sel extends Selection<SearchResultPageInfo>>(selectorFn: (s: SearchResultPageInfo) => [...Sel]):$Field<"page_info", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchResultPageInfo)
      };
      return this.$_select("page_info", options as any) as any
    }
  

      
/**
 * The total count of customer addresses.
 */
      get total_count(): $Field<"total_count", number | null>  {
       return this.$_select("total_count") as any
      }
}


/**
 * Contains detailed information about a customer's billing or shipping address.
 */
export class CustomerAddress extends $Base<"CustomerAddress"> {
  constructor() {
    super("CustomerAddress")
  }

  
      
/**
 * The customer's city or town.
 */
      get city(): $Field<"city", string | null>  {
       return this.$_select("city") as any
      }

      
/**
 * The customer's company.
 */
      get company(): $Field<"company", string | null>  {
       return this.$_select("company") as any
      }

      
/**
 * The customer's country.
 */
      get country_code(): $Field<"country_code", CountryCodeEnum | null>  {
       return this.$_select("country_code") as any
      }

      
/**
 * The customer's country.
 */
      get country_id(): $Field<"country_id", string | null>  {
       return this.$_select("country_id") as any
      }

      
      custom_attributes<Sel extends Selection<CustomerAddressAttribute>>(selectorFn: (s: CustomerAddressAttribute) => [...Sel]):$Field<"custom_attributes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerAddressAttribute)
      };
      return this.$_select("custom_attributes", options as any) as any
    }
  

      
/**
 * Custom attributes assigned to the customer address.
 */
      custom_attributesV2<Args extends VariabledInput<{
        attributeCodes?: Readonly<Array<string>> | null,
      }>,Sel extends Selection<AttributeValueInterface>>(args: ExactArgNames<Args, {
        attributeCodes?: Readonly<Array<string>> | null,
      }>, selectorFn: (s: AttributeValueInterface) => [...Sel]):$Field<"custom_attributesV2", Array<GetOutput<Sel> | null> , GetVariables<Sel, Args>>
custom_attributesV2<Sel extends Selection<AttributeValueInterface>>(selectorFn: (s: AttributeValueInterface) => [...Sel]):$Field<"custom_attributesV2", Array<GetOutput<Sel> | null> , GetVariables<Sel>>
custom_attributesV2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              attributeCodes: "[ID!]"
            },
        args,

        selection: selectorFn(new AttributeValueInterface)
      };
      return this.$_select("custom_attributesV2", options as any) as any
    }
  

      
/**
 * The customer ID
 */
      get customer_id(): $Field<"customer_id", number | null>  {
       return this.$_select("customer_id") as any
      }

      
/**
 * Indicates whether the address is the customer's default billing address.
 */
      get default_billing(): $Field<"default_billing", boolean | null>  {
       return this.$_select("default_billing") as any
      }

      
/**
 * Indicates whether the address is the customer's default shipping address.
 */
      get default_shipping(): $Field<"default_shipping", boolean | null>  {
       return this.$_select("default_shipping") as any
      }

      
/**
 * Contains any extension attributes for the address.
 */
      extension_attributes<Sel extends Selection<CustomerAddressAttribute>>(selectorFn: (s: CustomerAddressAttribute) => [...Sel]):$Field<"extension_attributes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerAddressAttribute)
      };
      return this.$_select("extension_attributes", options as any) as any
    }
  

      
/**
 * The customer's fax number.
 */
      get fax(): $Field<"fax", string | null>  {
       return this.$_select("fax") as any
      }

      
/**
 * The first name of the person associated with the shipping/billing address.
 */
      get firstname(): $Field<"firstname", string | null>  {
       return this.$_select("firstname") as any
      }

      
/**
 * The ID of a `CustomerAddress` object.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * The family name of the person associated with the shipping/billing address.
 */
      get lastname(): $Field<"lastname", string | null>  {
       return this.$_select("lastname") as any
      }

      
/**
 * The middle name of the person associated with the shipping/billing address.
 */
      get middlename(): $Field<"middlename", string | null>  {
       return this.$_select("middlename") as any
      }

      
/**
 * The customer's ZIP or postal code.
 */
      get postcode(): $Field<"postcode", string | null>  {
       return this.$_select("postcode") as any
      }

      
/**
 * An honorific, such as Dr., Mr., or Mrs.
 */
      get prefix(): $Field<"prefix", string | null>  {
       return this.$_select("prefix") as any
      }

      
/**
 * An object containing the region name, region code, and region ID.
 */
      region<Sel extends Selection<CustomerAddressRegion>>(selectorFn: (s: CustomerAddressRegion) => [...Sel]):$Field<"region", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerAddressRegion)
      };
      return this.$_select("region", options as any) as any
    }
  

      
/**
 * The unique ID for a pre-defined region.
 */
      get region_id(): $Field<"region_id", number | null>  {
       return this.$_select("region_id") as any
      }

      
/**
 * An array of strings that define the street number and name.
 */
      get street(): $Field<"street", Readonly<Array<string | null>> | null>  {
       return this.$_select("street") as any
      }

      
/**
 * A value such as Sr., Jr., or III.
 */
      get suffix(): $Field<"suffix", string | null>  {
       return this.$_select("suffix") as any
      }

      
/**
 * The customer's telephone number.
 */
      get telephone(): $Field<"telephone", string | null>  {
       return this.$_select("telephone") as any
      }

      
/**
 * The customer's Value-added tax (VAT) number (for corporate customers).
 */
      get vat_id(): $Field<"vat_id", string | null>  {
       return this.$_select("vat_id") as any
      }
}


/**
 * Defines the customer's state or province.
 */
export class CustomerAddressRegion extends $Base<"CustomerAddressRegion"> {
  constructor() {
    super("CustomerAddressRegion")
  }

  
      
/**
 * The state or province name.
 */
      get region(): $Field<"region", string | null>  {
       return this.$_select("region") as any
      }

      
/**
 * The address region code.
 */
      get region_code(): $Field<"region_code", string | null>  {
       return this.$_select("region_code") as any
      }

      
/**
 * The unique ID for a pre-defined region.
 */
      get region_id(): $Field<"region_id", number | null>  {
       return this.$_select("region_id") as any
      }
}


/**
 * Specifies the attribute code and value of a customer address attribute.
 */
export class CustomerAddressAttribute extends $Base<"CustomerAddressAttribute"> {
  constructor() {
    super("CustomerAddressAttribute")
  }

  
      
/**
 * The name assigned to the customer address attribute.
 */
      get attribute_code(): $Field<"attribute_code", string | null>  {
       return this.$_select("attribute_code") as any
      }

      
/**
 * The value assigned to the customer address attribute.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}


/**
 * Contains the result of the `isEmailAvailable` query.
 */
export class IsEmailAvailableOutput extends $Base<"IsEmailAvailableOutput"> {
  constructor() {
    super("IsEmailAvailableOutput")
  }

  
      
/**
 * Indicates whether the specified email address can be used to create a customer.
 */
      get is_email_available(): $Field<"is_email_available", boolean | null>  {
       return this.$_select("is_email_available") as any
      }
}

  
/**
 * The list of country codes.
 */
export enum CountryCodeEnum {
  
/**
 * Afghanistan
 */
  AF = "AF",

/**
 * Åland Islands
 */
  AX = "AX",

/**
 * Albania
 */
  AL = "AL",

/**
 * Algeria
 */
  DZ = "DZ",

/**
 * American Samoa
 */
  AS = "AS",

/**
 * Andorra
 */
  AD = "AD",

/**
 * Angola
 */
  AO = "AO",

/**
 * Anguilla
 */
  AI = "AI",

/**
 * Antarctica
 */
  AQ = "AQ",

/**
 * Antigua & Barbuda
 */
  AG = "AG",

/**
 * Argentina
 */
  AR = "AR",

/**
 * Armenia
 */
  AM = "AM",

/**
 * Aruba
 */
  AW = "AW",

/**
 * Australia
 */
  AU = "AU",

/**
 * Austria
 */
  AT = "AT",

/**
 * Azerbaijan
 */
  AZ = "AZ",

/**
 * Bahamas
 */
  BS = "BS",

/**
 * Bahrain
 */
  BH = "BH",

/**
 * Bangladesh
 */
  BD = "BD",

/**
 * Barbados
 */
  BB = "BB",

/**
 * Belarus
 */
  BY = "BY",

/**
 * Belgium
 */
  BE = "BE",

/**
 * Belize
 */
  BZ = "BZ",

/**
 * Benin
 */
  BJ = "BJ",

/**
 * Bermuda
 */
  BM = "BM",

/**
 * Bhutan
 */
  BT = "BT",

/**
 * Bolivia
 */
  BO = "BO",

/**
 * Bosnia & Herzegovina
 */
  BA = "BA",

/**
 * Botswana
 */
  BW = "BW",

/**
 * Bouvet Island
 */
  BV = "BV",

/**
 * Brazil
 */
  BR = "BR",

/**
 * British Indian Ocean Territory
 */
  IO = "IO",

/**
 * British Virgin Islands
 */
  VG = "VG",

/**
 * Brunei
 */
  BN = "BN",

/**
 * Bulgaria
 */
  BG = "BG",

/**
 * Burkina Faso
 */
  BF = "BF",

/**
 * Burundi
 */
  BI = "BI",

/**
 * Cambodia
 */
  KH = "KH",

/**
 * Cameroon
 */
  CM = "CM",

/**
 * Canada
 */
  CA = "CA",

/**
 * Cape Verde
 */
  CV = "CV",

/**
 * Cayman Islands
 */
  KY = "KY",

/**
 * Central African Republic
 */
  CF = "CF",

/**
 * Chad
 */
  TD = "TD",

/**
 * Chile
 */
  CL = "CL",

/**
 * China
 */
  CN = "CN",

/**
 * Christmas Island
 */
  CX = "CX",

/**
 * Cocos (Keeling) Islands
 */
  CC = "CC",

/**
 * Colombia
 */
  CO = "CO",

/**
 * Comoros
 */
  KM = "KM",

/**
 * Congo-Brazzaville
 */
  CG = "CG",

/**
 * Congo-Kinshasa
 */
  CD = "CD",

/**
 * Cook Islands
 */
  CK = "CK",

/**
 * Costa Rica
 */
  CR = "CR",

/**
 * Côte d’Ivoire
 */
  CI = "CI",

/**
 * Croatia
 */
  HR = "HR",

/**
 * Cuba
 */
  CU = "CU",

/**
 * Cyprus
 */
  CY = "CY",

/**
 * Czech Republic
 */
  CZ = "CZ",

/**
 * Denmark
 */
  DK = "DK",

/**
 * Djibouti
 */
  DJ = "DJ",

/**
 * Dominica
 */
  DM = "DM",

/**
 * Dominican Republic
 */
  DO = "DO",

/**
 * Ecuador
 */
  EC = "EC",

/**
 * Egypt
 */
  EG = "EG",

/**
 * El Salvador
 */
  SV = "SV",

/**
 * Equatorial Guinea
 */
  GQ = "GQ",

/**
 * Eritrea
 */
  ER = "ER",

/**
 * Estonia
 */
  EE = "EE",

/**
 * Eswatini
 */
  SZ = "SZ",

/**
 * Ethiopia
 */
  ET = "ET",

/**
 * Falkland Islands
 */
  FK = "FK",

/**
 * Faroe Islands
 */
  FO = "FO",

/**
 * Fiji
 */
  FJ = "FJ",

/**
 * Finland
 */
  FI = "FI",

/**
 * France
 */
  FR = "FR",

/**
 * French Guiana
 */
  GF = "GF",

/**
 * French Polynesia
 */
  PF = "PF",

/**
 * French Southern Territories
 */
  TF = "TF",

/**
 * Gabon
 */
  GA = "GA",

/**
 * Gambia
 */
  GM = "GM",

/**
 * Georgia
 */
  GE = "GE",

/**
 * Germany
 */
  DE = "DE",

/**
 * Ghana
 */
  GH = "GH",

/**
 * Gibraltar
 */
  GI = "GI",

/**
 * Greece
 */
  GR = "GR",

/**
 * Greenland
 */
  GL = "GL",

/**
 * Grenada
 */
  GD = "GD",

/**
 * Guadeloupe
 */
  GP = "GP",

/**
 * Guam
 */
  GU = "GU",

/**
 * Guatemala
 */
  GT = "GT",

/**
 * Guernsey
 */
  GG = "GG",

/**
 * Guinea
 */
  GN = "GN",

/**
 * Guinea-Bissau
 */
  GW = "GW",

/**
 * Guyana
 */
  GY = "GY",

/**
 * Haiti
 */
  HT = "HT",

/**
 * Heard &amp; McDonald Islands
 */
  HM = "HM",

/**
 * Honduras
 */
  HN = "HN",

/**
 * Hong Kong SAR China
 */
  HK = "HK",

/**
 * Hungary
 */
  HU = "HU",

/**
 * Iceland
 */
  IS = "IS",

/**
 * India
 */
  IN = "IN",

/**
 * Indonesia
 */
  ID = "ID",

/**
 * Iran
 */
  IR = "IR",

/**
 * Iraq
 */
  IQ = "IQ",

/**
 * Ireland
 */
  IE = "IE",

/**
 * Isle of Man
 */
  IM = "IM",

/**
 * Israel
 */
  IL = "IL",

/**
 * Italy
 */
  IT = "IT",

/**
 * Jamaica
 */
  JM = "JM",

/**
 * Japan
 */
  JP = "JP",

/**
 * Jersey
 */
  JE = "JE",

/**
 * Jordan
 */
  JO = "JO",

/**
 * Kazakhstan
 */
  KZ = "KZ",

/**
 * Kenya
 */
  KE = "KE",

/**
 * Kiribati
 */
  KI = "KI",

/**
 * Kuwait
 */
  KW = "KW",

/**
 * Kyrgyzstan
 */
  KG = "KG",

/**
 * Laos
 */
  LA = "LA",

/**
 * Latvia
 */
  LV = "LV",

/**
 * Lebanon
 */
  LB = "LB",

/**
 * Lesotho
 */
  LS = "LS",

/**
 * Liberia
 */
  LR = "LR",

/**
 * Libya
 */
  LY = "LY",

/**
 * Liechtenstein
 */
  LI = "LI",

/**
 * Lithuania
 */
  LT = "LT",

/**
 * Luxembourg
 */
  LU = "LU",

/**
 * Macau SAR China
 */
  MO = "MO",

/**
 * Macedonia
 */
  MK = "MK",

/**
 * Madagascar
 */
  MG = "MG",

/**
 * Malawi
 */
  MW = "MW",

/**
 * Malaysia
 */
  MY = "MY",

/**
 * Maldives
 */
  MV = "MV",

/**
 * Mali
 */
  ML = "ML",

/**
 * Malta
 */
  MT = "MT",

/**
 * Marshall Islands
 */
  MH = "MH",

/**
 * Martinique
 */
  MQ = "MQ",

/**
 * Mauritania
 */
  MR = "MR",

/**
 * Mauritius
 */
  MU = "MU",

/**
 * Mayotte
 */
  YT = "YT",

/**
 * Mexico
 */
  MX = "MX",

/**
 * Micronesia
 */
  FM = "FM",

/**
 * Moldova
 */
  MD = "MD",

/**
 * Monaco
 */
  MC = "MC",

/**
 * Mongolia
 */
  MN = "MN",

/**
 * Montenegro
 */
  ME = "ME",

/**
 * Montserrat
 */
  MS = "MS",

/**
 * Morocco
 */
  MA = "MA",

/**
 * Mozambique
 */
  MZ = "MZ",

/**
 * Myanmar (Burma)
 */
  MM = "MM",

/**
 * Namibia
 */
  NA = "NA",

/**
 * Nauru
 */
  NR = "NR",

/**
 * Nepal
 */
  NP = "NP",

/**
 * Netherlands
 */
  NL = "NL",

/**
 * Netherlands Antilles
 */
  AN = "AN",

/**
 * New Caledonia
 */
  NC = "NC",

/**
 * New Zealand
 */
  NZ = "NZ",

/**
 * Nicaragua
 */
  NI = "NI",

/**
 * Niger
 */
  NE = "NE",

/**
 * Nigeria
 */
  NG = "NG",

/**
 * Niue
 */
  NU = "NU",

/**
 * Norfolk Island
 */
  NF = "NF",

/**
 * Northern Mariana Islands
 */
  MP = "MP",

/**
 * North Korea
 */
  KP = "KP",

/**
 * Norway
 */
  NO = "NO",

/**
 * Oman
 */
  OM = "OM",

/**
 * Pakistan
 */
  PK = "PK",

/**
 * Palau
 */
  PW = "PW",

/**
 * Palestinian Territories
 */
  PS = "PS",

/**
 * Panama
 */
  PA = "PA",

/**
 * Papua New Guinea
 */
  PG = "PG",

/**
 * Paraguay
 */
  PY = "PY",

/**
 * Peru
 */
  PE = "PE",

/**
 * Philippines
 */
  PH = "PH",

/**
 * Pitcairn Islands
 */
  PN = "PN",

/**
 * Poland
 */
  PL = "PL",

/**
 * Portugal
 */
  PT = "PT",

/**
 * Qatar
 */
  QA = "QA",

/**
 * Réunion
 */
  RE = "RE",

/**
 * Romania
 */
  RO = "RO",

/**
 * Russia
 */
  RU = "RU",

/**
 * Rwanda
 */
  RW = "RW",

/**
 * Samoa
 */
  WS = "WS",

/**
 * San Marino
 */
  SM = "SM",

/**
 * São Tomé & Príncipe
 */
  ST = "ST",

/**
 * Saudi Arabia
 */
  SA = "SA",

/**
 * Senegal
 */
  SN = "SN",

/**
 * Serbia
 */
  RS = "RS",

/**
 * Seychelles
 */
  SC = "SC",

/**
 * Sierra Leone
 */
  SL = "SL",

/**
 * Singapore
 */
  SG = "SG",

/**
 * Slovakia
 */
  SK = "SK",

/**
 * Slovenia
 */
  SI = "SI",

/**
 * Solomon Islands
 */
  SB = "SB",

/**
 * Somalia
 */
  SO = "SO",

/**
 * South Africa
 */
  ZA = "ZA",

/**
 * South Georgia & South Sandwich Islands
 */
  GS = "GS",

/**
 * South Korea
 */
  KR = "KR",

/**
 * Spain
 */
  ES = "ES",

/**
 * Sri Lanka
 */
  LK = "LK",

/**
 * St. Barthélemy
 */
  BL = "BL",

/**
 * St. Helena
 */
  SH = "SH",

/**
 * St. Kitts & Nevis
 */
  KN = "KN",

/**
 * St. Lucia
 */
  LC = "LC",

/**
 * St. Martin
 */
  MF = "MF",

/**
 * St. Pierre & Miquelon
 */
  PM = "PM",

/**
 * St. Vincent & Grenadines
 */
  VC = "VC",

/**
 * Sudan
 */
  SD = "SD",

/**
 * Suriname
 */
  SR = "SR",

/**
 * Svalbard & Jan Mayen
 */
  SJ = "SJ",

/**
 * Sweden
 */
  SE = "SE",

/**
 * Switzerland
 */
  CH = "CH",

/**
 * Syria
 */
  SY = "SY",

/**
 * Taiwan
 */
  TW = "TW",

/**
 * Tajikistan
 */
  TJ = "TJ",

/**
 * Tanzania
 */
  TZ = "TZ",

/**
 * Thailand
 */
  TH = "TH",

/**
 * Timor-Leste
 */
  TL = "TL",

/**
 * Togo
 */
  TG = "TG",

/**
 * Tokelau
 */
  TK = "TK",

/**
 * Tonga
 */
  TO = "TO",

/**
 * Trinidad & Tobago
 */
  TT = "TT",

/**
 * Tunisia
 */
  TN = "TN",

/**
 * Turkey
 */
  TR = "TR",

/**
 * Turkmenistan
 */
  TM = "TM",

/**
 * Turks & Caicos Islands
 */
  TC = "TC",

/**
 * Tuvalu
 */
  TV = "TV",

/**
 * Uganda
 */
  UG = "UG",

/**
 * Ukraine
 */
  UA = "UA",

/**
 * United Arab Emirates
 */
  AE = "AE",

/**
 * United Kingdom
 */
  GB = "GB",

/**
 * United States
 */
  US = "US",

/**
 * Uruguay
 */
  UY = "UY",

/**
 * U.S. Outlying Islands
 */
  UM = "UM",

/**
 * U.S. Virgin Islands
 */
  VI = "VI",

/**
 * Uzbekistan
 */
  UZ = "UZ",

/**
 * Vanuatu
 */
  VU = "VU",

/**
 * Vatican City
 */
  VA = "VA",

/**
 * Venezuela
 */
  VE = "VE",

/**
 * Vietnam
 */
  VN = "VN",

/**
 * Wallis & Futuna
 */
  WF = "WF",

/**
 * Western Sahara
 */
  EH = "EH",

/**
 * Yemen
 */
  YE = "YE",

/**
 * Zambia
 */
  ZM = "ZM",

/**
 * Zimbabwe
 */
  ZW = "ZW"
}
  


/**
 * Customer attribute metadata.
 */
export class CustomerAttributeMetadata extends $Base<"CustomerAttributeMetadata"> {
  constructor() {
    super("CustomerAttributeMetadata")
  }

  
      
/**
 * The unique identifier for an attribute code. This value should be in lowercase letters without spaces.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * Default attribute value.
 */
      get default_value(): $Field<"default_value", string | null>  {
       return this.$_select("default_value") as any
      }

      
/**
 * The type of entity that defines the attribute.
 */
      get entity_type(): $Field<"entity_type", AttributeEntityTypeEnum>  {
       return this.$_select("entity_type") as any
      }

      
/**
 * The frontend class of the attribute.
 */
      get frontend_class(): $Field<"frontend_class", string | null>  {
       return this.$_select("frontend_class") as any
      }

      
/**
 * The frontend input type of the attribute.
 */
      get frontend_input(): $Field<"frontend_input", AttributeFrontendInputEnum | null>  {
       return this.$_select("frontend_input") as any
      }

      
/**
 * The template used for the input of the attribute (e.g., 'date').
 */
      get input_filter(): $Field<"input_filter", InputFilterEnum | null>  {
       return this.$_select("input_filter") as any
      }

      
/**
 * Whether the attribute value is required.
 */
      get is_required(): $Field<"is_required", boolean>  {
       return this.$_select("is_required") as any
      }

      
/**
 * Whether the attribute value must be unique.
 */
      get is_unique(): $Field<"is_unique", boolean>  {
       return this.$_select("is_unique") as any
      }

      
/**
 * The label assigned to the attribute.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * The number of lines of the attribute value.
 */
      get multiline_count(): $Field<"multiline_count", number | null>  {
       return this.$_select("multiline_count") as any
      }

      
/**
 * Attribute options.
 */
      options<Sel extends Selection<CustomAttributeOptionInterface>>(selectorFn: (s: CustomAttributeOptionInterface) => [...Sel]):$Field<"options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomAttributeOptionInterface)
      };
      return this.$_select("options", options as any) as any
    }
  

      
/**
 * The position of the attribute in the form.
 */
      get sort_order(): $Field<"sort_order", number | null>  {
       return this.$_select("sort_order") as any
      }

      
/**
 * The validation rules of the attribute value.
 */
      validate_rules<Sel extends Selection<ValidationRule>>(selectorFn: (s: ValidationRule) => [...Sel]):$Field<"validate_rules", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ValidationRule)
      };
      return this.$_select("validate_rules", options as any) as any
    }
  
}

  
/**
 * List of templates/filters applied to customer attribute input.
 */
export enum InputFilterEnum {
  
/**
 * There are no templates or filters to be applied.
 */
  NONE = "NONE",

/**
 * Forces attribute input to follow the date format.
 */
  DATE = "DATE",

/**
 * Strip whitespace (or other characters) from the beginning and end of the input.
 */
  TRIM = "TRIM",

/**
 * Strip HTML Tags.
 */
  STRIPTAGS = "STRIPTAGS",

/**
 * Escape HTML Entities.
 */
  ESCAPEHTML = "ESCAPEHTML"
}
  


/**
 * Defines a customer attribute validation rule.
 */
export class ValidationRule extends $Base<"ValidationRule"> {
  constructor() {
    super("ValidationRule")
  }

  
      
/**
 * Validation rule name applied to a customer attribute.
 */
      get name(): $Field<"name", ValidationRuleEnum | null>  {
       return this.$_select("name") as any
      }

      
/**
 * Validation rule value.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}

  
/**
 * List of validation rule names applied to a customer attribute.
 */
export enum ValidationRuleEnum {
  
  DATE_RANGE_MAX = "DATE_RANGE_MAX",

  DATE_RANGE_MIN = "DATE_RANGE_MIN",

  FILE_EXTENSIONS = "FILE_EXTENSIONS",

  INPUT_VALIDATION = "INPUT_VALIDATION",

  MAX_TEXT_LENGTH = "MAX_TEXT_LENGTH",

  MIN_TEXT_LENGTH = "MIN_TEXT_LENGTH",

  MAX_FILE_SIZE = "MAX_FILE_SIZE",

  MAX_IMAGE_HEIGHT = "MAX_IMAGE_HEIGHT",

  MAX_IMAGE_WIDTH = "MAX_IMAGE_WIDTH"
}
  

  
/**
 * List of account confirmation statuses.
 */
export enum ConfirmationStatusEnum {
  
/**
 * Account confirmed
 */
  ACCOUNT_CONFIRMED = "ACCOUNT_CONFIRMED",

/**
 * Account confirmation not required
 */
  ACCOUNT_CONFIRMATION_NOT_REQUIRED = "ACCOUNT_CONFIRMATION_NOT_REQUIRED"
}
  


/**
 * Contains the result of the `subscribeEmailToNewsletter` operation.
 */
export class SubscribeEmailToNewsletterOutput extends $Base<"SubscribeEmailToNewsletterOutput"> {
  constructor() {
    super("SubscribeEmailToNewsletterOutput")
  }

  
      
/**
 * The status of the subscription request.
 */
      get status(): $Field<"status", SubscriptionStatusesEnum | null>  {
       return this.$_select("status") as any
      }
}

  
/**
 * Indicates the status of the request.
 */
export enum SubscriptionStatusesEnum {
  
  NOT_ACTIVE = "NOT_ACTIVE",

  SUBSCRIBED = "SUBSCRIBED",

  UNSUBSCRIBED = "UNSUBSCRIBED",

  UNCONFIRMED = "UNCONFIRMED"
}
  


export class CancellationReason extends $Base<"CancellationReason"> {
  constructor() {
    super("CancellationReason")
  }

  
      
      get description(): $Field<"description", string>  {
       return this.$_select("description") as any
      }
}


/**
 * Defines the order to cancel.
 */
export type CancelOrderInput = {
  order_id: string,
reason: string
}
    


export type ConfirmCancelOrderInput = {
  confirmation_key: string,
order_id: string
}
    


/**
 * Input to retrieve a guest order based on token.
 */
export type GuestOrderCancelInput = {
  reason: string,
token: string
}
    


/**
 * Contains the updated customer order and error message if any.
 */
export class CancelOrderOutput extends $Base<"CancelOrderOutput"> {
  constructor() {
    super("CancelOrderOutput")
  }

  
      
/**
 * Error encountered while cancelling the order.
 */
      get error(): $Field<"error", string | null>  {
       return this.$_select("error") as any
      }

      
      errorV2<Sel extends Selection<CancelOrderError>>(selectorFn: (s: CancelOrderError) => [...Sel]):$Field<"errorV2", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CancelOrderError)
      };
      return this.$_select("errorV2", options as any) as any
    }
  

      
/**
 * Updated customer order.
 */
      order<Sel extends Selection<CustomerOrder>>(selectorFn: (s: CustomerOrder) => [...Sel]):$Field<"order", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerOrder)
      };
      return this.$_select("order", options as any) as any
    }
  
}


export class CancelOrderError extends $Base<"CancelOrderError"> {
  constructor() {
    super("CancelOrderError")
  }

  
      
/**
 * An error code that is specific to cancel order.
 */
      get code(): $Field<"code", CancelOrderErrorCode>  {
       return this.$_select("code") as any
      }

      
/**
 * A localized error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }
}

  
export enum CancelOrderErrorCode {
  
  ORDER_CANCELLATION_DISABLED = "ORDER_CANCELLATION_DISABLED",

  UNDEFINED = "UNDEFINED",

  UNAUTHORISED = "UNAUTHORISED",

  ORDER_NOT_FOUND = "ORDER_NOT_FOUND",

  PARTIAL_ORDER_ITEM_SHIPPED = "PARTIAL_ORDER_ITEM_SHIPPED",

  INVALID_ORDER_STATUS = "INVALID_ORDER_STATUS"
}
  

  
/**
 * The list of available order actions.
 */
export enum OrderActionType {
  
  CANCEL = "CANCEL",

  REORDER = "REORDER"
}
  

  
export enum ReCaptchaFormEnum {
  
  PLACE_ORDER = "PLACE_ORDER",

  CONTACT = "CONTACT",

  CUSTOMER_LOGIN = "CUSTOMER_LOGIN",

  CUSTOMER_FORGOT_PASSWORD = "CUSTOMER_FORGOT_PASSWORD",

  CUSTOMER_CREATE = "CUSTOMER_CREATE",

  CUSTOMER_EDIT = "CUSTOMER_EDIT",

  NEWSLETTER = "NEWSLETTER",

  PRODUCT_REVIEW = "PRODUCT_REVIEW",

  SENDFRIEND = "SENDFRIEND",

  BRAINTREE = "BRAINTREE",

  RESEND_CONFIRMATION_EMAIL = "RESEND_CONFIRMATION_EMAIL"
}
  

  
export enum ReCaptchaTypeEmum {
  
  INVISIBLE = "INVISIBLE",

  RECAPTCHA = "RECAPTCHA",

  RECAPTCHA_V3 = "RECAPTCHA_V3"
}
  


export class ReCaptchaConfigOutput extends $Base<"ReCaptchaConfigOutput"> {
  constructor() {
    super("ReCaptchaConfigOutput")
  }

  
      
/**
 * Configuration details for reCaptcha type
 */
      configurations<Sel extends Selection<ReCaptchaConfiguration>>(selectorFn: (s: ReCaptchaConfiguration) => [...Sel]):$Field<"configurations", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ReCaptchaConfiguration)
      };
      return this.$_select("configurations", options as any) as any
    }
  

      
/**
 * Indicates whether reCaptcha type is enabled
 */
      get is_enabled(): $Field<"is_enabled", boolean>  {
       return this.$_select("is_enabled") as any
      }
}


/**
 * Contains reCAPTCHA form configuration details.
 */
export class ReCaptchaConfiguration extends $Base<"ReCaptchaConfiguration"> {
  constructor() {
    super("ReCaptchaConfiguration")
  }

  
      
/**
 * The position of the invisible reCAPTCHA badge on each page.
 */
      get badge_position(): $Field<"badge_position", string | null>  {
       return this.$_select("badge_position") as any
      }

      
/**
 * A two-character code that specifies the language that is used for Google reCAPTCHA text and messaging.
 */
      get language_code(): $Field<"language_code", string | null>  {
       return this.$_select("language_code") as any
      }

      
/**
 * The minimum score that identifies a user interaction as a potential risk.
 */
      get minimum_score(): $Field<"minimum_score", number | null>  {
       return this.$_select("minimum_score") as any
      }

      
      get re_captcha_type(): $Field<"re_captcha_type", ReCaptchaTypeEmum>  {
       return this.$_select("re_captcha_type") as any
      }

      
/**
 * The message that appears when reCaptcha fails.
 */
      get technical_failure_message(): $Field<"technical_failure_message", string>  {
       return this.$_select("technical_failure_message") as any
      }

      
/**
 * Theme to be used to render reCaptcha.
 */
      get theme(): $Field<"theme", string>  {
       return this.$_select("theme") as any
      }

      
/**
 * The message that appears to the user if validation fails.
 */
      get validation_failure_message(): $Field<"validation_failure_message", string>  {
       return this.$_select("validation_failure_message") as any
      }

      
/**
 * The website key generated when the Google reCAPTCHA account was registered.
 */
      get website_key(): $Field<"website_key", string>  {
       return this.$_select("website_key") as any
      }
}


/**
 * Contains reCAPTCHA V3-Invisible configuration details.
 */
export class ReCaptchaConfigurationV3 extends $Base<"ReCaptchaConfigurationV3"> {
  constructor() {
    super("ReCaptchaConfigurationV3")
  }

  
      
/**
 * The position of the invisible reCAPTCHA badge on each page.
 */
      get badge_position(): $Field<"badge_position", string>  {
       return this.$_select("badge_position") as any
      }

      
/**
 * The message that appears to the user if validation fails.
 */
      get failure_message(): $Field<"failure_message", string>  {
       return this.$_select("failure_message") as any
      }

      
/**
 * A list of forms on the storefront that have been configured to use reCAPTCHA V3.
 */
      get forms(): $Field<"forms", Readonly<Array<ReCaptchaFormEnum | null>>>  {
       return this.$_select("forms") as any
      }

      
/**
 * Return whether recaptcha is enabled or not
 */
      get is_enabled(): $Field<"is_enabled", boolean>  {
       return this.$_select("is_enabled") as any
      }

      
/**
 * A two-character code that specifies the language that is used for Google reCAPTCHA text and messaging.
 */
      get language_code(): $Field<"language_code", string | null>  {
       return this.$_select("language_code") as any
      }

      
/**
 * The minimum score that identifies a user interaction as a potential risk.
 */
      get minimum_score(): $Field<"minimum_score", number>  {
       return this.$_select("minimum_score") as any
      }

      
/**
 * Theme to be used to render reCaptcha.
 */
      get theme(): $Field<"theme", string>  {
       return this.$_select("theme") as any
      }

      
/**
 * The website key generated when the Google reCAPTCHA account was registered.
 */
      get website_key(): $Field<"website_key", string>  {
       return this.$_select("website_key") as any
      }
}


/**
 * Contains an array of product reviews.
 */
export class ProductReviews extends $Base<"ProductReviews"> {
  constructor() {
    super("ProductReviews")
  }

  
      
/**
 * An array of product reviews.
 */
      items<Sel extends Selection<ProductReview>>(selectorFn: (s: ProductReview) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductReview)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * Metadata for pagination rendering.
 */
      page_info<Sel extends Selection<SearchResultPageInfo>>(selectorFn: (s: SearchResultPageInfo) => [...Sel]):$Field<"page_info", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchResultPageInfo)
      };
      return this.$_select("page_info", options as any) as any
    }
  
}


/**
 * Contains details of a product review.
 */
export class ProductReview extends $Base<"ProductReview"> {
  constructor() {
    super("ProductReview")
  }

  
      
/**
 * The average of all ratings for this product.
 */
      get average_rating(): $Field<"average_rating", number>  {
       return this.$_select("average_rating") as any
      }

      
/**
 * The date the review was created.
 */
      get created_at(): $Field<"created_at", string>  {
       return this.$_select("created_at") as any
      }

      
/**
 * The customer's nickname. Defaults to the customer name, if logged in.
 */
      get nickname(): $Field<"nickname", string>  {
       return this.$_select("nickname") as any
      }

      
/**
 * The reviewed product.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * An array of ratings by rating category, such as quality, price, and value.
 */
      ratings_breakdown<Sel extends Selection<ProductReviewRating>>(selectorFn: (s: ProductReviewRating) => [...Sel]):$Field<"ratings_breakdown", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductReviewRating)
      };
      return this.$_select("ratings_breakdown", options as any) as any
    }
  

      
/**
 * The summary (title) of the review.
 */
      get summary(): $Field<"summary", string>  {
       return this.$_select("summary") as any
      }

      
/**
 * The review text.
 */
      get text(): $Field<"text", string>  {
       return this.$_select("text") as any
      }
}


/**
 * Contains data about a single aspect of a product review.
 */
export class ProductReviewRating extends $Base<"ProductReviewRating"> {
  constructor() {
    super("ProductReviewRating")
  }

  
      
/**
 * The label assigned to an aspect of a product that is being rated, such as quality or price.
 */
      get name(): $Field<"name", string>  {
       return this.$_select("name") as any
      }

      
/**
 * The rating value given by customer. By default, possible values range from 1 to 5.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


/**
 * Contains an array of metadata about each aspect of a product review.
 */
export class ProductReviewRatingsMetadata extends $Base<"ProductReviewRatingsMetadata"> {
  constructor() {
    super("ProductReviewRatingsMetadata")
  }

  
      
/**
 * An array of product reviews sorted by position.
 */
      items<Sel extends Selection<ProductReviewRatingMetadata>>(selectorFn: (s: ProductReviewRatingMetadata) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductReviewRatingMetadata)
      };
      return this.$_select("items", options as any) as any
    }
  
}


/**
 * Contains details about a single aspect of a product review.
 */
export class ProductReviewRatingMetadata extends $Base<"ProductReviewRatingMetadata"> {
  constructor() {
    super("ProductReviewRatingMetadata")
  }

  
      
/**
 * An encoded rating ID.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The label assigned to an aspect of a product that is being rated, such as quality or price.
 */
      get name(): $Field<"name", string>  {
       return this.$_select("name") as any
      }

      
/**
 * List of product review ratings sorted by position.
 */
      values<Sel extends Selection<ProductReviewRatingValueMetadata>>(selectorFn: (s: ProductReviewRatingValueMetadata) => [...Sel]):$Field<"values", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductReviewRatingValueMetadata)
      };
      return this.$_select("values", options as any) as any
    }
  
}


/**
 * Contains details about a single value in a product review.
 */
export class ProductReviewRatingValueMetadata extends $Base<"ProductReviewRatingValueMetadata"> {
  constructor() {
    super("ProductReviewRatingValueMetadata")
  }

  
      
/**
 * A ratings scale, such as the number of stars awarded.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }

      
/**
 * An encoded rating value ID.
 */
      get value_id(): $Field<"value_id", string>  {
       return this.$_select("value_id") as any
      }
}


/**
 * Contains the completed product review.
 */
export class CreateProductReviewOutput extends $Base<"CreateProductReviewOutput"> {
  constructor() {
    super("CreateProductReviewOutput")
  }

  
      
/**
 * Product review details.
 */
      review<Sel extends Selection<ProductReview>>(selectorFn: (s: ProductReview) => [...Sel]):$Field<"review", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductReview)
      };
      return this.$_select("review", options as any) as any
    }
  
}


/**
 * Defines a new product review.
 */
export type CreateProductReviewInput = {
  nickname: string,
ratings: Readonly<Array<ProductReviewRatingInput | null>>,
sku: string,
summary: string,
text: string
}
    


/**
 * Contains the reviewer's rating for a single aspect of a review.
 */
export type ProductReviewRatingInput = {
  id: string,
value_id: string
}
    


/**
 * Contains the cart and any errors after adding products.
 */
export class ReorderItemsOutput extends $Base<"ReorderItemsOutput"> {
  constructor() {
    super("ReorderItemsOutput")
  }

  
      
/**
 * Detailed information about the customer's cart.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  

      
/**
 * An array of reordering errors.
 */
      userInputErrors<Sel extends Selection<CheckoutUserInputError>>(selectorFn: (s: CheckoutUserInputError) => [...Sel]):$Field<"userInputErrors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CheckoutUserInputError)
      };
      return this.$_select("userInputErrors", options as any) as any
    }
  
}


/**
 * An error encountered while adding an item to the cart.
 */
export class CheckoutUserInputError extends $Base<"CheckoutUserInputError"> {
  constructor() {
    super("CheckoutUserInputError")
  }

  
      
/**
 * An error code that is specific to Checkout.
 */
      get code(): $Field<"code", CheckoutUserInputErrorCodes>  {
       return this.$_select("code") as any
      }

      
/**
 * A localized error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }

      
/**
 * The path to the input field that caused an error. See the GraphQL specification about path errors for details: http://spec.graphql.org/draft/#sec-Errors
 */
      get path(): $Field<"path", Readonly<Array<string | null>>>  {
       return this.$_select("path") as any
      }
}


/**
 * Identifies the filter to use for filtering orders.
 */
export type CustomerOrdersFilterInput = {
  grand_total?: FilterRangeTypeInput | null,
number?: FilterStringTypeInput | null,
order_date?: FilterRangeTypeInput | null,
status?: FilterEqualTypeInput | null
}
    


/**
 * CustomerOrderSortInput specifies the field to use for sorting search results and indicates whether the results are sorted in ascending or descending order.
 */
export type CustomerOrderSortInput = {
  sort_direction: SortEnum,
sort_field: CustomerOrderSortableField
}
    

  
/**
 * Specifies the field to use for sorting
 */
export enum CustomerOrderSortableField {
  
/**
 * Sorts customer orders by number
 */
  NUMBER = "NUMBER",

/**
 * Sorts customer orders by created_at field
 */
  CREATED_AT = "CREATED_AT"
}
  


/**
 * The collection of orders that match the conditions defined in the filter.
 */
export class CustomerOrders extends $Base<"CustomerOrders"> {
  constructor() {
    super("CustomerOrders")
  }

  
      
/**
 * Date of the first order placed in the store
 */
      get date_of_first_order(): $Field<"date_of_first_order", string | null>  {
       return this.$_select("date_of_first_order") as any
      }

      
/**
 * An array of customer orders.
 */
      items<Sel extends Selection<CustomerOrder>>(selectorFn: (s: CustomerOrder) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerOrder)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * Contains pagination metadata.
 */
      page_info<Sel extends Selection<SearchResultPageInfo>>(selectorFn: (s: SearchResultPageInfo) => [...Sel]):$Field<"page_info", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchResultPageInfo)
      };
      return this.$_select("page_info", options as any) as any
    }
  

      
/**
 * The total count of customer orders.
 */
      get total_count(): $Field<"total_count", number | null>  {
       return this.$_select("total_count") as any
      }
}


export class OrderCustomerInfo extends $Base<"OrderCustomerInfo"> {
  constructor() {
    super("OrderCustomerInfo")
  }

  
      
/**
 * First name of the customer
 */
      get firstname(): $Field<"firstname", string>  {
       return this.$_select("firstname") as any
      }

      
/**
 * Last name of the customer
 */
      get lastname(): $Field<"lastname", string | null>  {
       return this.$_select("lastname") as any
      }

      
/**
 * Middle name of the customer
 */
      get middlename(): $Field<"middlename", string | null>  {
       return this.$_select("middlename") as any
      }

      
/**
 * Prefix of the customer
 */
      get prefix(): $Field<"prefix", string | null>  {
       return this.$_select("prefix") as any
      }

      
/**
 * Suffix of the customer
 */
      get suffix(): $Field<"suffix", string | null>  {
       return this.$_select("suffix") as any
      }
}


/**
 * Contains detailed information about an order's billing and shipping addresses.
 */
export class OrderAddress extends $Base<"OrderAddress"> {
  constructor() {
    super("OrderAddress")
  }

  
      
/**
 * The city or town.
 */
      get city(): $Field<"city", string>  {
       return this.$_select("city") as any
      }

      
/**
 * The customer's company.
 */
      get company(): $Field<"company", string | null>  {
       return this.$_select("company") as any
      }

      
/**
 * The customer's country.
 */
      get country_code(): $Field<"country_code", CountryCodeEnum | null>  {
       return this.$_select("country_code") as any
      }

      
/**
 * The fax number.
 */
      get fax(): $Field<"fax", string | null>  {
       return this.$_select("fax") as any
      }

      
/**
 * The first name of the person associated with the shipping/billing address.
 */
      get firstname(): $Field<"firstname", string>  {
       return this.$_select("firstname") as any
      }

      
/**
 * The family name of the person associated with the shipping/billing address.
 */
      get lastname(): $Field<"lastname", string>  {
       return this.$_select("lastname") as any
      }

      
/**
 * The middle name of the person associated with the shipping/billing address.
 */
      get middlename(): $Field<"middlename", string | null>  {
       return this.$_select("middlename") as any
      }

      
/**
 * The customer's ZIP or postal code.
 */
      get postcode(): $Field<"postcode", string | null>  {
       return this.$_select("postcode") as any
      }

      
/**
 * An honorific, such as Dr., Mr., or Mrs.
 */
      get prefix(): $Field<"prefix", string | null>  {
       return this.$_select("prefix") as any
      }

      
/**
 * The state or province name.
 */
      get region(): $Field<"region", string | null>  {
       return this.$_select("region") as any
      }

      
/**
 * The unique ID for a `Region` object of a pre-defined region.
 */
      get region_id(): $Field<"region_id", string | null>  {
       return this.$_select("region_id") as any
      }

      
/**
 * An array of strings that define the street number and name.
 */
      get street(): $Field<"street", Readonly<Array<string | null>>>  {
       return this.$_select("street") as any
      }

      
/**
 * A value such as Sr., Jr., or III.
 */
      get suffix(): $Field<"suffix", string | null>  {
       return this.$_select("suffix") as any
      }

      
/**
 * The telephone number.
 */
      get telephone(): $Field<"telephone", string | null>  {
       return this.$_select("telephone") as any
      }

      
/**
 * The customer's Value-added tax (VAT) number (for corporate customers).
 */
      get vat_id(): $Field<"vat_id", string | null>  {
       return this.$_select("vat_id") as any
      }
}


export class OrderItem extends $Base<"OrderItem"> {
  constructor() {
    super("OrderItem")
  }

  
      
/**
 * The final discount information for the product.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The entered option for the base product, such as a logo or image.
 */
      entered_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"entered_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("entered_options", options as any) as any
    }
  

      
/**
 * The selected gift message for the order item
 */
      gift_message<Sel extends Selection<GiftMessage>>(selectorFn: (s: GiftMessage) => [...Sel]):$Field<"gift_message", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new GiftMessage)
      };
      return this.$_select("gift_message", options as any) as any
    }
  

      
/**
 * The unique ID for an `OrderItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Contains details about the price of the item, including taxes and discounts.
 */
      prices<Sel extends Selection<OrderItemPrices>>(selectorFn: (s: OrderItemPrices) => [...Sel]):$Field<"prices", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemPrices)
      };
      return this.$_select("prices", options as any) as any
    }
  

      
/**
 * The ProductInterface object, which contains details about the base product
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price of the base product, including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The type of product, such as simple, configurable, etc.
 */
      get product_type(): $Field<"product_type", string | null>  {
       return this.$_select("product_type") as any
      }

      
/**
 * URL key of the base product.
 */
      get product_url_key(): $Field<"product_url_key", string | null>  {
       return this.$_select("product_url_key") as any
      }

      
/**
 * The number of canceled items.
 */
      get quantity_canceled(): $Field<"quantity_canceled", number | null>  {
       return this.$_select("quantity_canceled") as any
      }

      
/**
 * The number of invoiced items.
 */
      get quantity_invoiced(): $Field<"quantity_invoiced", number | null>  {
       return this.$_select("quantity_invoiced") as any
      }

      
/**
 * The number of units ordered for this item.
 */
      get quantity_ordered(): $Field<"quantity_ordered", number | null>  {
       return this.$_select("quantity_ordered") as any
      }

      
/**
 * The number of refunded items.
 */
      get quantity_refunded(): $Field<"quantity_refunded", number | null>  {
       return this.$_select("quantity_refunded") as any
      }

      
/**
 * The number of returned items.
 */
      get quantity_returned(): $Field<"quantity_returned", number | null>  {
       return this.$_select("quantity_returned") as any
      }

      
/**
 * The number of shipped items.
 */
      get quantity_shipped(): $Field<"quantity_shipped", number | null>  {
       return this.$_select("quantity_shipped") as any
      }

      
/**
 * The selected options for the base product, such as color or size.
 */
      selected_options<Sel extends Selection<OrderItemOption>>(selectorFn: (s: OrderItemOption) => [...Sel]):$Field<"selected_options", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemOption)
      };
      return this.$_select("selected_options", options as any) as any
    }
  

      
/**
 * The status of the order item.
 */
      get status(): $Field<"status", string | null>  {
       return this.$_select("status") as any
      }
}


export class OrderItemPrices extends $Base<"OrderItemPrices"> {
  constructor() {
    super("OrderItemPrices")
  }

  
      
/**
 * An array of discounts to be applied to the cart item.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
      fixed_product_taxes<Sel extends Selection<FixedProductTax>>(selectorFn: (s: FixedProductTax) => [...Sel]):$Field<"fixed_product_taxes", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new FixedProductTax)
      };
      return this.$_select("fixed_product_taxes", options as any) as any
    }
  

      
/**
 * The original price of the item.
 */
      original_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"original_price", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("original_price", options as any) as any
    }
  

      
/**
 * The original price of the item including tax.
 */
      original_price_including_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"original_price_including_tax", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("original_price_including_tax", options as any) as any
    }
  

      
/**
 * The value of the original price multiplied by the quantity of the item.
 */
      original_row_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"original_row_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("original_row_total", options as any) as any
    }
  

      
/**
 * The value of the original price multiplied by the quantity of the item including tax.
 */
      original_row_total_including_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"original_row_total_including_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("original_row_total_including_tax", options as any) as any
    }
  

      
/**
 * The price of the item before any discounts were applied. The price that might include tax, depending on the configured display settings for cart.
 */
      price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price", options as any) as any
    }
  

      
/**
 * The price of the item before any discounts were applied. The price that might include tax, depending on the configured display settings for cart.
 */
      price_including_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"price_including_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("price_including_tax", options as any) as any
    }
  

      
/**
 * The value of the price multiplied by the quantity of the item.
 */
      row_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"row_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("row_total", options as any) as any
    }
  

      
/**
 * The value of `row_total` plus the tax applied to the item.
 */
      row_total_including_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"row_total_including_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("row_total_including_tax", options as any) as any
    }
  

      
/**
 * The total of all discounts applied to the item.
 */
      total_item_discount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"total_item_discount", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("total_item_discount", options as any) as any
    }
  
}


/**
 * Represents order item options like selected or entered.
 */
export class OrderItemOption extends $Base<"OrderItemOption"> {
  constructor() {
    super("OrderItemOption")
  }

  
      
/**
 * The name of the option.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }

      
/**
 * The value of the option.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


/**
 * Contains tax item details.
 */
export class TaxItem extends $Base<"TaxItem"> {
  constructor() {
    super("TaxItem")
  }

  
      
/**
 * The amount of tax applied to the item.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  

      
/**
 * The rate used to calculate the tax.
 */
      get rate(): $Field<"rate", number>  {
       return this.$_select("rate") as any
      }

      
/**
 * A title that describes the tax.
 */
      get title(): $Field<"title", string>  {
       return this.$_select("title") as any
      }
}


/**
 * Contains details about the sales total amounts used to calculate the final price.
 */
export class OrderTotal extends $Base<"OrderTotal"> {
  constructor() {
    super("OrderTotal")
  }

  
      
/**
 * The final base grand total amount in the base currency.
 */
      base_grand_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"base_grand_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("base_grand_total", options as any) as any
    }
  

      
/**
 * The applied discounts to the order.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The final total amount, including shipping, discounts, and taxes.
 */
      grand_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"grand_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("grand_total", options as any) as any
    }
  

      
/**
 * Details about the shipping and handling costs for the order.
 */
      shipping_handling<Sel extends Selection<ShippingHandling>>(selectorFn: (s: ShippingHandling) => [...Sel]):$Field<"shipping_handling", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ShippingHandling)
      };
      return this.$_select("shipping_handling", options as any) as any
    }
  

      
/**
 * The subtotal of the order, excluding shipping, discounts, and taxes.
 */
      subtotal<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"subtotal", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("subtotal", options as any) as any
    }
  

      
/**
 * The subtotal of the order, excluding taxes.
 */
      subtotal_excl_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"subtotal_excl_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("subtotal_excl_tax", options as any) as any
    }
  

      
/**
 * The subtotal of the order, including taxes.
 */
      subtotal_incl_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"subtotal_incl_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("subtotal_incl_tax", options as any) as any
    }
  

      
/**
 * The order tax details.
 */
      taxes<Sel extends Selection<TaxItem>>(selectorFn: (s: TaxItem) => [...Sel]):$Field<"taxes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TaxItem)
      };
      return this.$_select("taxes", options as any) as any
    }
  

      
/**
 * The shipping amount for the order.
 */
      total_shipping<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"total_shipping", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("total_shipping", options as any) as any
    }
  

      
/**
 * The amount of tax applied to the order.
 */
      total_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"total_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("total_tax", options as any) as any
    }
  
}


/**
 * Contains invoice details.
 */
export class Invoice extends $Base<"Invoice"> {
  constructor() {
    super("Invoice")
  }

  
      
/**
 * Comments on the invoice.
 */
      comments<Sel extends Selection<SalesCommentItem>>(selectorFn: (s: SalesCommentItem) => [...Sel]):$Field<"comments", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SalesCommentItem)
      };
      return this.$_select("comments", options as any) as any
    }
  

      
/**
 * The unique ID for a `Invoice` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Invoiced product details.
 */
      items<Sel extends Selection<InvoiceItemInterface>>(selectorFn: (s: InvoiceItemInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new InvoiceItemInterface)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * Sequential invoice number.
 */
      get number(): $Field<"number", string>  {
       return this.$_select("number") as any
      }

      
/**
 * Invoice total amount details.
 */
      total<Sel extends Selection<InvoiceTotal>>(selectorFn: (s: InvoiceTotal) => [...Sel]):$Field<"total", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new InvoiceTotal)
      };
      return this.$_select("total", options as any) as any
    }
  
}


/**
 * Contains detailes about invoiced items.
 */
export class InvoiceItemInterface extends $Interface<{DownloadableInvoiceItem: DownloadableInvoiceItem,BundleInvoiceItem: BundleInvoiceItem,InvoiceItem: InvoiceItem}, "InvoiceItemInterface"> {
  constructor() {
    super({DownloadableInvoiceItem: DownloadableInvoiceItem,BundleInvoiceItem: BundleInvoiceItem,InvoiceItem: InvoiceItem}, "InvoiceItemInterface")
  }
  
      
/**
 * Information about the final discount amount for the base product, including discounts on options.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The unique ID for an `InvoiceItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Details about an individual order item.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of invoiced items.
 */
      get quantity_invoiced(): $Field<"quantity_invoiced", number | null>  {
       return this.$_select("quantity_invoiced") as any
      }
}


export class InvoiceItem extends $Base<"InvoiceItem"> {
  constructor() {
    super("InvoiceItem")
  }

  
      
/**
 * Information about the final discount amount for the base product, including discounts on options.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The unique ID for an `InvoiceItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Details about an individual order item.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of invoiced items.
 */
      get quantity_invoiced(): $Field<"quantity_invoiced", number | null>  {
       return this.$_select("quantity_invoiced") as any
      }
}


/**
 * Contains price details from an invoice.
 */
export class InvoiceTotal extends $Base<"InvoiceTotal"> {
  constructor() {
    super("InvoiceTotal")
  }

  
      
/**
 * The final base grand total amount in the base currency.
 */
      base_grand_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"base_grand_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("base_grand_total", options as any) as any
    }
  

      
/**
 * The applied discounts to the invoice.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The final total amount, including shipping, discounts, and taxes.
 */
      grand_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"grand_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("grand_total", options as any) as any
    }
  

      
/**
 * Details about the shipping and handling costs for the invoice.
 */
      shipping_handling<Sel extends Selection<ShippingHandling>>(selectorFn: (s: ShippingHandling) => [...Sel]):$Field<"shipping_handling", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ShippingHandling)
      };
      return this.$_select("shipping_handling", options as any) as any
    }
  

      
/**
 * The subtotal of the invoice, excluding shipping, discounts, and taxes.
 */
      subtotal<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"subtotal", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("subtotal", options as any) as any
    }
  

      
/**
 * The invoice tax details.
 */
      taxes<Sel extends Selection<TaxItem>>(selectorFn: (s: TaxItem) => [...Sel]):$Field<"taxes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TaxItem)
      };
      return this.$_select("taxes", options as any) as any
    }
  

      
/**
 * The shipping amount for the invoice.
 */
      total_shipping<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"total_shipping", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("total_shipping", options as any) as any
    }
  

      
/**
 * The amount of tax applied to the invoice.
 */
      total_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"total_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("total_tax", options as any) as any
    }
  
}


/**
 * Contains details about shipping and handling costs.
 */
export class ShippingHandling extends $Base<"ShippingHandling"> {
  constructor() {
    super("ShippingHandling")
  }

  
      
/**
 * The shipping amount, excluding tax.
 */
      amount_excluding_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount_excluding_tax", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount_excluding_tax", options as any) as any
    }
  

      
/**
 * The shipping amount, including tax.
 */
      amount_including_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount_including_tax", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount_including_tax", options as any) as any
    }
  

      
/**
 * The applied discounts to the shipping.
 */
      discounts<Sel extends Selection<ShippingDiscount>>(selectorFn: (s: ShippingDiscount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ShippingDiscount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * Details about taxes applied for shipping.
 */
      taxes<Sel extends Selection<TaxItem>>(selectorFn: (s: TaxItem) => [...Sel]):$Field<"taxes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TaxItem)
      };
      return this.$_select("taxes", options as any) as any
    }
  

      
/**
 * The total amount for shipping.
 */
      total_amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"total_amount", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("total_amount", options as any) as any
    }
  
}


/**
 * Defines an individual shipping discount. This discount can be applied to shipping.
 */
export class ShippingDiscount extends $Base<"ShippingDiscount"> {
  constructor() {
    super("ShippingDiscount")
  }

  
      
/**
 * The amount of the discount.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  
}


/**
 * Contains order shipment details.
 */
export class OrderShipment extends $Base<"OrderShipment"> {
  constructor() {
    super("OrderShipment")
  }

  
      
/**
 * Comments added to the shipment.
 */
      comments<Sel extends Selection<SalesCommentItem>>(selectorFn: (s: SalesCommentItem) => [...Sel]):$Field<"comments", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SalesCommentItem)
      };
      return this.$_select("comments", options as any) as any
    }
  

      
/**
 * The unique ID for a `OrderShipment` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * An array of items included in the shipment.
 */
      items<Sel extends Selection<ShipmentItemInterface>>(selectorFn: (s: ShipmentItemInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ShipmentItemInterface)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * The sequential credit shipment number.
 */
      get number(): $Field<"number", string>  {
       return this.$_select("number") as any
      }

      
/**
 * An array of shipment tracking details.
 */
      tracking<Sel extends Selection<ShipmentTracking>>(selectorFn: (s: ShipmentTracking) => [...Sel]):$Field<"tracking", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ShipmentTracking)
      };
      return this.$_select("tracking", options as any) as any
    }
  
}


/**
 * Contains details about a comment.
 */
export class SalesCommentItem extends $Base<"SalesCommentItem"> {
  constructor() {
    super("SalesCommentItem")
  }

  
      
/**
 * The text of the message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }

      
/**
 * The timestamp of the comment.
 */
      get timestamp(): $Field<"timestamp", string>  {
       return this.$_select("timestamp") as any
      }
}


/**
 * Order shipment item details.
 */
export class ShipmentItemInterface extends $Interface<{BundleShipmentItem: BundleShipmentItem,ShipmentItem: ShipmentItem}, "ShipmentItemInterface"> {
  constructor() {
    super({BundleShipmentItem: BundleShipmentItem,ShipmentItem: ShipmentItem}, "ShipmentItemInterface")
  }
  
      
/**
 * The unique ID for a `ShipmentItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The order item associated with the shipment item.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of shipped items.
 */
      get quantity_shipped(): $Field<"quantity_shipped", number>  {
       return this.$_select("quantity_shipped") as any
      }
}


export class ShipmentItem extends $Base<"ShipmentItem"> {
  constructor() {
    super("ShipmentItem")
  }

  
      
/**
 * The unique ID for a `ShipmentItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The order item associated with the shipment item.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of shipped items.
 */
      get quantity_shipped(): $Field<"quantity_shipped", number>  {
       return this.$_select("quantity_shipped") as any
      }
}


/**
 * Contains order shipment tracking details.
 */
export class ShipmentTracking extends $Base<"ShipmentTracking"> {
  constructor() {
    super("ShipmentTracking")
  }

  
      
/**
 * The shipping carrier for the order delivery.
 */
      get carrier(): $Field<"carrier", string>  {
       return this.$_select("carrier") as any
      }

      
/**
 * The tracking number of the order shipment.
 */
      get number(): $Field<"number", string | null>  {
       return this.$_select("number") as any
      }

      
/**
 * The shipment tracking title.
 */
      get title(): $Field<"title", string>  {
       return this.$_select("title") as any
      }
}


/**
 * Contains details about the payment method used to pay for the order.
 */
export class OrderPaymentMethod extends $Base<"OrderPaymentMethod"> {
  constructor() {
    super("OrderPaymentMethod")
  }

  
      
/**
 * Additional data per payment method type.
 */
      additional_data<Sel extends Selection<KeyValue>>(selectorFn: (s: KeyValue) => [...Sel]):$Field<"additional_data", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new KeyValue)
      };
      return this.$_select("additional_data", options as any) as any
    }
  

      
/**
 * The label that describes the payment method.
 */
      get name(): $Field<"name", string>  {
       return this.$_select("name") as any
      }

      
/**
 * The payment method code that indicates how the order was paid for.
 */
      get type(): $Field<"type", string>  {
       return this.$_select("type") as any
      }
}


/**
 * Contains credit memo details.
 */
export class CreditMemo extends $Base<"CreditMemo"> {
  constructor() {
    super("CreditMemo")
  }

  
      
/**
 * Comments on the credit memo.
 */
      comments<Sel extends Selection<SalesCommentItem>>(selectorFn: (s: SalesCommentItem) => [...Sel]):$Field<"comments", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SalesCommentItem)
      };
      return this.$_select("comments", options as any) as any
    }
  

      
/**
 * The unique ID for a `CreditMemo` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * An array containing details about refunded items.
 */
      items<Sel extends Selection<CreditMemoItemInterface>>(selectorFn: (s: CreditMemoItemInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CreditMemoItemInterface)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * The sequential credit memo number.
 */
      get number(): $Field<"number", string>  {
       return this.$_select("number") as any
      }

      
/**
 * Details about the total refunded amount.
 */
      total<Sel extends Selection<CreditMemoTotal>>(selectorFn: (s: CreditMemoTotal) => [...Sel]):$Field<"total", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CreditMemoTotal)
      };
      return this.$_select("total", options as any) as any
    }
  
}


/**
 * Credit memo item details.
 */
export class CreditMemoItemInterface extends $Interface<{DownloadableCreditMemoItem: DownloadableCreditMemoItem,BundleCreditMemoItem: BundleCreditMemoItem,CreditMemoItem: CreditMemoItem}, "CreditMemoItemInterface"> {
  constructor() {
    super({DownloadableCreditMemoItem: DownloadableCreditMemoItem,BundleCreditMemoItem: BundleCreditMemoItem,CreditMemoItem: CreditMemoItem}, "CreditMemoItemInterface")
  }
  
      
/**
 * Details about the final discount amount for the base product, including discounts on options.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The unique ID for a `CreditMemoItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The order item the credit memo is applied to.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product, including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of refunded items.
 */
      get quantity_refunded(): $Field<"quantity_refunded", number | null>  {
       return this.$_select("quantity_refunded") as any
      }
}


export class CreditMemoItem extends $Base<"CreditMemoItem"> {
  constructor() {
    super("CreditMemoItem")
  }

  
      
/**
 * Details about the final discount amount for the base product, including discounts on options.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The unique ID for a `CreditMemoItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * The order item the credit memo is applied to.
 */
      order_item<Sel extends Selection<OrderItemInterface>>(selectorFn: (s: OrderItemInterface) => [...Sel]):$Field<"order_item", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new OrderItemInterface)
      };
      return this.$_select("order_item", options as any) as any
    }
  

      
/**
 * The name of the base product.
 */
      get product_name(): $Field<"product_name", string | null>  {
       return this.$_select("product_name") as any
      }

      
/**
 * The sale price for the base product, including selected options.
 */
      product_sale_price<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"product_sale_price", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("product_sale_price", options as any) as any
    }
  

      
/**
 * The SKU of the base product.
 */
      get product_sku(): $Field<"product_sku", string>  {
       return this.$_select("product_sku") as any
      }

      
/**
 * The number of refunded items.
 */
      get quantity_refunded(): $Field<"quantity_refunded", number | null>  {
       return this.$_select("quantity_refunded") as any
      }
}


/**
 * Contains credit memo price details.
 */
export class CreditMemoTotal extends $Base<"CreditMemoTotal"> {
  constructor() {
    super("CreditMemoTotal")
  }

  
      
/**
 * An adjustment manually applied to the order.
 */
      adjustment<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"adjustment", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("adjustment", options as any) as any
    }
  

      
/**
 * The final base grand total amount in the base currency.
 */
      base_grand_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"base_grand_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("base_grand_total", options as any) as any
    }
  

      
/**
 * The applied discounts to the credit memo.
 */
      discounts<Sel extends Selection<Discount>>(selectorFn: (s: Discount) => [...Sel]):$Field<"discounts", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Discount)
      };
      return this.$_select("discounts", options as any) as any
    }
  

      
/**
 * The final total amount, including shipping, discounts, and taxes.
 */
      grand_total<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"grand_total", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("grand_total", options as any) as any
    }
  

      
/**
 * Details about the shipping and handling costs for the credit memo.
 */
      shipping_handling<Sel extends Selection<ShippingHandling>>(selectorFn: (s: ShippingHandling) => [...Sel]):$Field<"shipping_handling", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ShippingHandling)
      };
      return this.$_select("shipping_handling", options as any) as any
    }
  

      
/**
 * The subtotal of the invoice, excluding shipping, discounts, and taxes.
 */
      subtotal<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"subtotal", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("subtotal", options as any) as any
    }
  

      
/**
 * The credit memo tax details.
 */
      taxes<Sel extends Selection<TaxItem>>(selectorFn: (s: TaxItem) => [...Sel]):$Field<"taxes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new TaxItem)
      };
      return this.$_select("taxes", options as any) as any
    }
  

      
/**
 * The shipping amount for the credit memo.
 */
      total_shipping<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"total_shipping", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("total_shipping", options as any) as any
    }
  

      
/**
 * The amount of tax applied to the credit memo.
 */
      total_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"total_tax", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("total_tax", options as any) as any
    }
  
}


/**
 * Contains a key-value pair.
 */
export class KeyValue extends $Base<"KeyValue"> {
  constructor() {
    super("KeyValue")
  }

  
      
/**
 * The name part of the key/value pair.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * The value part of the key/value pair.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}

  
export enum CheckoutUserInputErrorCodes {
  
  REORDER_NOT_AVAILABLE = "REORDER_NOT_AVAILABLE",

  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",

  NOT_SALABLE = "NOT_SALABLE",

  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",

  UNDEFINED = "UNDEFINED"
}
  

  
/**
 * This enumeration defines the scope type for customer orders.
 */
export enum ScopeTypeEnum {
  
  GLOBAL = "GLOBAL",

  WEBSITE = "WEBSITE",

  STORE = "STORE"
}
  


/**
 * Input to retrieve an order based on token.
 */
export type OrderTokenInput = {
  token: string
}
    


/**
 * Input to retrieve an order based on details.
 */
export type OrderInformationInput = {
  email: string,
lastname: string,
number: string
}
    


/**
 * Defines the referenced product and the email sender and recipients.
 */
export type SendEmailToFriendInput = {
  product_id: number,
recipients: Readonly<Array<SendEmailToFriendRecipientInput | null>>,
sender: SendEmailToFriendSenderInput
}
    


/**
 * Contains details about the sender.
 */
export type SendEmailToFriendSenderInput = {
  email: string,
message: string,
name: string
}
    


/**
 * Contains details about a recipient.
 */
export type SendEmailToFriendRecipientInput = {
  email: string,
name: string
}
    


/**
 * Contains information about the sender and recipients.
 */
export class SendEmailToFriendOutput extends $Base<"SendEmailToFriendOutput"> {
  constructor() {
    super("SendEmailToFriendOutput")
  }

  
      
/**
 * An array containing information about each recipient.
 */
      recipients<Sel extends Selection<SendEmailToFriendRecipient>>(selectorFn: (s: SendEmailToFriendRecipient) => [...Sel]):$Field<"recipients", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SendEmailToFriendRecipient)
      };
      return this.$_select("recipients", options as any) as any
    }
  

      
/**
 * Information about the customer and the content of the message.
 */
      sender<Sel extends Selection<SendEmailToFriendSender>>(selectorFn: (s: SendEmailToFriendSender) => [...Sel]):$Field<"sender", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SendEmailToFriendSender)
      };
      return this.$_select("sender", options as any) as any
    }
  
}


/**
 * An output object that contains information about the sender.
 */
export class SendEmailToFriendSender extends $Base<"SendEmailToFriendSender"> {
  constructor() {
    super("SendEmailToFriendSender")
  }

  
      
/**
 * The email address of the sender.
 */
      get email(): $Field<"email", string>  {
       return this.$_select("email") as any
      }

      
/**
 * The text of the message to be sent.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }

      
/**
 * The name of the sender.
 */
      get name(): $Field<"name", string>  {
       return this.$_select("name") as any
      }
}


/**
 * An output object that contains information about the recipient.
 */
export class SendEmailToFriendRecipient extends $Base<"SendEmailToFriendRecipient"> {
  constructor() {
    super("SendEmailToFriendRecipient")
  }

  
      
/**
 * The email address of the recipient.
 */
      get email(): $Field<"email", string>  {
       return this.$_select("email") as any
      }

      
/**
 * The name of the recipient.
 */
      get name(): $Field<"name", string>  {
       return this.$_select("name") as any
      }
}


/**
 * Contains details about the configuration of the Email to a Friend feature.
 */
export class SendFriendConfiguration extends $Base<"SendFriendConfiguration"> {
  constructor() {
    super("SendFriendConfiguration")
  }

  
      
/**
 * Indicates whether the Email to a Friend feature is enabled.
 */
      get enabled_for_customers(): $Field<"enabled_for_customers", boolean>  {
       return this.$_select("enabled_for_customers") as any
      }

      
/**
 * Indicates whether the Email to a Friend feature is enabled for guests.
 */
      get enabled_for_guests(): $Field<"enabled_for_guests", boolean>  {
       return this.$_select("enabled_for_guests") as any
      }
}


/**
 * Defines an object used to iterate through items for product comparisons.
 */
export class ComparableItem extends $Base<"ComparableItem"> {
  constructor() {
    super("ComparableItem")
  }

  
      
/**
 * An array of product attributes that can be used to compare products.
 */
      attributes<Sel extends Selection<ProductAttribute>>(selectorFn: (s: ProductAttribute) => [...Sel]):$Field<"attributes", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductAttribute)
      };
      return this.$_select("attributes", options as any) as any
    }
  

      
/**
 * Details about a product in a compare list.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The unique ID of an item in a compare list.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains a product attribute code and value.
 */
export class ProductAttribute extends $Base<"ProductAttribute"> {
  constructor() {
    super("ProductAttribute")
  }

  
      
/**
 * The unique identifier for a product attribute code.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * The display value of the attribute.
 */
      get value(): $Field<"value", string>  {
       return this.$_select("value") as any
      }
}


/**
 * Contains an attribute code that is used for product comparisons.
 */
export class ComparableAttribute extends $Base<"ComparableAttribute"> {
  constructor() {
    super("ComparableAttribute")
  }

  
      
/**
 * An attribute code that is enabled for product comparisons.
 */
      get code(): $Field<"code", string>  {
       return this.$_select("code") as any
      }

      
/**
 * The label of the attribute code.
 */
      get label(): $Field<"label", string>  {
       return this.$_select("label") as any
      }
}


/**
 * Contains iterable information such as the array of items, the count, and attributes that represent the compare list.
 */
export class CompareList extends $Base<"CompareList"> {
  constructor() {
    super("CompareList")
  }

  
      
/**
 * An array of attributes that can be used for comparing products.
 */
      attributes<Sel extends Selection<ComparableAttribute>>(selectorFn: (s: ComparableAttribute) => [...Sel]):$Field<"attributes", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComparableAttribute)
      };
      return this.$_select("attributes", options as any) as any
    }
  

      
/**
 * The number of items in the compare list.
 */
      get item_count(): $Field<"item_count", number>  {
       return this.$_select("item_count") as any
      }

      
/**
 * An array of products to compare.
 */
      items<Sel extends Selection<ComparableItem>>(selectorFn: (s: ComparableItem) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ComparableItem)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * The unique ID assigned to the compare list.
 */
      get uid(): $Field<"uid", string>  {
       return this.$_select("uid") as any
      }
}


/**
 * Contains an array of product IDs to use for creating a compare list.
 */
export type CreateCompareListInput = {
  products?: Readonly<Array<string | null>> | null
}
    


/**
 * Contains products to add to an existing compare list.
 */
export type AddProductsToCompareListInput = {
  products: Readonly<Array<string | null>>,
uid: string
}
    


/**
 * Defines which products to remove from a compare list.
 */
export type RemoveProductsFromCompareListInput = {
  products: Readonly<Array<string | null>>,
uid: string
}
    


/**
 * Contains the results of the request to delete a compare list.
 */
export class DeleteCompareListOutput extends $Base<"DeleteCompareListOutput"> {
  constructor() {
    super("DeleteCompareListOutput")
  }

  
      
/**
 * Indicates whether the compare list was successfully deleted.
 */
      get result(): $Field<"result", boolean>  {
       return this.$_select("result") as any
      }
}


/**
 * Contains the results of the request to assign a compare list.
 */
export class AssignCompareListToCustomerOutput extends $Base<"AssignCompareListToCustomerOutput"> {
  constructor() {
    super("AssignCompareListToCustomerOutput")
  }

  
      
/**
 * The contents of the customer's compare list.
 */
      compare_list<Sel extends Selection<CompareList>>(selectorFn: (s: CompareList) => [...Sel]):$Field<"compare_list", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CompareList)
      };
      return this.$_select("compare_list", options as any) as any
    }
  

      
/**
 * Indicates whether the compare list was successfully assigned to the customer.
 */
      get result(): $Field<"result", boolean>  {
       return this.$_select("result") as any
      }
}


export class SwatchLayerFilterItemInterface extends $Interface<{SwatchLayerFilterItem: SwatchLayerFilterItem}, "SwatchLayerFilterItemInterface"> {
  constructor() {
    super({SwatchLayerFilterItem: SwatchLayerFilterItem}, "SwatchLayerFilterItemInterface")
  }
  
      
/**
 * Data required to render a swatch filter item.
 */
      swatch_data<Sel extends Selection<SwatchData>>(selectorFn: (s: SwatchData) => [...Sel]):$Field<"swatch_data", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SwatchData)
      };
      return this.$_select("swatch_data", options as any) as any
    }
  
}


export class SwatchLayerFilterItem extends $Base<"SwatchLayerFilterItem"> {
  constructor() {
    super("SwatchLayerFilterItem")
  }

  
      
/**
 * The count of items per filter.
 */
      get items_count(): $Field<"items_count", number | null>  {
       return this.$_select("items_count") as any
      }

      
/**
 * The label for a filter.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }

      
/**
 * Data required to render a swatch filter item.
 */
      swatch_data<Sel extends Selection<SwatchData>>(selectorFn: (s: SwatchData) => [...Sel]):$Field<"swatch_data", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SwatchData)
      };
      return this.$_select("swatch_data", options as any) as any
    }
  

      
/**
 * The value of a filter request variable to be used in query.
 */
      get value_string(): $Field<"value_string", string | null>  {
       return this.$_select("value_string") as any
      }
}


/**
 * Describes the swatch type and a value.
 */
export class SwatchData extends $Base<"SwatchData"> {
  constructor() {
    super("SwatchData")
  }

  
      
/**
 * The type of swatch filter item: 1 - text; 2 - image.
 */
      get type(): $Field<"type", string | null>  {
       return this.$_select("type") as any
      }

      
/**
 * The value for the swatch item. It could be text or an image link.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}


export class SwatchDataInterface extends $Interface<{ImageSwatchData: ImageSwatchData,TextSwatchData: TextSwatchData,ColorSwatchData: ColorSwatchData}, "SwatchDataInterface"> {
  constructor() {
    super({ImageSwatchData: ImageSwatchData,TextSwatchData: TextSwatchData,ColorSwatchData: ColorSwatchData}, "SwatchDataInterface")
  }
  
      
/**
 * The value can be represented as color (HEX code), image link, or text.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}


export class ImageSwatchData extends $Base<"ImageSwatchData"> {
  constructor() {
    super("ImageSwatchData")
  }

  
      
/**
 * The URL assigned to the thumbnail of the swatch image.
 */
      get thumbnail(): $Field<"thumbnail", string | null>  {
       return this.$_select("thumbnail") as any
      }

      
/**
 * The value can be represented as color (HEX code), image link, or text.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}


export class TextSwatchData extends $Base<"TextSwatchData"> {
  constructor() {
    super("TextSwatchData")
  }

  
      
/**
 * The value can be represented as color (HEX code), image link, or text.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}


export class ColorSwatchData extends $Base<"ColorSwatchData"> {
  constructor() {
    super("ColorSwatchData")
  }

  
      
/**
 * The value can be represented as color (HEX code), image link, or text.
 */
      get value(): $Field<"value", string | null>  {
       return this.$_select("value") as any
      }
}

  
/**
 * Swatch attribute metadata input types.
 */
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

  WEIGHT = "WEIGHT"
}
  

  
export enum TaxWrappingEnum {
  
  DISPLAY_EXCLUDING_TAX = "DISPLAY_EXCLUDING_TAX",

  DISPLAY_INCLUDING_TAX = "DISPLAY_INCLUDING_TAX",

  DISPLAY_TYPE_BOTH = "DISPLAY_TYPE_BOTH"
}
  


/**
 * Defines the attributes required to receive a payment token for Express Checkout and Payments Standard payment methods.
 */
export type PaypalExpressTokenInput = {
  cart_id: string,
code: string,
express_button?: boolean | null,
urls: PaypalExpressUrlsInput,
use_paypal_credit?: boolean | null
}
    


/**
 * Deprecated. Use `PaypalExpressTokenOutput` instead.
 */
export class PaypalExpressToken extends $Base<"PaypalExpressToken"> {
  constructor() {
    super("PaypalExpressToken")
  }

  
      
/**
 * A set of URLs that allow the buyer to authorize payment and adjust checkout details.
 */
      paypal_urls<Sel extends Selection<PaypalExpressUrlList>>(selectorFn: (s: PaypalExpressUrlList) => [...Sel]):$Field<"paypal_urls", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PaypalExpressUrlList)
      };
      return this.$_select("paypal_urls", options as any) as any
    }
  

      
/**
 * The token returned by PayPal.
 */
      get token(): $Field<"token", string | null>  {
       return this.$_select("token") as any
      }
}


/**
 * Contains the token returned by PayPal and a set of URLs that allow the buyer to authorize payment and adjust checkout details. Applies to Express Checkout and Payments Standard payment methods.
 */
export class PaypalExpressTokenOutput extends $Base<"PaypalExpressTokenOutput"> {
  constructor() {
    super("PaypalExpressTokenOutput")
  }

  
      
/**
 * A set of URLs that allow the buyer to authorize payment and adjust checkout details.
 */
      paypal_urls<Sel extends Selection<PaypalExpressUrlList>>(selectorFn: (s: PaypalExpressUrlList) => [...Sel]):$Field<"paypal_urls", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PaypalExpressUrlList)
      };
      return this.$_select("paypal_urls", options as any) as any
    }
  

      
/**
 * The token returned by PayPal.
 */
      get token(): $Field<"token", string | null>  {
       return this.$_select("token") as any
      }
}


/**
 * Contains information used to generate PayPal iframe for transaction. Applies to Payflow Link and Payments Advanced payment methods.
 */
export class PayflowLinkToken extends $Base<"PayflowLinkToken"> {
  constructor() {
    super("PayflowLinkToken")
  }

  
      
/**
 * The mode for the Payflow transaction.
 */
      get mode(): $Field<"mode", PayflowLinkMode | null>  {
       return this.$_select("mode") as any
      }

      
/**
 * The PayPal URL used for requesting a Payflow form.
 */
      get paypal_url(): $Field<"paypal_url", string | null>  {
       return this.$_select("paypal_url") as any
      }

      
/**
 * The secure token generated by PayPal.
 */
      get secure_token(): $Field<"secure_token", string | null>  {
       return this.$_select("secure_token") as any
      }

      
/**
 * The secure token ID generated by PayPal.
 */
      get secure_token_id(): $Field<"secure_token_id", string | null>  {
       return this.$_select("secure_token_id") as any
      }
}


/**
 * Contains the secure URL used for the Payments Pro Hosted Solution payment method.
 */
export class HostedProUrl extends $Base<"HostedProUrl"> {
  constructor() {
    super("HostedProUrl")
  }

  
      
/**
 * The secure URL generated by PayPal.
 */
      get secure_form_url(): $Field<"secure_form_url", string | null>  {
       return this.$_select("secure_form_url") as any
      }
}


/**
 * Contains the required input to request the secure URL for Payments Pro Hosted Solution payment.
 */
export type HostedProUrlInput = {
  cart_id: string
}
    


/**
 * Contains a set of relative URLs that PayPal uses in response to various actions during the authorization process. Magento prepends the base URL to this value to create a full URL. For example, if the full URL is https://www.example.com/path/to/page.html, the relative URL is path/to/page.html. Use this input for Payments Pro Hosted Solution payment method.
 */
export type HostedProInput = {
  cancel_url: string,
return_url: string
}
    


/**
 * Contains required input for Express Checkout and Payments Standard payments.
 */
export type PaypalExpressInput = {
  payer_id: string,
token: string
}
    


/**
 * Contains required input for Payflow Express Checkout payments.
 */
export type PayflowExpressInput = {
  payer_id: string,
token: string
}
    


/**
 * Contains a set of relative URLs that PayPal uses in response to various actions during the authorization process. Magento prepends the base URL to this value to create a full URL. For example, if the full URL is https://www.example.com/path/to/page.html, the relative URL is path/to/page.html. Use this input for Express Checkout and Payments Standard payment methods.
 */
export type PaypalExpressUrlsInput = {
  cancel_url: string,
pending_url?: string | null,
return_url: string,
success_url?: string | null
}
    


/**
 * Contains a set of URLs that allow the buyer to authorize payment and adjust checkout details for Express Checkout and Payments Standard transactions.
 */
export class PaypalExpressUrlList extends $Base<"PaypalExpressUrlList"> {
  constructor() {
    super("PaypalExpressUrlList")
  }

  
      
/**
 * The PayPal URL that allows the buyer to edit their checkout details.
 */
      get edit(): $Field<"edit", string | null>  {
       return this.$_select("edit") as any
      }

      
/**
 * The URL to the PayPal login page.
 */
      get start(): $Field<"start", string | null>  {
       return this.$_select("start") as any
      }
}


/**
 * A set of relative URLs that PayPal uses in response to various actions during the authorization process. Adobe Commerce prepends the base URL to this value to create a full URL. For example, if the full URL is https://www.example.com/path/to/page.html, the relative URL is path/to/page.html. Use this input for Payflow Link and Payments Advanced payment methods.
 */
export type PayflowLinkInput = {
  cancel_url: string,
error_url: string,
return_url: string
}
    


/**
 * Contains information required to fetch payment token information for the Payflow Link and Payments Advanced payment methods.
 */
export type PayflowLinkTokenInput = {
  cart_id: string
}
    

  
/**
 * Indicates the mode for payment. Applies to the Payflow Link and Payments Advanced payment methods.
 */
export enum PayflowLinkMode {
  
  TEST = "TEST",

  LIVE = "LIVE"
}
  


/**
 * Contains input required to fetch payment token information for the Payflow Pro and Payments Pro payment methods.
 */
export type PayflowProTokenInput = {
  cart_id: string,
urls: PayflowProUrlInput
}
    


/**
 * Contains input for the Payflow Pro and Payments Pro payment methods.
 */
export type PayflowProInput = {
  cc_details: CreditCardDetailsInput,
is_active_payment_token_enabler?: boolean | null
}
    


/**
 * Required fields for Payflow Pro and Payments Pro credit card payments.
 */
export type CreditCardDetailsInput = {
  cc_exp_month: number,
cc_exp_year: number,
cc_last_4: number,
cc_type: string
}
    


/**
 * Contains a set of relative URLs that PayPal uses in response to various actions during the authorization process. Magento prepends the base URL to this value to create a full URL. For example, if the full URL is https://www.example.com/path/to/page.html, the relative URL is path/to/page.html. Use this input for the Payflow Pro and Payment Pro payment methods.
 */
export type PayflowProUrlInput = {
  cancel_url: string,
error_url: string,
return_url: string
}
    


/**
 * Contains the secure information used to authorize transaction. Applies to Payflow Pro and Payments Pro payment methods.
 */
export class PayflowProToken extends $Base<"PayflowProToken"> {
  constructor() {
    super("PayflowProToken")
  }

  
      
/**
 * The RESPMSG returned by PayPal. If the `result` is `0`, then `response_message` is `Approved`.
 */
      get response_message(): $Field<"response_message", string>  {
       return this.$_select("response_message") as any
      }

      
/**
 * A non-zero value if any errors occurred.
 */
      get result(): $Field<"result", number>  {
       return this.$_select("result") as any
      }

      
/**
 * The RESULT returned by PayPal. A value of `0` indicates the transaction was approved.
 */
      get result_code(): $Field<"result_code", number>  {
       return this.$_select("result_code") as any
      }

      
/**
 * A secure token generated by PayPal.
 */
      get secure_token(): $Field<"secure_token", string>  {
       return this.$_select("secure_token") as any
      }

      
/**
 * A secure token ID generated by PayPal.
 */
      get secure_token_id(): $Field<"secure_token_id", string>  {
       return this.$_select("secure_token_id") as any
      }
}


/**
 * Contains the secure information used to authorize transaction. Applies to Payflow Pro and Payments Pro payment methods.
 */
export class CreatePayflowProTokenOutput extends $Base<"CreatePayflowProTokenOutput"> {
  constructor() {
    super("CreatePayflowProTokenOutput")
  }

  
      
/**
 * The RESPMSG returned by PayPal. If the `result` is `0`, then `response_message` is `Approved`.
 */
      get response_message(): $Field<"response_message", string>  {
       return this.$_select("response_message") as any
      }

      
/**
 * A non-zero value if any errors occurred.
 */
      get result(): $Field<"result", number>  {
       return this.$_select("result") as any
      }

      
/**
 * The RESULT returned by PayPal. A value of `0` indicates the transaction was approved.
 */
      get result_code(): $Field<"result_code", number>  {
       return this.$_select("result_code") as any
      }

      
/**
 * A secure token generated by PayPal.
 */
      get secure_token(): $Field<"secure_token", string>  {
       return this.$_select("secure_token") as any
      }

      
/**
 * A secure token ID generated by PayPal.
 */
      get secure_token_id(): $Field<"secure_token_id", string>  {
       return this.$_select("secure_token_id") as any
      }
}


/**
 * Input required to complete payment. Applies to Payflow Pro and Payments Pro payment methods.
 */
export type PayflowProResponseInput = {
  cart_id: string,
paypal_payload: string
}
    


export class PayflowProResponseOutput extends $Base<"PayflowProResponseOutput"> {
  constructor() {
    super("PayflowProResponseOutput")
  }

  
      
/**
 * The cart with the updated selected payment method.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


/**
 * Contains required input for payment methods with Vault support.
 */
export type VaultTokenInput = {
  public_hash: string
}
    


/**
 * Indicates whether the request succeeded and returns the remaining customer payment tokens.
 */
export class DeletePaymentTokenOutput extends $Base<"DeletePaymentTokenOutput"> {
  constructor() {
    super("DeletePaymentTokenOutput")
  }

  
      
/**
 * A container for the customer's remaining payment tokens.
 */
      customerPaymentTokens<Sel extends Selection<CustomerPaymentTokens>>(selectorFn: (s: CustomerPaymentTokens) => [...Sel]):$Field<"customerPaymentTokens", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new CustomerPaymentTokens)
      };
      return this.$_select("customerPaymentTokens", options as any) as any
    }
  

      
/**
 * Indicates whether the request succeeded.
 */
      get result(): $Field<"result", boolean>  {
       return this.$_select("result") as any
      }
}


/**
 * Contains payment tokens stored in the customer's vault.
 */
export class CustomerPaymentTokens extends $Base<"CustomerPaymentTokens"> {
  constructor() {
    super("CustomerPaymentTokens")
  }

  
      
/**
 * An array of payment tokens.
 */
      items<Sel extends Selection<PaymentToken>>(selectorFn: (s: PaymentToken) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new PaymentToken)
      };
      return this.$_select("items", options as any) as any
    }
  
}


/**
 * The stored payment method available to the customer.
 */
export class PaymentToken extends $Base<"PaymentToken"> {
  constructor() {
    super("PaymentToken")
  }

  
      
/**
 * A description of the stored account details.
 */
      get details(): $Field<"details", string | null>  {
       return this.$_select("details") as any
      }

      
/**
 * The payment method code associated with the token.
 */
      get payment_method_code(): $Field<"payment_method_code", string>  {
       return this.$_select("payment_method_code") as any
      }

      
/**
 * The public hash of the token.
 */
      get public_hash(): $Field<"public_hash", string>  {
       return this.$_select("public_hash") as any
      }

      
/**
 * Specifies the payment token type.
 */
      get type(): $Field<"type", PaymentTokenTypeEnum>  {
       return this.$_select("type") as any
      }
}

  
/**
 * The list of available payment token types.
 */
export enum PaymentTokenTypeEnum {
  
/**
 * phpcs:ignore Magento2.GraphQL.ValidArgumentName
 */
  card = "card",

/**
 * phpcs:ignore Magento2.GraphQL.ValidArgumentName
 */
  account = "account"
}
  


/**
 * A single FPT that can be applied to a product price.
 */
export class FixedProductTax extends $Base<"FixedProductTax"> {
  constructor() {
    super("FixedProductTax")
  }

  
      
/**
 * The amount of the Fixed Product Tax.
 */
      amount<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"amount", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("amount", options as any) as any
    }
  

      
/**
 * The display label assigned to the Fixed Product Tax.
 */
      get label(): $Field<"label", string | null>  {
       return this.$_select("label") as any
      }
}

  
/**
 * Lists display settings for the Fixed Product Tax.
 */
export enum FixedProductTaxDisplaySettings {
  
/**
 * The displayed price includes the FPT amount without displaying the `ProductPrice.fixed_product_taxes` values. This value corresponds to 'Including FPT only'.
 */
  INCLUDE_FPT_WITHOUT_DETAILS = "INCLUDE_FPT_WITHOUT_DETAILS",

/**
 * The displayed price includes the FPT amount while displaying the values of `ProductPrice.fixed_product_taxes` separately. This value corresponds to 'Including FPT and FPT description'.
 */
  INCLUDE_FPT_WITH_DETAILS = "INCLUDE_FPT_WITH_DETAILS",

/**
 * The displayed price does not include the FPT amount. The values of `ProductPrice.fixed_product_taxes` and the price including the FPT are displayed separately. This value corresponds to 'Excluding FPT, Including FPT description and final price.'
 */
  EXCLUDE_FPT_AND_INCLUDE_WITH_DETAILS = "EXCLUDE_FPT_AND_INCLUDE_WITH_DETAILS",

/**
 * The displayed price does not include the FPT amount. The values from `ProductPrice.fixed_product_taxes` are not displayed. This value corresponds to 'Excluding FPT'.
 */
  EXCLUDE_FPT_WITHOUT_DETAILS = "EXCLUDE_FPT_WITHOUT_DETAILS",

/**
 * The FPT feature is not enabled. You can omit `ProductPrice.fixed_product_taxes` from your query.
 */
  FPT_DISABLED = "FPT_DISABLED"
}
  


/**
 * Deprecated: Use the `Wishlist` type instead.
 */
export class WishlistOutput extends $Base<"WishlistOutput"> {
  constructor() {
    super("WishlistOutput")
  }

  
      
/**
 * An array of items in the customer's wish list
 */
      items<Sel extends Selection<WishlistItem>>(selectorFn: (s: WishlistItem) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new WishlistItem)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * The number of items in the wish list.
 */
      get items_count(): $Field<"items_count", number | null>  {
       return this.$_select("items_count") as any
      }

      
/**
 * When multiple wish lists are enabled, the name the customer assigns to the wishlist.
 */
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
/**
 * An encrypted code that links to the wish list.
 */
      get sharing_code(): $Field<"sharing_code", string | null>  {
       return this.$_select("sharing_code") as any
      }

      
/**
 * The time of the last modification to the wish list.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }
}


/**
 * Contains a customer wish list.
 */
export class Wishlist extends $Base<"Wishlist"> {
  constructor() {
    super("Wishlist")
  }

  
      
/**
 * The unique ID for a `Wishlist` object.
 */
      get id(): $Field<"id", string | null>  {
       return this.$_select("id") as any
      }

      
      items<Sel extends Selection<WishlistItem>>(selectorFn: (s: WishlistItem) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new WishlistItem)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * The number of items in the wish list.
 */
      get items_count(): $Field<"items_count", number | null>  {
       return this.$_select("items_count") as any
      }

      
/**
 * An array of items in the customer's wish list.
 */
      items_v2<Args extends VariabledInput<{
        currentPage?: number | null
pageSize?: number | null,
      }>,Sel extends Selection<WishlistItems>>(args: ExactArgNames<Args, {
        currentPage?: number | null
pageSize?: number | null,
      }>, selectorFn: (s: WishlistItems) => [...Sel]):$Field<"items_v2", GetOutput<Sel> | null , GetVariables<Sel, Args>>
items_v2<Sel extends Selection<WishlistItems>>(selectorFn: (s: WishlistItems) => [...Sel]):$Field<"items_v2", GetOutput<Sel> | null , GetVariables<Sel>>
items_v2(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              currentPage: "Int",
pageSize: "Int"
            },
        args,

        selection: selectorFn(new WishlistItems)
      };
      return this.$_select("items_v2", options as any) as any
    }
  

      
/**
 * An encrypted code that Magento uses to link to the wish list.
 */
      get sharing_code(): $Field<"sharing_code", string | null>  {
       return this.$_select("sharing_code") as any
      }

      
/**
 * The time of the last modification to the wish list.
 */
      get updated_at(): $Field<"updated_at", string | null>  {
       return this.$_select("updated_at") as any
      }
}


/**
 * The interface for wish list items.
 */
export class WishlistItemInterface extends $Interface<{SimpleWishlistItem: SimpleWishlistItem,VirtualWishlistItem: VirtualWishlistItem,DownloadableWishlistItem: DownloadableWishlistItem,BundleWishlistItem: BundleWishlistItem,GroupedProductWishlistItem: GroupedProductWishlistItem,ConfigurableWishlistItem: ConfigurableWishlistItem}, "WishlistItemInterface"> {
  constructor() {
    super({SimpleWishlistItem: SimpleWishlistItem,VirtualWishlistItem: VirtualWishlistItem,DownloadableWishlistItem: DownloadableWishlistItem,BundleWishlistItem: BundleWishlistItem,GroupedProductWishlistItem: GroupedProductWishlistItem,ConfigurableWishlistItem: ConfigurableWishlistItem}, "WishlistItemInterface")
  }
  
      
/**
 * The date and time the item was added to the wish list.
 */
      get added_at(): $Field<"added_at", string>  {
       return this.$_select("added_at") as any
      }

      
/**
 * Custom options selected for the wish list item.
 */
      customizable_options<Sel extends Selection<SelectedCustomizableOption>>(selectorFn: (s: SelectedCustomizableOption) => [...Sel]):$Field<"customizable_options", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SelectedCustomizableOption)
      };
      return this.$_select("customizable_options", options as any) as any
    }
  

      
/**
 * The description of the item.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
/**
 * The unique ID for a `WishlistItemInterface` object.
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
/**
 * Product details of the wish list item.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The quantity of this wish list item.
 */
      get quantity(): $Field<"quantity", number>  {
       return this.$_select("quantity") as any
      }
}


/**
 * Contains an array of items in a wish list.
 */
export class WishlistItems extends $Base<"WishlistItems"> {
  constructor() {
    super("WishlistItems")
  }

  
      
/**
 * A list of items in the wish list.
 */
      items<Sel extends Selection<WishlistItemInterface>>(selectorFn: (s: WishlistItemInterface) => [...Sel]):$Field<"items", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new WishlistItemInterface)
      };
      return this.$_select("items", options as any) as any
    }
  

      
/**
 * Contains pagination metadata.
 */
      page_info<Sel extends Selection<SearchResultPageInfo>>(selectorFn: (s: SearchResultPageInfo) => [...Sel]):$Field<"page_info", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new SearchResultPageInfo)
      };
      return this.$_select("page_info", options as any) as any
    }
  
}


/**
 * Contains details about a wish list item.
 */
export class WishlistItem extends $Base<"WishlistItem"> {
  constructor() {
    super("WishlistItem")
  }

  
      
/**
 * The time when the customer added the item to the wish list.
 */
      get added_at(): $Field<"added_at", string | null>  {
       return this.$_select("added_at") as any
      }

      
/**
 * The customer's comment about this item.
 */
      get description(): $Field<"description", string | null>  {
       return this.$_select("description") as any
      }

      
/**
 * The unique ID for a `WishlistItem` object.
 */
      get id(): $Field<"id", number | null>  {
       return this.$_select("id") as any
      }

      
/**
 * Details about the wish list item.
 */
      product<Sel extends Selection<ProductInterface>>(selectorFn: (s: ProductInterface) => [...Sel]):$Field<"product", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new ProductInterface)
      };
      return this.$_select("product", options as any) as any
    }
  

      
/**
 * The quantity of this wish list item
 */
      get qty(): $Field<"qty", number | null>  {
       return this.$_select("qty") as any
      }
}


/**
 * Contains the resultant wish list and any error information.
 */
export class AddWishlistItemsToCartOutput extends $Base<"AddWishlistItemsToCartOutput"> {
  constructor() {
    super("AddWishlistItemsToCartOutput")
  }

  
      
/**
 * An array of errors encountered while adding products to the customer's cart.
 */
      add_wishlist_items_to_cart_user_errors<Sel extends Selection<WishlistCartUserInputError>>(selectorFn: (s: WishlistCartUserInputError) => [...Sel]):$Field<"add_wishlist_items_to_cart_user_errors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new WishlistCartUserInputError)
      };
      return this.$_select("add_wishlist_items_to_cart_user_errors", options as any) as any
    }
  

      
/**
 * Indicates whether the attempt to add items to the customer's cart was successful.
 */
      get status(): $Field<"status", boolean>  {
       return this.$_select("status") as any
      }

      
/**
 * Contains the wish list with all items that were successfully added.
 */
      wishlist<Sel extends Selection<Wishlist>>(selectorFn: (s: Wishlist) => [...Sel]):$Field<"wishlist", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Wishlist)
      };
      return this.$_select("wishlist", options as any) as any
    }
  
}


/**
 * Contains details about errors encountered when a customer added wish list items to the cart.
 */
export class WishlistCartUserInputError extends $Base<"WishlistCartUserInputError"> {
  constructor() {
    super("WishlistCartUserInputError")
  }

  
      
/**
 * An error code that describes the error encountered.
 */
      get code(): $Field<"code", WishlistCartUserInputErrorType>  {
       return this.$_select("code") as any
      }

      
/**
 * A localized error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }

      
/**
 * The unique ID of the `Wishlist` object containing an error.
 */
      get wishlistId(): $Field<"wishlistId", string>  {
       return this.$_select("wishlistId") as any
      }

      
/**
 * The unique ID of the wish list item containing an error.
 */
      get wishlistItemId(): $Field<"wishlistItemId", string>  {
       return this.$_select("wishlistItemId") as any
      }
}

  
/**
 * A list of possible error types.
 */
export enum WishlistCartUserInputErrorType {
  
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",

  NOT_SALABLE = "NOT_SALABLE",

  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",

  UNDEFINED = "UNDEFINED"
}
  


/**
 * Defines the items to add to a wish list.
 */
export type WishlistItemInput = {
  entered_options?: Readonly<Array<EnteredOptionInput | null>> | null,
parent_sku?: string | null,
quantity: number,
selected_options?: Readonly<Array<string | null>> | null,
sku: string
}
    


/**
 * Contains the customer's wish list and any errors encountered.
 */
export class AddProductsToWishlistOutput extends $Base<"AddProductsToWishlistOutput"> {
  constructor() {
    super("AddProductsToWishlistOutput")
  }

  
      
/**
 * An array of errors encountered while adding products to a wish list.
 */
      user_errors<Sel extends Selection<WishListUserInputError>>(selectorFn: (s: WishListUserInputError) => [...Sel]):$Field<"user_errors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new WishListUserInputError)
      };
      return this.$_select("user_errors", options as any) as any
    }
  

      
/**
 * Contains the wish list with all items that were successfully added.
 */
      wishlist<Sel extends Selection<Wishlist>>(selectorFn: (s: Wishlist) => [...Sel]):$Field<"wishlist", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Wishlist)
      };
      return this.$_select("wishlist", options as any) as any
    }
  
}


/**
 * Contains the customer's wish list and any errors encountered.
 */
export class RemoveProductsFromWishlistOutput extends $Base<"RemoveProductsFromWishlistOutput"> {
  constructor() {
    super("RemoveProductsFromWishlistOutput")
  }

  
      
/**
 * An array of errors encountered while deleting products from a wish list.
 */
      user_errors<Sel extends Selection<WishListUserInputError>>(selectorFn: (s: WishListUserInputError) => [...Sel]):$Field<"user_errors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new WishListUserInputError)
      };
      return this.$_select("user_errors", options as any) as any
    }
  

      
/**
 * Contains the wish list with after items were successfully deleted.
 */
      wishlist<Sel extends Selection<Wishlist>>(selectorFn: (s: Wishlist) => [...Sel]):$Field<"wishlist", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Wishlist)
      };
      return this.$_select("wishlist", options as any) as any
    }
  
}


/**
 * Defines updates to items in a wish list.
 */
export type WishlistItemUpdateInput = {
  description?: string | null,
entered_options?: Readonly<Array<EnteredOptionInput | null>> | null,
quantity?: number | null,
selected_options?: Readonly<Array<string | null>> | null,
wishlist_item_id: string
}
    


/**
 * Contains the customer's wish list and any errors encountered.
 */
export class UpdateProductsInWishlistOutput extends $Base<"UpdateProductsInWishlistOutput"> {
  constructor() {
    super("UpdateProductsInWishlistOutput")
  }

  
      
/**
 * An array of errors encountered while updating products in a wish list.
 */
      user_errors<Sel extends Selection<WishListUserInputError>>(selectorFn: (s: WishListUserInputError) => [...Sel]):$Field<"user_errors", Array<GetOutput<Sel> | null> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new WishListUserInputError)
      };
      return this.$_select("user_errors", options as any) as any
    }
  

      
/**
 * Contains the wish list with all items that were successfully updated.
 */
      wishlist<Sel extends Selection<Wishlist>>(selectorFn: (s: Wishlist) => [...Sel]):$Field<"wishlist", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Wishlist)
      };
      return this.$_select("wishlist", options as any) as any
    }
  
}


/**
 * An error encountered while performing operations with WishList.
 */
export class WishListUserInputError extends $Base<"WishListUserInputError"> {
  constructor() {
    super("WishListUserInputError")
  }

  
      
/**
 * A wish list-specific error code.
 */
      get code(): $Field<"code", WishListUserInputErrorType>  {
       return this.$_select("code") as any
      }

      
/**
 * A localized error message.
 */
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }
}

  
/**
 * A list of possible error types.
 */
export enum WishListUserInputErrorType {
  
  PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",

  UNDEFINED = "UNDEFINED"
}
  


export class PaymentMethod extends $Base<"PaymentMethod"> {
  constructor() {
    super("PaymentMethod")
  }

  
      
/**
 * Available issuers for this payment method
 */
      mollie_available_issuers<Sel extends Selection<MollieIssuer>>(selectorFn: (s: MollieIssuer) => [...Sel]):$Field<"mollie_available_issuers", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MollieIssuer)
      };
      return this.$_select("mollie_available_issuers", options as any) as any
    }
  

      
/**
 * Retrieve meta information for this payment method (image)
 */
      mollie_meta<Sel extends Selection<MolliePaymentMethodMeta>>(selectorFn: (s: MolliePaymentMethodMeta) => [...Sel]):$Field<"mollie_meta", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MolliePaymentMethodMeta)
      };
      return this.$_select("mollie_meta", options as any) as any
    }
  
}


export class MollieStoreConfig extends $Base<"MollieStoreConfig"> {
  constructor() {
    super("MollieStoreConfig")
  }

  
      
/**
 * Is Mollie running in live mode?
 */
      get live_mode(): $Field<"live_mode", boolean | null>  {
       return this.$_select("live_mode") as any
      }

      
/**
 * The profile ID used for this store
 */
      get profile_id(): $Field<"profile_id", string | null>  {
       return this.$_select("profile_id") as any
      }
}


export class MollieIssuer extends $Base<"MollieIssuer"> {
  constructor() {
    super("MollieIssuer")
  }

  
      
      get code(): $Field<"code", string | null>  {
       return this.$_select("code") as any
      }

      
      get image(): $Field<"image", string | null>  {
       return this.$_select("image") as any
      }

      
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }

      
      get svg(): $Field<"svg", string | null>  {
       return this.$_select("svg") as any
      }
}


export class MolliePaymentMethodMeta extends $Base<"MolliePaymentMethodMeta"> {
  constructor() {
    super("MolliePaymentMethodMeta")
  }

  
      
      get image(): $Field<"image", string | null>  {
       return this.$_select("image") as any
      }
}


export class MolliePaymentMethod extends $Base<"MolliePaymentMethod"> {
  constructor() {
    super("MolliePaymentMethod")
  }

  
      
      get code(): $Field<"code", string | null>  {
       return this.$_select("code") as any
      }

      
      get image(): $Field<"image", string | null>  {
       return this.$_select("image") as any
      }

      
      get name(): $Field<"name", string | null>  {
       return this.$_select("name") as any
      }
}


export class MollieTerminalOutput extends $Base<"MollieTerminalOutput"> {
  constructor() {
    super("MollieTerminalOutput")
  }

  
      
      get brand(): $Field<"brand", string>  {
       return this.$_select("brand") as any
      }

      
      get description(): $Field<"description", string>  {
       return this.$_select("description") as any
      }

      
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
      get model(): $Field<"model", string>  {
       return this.$_select("model") as any
      }

      
      get serialNumber(): $Field<"serialNumber", string | null>  {
       return this.$_select("serialNumber") as any
      }
}


export class MollieResetCartOutput extends $Base<"MollieResetCartOutput"> {
  constructor() {
    super("MollieResetCartOutput")
  }

  
      
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  
}


export class MolliePaymentMethodsOutput extends $Base<"MolliePaymentMethodsOutput"> {
  constructor() {
    super("MolliePaymentMethodsOutput")
  }

  
      
      methods<Sel extends Selection<MolliePaymentMethod>>(selectorFn: (s: MolliePaymentMethod) => [...Sel]):$Field<"methods", Array<GetOutput<Sel> | null> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new MolliePaymentMethod)
      };
      return this.$_select("methods", options as any) as any
    }
  
}


export class MollieTransactionOutput extends $Base<"MollieTransactionOutput"> {
  constructor() {
    super("MollieTransactionOutput")
  }

  
      
      get checkout_url(): $Field<"checkout_url", string | null>  {
       return this.$_select("checkout_url") as any
      }
}


export class MollieProcessTransactionOutput extends $Base<"MollieProcessTransactionOutput"> {
  constructor() {
    super("MollieProcessTransactionOutput")
  }

  
      
/**
 * The cart is only available when the payment status is failed, canceled or expired.
 */
      cart<Sel extends Selection<Cart>>(selectorFn: (s: Cart) => [...Sel]):$Field<"cart", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Cart)
      };
      return this.$_select("cart", options as any) as any
    }
  

      
      get paymentStatus(): $Field<"paymentStatus", PaymentStatusEnum | null>  {
       return this.$_select("paymentStatus") as any
      }

      
/**
 * Indicates if the customer should be redirected to the cart.
 */
      get redirect_to_cart(): $Field<"redirect_to_cart", boolean | null>  {
       return this.$_select("redirect_to_cart") as any
      }

      
/**
 * Indicates if the customer should be redirected to the success page.
 */
      get redirect_to_success_page(): $Field<"redirect_to_success_page", boolean | null>  {
       return this.$_select("redirect_to_success_page") as any
      }
}


export class MolliePaymentFee extends $Base<"MolliePaymentFee"> {
  constructor() {
    super("MolliePaymentFee")
  }

  
      
/**
 * Base mollie payment fee
 */
      base_fee<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"base_fee", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("base_fee", options as any) as any
    }
  

      
/**
 * Base mollie payment fee tax
 */
      base_fee_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"base_fee_tax", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("base_fee_tax", options as any) as any
    }
  

      
/**
 * Mollie payment fee
 */
      fee<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"fee", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("fee", options as any) as any
    }
  

      
/**
 * Mollie payment fee tax
 */
      fee_tax<Sel extends Selection<Money>>(selectorFn: (s: Money) => [...Sel]):$Field<"fee_tax", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Money)
      };
      return this.$_select("fee_tax", options as any) as any
    }
  
}


export class MollieApplePayValidationOutput extends $Base<"MollieApplePayValidationOutput"> {
  constructor() {
    super("MollieApplePayValidationOutput")
  }

  
      
      get response(): $Field<"response", string>  {
       return this.$_select("response") as any
      }
}


export class MolliePaymentLinkRedirectOutput extends $Base<"MolliePaymentLinkRedirectOutput"> {
  constructor() {
    super("MolliePaymentLinkRedirectOutput")
  }

  
      
      get already_paid(): $Field<"already_paid", boolean>  {
       return this.$_select("already_paid") as any
      }

      
      get is_expired(): $Field<"is_expired", boolean>  {
       return this.$_select("is_expired") as any
      }

      
      get redirect_url(): $Field<"redirect_url", string | null>  {
       return this.$_select("redirect_url") as any
      }
}


export type MollieTransactionInput = {
  issuer?: string | null,
payment_token: string
}
    


export type MolliePaymentMethodsInput = {
  amount: number,
currency?: string | null
}
    


export type MollieResetCartInput = {
  cart_id: string
}
    


export type MollieProcessTransactionInput = {
  payment_token: string
}
    

  
export enum PaymentStatusEnum {
  
  CREATED = "CREATED",

  PAID = "PAID",

  AUTHORIZED = "AUTHORIZED",

  CANCELED = "CANCELED",

  SHIPPING = "SHIPPING",

  COMPLETED = "COMPLETED",

  EXPIRED = "EXPIRED",

  PENDING = "PENDING",

  REFUNDED = "REFUNDED",

  ERROR = "ERROR",

  FAILED = "FAILED",

  OPEN = "OPEN"
}
  

  const $Root = {
    query: Query,
mutation: Mutation
  }

  namespace $RootTypes {
    export type query = Query
export type mutation = Mutation
  }
  

export function query<Sel extends Selection<$RootTypes.query>>(
  name: string,
  selectFn: (q: $RootTypes.query) => [...Sel]
): TypedDocumentNode<GetOutput<Sel>, GetVariables<Sel>>
export function query<Sel extends Selection<$RootTypes.query>>(
  selectFn: (q: $RootTypes.query) => [...Sel]
): TypedDocumentNode<GetOutput<Sel>, Simplify<GetVariables<Sel>>>
export function query<Sel extends Selection<$RootTypes.query>>(name: any, selectFn?: any) {
  if (!selectFn) {
    selectFn = name
    name = ''
  }
  let field = new $Field<'query', GetOutput<Sel>, GetVariables<Sel>>('query', {
    selection: selectFn(new $Root.query()),
  })
  const str = fieldToQuery(`query ${name}`, field)

  return gql(str) as any
}


export function mutation<Sel extends Selection<$RootTypes.mutation>>(
  name: string,
  selectFn: (q: $RootTypes.mutation) => [...Sel]
): TypedDocumentNode<GetOutput<Sel>, GetVariables<Sel>>
export function mutation<Sel extends Selection<$RootTypes.mutation>>(
  selectFn: (q: $RootTypes.mutation) => [...Sel]
): TypedDocumentNode<GetOutput<Sel>, Simplify<GetVariables<Sel>>>
export function mutation<Sel extends Selection<$RootTypes.query>>(name: any, selectFn?: any) {
  if (!selectFn) {
    selectFn = name
    name = ''
  }
  let field = new $Field<'mutation', GetOutput<Sel>, GetVariables<Sel>>('mutation', {
    selection: selectFn(new $Root.mutation()),
  })
  const str = fieldToQuery(`mutation ${name}`, field)

  return gql(str) as any
}


const $InputTypes: {[key: string]: {[key: string]: string}} = {
    FilterTypeInput: {
    eq: "String",
finset: "[String]",
from: "String",
gt: "String",
gteq: "String",
in: "[String]",
like: "String",
lt: "String",
lteq: "String",
moreq: "String",
neq: "String",
nin: "[String]",
notnull: "String",
null: "String",
to: "String"
  },
  FilterEqualTypeInput: {
    eq: "String",
in: "[String]"
  },
  FilterRangeTypeInput: {
    from: "String",
to: "String"
  },
  FilterMatchTypeInput: {
    match: "String",
match_type: "FilterMatchTypeEnum"
  },
  FilterStringTypeInput: {
    eq: "String",
in: "[String]",
match: "String"
  },
  EnteredOptionInput: {
    uid: "ID!",
value: "String!"
  },
  AttributeInput: {
    attribute_code: "String",
entity_type: "String"
  },
  AttributeValueInput: {
    attribute_code: "String!",
selected_options: "[AttributeInputSelectedOption]",
value: "String"
  },
  AttributeInputSelectedOption: {
    value: "String!"
  },
  AttributeFilterInput: {
    is_comparable: "Boolean",
is_filterable: "Boolean",
is_filterable_in_search: "Boolean",
is_html_allowed_on_front: "Boolean",
is_searchable: "Boolean",
is_used_for_price_rules: "Boolean",
is_used_for_promo_rules: "Boolean",
is_visible_in_advanced_search: "Boolean",
is_visible_on_front: "Boolean",
is_wysiwyg_enabled: "Boolean",
used_in_product_listing: "Boolean"
  },
  AggregationsFilterInput: {
    category: "AggregationsCategoryFilterInput"
  },
  AggregationsCategoryFilterInput: {
    includeDirectChildrenOnly: "Boolean"
  },
  ProductAttributeFilterInput: {
    category_id: "FilterEqualTypeInput",
category_uid: "FilterEqualTypeInput",
category_url_path: "FilterEqualTypeInput",
description: "FilterMatchTypeInput",
name: "FilterMatchTypeInput",
price: "FilterRangeTypeInput",
short_description: "FilterMatchTypeInput",
sku: "FilterEqualTypeInput",
url_key: "FilterEqualTypeInput"
  },
  CategoryFilterInput: {
    category_uid: "FilterEqualTypeInput",
ids: "FilterEqualTypeInput",
name: "FilterMatchTypeInput",
parent_category_uid: "FilterEqualTypeInput",
parent_id: "FilterEqualTypeInput",
url_key: "FilterEqualTypeInput",
url_path: "FilterEqualTypeInput"
  },
  ProductFilterInput: {
    category_id: "FilterTypeInput",
country_of_manufacture: "FilterTypeInput",
created_at: "FilterTypeInput",
custom_layout: "FilterTypeInput",
custom_layout_update: "FilterTypeInput",
description: "FilterTypeInput",
gift_message_available: "FilterTypeInput",
has_options: "FilterTypeInput",
image: "FilterTypeInput",
image_label: "FilterTypeInput",
manufacturer: "FilterTypeInput",
max_price: "FilterTypeInput",
meta_description: "FilterTypeInput",
meta_keyword: "FilterTypeInput",
meta_title: "FilterTypeInput",
min_price: "FilterTypeInput",
name: "FilterTypeInput",
news_from_date: "FilterTypeInput",
news_to_date: "FilterTypeInput",
options_container: "FilterTypeInput",
or: "ProductFilterInput",
price: "FilterTypeInput",
required_options: "FilterTypeInput",
short_description: "FilterTypeInput",
sku: "FilterTypeInput",
small_image: "FilterTypeInput",
small_image_label: "FilterTypeInput",
special_from_date: "FilterTypeInput",
special_price: "FilterTypeInput",
special_to_date: "FilterTypeInput",
swatch_image: "FilterTypeInput",
thumbnail: "FilterTypeInput",
thumbnail_label: "FilterTypeInput",
tier_price: "FilterTypeInput",
updated_at: "FilterTypeInput",
url_key: "FilterTypeInput",
url_path: "FilterTypeInput",
weight: "FilterTypeInput"
  },
  ProductSortInput: {
    country_of_manufacture: "SortEnum",
created_at: "SortEnum",
custom_layout: "SortEnum",
custom_layout_update: "SortEnum",
description: "SortEnum",
gift_message_available: "SortEnum",
has_options: "SortEnum",
image: "SortEnum",
image_label: "SortEnum",
manufacturer: "SortEnum",
meta_description: "SortEnum",
meta_keyword: "SortEnum",
meta_title: "SortEnum",
name: "SortEnum",
news_from_date: "SortEnum",
news_to_date: "SortEnum",
options_container: "SortEnum",
price: "SortEnum",
required_options: "SortEnum",
short_description: "SortEnum",
sku: "SortEnum",
small_image: "SortEnum",
small_image_label: "SortEnum",
special_from_date: "SortEnum",
special_price: "SortEnum",
special_to_date: "SortEnum",
swatch_image: "SortEnum",
thumbnail: "SortEnum",
thumbnail_label: "SortEnum",
tier_price: "SortEnum",
updated_at: "SortEnum",
url_key: "SortEnum",
url_path: "SortEnum",
weight: "SortEnum"
  },
  ProductAttributeSortInput: {
    name: "SortEnum",
position: "SortEnum",
price: "SortEnum",
relevance: "SortEnum"
  },
  CreateGuestCartInput: {
    cart_uid: "ID"
  },
  createEmptyCartInput: {
    cart_id: "String"
  },
  AddSimpleProductsToCartInput: {
    cart_id: "String!",
cart_items: "[SimpleProductCartItemInput]!"
  },
  SimpleProductCartItemInput: {
    customizable_options: "[CustomizableOptionInput]",
data: "CartItemInput!"
  },
  AddVirtualProductsToCartInput: {
    cart_id: "String!",
cart_items: "[VirtualProductCartItemInput]!"
  },
  VirtualProductCartItemInput: {
    customizable_options: "[CustomizableOptionInput]",
data: "CartItemInput!"
  },
  CartItemInput: {
    entered_options: "[EnteredOptionInput]",
parent_sku: "String",
quantity: "Float!",
selected_options: "[ID]",
sku: "String!"
  },
  QuoteItemsSortInput: {
    field: "SortQuoteItemsEnum!",
order: "SortEnum!"
  },
  CustomizableOptionInput: {
    id: "Int",
uid: "ID",
value_string: "String!"
  },
  ApplyCouponToCartInput: {
    cart_id: "String!",
coupon_code: "String!"
  },
  UpdateCartItemsInput: {
    cart_id: "String!",
cart_items: "[CartItemUpdateInput]!"
  },
  CartItemUpdateInput: {
    cart_item_id: "Int",
cart_item_uid: "ID",
customizable_options: "[CustomizableOptionInput]",
gift_message: "GiftMessageInput",
quantity: "Float"
  },
  RemoveItemFromCartInput: {
    cart_id: "String!",
cart_item_id: "Int",
cart_item_uid: "ID"
  },
  SetShippingAddressesOnCartInput: {
    cart_id: "String!",
shipping_addresses: "[ShippingAddressInput]!"
  },
  ShippingAddressInput: {
    address: "CartAddressInput",
customer_address_id: "Int",
customer_notes: "String",
pickup_location_code: "String"
  },
  SetBillingAddressOnCartInput: {
    billing_address: "BillingAddressInput!",
cart_id: "String!"
  },
  BillingAddressInput: {
    address: "CartAddressInput",
customer_address_id: "Int",
same_as_shipping: "Boolean",
use_for_shipping: "Boolean"
  },
  CartAddressInput: {
    city: "String!",
company: "String",
country_code: "String!",
fax: "String",
firstname: "String!",
lastname: "String!",
middlename: "String",
postcode: "String",
prefix: "String",
region: "String",
region_id: "Int",
save_in_address_book: "Boolean",
street: "[String]!",
suffix: "String",
telephone: "String",
vat_id: "String"
  },
  SetShippingMethodsOnCartInput: {
    cart_id: "String!",
shipping_methods: "[ShippingMethodInput]!"
  },
  ShippingMethodInput: {
    carrier_code: "String!",
method_code: "String!"
  },
  SetPaymentMethodAndPlaceOrderInput: {
    cart_id: "String!",
payment_method: "PaymentMethodInput!"
  },
  PlaceOrderInput: {
    cart_id: "String!",
mollie_return_url: "String"
  },
  SetPaymentMethodOnCartInput: {
    cart_id: "String!",
payment_method: "PaymentMethodInput!"
  },
  PaymentMethodInput: {
    code: "String!",
hosted_pro: "HostedProInput",
mollie_applepay_payment_token: "String",
mollie_card_token: "String",
mollie_selected_issuer: "String",
mollie_selected_terminal: "String",
payflow_express: "PayflowExpressInput",
payflow_link: "PayflowLinkInput",
payflowpro: "PayflowProInput",
payflowpro_cc_vault: "VaultTokenInput",
paypal_express: "PaypalExpressInput",
purchase_order_number: "String"
  },
  SetGuestEmailOnCartInput: {
    cart_id: "String!",
email: "String!"
  },
  RemoveCouponFromCartInput: {
    cart_id: "String!"
  },
  EstimateTotalsInput: {
    address: "EstimateAddressInput!",
cart_id: "String!",
shipping_method: "ShippingMethodInput"
  },
  EstimateAddressInput: {
    country_code: "CountryCodeEnum!",
postcode: "String",
region: "CustomerAddressRegionInput"
  },
  ContactUsInput: {
    comment: "String!",
email: "String!",
name: "String!",
telephone: "String"
  },
  AddDownloadableProductsToCartInput: {
    cart_id: "String!",
cart_items: "[DownloadableProductCartItemInput]!"
  },
  DownloadableProductCartItemInput: {
    customizable_options: "[CustomizableOptionInput]",
data: "CartItemInput!",
downloadable_product_links: "[DownloadableProductLinksInput]"
  },
  DownloadableProductLinksInput: {
    link_id: "Int!"
  },
  AddBundleProductsToCartInput: {
    cart_id: "String!",
cart_items: "[BundleProductCartItemInput]!"
  },
  BundleProductCartItemInput: {
    bundle_options: "[BundleOptionInput]!",
customizable_options: "[CustomizableOptionInput]",
data: "CartItemInput!"
  },
  BundleOptionInput: {
    id: "Int!",
quantity: "Float!",
value: "[String]!"
  },
  GiftMessageInput: {
    from: "String!",
message: "String!",
to: "String!"
  },
  AddConfigurableProductsToCartInput: {
    cart_id: "String!",
cart_items: "[ConfigurableProductCartItemInput]!"
  },
  ConfigurableProductCartItemInput: {
    customizable_options: "[CustomizableOptionInput]",
data: "CartItemInput!",
parent_sku: "String",
variant_sku: "String"
  },
  AreaInput: {
    radius: "Int!",
search_term: "String!"
  },
  PickupLocationFilterInput: {
    city: "FilterTypeInput",
country_id: "FilterTypeInput",
name: "FilterTypeInput",
pickup_location_code: "FilterTypeInput",
postcode: "FilterTypeInput",
region: "FilterTypeInput",
region_id: "FilterTypeInput",
street: "FilterTypeInput"
  },
  PickupLocationSortInput: {
    city: "SortEnum",
contact_name: "SortEnum",
country_id: "SortEnum",
description: "SortEnum",
distance: "SortEnum",
email: "SortEnum",
fax: "SortEnum",
latitude: "SortEnum",
longitude: "SortEnum",
name: "SortEnum",
phone: "SortEnum",
pickup_location_code: "SortEnum",
postcode: "SortEnum",
region: "SortEnum",
region_id: "SortEnum",
street: "SortEnum"
  },
  ProductInfoInput: {
    sku: "String!"
  },
  GenerateCustomerTokenAsAdminInput: {
    customer_email: "String!"
  },
  CustomerCreateInput: {
    allow_remote_shopping_assistance: "Boolean",
custom_attributes: "[AttributeValueInput]",
date_of_birth: "String",
dob: "String",
email: "String!",
firstname: "String!",
gender: "Int",
is_subscribed: "Boolean",
lastname: "String!",
middlename: "String",
password: "String",
prefix: "String",
suffix: "String",
taxvat: "String"
  },
  CustomerUpdateInput: {
    allow_remote_shopping_assistance: "Boolean",
custom_attributes: "[AttributeValueInput]",
date_of_birth: "String",
dob: "String",
firstname: "String",
gender: "Int",
is_subscribed: "Boolean",
lastname: "String",
middlename: "String",
prefix: "String",
suffix: "String",
taxvat: "String"
  },
  ConfirmEmailInput: {
    confirmation_key: "String!",
email: "String!"
  },
  CustomerAddressInput: {
    city: "String",
company: "String",
country_code: "CountryCodeEnum",
country_id: "CountryCodeEnum",
custom_attributes: "[CustomerAddressAttributeInput]",
custom_attributesV2: "[AttributeValueInput]",
default_billing: "Boolean",
default_shipping: "Boolean",
fax: "String",
firstname: "String",
lastname: "String",
middlename: "String",
postcode: "String",
prefix: "String",
region: "CustomerAddressRegionInput",
street: "[String]",
suffix: "String",
telephone: "String",
vat_id: "String"
  },
  CustomerAddressRegionInput: {
    region: "String",
region_code: "String",
region_id: "Int"
  },
  CustomerAddressAttributeInput: {
    attribute_code: "String!",
value: "String!"
  },
  CustomerInput: {
    date_of_birth: "String",
dob: "String",
email: "String",
firstname: "String",
gender: "Int",
is_subscribed: "Boolean",
lastname: "String",
middlename: "String",
password: "String",
prefix: "String",
suffix: "String",
taxvat: "String"
  },
  CancelOrderInput: {
    order_id: "ID!",
reason: "String!"
  },
  ConfirmCancelOrderInput: {
    confirmation_key: "String!",
order_id: "ID!"
  },
  GuestOrderCancelInput: {
    reason: "String!",
token: "String!"
  },
  CreateProductReviewInput: {
    nickname: "String!",
ratings: "[ProductReviewRatingInput]!",
sku: "String!",
summary: "String!",
text: "String!"
  },
  ProductReviewRatingInput: {
    id: "String!",
value_id: "String!"
  },
  CustomerOrdersFilterInput: {
    grand_total: "FilterRangeTypeInput",
number: "FilterStringTypeInput",
order_date: "FilterRangeTypeInput",
status: "FilterEqualTypeInput"
  },
  CustomerOrderSortInput: {
    sort_direction: "SortEnum!",
sort_field: "CustomerOrderSortableField!"
  },
  OrderTokenInput: {
    token: "String!"
  },
  OrderInformationInput: {
    email: "String!",
lastname: "String!",
number: "String!"
  },
  SendEmailToFriendInput: {
    product_id: "Int!",
recipients: "[SendEmailToFriendRecipientInput]!",
sender: "SendEmailToFriendSenderInput!"
  },
  SendEmailToFriendSenderInput: {
    email: "String!",
message: "String!",
name: "String!"
  },
  SendEmailToFriendRecipientInput: {
    email: "String!",
name: "String!"
  },
  CreateCompareListInput: {
    products: "[ID]"
  },
  AddProductsToCompareListInput: {
    products: "[ID]!",
uid: "ID!"
  },
  RemoveProductsFromCompareListInput: {
    products: "[ID]!",
uid: "ID!"
  },
  PaypalExpressTokenInput: {
    cart_id: "String!",
code: "String!",
express_button: "Boolean",
urls: "PaypalExpressUrlsInput!",
use_paypal_credit: "Boolean"
  },
  HostedProUrlInput: {
    cart_id: "String!"
  },
  HostedProInput: {
    cancel_url: "String!",
return_url: "String!"
  },
  PaypalExpressInput: {
    payer_id: "String!",
token: "String!"
  },
  PayflowExpressInput: {
    payer_id: "String!",
token: "String!"
  },
  PaypalExpressUrlsInput: {
    cancel_url: "String!",
pending_url: "String",
return_url: "String!",
success_url: "String"
  },
  PayflowLinkInput: {
    cancel_url: "String!",
error_url: "String!",
return_url: "String!"
  },
  PayflowLinkTokenInput: {
    cart_id: "String!"
  },
  PayflowProTokenInput: {
    cart_id: "String!",
urls: "PayflowProUrlInput!"
  },
  PayflowProInput: {
    cc_details: "CreditCardDetailsInput!",
is_active_payment_token_enabler: "Boolean"
  },
  CreditCardDetailsInput: {
    cc_exp_month: "Int!",
cc_exp_year: "Int!",
cc_last_4: "Int!",
cc_type: "String!"
  },
  PayflowProUrlInput: {
    cancel_url: "String!",
error_url: "String!",
return_url: "String!"
  },
  PayflowProResponseInput: {
    cart_id: "String!",
paypal_payload: "String!"
  },
  VaultTokenInput: {
    public_hash: "String!"
  },
  WishlistItemInput: {
    entered_options: "[EnteredOptionInput]",
parent_sku: "String",
quantity: "Float!",
selected_options: "[ID]",
sku: "String!"
  },
  WishlistItemUpdateInput: {
    description: "String",
entered_options: "[EnteredOptionInput]",
quantity: "Float",
selected_options: "[ID]",
wishlist_item_id: "ID!"
  },
  MollieTransactionInput: {
    issuer: "String",
payment_token: "String!"
  },
  MolliePaymentMethodsInput: {
    amount: "Float!",
currency: "String"
  },
  MollieResetCartInput: {
    cart_id: "String!"
  },
  MollieProcessTransactionInput: {
    payment_token: "String!"
  }
}

