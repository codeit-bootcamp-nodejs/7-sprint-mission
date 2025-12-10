
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model product
 * 
 */
export type product = $Result.DefaultSelection<Prisma.$productPayload>
/**
 * Model product_comment
 * 
 */
export type product_comment = $Result.DefaultSelection<Prisma.$product_commentPayload>
/**
 * Model product_image
 * 
 */
export type product_image = $Result.DefaultSelection<Prisma.$product_imagePayload>
/**
 * Model article
 * 
 */
export type article = $Result.DefaultSelection<Prisma.$articlePayload>
/**
 * Model article_comment
 * 
 */
export type article_comment = $Result.DefaultSelection<Prisma.$article_commentPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Products
 * const products = await prisma.product.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Products
   * const products = await prisma.product.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.product`: Exposes CRUD operations for the **product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.productDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product_comment`: Exposes CRUD operations for the **product_comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Product_comments
    * const product_comments = await prisma.product_comment.findMany()
    * ```
    */
  get product_comment(): Prisma.product_commentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product_image`: Exposes CRUD operations for the **product_image** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Product_images
    * const product_images = await prisma.product_image.findMany()
    * ```
    */
  get product_image(): Prisma.product_imageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.article`: Exposes CRUD operations for the **article** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Articles
    * const articles = await prisma.article.findMany()
    * ```
    */
  get article(): Prisma.articleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.article_comment`: Exposes CRUD operations for the **article_comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Article_comments
    * const article_comments = await prisma.article_comment.findMany()
    * ```
    */
  get article_comment(): Prisma.article_commentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.0.1
   * Query Engine version: f09f2815f091dbba658cdcd2264306d88bb5bda6
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    product: 'product',
    product_comment: 'product_comment',
    product_image: 'product_image',
    article: 'article',
    article_comment: 'article_comment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "product" | "product_comment" | "product_image" | "article" | "article_comment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      product: {
        payload: Prisma.$productPayload<ExtArgs>
        fields: Prisma.productFieldRefs
        operations: {
          findUnique: {
            args: Prisma.productFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.productFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          findFirst: {
            args: Prisma.productFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.productFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          findMany: {
            args: Prisma.productFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>[]
          }
          create: {
            args: Prisma.productCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          createMany: {
            args: Prisma.productCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.productCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>[]
          }
          delete: {
            args: Prisma.productDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          update: {
            args: Prisma.productUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          deleteMany: {
            args: Prisma.productDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.productUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.productUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>[]
          }
          upsert: {
            args: Prisma.productUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$productPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.productGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.productCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      product_comment: {
        payload: Prisma.$product_commentPayload<ExtArgs>
        fields: Prisma.product_commentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.product_commentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.product_commentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload>
          }
          findFirst: {
            args: Prisma.product_commentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.product_commentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload>
          }
          findMany: {
            args: Prisma.product_commentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload>[]
          }
          create: {
            args: Prisma.product_commentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload>
          }
          createMany: {
            args: Prisma.product_commentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.product_commentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload>[]
          }
          delete: {
            args: Prisma.product_commentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload>
          }
          update: {
            args: Prisma.product_commentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload>
          }
          deleteMany: {
            args: Prisma.product_commentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.product_commentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.product_commentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload>[]
          }
          upsert: {
            args: Prisma.product_commentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_commentPayload>
          }
          aggregate: {
            args: Prisma.Product_commentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct_comment>
          }
          groupBy: {
            args: Prisma.product_commentGroupByArgs<ExtArgs>
            result: $Utils.Optional<Product_commentGroupByOutputType>[]
          }
          count: {
            args: Prisma.product_commentCountArgs<ExtArgs>
            result: $Utils.Optional<Product_commentCountAggregateOutputType> | number
          }
        }
      }
      product_image: {
        payload: Prisma.$product_imagePayload<ExtArgs>
        fields: Prisma.product_imageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.product_imageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.product_imageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload>
          }
          findFirst: {
            args: Prisma.product_imageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.product_imageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload>
          }
          findMany: {
            args: Prisma.product_imageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload>[]
          }
          create: {
            args: Prisma.product_imageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload>
          }
          createMany: {
            args: Prisma.product_imageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.product_imageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload>[]
          }
          delete: {
            args: Prisma.product_imageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload>
          }
          update: {
            args: Prisma.product_imageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload>
          }
          deleteMany: {
            args: Prisma.product_imageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.product_imageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.product_imageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload>[]
          }
          upsert: {
            args: Prisma.product_imageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$product_imagePayload>
          }
          aggregate: {
            args: Prisma.Product_imageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct_image>
          }
          groupBy: {
            args: Prisma.product_imageGroupByArgs<ExtArgs>
            result: $Utils.Optional<Product_imageGroupByOutputType>[]
          }
          count: {
            args: Prisma.product_imageCountArgs<ExtArgs>
            result: $Utils.Optional<Product_imageCountAggregateOutputType> | number
          }
        }
      }
      article: {
        payload: Prisma.$articlePayload<ExtArgs>
        fields: Prisma.articleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.articleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.articleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload>
          }
          findFirst: {
            args: Prisma.articleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.articleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload>
          }
          findMany: {
            args: Prisma.articleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload>[]
          }
          create: {
            args: Prisma.articleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload>
          }
          createMany: {
            args: Prisma.articleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.articleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload>[]
          }
          delete: {
            args: Prisma.articleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload>
          }
          update: {
            args: Prisma.articleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload>
          }
          deleteMany: {
            args: Prisma.articleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.articleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.articleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload>[]
          }
          upsert: {
            args: Prisma.articleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$articlePayload>
          }
          aggregate: {
            args: Prisma.ArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticle>
          }
          groupBy: {
            args: Prisma.articleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.articleCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleCountAggregateOutputType> | number
          }
        }
      }
      article_comment: {
        payload: Prisma.$article_commentPayload<ExtArgs>
        fields: Prisma.article_commentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.article_commentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.article_commentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload>
          }
          findFirst: {
            args: Prisma.article_commentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.article_commentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload>
          }
          findMany: {
            args: Prisma.article_commentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload>[]
          }
          create: {
            args: Prisma.article_commentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload>
          }
          createMany: {
            args: Prisma.article_commentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.article_commentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload>[]
          }
          delete: {
            args: Prisma.article_commentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload>
          }
          update: {
            args: Prisma.article_commentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload>
          }
          deleteMany: {
            args: Prisma.article_commentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.article_commentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.article_commentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload>[]
          }
          upsert: {
            args: Prisma.article_commentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$article_commentPayload>
          }
          aggregate: {
            args: Prisma.Article_commentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticle_comment>
          }
          groupBy: {
            args: Prisma.article_commentGroupByArgs<ExtArgs>
            result: $Utils.Optional<Article_commentGroupByOutputType>[]
          }
          count: {
            args: Prisma.article_commentCountArgs<ExtArgs>
            result: $Utils.Optional<Article_commentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    product?: productOmit
    product_comment?: product_commentOmit
    product_image?: product_imageOmit
    article?: articleOmit
    article_comment?: article_commentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    comments: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | ProductCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: product_commentWhereInput
  }


  /**
   * Count Type ArticleCountOutputType
   */

  export type ArticleCountOutputType = {
    comments: number
  }

  export type ArticleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | ArticleCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleCountOutputType
     */
    select?: ArticleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: article_commentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    id: number | null
    price: number | null
    image_id: number | null
  }

  export type ProductSumAggregateOutputType = {
    id: bigint | null
    price: number | null
    image_id: bigint | null
  }

  export type ProductMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    description: string | null
    price: number | null
    created_at: Date | null
    updated_at: Date | null
    image_id: bigint | null
  }

  export type ProductMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    description: string | null
    price: number | null
    created_at: Date | null
    updated_at: Date | null
    image_id: bigint | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    name: number
    description: number
    price: number
    tags: number
    created_at: number
    updated_at: number
    image_id: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    id?: true
    price?: true
    image_id?: true
  }

  export type ProductSumAggregateInputType = {
    id?: true
    price?: true
    image_id?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    created_at?: true
    updated_at?: true
    image_id?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    created_at?: true
    updated_at?: true
    image_id?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    tags?: true
    created_at?: true
    updated_at?: true
    image_id?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which product to aggregate.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type productGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: productWhereInput
    orderBy?: productOrderByWithAggregationInput | productOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: productScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: bigint
    name: string
    description: string | null
    price: number
    tags: string[]
    created_at: Date
    updated_at: Date | null
    image_id: bigint | null
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends productGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type productSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    tags?: boolean
    created_at?: boolean
    updated_at?: boolean
    image_id?: boolean
    image?: boolean | product$imageArgs<ExtArgs>
    comments?: boolean | product$commentsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type productSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    tags?: boolean
    created_at?: boolean
    updated_at?: boolean
    image_id?: boolean
    image?: boolean | product$imageArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type productSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    tags?: boolean
    created_at?: boolean
    updated_at?: boolean
    image_id?: boolean
    image?: boolean | product$imageArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type productSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    tags?: boolean
    created_at?: boolean
    updated_at?: boolean
    image_id?: boolean
  }

  export type productOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "price" | "tags" | "created_at" | "updated_at" | "image_id", ExtArgs["result"]["product"]>
  export type productInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    image?: boolean | product$imageArgs<ExtArgs>
    comments?: boolean | product$commentsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type productIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    image?: boolean | product$imageArgs<ExtArgs>
  }
  export type productIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    image?: boolean | product$imageArgs<ExtArgs>
  }

  export type $productPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "product"
    objects: {
      image: Prisma.$product_imagePayload<ExtArgs> | null
      comments: Prisma.$product_commentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      description: string | null
      price: number
      tags: string[]
      created_at: Date
      updated_at: Date | null
      image_id: bigint | null
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type productGetPayload<S extends boolean | null | undefined | productDefaultArgs> = $Result.GetResult<Prisma.$productPayload, S>

  type productCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<productFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface productDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['product'], meta: { name: 'product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {productFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends productFindUniqueArgs>(args: SelectSubset<T, productFindUniqueArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {productFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends productFindUniqueOrThrowArgs>(args: SelectSubset<T, productFindUniqueOrThrowArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends productFindFirstArgs>(args?: SelectSubset<T, productFindFirstArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends productFindFirstOrThrowArgs>(args?: SelectSubset<T, productFindFirstOrThrowArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends productFindManyArgs>(args?: SelectSubset<T, productFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {productCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends productCreateArgs>(args: SelectSubset<T, productCreateArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {productCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends productCreateManyArgs>(args?: SelectSubset<T, productCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {productCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends productCreateManyAndReturnArgs>(args?: SelectSubset<T, productCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {productDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends productDeleteArgs>(args: SelectSubset<T, productDeleteArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {productUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends productUpdateArgs>(args: SelectSubset<T, productUpdateArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {productDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends productDeleteManyArgs>(args?: SelectSubset<T, productDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends productUpdateManyArgs>(args: SelectSubset<T, productUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {productUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends productUpdateManyAndReturnArgs>(args: SelectSubset<T, productUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {productUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends productUpsertArgs>(args: SelectSubset<T, productUpsertArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends productCountArgs>(
      args?: Subset<T, productCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends productGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: productGroupByArgs['orderBy'] }
        : { orderBy?: productGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, productGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the product model
   */
  readonly fields: productFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__productClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    image<T extends product$imageArgs<ExtArgs> = {}>(args?: Subset<T, product$imageArgs<ExtArgs>>): Prisma__product_imageClient<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    comments<T extends product$commentsArgs<ExtArgs> = {}>(args?: Subset<T, product$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the product model
   */
  interface productFieldRefs {
    readonly id: FieldRef<"product", 'BigInt'>
    readonly name: FieldRef<"product", 'String'>
    readonly description: FieldRef<"product", 'String'>
    readonly price: FieldRef<"product", 'Int'>
    readonly tags: FieldRef<"product", 'String[]'>
    readonly created_at: FieldRef<"product", 'DateTime'>
    readonly updated_at: FieldRef<"product", 'DateTime'>
    readonly image_id: FieldRef<"product", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * product findUnique
   */
  export type productFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where: productWhereUniqueInput
  }

  /**
   * product findUniqueOrThrow
   */
  export type productFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where: productWhereUniqueInput
  }

  /**
   * product findFirst
   */
  export type productFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for products.
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * product findFirstOrThrow
   */
  export type productFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which product to fetch.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for products.
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * product findMany
   */
  export type productFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter, which products to fetch.
     */
    where?: productWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of products to fetch.
     */
    orderBy?: productOrderByWithRelationInput | productOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing products.
     */
    cursor?: productWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * product create
   */
  export type productCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * The data needed to create a product.
     */
    data: XOR<productCreateInput, productUncheckedCreateInput>
  }

  /**
   * product createMany
   */
  export type productCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many products.
     */
    data: productCreateManyInput | productCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * product createManyAndReturn
   */
  export type productCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * The data used to create many products.
     */
    data: productCreateManyInput | productCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * product update
   */
  export type productUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * The data needed to update a product.
     */
    data: XOR<productUpdateInput, productUncheckedUpdateInput>
    /**
     * Choose, which product to update.
     */
    where: productWhereUniqueInput
  }

  /**
   * product updateMany
   */
  export type productUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update products.
     */
    data: XOR<productUpdateManyMutationInput, productUncheckedUpdateManyInput>
    /**
     * Filter which products to update
     */
    where?: productWhereInput
    /**
     * Limit how many products to update.
     */
    limit?: number
  }

  /**
   * product updateManyAndReturn
   */
  export type productUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * The data used to update products.
     */
    data: XOR<productUpdateManyMutationInput, productUncheckedUpdateManyInput>
    /**
     * Filter which products to update
     */
    where?: productWhereInput
    /**
     * Limit how many products to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * product upsert
   */
  export type productUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * The filter to search for the product to update in case it exists.
     */
    where: productWhereUniqueInput
    /**
     * In case the product found by the `where` argument doesn't exist, create a new product with this data.
     */
    create: XOR<productCreateInput, productUncheckedCreateInput>
    /**
     * In case the product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<productUpdateInput, productUncheckedUpdateInput>
  }

  /**
   * product delete
   */
  export type productDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    /**
     * Filter which product to delete.
     */
    where: productWhereUniqueInput
  }

  /**
   * product deleteMany
   */
  export type productDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which products to delete
     */
    where?: productWhereInput
    /**
     * Limit how many products to delete.
     */
    limit?: number
  }

  /**
   * product.image
   */
  export type product$imageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    where?: product_imageWhereInput
  }

  /**
   * product.comments
   */
  export type product$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    where?: product_commentWhereInput
    orderBy?: product_commentOrderByWithRelationInput | product_commentOrderByWithRelationInput[]
    cursor?: product_commentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Product_commentScalarFieldEnum | Product_commentScalarFieldEnum[]
  }

  /**
   * product without action
   */
  export type productDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
  }


  /**
   * Model product_comment
   */

  export type AggregateProduct_comment = {
    _count: Product_commentCountAggregateOutputType | null
    _avg: Product_commentAvgAggregateOutputType | null
    _sum: Product_commentSumAggregateOutputType | null
    _min: Product_commentMinAggregateOutputType | null
    _max: Product_commentMaxAggregateOutputType | null
  }

  export type Product_commentAvgAggregateOutputType = {
    id: number | null
    product_id: number | null
  }

  export type Product_commentSumAggregateOutputType = {
    id: bigint | null
    product_id: bigint | null
  }

  export type Product_commentMinAggregateOutputType = {
    id: bigint | null
    content: string | null
    created_at: Date | null
    updated_at: Date | null
    product_id: bigint | null
  }

  export type Product_commentMaxAggregateOutputType = {
    id: bigint | null
    content: string | null
    created_at: Date | null
    updated_at: Date | null
    product_id: bigint | null
  }

  export type Product_commentCountAggregateOutputType = {
    id: number
    content: number
    created_at: number
    updated_at: number
    product_id: number
    _all: number
  }


  export type Product_commentAvgAggregateInputType = {
    id?: true
    product_id?: true
  }

  export type Product_commentSumAggregateInputType = {
    id?: true
    product_id?: true
  }

  export type Product_commentMinAggregateInputType = {
    id?: true
    content?: true
    created_at?: true
    updated_at?: true
    product_id?: true
  }

  export type Product_commentMaxAggregateInputType = {
    id?: true
    content?: true
    created_at?: true
    updated_at?: true
    product_id?: true
  }

  export type Product_commentCountAggregateInputType = {
    id?: true
    content?: true
    created_at?: true
    updated_at?: true
    product_id?: true
    _all?: true
  }

  export type Product_commentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which product_comment to aggregate.
     */
    where?: product_commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_comments to fetch.
     */
    orderBy?: product_commentOrderByWithRelationInput | product_commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: product_commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned product_comments
    **/
    _count?: true | Product_commentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Product_commentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Product_commentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Product_commentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Product_commentMaxAggregateInputType
  }

  export type GetProduct_commentAggregateType<T extends Product_commentAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct_comment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct_comment[P]>
      : GetScalarType<T[P], AggregateProduct_comment[P]>
  }




  export type product_commentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: product_commentWhereInput
    orderBy?: product_commentOrderByWithAggregationInput | product_commentOrderByWithAggregationInput[]
    by: Product_commentScalarFieldEnum[] | Product_commentScalarFieldEnum
    having?: product_commentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Product_commentCountAggregateInputType | true
    _avg?: Product_commentAvgAggregateInputType
    _sum?: Product_commentSumAggregateInputType
    _min?: Product_commentMinAggregateInputType
    _max?: Product_commentMaxAggregateInputType
  }

  export type Product_commentGroupByOutputType = {
    id: bigint
    content: string
    created_at: Date
    updated_at: Date | null
    product_id: bigint
    _count: Product_commentCountAggregateOutputType | null
    _avg: Product_commentAvgAggregateOutputType | null
    _sum: Product_commentSumAggregateOutputType | null
    _min: Product_commentMinAggregateOutputType | null
    _max: Product_commentMaxAggregateOutputType | null
  }

  type GetProduct_commentGroupByPayload<T extends product_commentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Product_commentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Product_commentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Product_commentGroupByOutputType[P]>
            : GetScalarType<T[P], Product_commentGroupByOutputType[P]>
        }
      >
    >


  export type product_commentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    product_id?: boolean
    product?: boolean | productDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product_comment"]>

  export type product_commentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    product_id?: boolean
    product?: boolean | productDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product_comment"]>

  export type product_commentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    product_id?: boolean
    product?: boolean | productDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product_comment"]>

  export type product_commentSelectScalar = {
    id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    product_id?: boolean
  }

  export type product_commentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "created_at" | "updated_at" | "product_id", ExtArgs["result"]["product_comment"]>
  export type product_commentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | productDefaultArgs<ExtArgs>
  }
  export type product_commentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | productDefaultArgs<ExtArgs>
  }
  export type product_commentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | productDefaultArgs<ExtArgs>
  }

  export type $product_commentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "product_comment"
    objects: {
      product: Prisma.$productPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      content: string
      created_at: Date
      updated_at: Date | null
      product_id: bigint
    }, ExtArgs["result"]["product_comment"]>
    composites: {}
  }

  type product_commentGetPayload<S extends boolean | null | undefined | product_commentDefaultArgs> = $Result.GetResult<Prisma.$product_commentPayload, S>

  type product_commentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<product_commentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Product_commentCountAggregateInputType | true
    }

  export interface product_commentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['product_comment'], meta: { name: 'product_comment' } }
    /**
     * Find zero or one Product_comment that matches the filter.
     * @param {product_commentFindUniqueArgs} args - Arguments to find a Product_comment
     * @example
     * // Get one Product_comment
     * const product_comment = await prisma.product_comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends product_commentFindUniqueArgs>(args: SelectSubset<T, product_commentFindUniqueArgs<ExtArgs>>): Prisma__product_commentClient<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product_comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {product_commentFindUniqueOrThrowArgs} args - Arguments to find a Product_comment
     * @example
     * // Get one Product_comment
     * const product_comment = await prisma.product_comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends product_commentFindUniqueOrThrowArgs>(args: SelectSubset<T, product_commentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__product_commentClient<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product_comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_commentFindFirstArgs} args - Arguments to find a Product_comment
     * @example
     * // Get one Product_comment
     * const product_comment = await prisma.product_comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends product_commentFindFirstArgs>(args?: SelectSubset<T, product_commentFindFirstArgs<ExtArgs>>): Prisma__product_commentClient<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product_comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_commentFindFirstOrThrowArgs} args - Arguments to find a Product_comment
     * @example
     * // Get one Product_comment
     * const product_comment = await prisma.product_comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends product_commentFindFirstOrThrowArgs>(args?: SelectSubset<T, product_commentFindFirstOrThrowArgs<ExtArgs>>): Prisma__product_commentClient<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Product_comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_commentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Product_comments
     * const product_comments = await prisma.product_comment.findMany()
     * 
     * // Get first 10 Product_comments
     * const product_comments = await prisma.product_comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const product_commentWithIdOnly = await prisma.product_comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends product_commentFindManyArgs>(args?: SelectSubset<T, product_commentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product_comment.
     * @param {product_commentCreateArgs} args - Arguments to create a Product_comment.
     * @example
     * // Create one Product_comment
     * const Product_comment = await prisma.product_comment.create({
     *   data: {
     *     // ... data to create a Product_comment
     *   }
     * })
     * 
     */
    create<T extends product_commentCreateArgs>(args: SelectSubset<T, product_commentCreateArgs<ExtArgs>>): Prisma__product_commentClient<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Product_comments.
     * @param {product_commentCreateManyArgs} args - Arguments to create many Product_comments.
     * @example
     * // Create many Product_comments
     * const product_comment = await prisma.product_comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends product_commentCreateManyArgs>(args?: SelectSubset<T, product_commentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Product_comments and returns the data saved in the database.
     * @param {product_commentCreateManyAndReturnArgs} args - Arguments to create many Product_comments.
     * @example
     * // Create many Product_comments
     * const product_comment = await prisma.product_comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Product_comments and only return the `id`
     * const product_commentWithIdOnly = await prisma.product_comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends product_commentCreateManyAndReturnArgs>(args?: SelectSubset<T, product_commentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product_comment.
     * @param {product_commentDeleteArgs} args - Arguments to delete one Product_comment.
     * @example
     * // Delete one Product_comment
     * const Product_comment = await prisma.product_comment.delete({
     *   where: {
     *     // ... filter to delete one Product_comment
     *   }
     * })
     * 
     */
    delete<T extends product_commentDeleteArgs>(args: SelectSubset<T, product_commentDeleteArgs<ExtArgs>>): Prisma__product_commentClient<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product_comment.
     * @param {product_commentUpdateArgs} args - Arguments to update one Product_comment.
     * @example
     * // Update one Product_comment
     * const product_comment = await prisma.product_comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends product_commentUpdateArgs>(args: SelectSubset<T, product_commentUpdateArgs<ExtArgs>>): Prisma__product_commentClient<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Product_comments.
     * @param {product_commentDeleteManyArgs} args - Arguments to filter Product_comments to delete.
     * @example
     * // Delete a few Product_comments
     * const { count } = await prisma.product_comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends product_commentDeleteManyArgs>(args?: SelectSubset<T, product_commentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Product_comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_commentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Product_comments
     * const product_comment = await prisma.product_comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends product_commentUpdateManyArgs>(args: SelectSubset<T, product_commentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Product_comments and returns the data updated in the database.
     * @param {product_commentUpdateManyAndReturnArgs} args - Arguments to update many Product_comments.
     * @example
     * // Update many Product_comments
     * const product_comment = await prisma.product_comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Product_comments and only return the `id`
     * const product_commentWithIdOnly = await prisma.product_comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends product_commentUpdateManyAndReturnArgs>(args: SelectSubset<T, product_commentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product_comment.
     * @param {product_commentUpsertArgs} args - Arguments to update or create a Product_comment.
     * @example
     * // Update or create a Product_comment
     * const product_comment = await prisma.product_comment.upsert({
     *   create: {
     *     // ... data to create a Product_comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product_comment we want to update
     *   }
     * })
     */
    upsert<T extends product_commentUpsertArgs>(args: SelectSubset<T, product_commentUpsertArgs<ExtArgs>>): Prisma__product_commentClient<$Result.GetResult<Prisma.$product_commentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Product_comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_commentCountArgs} args - Arguments to filter Product_comments to count.
     * @example
     * // Count the number of Product_comments
     * const count = await prisma.product_comment.count({
     *   where: {
     *     // ... the filter for the Product_comments we want to count
     *   }
     * })
    **/
    count<T extends product_commentCountArgs>(
      args?: Subset<T, product_commentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Product_commentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product_comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Product_commentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Product_commentAggregateArgs>(args: Subset<T, Product_commentAggregateArgs>): Prisma.PrismaPromise<GetProduct_commentAggregateType<T>>

    /**
     * Group by Product_comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_commentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends product_commentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: product_commentGroupByArgs['orderBy'] }
        : { orderBy?: product_commentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, product_commentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProduct_commentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the product_comment model
   */
  readonly fields: product_commentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for product_comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__product_commentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends productDefaultArgs<ExtArgs> = {}>(args?: Subset<T, productDefaultArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the product_comment model
   */
  interface product_commentFieldRefs {
    readonly id: FieldRef<"product_comment", 'BigInt'>
    readonly content: FieldRef<"product_comment", 'String'>
    readonly created_at: FieldRef<"product_comment", 'DateTime'>
    readonly updated_at: FieldRef<"product_comment", 'DateTime'>
    readonly product_id: FieldRef<"product_comment", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * product_comment findUnique
   */
  export type product_commentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    /**
     * Filter, which product_comment to fetch.
     */
    where: product_commentWhereUniqueInput
  }

  /**
   * product_comment findUniqueOrThrow
   */
  export type product_commentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    /**
     * Filter, which product_comment to fetch.
     */
    where: product_commentWhereUniqueInput
  }

  /**
   * product_comment findFirst
   */
  export type product_commentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    /**
     * Filter, which product_comment to fetch.
     */
    where?: product_commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_comments to fetch.
     */
    orderBy?: product_commentOrderByWithRelationInput | product_commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for product_comments.
     */
    cursor?: product_commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of product_comments.
     */
    distinct?: Product_commentScalarFieldEnum | Product_commentScalarFieldEnum[]
  }

  /**
   * product_comment findFirstOrThrow
   */
  export type product_commentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    /**
     * Filter, which product_comment to fetch.
     */
    where?: product_commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_comments to fetch.
     */
    orderBy?: product_commentOrderByWithRelationInput | product_commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for product_comments.
     */
    cursor?: product_commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of product_comments.
     */
    distinct?: Product_commentScalarFieldEnum | Product_commentScalarFieldEnum[]
  }

  /**
   * product_comment findMany
   */
  export type product_commentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    /**
     * Filter, which product_comments to fetch.
     */
    where?: product_commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_comments to fetch.
     */
    orderBy?: product_commentOrderByWithRelationInput | product_commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing product_comments.
     */
    cursor?: product_commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_comments.
     */
    skip?: number
    distinct?: Product_commentScalarFieldEnum | Product_commentScalarFieldEnum[]
  }

  /**
   * product_comment create
   */
  export type product_commentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    /**
     * The data needed to create a product_comment.
     */
    data: XOR<product_commentCreateInput, product_commentUncheckedCreateInput>
  }

  /**
   * product_comment createMany
   */
  export type product_commentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many product_comments.
     */
    data: product_commentCreateManyInput | product_commentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * product_comment createManyAndReturn
   */
  export type product_commentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * The data used to create many product_comments.
     */
    data: product_commentCreateManyInput | product_commentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * product_comment update
   */
  export type product_commentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    /**
     * The data needed to update a product_comment.
     */
    data: XOR<product_commentUpdateInput, product_commentUncheckedUpdateInput>
    /**
     * Choose, which product_comment to update.
     */
    where: product_commentWhereUniqueInput
  }

  /**
   * product_comment updateMany
   */
  export type product_commentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update product_comments.
     */
    data: XOR<product_commentUpdateManyMutationInput, product_commentUncheckedUpdateManyInput>
    /**
     * Filter which product_comments to update
     */
    where?: product_commentWhereInput
    /**
     * Limit how many product_comments to update.
     */
    limit?: number
  }

  /**
   * product_comment updateManyAndReturn
   */
  export type product_commentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * The data used to update product_comments.
     */
    data: XOR<product_commentUpdateManyMutationInput, product_commentUncheckedUpdateManyInput>
    /**
     * Filter which product_comments to update
     */
    where?: product_commentWhereInput
    /**
     * Limit how many product_comments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * product_comment upsert
   */
  export type product_commentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    /**
     * The filter to search for the product_comment to update in case it exists.
     */
    where: product_commentWhereUniqueInput
    /**
     * In case the product_comment found by the `where` argument doesn't exist, create a new product_comment with this data.
     */
    create: XOR<product_commentCreateInput, product_commentUncheckedCreateInput>
    /**
     * In case the product_comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<product_commentUpdateInput, product_commentUncheckedUpdateInput>
  }

  /**
   * product_comment delete
   */
  export type product_commentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
    /**
     * Filter which product_comment to delete.
     */
    where: product_commentWhereUniqueInput
  }

  /**
   * product_comment deleteMany
   */
  export type product_commentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which product_comments to delete
     */
    where?: product_commentWhereInput
    /**
     * Limit how many product_comments to delete.
     */
    limit?: number
  }

  /**
   * product_comment without action
   */
  export type product_commentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_comment
     */
    select?: product_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_comment
     */
    omit?: product_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_commentInclude<ExtArgs> | null
  }


  /**
   * Model product_image
   */

  export type AggregateProduct_image = {
    _count: Product_imageCountAggregateOutputType | null
    _avg: Product_imageAvgAggregateOutputType | null
    _sum: Product_imageSumAggregateOutputType | null
    _min: Product_imageMinAggregateOutputType | null
    _max: Product_imageMaxAggregateOutputType | null
  }

  export type Product_imageAvgAggregateOutputType = {
    id: number | null
    size: number | null
  }

  export type Product_imageSumAggregateOutputType = {
    id: bigint | null
    size: number | null
  }

  export type Product_imageMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    path: string | null
    size: number | null
    created_at: Date | null
  }

  export type Product_imageMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    path: string | null
    size: number | null
    created_at: Date | null
  }

  export type Product_imageCountAggregateOutputType = {
    id: number
    name: number
    path: number
    size: number
    created_at: number
    _all: number
  }


  export type Product_imageAvgAggregateInputType = {
    id?: true
    size?: true
  }

  export type Product_imageSumAggregateInputType = {
    id?: true
    size?: true
  }

  export type Product_imageMinAggregateInputType = {
    id?: true
    name?: true
    path?: true
    size?: true
    created_at?: true
  }

  export type Product_imageMaxAggregateInputType = {
    id?: true
    name?: true
    path?: true
    size?: true
    created_at?: true
  }

  export type Product_imageCountAggregateInputType = {
    id?: true
    name?: true
    path?: true
    size?: true
    created_at?: true
    _all?: true
  }

  export type Product_imageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which product_image to aggregate.
     */
    where?: product_imageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_images to fetch.
     */
    orderBy?: product_imageOrderByWithRelationInput | product_imageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: product_imageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned product_images
    **/
    _count?: true | Product_imageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Product_imageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Product_imageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Product_imageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Product_imageMaxAggregateInputType
  }

  export type GetProduct_imageAggregateType<T extends Product_imageAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct_image]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct_image[P]>
      : GetScalarType<T[P], AggregateProduct_image[P]>
  }




  export type product_imageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: product_imageWhereInput
    orderBy?: product_imageOrderByWithAggregationInput | product_imageOrderByWithAggregationInput[]
    by: Product_imageScalarFieldEnum[] | Product_imageScalarFieldEnum
    having?: product_imageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Product_imageCountAggregateInputType | true
    _avg?: Product_imageAvgAggregateInputType
    _sum?: Product_imageSumAggregateInputType
    _min?: Product_imageMinAggregateInputType
    _max?: Product_imageMaxAggregateInputType
  }

  export type Product_imageGroupByOutputType = {
    id: bigint
    name: string
    path: string
    size: number
    created_at: Date
    _count: Product_imageCountAggregateOutputType | null
    _avg: Product_imageAvgAggregateOutputType | null
    _sum: Product_imageSumAggregateOutputType | null
    _min: Product_imageMinAggregateOutputType | null
    _max: Product_imageMaxAggregateOutputType | null
  }

  type GetProduct_imageGroupByPayload<T extends product_imageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Product_imageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Product_imageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Product_imageGroupByOutputType[P]>
            : GetScalarType<T[P], Product_imageGroupByOutputType[P]>
        }
      >
    >


  export type product_imageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    path?: boolean
    size?: boolean
    created_at?: boolean
    product?: boolean | product_image$productArgs<ExtArgs>
  }, ExtArgs["result"]["product_image"]>

  export type product_imageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    path?: boolean
    size?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["product_image"]>

  export type product_imageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    path?: boolean
    size?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["product_image"]>

  export type product_imageSelectScalar = {
    id?: boolean
    name?: boolean
    path?: boolean
    size?: boolean
    created_at?: boolean
  }

  export type product_imageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "path" | "size" | "created_at", ExtArgs["result"]["product_image"]>
  export type product_imageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | product_image$productArgs<ExtArgs>
  }
  export type product_imageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type product_imageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $product_imagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "product_image"
    objects: {
      product: Prisma.$productPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      path: string
      size: number
      created_at: Date
    }, ExtArgs["result"]["product_image"]>
    composites: {}
  }

  type product_imageGetPayload<S extends boolean | null | undefined | product_imageDefaultArgs> = $Result.GetResult<Prisma.$product_imagePayload, S>

  type product_imageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<product_imageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Product_imageCountAggregateInputType | true
    }

  export interface product_imageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['product_image'], meta: { name: 'product_image' } }
    /**
     * Find zero or one Product_image that matches the filter.
     * @param {product_imageFindUniqueArgs} args - Arguments to find a Product_image
     * @example
     * // Get one Product_image
     * const product_image = await prisma.product_image.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends product_imageFindUniqueArgs>(args: SelectSubset<T, product_imageFindUniqueArgs<ExtArgs>>): Prisma__product_imageClient<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product_image that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {product_imageFindUniqueOrThrowArgs} args - Arguments to find a Product_image
     * @example
     * // Get one Product_image
     * const product_image = await prisma.product_image.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends product_imageFindUniqueOrThrowArgs>(args: SelectSubset<T, product_imageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__product_imageClient<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product_image that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_imageFindFirstArgs} args - Arguments to find a Product_image
     * @example
     * // Get one Product_image
     * const product_image = await prisma.product_image.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends product_imageFindFirstArgs>(args?: SelectSubset<T, product_imageFindFirstArgs<ExtArgs>>): Prisma__product_imageClient<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product_image that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_imageFindFirstOrThrowArgs} args - Arguments to find a Product_image
     * @example
     * // Get one Product_image
     * const product_image = await prisma.product_image.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends product_imageFindFirstOrThrowArgs>(args?: SelectSubset<T, product_imageFindFirstOrThrowArgs<ExtArgs>>): Prisma__product_imageClient<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Product_images that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_imageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Product_images
     * const product_images = await prisma.product_image.findMany()
     * 
     * // Get first 10 Product_images
     * const product_images = await prisma.product_image.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const product_imageWithIdOnly = await prisma.product_image.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends product_imageFindManyArgs>(args?: SelectSubset<T, product_imageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product_image.
     * @param {product_imageCreateArgs} args - Arguments to create a Product_image.
     * @example
     * // Create one Product_image
     * const Product_image = await prisma.product_image.create({
     *   data: {
     *     // ... data to create a Product_image
     *   }
     * })
     * 
     */
    create<T extends product_imageCreateArgs>(args: SelectSubset<T, product_imageCreateArgs<ExtArgs>>): Prisma__product_imageClient<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Product_images.
     * @param {product_imageCreateManyArgs} args - Arguments to create many Product_images.
     * @example
     * // Create many Product_images
     * const product_image = await prisma.product_image.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends product_imageCreateManyArgs>(args?: SelectSubset<T, product_imageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Product_images and returns the data saved in the database.
     * @param {product_imageCreateManyAndReturnArgs} args - Arguments to create many Product_images.
     * @example
     * // Create many Product_images
     * const product_image = await prisma.product_image.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Product_images and only return the `id`
     * const product_imageWithIdOnly = await prisma.product_image.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends product_imageCreateManyAndReturnArgs>(args?: SelectSubset<T, product_imageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product_image.
     * @param {product_imageDeleteArgs} args - Arguments to delete one Product_image.
     * @example
     * // Delete one Product_image
     * const Product_image = await prisma.product_image.delete({
     *   where: {
     *     // ... filter to delete one Product_image
     *   }
     * })
     * 
     */
    delete<T extends product_imageDeleteArgs>(args: SelectSubset<T, product_imageDeleteArgs<ExtArgs>>): Prisma__product_imageClient<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product_image.
     * @param {product_imageUpdateArgs} args - Arguments to update one Product_image.
     * @example
     * // Update one Product_image
     * const product_image = await prisma.product_image.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends product_imageUpdateArgs>(args: SelectSubset<T, product_imageUpdateArgs<ExtArgs>>): Prisma__product_imageClient<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Product_images.
     * @param {product_imageDeleteManyArgs} args - Arguments to filter Product_images to delete.
     * @example
     * // Delete a few Product_images
     * const { count } = await prisma.product_image.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends product_imageDeleteManyArgs>(args?: SelectSubset<T, product_imageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Product_images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_imageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Product_images
     * const product_image = await prisma.product_image.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends product_imageUpdateManyArgs>(args: SelectSubset<T, product_imageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Product_images and returns the data updated in the database.
     * @param {product_imageUpdateManyAndReturnArgs} args - Arguments to update many Product_images.
     * @example
     * // Update many Product_images
     * const product_image = await prisma.product_image.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Product_images and only return the `id`
     * const product_imageWithIdOnly = await prisma.product_image.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends product_imageUpdateManyAndReturnArgs>(args: SelectSubset<T, product_imageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product_image.
     * @param {product_imageUpsertArgs} args - Arguments to update or create a Product_image.
     * @example
     * // Update or create a Product_image
     * const product_image = await prisma.product_image.upsert({
     *   create: {
     *     // ... data to create a Product_image
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product_image we want to update
     *   }
     * })
     */
    upsert<T extends product_imageUpsertArgs>(args: SelectSubset<T, product_imageUpsertArgs<ExtArgs>>): Prisma__product_imageClient<$Result.GetResult<Prisma.$product_imagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Product_images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_imageCountArgs} args - Arguments to filter Product_images to count.
     * @example
     * // Count the number of Product_images
     * const count = await prisma.product_image.count({
     *   where: {
     *     // ... the filter for the Product_images we want to count
     *   }
     * })
    **/
    count<T extends product_imageCountArgs>(
      args?: Subset<T, product_imageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Product_imageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product_image.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Product_imageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Product_imageAggregateArgs>(args: Subset<T, Product_imageAggregateArgs>): Prisma.PrismaPromise<GetProduct_imageAggregateType<T>>

    /**
     * Group by Product_image.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {product_imageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends product_imageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: product_imageGroupByArgs['orderBy'] }
        : { orderBy?: product_imageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, product_imageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProduct_imageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the product_image model
   */
  readonly fields: product_imageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for product_image.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__product_imageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends product_image$productArgs<ExtArgs> = {}>(args?: Subset<T, product_image$productArgs<ExtArgs>>): Prisma__productClient<$Result.GetResult<Prisma.$productPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the product_image model
   */
  interface product_imageFieldRefs {
    readonly id: FieldRef<"product_image", 'BigInt'>
    readonly name: FieldRef<"product_image", 'String'>
    readonly path: FieldRef<"product_image", 'String'>
    readonly size: FieldRef<"product_image", 'Int'>
    readonly created_at: FieldRef<"product_image", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * product_image findUnique
   */
  export type product_imageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    /**
     * Filter, which product_image to fetch.
     */
    where: product_imageWhereUniqueInput
  }

  /**
   * product_image findUniqueOrThrow
   */
  export type product_imageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    /**
     * Filter, which product_image to fetch.
     */
    where: product_imageWhereUniqueInput
  }

  /**
   * product_image findFirst
   */
  export type product_imageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    /**
     * Filter, which product_image to fetch.
     */
    where?: product_imageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_images to fetch.
     */
    orderBy?: product_imageOrderByWithRelationInput | product_imageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for product_images.
     */
    cursor?: product_imageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of product_images.
     */
    distinct?: Product_imageScalarFieldEnum | Product_imageScalarFieldEnum[]
  }

  /**
   * product_image findFirstOrThrow
   */
  export type product_imageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    /**
     * Filter, which product_image to fetch.
     */
    where?: product_imageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_images to fetch.
     */
    orderBy?: product_imageOrderByWithRelationInput | product_imageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for product_images.
     */
    cursor?: product_imageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of product_images.
     */
    distinct?: Product_imageScalarFieldEnum | Product_imageScalarFieldEnum[]
  }

  /**
   * product_image findMany
   */
  export type product_imageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    /**
     * Filter, which product_images to fetch.
     */
    where?: product_imageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of product_images to fetch.
     */
    orderBy?: product_imageOrderByWithRelationInput | product_imageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing product_images.
     */
    cursor?: product_imageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` product_images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` product_images.
     */
    skip?: number
    distinct?: Product_imageScalarFieldEnum | Product_imageScalarFieldEnum[]
  }

  /**
   * product_image create
   */
  export type product_imageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    /**
     * The data needed to create a product_image.
     */
    data: XOR<product_imageCreateInput, product_imageUncheckedCreateInput>
  }

  /**
   * product_image createMany
   */
  export type product_imageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many product_images.
     */
    data: product_imageCreateManyInput | product_imageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * product_image createManyAndReturn
   */
  export type product_imageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * The data used to create many product_images.
     */
    data: product_imageCreateManyInput | product_imageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * product_image update
   */
  export type product_imageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    /**
     * The data needed to update a product_image.
     */
    data: XOR<product_imageUpdateInput, product_imageUncheckedUpdateInput>
    /**
     * Choose, which product_image to update.
     */
    where: product_imageWhereUniqueInput
  }

  /**
   * product_image updateMany
   */
  export type product_imageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update product_images.
     */
    data: XOR<product_imageUpdateManyMutationInput, product_imageUncheckedUpdateManyInput>
    /**
     * Filter which product_images to update
     */
    where?: product_imageWhereInput
    /**
     * Limit how many product_images to update.
     */
    limit?: number
  }

  /**
   * product_image updateManyAndReturn
   */
  export type product_imageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * The data used to update product_images.
     */
    data: XOR<product_imageUpdateManyMutationInput, product_imageUncheckedUpdateManyInput>
    /**
     * Filter which product_images to update
     */
    where?: product_imageWhereInput
    /**
     * Limit how many product_images to update.
     */
    limit?: number
  }

  /**
   * product_image upsert
   */
  export type product_imageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    /**
     * The filter to search for the product_image to update in case it exists.
     */
    where: product_imageWhereUniqueInput
    /**
     * In case the product_image found by the `where` argument doesn't exist, create a new product_image with this data.
     */
    create: XOR<product_imageCreateInput, product_imageUncheckedCreateInput>
    /**
     * In case the product_image was found with the provided `where` argument, update it with this data.
     */
    update: XOR<product_imageUpdateInput, product_imageUncheckedUpdateInput>
  }

  /**
   * product_image delete
   */
  export type product_imageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
    /**
     * Filter which product_image to delete.
     */
    where: product_imageWhereUniqueInput
  }

  /**
   * product_image deleteMany
   */
  export type product_imageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which product_images to delete
     */
    where?: product_imageWhereInput
    /**
     * Limit how many product_images to delete.
     */
    limit?: number
  }

  /**
   * product_image.product
   */
  export type product_image$productArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product
     */
    select?: productSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product
     */
    omit?: productOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: productInclude<ExtArgs> | null
    where?: productWhereInput
  }

  /**
   * product_image without action
   */
  export type product_imageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_image
     */
    select?: product_imageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the product_image
     */
    omit?: product_imageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: product_imageInclude<ExtArgs> | null
  }


  /**
   * Model article
   */

  export type AggregateArticle = {
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  export type ArticleAvgAggregateOutputType = {
    id: number | null
  }

  export type ArticleSumAggregateOutputType = {
    id: bigint | null
  }

  export type ArticleMinAggregateOutputType = {
    id: bigint | null
    title: string | null
    content: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ArticleMaxAggregateOutputType = {
    id: bigint | null
    title: string | null
    content: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ArticleCountAggregateOutputType = {
    id: number
    title: number
    content: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ArticleAvgAggregateInputType = {
    id?: true
  }

  export type ArticleSumAggregateInputType = {
    id?: true
  }

  export type ArticleMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticleMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticleCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which article to aggregate.
     */
    where?: articleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of articles to fetch.
     */
    orderBy?: articleOrderByWithRelationInput | articleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: articleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned articles
    **/
    _count?: true | ArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMaxAggregateInputType
  }

  export type GetArticleAggregateType<T extends ArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle[P]>
      : GetScalarType<T[P], AggregateArticle[P]>
  }




  export type articleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: articleWhereInput
    orderBy?: articleOrderByWithAggregationInput | articleOrderByWithAggregationInput[]
    by: ArticleScalarFieldEnum[] | ArticleScalarFieldEnum
    having?: articleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleCountAggregateInputType | true
    _avg?: ArticleAvgAggregateInputType
    _sum?: ArticleSumAggregateInputType
    _min?: ArticleMinAggregateInputType
    _max?: ArticleMaxAggregateInputType
  }

  export type ArticleGroupByOutputType = {
    id: bigint
    title: string
    content: string
    created_at: Date
    updated_at: Date | null
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  type GetArticleGroupByPayload<T extends articleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleGroupByOutputType[P]>
        }
      >
    >


  export type articleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    comments?: boolean | article$commentsArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type articleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["article"]>

  export type articleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["article"]>

  export type articleSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type articleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "created_at" | "updated_at", ExtArgs["result"]["article"]>
  export type articleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | article$commentsArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type articleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type articleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $articlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "article"
    objects: {
      comments: Prisma.$article_commentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      title: string
      content: string
      created_at: Date
      updated_at: Date | null
    }, ExtArgs["result"]["article"]>
    composites: {}
  }

  type articleGetPayload<S extends boolean | null | undefined | articleDefaultArgs> = $Result.GetResult<Prisma.$articlePayload, S>

  type articleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<articleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleCountAggregateInputType | true
    }

  export interface articleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['article'], meta: { name: 'article' } }
    /**
     * Find zero or one Article that matches the filter.
     * @param {articleFindUniqueArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends articleFindUniqueArgs>(args: SelectSubset<T, articleFindUniqueArgs<ExtArgs>>): Prisma__articleClient<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Article that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {articleFindUniqueOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends articleFindUniqueOrThrowArgs>(args: SelectSubset<T, articleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__articleClient<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {articleFindFirstArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends articleFindFirstArgs>(args?: SelectSubset<T, articleFindFirstArgs<ExtArgs>>): Prisma__articleClient<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {articleFindFirstOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends articleFindFirstOrThrowArgs>(args?: SelectSubset<T, articleFindFirstOrThrowArgs<ExtArgs>>): Prisma__articleClient<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {articleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.article.findMany()
     * 
     * // Get first 10 Articles
     * const articles = await prisma.article.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleWithIdOnly = await prisma.article.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends articleFindManyArgs>(args?: SelectSubset<T, articleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Article.
     * @param {articleCreateArgs} args - Arguments to create a Article.
     * @example
     * // Create one Article
     * const Article = await prisma.article.create({
     *   data: {
     *     // ... data to create a Article
     *   }
     * })
     * 
     */
    create<T extends articleCreateArgs>(args: SelectSubset<T, articleCreateArgs<ExtArgs>>): Prisma__articleClient<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Articles.
     * @param {articleCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends articleCreateManyArgs>(args?: SelectSubset<T, articleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Articles and returns the data saved in the database.
     * @param {articleCreateManyAndReturnArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends articleCreateManyAndReturnArgs>(args?: SelectSubset<T, articleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Article.
     * @param {articleDeleteArgs} args - Arguments to delete one Article.
     * @example
     * // Delete one Article
     * const Article = await prisma.article.delete({
     *   where: {
     *     // ... filter to delete one Article
     *   }
     * })
     * 
     */
    delete<T extends articleDeleteArgs>(args: SelectSubset<T, articleDeleteArgs<ExtArgs>>): Prisma__articleClient<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Article.
     * @param {articleUpdateArgs} args - Arguments to update one Article.
     * @example
     * // Update one Article
     * const article = await prisma.article.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends articleUpdateArgs>(args: SelectSubset<T, articleUpdateArgs<ExtArgs>>): Prisma__articleClient<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Articles.
     * @param {articleDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.article.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends articleDeleteManyArgs>(args?: SelectSubset<T, articleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {articleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends articleUpdateManyArgs>(args: SelectSubset<T, articleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles and returns the data updated in the database.
     * @param {articleUpdateManyAndReturnArgs} args - Arguments to update many Articles.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends articleUpdateManyAndReturnArgs>(args: SelectSubset<T, articleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Article.
     * @param {articleUpsertArgs} args - Arguments to update or create a Article.
     * @example
     * // Update or create a Article
     * const article = await prisma.article.upsert({
     *   create: {
     *     // ... data to create a Article
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article we want to update
     *   }
     * })
     */
    upsert<T extends articleUpsertArgs>(args: SelectSubset<T, articleUpsertArgs<ExtArgs>>): Prisma__articleClient<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {articleCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.article.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends articleCountArgs>(
      args?: Subset<T, articleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleAggregateArgs>(args: Subset<T, ArticleAggregateArgs>): Prisma.PrismaPromise<GetArticleAggregateType<T>>

    /**
     * Group by Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {articleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends articleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: articleGroupByArgs['orderBy'] }
        : { orderBy?: articleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, articleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the article model
   */
  readonly fields: articleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for article.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__articleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    comments<T extends article$commentsArgs<ExtArgs> = {}>(args?: Subset<T, article$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the article model
   */
  interface articleFieldRefs {
    readonly id: FieldRef<"article", 'BigInt'>
    readonly title: FieldRef<"article", 'String'>
    readonly content: FieldRef<"article", 'String'>
    readonly created_at: FieldRef<"article", 'DateTime'>
    readonly updated_at: FieldRef<"article", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * article findUnique
   */
  export type articleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
    /**
     * Filter, which article to fetch.
     */
    where: articleWhereUniqueInput
  }

  /**
   * article findUniqueOrThrow
   */
  export type articleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
    /**
     * Filter, which article to fetch.
     */
    where: articleWhereUniqueInput
  }

  /**
   * article findFirst
   */
  export type articleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
    /**
     * Filter, which article to fetch.
     */
    where?: articleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of articles to fetch.
     */
    orderBy?: articleOrderByWithRelationInput | articleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for articles.
     */
    cursor?: articleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * article findFirstOrThrow
   */
  export type articleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
    /**
     * Filter, which article to fetch.
     */
    where?: articleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of articles to fetch.
     */
    orderBy?: articleOrderByWithRelationInput | articleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for articles.
     */
    cursor?: articleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * article findMany
   */
  export type articleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
    /**
     * Filter, which articles to fetch.
     */
    where?: articleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of articles to fetch.
     */
    orderBy?: articleOrderByWithRelationInput | articleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing articles.
     */
    cursor?: articleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` articles.
     */
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * article create
   */
  export type articleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
    /**
     * The data needed to create a article.
     */
    data: XOR<articleCreateInput, articleUncheckedCreateInput>
  }

  /**
   * article createMany
   */
  export type articleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many articles.
     */
    data: articleCreateManyInput | articleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * article createManyAndReturn
   */
  export type articleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * The data used to create many articles.
     */
    data: articleCreateManyInput | articleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * article update
   */
  export type articleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
    /**
     * The data needed to update a article.
     */
    data: XOR<articleUpdateInput, articleUncheckedUpdateInput>
    /**
     * Choose, which article to update.
     */
    where: articleWhereUniqueInput
  }

  /**
   * article updateMany
   */
  export type articleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update articles.
     */
    data: XOR<articleUpdateManyMutationInput, articleUncheckedUpdateManyInput>
    /**
     * Filter which articles to update
     */
    where?: articleWhereInput
    /**
     * Limit how many articles to update.
     */
    limit?: number
  }

  /**
   * article updateManyAndReturn
   */
  export type articleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * The data used to update articles.
     */
    data: XOR<articleUpdateManyMutationInput, articleUncheckedUpdateManyInput>
    /**
     * Filter which articles to update
     */
    where?: articleWhereInput
    /**
     * Limit how many articles to update.
     */
    limit?: number
  }

  /**
   * article upsert
   */
  export type articleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
    /**
     * The filter to search for the article to update in case it exists.
     */
    where: articleWhereUniqueInput
    /**
     * In case the article found by the `where` argument doesn't exist, create a new article with this data.
     */
    create: XOR<articleCreateInput, articleUncheckedCreateInput>
    /**
     * In case the article was found with the provided `where` argument, update it with this data.
     */
    update: XOR<articleUpdateInput, articleUncheckedUpdateInput>
  }

  /**
   * article delete
   */
  export type articleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
    /**
     * Filter which article to delete.
     */
    where: articleWhereUniqueInput
  }

  /**
   * article deleteMany
   */
  export type articleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which articles to delete
     */
    where?: articleWhereInput
    /**
     * Limit how many articles to delete.
     */
    limit?: number
  }

  /**
   * article.comments
   */
  export type article$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    where?: article_commentWhereInput
    orderBy?: article_commentOrderByWithRelationInput | article_commentOrderByWithRelationInput[]
    cursor?: article_commentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Article_commentScalarFieldEnum | Article_commentScalarFieldEnum[]
  }

  /**
   * article without action
   */
  export type articleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article
     */
    select?: articleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article
     */
    omit?: articleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: articleInclude<ExtArgs> | null
  }


  /**
   * Model article_comment
   */

  export type AggregateArticle_comment = {
    _count: Article_commentCountAggregateOutputType | null
    _avg: Article_commentAvgAggregateOutputType | null
    _sum: Article_commentSumAggregateOutputType | null
    _min: Article_commentMinAggregateOutputType | null
    _max: Article_commentMaxAggregateOutputType | null
  }

  export type Article_commentAvgAggregateOutputType = {
    id: number | null
    article_id: number | null
  }

  export type Article_commentSumAggregateOutputType = {
    id: bigint | null
    article_id: bigint | null
  }

  export type Article_commentMinAggregateOutputType = {
    id: bigint | null
    content: string | null
    created_at: Date | null
    updated_at: Date | null
    article_id: bigint | null
  }

  export type Article_commentMaxAggregateOutputType = {
    id: bigint | null
    content: string | null
    created_at: Date | null
    updated_at: Date | null
    article_id: bigint | null
  }

  export type Article_commentCountAggregateOutputType = {
    id: number
    content: number
    created_at: number
    updated_at: number
    article_id: number
    _all: number
  }


  export type Article_commentAvgAggregateInputType = {
    id?: true
    article_id?: true
  }

  export type Article_commentSumAggregateInputType = {
    id?: true
    article_id?: true
  }

  export type Article_commentMinAggregateInputType = {
    id?: true
    content?: true
    created_at?: true
    updated_at?: true
    article_id?: true
  }

  export type Article_commentMaxAggregateInputType = {
    id?: true
    content?: true
    created_at?: true
    updated_at?: true
    article_id?: true
  }

  export type Article_commentCountAggregateInputType = {
    id?: true
    content?: true
    created_at?: true
    updated_at?: true
    article_id?: true
    _all?: true
  }

  export type Article_commentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which article_comment to aggregate.
     */
    where?: article_commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of article_comments to fetch.
     */
    orderBy?: article_commentOrderByWithRelationInput | article_commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: article_commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` article_comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` article_comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned article_comments
    **/
    _count?: true | Article_commentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Article_commentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Article_commentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Article_commentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Article_commentMaxAggregateInputType
  }

  export type GetArticle_commentAggregateType<T extends Article_commentAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle_comment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle_comment[P]>
      : GetScalarType<T[P], AggregateArticle_comment[P]>
  }




  export type article_commentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: article_commentWhereInput
    orderBy?: article_commentOrderByWithAggregationInput | article_commentOrderByWithAggregationInput[]
    by: Article_commentScalarFieldEnum[] | Article_commentScalarFieldEnum
    having?: article_commentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Article_commentCountAggregateInputType | true
    _avg?: Article_commentAvgAggregateInputType
    _sum?: Article_commentSumAggregateInputType
    _min?: Article_commentMinAggregateInputType
    _max?: Article_commentMaxAggregateInputType
  }

  export type Article_commentGroupByOutputType = {
    id: bigint
    content: string
    created_at: Date
    updated_at: Date | null
    article_id: bigint
    _count: Article_commentCountAggregateOutputType | null
    _avg: Article_commentAvgAggregateOutputType | null
    _sum: Article_commentSumAggregateOutputType | null
    _min: Article_commentMinAggregateOutputType | null
    _max: Article_commentMaxAggregateOutputType | null
  }

  type GetArticle_commentGroupByPayload<T extends article_commentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Article_commentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Article_commentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Article_commentGroupByOutputType[P]>
            : GetScalarType<T[P], Article_commentGroupByOutputType[P]>
        }
      >
    >


  export type article_commentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    article_id?: boolean
    article?: boolean | articleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article_comment"]>

  export type article_commentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    article_id?: boolean
    article?: boolean | articleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article_comment"]>

  export type article_commentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    article_id?: boolean
    article?: boolean | articleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article_comment"]>

  export type article_commentSelectScalar = {
    id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    article_id?: boolean
  }

  export type article_commentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "created_at" | "updated_at" | "article_id", ExtArgs["result"]["article_comment"]>
  export type article_commentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | articleDefaultArgs<ExtArgs>
  }
  export type article_commentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | articleDefaultArgs<ExtArgs>
  }
  export type article_commentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | articleDefaultArgs<ExtArgs>
  }

  export type $article_commentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "article_comment"
    objects: {
      article: Prisma.$articlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      content: string
      created_at: Date
      updated_at: Date | null
      article_id: bigint
    }, ExtArgs["result"]["article_comment"]>
    composites: {}
  }

  type article_commentGetPayload<S extends boolean | null | undefined | article_commentDefaultArgs> = $Result.GetResult<Prisma.$article_commentPayload, S>

  type article_commentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<article_commentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Article_commentCountAggregateInputType | true
    }

  export interface article_commentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['article_comment'], meta: { name: 'article_comment' } }
    /**
     * Find zero or one Article_comment that matches the filter.
     * @param {article_commentFindUniqueArgs} args - Arguments to find a Article_comment
     * @example
     * // Get one Article_comment
     * const article_comment = await prisma.article_comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends article_commentFindUniqueArgs>(args: SelectSubset<T, article_commentFindUniqueArgs<ExtArgs>>): Prisma__article_commentClient<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Article_comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {article_commentFindUniqueOrThrowArgs} args - Arguments to find a Article_comment
     * @example
     * // Get one Article_comment
     * const article_comment = await prisma.article_comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends article_commentFindUniqueOrThrowArgs>(args: SelectSubset<T, article_commentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__article_commentClient<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article_comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {article_commentFindFirstArgs} args - Arguments to find a Article_comment
     * @example
     * // Get one Article_comment
     * const article_comment = await prisma.article_comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends article_commentFindFirstArgs>(args?: SelectSubset<T, article_commentFindFirstArgs<ExtArgs>>): Prisma__article_commentClient<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article_comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {article_commentFindFirstOrThrowArgs} args - Arguments to find a Article_comment
     * @example
     * // Get one Article_comment
     * const article_comment = await prisma.article_comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends article_commentFindFirstOrThrowArgs>(args?: SelectSubset<T, article_commentFindFirstOrThrowArgs<ExtArgs>>): Prisma__article_commentClient<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Article_comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {article_commentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Article_comments
     * const article_comments = await prisma.article_comment.findMany()
     * 
     * // Get first 10 Article_comments
     * const article_comments = await prisma.article_comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const article_commentWithIdOnly = await prisma.article_comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends article_commentFindManyArgs>(args?: SelectSubset<T, article_commentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Article_comment.
     * @param {article_commentCreateArgs} args - Arguments to create a Article_comment.
     * @example
     * // Create one Article_comment
     * const Article_comment = await prisma.article_comment.create({
     *   data: {
     *     // ... data to create a Article_comment
     *   }
     * })
     * 
     */
    create<T extends article_commentCreateArgs>(args: SelectSubset<T, article_commentCreateArgs<ExtArgs>>): Prisma__article_commentClient<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Article_comments.
     * @param {article_commentCreateManyArgs} args - Arguments to create many Article_comments.
     * @example
     * // Create many Article_comments
     * const article_comment = await prisma.article_comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends article_commentCreateManyArgs>(args?: SelectSubset<T, article_commentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Article_comments and returns the data saved in the database.
     * @param {article_commentCreateManyAndReturnArgs} args - Arguments to create many Article_comments.
     * @example
     * // Create many Article_comments
     * const article_comment = await prisma.article_comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Article_comments and only return the `id`
     * const article_commentWithIdOnly = await prisma.article_comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends article_commentCreateManyAndReturnArgs>(args?: SelectSubset<T, article_commentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Article_comment.
     * @param {article_commentDeleteArgs} args - Arguments to delete one Article_comment.
     * @example
     * // Delete one Article_comment
     * const Article_comment = await prisma.article_comment.delete({
     *   where: {
     *     // ... filter to delete one Article_comment
     *   }
     * })
     * 
     */
    delete<T extends article_commentDeleteArgs>(args: SelectSubset<T, article_commentDeleteArgs<ExtArgs>>): Prisma__article_commentClient<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Article_comment.
     * @param {article_commentUpdateArgs} args - Arguments to update one Article_comment.
     * @example
     * // Update one Article_comment
     * const article_comment = await prisma.article_comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends article_commentUpdateArgs>(args: SelectSubset<T, article_commentUpdateArgs<ExtArgs>>): Prisma__article_commentClient<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Article_comments.
     * @param {article_commentDeleteManyArgs} args - Arguments to filter Article_comments to delete.
     * @example
     * // Delete a few Article_comments
     * const { count } = await prisma.article_comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends article_commentDeleteManyArgs>(args?: SelectSubset<T, article_commentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Article_comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {article_commentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Article_comments
     * const article_comment = await prisma.article_comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends article_commentUpdateManyArgs>(args: SelectSubset<T, article_commentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Article_comments and returns the data updated in the database.
     * @param {article_commentUpdateManyAndReturnArgs} args - Arguments to update many Article_comments.
     * @example
     * // Update many Article_comments
     * const article_comment = await prisma.article_comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Article_comments and only return the `id`
     * const article_commentWithIdOnly = await prisma.article_comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends article_commentUpdateManyAndReturnArgs>(args: SelectSubset<T, article_commentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Article_comment.
     * @param {article_commentUpsertArgs} args - Arguments to update or create a Article_comment.
     * @example
     * // Update or create a Article_comment
     * const article_comment = await prisma.article_comment.upsert({
     *   create: {
     *     // ... data to create a Article_comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article_comment we want to update
     *   }
     * })
     */
    upsert<T extends article_commentUpsertArgs>(args: SelectSubset<T, article_commentUpsertArgs<ExtArgs>>): Prisma__article_commentClient<$Result.GetResult<Prisma.$article_commentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Article_comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {article_commentCountArgs} args - Arguments to filter Article_comments to count.
     * @example
     * // Count the number of Article_comments
     * const count = await prisma.article_comment.count({
     *   where: {
     *     // ... the filter for the Article_comments we want to count
     *   }
     * })
    **/
    count<T extends article_commentCountArgs>(
      args?: Subset<T, article_commentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Article_commentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article_comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Article_commentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Article_commentAggregateArgs>(args: Subset<T, Article_commentAggregateArgs>): Prisma.PrismaPromise<GetArticle_commentAggregateType<T>>

    /**
     * Group by Article_comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {article_commentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends article_commentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: article_commentGroupByArgs['orderBy'] }
        : { orderBy?: article_commentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, article_commentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticle_commentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the article_comment model
   */
  readonly fields: article_commentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for article_comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__article_commentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends articleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, articleDefaultArgs<ExtArgs>>): Prisma__articleClient<$Result.GetResult<Prisma.$articlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the article_comment model
   */
  interface article_commentFieldRefs {
    readonly id: FieldRef<"article_comment", 'BigInt'>
    readonly content: FieldRef<"article_comment", 'String'>
    readonly created_at: FieldRef<"article_comment", 'DateTime'>
    readonly updated_at: FieldRef<"article_comment", 'DateTime'>
    readonly article_id: FieldRef<"article_comment", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * article_comment findUnique
   */
  export type article_commentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    /**
     * Filter, which article_comment to fetch.
     */
    where: article_commentWhereUniqueInput
  }

  /**
   * article_comment findUniqueOrThrow
   */
  export type article_commentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    /**
     * Filter, which article_comment to fetch.
     */
    where: article_commentWhereUniqueInput
  }

  /**
   * article_comment findFirst
   */
  export type article_commentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    /**
     * Filter, which article_comment to fetch.
     */
    where?: article_commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of article_comments to fetch.
     */
    orderBy?: article_commentOrderByWithRelationInput | article_commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for article_comments.
     */
    cursor?: article_commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` article_comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` article_comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of article_comments.
     */
    distinct?: Article_commentScalarFieldEnum | Article_commentScalarFieldEnum[]
  }

  /**
   * article_comment findFirstOrThrow
   */
  export type article_commentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    /**
     * Filter, which article_comment to fetch.
     */
    where?: article_commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of article_comments to fetch.
     */
    orderBy?: article_commentOrderByWithRelationInput | article_commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for article_comments.
     */
    cursor?: article_commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` article_comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` article_comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of article_comments.
     */
    distinct?: Article_commentScalarFieldEnum | Article_commentScalarFieldEnum[]
  }

  /**
   * article_comment findMany
   */
  export type article_commentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    /**
     * Filter, which article_comments to fetch.
     */
    where?: article_commentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of article_comments to fetch.
     */
    orderBy?: article_commentOrderByWithRelationInput | article_commentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing article_comments.
     */
    cursor?: article_commentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` article_comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` article_comments.
     */
    skip?: number
    distinct?: Article_commentScalarFieldEnum | Article_commentScalarFieldEnum[]
  }

  /**
   * article_comment create
   */
  export type article_commentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    /**
     * The data needed to create a article_comment.
     */
    data: XOR<article_commentCreateInput, article_commentUncheckedCreateInput>
  }

  /**
   * article_comment createMany
   */
  export type article_commentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many article_comments.
     */
    data: article_commentCreateManyInput | article_commentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * article_comment createManyAndReturn
   */
  export type article_commentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * The data used to create many article_comments.
     */
    data: article_commentCreateManyInput | article_commentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * article_comment update
   */
  export type article_commentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    /**
     * The data needed to update a article_comment.
     */
    data: XOR<article_commentUpdateInput, article_commentUncheckedUpdateInput>
    /**
     * Choose, which article_comment to update.
     */
    where: article_commentWhereUniqueInput
  }

  /**
   * article_comment updateMany
   */
  export type article_commentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update article_comments.
     */
    data: XOR<article_commentUpdateManyMutationInput, article_commentUncheckedUpdateManyInput>
    /**
     * Filter which article_comments to update
     */
    where?: article_commentWhereInput
    /**
     * Limit how many article_comments to update.
     */
    limit?: number
  }

  /**
   * article_comment updateManyAndReturn
   */
  export type article_commentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * The data used to update article_comments.
     */
    data: XOR<article_commentUpdateManyMutationInput, article_commentUncheckedUpdateManyInput>
    /**
     * Filter which article_comments to update
     */
    where?: article_commentWhereInput
    /**
     * Limit how many article_comments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * article_comment upsert
   */
  export type article_commentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    /**
     * The filter to search for the article_comment to update in case it exists.
     */
    where: article_commentWhereUniqueInput
    /**
     * In case the article_comment found by the `where` argument doesn't exist, create a new article_comment with this data.
     */
    create: XOR<article_commentCreateInput, article_commentUncheckedCreateInput>
    /**
     * In case the article_comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<article_commentUpdateInput, article_commentUncheckedUpdateInput>
  }

  /**
   * article_comment delete
   */
  export type article_commentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
    /**
     * Filter which article_comment to delete.
     */
    where: article_commentWhereUniqueInput
  }

  /**
   * article_comment deleteMany
   */
  export type article_commentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which article_comments to delete
     */
    where?: article_commentWhereInput
    /**
     * Limit how many article_comments to delete.
     */
    limit?: number
  }

  /**
   * article_comment without action
   */
  export type article_commentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the article_comment
     */
    select?: article_commentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the article_comment
     */
    omit?: article_commentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: article_commentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProductScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    tags: 'tags',
    created_at: 'created_at',
    updated_at: 'updated_at',
    image_id: 'image_id'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const Product_commentScalarFieldEnum: {
    id: 'id',
    content: 'content',
    created_at: 'created_at',
    updated_at: 'updated_at',
    product_id: 'product_id'
  };

  export type Product_commentScalarFieldEnum = (typeof Product_commentScalarFieldEnum)[keyof typeof Product_commentScalarFieldEnum]


  export const Product_imageScalarFieldEnum: {
    id: 'id',
    name: 'name',
    path: 'path',
    size: 'size',
    created_at: 'created_at'
  };

  export type Product_imageScalarFieldEnum = (typeof Product_imageScalarFieldEnum)[keyof typeof Product_imageScalarFieldEnum]


  export const ArticleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum]


  export const Article_commentScalarFieldEnum: {
    id: 'id',
    content: 'content',
    created_at: 'created_at',
    updated_at: 'updated_at',
    article_id: 'article_id'
  };

  export type Article_commentScalarFieldEnum = (typeof Article_commentScalarFieldEnum)[keyof typeof Article_commentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type productWhereInput = {
    AND?: productWhereInput | productWhereInput[]
    OR?: productWhereInput[]
    NOT?: productWhereInput | productWhereInput[]
    id?: BigIntFilter<"product"> | bigint | number
    name?: StringFilter<"product"> | string
    description?: StringNullableFilter<"product"> | string | null
    price?: IntFilter<"product"> | number
    tags?: StringNullableListFilter<"product">
    created_at?: DateTimeFilter<"product"> | Date | string
    updated_at?: DateTimeNullableFilter<"product"> | Date | string | null
    image_id?: BigIntNullableFilter<"product"> | bigint | number | null
    image?: XOR<Product_imageNullableScalarRelationFilter, product_imageWhereInput> | null
    comments?: Product_commentListRelationFilter
  }

  export type productOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    tags?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    image_id?: SortOrderInput | SortOrder
    image?: product_imageOrderByWithRelationInput
    comments?: product_commentOrderByRelationAggregateInput
  }

  export type productWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    image_id?: bigint | number
    AND?: productWhereInput | productWhereInput[]
    OR?: productWhereInput[]
    NOT?: productWhereInput | productWhereInput[]
    name?: StringFilter<"product"> | string
    description?: StringNullableFilter<"product"> | string | null
    price?: IntFilter<"product"> | number
    tags?: StringNullableListFilter<"product">
    created_at?: DateTimeFilter<"product"> | Date | string
    updated_at?: DateTimeNullableFilter<"product"> | Date | string | null
    image?: XOR<Product_imageNullableScalarRelationFilter, product_imageWhereInput> | null
    comments?: Product_commentListRelationFilter
  }, "id" | "image_id">

  export type productOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    tags?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    image_id?: SortOrderInput | SortOrder
    _count?: productCountOrderByAggregateInput
    _avg?: productAvgOrderByAggregateInput
    _max?: productMaxOrderByAggregateInput
    _min?: productMinOrderByAggregateInput
    _sum?: productSumOrderByAggregateInput
  }

  export type productScalarWhereWithAggregatesInput = {
    AND?: productScalarWhereWithAggregatesInput | productScalarWhereWithAggregatesInput[]
    OR?: productScalarWhereWithAggregatesInput[]
    NOT?: productScalarWhereWithAggregatesInput | productScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"product"> | bigint | number
    name?: StringWithAggregatesFilter<"product"> | string
    description?: StringNullableWithAggregatesFilter<"product"> | string | null
    price?: IntWithAggregatesFilter<"product"> | number
    tags?: StringNullableListFilter<"product">
    created_at?: DateTimeWithAggregatesFilter<"product"> | Date | string
    updated_at?: DateTimeNullableWithAggregatesFilter<"product"> | Date | string | null
    image_id?: BigIntNullableWithAggregatesFilter<"product"> | bigint | number | null
  }

  export type product_commentWhereInput = {
    AND?: product_commentWhereInput | product_commentWhereInput[]
    OR?: product_commentWhereInput[]
    NOT?: product_commentWhereInput | product_commentWhereInput[]
    id?: BigIntFilter<"product_comment"> | bigint | number
    content?: StringFilter<"product_comment"> | string
    created_at?: DateTimeFilter<"product_comment"> | Date | string
    updated_at?: DateTimeNullableFilter<"product_comment"> | Date | string | null
    product_id?: BigIntFilter<"product_comment"> | bigint | number
    product?: XOR<ProductScalarRelationFilter, productWhereInput>
  }

  export type product_commentOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    product_id?: SortOrder
    product?: productOrderByWithRelationInput
  }

  export type product_commentWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: product_commentWhereInput | product_commentWhereInput[]
    OR?: product_commentWhereInput[]
    NOT?: product_commentWhereInput | product_commentWhereInput[]
    content?: StringFilter<"product_comment"> | string
    created_at?: DateTimeFilter<"product_comment"> | Date | string
    updated_at?: DateTimeNullableFilter<"product_comment"> | Date | string | null
    product_id?: BigIntFilter<"product_comment"> | bigint | number
    product?: XOR<ProductScalarRelationFilter, productWhereInput>
  }, "id">

  export type product_commentOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    product_id?: SortOrder
    _count?: product_commentCountOrderByAggregateInput
    _avg?: product_commentAvgOrderByAggregateInput
    _max?: product_commentMaxOrderByAggregateInput
    _min?: product_commentMinOrderByAggregateInput
    _sum?: product_commentSumOrderByAggregateInput
  }

  export type product_commentScalarWhereWithAggregatesInput = {
    AND?: product_commentScalarWhereWithAggregatesInput | product_commentScalarWhereWithAggregatesInput[]
    OR?: product_commentScalarWhereWithAggregatesInput[]
    NOT?: product_commentScalarWhereWithAggregatesInput | product_commentScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"product_comment"> | bigint | number
    content?: StringWithAggregatesFilter<"product_comment"> | string
    created_at?: DateTimeWithAggregatesFilter<"product_comment"> | Date | string
    updated_at?: DateTimeNullableWithAggregatesFilter<"product_comment"> | Date | string | null
    product_id?: BigIntWithAggregatesFilter<"product_comment"> | bigint | number
  }

  export type product_imageWhereInput = {
    AND?: product_imageWhereInput | product_imageWhereInput[]
    OR?: product_imageWhereInput[]
    NOT?: product_imageWhereInput | product_imageWhereInput[]
    id?: BigIntFilter<"product_image"> | bigint | number
    name?: StringFilter<"product_image"> | string
    path?: StringFilter<"product_image"> | string
    size?: IntFilter<"product_image"> | number
    created_at?: DateTimeFilter<"product_image"> | Date | string
    product?: XOR<ProductNullableScalarRelationFilter, productWhereInput> | null
  }

  export type product_imageOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    path?: SortOrder
    size?: SortOrder
    created_at?: SortOrder
    product?: productOrderByWithRelationInput
  }

  export type product_imageWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    name?: string
    AND?: product_imageWhereInput | product_imageWhereInput[]
    OR?: product_imageWhereInput[]
    NOT?: product_imageWhereInput | product_imageWhereInput[]
    path?: StringFilter<"product_image"> | string
    size?: IntFilter<"product_image"> | number
    created_at?: DateTimeFilter<"product_image"> | Date | string
    product?: XOR<ProductNullableScalarRelationFilter, productWhereInput> | null
  }, "id" | "name">

  export type product_imageOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    path?: SortOrder
    size?: SortOrder
    created_at?: SortOrder
    _count?: product_imageCountOrderByAggregateInput
    _avg?: product_imageAvgOrderByAggregateInput
    _max?: product_imageMaxOrderByAggregateInput
    _min?: product_imageMinOrderByAggregateInput
    _sum?: product_imageSumOrderByAggregateInput
  }

  export type product_imageScalarWhereWithAggregatesInput = {
    AND?: product_imageScalarWhereWithAggregatesInput | product_imageScalarWhereWithAggregatesInput[]
    OR?: product_imageScalarWhereWithAggregatesInput[]
    NOT?: product_imageScalarWhereWithAggregatesInput | product_imageScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"product_image"> | bigint | number
    name?: StringWithAggregatesFilter<"product_image"> | string
    path?: StringWithAggregatesFilter<"product_image"> | string
    size?: IntWithAggregatesFilter<"product_image"> | number
    created_at?: DateTimeWithAggregatesFilter<"product_image"> | Date | string
  }

  export type articleWhereInput = {
    AND?: articleWhereInput | articleWhereInput[]
    OR?: articleWhereInput[]
    NOT?: articleWhereInput | articleWhereInput[]
    id?: BigIntFilter<"article"> | bigint | number
    title?: StringFilter<"article"> | string
    content?: StringFilter<"article"> | string
    created_at?: DateTimeFilter<"article"> | Date | string
    updated_at?: DateTimeNullableFilter<"article"> | Date | string | null
    comments?: Article_commentListRelationFilter
  }

  export type articleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    comments?: article_commentOrderByRelationAggregateInput
  }

  export type articleWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: articleWhereInput | articleWhereInput[]
    OR?: articleWhereInput[]
    NOT?: articleWhereInput | articleWhereInput[]
    title?: StringFilter<"article"> | string
    content?: StringFilter<"article"> | string
    created_at?: DateTimeFilter<"article"> | Date | string
    updated_at?: DateTimeNullableFilter<"article"> | Date | string | null
    comments?: Article_commentListRelationFilter
  }, "id">

  export type articleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: articleCountOrderByAggregateInput
    _avg?: articleAvgOrderByAggregateInput
    _max?: articleMaxOrderByAggregateInput
    _min?: articleMinOrderByAggregateInput
    _sum?: articleSumOrderByAggregateInput
  }

  export type articleScalarWhereWithAggregatesInput = {
    AND?: articleScalarWhereWithAggregatesInput | articleScalarWhereWithAggregatesInput[]
    OR?: articleScalarWhereWithAggregatesInput[]
    NOT?: articleScalarWhereWithAggregatesInput | articleScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"article"> | bigint | number
    title?: StringWithAggregatesFilter<"article"> | string
    content?: StringWithAggregatesFilter<"article"> | string
    created_at?: DateTimeWithAggregatesFilter<"article"> | Date | string
    updated_at?: DateTimeNullableWithAggregatesFilter<"article"> | Date | string | null
  }

  export type article_commentWhereInput = {
    AND?: article_commentWhereInput | article_commentWhereInput[]
    OR?: article_commentWhereInput[]
    NOT?: article_commentWhereInput | article_commentWhereInput[]
    id?: BigIntFilter<"article_comment"> | bigint | number
    content?: StringFilter<"article_comment"> | string
    created_at?: DateTimeFilter<"article_comment"> | Date | string
    updated_at?: DateTimeNullableFilter<"article_comment"> | Date | string | null
    article_id?: BigIntFilter<"article_comment"> | bigint | number
    article?: XOR<ArticleScalarRelationFilter, articleWhereInput>
  }

  export type article_commentOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    article_id?: SortOrder
    article?: articleOrderByWithRelationInput
  }

  export type article_commentWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: article_commentWhereInput | article_commentWhereInput[]
    OR?: article_commentWhereInput[]
    NOT?: article_commentWhereInput | article_commentWhereInput[]
    content?: StringFilter<"article_comment"> | string
    created_at?: DateTimeFilter<"article_comment"> | Date | string
    updated_at?: DateTimeNullableFilter<"article_comment"> | Date | string | null
    article_id?: BigIntFilter<"article_comment"> | bigint | number
    article?: XOR<ArticleScalarRelationFilter, articleWhereInput>
  }, "id">

  export type article_commentOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrderInput | SortOrder
    article_id?: SortOrder
    _count?: article_commentCountOrderByAggregateInput
    _avg?: article_commentAvgOrderByAggregateInput
    _max?: article_commentMaxOrderByAggregateInput
    _min?: article_commentMinOrderByAggregateInput
    _sum?: article_commentSumOrderByAggregateInput
  }

  export type article_commentScalarWhereWithAggregatesInput = {
    AND?: article_commentScalarWhereWithAggregatesInput | article_commentScalarWhereWithAggregatesInput[]
    OR?: article_commentScalarWhereWithAggregatesInput[]
    NOT?: article_commentScalarWhereWithAggregatesInput | article_commentScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"article_comment"> | bigint | number
    content?: StringWithAggregatesFilter<"article_comment"> | string
    created_at?: DateTimeWithAggregatesFilter<"article_comment"> | Date | string
    updated_at?: DateTimeNullableWithAggregatesFilter<"article_comment"> | Date | string | null
    article_id?: BigIntWithAggregatesFilter<"article_comment"> | bigint | number
  }

  export type productCreateInput = {
    id?: bigint | number
    name: string
    description?: string | null
    price: number
    tags?: productCreatetagsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string | null
    image?: product_imageCreateNestedOneWithoutProductInput
    comments?: product_commentCreateNestedManyWithoutProductInput
  }

  export type productUncheckedCreateInput = {
    id?: bigint | number
    name: string
    description?: string | null
    price: number
    tags?: productCreatetagsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string | null
    image_id?: bigint | number | null
    comments?: product_commentUncheckedCreateNestedManyWithoutProductInput
  }

  export type productUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    tags?: productUpdatetagsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: product_imageUpdateOneWithoutProductNestedInput
    comments?: product_commentUpdateManyWithoutProductNestedInput
  }

  export type productUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    tags?: productUpdatetagsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    comments?: product_commentUncheckedUpdateManyWithoutProductNestedInput
  }

  export type productCreateManyInput = {
    id?: bigint | number
    name: string
    description?: string | null
    price: number
    tags?: productCreatetagsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string | null
    image_id?: bigint | number | null
  }

  export type productUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    tags?: productUpdatetagsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type productUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    tags?: productUpdatetagsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type product_commentCreateInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
    product: productCreateNestedOneWithoutCommentsInput
  }

  export type product_commentUncheckedCreateInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
    product_id: bigint | number
  }

  export type product_commentUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product?: productUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type product_commentUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product_id?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type product_commentCreateManyInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
    product_id: bigint | number
  }

  export type product_commentUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_commentUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    product_id?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type product_imageCreateInput = {
    id?: bigint | number
    name: string
    path: string
    size: number
    created_at?: Date | string
    product?: productCreateNestedOneWithoutImageInput
  }

  export type product_imageUncheckedCreateInput = {
    id?: bigint | number
    name: string
    path: string
    size: number
    created_at?: Date | string
    product?: productUncheckedCreateNestedOneWithoutImageInput
  }

  export type product_imageUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: productUpdateOneWithoutImageNestedInput
  }

  export type product_imageUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: productUncheckedUpdateOneWithoutImageNestedInput
  }

  export type product_imageCreateManyInput = {
    id?: bigint | number
    name: string
    path: string
    size: number
    created_at?: Date | string
  }

  export type product_imageUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type product_imageUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type articleCreateInput = {
    id?: bigint | number
    title: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
    comments?: article_commentCreateNestedManyWithoutArticleInput
  }

  export type articleUncheckedCreateInput = {
    id?: bigint | number
    title: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
    comments?: article_commentUncheckedCreateNestedManyWithoutArticleInput
  }

  export type articleUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: article_commentUpdateManyWithoutArticleNestedInput
  }

  export type articleUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: article_commentUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type articleCreateManyInput = {
    id?: bigint | number
    title: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type articleUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type articleUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type article_commentCreateInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
    article: articleCreateNestedOneWithoutCommentsInput
  }

  export type article_commentUncheckedCreateInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
    article_id: bigint | number
  }

  export type article_commentUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    article?: articleUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type article_commentUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    article_id?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type article_commentCreateManyInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
    article_id: bigint | number
  }

  export type article_commentUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type article_commentUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    article_id?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type Product_imageNullableScalarRelationFilter = {
    is?: product_imageWhereInput | null
    isNot?: product_imageWhereInput | null
  }

  export type Product_commentListRelationFilter = {
    every?: product_commentWhereInput
    some?: product_commentWhereInput
    none?: product_commentWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type product_commentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type productCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    tags?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    image_id?: SortOrder
  }

  export type productAvgOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    image_id?: SortOrder
  }

  export type productMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    image_id?: SortOrder
  }

  export type productMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    image_id?: SortOrder
  }

  export type productSumOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    image_id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type ProductScalarRelationFilter = {
    is?: productWhereInput
    isNot?: productWhereInput
  }

  export type product_commentCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    product_id?: SortOrder
  }

  export type product_commentAvgOrderByAggregateInput = {
    id?: SortOrder
    product_id?: SortOrder
  }

  export type product_commentMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    product_id?: SortOrder
  }

  export type product_commentMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    product_id?: SortOrder
  }

  export type product_commentSumOrderByAggregateInput = {
    id?: SortOrder
    product_id?: SortOrder
  }

  export type ProductNullableScalarRelationFilter = {
    is?: productWhereInput | null
    isNot?: productWhereInput | null
  }

  export type product_imageCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    path?: SortOrder
    size?: SortOrder
    created_at?: SortOrder
  }

  export type product_imageAvgOrderByAggregateInput = {
    id?: SortOrder
    size?: SortOrder
  }

  export type product_imageMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    path?: SortOrder
    size?: SortOrder
    created_at?: SortOrder
  }

  export type product_imageMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    path?: SortOrder
    size?: SortOrder
    created_at?: SortOrder
  }

  export type product_imageSumOrderByAggregateInput = {
    id?: SortOrder
    size?: SortOrder
  }

  export type Article_commentListRelationFilter = {
    every?: article_commentWhereInput
    some?: article_commentWhereInput
    none?: article_commentWhereInput
  }

  export type article_commentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type articleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type articleAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type articleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type articleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type articleSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ArticleScalarRelationFilter = {
    is?: articleWhereInput
    isNot?: articleWhereInput
  }

  export type article_commentCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    article_id?: SortOrder
  }

  export type article_commentAvgOrderByAggregateInput = {
    id?: SortOrder
    article_id?: SortOrder
  }

  export type article_commentMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    article_id?: SortOrder
  }

  export type article_commentMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    article_id?: SortOrder
  }

  export type article_commentSumOrderByAggregateInput = {
    id?: SortOrder
    article_id?: SortOrder
  }

  export type productCreatetagsInput = {
    set: string[]
  }

  export type product_imageCreateNestedOneWithoutProductInput = {
    create?: XOR<product_imageCreateWithoutProductInput, product_imageUncheckedCreateWithoutProductInput>
    connectOrCreate?: product_imageCreateOrConnectWithoutProductInput
    connect?: product_imageWhereUniqueInput
  }

  export type product_commentCreateNestedManyWithoutProductInput = {
    create?: XOR<product_commentCreateWithoutProductInput, product_commentUncheckedCreateWithoutProductInput> | product_commentCreateWithoutProductInput[] | product_commentUncheckedCreateWithoutProductInput[]
    connectOrCreate?: product_commentCreateOrConnectWithoutProductInput | product_commentCreateOrConnectWithoutProductInput[]
    createMany?: product_commentCreateManyProductInputEnvelope
    connect?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
  }

  export type product_commentUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<product_commentCreateWithoutProductInput, product_commentUncheckedCreateWithoutProductInput> | product_commentCreateWithoutProductInput[] | product_commentUncheckedCreateWithoutProductInput[]
    connectOrCreate?: product_commentCreateOrConnectWithoutProductInput | product_commentCreateOrConnectWithoutProductInput[]
    createMany?: product_commentCreateManyProductInputEnvelope
    connect?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type productUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type product_imageUpdateOneWithoutProductNestedInput = {
    create?: XOR<product_imageCreateWithoutProductInput, product_imageUncheckedCreateWithoutProductInput>
    connectOrCreate?: product_imageCreateOrConnectWithoutProductInput
    upsert?: product_imageUpsertWithoutProductInput
    disconnect?: product_imageWhereInput | boolean
    delete?: product_imageWhereInput | boolean
    connect?: product_imageWhereUniqueInput
    update?: XOR<XOR<product_imageUpdateToOneWithWhereWithoutProductInput, product_imageUpdateWithoutProductInput>, product_imageUncheckedUpdateWithoutProductInput>
  }

  export type product_commentUpdateManyWithoutProductNestedInput = {
    create?: XOR<product_commentCreateWithoutProductInput, product_commentUncheckedCreateWithoutProductInput> | product_commentCreateWithoutProductInput[] | product_commentUncheckedCreateWithoutProductInput[]
    connectOrCreate?: product_commentCreateOrConnectWithoutProductInput | product_commentCreateOrConnectWithoutProductInput[]
    upsert?: product_commentUpsertWithWhereUniqueWithoutProductInput | product_commentUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: product_commentCreateManyProductInputEnvelope
    set?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
    disconnect?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
    delete?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
    connect?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
    update?: product_commentUpdateWithWhereUniqueWithoutProductInput | product_commentUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: product_commentUpdateManyWithWhereWithoutProductInput | product_commentUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: product_commentScalarWhereInput | product_commentScalarWhereInput[]
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type product_commentUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<product_commentCreateWithoutProductInput, product_commentUncheckedCreateWithoutProductInput> | product_commentCreateWithoutProductInput[] | product_commentUncheckedCreateWithoutProductInput[]
    connectOrCreate?: product_commentCreateOrConnectWithoutProductInput | product_commentCreateOrConnectWithoutProductInput[]
    upsert?: product_commentUpsertWithWhereUniqueWithoutProductInput | product_commentUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: product_commentCreateManyProductInputEnvelope
    set?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
    disconnect?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
    delete?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
    connect?: product_commentWhereUniqueInput | product_commentWhereUniqueInput[]
    update?: product_commentUpdateWithWhereUniqueWithoutProductInput | product_commentUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: product_commentUpdateManyWithWhereWithoutProductInput | product_commentUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: product_commentScalarWhereInput | product_commentScalarWhereInput[]
  }

  export type productCreateNestedOneWithoutCommentsInput = {
    create?: XOR<productCreateWithoutCommentsInput, productUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: productCreateOrConnectWithoutCommentsInput
    connect?: productWhereUniqueInput
  }

  export type productUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<productCreateWithoutCommentsInput, productUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: productCreateOrConnectWithoutCommentsInput
    upsert?: productUpsertWithoutCommentsInput
    connect?: productWhereUniqueInput
    update?: XOR<XOR<productUpdateToOneWithWhereWithoutCommentsInput, productUpdateWithoutCommentsInput>, productUncheckedUpdateWithoutCommentsInput>
  }

  export type productCreateNestedOneWithoutImageInput = {
    create?: XOR<productCreateWithoutImageInput, productUncheckedCreateWithoutImageInput>
    connectOrCreate?: productCreateOrConnectWithoutImageInput
    connect?: productWhereUniqueInput
  }

  export type productUncheckedCreateNestedOneWithoutImageInput = {
    create?: XOR<productCreateWithoutImageInput, productUncheckedCreateWithoutImageInput>
    connectOrCreate?: productCreateOrConnectWithoutImageInput
    connect?: productWhereUniqueInput
  }

  export type productUpdateOneWithoutImageNestedInput = {
    create?: XOR<productCreateWithoutImageInput, productUncheckedCreateWithoutImageInput>
    connectOrCreate?: productCreateOrConnectWithoutImageInput
    upsert?: productUpsertWithoutImageInput
    disconnect?: productWhereInput | boolean
    delete?: productWhereInput | boolean
    connect?: productWhereUniqueInput
    update?: XOR<XOR<productUpdateToOneWithWhereWithoutImageInput, productUpdateWithoutImageInput>, productUncheckedUpdateWithoutImageInput>
  }

  export type productUncheckedUpdateOneWithoutImageNestedInput = {
    create?: XOR<productCreateWithoutImageInput, productUncheckedCreateWithoutImageInput>
    connectOrCreate?: productCreateOrConnectWithoutImageInput
    upsert?: productUpsertWithoutImageInput
    disconnect?: productWhereInput | boolean
    delete?: productWhereInput | boolean
    connect?: productWhereUniqueInput
    update?: XOR<XOR<productUpdateToOneWithWhereWithoutImageInput, productUpdateWithoutImageInput>, productUncheckedUpdateWithoutImageInput>
  }

  export type article_commentCreateNestedManyWithoutArticleInput = {
    create?: XOR<article_commentCreateWithoutArticleInput, article_commentUncheckedCreateWithoutArticleInput> | article_commentCreateWithoutArticleInput[] | article_commentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: article_commentCreateOrConnectWithoutArticleInput | article_commentCreateOrConnectWithoutArticleInput[]
    createMany?: article_commentCreateManyArticleInputEnvelope
    connect?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
  }

  export type article_commentUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<article_commentCreateWithoutArticleInput, article_commentUncheckedCreateWithoutArticleInput> | article_commentCreateWithoutArticleInput[] | article_commentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: article_commentCreateOrConnectWithoutArticleInput | article_commentCreateOrConnectWithoutArticleInput[]
    createMany?: article_commentCreateManyArticleInputEnvelope
    connect?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
  }

  export type article_commentUpdateManyWithoutArticleNestedInput = {
    create?: XOR<article_commentCreateWithoutArticleInput, article_commentUncheckedCreateWithoutArticleInput> | article_commentCreateWithoutArticleInput[] | article_commentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: article_commentCreateOrConnectWithoutArticleInput | article_commentCreateOrConnectWithoutArticleInput[]
    upsert?: article_commentUpsertWithWhereUniqueWithoutArticleInput | article_commentUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: article_commentCreateManyArticleInputEnvelope
    set?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
    disconnect?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
    delete?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
    connect?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
    update?: article_commentUpdateWithWhereUniqueWithoutArticleInput | article_commentUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: article_commentUpdateManyWithWhereWithoutArticleInput | article_commentUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: article_commentScalarWhereInput | article_commentScalarWhereInput[]
  }

  export type article_commentUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<article_commentCreateWithoutArticleInput, article_commentUncheckedCreateWithoutArticleInput> | article_commentCreateWithoutArticleInput[] | article_commentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: article_commentCreateOrConnectWithoutArticleInput | article_commentCreateOrConnectWithoutArticleInput[]
    upsert?: article_commentUpsertWithWhereUniqueWithoutArticleInput | article_commentUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: article_commentCreateManyArticleInputEnvelope
    set?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
    disconnect?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
    delete?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
    connect?: article_commentWhereUniqueInput | article_commentWhereUniqueInput[]
    update?: article_commentUpdateWithWhereUniqueWithoutArticleInput | article_commentUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: article_commentUpdateManyWithWhereWithoutArticleInput | article_commentUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: article_commentScalarWhereInput | article_commentScalarWhereInput[]
  }

  export type articleCreateNestedOneWithoutCommentsInput = {
    create?: XOR<articleCreateWithoutCommentsInput, articleUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: articleCreateOrConnectWithoutCommentsInput
    connect?: articleWhereUniqueInput
  }

  export type articleUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<articleCreateWithoutCommentsInput, articleUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: articleCreateOrConnectWithoutCommentsInput
    upsert?: articleUpsertWithoutCommentsInput
    connect?: articleWhereUniqueInput
    update?: XOR<XOR<articleUpdateToOneWithWhereWithoutCommentsInput, articleUpdateWithoutCommentsInput>, articleUncheckedUpdateWithoutCommentsInput>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type product_imageCreateWithoutProductInput = {
    id?: bigint | number
    name: string
    path: string
    size: number
    created_at?: Date | string
  }

  export type product_imageUncheckedCreateWithoutProductInput = {
    id?: bigint | number
    name: string
    path: string
    size: number
    created_at?: Date | string
  }

  export type product_imageCreateOrConnectWithoutProductInput = {
    where: product_imageWhereUniqueInput
    create: XOR<product_imageCreateWithoutProductInput, product_imageUncheckedCreateWithoutProductInput>
  }

  export type product_commentCreateWithoutProductInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type product_commentUncheckedCreateWithoutProductInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type product_commentCreateOrConnectWithoutProductInput = {
    where: product_commentWhereUniqueInput
    create: XOR<product_commentCreateWithoutProductInput, product_commentUncheckedCreateWithoutProductInput>
  }

  export type product_commentCreateManyProductInputEnvelope = {
    data: product_commentCreateManyProductInput | product_commentCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type product_imageUpsertWithoutProductInput = {
    update: XOR<product_imageUpdateWithoutProductInput, product_imageUncheckedUpdateWithoutProductInput>
    create: XOR<product_imageCreateWithoutProductInput, product_imageUncheckedCreateWithoutProductInput>
    where?: product_imageWhereInput
  }

  export type product_imageUpdateToOneWithWhereWithoutProductInput = {
    where?: product_imageWhereInput
    data: XOR<product_imageUpdateWithoutProductInput, product_imageUncheckedUpdateWithoutProductInput>
  }

  export type product_imageUpdateWithoutProductInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type product_imageUncheckedUpdateWithoutProductInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type product_commentUpsertWithWhereUniqueWithoutProductInput = {
    where: product_commentWhereUniqueInput
    update: XOR<product_commentUpdateWithoutProductInput, product_commentUncheckedUpdateWithoutProductInput>
    create: XOR<product_commentCreateWithoutProductInput, product_commentUncheckedCreateWithoutProductInput>
  }

  export type product_commentUpdateWithWhereUniqueWithoutProductInput = {
    where: product_commentWhereUniqueInput
    data: XOR<product_commentUpdateWithoutProductInput, product_commentUncheckedUpdateWithoutProductInput>
  }

  export type product_commentUpdateManyWithWhereWithoutProductInput = {
    where: product_commentScalarWhereInput
    data: XOR<product_commentUpdateManyMutationInput, product_commentUncheckedUpdateManyWithoutProductInput>
  }

  export type product_commentScalarWhereInput = {
    AND?: product_commentScalarWhereInput | product_commentScalarWhereInput[]
    OR?: product_commentScalarWhereInput[]
    NOT?: product_commentScalarWhereInput | product_commentScalarWhereInput[]
    id?: BigIntFilter<"product_comment"> | bigint | number
    content?: StringFilter<"product_comment"> | string
    created_at?: DateTimeFilter<"product_comment"> | Date | string
    updated_at?: DateTimeNullableFilter<"product_comment"> | Date | string | null
    product_id?: BigIntFilter<"product_comment"> | bigint | number
  }

  export type productCreateWithoutCommentsInput = {
    id?: bigint | number
    name: string
    description?: string | null
    price: number
    tags?: productCreatetagsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string | null
    image?: product_imageCreateNestedOneWithoutProductInput
  }

  export type productUncheckedCreateWithoutCommentsInput = {
    id?: bigint | number
    name: string
    description?: string | null
    price: number
    tags?: productCreatetagsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string | null
    image_id?: bigint | number | null
  }

  export type productCreateOrConnectWithoutCommentsInput = {
    where: productWhereUniqueInput
    create: XOR<productCreateWithoutCommentsInput, productUncheckedCreateWithoutCommentsInput>
  }

  export type productUpsertWithoutCommentsInput = {
    update: XOR<productUpdateWithoutCommentsInput, productUncheckedUpdateWithoutCommentsInput>
    create: XOR<productCreateWithoutCommentsInput, productUncheckedCreateWithoutCommentsInput>
    where?: productWhereInput
  }

  export type productUpdateToOneWithWhereWithoutCommentsInput = {
    where?: productWhereInput
    data: XOR<productUpdateWithoutCommentsInput, productUncheckedUpdateWithoutCommentsInput>
  }

  export type productUpdateWithoutCommentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    tags?: productUpdatetagsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: product_imageUpdateOneWithoutProductNestedInput
  }

  export type productUncheckedUpdateWithoutCommentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    tags?: productUpdatetagsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type productCreateWithoutImageInput = {
    id?: bigint | number
    name: string
    description?: string | null
    price: number
    tags?: productCreatetagsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string | null
    comments?: product_commentCreateNestedManyWithoutProductInput
  }

  export type productUncheckedCreateWithoutImageInput = {
    id?: bigint | number
    name: string
    description?: string | null
    price: number
    tags?: productCreatetagsInput | string[]
    created_at?: Date | string
    updated_at?: Date | string | null
    comments?: product_commentUncheckedCreateNestedManyWithoutProductInput
  }

  export type productCreateOrConnectWithoutImageInput = {
    where: productWhereUniqueInput
    create: XOR<productCreateWithoutImageInput, productUncheckedCreateWithoutImageInput>
  }

  export type productUpsertWithoutImageInput = {
    update: XOR<productUpdateWithoutImageInput, productUncheckedUpdateWithoutImageInput>
    create: XOR<productCreateWithoutImageInput, productUncheckedCreateWithoutImageInput>
    where?: productWhereInput
  }

  export type productUpdateToOneWithWhereWithoutImageInput = {
    where?: productWhereInput
    data: XOR<productUpdateWithoutImageInput, productUncheckedUpdateWithoutImageInput>
  }

  export type productUpdateWithoutImageInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    tags?: productUpdatetagsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: product_commentUpdateManyWithoutProductNestedInput
  }

  export type productUncheckedUpdateWithoutImageInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    tags?: productUpdatetagsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: product_commentUncheckedUpdateManyWithoutProductNestedInput
  }

  export type article_commentCreateWithoutArticleInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type article_commentUncheckedCreateWithoutArticleInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type article_commentCreateOrConnectWithoutArticleInput = {
    where: article_commentWhereUniqueInput
    create: XOR<article_commentCreateWithoutArticleInput, article_commentUncheckedCreateWithoutArticleInput>
  }

  export type article_commentCreateManyArticleInputEnvelope = {
    data: article_commentCreateManyArticleInput | article_commentCreateManyArticleInput[]
    skipDuplicates?: boolean
  }

  export type article_commentUpsertWithWhereUniqueWithoutArticleInput = {
    where: article_commentWhereUniqueInput
    update: XOR<article_commentUpdateWithoutArticleInput, article_commentUncheckedUpdateWithoutArticleInput>
    create: XOR<article_commentCreateWithoutArticleInput, article_commentUncheckedCreateWithoutArticleInput>
  }

  export type article_commentUpdateWithWhereUniqueWithoutArticleInput = {
    where: article_commentWhereUniqueInput
    data: XOR<article_commentUpdateWithoutArticleInput, article_commentUncheckedUpdateWithoutArticleInput>
  }

  export type article_commentUpdateManyWithWhereWithoutArticleInput = {
    where: article_commentScalarWhereInput
    data: XOR<article_commentUpdateManyMutationInput, article_commentUncheckedUpdateManyWithoutArticleInput>
  }

  export type article_commentScalarWhereInput = {
    AND?: article_commentScalarWhereInput | article_commentScalarWhereInput[]
    OR?: article_commentScalarWhereInput[]
    NOT?: article_commentScalarWhereInput | article_commentScalarWhereInput[]
    id?: BigIntFilter<"article_comment"> | bigint | number
    content?: StringFilter<"article_comment"> | string
    created_at?: DateTimeFilter<"article_comment"> | Date | string
    updated_at?: DateTimeNullableFilter<"article_comment"> | Date | string | null
    article_id?: BigIntFilter<"article_comment"> | bigint | number
  }

  export type articleCreateWithoutCommentsInput = {
    id?: bigint | number
    title: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type articleUncheckedCreateWithoutCommentsInput = {
    id?: bigint | number
    title: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type articleCreateOrConnectWithoutCommentsInput = {
    where: articleWhereUniqueInput
    create: XOR<articleCreateWithoutCommentsInput, articleUncheckedCreateWithoutCommentsInput>
  }

  export type articleUpsertWithoutCommentsInput = {
    update: XOR<articleUpdateWithoutCommentsInput, articleUncheckedUpdateWithoutCommentsInput>
    create: XOR<articleCreateWithoutCommentsInput, articleUncheckedCreateWithoutCommentsInput>
    where?: articleWhereInput
  }

  export type articleUpdateToOneWithWhereWithoutCommentsInput = {
    where?: articleWhereInput
    data: XOR<articleUpdateWithoutCommentsInput, articleUncheckedUpdateWithoutCommentsInput>
  }

  export type articleUpdateWithoutCommentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type articleUncheckedUpdateWithoutCommentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_commentCreateManyProductInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type product_commentUpdateWithoutProductInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_commentUncheckedUpdateWithoutProductInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type product_commentUncheckedUpdateManyWithoutProductInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type article_commentCreateManyArticleInput = {
    id?: bigint | number
    content: string
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type article_commentUpdateWithoutArticleInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type article_commentUncheckedUpdateWithoutArticleInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type article_commentUncheckedUpdateManyWithoutArticleInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}