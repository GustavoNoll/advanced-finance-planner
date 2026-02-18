
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Profile
 * Basic profile information for Foundation Life users.
 * Auth itself is handled by Supabase; we reference the auth user id.
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model LifeScenario
 * 
 */
export type LifeScenario = $Result.DefaultSelection<Prisma.$LifeScenarioPayload>
/**
 * Model LifeMicroPlan
 * 
 */
export type LifeMicroPlan = $Result.DefaultSelection<Prisma.$LifeMicroPlanPayload>
/**
 * Model LifeSettings
 * 
 */
export type LifeSettings = $Result.DefaultSelection<Prisma.$LifeSettingsPayload>
/**
 * Model LifeEvent
 * 
 */
export type LifeEvent = $Result.DefaultSelection<Prisma.$LifeEventPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profile.findMany()
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
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
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
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lifeScenario`: Exposes CRUD operations for the **LifeScenario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LifeScenarios
    * const lifeScenarios = await prisma.lifeScenario.findMany()
    * ```
    */
  get lifeScenario(): Prisma.LifeScenarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lifeMicroPlan`: Exposes CRUD operations for the **LifeMicroPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LifeMicroPlans
    * const lifeMicroPlans = await prisma.lifeMicroPlan.findMany()
    * ```
    */
  get lifeMicroPlan(): Prisma.LifeMicroPlanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lifeSettings`: Exposes CRUD operations for the **LifeSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LifeSettings
    * const lifeSettings = await prisma.lifeSettings.findMany()
    * ```
    */
  get lifeSettings(): Prisma.LifeSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lifeEvent`: Exposes CRUD operations for the **LifeEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LifeEvents
    * const lifeEvents = await prisma.lifeEvent.findMany()
    * ```
    */
  get lifeEvent(): Prisma.LifeEventDelegate<ExtArgs, ClientOptions>;
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
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
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
    Profile: 'Profile',
    LifeScenario: 'LifeScenario',
    LifeMicroPlan: 'LifeMicroPlan',
    LifeSettings: 'LifeSettings',
    LifeEvent: 'LifeEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "profile" | "lifeScenario" | "lifeMicroPlan" | "lifeSettings" | "lifeEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      LifeScenario: {
        payload: Prisma.$LifeScenarioPayload<ExtArgs>
        fields: Prisma.LifeScenarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LifeScenarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LifeScenarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload>
          }
          findFirst: {
            args: Prisma.LifeScenarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LifeScenarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload>
          }
          findMany: {
            args: Prisma.LifeScenarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload>[]
          }
          create: {
            args: Prisma.LifeScenarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload>
          }
          createMany: {
            args: Prisma.LifeScenarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LifeScenarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload>[]
          }
          delete: {
            args: Prisma.LifeScenarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload>
          }
          update: {
            args: Prisma.LifeScenarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload>
          }
          deleteMany: {
            args: Prisma.LifeScenarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LifeScenarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LifeScenarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload>[]
          }
          upsert: {
            args: Prisma.LifeScenarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeScenarioPayload>
          }
          aggregate: {
            args: Prisma.LifeScenarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLifeScenario>
          }
          groupBy: {
            args: Prisma.LifeScenarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<LifeScenarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.LifeScenarioCountArgs<ExtArgs>
            result: $Utils.Optional<LifeScenarioCountAggregateOutputType> | number
          }
        }
      }
      LifeMicroPlan: {
        payload: Prisma.$LifeMicroPlanPayload<ExtArgs>
        fields: Prisma.LifeMicroPlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LifeMicroPlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LifeMicroPlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload>
          }
          findFirst: {
            args: Prisma.LifeMicroPlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LifeMicroPlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload>
          }
          findMany: {
            args: Prisma.LifeMicroPlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload>[]
          }
          create: {
            args: Prisma.LifeMicroPlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload>
          }
          createMany: {
            args: Prisma.LifeMicroPlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LifeMicroPlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload>[]
          }
          delete: {
            args: Prisma.LifeMicroPlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload>
          }
          update: {
            args: Prisma.LifeMicroPlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload>
          }
          deleteMany: {
            args: Prisma.LifeMicroPlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LifeMicroPlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LifeMicroPlanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload>[]
          }
          upsert: {
            args: Prisma.LifeMicroPlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeMicroPlanPayload>
          }
          aggregate: {
            args: Prisma.LifeMicroPlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLifeMicroPlan>
          }
          groupBy: {
            args: Prisma.LifeMicroPlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<LifeMicroPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.LifeMicroPlanCountArgs<ExtArgs>
            result: $Utils.Optional<LifeMicroPlanCountAggregateOutputType> | number
          }
        }
      }
      LifeSettings: {
        payload: Prisma.$LifeSettingsPayload<ExtArgs>
        fields: Prisma.LifeSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LifeSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LifeSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload>
          }
          findFirst: {
            args: Prisma.LifeSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LifeSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload>
          }
          findMany: {
            args: Prisma.LifeSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload>[]
          }
          create: {
            args: Prisma.LifeSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload>
          }
          createMany: {
            args: Prisma.LifeSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LifeSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload>[]
          }
          delete: {
            args: Prisma.LifeSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload>
          }
          update: {
            args: Prisma.LifeSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload>
          }
          deleteMany: {
            args: Prisma.LifeSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LifeSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LifeSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload>[]
          }
          upsert: {
            args: Prisma.LifeSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeSettingsPayload>
          }
          aggregate: {
            args: Prisma.LifeSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLifeSettings>
          }
          groupBy: {
            args: Prisma.LifeSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<LifeSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.LifeSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<LifeSettingsCountAggregateOutputType> | number
          }
        }
      }
      LifeEvent: {
        payload: Prisma.$LifeEventPayload<ExtArgs>
        fields: Prisma.LifeEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LifeEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LifeEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          findFirst: {
            args: Prisma.LifeEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LifeEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          findMany: {
            args: Prisma.LifeEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>[]
          }
          create: {
            args: Prisma.LifeEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          createMany: {
            args: Prisma.LifeEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LifeEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>[]
          }
          delete: {
            args: Prisma.LifeEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          update: {
            args: Prisma.LifeEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          deleteMany: {
            args: Prisma.LifeEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LifeEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LifeEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>[]
          }
          upsert: {
            args: Prisma.LifeEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          aggregate: {
            args: Prisma.LifeEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLifeEvent>
          }
          groupBy: {
            args: Prisma.LifeEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<LifeEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.LifeEventCountArgs<ExtArgs>
            result: $Utils.Optional<LifeEventCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
    adapter?: runtime.SqlDriverAdapterFactory | null
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
    profile?: ProfileOmit
    lifeScenario?: LifeScenarioOmit
    lifeMicroPlan?: LifeMicroPlanOmit
    lifeSettings?: LifeSettingsOmit
    lifeEvent?: LifeEventOmit
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
   * Count Type ProfileCountOutputType
   */

  export type ProfileCountOutputType = {
    scenarios: number
  }

  export type ProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenarios?: boolean | ProfileCountOutputTypeCountScenariosArgs
  }

  // Custom InputTypes
  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileCountOutputType
     */
    select?: ProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountScenariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeScenarioWhereInput
  }


  /**
   * Count Type LifeScenarioCountOutputType
   */

  export type LifeScenarioCountOutputType = {
    events: number
    microPlans: number
  }

  export type LifeScenarioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | LifeScenarioCountOutputTypeCountEventsArgs
    microPlans?: boolean | LifeScenarioCountOutputTypeCountMicroPlansArgs
  }

  // Custom InputTypes
  /**
   * LifeScenarioCountOutputType without action
   */
  export type LifeScenarioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenarioCountOutputType
     */
    select?: LifeScenarioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LifeScenarioCountOutputType without action
   */
  export type LifeScenarioCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeEventWhereInput
  }

  /**
   * LifeScenarioCountOutputType without action
   */
  export type LifeScenarioCountOutputTypeCountMicroPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeMicroPlanWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileAvgAggregateOutputType = {
    lifeExpectancyYears: number | null
  }

  export type ProfileSumAggregateOutputType = {
    lifeExpectancyYears: number | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    authUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    birthDate: Date | null
    lifeExpectancyYears: number | null
    baseCurrency: string | null
    riskProfile: string | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    authUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    birthDate: Date | null
    lifeExpectancyYears: number | null
    baseCurrency: string | null
    riskProfile: string | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    authUserId: number
    createdAt: number
    updatedAt: number
    birthDate: number
    lifeExpectancyYears: number
    baseCurrency: number
    riskProfile: number
    _all: number
  }


  export type ProfileAvgAggregateInputType = {
    lifeExpectancyYears?: true
  }

  export type ProfileSumAggregateInputType = {
    lifeExpectancyYears?: true
  }

  export type ProfileMinAggregateInputType = {
    id?: true
    authUserId?: true
    createdAt?: true
    updatedAt?: true
    birthDate?: true
    lifeExpectancyYears?: true
    baseCurrency?: true
    riskProfile?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    authUserId?: true
    createdAt?: true
    updatedAt?: true
    birthDate?: true
    lifeExpectancyYears?: true
    baseCurrency?: true
    riskProfile?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    authUserId?: true
    createdAt?: true
    updatedAt?: true
    birthDate?: true
    lifeExpectancyYears?: true
    baseCurrency?: true
    riskProfile?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _avg?: ProfileAvgAggregateInputType
    _sum?: ProfileSumAggregateInputType
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    authUserId: string
    createdAt: Date
    updatedAt: Date
    birthDate: Date | null
    lifeExpectancyYears: number
    baseCurrency: string
    riskProfile: string | null
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    birthDate?: boolean
    lifeExpectancyYears?: boolean
    baseCurrency?: boolean
    riskProfile?: boolean
    scenarios?: boolean | Profile$scenariosArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    birthDate?: boolean
    lifeExpectancyYears?: boolean
    baseCurrency?: boolean
    riskProfile?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    birthDate?: boolean
    lifeExpectancyYears?: boolean
    baseCurrency?: boolean
    riskProfile?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectScalar = {
    id?: boolean
    authUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    birthDate?: boolean
    lifeExpectancyYears?: boolean
    baseCurrency?: boolean
    riskProfile?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authUserId" | "createdAt" | "updatedAt" | "birthDate" | "lifeExpectancyYears" | "baseCurrency" | "riskProfile", ExtArgs["result"]["profile"]>
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenarios?: boolean | Profile$scenariosArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      scenarios: Prisma.$LifeScenarioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authUserId: string
      createdAt: Date
      updatedAt: Date
      birthDate: Date | null
      lifeExpectancyYears: number
      baseCurrency: string
      riskProfile: string | null
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
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
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    scenarios<T extends Profile$scenariosArgs<ExtArgs> = {}>(args?: Subset<T, Profile$scenariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<"Profile", 'String'>
    readonly authUserId: FieldRef<"Profile", 'String'>
    readonly createdAt: FieldRef<"Profile", 'DateTime'>
    readonly updatedAt: FieldRef<"Profile", 'DateTime'>
    readonly birthDate: FieldRef<"Profile", 'DateTime'>
    readonly lifeExpectancyYears: FieldRef<"Profile", 'Int'>
    readonly baseCurrency: FieldRef<"Profile", 'String'>
    readonly riskProfile: FieldRef<"Profile", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile.scenarios
   */
  export type Profile$scenariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    where?: LifeScenarioWhereInput
    orderBy?: LifeScenarioOrderByWithRelationInput | LifeScenarioOrderByWithRelationInput[]
    cursor?: LifeScenarioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LifeScenarioScalarFieldEnum | LifeScenarioScalarFieldEnum[]
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Model LifeScenario
   */

  export type AggregateLifeScenario = {
    _count: LifeScenarioCountAggregateOutputType | null
    _min: LifeScenarioMinAggregateOutputType | null
    _max: LifeScenarioMaxAggregateOutputType | null
  }

  export type LifeScenarioMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    description: string | null
    isDefault: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LifeScenarioMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    description: string | null
    isDefault: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LifeScenarioCountAggregateOutputType = {
    id: number
    profileId: number
    name: number
    description: number
    isDefault: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LifeScenarioMinAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    description?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LifeScenarioMaxAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    description?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LifeScenarioCountAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    description?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LifeScenarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeScenario to aggregate.
     */
    where?: LifeScenarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeScenarios to fetch.
     */
    orderBy?: LifeScenarioOrderByWithRelationInput | LifeScenarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LifeScenarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeScenarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeScenarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LifeScenarios
    **/
    _count?: true | LifeScenarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LifeScenarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LifeScenarioMaxAggregateInputType
  }

  export type GetLifeScenarioAggregateType<T extends LifeScenarioAggregateArgs> = {
        [P in keyof T & keyof AggregateLifeScenario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLifeScenario[P]>
      : GetScalarType<T[P], AggregateLifeScenario[P]>
  }




  export type LifeScenarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeScenarioWhereInput
    orderBy?: LifeScenarioOrderByWithAggregationInput | LifeScenarioOrderByWithAggregationInput[]
    by: LifeScenarioScalarFieldEnum[] | LifeScenarioScalarFieldEnum
    having?: LifeScenarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LifeScenarioCountAggregateInputType | true
    _min?: LifeScenarioMinAggregateInputType
    _max?: LifeScenarioMaxAggregateInputType
  }

  export type LifeScenarioGroupByOutputType = {
    id: string
    profileId: string
    name: string
    description: string | null
    isDefault: boolean
    createdAt: Date
    updatedAt: Date
    _count: LifeScenarioCountAggregateOutputType | null
    _min: LifeScenarioMinAggregateOutputType | null
    _max: LifeScenarioMaxAggregateOutputType | null
  }

  type GetLifeScenarioGroupByPayload<T extends LifeScenarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LifeScenarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LifeScenarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LifeScenarioGroupByOutputType[P]>
            : GetScalarType<T[P], LifeScenarioGroupByOutputType[P]>
        }
      >
    >


  export type LifeScenarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    description?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    settings?: boolean | LifeScenario$settingsArgs<ExtArgs>
    events?: boolean | LifeScenario$eventsArgs<ExtArgs>
    microPlans?: boolean | LifeScenario$microPlansArgs<ExtArgs>
    _count?: boolean | LifeScenarioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeScenario"]>

  export type LifeScenarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    description?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeScenario"]>

  export type LifeScenarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    description?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeScenario"]>

  export type LifeScenarioSelectScalar = {
    id?: boolean
    profileId?: boolean
    name?: boolean
    description?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LifeScenarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "name" | "description" | "isDefault" | "createdAt" | "updatedAt", ExtArgs["result"]["lifeScenario"]>
  export type LifeScenarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    settings?: boolean | LifeScenario$settingsArgs<ExtArgs>
    events?: boolean | LifeScenario$eventsArgs<ExtArgs>
    microPlans?: boolean | LifeScenario$microPlansArgs<ExtArgs>
    _count?: boolean | LifeScenarioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LifeScenarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type LifeScenarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $LifeScenarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LifeScenario"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
      settings: Prisma.$LifeSettingsPayload<ExtArgs> | null
      events: Prisma.$LifeEventPayload<ExtArgs>[]
      microPlans: Prisma.$LifeMicroPlanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      name: string
      description: string | null
      isDefault: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lifeScenario"]>
    composites: {}
  }

  type LifeScenarioGetPayload<S extends boolean | null | undefined | LifeScenarioDefaultArgs> = $Result.GetResult<Prisma.$LifeScenarioPayload, S>

  type LifeScenarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LifeScenarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LifeScenarioCountAggregateInputType | true
    }

  export interface LifeScenarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LifeScenario'], meta: { name: 'LifeScenario' } }
    /**
     * Find zero or one LifeScenario that matches the filter.
     * @param {LifeScenarioFindUniqueArgs} args - Arguments to find a LifeScenario
     * @example
     * // Get one LifeScenario
     * const lifeScenario = await prisma.lifeScenario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LifeScenarioFindUniqueArgs>(args: SelectSubset<T, LifeScenarioFindUniqueArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LifeScenario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LifeScenarioFindUniqueOrThrowArgs} args - Arguments to find a LifeScenario
     * @example
     * // Get one LifeScenario
     * const lifeScenario = await prisma.lifeScenario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LifeScenarioFindUniqueOrThrowArgs>(args: SelectSubset<T, LifeScenarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LifeScenario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeScenarioFindFirstArgs} args - Arguments to find a LifeScenario
     * @example
     * // Get one LifeScenario
     * const lifeScenario = await prisma.lifeScenario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LifeScenarioFindFirstArgs>(args?: SelectSubset<T, LifeScenarioFindFirstArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LifeScenario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeScenarioFindFirstOrThrowArgs} args - Arguments to find a LifeScenario
     * @example
     * // Get one LifeScenario
     * const lifeScenario = await prisma.lifeScenario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LifeScenarioFindFirstOrThrowArgs>(args?: SelectSubset<T, LifeScenarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LifeScenarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeScenarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LifeScenarios
     * const lifeScenarios = await prisma.lifeScenario.findMany()
     * 
     * // Get first 10 LifeScenarios
     * const lifeScenarios = await prisma.lifeScenario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lifeScenarioWithIdOnly = await prisma.lifeScenario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LifeScenarioFindManyArgs>(args?: SelectSubset<T, LifeScenarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LifeScenario.
     * @param {LifeScenarioCreateArgs} args - Arguments to create a LifeScenario.
     * @example
     * // Create one LifeScenario
     * const LifeScenario = await prisma.lifeScenario.create({
     *   data: {
     *     // ... data to create a LifeScenario
     *   }
     * })
     * 
     */
    create<T extends LifeScenarioCreateArgs>(args: SelectSubset<T, LifeScenarioCreateArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LifeScenarios.
     * @param {LifeScenarioCreateManyArgs} args - Arguments to create many LifeScenarios.
     * @example
     * // Create many LifeScenarios
     * const lifeScenario = await prisma.lifeScenario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LifeScenarioCreateManyArgs>(args?: SelectSubset<T, LifeScenarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LifeScenarios and returns the data saved in the database.
     * @param {LifeScenarioCreateManyAndReturnArgs} args - Arguments to create many LifeScenarios.
     * @example
     * // Create many LifeScenarios
     * const lifeScenario = await prisma.lifeScenario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LifeScenarios and only return the `id`
     * const lifeScenarioWithIdOnly = await prisma.lifeScenario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LifeScenarioCreateManyAndReturnArgs>(args?: SelectSubset<T, LifeScenarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LifeScenario.
     * @param {LifeScenarioDeleteArgs} args - Arguments to delete one LifeScenario.
     * @example
     * // Delete one LifeScenario
     * const LifeScenario = await prisma.lifeScenario.delete({
     *   where: {
     *     // ... filter to delete one LifeScenario
     *   }
     * })
     * 
     */
    delete<T extends LifeScenarioDeleteArgs>(args: SelectSubset<T, LifeScenarioDeleteArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LifeScenario.
     * @param {LifeScenarioUpdateArgs} args - Arguments to update one LifeScenario.
     * @example
     * // Update one LifeScenario
     * const lifeScenario = await prisma.lifeScenario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LifeScenarioUpdateArgs>(args: SelectSubset<T, LifeScenarioUpdateArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LifeScenarios.
     * @param {LifeScenarioDeleteManyArgs} args - Arguments to filter LifeScenarios to delete.
     * @example
     * // Delete a few LifeScenarios
     * const { count } = await prisma.lifeScenario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LifeScenarioDeleteManyArgs>(args?: SelectSubset<T, LifeScenarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeScenarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeScenarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LifeScenarios
     * const lifeScenario = await prisma.lifeScenario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LifeScenarioUpdateManyArgs>(args: SelectSubset<T, LifeScenarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeScenarios and returns the data updated in the database.
     * @param {LifeScenarioUpdateManyAndReturnArgs} args - Arguments to update many LifeScenarios.
     * @example
     * // Update many LifeScenarios
     * const lifeScenario = await prisma.lifeScenario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LifeScenarios and only return the `id`
     * const lifeScenarioWithIdOnly = await prisma.lifeScenario.updateManyAndReturn({
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
    updateManyAndReturn<T extends LifeScenarioUpdateManyAndReturnArgs>(args: SelectSubset<T, LifeScenarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LifeScenario.
     * @param {LifeScenarioUpsertArgs} args - Arguments to update or create a LifeScenario.
     * @example
     * // Update or create a LifeScenario
     * const lifeScenario = await prisma.lifeScenario.upsert({
     *   create: {
     *     // ... data to create a LifeScenario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LifeScenario we want to update
     *   }
     * })
     */
    upsert<T extends LifeScenarioUpsertArgs>(args: SelectSubset<T, LifeScenarioUpsertArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LifeScenarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeScenarioCountArgs} args - Arguments to filter LifeScenarios to count.
     * @example
     * // Count the number of LifeScenarios
     * const count = await prisma.lifeScenario.count({
     *   where: {
     *     // ... the filter for the LifeScenarios we want to count
     *   }
     * })
    **/
    count<T extends LifeScenarioCountArgs>(
      args?: Subset<T, LifeScenarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LifeScenarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LifeScenario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeScenarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LifeScenarioAggregateArgs>(args: Subset<T, LifeScenarioAggregateArgs>): Prisma.PrismaPromise<GetLifeScenarioAggregateType<T>>

    /**
     * Group by LifeScenario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeScenarioGroupByArgs} args - Group by arguments.
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
      T extends LifeScenarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LifeScenarioGroupByArgs['orderBy'] }
        : { orderBy?: LifeScenarioGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LifeScenarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLifeScenarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LifeScenario model
   */
  readonly fields: LifeScenarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LifeScenario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LifeScenarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    settings<T extends LifeScenario$settingsArgs<ExtArgs> = {}>(args?: Subset<T, LifeScenario$settingsArgs<ExtArgs>>): Prisma__LifeSettingsClient<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    events<T extends LifeScenario$eventsArgs<ExtArgs> = {}>(args?: Subset<T, LifeScenario$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    microPlans<T extends LifeScenario$microPlansArgs<ExtArgs> = {}>(args?: Subset<T, LifeScenario$microPlansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the LifeScenario model
   */
  interface LifeScenarioFieldRefs {
    readonly id: FieldRef<"LifeScenario", 'String'>
    readonly profileId: FieldRef<"LifeScenario", 'String'>
    readonly name: FieldRef<"LifeScenario", 'String'>
    readonly description: FieldRef<"LifeScenario", 'String'>
    readonly isDefault: FieldRef<"LifeScenario", 'Boolean'>
    readonly createdAt: FieldRef<"LifeScenario", 'DateTime'>
    readonly updatedAt: FieldRef<"LifeScenario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LifeScenario findUnique
   */
  export type LifeScenarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    /**
     * Filter, which LifeScenario to fetch.
     */
    where: LifeScenarioWhereUniqueInput
  }

  /**
   * LifeScenario findUniqueOrThrow
   */
  export type LifeScenarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    /**
     * Filter, which LifeScenario to fetch.
     */
    where: LifeScenarioWhereUniqueInput
  }

  /**
   * LifeScenario findFirst
   */
  export type LifeScenarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    /**
     * Filter, which LifeScenario to fetch.
     */
    where?: LifeScenarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeScenarios to fetch.
     */
    orderBy?: LifeScenarioOrderByWithRelationInput | LifeScenarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeScenarios.
     */
    cursor?: LifeScenarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeScenarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeScenarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeScenarios.
     */
    distinct?: LifeScenarioScalarFieldEnum | LifeScenarioScalarFieldEnum[]
  }

  /**
   * LifeScenario findFirstOrThrow
   */
  export type LifeScenarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    /**
     * Filter, which LifeScenario to fetch.
     */
    where?: LifeScenarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeScenarios to fetch.
     */
    orderBy?: LifeScenarioOrderByWithRelationInput | LifeScenarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeScenarios.
     */
    cursor?: LifeScenarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeScenarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeScenarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeScenarios.
     */
    distinct?: LifeScenarioScalarFieldEnum | LifeScenarioScalarFieldEnum[]
  }

  /**
   * LifeScenario findMany
   */
  export type LifeScenarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    /**
     * Filter, which LifeScenarios to fetch.
     */
    where?: LifeScenarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeScenarios to fetch.
     */
    orderBy?: LifeScenarioOrderByWithRelationInput | LifeScenarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LifeScenarios.
     */
    cursor?: LifeScenarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeScenarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeScenarios.
     */
    skip?: number
    distinct?: LifeScenarioScalarFieldEnum | LifeScenarioScalarFieldEnum[]
  }

  /**
   * LifeScenario create
   */
  export type LifeScenarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    /**
     * The data needed to create a LifeScenario.
     */
    data: XOR<LifeScenarioCreateInput, LifeScenarioUncheckedCreateInput>
  }

  /**
   * LifeScenario createMany
   */
  export type LifeScenarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LifeScenarios.
     */
    data: LifeScenarioCreateManyInput | LifeScenarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LifeScenario createManyAndReturn
   */
  export type LifeScenarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * The data used to create many LifeScenarios.
     */
    data: LifeScenarioCreateManyInput | LifeScenarioCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LifeScenario update
   */
  export type LifeScenarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    /**
     * The data needed to update a LifeScenario.
     */
    data: XOR<LifeScenarioUpdateInput, LifeScenarioUncheckedUpdateInput>
    /**
     * Choose, which LifeScenario to update.
     */
    where: LifeScenarioWhereUniqueInput
  }

  /**
   * LifeScenario updateMany
   */
  export type LifeScenarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LifeScenarios.
     */
    data: XOR<LifeScenarioUpdateManyMutationInput, LifeScenarioUncheckedUpdateManyInput>
    /**
     * Filter which LifeScenarios to update
     */
    where?: LifeScenarioWhereInput
    /**
     * Limit how many LifeScenarios to update.
     */
    limit?: number
  }

  /**
   * LifeScenario updateManyAndReturn
   */
  export type LifeScenarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * The data used to update LifeScenarios.
     */
    data: XOR<LifeScenarioUpdateManyMutationInput, LifeScenarioUncheckedUpdateManyInput>
    /**
     * Filter which LifeScenarios to update
     */
    where?: LifeScenarioWhereInput
    /**
     * Limit how many LifeScenarios to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LifeScenario upsert
   */
  export type LifeScenarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    /**
     * The filter to search for the LifeScenario to update in case it exists.
     */
    where: LifeScenarioWhereUniqueInput
    /**
     * In case the LifeScenario found by the `where` argument doesn't exist, create a new LifeScenario with this data.
     */
    create: XOR<LifeScenarioCreateInput, LifeScenarioUncheckedCreateInput>
    /**
     * In case the LifeScenario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LifeScenarioUpdateInput, LifeScenarioUncheckedUpdateInput>
  }

  /**
   * LifeScenario delete
   */
  export type LifeScenarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
    /**
     * Filter which LifeScenario to delete.
     */
    where: LifeScenarioWhereUniqueInput
  }

  /**
   * LifeScenario deleteMany
   */
  export type LifeScenarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeScenarios to delete
     */
    where?: LifeScenarioWhereInput
    /**
     * Limit how many LifeScenarios to delete.
     */
    limit?: number
  }

  /**
   * LifeScenario.settings
   */
  export type LifeScenario$settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    where?: LifeSettingsWhereInput
  }

  /**
   * LifeScenario.events
   */
  export type LifeScenario$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    where?: LifeEventWhereInput
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    cursor?: LifeEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LifeEventScalarFieldEnum | LifeEventScalarFieldEnum[]
  }

  /**
   * LifeScenario.microPlans
   */
  export type LifeScenario$microPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    where?: LifeMicroPlanWhereInput
    orderBy?: LifeMicroPlanOrderByWithRelationInput | LifeMicroPlanOrderByWithRelationInput[]
    cursor?: LifeMicroPlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LifeMicroPlanScalarFieldEnum | LifeMicroPlanScalarFieldEnum[]
  }

  /**
   * LifeScenario without action
   */
  export type LifeScenarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeScenario
     */
    select?: LifeScenarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeScenario
     */
    omit?: LifeScenarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeScenarioInclude<ExtArgs> | null
  }


  /**
   * Model LifeMicroPlan
   */

  export type AggregateLifeMicroPlan = {
    _count: LifeMicroPlanCountAggregateOutputType | null
    _avg: LifeMicroPlanAvgAggregateOutputType | null
    _sum: LifeMicroPlanSumAggregateOutputType | null
    _min: LifeMicroPlanMinAggregateOutputType | null
    _max: LifeMicroPlanMaxAggregateOutputType | null
  }

  export type LifeMicroPlanAvgAggregateOutputType = {
    monthlyIncome: number | null
    monthlyExpenses: number | null
    monthlyContribution: number | null
  }

  export type LifeMicroPlanSumAggregateOutputType = {
    monthlyIncome: number | null
    monthlyExpenses: number | null
    monthlyContribution: number | null
  }

  export type LifeMicroPlanMinAggregateOutputType = {
    id: string | null
    scenarioId: string | null
    effectiveDate: Date | null
    monthlyIncome: number | null
    monthlyExpenses: number | null
    monthlyContribution: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LifeMicroPlanMaxAggregateOutputType = {
    id: string | null
    scenarioId: string | null
    effectiveDate: Date | null
    monthlyIncome: number | null
    monthlyExpenses: number | null
    monthlyContribution: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LifeMicroPlanCountAggregateOutputType = {
    id: number
    scenarioId: number
    effectiveDate: number
    monthlyIncome: number
    monthlyExpenses: number
    monthlyContribution: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LifeMicroPlanAvgAggregateInputType = {
    monthlyIncome?: true
    monthlyExpenses?: true
    monthlyContribution?: true
  }

  export type LifeMicroPlanSumAggregateInputType = {
    monthlyIncome?: true
    monthlyExpenses?: true
    monthlyContribution?: true
  }

  export type LifeMicroPlanMinAggregateInputType = {
    id?: true
    scenarioId?: true
    effectiveDate?: true
    monthlyIncome?: true
    monthlyExpenses?: true
    monthlyContribution?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LifeMicroPlanMaxAggregateInputType = {
    id?: true
    scenarioId?: true
    effectiveDate?: true
    monthlyIncome?: true
    monthlyExpenses?: true
    monthlyContribution?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LifeMicroPlanCountAggregateInputType = {
    id?: true
    scenarioId?: true
    effectiveDate?: true
    monthlyIncome?: true
    monthlyExpenses?: true
    monthlyContribution?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LifeMicroPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeMicroPlan to aggregate.
     */
    where?: LifeMicroPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeMicroPlans to fetch.
     */
    orderBy?: LifeMicroPlanOrderByWithRelationInput | LifeMicroPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LifeMicroPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeMicroPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeMicroPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LifeMicroPlans
    **/
    _count?: true | LifeMicroPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LifeMicroPlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LifeMicroPlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LifeMicroPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LifeMicroPlanMaxAggregateInputType
  }

  export type GetLifeMicroPlanAggregateType<T extends LifeMicroPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateLifeMicroPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLifeMicroPlan[P]>
      : GetScalarType<T[P], AggregateLifeMicroPlan[P]>
  }




  export type LifeMicroPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeMicroPlanWhereInput
    orderBy?: LifeMicroPlanOrderByWithAggregationInput | LifeMicroPlanOrderByWithAggregationInput[]
    by: LifeMicroPlanScalarFieldEnum[] | LifeMicroPlanScalarFieldEnum
    having?: LifeMicroPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LifeMicroPlanCountAggregateInputType | true
    _avg?: LifeMicroPlanAvgAggregateInputType
    _sum?: LifeMicroPlanSumAggregateInputType
    _min?: LifeMicroPlanMinAggregateInputType
    _max?: LifeMicroPlanMaxAggregateInputType
  }

  export type LifeMicroPlanGroupByOutputType = {
    id: string
    scenarioId: string
    effectiveDate: Date
    monthlyIncome: number
    monthlyExpenses: number
    monthlyContribution: number
    createdAt: Date
    updatedAt: Date
    _count: LifeMicroPlanCountAggregateOutputType | null
    _avg: LifeMicroPlanAvgAggregateOutputType | null
    _sum: LifeMicroPlanSumAggregateOutputType | null
    _min: LifeMicroPlanMinAggregateOutputType | null
    _max: LifeMicroPlanMaxAggregateOutputType | null
  }

  type GetLifeMicroPlanGroupByPayload<T extends LifeMicroPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LifeMicroPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LifeMicroPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LifeMicroPlanGroupByOutputType[P]>
            : GetScalarType<T[P], LifeMicroPlanGroupByOutputType[P]>
        }
      >
    >


  export type LifeMicroPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scenarioId?: boolean
    effectiveDate?: boolean
    monthlyIncome?: boolean
    monthlyExpenses?: boolean
    monthlyContribution?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeMicroPlan"]>

  export type LifeMicroPlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scenarioId?: boolean
    effectiveDate?: boolean
    monthlyIncome?: boolean
    monthlyExpenses?: boolean
    monthlyContribution?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeMicroPlan"]>

  export type LifeMicroPlanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scenarioId?: boolean
    effectiveDate?: boolean
    monthlyIncome?: boolean
    monthlyExpenses?: boolean
    monthlyContribution?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeMicroPlan"]>

  export type LifeMicroPlanSelectScalar = {
    id?: boolean
    scenarioId?: boolean
    effectiveDate?: boolean
    monthlyIncome?: boolean
    monthlyExpenses?: boolean
    monthlyContribution?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LifeMicroPlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scenarioId" | "effectiveDate" | "monthlyIncome" | "monthlyExpenses" | "monthlyContribution" | "createdAt" | "updatedAt", ExtArgs["result"]["lifeMicroPlan"]>
  export type LifeMicroPlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }
  export type LifeMicroPlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }
  export type LifeMicroPlanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }

  export type $LifeMicroPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LifeMicroPlan"
    objects: {
      scenario: Prisma.$LifeScenarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      scenarioId: string
      effectiveDate: Date
      monthlyIncome: number
      monthlyExpenses: number
      monthlyContribution: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lifeMicroPlan"]>
    composites: {}
  }

  type LifeMicroPlanGetPayload<S extends boolean | null | undefined | LifeMicroPlanDefaultArgs> = $Result.GetResult<Prisma.$LifeMicroPlanPayload, S>

  type LifeMicroPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LifeMicroPlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LifeMicroPlanCountAggregateInputType | true
    }

  export interface LifeMicroPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LifeMicroPlan'], meta: { name: 'LifeMicroPlan' } }
    /**
     * Find zero or one LifeMicroPlan that matches the filter.
     * @param {LifeMicroPlanFindUniqueArgs} args - Arguments to find a LifeMicroPlan
     * @example
     * // Get one LifeMicroPlan
     * const lifeMicroPlan = await prisma.lifeMicroPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LifeMicroPlanFindUniqueArgs>(args: SelectSubset<T, LifeMicroPlanFindUniqueArgs<ExtArgs>>): Prisma__LifeMicroPlanClient<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LifeMicroPlan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LifeMicroPlanFindUniqueOrThrowArgs} args - Arguments to find a LifeMicroPlan
     * @example
     * // Get one LifeMicroPlan
     * const lifeMicroPlan = await prisma.lifeMicroPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LifeMicroPlanFindUniqueOrThrowArgs>(args: SelectSubset<T, LifeMicroPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LifeMicroPlanClient<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LifeMicroPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeMicroPlanFindFirstArgs} args - Arguments to find a LifeMicroPlan
     * @example
     * // Get one LifeMicroPlan
     * const lifeMicroPlan = await prisma.lifeMicroPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LifeMicroPlanFindFirstArgs>(args?: SelectSubset<T, LifeMicroPlanFindFirstArgs<ExtArgs>>): Prisma__LifeMicroPlanClient<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LifeMicroPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeMicroPlanFindFirstOrThrowArgs} args - Arguments to find a LifeMicroPlan
     * @example
     * // Get one LifeMicroPlan
     * const lifeMicroPlan = await prisma.lifeMicroPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LifeMicroPlanFindFirstOrThrowArgs>(args?: SelectSubset<T, LifeMicroPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__LifeMicroPlanClient<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LifeMicroPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeMicroPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LifeMicroPlans
     * const lifeMicroPlans = await prisma.lifeMicroPlan.findMany()
     * 
     * // Get first 10 LifeMicroPlans
     * const lifeMicroPlans = await prisma.lifeMicroPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lifeMicroPlanWithIdOnly = await prisma.lifeMicroPlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LifeMicroPlanFindManyArgs>(args?: SelectSubset<T, LifeMicroPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LifeMicroPlan.
     * @param {LifeMicroPlanCreateArgs} args - Arguments to create a LifeMicroPlan.
     * @example
     * // Create one LifeMicroPlan
     * const LifeMicroPlan = await prisma.lifeMicroPlan.create({
     *   data: {
     *     // ... data to create a LifeMicroPlan
     *   }
     * })
     * 
     */
    create<T extends LifeMicroPlanCreateArgs>(args: SelectSubset<T, LifeMicroPlanCreateArgs<ExtArgs>>): Prisma__LifeMicroPlanClient<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LifeMicroPlans.
     * @param {LifeMicroPlanCreateManyArgs} args - Arguments to create many LifeMicroPlans.
     * @example
     * // Create many LifeMicroPlans
     * const lifeMicroPlan = await prisma.lifeMicroPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LifeMicroPlanCreateManyArgs>(args?: SelectSubset<T, LifeMicroPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LifeMicroPlans and returns the data saved in the database.
     * @param {LifeMicroPlanCreateManyAndReturnArgs} args - Arguments to create many LifeMicroPlans.
     * @example
     * // Create many LifeMicroPlans
     * const lifeMicroPlan = await prisma.lifeMicroPlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LifeMicroPlans and only return the `id`
     * const lifeMicroPlanWithIdOnly = await prisma.lifeMicroPlan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LifeMicroPlanCreateManyAndReturnArgs>(args?: SelectSubset<T, LifeMicroPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LifeMicroPlan.
     * @param {LifeMicroPlanDeleteArgs} args - Arguments to delete one LifeMicroPlan.
     * @example
     * // Delete one LifeMicroPlan
     * const LifeMicroPlan = await prisma.lifeMicroPlan.delete({
     *   where: {
     *     // ... filter to delete one LifeMicroPlan
     *   }
     * })
     * 
     */
    delete<T extends LifeMicroPlanDeleteArgs>(args: SelectSubset<T, LifeMicroPlanDeleteArgs<ExtArgs>>): Prisma__LifeMicroPlanClient<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LifeMicroPlan.
     * @param {LifeMicroPlanUpdateArgs} args - Arguments to update one LifeMicroPlan.
     * @example
     * // Update one LifeMicroPlan
     * const lifeMicroPlan = await prisma.lifeMicroPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LifeMicroPlanUpdateArgs>(args: SelectSubset<T, LifeMicroPlanUpdateArgs<ExtArgs>>): Prisma__LifeMicroPlanClient<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LifeMicroPlans.
     * @param {LifeMicroPlanDeleteManyArgs} args - Arguments to filter LifeMicroPlans to delete.
     * @example
     * // Delete a few LifeMicroPlans
     * const { count } = await prisma.lifeMicroPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LifeMicroPlanDeleteManyArgs>(args?: SelectSubset<T, LifeMicroPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeMicroPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeMicroPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LifeMicroPlans
     * const lifeMicroPlan = await prisma.lifeMicroPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LifeMicroPlanUpdateManyArgs>(args: SelectSubset<T, LifeMicroPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeMicroPlans and returns the data updated in the database.
     * @param {LifeMicroPlanUpdateManyAndReturnArgs} args - Arguments to update many LifeMicroPlans.
     * @example
     * // Update many LifeMicroPlans
     * const lifeMicroPlan = await prisma.lifeMicroPlan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LifeMicroPlans and only return the `id`
     * const lifeMicroPlanWithIdOnly = await prisma.lifeMicroPlan.updateManyAndReturn({
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
    updateManyAndReturn<T extends LifeMicroPlanUpdateManyAndReturnArgs>(args: SelectSubset<T, LifeMicroPlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LifeMicroPlan.
     * @param {LifeMicroPlanUpsertArgs} args - Arguments to update or create a LifeMicroPlan.
     * @example
     * // Update or create a LifeMicroPlan
     * const lifeMicroPlan = await prisma.lifeMicroPlan.upsert({
     *   create: {
     *     // ... data to create a LifeMicroPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LifeMicroPlan we want to update
     *   }
     * })
     */
    upsert<T extends LifeMicroPlanUpsertArgs>(args: SelectSubset<T, LifeMicroPlanUpsertArgs<ExtArgs>>): Prisma__LifeMicroPlanClient<$Result.GetResult<Prisma.$LifeMicroPlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LifeMicroPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeMicroPlanCountArgs} args - Arguments to filter LifeMicroPlans to count.
     * @example
     * // Count the number of LifeMicroPlans
     * const count = await prisma.lifeMicroPlan.count({
     *   where: {
     *     // ... the filter for the LifeMicroPlans we want to count
     *   }
     * })
    **/
    count<T extends LifeMicroPlanCountArgs>(
      args?: Subset<T, LifeMicroPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LifeMicroPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LifeMicroPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeMicroPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LifeMicroPlanAggregateArgs>(args: Subset<T, LifeMicroPlanAggregateArgs>): Prisma.PrismaPromise<GetLifeMicroPlanAggregateType<T>>

    /**
     * Group by LifeMicroPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeMicroPlanGroupByArgs} args - Group by arguments.
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
      T extends LifeMicroPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LifeMicroPlanGroupByArgs['orderBy'] }
        : { orderBy?: LifeMicroPlanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LifeMicroPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLifeMicroPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LifeMicroPlan model
   */
  readonly fields: LifeMicroPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LifeMicroPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LifeMicroPlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    scenario<T extends LifeScenarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LifeScenarioDefaultArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the LifeMicroPlan model
   */
  interface LifeMicroPlanFieldRefs {
    readonly id: FieldRef<"LifeMicroPlan", 'String'>
    readonly scenarioId: FieldRef<"LifeMicroPlan", 'String'>
    readonly effectiveDate: FieldRef<"LifeMicroPlan", 'DateTime'>
    readonly monthlyIncome: FieldRef<"LifeMicroPlan", 'Float'>
    readonly monthlyExpenses: FieldRef<"LifeMicroPlan", 'Float'>
    readonly monthlyContribution: FieldRef<"LifeMicroPlan", 'Float'>
    readonly createdAt: FieldRef<"LifeMicroPlan", 'DateTime'>
    readonly updatedAt: FieldRef<"LifeMicroPlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LifeMicroPlan findUnique
   */
  export type LifeMicroPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    /**
     * Filter, which LifeMicroPlan to fetch.
     */
    where: LifeMicroPlanWhereUniqueInput
  }

  /**
   * LifeMicroPlan findUniqueOrThrow
   */
  export type LifeMicroPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    /**
     * Filter, which LifeMicroPlan to fetch.
     */
    where: LifeMicroPlanWhereUniqueInput
  }

  /**
   * LifeMicroPlan findFirst
   */
  export type LifeMicroPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    /**
     * Filter, which LifeMicroPlan to fetch.
     */
    where?: LifeMicroPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeMicroPlans to fetch.
     */
    orderBy?: LifeMicroPlanOrderByWithRelationInput | LifeMicroPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeMicroPlans.
     */
    cursor?: LifeMicroPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeMicroPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeMicroPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeMicroPlans.
     */
    distinct?: LifeMicroPlanScalarFieldEnum | LifeMicroPlanScalarFieldEnum[]
  }

  /**
   * LifeMicroPlan findFirstOrThrow
   */
  export type LifeMicroPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    /**
     * Filter, which LifeMicroPlan to fetch.
     */
    where?: LifeMicroPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeMicroPlans to fetch.
     */
    orderBy?: LifeMicroPlanOrderByWithRelationInput | LifeMicroPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeMicroPlans.
     */
    cursor?: LifeMicroPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeMicroPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeMicroPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeMicroPlans.
     */
    distinct?: LifeMicroPlanScalarFieldEnum | LifeMicroPlanScalarFieldEnum[]
  }

  /**
   * LifeMicroPlan findMany
   */
  export type LifeMicroPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    /**
     * Filter, which LifeMicroPlans to fetch.
     */
    where?: LifeMicroPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeMicroPlans to fetch.
     */
    orderBy?: LifeMicroPlanOrderByWithRelationInput | LifeMicroPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LifeMicroPlans.
     */
    cursor?: LifeMicroPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeMicroPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeMicroPlans.
     */
    skip?: number
    distinct?: LifeMicroPlanScalarFieldEnum | LifeMicroPlanScalarFieldEnum[]
  }

  /**
   * LifeMicroPlan create
   */
  export type LifeMicroPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    /**
     * The data needed to create a LifeMicroPlan.
     */
    data: XOR<LifeMicroPlanCreateInput, LifeMicroPlanUncheckedCreateInput>
  }

  /**
   * LifeMicroPlan createMany
   */
  export type LifeMicroPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LifeMicroPlans.
     */
    data: LifeMicroPlanCreateManyInput | LifeMicroPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LifeMicroPlan createManyAndReturn
   */
  export type LifeMicroPlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * The data used to create many LifeMicroPlans.
     */
    data: LifeMicroPlanCreateManyInput | LifeMicroPlanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LifeMicroPlan update
   */
  export type LifeMicroPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    /**
     * The data needed to update a LifeMicroPlan.
     */
    data: XOR<LifeMicroPlanUpdateInput, LifeMicroPlanUncheckedUpdateInput>
    /**
     * Choose, which LifeMicroPlan to update.
     */
    where: LifeMicroPlanWhereUniqueInput
  }

  /**
   * LifeMicroPlan updateMany
   */
  export type LifeMicroPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LifeMicroPlans.
     */
    data: XOR<LifeMicroPlanUpdateManyMutationInput, LifeMicroPlanUncheckedUpdateManyInput>
    /**
     * Filter which LifeMicroPlans to update
     */
    where?: LifeMicroPlanWhereInput
    /**
     * Limit how many LifeMicroPlans to update.
     */
    limit?: number
  }

  /**
   * LifeMicroPlan updateManyAndReturn
   */
  export type LifeMicroPlanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * The data used to update LifeMicroPlans.
     */
    data: XOR<LifeMicroPlanUpdateManyMutationInput, LifeMicroPlanUncheckedUpdateManyInput>
    /**
     * Filter which LifeMicroPlans to update
     */
    where?: LifeMicroPlanWhereInput
    /**
     * Limit how many LifeMicroPlans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LifeMicroPlan upsert
   */
  export type LifeMicroPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    /**
     * The filter to search for the LifeMicroPlan to update in case it exists.
     */
    where: LifeMicroPlanWhereUniqueInput
    /**
     * In case the LifeMicroPlan found by the `where` argument doesn't exist, create a new LifeMicroPlan with this data.
     */
    create: XOR<LifeMicroPlanCreateInput, LifeMicroPlanUncheckedCreateInput>
    /**
     * In case the LifeMicroPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LifeMicroPlanUpdateInput, LifeMicroPlanUncheckedUpdateInput>
  }

  /**
   * LifeMicroPlan delete
   */
  export type LifeMicroPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
    /**
     * Filter which LifeMicroPlan to delete.
     */
    where: LifeMicroPlanWhereUniqueInput
  }

  /**
   * LifeMicroPlan deleteMany
   */
  export type LifeMicroPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeMicroPlans to delete
     */
    where?: LifeMicroPlanWhereInput
    /**
     * Limit how many LifeMicroPlans to delete.
     */
    limit?: number
  }

  /**
   * LifeMicroPlan without action
   */
  export type LifeMicroPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeMicroPlan
     */
    select?: LifeMicroPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeMicroPlan
     */
    omit?: LifeMicroPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeMicroPlanInclude<ExtArgs> | null
  }


  /**
   * Model LifeSettings
   */

  export type AggregateLifeSettings = {
    _count: LifeSettingsCountAggregateOutputType | null
    _avg: LifeSettingsAvgAggregateOutputType | null
    _sum: LifeSettingsSumAggregateOutputType | null
    _min: LifeSettingsMinAggregateOutputType | null
    _max: LifeSettingsMaxAggregateOutputType | null
  }

  export type LifeSettingsAvgAggregateOutputType = {
    baseNetWorth: number | null
    baseMonthlyIncome: number | null
    baseMonthlyExpenses: number | null
    monthlyContribution: number | null
    expectedReturnYearly: number | null
    inflationYearly: number | null
    retirementAge: number | null
    retirementMonthlyIncome: number | null
  }

  export type LifeSettingsSumAggregateOutputType = {
    baseNetWorth: number | null
    baseMonthlyIncome: number | null
    baseMonthlyExpenses: number | null
    monthlyContribution: number | null
    expectedReturnYearly: number | null
    inflationYearly: number | null
    retirementAge: number | null
    retirementMonthlyIncome: number | null
  }

  export type LifeSettingsMinAggregateOutputType = {
    id: string | null
    scenarioId: string | null
    baseNetWorth: number | null
    baseMonthlyIncome: number | null
    baseMonthlyExpenses: number | null
    monthlyContribution: number | null
    expectedReturnYearly: number | null
    inflationYearly: number | null
    inflateIncome: boolean | null
    inflateExpenses: boolean | null
    retirementAge: number | null
    retirementMonthlyIncome: number | null
    inflateRetirementIncome: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LifeSettingsMaxAggregateOutputType = {
    id: string | null
    scenarioId: string | null
    baseNetWorth: number | null
    baseMonthlyIncome: number | null
    baseMonthlyExpenses: number | null
    monthlyContribution: number | null
    expectedReturnYearly: number | null
    inflationYearly: number | null
    inflateIncome: boolean | null
    inflateExpenses: boolean | null
    retirementAge: number | null
    retirementMonthlyIncome: number | null
    inflateRetirementIncome: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LifeSettingsCountAggregateOutputType = {
    id: number
    scenarioId: number
    baseNetWorth: number
    baseMonthlyIncome: number
    baseMonthlyExpenses: number
    monthlyContribution: number
    expectedReturnYearly: number
    inflationYearly: number
    inflateIncome: number
    inflateExpenses: number
    retirementAge: number
    retirementMonthlyIncome: number
    inflateRetirementIncome: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LifeSettingsAvgAggregateInputType = {
    baseNetWorth?: true
    baseMonthlyIncome?: true
    baseMonthlyExpenses?: true
    monthlyContribution?: true
    expectedReturnYearly?: true
    inflationYearly?: true
    retirementAge?: true
    retirementMonthlyIncome?: true
  }

  export type LifeSettingsSumAggregateInputType = {
    baseNetWorth?: true
    baseMonthlyIncome?: true
    baseMonthlyExpenses?: true
    monthlyContribution?: true
    expectedReturnYearly?: true
    inflationYearly?: true
    retirementAge?: true
    retirementMonthlyIncome?: true
  }

  export type LifeSettingsMinAggregateInputType = {
    id?: true
    scenarioId?: true
    baseNetWorth?: true
    baseMonthlyIncome?: true
    baseMonthlyExpenses?: true
    monthlyContribution?: true
    expectedReturnYearly?: true
    inflationYearly?: true
    inflateIncome?: true
    inflateExpenses?: true
    retirementAge?: true
    retirementMonthlyIncome?: true
    inflateRetirementIncome?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LifeSettingsMaxAggregateInputType = {
    id?: true
    scenarioId?: true
    baseNetWorth?: true
    baseMonthlyIncome?: true
    baseMonthlyExpenses?: true
    monthlyContribution?: true
    expectedReturnYearly?: true
    inflationYearly?: true
    inflateIncome?: true
    inflateExpenses?: true
    retirementAge?: true
    retirementMonthlyIncome?: true
    inflateRetirementIncome?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LifeSettingsCountAggregateInputType = {
    id?: true
    scenarioId?: true
    baseNetWorth?: true
    baseMonthlyIncome?: true
    baseMonthlyExpenses?: true
    monthlyContribution?: true
    expectedReturnYearly?: true
    inflationYearly?: true
    inflateIncome?: true
    inflateExpenses?: true
    retirementAge?: true
    retirementMonthlyIncome?: true
    inflateRetirementIncome?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LifeSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeSettings to aggregate.
     */
    where?: LifeSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeSettings to fetch.
     */
    orderBy?: LifeSettingsOrderByWithRelationInput | LifeSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LifeSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LifeSettings
    **/
    _count?: true | LifeSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LifeSettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LifeSettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LifeSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LifeSettingsMaxAggregateInputType
  }

  export type GetLifeSettingsAggregateType<T extends LifeSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateLifeSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLifeSettings[P]>
      : GetScalarType<T[P], AggregateLifeSettings[P]>
  }




  export type LifeSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeSettingsWhereInput
    orderBy?: LifeSettingsOrderByWithAggregationInput | LifeSettingsOrderByWithAggregationInput[]
    by: LifeSettingsScalarFieldEnum[] | LifeSettingsScalarFieldEnum
    having?: LifeSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LifeSettingsCountAggregateInputType | true
    _avg?: LifeSettingsAvgAggregateInputType
    _sum?: LifeSettingsSumAggregateInputType
    _min?: LifeSettingsMinAggregateInputType
    _max?: LifeSettingsMaxAggregateInputType
  }

  export type LifeSettingsGroupByOutputType = {
    id: string
    scenarioId: string
    baseNetWorth: number
    baseMonthlyIncome: number
    baseMonthlyExpenses: number
    monthlyContribution: number
    expectedReturnYearly: number
    inflationYearly: number
    inflateIncome: boolean
    inflateExpenses: boolean
    retirementAge: number
    retirementMonthlyIncome: number
    inflateRetirementIncome: boolean
    createdAt: Date
    updatedAt: Date
    _count: LifeSettingsCountAggregateOutputType | null
    _avg: LifeSettingsAvgAggregateOutputType | null
    _sum: LifeSettingsSumAggregateOutputType | null
    _min: LifeSettingsMinAggregateOutputType | null
    _max: LifeSettingsMaxAggregateOutputType | null
  }

  type GetLifeSettingsGroupByPayload<T extends LifeSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LifeSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LifeSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LifeSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], LifeSettingsGroupByOutputType[P]>
        }
      >
    >


  export type LifeSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scenarioId?: boolean
    baseNetWorth?: boolean
    baseMonthlyIncome?: boolean
    baseMonthlyExpenses?: boolean
    monthlyContribution?: boolean
    expectedReturnYearly?: boolean
    inflationYearly?: boolean
    inflateIncome?: boolean
    inflateExpenses?: boolean
    retirementAge?: boolean
    retirementMonthlyIncome?: boolean
    inflateRetirementIncome?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeSettings"]>

  export type LifeSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scenarioId?: boolean
    baseNetWorth?: boolean
    baseMonthlyIncome?: boolean
    baseMonthlyExpenses?: boolean
    monthlyContribution?: boolean
    expectedReturnYearly?: boolean
    inflationYearly?: boolean
    inflateIncome?: boolean
    inflateExpenses?: boolean
    retirementAge?: boolean
    retirementMonthlyIncome?: boolean
    inflateRetirementIncome?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeSettings"]>

  export type LifeSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scenarioId?: boolean
    baseNetWorth?: boolean
    baseMonthlyIncome?: boolean
    baseMonthlyExpenses?: boolean
    monthlyContribution?: boolean
    expectedReturnYearly?: boolean
    inflationYearly?: boolean
    inflateIncome?: boolean
    inflateExpenses?: boolean
    retirementAge?: boolean
    retirementMonthlyIncome?: boolean
    inflateRetirementIncome?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeSettings"]>

  export type LifeSettingsSelectScalar = {
    id?: boolean
    scenarioId?: boolean
    baseNetWorth?: boolean
    baseMonthlyIncome?: boolean
    baseMonthlyExpenses?: boolean
    monthlyContribution?: boolean
    expectedReturnYearly?: boolean
    inflationYearly?: boolean
    inflateIncome?: boolean
    inflateExpenses?: boolean
    retirementAge?: boolean
    retirementMonthlyIncome?: boolean
    inflateRetirementIncome?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LifeSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scenarioId" | "baseNetWorth" | "baseMonthlyIncome" | "baseMonthlyExpenses" | "monthlyContribution" | "expectedReturnYearly" | "inflationYearly" | "inflateIncome" | "inflateExpenses" | "retirementAge" | "retirementMonthlyIncome" | "inflateRetirementIncome" | "createdAt" | "updatedAt", ExtArgs["result"]["lifeSettings"]>
  export type LifeSettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }
  export type LifeSettingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }
  export type LifeSettingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }

  export type $LifeSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LifeSettings"
    objects: {
      scenario: Prisma.$LifeScenarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      scenarioId: string
      baseNetWorth: number
      baseMonthlyIncome: number
      baseMonthlyExpenses: number
      monthlyContribution: number
      expectedReturnYearly: number
      inflationYearly: number
      inflateIncome: boolean
      inflateExpenses: boolean
      retirementAge: number
      retirementMonthlyIncome: number
      inflateRetirementIncome: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lifeSettings"]>
    composites: {}
  }

  type LifeSettingsGetPayload<S extends boolean | null | undefined | LifeSettingsDefaultArgs> = $Result.GetResult<Prisma.$LifeSettingsPayload, S>

  type LifeSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LifeSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LifeSettingsCountAggregateInputType | true
    }

  export interface LifeSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LifeSettings'], meta: { name: 'LifeSettings' } }
    /**
     * Find zero or one LifeSettings that matches the filter.
     * @param {LifeSettingsFindUniqueArgs} args - Arguments to find a LifeSettings
     * @example
     * // Get one LifeSettings
     * const lifeSettings = await prisma.lifeSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LifeSettingsFindUniqueArgs>(args: SelectSubset<T, LifeSettingsFindUniqueArgs<ExtArgs>>): Prisma__LifeSettingsClient<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LifeSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LifeSettingsFindUniqueOrThrowArgs} args - Arguments to find a LifeSettings
     * @example
     * // Get one LifeSettings
     * const lifeSettings = await prisma.lifeSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LifeSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, LifeSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LifeSettingsClient<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LifeSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeSettingsFindFirstArgs} args - Arguments to find a LifeSettings
     * @example
     * // Get one LifeSettings
     * const lifeSettings = await prisma.lifeSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LifeSettingsFindFirstArgs>(args?: SelectSubset<T, LifeSettingsFindFirstArgs<ExtArgs>>): Prisma__LifeSettingsClient<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LifeSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeSettingsFindFirstOrThrowArgs} args - Arguments to find a LifeSettings
     * @example
     * // Get one LifeSettings
     * const lifeSettings = await prisma.lifeSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LifeSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, LifeSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__LifeSettingsClient<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LifeSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LifeSettings
     * const lifeSettings = await prisma.lifeSettings.findMany()
     * 
     * // Get first 10 LifeSettings
     * const lifeSettings = await prisma.lifeSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lifeSettingsWithIdOnly = await prisma.lifeSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LifeSettingsFindManyArgs>(args?: SelectSubset<T, LifeSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LifeSettings.
     * @param {LifeSettingsCreateArgs} args - Arguments to create a LifeSettings.
     * @example
     * // Create one LifeSettings
     * const LifeSettings = await prisma.lifeSettings.create({
     *   data: {
     *     // ... data to create a LifeSettings
     *   }
     * })
     * 
     */
    create<T extends LifeSettingsCreateArgs>(args: SelectSubset<T, LifeSettingsCreateArgs<ExtArgs>>): Prisma__LifeSettingsClient<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LifeSettings.
     * @param {LifeSettingsCreateManyArgs} args - Arguments to create many LifeSettings.
     * @example
     * // Create many LifeSettings
     * const lifeSettings = await prisma.lifeSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LifeSettingsCreateManyArgs>(args?: SelectSubset<T, LifeSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LifeSettings and returns the data saved in the database.
     * @param {LifeSettingsCreateManyAndReturnArgs} args - Arguments to create many LifeSettings.
     * @example
     * // Create many LifeSettings
     * const lifeSettings = await prisma.lifeSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LifeSettings and only return the `id`
     * const lifeSettingsWithIdOnly = await prisma.lifeSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LifeSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, LifeSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LifeSettings.
     * @param {LifeSettingsDeleteArgs} args - Arguments to delete one LifeSettings.
     * @example
     * // Delete one LifeSettings
     * const LifeSettings = await prisma.lifeSettings.delete({
     *   where: {
     *     // ... filter to delete one LifeSettings
     *   }
     * })
     * 
     */
    delete<T extends LifeSettingsDeleteArgs>(args: SelectSubset<T, LifeSettingsDeleteArgs<ExtArgs>>): Prisma__LifeSettingsClient<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LifeSettings.
     * @param {LifeSettingsUpdateArgs} args - Arguments to update one LifeSettings.
     * @example
     * // Update one LifeSettings
     * const lifeSettings = await prisma.lifeSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LifeSettingsUpdateArgs>(args: SelectSubset<T, LifeSettingsUpdateArgs<ExtArgs>>): Prisma__LifeSettingsClient<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LifeSettings.
     * @param {LifeSettingsDeleteManyArgs} args - Arguments to filter LifeSettings to delete.
     * @example
     * // Delete a few LifeSettings
     * const { count } = await prisma.lifeSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LifeSettingsDeleteManyArgs>(args?: SelectSubset<T, LifeSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LifeSettings
     * const lifeSettings = await prisma.lifeSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LifeSettingsUpdateManyArgs>(args: SelectSubset<T, LifeSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeSettings and returns the data updated in the database.
     * @param {LifeSettingsUpdateManyAndReturnArgs} args - Arguments to update many LifeSettings.
     * @example
     * // Update many LifeSettings
     * const lifeSettings = await prisma.lifeSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LifeSettings and only return the `id`
     * const lifeSettingsWithIdOnly = await prisma.lifeSettings.updateManyAndReturn({
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
    updateManyAndReturn<T extends LifeSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, LifeSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LifeSettings.
     * @param {LifeSettingsUpsertArgs} args - Arguments to update or create a LifeSettings.
     * @example
     * // Update or create a LifeSettings
     * const lifeSettings = await prisma.lifeSettings.upsert({
     *   create: {
     *     // ... data to create a LifeSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LifeSettings we want to update
     *   }
     * })
     */
    upsert<T extends LifeSettingsUpsertArgs>(args: SelectSubset<T, LifeSettingsUpsertArgs<ExtArgs>>): Prisma__LifeSettingsClient<$Result.GetResult<Prisma.$LifeSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LifeSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeSettingsCountArgs} args - Arguments to filter LifeSettings to count.
     * @example
     * // Count the number of LifeSettings
     * const count = await prisma.lifeSettings.count({
     *   where: {
     *     // ... the filter for the LifeSettings we want to count
     *   }
     * })
    **/
    count<T extends LifeSettingsCountArgs>(
      args?: Subset<T, LifeSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LifeSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LifeSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LifeSettingsAggregateArgs>(args: Subset<T, LifeSettingsAggregateArgs>): Prisma.PrismaPromise<GetLifeSettingsAggregateType<T>>

    /**
     * Group by LifeSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeSettingsGroupByArgs} args - Group by arguments.
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
      T extends LifeSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LifeSettingsGroupByArgs['orderBy'] }
        : { orderBy?: LifeSettingsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LifeSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLifeSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LifeSettings model
   */
  readonly fields: LifeSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LifeSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LifeSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    scenario<T extends LifeScenarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LifeScenarioDefaultArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the LifeSettings model
   */
  interface LifeSettingsFieldRefs {
    readonly id: FieldRef<"LifeSettings", 'String'>
    readonly scenarioId: FieldRef<"LifeSettings", 'String'>
    readonly baseNetWorth: FieldRef<"LifeSettings", 'Float'>
    readonly baseMonthlyIncome: FieldRef<"LifeSettings", 'Float'>
    readonly baseMonthlyExpenses: FieldRef<"LifeSettings", 'Float'>
    readonly monthlyContribution: FieldRef<"LifeSettings", 'Float'>
    readonly expectedReturnYearly: FieldRef<"LifeSettings", 'Float'>
    readonly inflationYearly: FieldRef<"LifeSettings", 'Float'>
    readonly inflateIncome: FieldRef<"LifeSettings", 'Boolean'>
    readonly inflateExpenses: FieldRef<"LifeSettings", 'Boolean'>
    readonly retirementAge: FieldRef<"LifeSettings", 'Int'>
    readonly retirementMonthlyIncome: FieldRef<"LifeSettings", 'Float'>
    readonly inflateRetirementIncome: FieldRef<"LifeSettings", 'Boolean'>
    readonly createdAt: FieldRef<"LifeSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"LifeSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LifeSettings findUnique
   */
  export type LifeSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LifeSettings to fetch.
     */
    where: LifeSettingsWhereUniqueInput
  }

  /**
   * LifeSettings findUniqueOrThrow
   */
  export type LifeSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LifeSettings to fetch.
     */
    where: LifeSettingsWhereUniqueInput
  }

  /**
   * LifeSettings findFirst
   */
  export type LifeSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LifeSettings to fetch.
     */
    where?: LifeSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeSettings to fetch.
     */
    orderBy?: LifeSettingsOrderByWithRelationInput | LifeSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeSettings.
     */
    cursor?: LifeSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeSettings.
     */
    distinct?: LifeSettingsScalarFieldEnum | LifeSettingsScalarFieldEnum[]
  }

  /**
   * LifeSettings findFirstOrThrow
   */
  export type LifeSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LifeSettings to fetch.
     */
    where?: LifeSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeSettings to fetch.
     */
    orderBy?: LifeSettingsOrderByWithRelationInput | LifeSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeSettings.
     */
    cursor?: LifeSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeSettings.
     */
    distinct?: LifeSettingsScalarFieldEnum | LifeSettingsScalarFieldEnum[]
  }

  /**
   * LifeSettings findMany
   */
  export type LifeSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LifeSettings to fetch.
     */
    where?: LifeSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeSettings to fetch.
     */
    orderBy?: LifeSettingsOrderByWithRelationInput | LifeSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LifeSettings.
     */
    cursor?: LifeSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeSettings.
     */
    skip?: number
    distinct?: LifeSettingsScalarFieldEnum | LifeSettingsScalarFieldEnum[]
  }

  /**
   * LifeSettings create
   */
  export type LifeSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a LifeSettings.
     */
    data: XOR<LifeSettingsCreateInput, LifeSettingsUncheckedCreateInput>
  }

  /**
   * LifeSettings createMany
   */
  export type LifeSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LifeSettings.
     */
    data: LifeSettingsCreateManyInput | LifeSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LifeSettings createManyAndReturn
   */
  export type LifeSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many LifeSettings.
     */
    data: LifeSettingsCreateManyInput | LifeSettingsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LifeSettings update
   */
  export type LifeSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a LifeSettings.
     */
    data: XOR<LifeSettingsUpdateInput, LifeSettingsUncheckedUpdateInput>
    /**
     * Choose, which LifeSettings to update.
     */
    where: LifeSettingsWhereUniqueInput
  }

  /**
   * LifeSettings updateMany
   */
  export type LifeSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LifeSettings.
     */
    data: XOR<LifeSettingsUpdateManyMutationInput, LifeSettingsUncheckedUpdateManyInput>
    /**
     * Filter which LifeSettings to update
     */
    where?: LifeSettingsWhereInput
    /**
     * Limit how many LifeSettings to update.
     */
    limit?: number
  }

  /**
   * LifeSettings updateManyAndReturn
   */
  export type LifeSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * The data used to update LifeSettings.
     */
    data: XOR<LifeSettingsUpdateManyMutationInput, LifeSettingsUncheckedUpdateManyInput>
    /**
     * Filter which LifeSettings to update
     */
    where?: LifeSettingsWhereInput
    /**
     * Limit how many LifeSettings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LifeSettings upsert
   */
  export type LifeSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the LifeSettings to update in case it exists.
     */
    where: LifeSettingsWhereUniqueInput
    /**
     * In case the LifeSettings found by the `where` argument doesn't exist, create a new LifeSettings with this data.
     */
    create: XOR<LifeSettingsCreateInput, LifeSettingsUncheckedCreateInput>
    /**
     * In case the LifeSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LifeSettingsUpdateInput, LifeSettingsUncheckedUpdateInput>
  }

  /**
   * LifeSettings delete
   */
  export type LifeSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
    /**
     * Filter which LifeSettings to delete.
     */
    where: LifeSettingsWhereUniqueInput
  }

  /**
   * LifeSettings deleteMany
   */
  export type LifeSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeSettings to delete
     */
    where?: LifeSettingsWhereInput
    /**
     * Limit how many LifeSettings to delete.
     */
    limit?: number
  }

  /**
   * LifeSettings without action
   */
  export type LifeSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeSettings
     */
    select?: LifeSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeSettings
     */
    omit?: LifeSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeSettingsInclude<ExtArgs> | null
  }


  /**
   * Model LifeEvent
   */

  export type AggregateLifeEvent = {
    _count: LifeEventCountAggregateOutputType | null
    _avg: LifeEventAvgAggregateOutputType | null
    _sum: LifeEventSumAggregateOutputType | null
    _min: LifeEventMinAggregateOutputType | null
    _max: LifeEventMaxAggregateOutputType | null
  }

  export type LifeEventAvgAggregateOutputType = {
    amount: number | null
    durationMonths: number | null
  }

  export type LifeEventSumAggregateOutputType = {
    amount: number | null
    durationMonths: number | null
  }

  export type LifeEventMinAggregateOutputType = {
    id: string | null
    scenarioId: string | null
    type: string | null
    title: string | null
    description: string | null
    date: Date | null
    endDate: Date | null
    amount: number | null
    frequency: string | null
    durationMonths: number | null
    inflationIndexed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LifeEventMaxAggregateOutputType = {
    id: string | null
    scenarioId: string | null
    type: string | null
    title: string | null
    description: string | null
    date: Date | null
    endDate: Date | null
    amount: number | null
    frequency: string | null
    durationMonths: number | null
    inflationIndexed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LifeEventCountAggregateOutputType = {
    id: number
    scenarioId: number
    type: number
    title: number
    description: number
    date: number
    endDate: number
    amount: number
    frequency: number
    durationMonths: number
    inflationIndexed: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LifeEventAvgAggregateInputType = {
    amount?: true
    durationMonths?: true
  }

  export type LifeEventSumAggregateInputType = {
    amount?: true
    durationMonths?: true
  }

  export type LifeEventMinAggregateInputType = {
    id?: true
    scenarioId?: true
    type?: true
    title?: true
    description?: true
    date?: true
    endDate?: true
    amount?: true
    frequency?: true
    durationMonths?: true
    inflationIndexed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LifeEventMaxAggregateInputType = {
    id?: true
    scenarioId?: true
    type?: true
    title?: true
    description?: true
    date?: true
    endDate?: true
    amount?: true
    frequency?: true
    durationMonths?: true
    inflationIndexed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LifeEventCountAggregateInputType = {
    id?: true
    scenarioId?: true
    type?: true
    title?: true
    description?: true
    date?: true
    endDate?: true
    amount?: true
    frequency?: true
    durationMonths?: true
    inflationIndexed?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LifeEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeEvent to aggregate.
     */
    where?: LifeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeEvents to fetch.
     */
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LifeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LifeEvents
    **/
    _count?: true | LifeEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LifeEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LifeEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LifeEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LifeEventMaxAggregateInputType
  }

  export type GetLifeEventAggregateType<T extends LifeEventAggregateArgs> = {
        [P in keyof T & keyof AggregateLifeEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLifeEvent[P]>
      : GetScalarType<T[P], AggregateLifeEvent[P]>
  }




  export type LifeEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeEventWhereInput
    orderBy?: LifeEventOrderByWithAggregationInput | LifeEventOrderByWithAggregationInput[]
    by: LifeEventScalarFieldEnum[] | LifeEventScalarFieldEnum
    having?: LifeEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LifeEventCountAggregateInputType | true
    _avg?: LifeEventAvgAggregateInputType
    _sum?: LifeEventSumAggregateInputType
    _min?: LifeEventMinAggregateInputType
    _max?: LifeEventMaxAggregateInputType
  }

  export type LifeEventGroupByOutputType = {
    id: string
    scenarioId: string
    type: string
    title: string
    description: string | null
    date: Date
    endDate: Date | null
    amount: number
    frequency: string
    durationMonths: number | null
    inflationIndexed: boolean
    createdAt: Date
    updatedAt: Date
    _count: LifeEventCountAggregateOutputType | null
    _avg: LifeEventAvgAggregateOutputType | null
    _sum: LifeEventSumAggregateOutputType | null
    _min: LifeEventMinAggregateOutputType | null
    _max: LifeEventMaxAggregateOutputType | null
  }

  type GetLifeEventGroupByPayload<T extends LifeEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LifeEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LifeEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LifeEventGroupByOutputType[P]>
            : GetScalarType<T[P], LifeEventGroupByOutputType[P]>
        }
      >
    >


  export type LifeEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scenarioId?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    endDate?: boolean
    amount?: boolean
    frequency?: boolean
    durationMonths?: boolean
    inflationIndexed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeEvent"]>

  export type LifeEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scenarioId?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    endDate?: boolean
    amount?: boolean
    frequency?: boolean
    durationMonths?: boolean
    inflationIndexed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeEvent"]>

  export type LifeEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scenarioId?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    endDate?: boolean
    amount?: boolean
    frequency?: boolean
    durationMonths?: boolean
    inflationIndexed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeEvent"]>

  export type LifeEventSelectScalar = {
    id?: boolean
    scenarioId?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    endDate?: boolean
    amount?: boolean
    frequency?: boolean
    durationMonths?: boolean
    inflationIndexed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LifeEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scenarioId" | "type" | "title" | "description" | "date" | "endDate" | "amount" | "frequency" | "durationMonths" | "inflationIndexed" | "createdAt" | "updatedAt", ExtArgs["result"]["lifeEvent"]>
  export type LifeEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }
  export type LifeEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }
  export type LifeEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenario?: boolean | LifeScenarioDefaultArgs<ExtArgs>
  }

  export type $LifeEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LifeEvent"
    objects: {
      scenario: Prisma.$LifeScenarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      scenarioId: string
      type: string
      title: string
      description: string | null
      date: Date
      endDate: Date | null
      amount: number
      frequency: string
      durationMonths: number | null
      inflationIndexed: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lifeEvent"]>
    composites: {}
  }

  type LifeEventGetPayload<S extends boolean | null | undefined | LifeEventDefaultArgs> = $Result.GetResult<Prisma.$LifeEventPayload, S>

  type LifeEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LifeEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LifeEventCountAggregateInputType | true
    }

  export interface LifeEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LifeEvent'], meta: { name: 'LifeEvent' } }
    /**
     * Find zero or one LifeEvent that matches the filter.
     * @param {LifeEventFindUniqueArgs} args - Arguments to find a LifeEvent
     * @example
     * // Get one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LifeEventFindUniqueArgs>(args: SelectSubset<T, LifeEventFindUniqueArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LifeEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LifeEventFindUniqueOrThrowArgs} args - Arguments to find a LifeEvent
     * @example
     * // Get one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LifeEventFindUniqueOrThrowArgs>(args: SelectSubset<T, LifeEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LifeEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventFindFirstArgs} args - Arguments to find a LifeEvent
     * @example
     * // Get one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LifeEventFindFirstArgs>(args?: SelectSubset<T, LifeEventFindFirstArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LifeEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventFindFirstOrThrowArgs} args - Arguments to find a LifeEvent
     * @example
     * // Get one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LifeEventFindFirstOrThrowArgs>(args?: SelectSubset<T, LifeEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LifeEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LifeEvents
     * const lifeEvents = await prisma.lifeEvent.findMany()
     * 
     * // Get first 10 LifeEvents
     * const lifeEvents = await prisma.lifeEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lifeEventWithIdOnly = await prisma.lifeEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LifeEventFindManyArgs>(args?: SelectSubset<T, LifeEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LifeEvent.
     * @param {LifeEventCreateArgs} args - Arguments to create a LifeEvent.
     * @example
     * // Create one LifeEvent
     * const LifeEvent = await prisma.lifeEvent.create({
     *   data: {
     *     // ... data to create a LifeEvent
     *   }
     * })
     * 
     */
    create<T extends LifeEventCreateArgs>(args: SelectSubset<T, LifeEventCreateArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LifeEvents.
     * @param {LifeEventCreateManyArgs} args - Arguments to create many LifeEvents.
     * @example
     * // Create many LifeEvents
     * const lifeEvent = await prisma.lifeEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LifeEventCreateManyArgs>(args?: SelectSubset<T, LifeEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LifeEvents and returns the data saved in the database.
     * @param {LifeEventCreateManyAndReturnArgs} args - Arguments to create many LifeEvents.
     * @example
     * // Create many LifeEvents
     * const lifeEvent = await prisma.lifeEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LifeEvents and only return the `id`
     * const lifeEventWithIdOnly = await prisma.lifeEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LifeEventCreateManyAndReturnArgs>(args?: SelectSubset<T, LifeEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LifeEvent.
     * @param {LifeEventDeleteArgs} args - Arguments to delete one LifeEvent.
     * @example
     * // Delete one LifeEvent
     * const LifeEvent = await prisma.lifeEvent.delete({
     *   where: {
     *     // ... filter to delete one LifeEvent
     *   }
     * })
     * 
     */
    delete<T extends LifeEventDeleteArgs>(args: SelectSubset<T, LifeEventDeleteArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LifeEvent.
     * @param {LifeEventUpdateArgs} args - Arguments to update one LifeEvent.
     * @example
     * // Update one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LifeEventUpdateArgs>(args: SelectSubset<T, LifeEventUpdateArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LifeEvents.
     * @param {LifeEventDeleteManyArgs} args - Arguments to filter LifeEvents to delete.
     * @example
     * // Delete a few LifeEvents
     * const { count } = await prisma.lifeEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LifeEventDeleteManyArgs>(args?: SelectSubset<T, LifeEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LifeEvents
     * const lifeEvent = await prisma.lifeEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LifeEventUpdateManyArgs>(args: SelectSubset<T, LifeEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeEvents and returns the data updated in the database.
     * @param {LifeEventUpdateManyAndReturnArgs} args - Arguments to update many LifeEvents.
     * @example
     * // Update many LifeEvents
     * const lifeEvent = await prisma.lifeEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LifeEvents and only return the `id`
     * const lifeEventWithIdOnly = await prisma.lifeEvent.updateManyAndReturn({
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
    updateManyAndReturn<T extends LifeEventUpdateManyAndReturnArgs>(args: SelectSubset<T, LifeEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LifeEvent.
     * @param {LifeEventUpsertArgs} args - Arguments to update or create a LifeEvent.
     * @example
     * // Update or create a LifeEvent
     * const lifeEvent = await prisma.lifeEvent.upsert({
     *   create: {
     *     // ... data to create a LifeEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LifeEvent we want to update
     *   }
     * })
     */
    upsert<T extends LifeEventUpsertArgs>(args: SelectSubset<T, LifeEventUpsertArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LifeEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventCountArgs} args - Arguments to filter LifeEvents to count.
     * @example
     * // Count the number of LifeEvents
     * const count = await prisma.lifeEvent.count({
     *   where: {
     *     // ... the filter for the LifeEvents we want to count
     *   }
     * })
    **/
    count<T extends LifeEventCountArgs>(
      args?: Subset<T, LifeEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LifeEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LifeEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LifeEventAggregateArgs>(args: Subset<T, LifeEventAggregateArgs>): Prisma.PrismaPromise<GetLifeEventAggregateType<T>>

    /**
     * Group by LifeEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventGroupByArgs} args - Group by arguments.
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
      T extends LifeEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LifeEventGroupByArgs['orderBy'] }
        : { orderBy?: LifeEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LifeEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLifeEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LifeEvent model
   */
  readonly fields: LifeEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LifeEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LifeEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    scenario<T extends LifeScenarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LifeScenarioDefaultArgs<ExtArgs>>): Prisma__LifeScenarioClient<$Result.GetResult<Prisma.$LifeScenarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the LifeEvent model
   */
  interface LifeEventFieldRefs {
    readonly id: FieldRef<"LifeEvent", 'String'>
    readonly scenarioId: FieldRef<"LifeEvent", 'String'>
    readonly type: FieldRef<"LifeEvent", 'String'>
    readonly title: FieldRef<"LifeEvent", 'String'>
    readonly description: FieldRef<"LifeEvent", 'String'>
    readonly date: FieldRef<"LifeEvent", 'DateTime'>
    readonly endDate: FieldRef<"LifeEvent", 'DateTime'>
    readonly amount: FieldRef<"LifeEvent", 'Float'>
    readonly frequency: FieldRef<"LifeEvent", 'String'>
    readonly durationMonths: FieldRef<"LifeEvent", 'Int'>
    readonly inflationIndexed: FieldRef<"LifeEvent", 'Boolean'>
    readonly createdAt: FieldRef<"LifeEvent", 'DateTime'>
    readonly updatedAt: FieldRef<"LifeEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LifeEvent findUnique
   */
  export type LifeEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvent to fetch.
     */
    where: LifeEventWhereUniqueInput
  }

  /**
   * LifeEvent findUniqueOrThrow
   */
  export type LifeEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvent to fetch.
     */
    where: LifeEventWhereUniqueInput
  }

  /**
   * LifeEvent findFirst
   */
  export type LifeEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvent to fetch.
     */
    where?: LifeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeEvents to fetch.
     */
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeEvents.
     */
    cursor?: LifeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeEvents.
     */
    distinct?: LifeEventScalarFieldEnum | LifeEventScalarFieldEnum[]
  }

  /**
   * LifeEvent findFirstOrThrow
   */
  export type LifeEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvent to fetch.
     */
    where?: LifeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeEvents to fetch.
     */
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeEvents.
     */
    cursor?: LifeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeEvents.
     */
    distinct?: LifeEventScalarFieldEnum | LifeEventScalarFieldEnum[]
  }

  /**
   * LifeEvent findMany
   */
  export type LifeEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvents to fetch.
     */
    where?: LifeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeEvents to fetch.
     */
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LifeEvents.
     */
    cursor?: LifeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeEvents.
     */
    skip?: number
    distinct?: LifeEventScalarFieldEnum | LifeEventScalarFieldEnum[]
  }

  /**
   * LifeEvent create
   */
  export type LifeEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * The data needed to create a LifeEvent.
     */
    data: XOR<LifeEventCreateInput, LifeEventUncheckedCreateInput>
  }

  /**
   * LifeEvent createMany
   */
  export type LifeEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LifeEvents.
     */
    data: LifeEventCreateManyInput | LifeEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LifeEvent createManyAndReturn
   */
  export type LifeEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * The data used to create many LifeEvents.
     */
    data: LifeEventCreateManyInput | LifeEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LifeEvent update
   */
  export type LifeEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * The data needed to update a LifeEvent.
     */
    data: XOR<LifeEventUpdateInput, LifeEventUncheckedUpdateInput>
    /**
     * Choose, which LifeEvent to update.
     */
    where: LifeEventWhereUniqueInput
  }

  /**
   * LifeEvent updateMany
   */
  export type LifeEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LifeEvents.
     */
    data: XOR<LifeEventUpdateManyMutationInput, LifeEventUncheckedUpdateManyInput>
    /**
     * Filter which LifeEvents to update
     */
    where?: LifeEventWhereInput
    /**
     * Limit how many LifeEvents to update.
     */
    limit?: number
  }

  /**
   * LifeEvent updateManyAndReturn
   */
  export type LifeEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * The data used to update LifeEvents.
     */
    data: XOR<LifeEventUpdateManyMutationInput, LifeEventUncheckedUpdateManyInput>
    /**
     * Filter which LifeEvents to update
     */
    where?: LifeEventWhereInput
    /**
     * Limit how many LifeEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LifeEvent upsert
   */
  export type LifeEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * The filter to search for the LifeEvent to update in case it exists.
     */
    where: LifeEventWhereUniqueInput
    /**
     * In case the LifeEvent found by the `where` argument doesn't exist, create a new LifeEvent with this data.
     */
    create: XOR<LifeEventCreateInput, LifeEventUncheckedCreateInput>
    /**
     * In case the LifeEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LifeEventUpdateInput, LifeEventUncheckedUpdateInput>
  }

  /**
   * LifeEvent delete
   */
  export type LifeEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter which LifeEvent to delete.
     */
    where: LifeEventWhereUniqueInput
  }

  /**
   * LifeEvent deleteMany
   */
  export type LifeEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeEvents to delete
     */
    where?: LifeEventWhereInput
    /**
     * Limit how many LifeEvents to delete.
     */
    limit?: number
  }

  /**
   * LifeEvent without action
   */
  export type LifeEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LifeEvent
     */
    omit?: LifeEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
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


  export const ProfileScalarFieldEnum: {
    id: 'id',
    authUserId: 'authUserId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    birthDate: 'birthDate',
    lifeExpectancyYears: 'lifeExpectancyYears',
    baseCurrency: 'baseCurrency',
    riskProfile: 'riskProfile'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const LifeScenarioScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    name: 'name',
    description: 'description',
    isDefault: 'isDefault',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LifeScenarioScalarFieldEnum = (typeof LifeScenarioScalarFieldEnum)[keyof typeof LifeScenarioScalarFieldEnum]


  export const LifeMicroPlanScalarFieldEnum: {
    id: 'id',
    scenarioId: 'scenarioId',
    effectiveDate: 'effectiveDate',
    monthlyIncome: 'monthlyIncome',
    monthlyExpenses: 'monthlyExpenses',
    monthlyContribution: 'monthlyContribution',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LifeMicroPlanScalarFieldEnum = (typeof LifeMicroPlanScalarFieldEnum)[keyof typeof LifeMicroPlanScalarFieldEnum]


  export const LifeSettingsScalarFieldEnum: {
    id: 'id',
    scenarioId: 'scenarioId',
    baseNetWorth: 'baseNetWorth',
    baseMonthlyIncome: 'baseMonthlyIncome',
    baseMonthlyExpenses: 'baseMonthlyExpenses',
    monthlyContribution: 'monthlyContribution',
    expectedReturnYearly: 'expectedReturnYearly',
    inflationYearly: 'inflationYearly',
    inflateIncome: 'inflateIncome',
    inflateExpenses: 'inflateExpenses',
    retirementAge: 'retirementAge',
    retirementMonthlyIncome: 'retirementMonthlyIncome',
    inflateRetirementIncome: 'inflateRetirementIncome',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LifeSettingsScalarFieldEnum = (typeof LifeSettingsScalarFieldEnum)[keyof typeof LifeSettingsScalarFieldEnum]


  export const LifeEventScalarFieldEnum: {
    id: 'id',
    scenarioId: 'scenarioId',
    type: 'type',
    title: 'title',
    description: 'description',
    date: 'date',
    endDate: 'endDate',
    amount: 'amount',
    frequency: 'frequency',
    durationMonths: 'durationMonths',
    inflationIndexed: 'inflationIndexed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LifeEventScalarFieldEnum = (typeof LifeEventScalarFieldEnum)[keyof typeof LifeEventScalarFieldEnum]


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
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


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


  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: StringFilter<"Profile"> | string
    authUserId?: StringFilter<"Profile"> | string
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    birthDate?: DateTimeNullableFilter<"Profile"> | Date | string | null
    lifeExpectancyYears?: IntFilter<"Profile"> | number
    baseCurrency?: StringFilter<"Profile"> | string
    riskProfile?: StringNullableFilter<"Profile"> | string | null
    scenarios?: LifeScenarioListRelationFilter
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    authUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    lifeExpectancyYears?: SortOrder
    baseCurrency?: SortOrder
    riskProfile?: SortOrderInput | SortOrder
    scenarios?: LifeScenarioOrderByRelationAggregateInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    authUserId?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    birthDate?: DateTimeNullableFilter<"Profile"> | Date | string | null
    lifeExpectancyYears?: IntFilter<"Profile"> | number
    baseCurrency?: StringFilter<"Profile"> | string
    riskProfile?: StringNullableFilter<"Profile"> | string | null
    scenarios?: LifeScenarioListRelationFilter
  }, "id" | "authUserId">

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    authUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    lifeExpectancyYears?: SortOrder
    baseCurrency?: SortOrder
    riskProfile?: SortOrderInput | SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _avg?: ProfileAvgOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
    _sum?: ProfileSumOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Profile"> | string
    authUserId?: StringWithAggregatesFilter<"Profile"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    birthDate?: DateTimeNullableWithAggregatesFilter<"Profile"> | Date | string | null
    lifeExpectancyYears?: IntWithAggregatesFilter<"Profile"> | number
    baseCurrency?: StringWithAggregatesFilter<"Profile"> | string
    riskProfile?: StringNullableWithAggregatesFilter<"Profile"> | string | null
  }

  export type LifeScenarioWhereInput = {
    AND?: LifeScenarioWhereInput | LifeScenarioWhereInput[]
    OR?: LifeScenarioWhereInput[]
    NOT?: LifeScenarioWhereInput | LifeScenarioWhereInput[]
    id?: StringFilter<"LifeScenario"> | string
    profileId?: StringFilter<"LifeScenario"> | string
    name?: StringFilter<"LifeScenario"> | string
    description?: StringNullableFilter<"LifeScenario"> | string | null
    isDefault?: BoolFilter<"LifeScenario"> | boolean
    createdAt?: DateTimeFilter<"LifeScenario"> | Date | string
    updatedAt?: DateTimeFilter<"LifeScenario"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    settings?: XOR<LifeSettingsNullableScalarRelationFilter, LifeSettingsWhereInput> | null
    events?: LifeEventListRelationFilter
    microPlans?: LifeMicroPlanListRelationFilter
  }

  export type LifeScenarioOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
    settings?: LifeSettingsOrderByWithRelationInput
    events?: LifeEventOrderByRelationAggregateInput
    microPlans?: LifeMicroPlanOrderByRelationAggregateInput
  }

  export type LifeScenarioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LifeScenarioWhereInput | LifeScenarioWhereInput[]
    OR?: LifeScenarioWhereInput[]
    NOT?: LifeScenarioWhereInput | LifeScenarioWhereInput[]
    profileId?: StringFilter<"LifeScenario"> | string
    name?: StringFilter<"LifeScenario"> | string
    description?: StringNullableFilter<"LifeScenario"> | string | null
    isDefault?: BoolFilter<"LifeScenario"> | boolean
    createdAt?: DateTimeFilter<"LifeScenario"> | Date | string
    updatedAt?: DateTimeFilter<"LifeScenario"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    settings?: XOR<LifeSettingsNullableScalarRelationFilter, LifeSettingsWhereInput> | null
    events?: LifeEventListRelationFilter
    microPlans?: LifeMicroPlanListRelationFilter
  }, "id">

  export type LifeScenarioOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LifeScenarioCountOrderByAggregateInput
    _max?: LifeScenarioMaxOrderByAggregateInput
    _min?: LifeScenarioMinOrderByAggregateInput
  }

  export type LifeScenarioScalarWhereWithAggregatesInput = {
    AND?: LifeScenarioScalarWhereWithAggregatesInput | LifeScenarioScalarWhereWithAggregatesInput[]
    OR?: LifeScenarioScalarWhereWithAggregatesInput[]
    NOT?: LifeScenarioScalarWhereWithAggregatesInput | LifeScenarioScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LifeScenario"> | string
    profileId?: StringWithAggregatesFilter<"LifeScenario"> | string
    name?: StringWithAggregatesFilter<"LifeScenario"> | string
    description?: StringNullableWithAggregatesFilter<"LifeScenario"> | string | null
    isDefault?: BoolWithAggregatesFilter<"LifeScenario"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"LifeScenario"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LifeScenario"> | Date | string
  }

  export type LifeMicroPlanWhereInput = {
    AND?: LifeMicroPlanWhereInput | LifeMicroPlanWhereInput[]
    OR?: LifeMicroPlanWhereInput[]
    NOT?: LifeMicroPlanWhereInput | LifeMicroPlanWhereInput[]
    id?: StringFilter<"LifeMicroPlan"> | string
    scenarioId?: StringFilter<"LifeMicroPlan"> | string
    effectiveDate?: DateTimeFilter<"LifeMicroPlan"> | Date | string
    monthlyIncome?: FloatFilter<"LifeMicroPlan"> | number
    monthlyExpenses?: FloatFilter<"LifeMicroPlan"> | number
    monthlyContribution?: FloatFilter<"LifeMicroPlan"> | number
    createdAt?: DateTimeFilter<"LifeMicroPlan"> | Date | string
    updatedAt?: DateTimeFilter<"LifeMicroPlan"> | Date | string
    scenario?: XOR<LifeScenarioScalarRelationFilter, LifeScenarioWhereInput>
  }

  export type LifeMicroPlanOrderByWithRelationInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    effectiveDate?: SortOrder
    monthlyIncome?: SortOrder
    monthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scenario?: LifeScenarioOrderByWithRelationInput
  }

  export type LifeMicroPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LifeMicroPlanWhereInput | LifeMicroPlanWhereInput[]
    OR?: LifeMicroPlanWhereInput[]
    NOT?: LifeMicroPlanWhereInput | LifeMicroPlanWhereInput[]
    scenarioId?: StringFilter<"LifeMicroPlan"> | string
    effectiveDate?: DateTimeFilter<"LifeMicroPlan"> | Date | string
    monthlyIncome?: FloatFilter<"LifeMicroPlan"> | number
    monthlyExpenses?: FloatFilter<"LifeMicroPlan"> | number
    monthlyContribution?: FloatFilter<"LifeMicroPlan"> | number
    createdAt?: DateTimeFilter<"LifeMicroPlan"> | Date | string
    updatedAt?: DateTimeFilter<"LifeMicroPlan"> | Date | string
    scenario?: XOR<LifeScenarioScalarRelationFilter, LifeScenarioWhereInput>
  }, "id">

  export type LifeMicroPlanOrderByWithAggregationInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    effectiveDate?: SortOrder
    monthlyIncome?: SortOrder
    monthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LifeMicroPlanCountOrderByAggregateInput
    _avg?: LifeMicroPlanAvgOrderByAggregateInput
    _max?: LifeMicroPlanMaxOrderByAggregateInput
    _min?: LifeMicroPlanMinOrderByAggregateInput
    _sum?: LifeMicroPlanSumOrderByAggregateInput
  }

  export type LifeMicroPlanScalarWhereWithAggregatesInput = {
    AND?: LifeMicroPlanScalarWhereWithAggregatesInput | LifeMicroPlanScalarWhereWithAggregatesInput[]
    OR?: LifeMicroPlanScalarWhereWithAggregatesInput[]
    NOT?: LifeMicroPlanScalarWhereWithAggregatesInput | LifeMicroPlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LifeMicroPlan"> | string
    scenarioId?: StringWithAggregatesFilter<"LifeMicroPlan"> | string
    effectiveDate?: DateTimeWithAggregatesFilter<"LifeMicroPlan"> | Date | string
    monthlyIncome?: FloatWithAggregatesFilter<"LifeMicroPlan"> | number
    monthlyExpenses?: FloatWithAggregatesFilter<"LifeMicroPlan"> | number
    monthlyContribution?: FloatWithAggregatesFilter<"LifeMicroPlan"> | number
    createdAt?: DateTimeWithAggregatesFilter<"LifeMicroPlan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LifeMicroPlan"> | Date | string
  }

  export type LifeSettingsWhereInput = {
    AND?: LifeSettingsWhereInput | LifeSettingsWhereInput[]
    OR?: LifeSettingsWhereInput[]
    NOT?: LifeSettingsWhereInput | LifeSettingsWhereInput[]
    id?: StringFilter<"LifeSettings"> | string
    scenarioId?: StringFilter<"LifeSettings"> | string
    baseNetWorth?: FloatFilter<"LifeSettings"> | number
    baseMonthlyIncome?: FloatFilter<"LifeSettings"> | number
    baseMonthlyExpenses?: FloatFilter<"LifeSettings"> | number
    monthlyContribution?: FloatFilter<"LifeSettings"> | number
    expectedReturnYearly?: FloatFilter<"LifeSettings"> | number
    inflationYearly?: FloatFilter<"LifeSettings"> | number
    inflateIncome?: BoolFilter<"LifeSettings"> | boolean
    inflateExpenses?: BoolFilter<"LifeSettings"> | boolean
    retirementAge?: IntFilter<"LifeSettings"> | number
    retirementMonthlyIncome?: FloatFilter<"LifeSettings"> | number
    inflateRetirementIncome?: BoolFilter<"LifeSettings"> | boolean
    createdAt?: DateTimeFilter<"LifeSettings"> | Date | string
    updatedAt?: DateTimeFilter<"LifeSettings"> | Date | string
    scenario?: XOR<LifeScenarioScalarRelationFilter, LifeScenarioWhereInput>
  }

  export type LifeSettingsOrderByWithRelationInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    baseNetWorth?: SortOrder
    baseMonthlyIncome?: SortOrder
    baseMonthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    expectedReturnYearly?: SortOrder
    inflationYearly?: SortOrder
    inflateIncome?: SortOrder
    inflateExpenses?: SortOrder
    retirementAge?: SortOrder
    retirementMonthlyIncome?: SortOrder
    inflateRetirementIncome?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scenario?: LifeScenarioOrderByWithRelationInput
  }

  export type LifeSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    scenarioId?: string
    AND?: LifeSettingsWhereInput | LifeSettingsWhereInput[]
    OR?: LifeSettingsWhereInput[]
    NOT?: LifeSettingsWhereInput | LifeSettingsWhereInput[]
    baseNetWorth?: FloatFilter<"LifeSettings"> | number
    baseMonthlyIncome?: FloatFilter<"LifeSettings"> | number
    baseMonthlyExpenses?: FloatFilter<"LifeSettings"> | number
    monthlyContribution?: FloatFilter<"LifeSettings"> | number
    expectedReturnYearly?: FloatFilter<"LifeSettings"> | number
    inflationYearly?: FloatFilter<"LifeSettings"> | number
    inflateIncome?: BoolFilter<"LifeSettings"> | boolean
    inflateExpenses?: BoolFilter<"LifeSettings"> | boolean
    retirementAge?: IntFilter<"LifeSettings"> | number
    retirementMonthlyIncome?: FloatFilter<"LifeSettings"> | number
    inflateRetirementIncome?: BoolFilter<"LifeSettings"> | boolean
    createdAt?: DateTimeFilter<"LifeSettings"> | Date | string
    updatedAt?: DateTimeFilter<"LifeSettings"> | Date | string
    scenario?: XOR<LifeScenarioScalarRelationFilter, LifeScenarioWhereInput>
  }, "id" | "scenarioId">

  export type LifeSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    baseNetWorth?: SortOrder
    baseMonthlyIncome?: SortOrder
    baseMonthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    expectedReturnYearly?: SortOrder
    inflationYearly?: SortOrder
    inflateIncome?: SortOrder
    inflateExpenses?: SortOrder
    retirementAge?: SortOrder
    retirementMonthlyIncome?: SortOrder
    inflateRetirementIncome?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LifeSettingsCountOrderByAggregateInput
    _avg?: LifeSettingsAvgOrderByAggregateInput
    _max?: LifeSettingsMaxOrderByAggregateInput
    _min?: LifeSettingsMinOrderByAggregateInput
    _sum?: LifeSettingsSumOrderByAggregateInput
  }

  export type LifeSettingsScalarWhereWithAggregatesInput = {
    AND?: LifeSettingsScalarWhereWithAggregatesInput | LifeSettingsScalarWhereWithAggregatesInput[]
    OR?: LifeSettingsScalarWhereWithAggregatesInput[]
    NOT?: LifeSettingsScalarWhereWithAggregatesInput | LifeSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LifeSettings"> | string
    scenarioId?: StringWithAggregatesFilter<"LifeSettings"> | string
    baseNetWorth?: FloatWithAggregatesFilter<"LifeSettings"> | number
    baseMonthlyIncome?: FloatWithAggregatesFilter<"LifeSettings"> | number
    baseMonthlyExpenses?: FloatWithAggregatesFilter<"LifeSettings"> | number
    monthlyContribution?: FloatWithAggregatesFilter<"LifeSettings"> | number
    expectedReturnYearly?: FloatWithAggregatesFilter<"LifeSettings"> | number
    inflationYearly?: FloatWithAggregatesFilter<"LifeSettings"> | number
    inflateIncome?: BoolWithAggregatesFilter<"LifeSettings"> | boolean
    inflateExpenses?: BoolWithAggregatesFilter<"LifeSettings"> | boolean
    retirementAge?: IntWithAggregatesFilter<"LifeSettings"> | number
    retirementMonthlyIncome?: FloatWithAggregatesFilter<"LifeSettings"> | number
    inflateRetirementIncome?: BoolWithAggregatesFilter<"LifeSettings"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"LifeSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LifeSettings"> | Date | string
  }

  export type LifeEventWhereInput = {
    AND?: LifeEventWhereInput | LifeEventWhereInput[]
    OR?: LifeEventWhereInput[]
    NOT?: LifeEventWhereInput | LifeEventWhereInput[]
    id?: StringFilter<"LifeEvent"> | string
    scenarioId?: StringFilter<"LifeEvent"> | string
    type?: StringFilter<"LifeEvent"> | string
    title?: StringFilter<"LifeEvent"> | string
    description?: StringNullableFilter<"LifeEvent"> | string | null
    date?: DateTimeFilter<"LifeEvent"> | Date | string
    endDate?: DateTimeNullableFilter<"LifeEvent"> | Date | string | null
    amount?: FloatFilter<"LifeEvent"> | number
    frequency?: StringFilter<"LifeEvent"> | string
    durationMonths?: IntNullableFilter<"LifeEvent"> | number | null
    inflationIndexed?: BoolFilter<"LifeEvent"> | boolean
    createdAt?: DateTimeFilter<"LifeEvent"> | Date | string
    updatedAt?: DateTimeFilter<"LifeEvent"> | Date | string
    scenario?: XOR<LifeScenarioScalarRelationFilter, LifeScenarioWhereInput>
  }

  export type LifeEventOrderByWithRelationInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    date?: SortOrder
    endDate?: SortOrderInput | SortOrder
    amount?: SortOrder
    frequency?: SortOrder
    durationMonths?: SortOrderInput | SortOrder
    inflationIndexed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scenario?: LifeScenarioOrderByWithRelationInput
  }

  export type LifeEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LifeEventWhereInput | LifeEventWhereInput[]
    OR?: LifeEventWhereInput[]
    NOT?: LifeEventWhereInput | LifeEventWhereInput[]
    scenarioId?: StringFilter<"LifeEvent"> | string
    type?: StringFilter<"LifeEvent"> | string
    title?: StringFilter<"LifeEvent"> | string
    description?: StringNullableFilter<"LifeEvent"> | string | null
    date?: DateTimeFilter<"LifeEvent"> | Date | string
    endDate?: DateTimeNullableFilter<"LifeEvent"> | Date | string | null
    amount?: FloatFilter<"LifeEvent"> | number
    frequency?: StringFilter<"LifeEvent"> | string
    durationMonths?: IntNullableFilter<"LifeEvent"> | number | null
    inflationIndexed?: BoolFilter<"LifeEvent"> | boolean
    createdAt?: DateTimeFilter<"LifeEvent"> | Date | string
    updatedAt?: DateTimeFilter<"LifeEvent"> | Date | string
    scenario?: XOR<LifeScenarioScalarRelationFilter, LifeScenarioWhereInput>
  }, "id">

  export type LifeEventOrderByWithAggregationInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    date?: SortOrder
    endDate?: SortOrderInput | SortOrder
    amount?: SortOrder
    frequency?: SortOrder
    durationMonths?: SortOrderInput | SortOrder
    inflationIndexed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LifeEventCountOrderByAggregateInput
    _avg?: LifeEventAvgOrderByAggregateInput
    _max?: LifeEventMaxOrderByAggregateInput
    _min?: LifeEventMinOrderByAggregateInput
    _sum?: LifeEventSumOrderByAggregateInput
  }

  export type LifeEventScalarWhereWithAggregatesInput = {
    AND?: LifeEventScalarWhereWithAggregatesInput | LifeEventScalarWhereWithAggregatesInput[]
    OR?: LifeEventScalarWhereWithAggregatesInput[]
    NOT?: LifeEventScalarWhereWithAggregatesInput | LifeEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LifeEvent"> | string
    scenarioId?: StringWithAggregatesFilter<"LifeEvent"> | string
    type?: StringWithAggregatesFilter<"LifeEvent"> | string
    title?: StringWithAggregatesFilter<"LifeEvent"> | string
    description?: StringNullableWithAggregatesFilter<"LifeEvent"> | string | null
    date?: DateTimeWithAggregatesFilter<"LifeEvent"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"LifeEvent"> | Date | string | null
    amount?: FloatWithAggregatesFilter<"LifeEvent"> | number
    frequency?: StringWithAggregatesFilter<"LifeEvent"> | string
    durationMonths?: IntNullableWithAggregatesFilter<"LifeEvent"> | number | null
    inflationIndexed?: BoolWithAggregatesFilter<"LifeEvent"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"LifeEvent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LifeEvent"> | Date | string
  }

  export type ProfileCreateInput = {
    id?: string
    authUserId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    birthDate?: Date | string | null
    lifeExpectancyYears?: number
    baseCurrency?: string
    riskProfile?: string | null
    scenarios?: LifeScenarioCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateInput = {
    id?: string
    authUserId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    birthDate?: Date | string | null
    lifeExpectancyYears?: number
    baseCurrency?: string
    riskProfile?: string | null
    scenarios?: LifeScenarioUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lifeExpectancyYears?: IntFieldUpdateOperationsInput | number
    baseCurrency?: StringFieldUpdateOperationsInput | string
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    scenarios?: LifeScenarioUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lifeExpectancyYears?: IntFieldUpdateOperationsInput | number
    baseCurrency?: StringFieldUpdateOperationsInput | string
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
    scenarios?: LifeScenarioUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateManyInput = {
    id?: string
    authUserId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    birthDate?: Date | string | null
    lifeExpectancyYears?: number
    baseCurrency?: string
    riskProfile?: string | null
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lifeExpectancyYears?: IntFieldUpdateOperationsInput | number
    baseCurrency?: StringFieldUpdateOperationsInput | string
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lifeExpectancyYears?: IntFieldUpdateOperationsInput | number
    baseCurrency?: StringFieldUpdateOperationsInput | string
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LifeScenarioCreateInput = {
    id?: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutScenariosInput
    settings?: LifeSettingsCreateNestedOneWithoutScenarioInput
    events?: LifeEventCreateNestedManyWithoutScenarioInput
    microPlans?: LifeMicroPlanCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioUncheckedCreateInput = {
    id?: string
    profileId: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: LifeSettingsUncheckedCreateNestedOneWithoutScenarioInput
    events?: LifeEventUncheckedCreateNestedManyWithoutScenarioInput
    microPlans?: LifeMicroPlanUncheckedCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutScenariosNestedInput
    settings?: LifeSettingsUpdateOneWithoutScenarioNestedInput
    events?: LifeEventUpdateManyWithoutScenarioNestedInput
    microPlans?: LifeMicroPlanUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: LifeSettingsUncheckedUpdateOneWithoutScenarioNestedInput
    events?: LifeEventUncheckedUpdateManyWithoutScenarioNestedInput
    microPlans?: LifeMicroPlanUncheckedUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioCreateManyInput = {
    id?: string
    profileId: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeScenarioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeScenarioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeMicroPlanCreateInput = {
    id?: string
    effectiveDate: Date | string
    monthlyIncome?: number
    monthlyExpenses?: number
    monthlyContribution?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    scenario: LifeScenarioCreateNestedOneWithoutMicroPlansInput
  }

  export type LifeMicroPlanUncheckedCreateInput = {
    id?: string
    scenarioId: string
    effectiveDate: Date | string
    monthlyIncome?: number
    monthlyExpenses?: number
    monthlyContribution?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeMicroPlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyIncome?: FloatFieldUpdateOperationsInput | number
    monthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scenario?: LifeScenarioUpdateOneRequiredWithoutMicroPlansNestedInput
  }

  export type LifeMicroPlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    scenarioId?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyIncome?: FloatFieldUpdateOperationsInput | number
    monthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeMicroPlanCreateManyInput = {
    id?: string
    scenarioId: string
    effectiveDate: Date | string
    monthlyIncome?: number
    monthlyExpenses?: number
    monthlyContribution?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeMicroPlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyIncome?: FloatFieldUpdateOperationsInput | number
    monthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeMicroPlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    scenarioId?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyIncome?: FloatFieldUpdateOperationsInput | number
    monthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeSettingsCreateInput = {
    id?: string
    baseNetWorth?: number
    baseMonthlyIncome?: number
    baseMonthlyExpenses?: number
    monthlyContribution?: number
    expectedReturnYearly?: number
    inflationYearly?: number
    inflateIncome?: boolean
    inflateExpenses?: boolean
    retirementAge?: number
    retirementMonthlyIncome?: number
    inflateRetirementIncome?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    scenario: LifeScenarioCreateNestedOneWithoutSettingsInput
  }

  export type LifeSettingsUncheckedCreateInput = {
    id?: string
    scenarioId: string
    baseNetWorth?: number
    baseMonthlyIncome?: number
    baseMonthlyExpenses?: number
    monthlyContribution?: number
    expectedReturnYearly?: number
    inflationYearly?: number
    inflateIncome?: boolean
    inflateExpenses?: boolean
    retirementAge?: number
    retirementMonthlyIncome?: number
    inflateRetirementIncome?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseNetWorth?: FloatFieldUpdateOperationsInput | number
    baseMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    baseMonthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    expectedReturnYearly?: FloatFieldUpdateOperationsInput | number
    inflationYearly?: FloatFieldUpdateOperationsInput | number
    inflateIncome?: BoolFieldUpdateOperationsInput | boolean
    inflateExpenses?: BoolFieldUpdateOperationsInput | boolean
    retirementAge?: IntFieldUpdateOperationsInput | number
    retirementMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    inflateRetirementIncome?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scenario?: LifeScenarioUpdateOneRequiredWithoutSettingsNestedInput
  }

  export type LifeSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    scenarioId?: StringFieldUpdateOperationsInput | string
    baseNetWorth?: FloatFieldUpdateOperationsInput | number
    baseMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    baseMonthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    expectedReturnYearly?: FloatFieldUpdateOperationsInput | number
    inflationYearly?: FloatFieldUpdateOperationsInput | number
    inflateIncome?: BoolFieldUpdateOperationsInput | boolean
    inflateExpenses?: BoolFieldUpdateOperationsInput | boolean
    retirementAge?: IntFieldUpdateOperationsInput | number
    retirementMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    inflateRetirementIncome?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeSettingsCreateManyInput = {
    id?: string
    scenarioId: string
    baseNetWorth?: number
    baseMonthlyIncome?: number
    baseMonthlyExpenses?: number
    monthlyContribution?: number
    expectedReturnYearly?: number
    inflationYearly?: number
    inflateIncome?: boolean
    inflateExpenses?: boolean
    retirementAge?: number
    retirementMonthlyIncome?: number
    inflateRetirementIncome?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseNetWorth?: FloatFieldUpdateOperationsInput | number
    baseMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    baseMonthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    expectedReturnYearly?: FloatFieldUpdateOperationsInput | number
    inflationYearly?: FloatFieldUpdateOperationsInput | number
    inflateIncome?: BoolFieldUpdateOperationsInput | boolean
    inflateExpenses?: BoolFieldUpdateOperationsInput | boolean
    retirementAge?: IntFieldUpdateOperationsInput | number
    retirementMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    inflateRetirementIncome?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    scenarioId?: StringFieldUpdateOperationsInput | string
    baseNetWorth?: FloatFieldUpdateOperationsInput | number
    baseMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    baseMonthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    expectedReturnYearly?: FloatFieldUpdateOperationsInput | number
    inflationYearly?: FloatFieldUpdateOperationsInput | number
    inflateIncome?: BoolFieldUpdateOperationsInput | boolean
    inflateExpenses?: BoolFieldUpdateOperationsInput | boolean
    retirementAge?: IntFieldUpdateOperationsInput | number
    retirementMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    inflateRetirementIncome?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventCreateInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    endDate?: Date | string | null
    amount: number
    frequency?: string
    durationMonths?: number | null
    inflationIndexed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    scenario: LifeScenarioCreateNestedOneWithoutEventsInput
  }

  export type LifeEventUncheckedCreateInput = {
    id?: string
    scenarioId: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    endDate?: Date | string | null
    amount: number
    frequency?: string
    durationMonths?: number | null
    inflationIndexed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    frequency?: StringFieldUpdateOperationsInput | string
    durationMonths?: NullableIntFieldUpdateOperationsInput | number | null
    inflationIndexed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scenario?: LifeScenarioUpdateOneRequiredWithoutEventsNestedInput
  }

  export type LifeEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    scenarioId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    frequency?: StringFieldUpdateOperationsInput | string
    durationMonths?: NullableIntFieldUpdateOperationsInput | number | null
    inflationIndexed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventCreateManyInput = {
    id?: string
    scenarioId: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    endDate?: Date | string | null
    amount: number
    frequency?: string
    durationMonths?: number | null
    inflationIndexed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    frequency?: StringFieldUpdateOperationsInput | string
    durationMonths?: NullableIntFieldUpdateOperationsInput | number | null
    inflationIndexed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    scenarioId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    frequency?: StringFieldUpdateOperationsInput | string
    durationMonths?: NullableIntFieldUpdateOperationsInput | number | null
    inflationIndexed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type LifeScenarioListRelationFilter = {
    every?: LifeScenarioWhereInput
    some?: LifeScenarioWhereInput
    none?: LifeScenarioWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LifeScenarioOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    authUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    birthDate?: SortOrder
    lifeExpectancyYears?: SortOrder
    baseCurrency?: SortOrder
    riskProfile?: SortOrder
  }

  export type ProfileAvgOrderByAggregateInput = {
    lifeExpectancyYears?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    authUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    birthDate?: SortOrder
    lifeExpectancyYears?: SortOrder
    baseCurrency?: SortOrder
    riskProfile?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    authUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    birthDate?: SortOrder
    lifeExpectancyYears?: SortOrder
    baseCurrency?: SortOrder
    riskProfile?: SortOrder
  }

  export type ProfileSumOrderByAggregateInput = {
    lifeExpectancyYears?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ProfileScalarRelationFilter = {
    is?: ProfileWhereInput
    isNot?: ProfileWhereInput
  }

  export type LifeSettingsNullableScalarRelationFilter = {
    is?: LifeSettingsWhereInput | null
    isNot?: LifeSettingsWhereInput | null
  }

  export type LifeEventListRelationFilter = {
    every?: LifeEventWhereInput
    some?: LifeEventWhereInput
    none?: LifeEventWhereInput
  }

  export type LifeMicroPlanListRelationFilter = {
    every?: LifeMicroPlanWhereInput
    some?: LifeMicroPlanWhereInput
    none?: LifeMicroPlanWhereInput
  }

  export type LifeEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LifeMicroPlanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LifeScenarioCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeScenarioMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeScenarioMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type LifeScenarioScalarRelationFilter = {
    is?: LifeScenarioWhereInput
    isNot?: LifeScenarioWhereInput
  }

  export type LifeMicroPlanCountOrderByAggregateInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    effectiveDate?: SortOrder
    monthlyIncome?: SortOrder
    monthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeMicroPlanAvgOrderByAggregateInput = {
    monthlyIncome?: SortOrder
    monthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
  }

  export type LifeMicroPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    effectiveDate?: SortOrder
    monthlyIncome?: SortOrder
    monthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeMicroPlanMinOrderByAggregateInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    effectiveDate?: SortOrder
    monthlyIncome?: SortOrder
    monthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeMicroPlanSumOrderByAggregateInput = {
    monthlyIncome?: SortOrder
    monthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type LifeSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    baseNetWorth?: SortOrder
    baseMonthlyIncome?: SortOrder
    baseMonthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    expectedReturnYearly?: SortOrder
    inflationYearly?: SortOrder
    inflateIncome?: SortOrder
    inflateExpenses?: SortOrder
    retirementAge?: SortOrder
    retirementMonthlyIncome?: SortOrder
    inflateRetirementIncome?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeSettingsAvgOrderByAggregateInput = {
    baseNetWorth?: SortOrder
    baseMonthlyIncome?: SortOrder
    baseMonthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    expectedReturnYearly?: SortOrder
    inflationYearly?: SortOrder
    retirementAge?: SortOrder
    retirementMonthlyIncome?: SortOrder
  }

  export type LifeSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    baseNetWorth?: SortOrder
    baseMonthlyIncome?: SortOrder
    baseMonthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    expectedReturnYearly?: SortOrder
    inflationYearly?: SortOrder
    inflateIncome?: SortOrder
    inflateExpenses?: SortOrder
    retirementAge?: SortOrder
    retirementMonthlyIncome?: SortOrder
    inflateRetirementIncome?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    baseNetWorth?: SortOrder
    baseMonthlyIncome?: SortOrder
    baseMonthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    expectedReturnYearly?: SortOrder
    inflationYearly?: SortOrder
    inflateIncome?: SortOrder
    inflateExpenses?: SortOrder
    retirementAge?: SortOrder
    retirementMonthlyIncome?: SortOrder
    inflateRetirementIncome?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeSettingsSumOrderByAggregateInput = {
    baseNetWorth?: SortOrder
    baseMonthlyIncome?: SortOrder
    baseMonthlyExpenses?: SortOrder
    monthlyContribution?: SortOrder
    expectedReturnYearly?: SortOrder
    inflationYearly?: SortOrder
    retirementAge?: SortOrder
    retirementMonthlyIncome?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type LifeEventCountOrderByAggregateInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    endDate?: SortOrder
    amount?: SortOrder
    frequency?: SortOrder
    durationMonths?: SortOrder
    inflationIndexed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeEventAvgOrderByAggregateInput = {
    amount?: SortOrder
    durationMonths?: SortOrder
  }

  export type LifeEventMaxOrderByAggregateInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    endDate?: SortOrder
    amount?: SortOrder
    frequency?: SortOrder
    durationMonths?: SortOrder
    inflationIndexed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeEventMinOrderByAggregateInput = {
    id?: SortOrder
    scenarioId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    endDate?: SortOrder
    amount?: SortOrder
    frequency?: SortOrder
    durationMonths?: SortOrder
    inflationIndexed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LifeEventSumOrderByAggregateInput = {
    amount?: SortOrder
    durationMonths?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type LifeScenarioCreateNestedManyWithoutProfileInput = {
    create?: XOR<LifeScenarioCreateWithoutProfileInput, LifeScenarioUncheckedCreateWithoutProfileInput> | LifeScenarioCreateWithoutProfileInput[] | LifeScenarioUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutProfileInput | LifeScenarioCreateOrConnectWithoutProfileInput[]
    createMany?: LifeScenarioCreateManyProfileInputEnvelope
    connect?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
  }

  export type LifeScenarioUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<LifeScenarioCreateWithoutProfileInput, LifeScenarioUncheckedCreateWithoutProfileInput> | LifeScenarioCreateWithoutProfileInput[] | LifeScenarioUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutProfileInput | LifeScenarioCreateOrConnectWithoutProfileInput[]
    createMany?: LifeScenarioCreateManyProfileInputEnvelope
    connect?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type LifeScenarioUpdateManyWithoutProfileNestedInput = {
    create?: XOR<LifeScenarioCreateWithoutProfileInput, LifeScenarioUncheckedCreateWithoutProfileInput> | LifeScenarioCreateWithoutProfileInput[] | LifeScenarioUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutProfileInput | LifeScenarioCreateOrConnectWithoutProfileInput[]
    upsert?: LifeScenarioUpsertWithWhereUniqueWithoutProfileInput | LifeScenarioUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: LifeScenarioCreateManyProfileInputEnvelope
    set?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
    disconnect?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
    delete?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
    connect?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
    update?: LifeScenarioUpdateWithWhereUniqueWithoutProfileInput | LifeScenarioUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: LifeScenarioUpdateManyWithWhereWithoutProfileInput | LifeScenarioUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: LifeScenarioScalarWhereInput | LifeScenarioScalarWhereInput[]
  }

  export type LifeScenarioUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<LifeScenarioCreateWithoutProfileInput, LifeScenarioUncheckedCreateWithoutProfileInput> | LifeScenarioCreateWithoutProfileInput[] | LifeScenarioUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutProfileInput | LifeScenarioCreateOrConnectWithoutProfileInput[]
    upsert?: LifeScenarioUpsertWithWhereUniqueWithoutProfileInput | LifeScenarioUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: LifeScenarioCreateManyProfileInputEnvelope
    set?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
    disconnect?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
    delete?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
    connect?: LifeScenarioWhereUniqueInput | LifeScenarioWhereUniqueInput[]
    update?: LifeScenarioUpdateWithWhereUniqueWithoutProfileInput | LifeScenarioUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: LifeScenarioUpdateManyWithWhereWithoutProfileInput | LifeScenarioUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: LifeScenarioScalarWhereInput | LifeScenarioScalarWhereInput[]
  }

  export type ProfileCreateNestedOneWithoutScenariosInput = {
    create?: XOR<ProfileCreateWithoutScenariosInput, ProfileUncheckedCreateWithoutScenariosInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutScenariosInput
    connect?: ProfileWhereUniqueInput
  }

  export type LifeSettingsCreateNestedOneWithoutScenarioInput = {
    create?: XOR<LifeSettingsCreateWithoutScenarioInput, LifeSettingsUncheckedCreateWithoutScenarioInput>
    connectOrCreate?: LifeSettingsCreateOrConnectWithoutScenarioInput
    connect?: LifeSettingsWhereUniqueInput
  }

  export type LifeEventCreateNestedManyWithoutScenarioInput = {
    create?: XOR<LifeEventCreateWithoutScenarioInput, LifeEventUncheckedCreateWithoutScenarioInput> | LifeEventCreateWithoutScenarioInput[] | LifeEventUncheckedCreateWithoutScenarioInput[]
    connectOrCreate?: LifeEventCreateOrConnectWithoutScenarioInput | LifeEventCreateOrConnectWithoutScenarioInput[]
    createMany?: LifeEventCreateManyScenarioInputEnvelope
    connect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
  }

  export type LifeMicroPlanCreateNestedManyWithoutScenarioInput = {
    create?: XOR<LifeMicroPlanCreateWithoutScenarioInput, LifeMicroPlanUncheckedCreateWithoutScenarioInput> | LifeMicroPlanCreateWithoutScenarioInput[] | LifeMicroPlanUncheckedCreateWithoutScenarioInput[]
    connectOrCreate?: LifeMicroPlanCreateOrConnectWithoutScenarioInput | LifeMicroPlanCreateOrConnectWithoutScenarioInput[]
    createMany?: LifeMicroPlanCreateManyScenarioInputEnvelope
    connect?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
  }

  export type LifeSettingsUncheckedCreateNestedOneWithoutScenarioInput = {
    create?: XOR<LifeSettingsCreateWithoutScenarioInput, LifeSettingsUncheckedCreateWithoutScenarioInput>
    connectOrCreate?: LifeSettingsCreateOrConnectWithoutScenarioInput
    connect?: LifeSettingsWhereUniqueInput
  }

  export type LifeEventUncheckedCreateNestedManyWithoutScenarioInput = {
    create?: XOR<LifeEventCreateWithoutScenarioInput, LifeEventUncheckedCreateWithoutScenarioInput> | LifeEventCreateWithoutScenarioInput[] | LifeEventUncheckedCreateWithoutScenarioInput[]
    connectOrCreate?: LifeEventCreateOrConnectWithoutScenarioInput | LifeEventCreateOrConnectWithoutScenarioInput[]
    createMany?: LifeEventCreateManyScenarioInputEnvelope
    connect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
  }

  export type LifeMicroPlanUncheckedCreateNestedManyWithoutScenarioInput = {
    create?: XOR<LifeMicroPlanCreateWithoutScenarioInput, LifeMicroPlanUncheckedCreateWithoutScenarioInput> | LifeMicroPlanCreateWithoutScenarioInput[] | LifeMicroPlanUncheckedCreateWithoutScenarioInput[]
    connectOrCreate?: LifeMicroPlanCreateOrConnectWithoutScenarioInput | LifeMicroPlanCreateOrConnectWithoutScenarioInput[]
    createMany?: LifeMicroPlanCreateManyScenarioInputEnvelope
    connect?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProfileUpdateOneRequiredWithoutScenariosNestedInput = {
    create?: XOR<ProfileCreateWithoutScenariosInput, ProfileUncheckedCreateWithoutScenariosInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutScenariosInput
    upsert?: ProfileUpsertWithoutScenariosInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutScenariosInput, ProfileUpdateWithoutScenariosInput>, ProfileUncheckedUpdateWithoutScenariosInput>
  }

  export type LifeSettingsUpdateOneWithoutScenarioNestedInput = {
    create?: XOR<LifeSettingsCreateWithoutScenarioInput, LifeSettingsUncheckedCreateWithoutScenarioInput>
    connectOrCreate?: LifeSettingsCreateOrConnectWithoutScenarioInput
    upsert?: LifeSettingsUpsertWithoutScenarioInput
    disconnect?: LifeSettingsWhereInput | boolean
    delete?: LifeSettingsWhereInput | boolean
    connect?: LifeSettingsWhereUniqueInput
    update?: XOR<XOR<LifeSettingsUpdateToOneWithWhereWithoutScenarioInput, LifeSettingsUpdateWithoutScenarioInput>, LifeSettingsUncheckedUpdateWithoutScenarioInput>
  }

  export type LifeEventUpdateManyWithoutScenarioNestedInput = {
    create?: XOR<LifeEventCreateWithoutScenarioInput, LifeEventUncheckedCreateWithoutScenarioInput> | LifeEventCreateWithoutScenarioInput[] | LifeEventUncheckedCreateWithoutScenarioInput[]
    connectOrCreate?: LifeEventCreateOrConnectWithoutScenarioInput | LifeEventCreateOrConnectWithoutScenarioInput[]
    upsert?: LifeEventUpsertWithWhereUniqueWithoutScenarioInput | LifeEventUpsertWithWhereUniqueWithoutScenarioInput[]
    createMany?: LifeEventCreateManyScenarioInputEnvelope
    set?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    disconnect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    delete?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    connect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    update?: LifeEventUpdateWithWhereUniqueWithoutScenarioInput | LifeEventUpdateWithWhereUniqueWithoutScenarioInput[]
    updateMany?: LifeEventUpdateManyWithWhereWithoutScenarioInput | LifeEventUpdateManyWithWhereWithoutScenarioInput[]
    deleteMany?: LifeEventScalarWhereInput | LifeEventScalarWhereInput[]
  }

  export type LifeMicroPlanUpdateManyWithoutScenarioNestedInput = {
    create?: XOR<LifeMicroPlanCreateWithoutScenarioInput, LifeMicroPlanUncheckedCreateWithoutScenarioInput> | LifeMicroPlanCreateWithoutScenarioInput[] | LifeMicroPlanUncheckedCreateWithoutScenarioInput[]
    connectOrCreate?: LifeMicroPlanCreateOrConnectWithoutScenarioInput | LifeMicroPlanCreateOrConnectWithoutScenarioInput[]
    upsert?: LifeMicroPlanUpsertWithWhereUniqueWithoutScenarioInput | LifeMicroPlanUpsertWithWhereUniqueWithoutScenarioInput[]
    createMany?: LifeMicroPlanCreateManyScenarioInputEnvelope
    set?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
    disconnect?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
    delete?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
    connect?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
    update?: LifeMicroPlanUpdateWithWhereUniqueWithoutScenarioInput | LifeMicroPlanUpdateWithWhereUniqueWithoutScenarioInput[]
    updateMany?: LifeMicroPlanUpdateManyWithWhereWithoutScenarioInput | LifeMicroPlanUpdateManyWithWhereWithoutScenarioInput[]
    deleteMany?: LifeMicroPlanScalarWhereInput | LifeMicroPlanScalarWhereInput[]
  }

  export type LifeSettingsUncheckedUpdateOneWithoutScenarioNestedInput = {
    create?: XOR<LifeSettingsCreateWithoutScenarioInput, LifeSettingsUncheckedCreateWithoutScenarioInput>
    connectOrCreate?: LifeSettingsCreateOrConnectWithoutScenarioInput
    upsert?: LifeSettingsUpsertWithoutScenarioInput
    disconnect?: LifeSettingsWhereInput | boolean
    delete?: LifeSettingsWhereInput | boolean
    connect?: LifeSettingsWhereUniqueInput
    update?: XOR<XOR<LifeSettingsUpdateToOneWithWhereWithoutScenarioInput, LifeSettingsUpdateWithoutScenarioInput>, LifeSettingsUncheckedUpdateWithoutScenarioInput>
  }

  export type LifeEventUncheckedUpdateManyWithoutScenarioNestedInput = {
    create?: XOR<LifeEventCreateWithoutScenarioInput, LifeEventUncheckedCreateWithoutScenarioInput> | LifeEventCreateWithoutScenarioInput[] | LifeEventUncheckedCreateWithoutScenarioInput[]
    connectOrCreate?: LifeEventCreateOrConnectWithoutScenarioInput | LifeEventCreateOrConnectWithoutScenarioInput[]
    upsert?: LifeEventUpsertWithWhereUniqueWithoutScenarioInput | LifeEventUpsertWithWhereUniqueWithoutScenarioInput[]
    createMany?: LifeEventCreateManyScenarioInputEnvelope
    set?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    disconnect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    delete?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    connect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    update?: LifeEventUpdateWithWhereUniqueWithoutScenarioInput | LifeEventUpdateWithWhereUniqueWithoutScenarioInput[]
    updateMany?: LifeEventUpdateManyWithWhereWithoutScenarioInput | LifeEventUpdateManyWithWhereWithoutScenarioInput[]
    deleteMany?: LifeEventScalarWhereInput | LifeEventScalarWhereInput[]
  }

  export type LifeMicroPlanUncheckedUpdateManyWithoutScenarioNestedInput = {
    create?: XOR<LifeMicroPlanCreateWithoutScenarioInput, LifeMicroPlanUncheckedCreateWithoutScenarioInput> | LifeMicroPlanCreateWithoutScenarioInput[] | LifeMicroPlanUncheckedCreateWithoutScenarioInput[]
    connectOrCreate?: LifeMicroPlanCreateOrConnectWithoutScenarioInput | LifeMicroPlanCreateOrConnectWithoutScenarioInput[]
    upsert?: LifeMicroPlanUpsertWithWhereUniqueWithoutScenarioInput | LifeMicroPlanUpsertWithWhereUniqueWithoutScenarioInput[]
    createMany?: LifeMicroPlanCreateManyScenarioInputEnvelope
    set?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
    disconnect?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
    delete?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
    connect?: LifeMicroPlanWhereUniqueInput | LifeMicroPlanWhereUniqueInput[]
    update?: LifeMicroPlanUpdateWithWhereUniqueWithoutScenarioInput | LifeMicroPlanUpdateWithWhereUniqueWithoutScenarioInput[]
    updateMany?: LifeMicroPlanUpdateManyWithWhereWithoutScenarioInput | LifeMicroPlanUpdateManyWithWhereWithoutScenarioInput[]
    deleteMany?: LifeMicroPlanScalarWhereInput | LifeMicroPlanScalarWhereInput[]
  }

  export type LifeScenarioCreateNestedOneWithoutMicroPlansInput = {
    create?: XOR<LifeScenarioCreateWithoutMicroPlansInput, LifeScenarioUncheckedCreateWithoutMicroPlansInput>
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutMicroPlansInput
    connect?: LifeScenarioWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LifeScenarioUpdateOneRequiredWithoutMicroPlansNestedInput = {
    create?: XOR<LifeScenarioCreateWithoutMicroPlansInput, LifeScenarioUncheckedCreateWithoutMicroPlansInput>
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutMicroPlansInput
    upsert?: LifeScenarioUpsertWithoutMicroPlansInput
    connect?: LifeScenarioWhereUniqueInput
    update?: XOR<XOR<LifeScenarioUpdateToOneWithWhereWithoutMicroPlansInput, LifeScenarioUpdateWithoutMicroPlansInput>, LifeScenarioUncheckedUpdateWithoutMicroPlansInput>
  }

  export type LifeScenarioCreateNestedOneWithoutSettingsInput = {
    create?: XOR<LifeScenarioCreateWithoutSettingsInput, LifeScenarioUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutSettingsInput
    connect?: LifeScenarioWhereUniqueInput
  }

  export type LifeScenarioUpdateOneRequiredWithoutSettingsNestedInput = {
    create?: XOR<LifeScenarioCreateWithoutSettingsInput, LifeScenarioUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutSettingsInput
    upsert?: LifeScenarioUpsertWithoutSettingsInput
    connect?: LifeScenarioWhereUniqueInput
    update?: XOR<XOR<LifeScenarioUpdateToOneWithWhereWithoutSettingsInput, LifeScenarioUpdateWithoutSettingsInput>, LifeScenarioUncheckedUpdateWithoutSettingsInput>
  }

  export type LifeScenarioCreateNestedOneWithoutEventsInput = {
    create?: XOR<LifeScenarioCreateWithoutEventsInput, LifeScenarioUncheckedCreateWithoutEventsInput>
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutEventsInput
    connect?: LifeScenarioWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LifeScenarioUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<LifeScenarioCreateWithoutEventsInput, LifeScenarioUncheckedCreateWithoutEventsInput>
    connectOrCreate?: LifeScenarioCreateOrConnectWithoutEventsInput
    upsert?: LifeScenarioUpsertWithoutEventsInput
    connect?: LifeScenarioWhereUniqueInput
    update?: XOR<XOR<LifeScenarioUpdateToOneWithWhereWithoutEventsInput, LifeScenarioUpdateWithoutEventsInput>, LifeScenarioUncheckedUpdateWithoutEventsInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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

  export type LifeScenarioCreateWithoutProfileInput = {
    id?: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: LifeSettingsCreateNestedOneWithoutScenarioInput
    events?: LifeEventCreateNestedManyWithoutScenarioInput
    microPlans?: LifeMicroPlanCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioUncheckedCreateWithoutProfileInput = {
    id?: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: LifeSettingsUncheckedCreateNestedOneWithoutScenarioInput
    events?: LifeEventUncheckedCreateNestedManyWithoutScenarioInput
    microPlans?: LifeMicroPlanUncheckedCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioCreateOrConnectWithoutProfileInput = {
    where: LifeScenarioWhereUniqueInput
    create: XOR<LifeScenarioCreateWithoutProfileInput, LifeScenarioUncheckedCreateWithoutProfileInput>
  }

  export type LifeScenarioCreateManyProfileInputEnvelope = {
    data: LifeScenarioCreateManyProfileInput | LifeScenarioCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type LifeScenarioUpsertWithWhereUniqueWithoutProfileInput = {
    where: LifeScenarioWhereUniqueInput
    update: XOR<LifeScenarioUpdateWithoutProfileInput, LifeScenarioUncheckedUpdateWithoutProfileInput>
    create: XOR<LifeScenarioCreateWithoutProfileInput, LifeScenarioUncheckedCreateWithoutProfileInput>
  }

  export type LifeScenarioUpdateWithWhereUniqueWithoutProfileInput = {
    where: LifeScenarioWhereUniqueInput
    data: XOR<LifeScenarioUpdateWithoutProfileInput, LifeScenarioUncheckedUpdateWithoutProfileInput>
  }

  export type LifeScenarioUpdateManyWithWhereWithoutProfileInput = {
    where: LifeScenarioScalarWhereInput
    data: XOR<LifeScenarioUpdateManyMutationInput, LifeScenarioUncheckedUpdateManyWithoutProfileInput>
  }

  export type LifeScenarioScalarWhereInput = {
    AND?: LifeScenarioScalarWhereInput | LifeScenarioScalarWhereInput[]
    OR?: LifeScenarioScalarWhereInput[]
    NOT?: LifeScenarioScalarWhereInput | LifeScenarioScalarWhereInput[]
    id?: StringFilter<"LifeScenario"> | string
    profileId?: StringFilter<"LifeScenario"> | string
    name?: StringFilter<"LifeScenario"> | string
    description?: StringNullableFilter<"LifeScenario"> | string | null
    isDefault?: BoolFilter<"LifeScenario"> | boolean
    createdAt?: DateTimeFilter<"LifeScenario"> | Date | string
    updatedAt?: DateTimeFilter<"LifeScenario"> | Date | string
  }

  export type ProfileCreateWithoutScenariosInput = {
    id?: string
    authUserId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    birthDate?: Date | string | null
    lifeExpectancyYears?: number
    baseCurrency?: string
    riskProfile?: string | null
  }

  export type ProfileUncheckedCreateWithoutScenariosInput = {
    id?: string
    authUserId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    birthDate?: Date | string | null
    lifeExpectancyYears?: number
    baseCurrency?: string
    riskProfile?: string | null
  }

  export type ProfileCreateOrConnectWithoutScenariosInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutScenariosInput, ProfileUncheckedCreateWithoutScenariosInput>
  }

  export type LifeSettingsCreateWithoutScenarioInput = {
    id?: string
    baseNetWorth?: number
    baseMonthlyIncome?: number
    baseMonthlyExpenses?: number
    monthlyContribution?: number
    expectedReturnYearly?: number
    inflationYearly?: number
    inflateIncome?: boolean
    inflateExpenses?: boolean
    retirementAge?: number
    retirementMonthlyIncome?: number
    inflateRetirementIncome?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeSettingsUncheckedCreateWithoutScenarioInput = {
    id?: string
    baseNetWorth?: number
    baseMonthlyIncome?: number
    baseMonthlyExpenses?: number
    monthlyContribution?: number
    expectedReturnYearly?: number
    inflationYearly?: number
    inflateIncome?: boolean
    inflateExpenses?: boolean
    retirementAge?: number
    retirementMonthlyIncome?: number
    inflateRetirementIncome?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeSettingsCreateOrConnectWithoutScenarioInput = {
    where: LifeSettingsWhereUniqueInput
    create: XOR<LifeSettingsCreateWithoutScenarioInput, LifeSettingsUncheckedCreateWithoutScenarioInput>
  }

  export type LifeEventCreateWithoutScenarioInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    endDate?: Date | string | null
    amount: number
    frequency?: string
    durationMonths?: number | null
    inflationIndexed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeEventUncheckedCreateWithoutScenarioInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    endDate?: Date | string | null
    amount: number
    frequency?: string
    durationMonths?: number | null
    inflationIndexed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeEventCreateOrConnectWithoutScenarioInput = {
    where: LifeEventWhereUniqueInput
    create: XOR<LifeEventCreateWithoutScenarioInput, LifeEventUncheckedCreateWithoutScenarioInput>
  }

  export type LifeEventCreateManyScenarioInputEnvelope = {
    data: LifeEventCreateManyScenarioInput | LifeEventCreateManyScenarioInput[]
    skipDuplicates?: boolean
  }

  export type LifeMicroPlanCreateWithoutScenarioInput = {
    id?: string
    effectiveDate: Date | string
    monthlyIncome?: number
    monthlyExpenses?: number
    monthlyContribution?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeMicroPlanUncheckedCreateWithoutScenarioInput = {
    id?: string
    effectiveDate: Date | string
    monthlyIncome?: number
    monthlyExpenses?: number
    monthlyContribution?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeMicroPlanCreateOrConnectWithoutScenarioInput = {
    where: LifeMicroPlanWhereUniqueInput
    create: XOR<LifeMicroPlanCreateWithoutScenarioInput, LifeMicroPlanUncheckedCreateWithoutScenarioInput>
  }

  export type LifeMicroPlanCreateManyScenarioInputEnvelope = {
    data: LifeMicroPlanCreateManyScenarioInput | LifeMicroPlanCreateManyScenarioInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpsertWithoutScenariosInput = {
    update: XOR<ProfileUpdateWithoutScenariosInput, ProfileUncheckedUpdateWithoutScenariosInput>
    create: XOR<ProfileCreateWithoutScenariosInput, ProfileUncheckedCreateWithoutScenariosInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutScenariosInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutScenariosInput, ProfileUncheckedUpdateWithoutScenariosInput>
  }

  export type ProfileUpdateWithoutScenariosInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lifeExpectancyYears?: IntFieldUpdateOperationsInput | number
    baseCurrency?: StringFieldUpdateOperationsInput | string
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProfileUncheckedUpdateWithoutScenariosInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lifeExpectancyYears?: IntFieldUpdateOperationsInput | number
    baseCurrency?: StringFieldUpdateOperationsInput | string
    riskProfile?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LifeSettingsUpsertWithoutScenarioInput = {
    update: XOR<LifeSettingsUpdateWithoutScenarioInput, LifeSettingsUncheckedUpdateWithoutScenarioInput>
    create: XOR<LifeSettingsCreateWithoutScenarioInput, LifeSettingsUncheckedCreateWithoutScenarioInput>
    where?: LifeSettingsWhereInput
  }

  export type LifeSettingsUpdateToOneWithWhereWithoutScenarioInput = {
    where?: LifeSettingsWhereInput
    data: XOR<LifeSettingsUpdateWithoutScenarioInput, LifeSettingsUncheckedUpdateWithoutScenarioInput>
  }

  export type LifeSettingsUpdateWithoutScenarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseNetWorth?: FloatFieldUpdateOperationsInput | number
    baseMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    baseMonthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    expectedReturnYearly?: FloatFieldUpdateOperationsInput | number
    inflationYearly?: FloatFieldUpdateOperationsInput | number
    inflateIncome?: BoolFieldUpdateOperationsInput | boolean
    inflateExpenses?: BoolFieldUpdateOperationsInput | boolean
    retirementAge?: IntFieldUpdateOperationsInput | number
    retirementMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    inflateRetirementIncome?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeSettingsUncheckedUpdateWithoutScenarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseNetWorth?: FloatFieldUpdateOperationsInput | number
    baseMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    baseMonthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    expectedReturnYearly?: FloatFieldUpdateOperationsInput | number
    inflationYearly?: FloatFieldUpdateOperationsInput | number
    inflateIncome?: BoolFieldUpdateOperationsInput | boolean
    inflateExpenses?: BoolFieldUpdateOperationsInput | boolean
    retirementAge?: IntFieldUpdateOperationsInput | number
    retirementMonthlyIncome?: FloatFieldUpdateOperationsInput | number
    inflateRetirementIncome?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventUpsertWithWhereUniqueWithoutScenarioInput = {
    where: LifeEventWhereUniqueInput
    update: XOR<LifeEventUpdateWithoutScenarioInput, LifeEventUncheckedUpdateWithoutScenarioInput>
    create: XOR<LifeEventCreateWithoutScenarioInput, LifeEventUncheckedCreateWithoutScenarioInput>
  }

  export type LifeEventUpdateWithWhereUniqueWithoutScenarioInput = {
    where: LifeEventWhereUniqueInput
    data: XOR<LifeEventUpdateWithoutScenarioInput, LifeEventUncheckedUpdateWithoutScenarioInput>
  }

  export type LifeEventUpdateManyWithWhereWithoutScenarioInput = {
    where: LifeEventScalarWhereInput
    data: XOR<LifeEventUpdateManyMutationInput, LifeEventUncheckedUpdateManyWithoutScenarioInput>
  }

  export type LifeEventScalarWhereInput = {
    AND?: LifeEventScalarWhereInput | LifeEventScalarWhereInput[]
    OR?: LifeEventScalarWhereInput[]
    NOT?: LifeEventScalarWhereInput | LifeEventScalarWhereInput[]
    id?: StringFilter<"LifeEvent"> | string
    scenarioId?: StringFilter<"LifeEvent"> | string
    type?: StringFilter<"LifeEvent"> | string
    title?: StringFilter<"LifeEvent"> | string
    description?: StringNullableFilter<"LifeEvent"> | string | null
    date?: DateTimeFilter<"LifeEvent"> | Date | string
    endDate?: DateTimeNullableFilter<"LifeEvent"> | Date | string | null
    amount?: FloatFilter<"LifeEvent"> | number
    frequency?: StringFilter<"LifeEvent"> | string
    durationMonths?: IntNullableFilter<"LifeEvent"> | number | null
    inflationIndexed?: BoolFilter<"LifeEvent"> | boolean
    createdAt?: DateTimeFilter<"LifeEvent"> | Date | string
    updatedAt?: DateTimeFilter<"LifeEvent"> | Date | string
  }

  export type LifeMicroPlanUpsertWithWhereUniqueWithoutScenarioInput = {
    where: LifeMicroPlanWhereUniqueInput
    update: XOR<LifeMicroPlanUpdateWithoutScenarioInput, LifeMicroPlanUncheckedUpdateWithoutScenarioInput>
    create: XOR<LifeMicroPlanCreateWithoutScenarioInput, LifeMicroPlanUncheckedCreateWithoutScenarioInput>
  }

  export type LifeMicroPlanUpdateWithWhereUniqueWithoutScenarioInput = {
    where: LifeMicroPlanWhereUniqueInput
    data: XOR<LifeMicroPlanUpdateWithoutScenarioInput, LifeMicroPlanUncheckedUpdateWithoutScenarioInput>
  }

  export type LifeMicroPlanUpdateManyWithWhereWithoutScenarioInput = {
    where: LifeMicroPlanScalarWhereInput
    data: XOR<LifeMicroPlanUpdateManyMutationInput, LifeMicroPlanUncheckedUpdateManyWithoutScenarioInput>
  }

  export type LifeMicroPlanScalarWhereInput = {
    AND?: LifeMicroPlanScalarWhereInput | LifeMicroPlanScalarWhereInput[]
    OR?: LifeMicroPlanScalarWhereInput[]
    NOT?: LifeMicroPlanScalarWhereInput | LifeMicroPlanScalarWhereInput[]
    id?: StringFilter<"LifeMicroPlan"> | string
    scenarioId?: StringFilter<"LifeMicroPlan"> | string
    effectiveDate?: DateTimeFilter<"LifeMicroPlan"> | Date | string
    monthlyIncome?: FloatFilter<"LifeMicroPlan"> | number
    monthlyExpenses?: FloatFilter<"LifeMicroPlan"> | number
    monthlyContribution?: FloatFilter<"LifeMicroPlan"> | number
    createdAt?: DateTimeFilter<"LifeMicroPlan"> | Date | string
    updatedAt?: DateTimeFilter<"LifeMicroPlan"> | Date | string
  }

  export type LifeScenarioCreateWithoutMicroPlansInput = {
    id?: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutScenariosInput
    settings?: LifeSettingsCreateNestedOneWithoutScenarioInput
    events?: LifeEventCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioUncheckedCreateWithoutMicroPlansInput = {
    id?: string
    profileId: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: LifeSettingsUncheckedCreateNestedOneWithoutScenarioInput
    events?: LifeEventUncheckedCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioCreateOrConnectWithoutMicroPlansInput = {
    where: LifeScenarioWhereUniqueInput
    create: XOR<LifeScenarioCreateWithoutMicroPlansInput, LifeScenarioUncheckedCreateWithoutMicroPlansInput>
  }

  export type LifeScenarioUpsertWithoutMicroPlansInput = {
    update: XOR<LifeScenarioUpdateWithoutMicroPlansInput, LifeScenarioUncheckedUpdateWithoutMicroPlansInput>
    create: XOR<LifeScenarioCreateWithoutMicroPlansInput, LifeScenarioUncheckedCreateWithoutMicroPlansInput>
    where?: LifeScenarioWhereInput
  }

  export type LifeScenarioUpdateToOneWithWhereWithoutMicroPlansInput = {
    where?: LifeScenarioWhereInput
    data: XOR<LifeScenarioUpdateWithoutMicroPlansInput, LifeScenarioUncheckedUpdateWithoutMicroPlansInput>
  }

  export type LifeScenarioUpdateWithoutMicroPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutScenariosNestedInput
    settings?: LifeSettingsUpdateOneWithoutScenarioNestedInput
    events?: LifeEventUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioUncheckedUpdateWithoutMicroPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: LifeSettingsUncheckedUpdateOneWithoutScenarioNestedInput
    events?: LifeEventUncheckedUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioCreateWithoutSettingsInput = {
    id?: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutScenariosInput
    events?: LifeEventCreateNestedManyWithoutScenarioInput
    microPlans?: LifeMicroPlanCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioUncheckedCreateWithoutSettingsInput = {
    id?: string
    profileId: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: LifeEventUncheckedCreateNestedManyWithoutScenarioInput
    microPlans?: LifeMicroPlanUncheckedCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioCreateOrConnectWithoutSettingsInput = {
    where: LifeScenarioWhereUniqueInput
    create: XOR<LifeScenarioCreateWithoutSettingsInput, LifeScenarioUncheckedCreateWithoutSettingsInput>
  }

  export type LifeScenarioUpsertWithoutSettingsInput = {
    update: XOR<LifeScenarioUpdateWithoutSettingsInput, LifeScenarioUncheckedUpdateWithoutSettingsInput>
    create: XOR<LifeScenarioCreateWithoutSettingsInput, LifeScenarioUncheckedCreateWithoutSettingsInput>
    where?: LifeScenarioWhereInput
  }

  export type LifeScenarioUpdateToOneWithWhereWithoutSettingsInput = {
    where?: LifeScenarioWhereInput
    data: XOR<LifeScenarioUpdateWithoutSettingsInput, LifeScenarioUncheckedUpdateWithoutSettingsInput>
  }

  export type LifeScenarioUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutScenariosNestedInput
    events?: LifeEventUpdateManyWithoutScenarioNestedInput
    microPlans?: LifeMicroPlanUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioUncheckedUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: LifeEventUncheckedUpdateManyWithoutScenarioNestedInput
    microPlans?: LifeMicroPlanUncheckedUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioCreateWithoutEventsInput = {
    id?: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutScenariosInput
    settings?: LifeSettingsCreateNestedOneWithoutScenarioInput
    microPlans?: LifeMicroPlanCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioUncheckedCreateWithoutEventsInput = {
    id?: string
    profileId: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: LifeSettingsUncheckedCreateNestedOneWithoutScenarioInput
    microPlans?: LifeMicroPlanUncheckedCreateNestedManyWithoutScenarioInput
  }

  export type LifeScenarioCreateOrConnectWithoutEventsInput = {
    where: LifeScenarioWhereUniqueInput
    create: XOR<LifeScenarioCreateWithoutEventsInput, LifeScenarioUncheckedCreateWithoutEventsInput>
  }

  export type LifeScenarioUpsertWithoutEventsInput = {
    update: XOR<LifeScenarioUpdateWithoutEventsInput, LifeScenarioUncheckedUpdateWithoutEventsInput>
    create: XOR<LifeScenarioCreateWithoutEventsInput, LifeScenarioUncheckedCreateWithoutEventsInput>
    where?: LifeScenarioWhereInput
  }

  export type LifeScenarioUpdateToOneWithWhereWithoutEventsInput = {
    where?: LifeScenarioWhereInput
    data: XOR<LifeScenarioUpdateWithoutEventsInput, LifeScenarioUncheckedUpdateWithoutEventsInput>
  }

  export type LifeScenarioUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutScenariosNestedInput
    settings?: LifeSettingsUpdateOneWithoutScenarioNestedInput
    microPlans?: LifeMicroPlanUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: LifeSettingsUncheckedUpdateOneWithoutScenarioNestedInput
    microPlans?: LifeMicroPlanUncheckedUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioCreateManyProfileInput = {
    id?: string
    name: string
    description?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeScenarioUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: LifeSettingsUpdateOneWithoutScenarioNestedInput
    events?: LifeEventUpdateManyWithoutScenarioNestedInput
    microPlans?: LifeMicroPlanUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: LifeSettingsUncheckedUpdateOneWithoutScenarioNestedInput
    events?: LifeEventUncheckedUpdateManyWithoutScenarioNestedInput
    microPlans?: LifeMicroPlanUncheckedUpdateManyWithoutScenarioNestedInput
  }

  export type LifeScenarioUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventCreateManyScenarioInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    endDate?: Date | string | null
    amount: number
    frequency?: string
    durationMonths?: number | null
    inflationIndexed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeMicroPlanCreateManyScenarioInput = {
    id?: string
    effectiveDate: Date | string
    monthlyIncome?: number
    monthlyExpenses?: number
    monthlyContribution?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LifeEventUpdateWithoutScenarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    frequency?: StringFieldUpdateOperationsInput | string
    durationMonths?: NullableIntFieldUpdateOperationsInput | number | null
    inflationIndexed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventUncheckedUpdateWithoutScenarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    frequency?: StringFieldUpdateOperationsInput | string
    durationMonths?: NullableIntFieldUpdateOperationsInput | number | null
    inflationIndexed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventUncheckedUpdateManyWithoutScenarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    frequency?: StringFieldUpdateOperationsInput | string
    durationMonths?: NullableIntFieldUpdateOperationsInput | number | null
    inflationIndexed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeMicroPlanUpdateWithoutScenarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyIncome?: FloatFieldUpdateOperationsInput | number
    monthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeMicroPlanUncheckedUpdateWithoutScenarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyIncome?: FloatFieldUpdateOperationsInput | number
    monthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeMicroPlanUncheckedUpdateManyWithoutScenarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    effectiveDate?: DateTimeFieldUpdateOperationsInput | Date | string
    monthlyIncome?: FloatFieldUpdateOperationsInput | number
    monthlyExpenses?: FloatFieldUpdateOperationsInput | number
    monthlyContribution?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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