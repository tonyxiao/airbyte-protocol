export type DestinationSyncMode = "append" | "overwrite" | "append_dedup"
export type SyncMode = "full_refresh" | "incremental"
/**
 * The type of state the other fields represent. Is set to LEGACY, the state data should be read from the `data` field for backwards compatibility. If not set, assume the state object is type LEGACY. GLOBAL means that the state should be read from `global` and means that it represents the state for all the streams. It contains one shared state and individual stream states. PER_STREAM means that the state should be read from `stream`. The state present in this field correspond to the isolated state of the associated stream description.
 *
 */
export type AirbyteStateType = "GLOBAL" | "STREAM" | "LEGACY"
/**
 * the type of trace message
 */
export type TraceType = "ERROR" | "ESTIMATE"
/**
 * Estimates are either per-stream (STREAM) or for the entire sync (SYNC). STREAM is preferred, and requires the source to count how many records are about to be emitted per-stream (e.g. there will be 100 rows from this table emitted). For the rare source which cannot tell which stream a record belongs to before reading (e.g. CDC databases), SYNC estimates can be emitted. Sources should not emit both STREAM and SOURCE estimates within a sync.
 *
 */
export type EstimateType = "STREAM" | "SYNC"
/**
 * the type of orchestrator message
 */
export type OrchestratorType = "CONNECTOR_CONFIG"

/**
 * AirbyteProtocol structs
 */
export interface AirbyteProtocol {
  airbyte_message?: AirbyteMessage
  configured_airbyte_catalog?: ConfiguredAirbyteCatalog
  [k: string]: unknown
}
export interface AirbyteMessage {
  /**
   * Message type
   */
  type:
    | "RECORD"
    | "STATE"
    | "LOG"
    | "SPEC"
    | "CONNECTION_STATUS"
    | "CATALOG"
    | "TRACE"
    | "CONTROL"
  /**
   * log message: any kind of logging you want the platform to know about.
   */
  log?: {
    /**
     * log level
     */
    level: "FATAL" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE"
    /**
     * log message
     */
    message: string
    /**
     * an optional stack trace if the log message corresponds to an exception
     */
    stack_trace?: string
    [k: string]: unknown
  }
  spec?: ConnectorSpecification
  connectionStatus?: AirbyteConnectionStatus
  /**
   * catalog message: the catalog
   */
  catalog?: {
    streams: AirbyteStream[]
    [k: string]: unknown
  }
  /**
   * record message: the record
   */
  record?: {
    /**
     * namespace the data is associated with
     */
    namespace?: string
    /**
     * stream the data is associated with
     */
    stream: string
    /**
     * record data
     */
    data: {
      [k: string]: unknown
    }
    /**
     * when the data was emitted from the source. epoch in millisecond.
     */
    emitted_at: number
    [k: string]: unknown
  }
  /**
   * schema message: the state. Must be the last message produced. The platform uses this information
   */
  state?: {
    type?: AirbyteStateType
    stream?: AirbyteStreamState
    global?: AirbyteGlobalState
    /**
     * (Deprecated) the state data
     */
    data?: {
      [k: string]: unknown
    }
    [k: string]: unknown
  }
  /**
   * trace message: a message to communicate information about the status and performance of a connector
   */
  trace?: {
    type: TraceType
    /**
     * the time in ms that the message was emitted
     */
    emitted_at: number
    /**
     * error trace message: the error object
     */
    error?: {
      /**
       * A user-friendly message that indicates the cause of the error
       */
      message: string
      /**
       * The internal error that caused the failure
       */
      internal_message?: string
      /**
       * The full stack trace of the error
       */
      stack_trace?: string
      /**
       * The type of error
       */
      failure_type?: "system_error" | "config_error"
      [k: string]: unknown
    }
    /**
     * Estimate trace message: a guess at how much data will be produced in this sync
     */
    estimate?: {
      /**
       * The name of the stream
       */
      name: string
      type: EstimateType
      /**
       * The namespace of the stream
       */
      namespace?: string
      /**
       * The estimated number of rows to be emitted by this sync for this stream
       */
      row_estimate?: number
      /**
       * The estimated number of bytes to be emitted by this sync for this stream
       */
      byte_estimate?: number
      [k: string]: unknown
    }
    [k: string]: unknown
  }
  /**
   * connector config message: a message to communicate an updated configuration from a connector that should be persisted
   */
  control?: {
    type: OrchestratorType
    /**
     * the time in ms that the message was emitted
     */
    emitted_at: number
    /**
     * connector config orchestrator message: the updated config for the platform to store for this connector
     */
    connectorConfig?: {
      /**
       * the config items from this connector's spec to update
       */
      config: {
        [k: string]: unknown
      }
      [k: string]: unknown
    }
    [k: string]: unknown
  }
  [k: string]: unknown
}
/**
 * Specification of a connector (source/destination)
 */
export interface ConnectorSpecification {
  documentationUrl?: string
  changelogUrl?: string
  /**
   * ConnectorDefinition specific blob. Must be a valid JSON string.
   */
  connectionSpecification: {
    [k: string]: unknown
  }
  /**
   * (deprecated) If the connector supports incremental mode or not.
   */
  supportsIncremental?: boolean
  /**
   * If the connector supports normalization or not.
   */
  supportsNormalization?: boolean
  /**
   * If the connector supports DBT or not.
   */
  supportsDBT?: boolean
  /**
   * List of destination sync modes supported by the connector
   */
  supported_destination_sync_modes?: DestinationSyncMode[]
  /**
   * deprecated, switching to advanced_auth instead
   */
  authSpecification?: {
    auth_type?: "oauth2.0"
    /**
     * If the connector supports OAuth, this field should be non-null.
     */
    oauth2Specification?: {
      /**
       * A list of strings representing a pointer to the root object which contains any oauth parameters in the ConnectorSpecification.
       * Examples:
       * if oauth parameters were contained inside the top level, rootObject=[] If they were nested inside another object {'credentials': {'app_id' etc...}, rootObject=['credentials'] If they were inside a oneOf {'switch': {oneOf: [{client_id...}, {non_oauth_param]}},  rootObject=['switch', 0]
       */
      rootObject?: (string | number)[]
      /**
       * Pointers to the fields in the rootObject needed to obtain the initial refresh/access tokens for the OAuth flow. Each inner array represents the path in the rootObject of the referenced field. For example. Assume the rootObject contains params 'app_secret', 'app_id' which are needed to get the initial refresh token. If they are not nested in the rootObject, then the array would look like this [['app_secret'], ['app_id']] If they are nested inside an object called 'auth_params' then this array would be [['auth_params', 'app_secret'], ['auth_params', 'app_id']]
       */
      oauthFlowInitParameters?: string[][]
      /**
       * Pointers to the fields in the rootObject which can be populated from successfully completing the oauth flow using the init parameters. This is typically a refresh/access token. Each inner array represents the path in the rootObject of the referenced field.
       */
      oauthFlowOutputParameters?: string[][]
      [k: string]: unknown
    }
    [k: string]: unknown
  }
  /**
   * Additional and optional specification object to describe what an 'advanced' Auth flow would need to function.
   *   - A connector should be able to fully function with the configuration as described by the ConnectorSpecification in a 'basic' mode.
   *   - The 'advanced' mode provides easier UX for the user with UI improvements and automations. However, this requires further setup on the
   *   server side by instance or workspace admins beforehand. The trade-off is that the user does not have to provide as many technical
   *   inputs anymore and the auth process is faster and easier to complete.
   */
  advanced_auth?: {
    auth_flow_type?: "oauth2.0" | "oauth1.0"
    /**
     * Json Path to a field in the connectorSpecification that should exist for the advanced auth to be applicable.
     */
    predicate_key?: string[]
    /**
     * Value of the predicate_key fields for the advanced auth to be applicable.
     */
    predicate_value?: string
    oauth_config_specification?: OAuthConfigSpecification
    [k: string]: unknown
  }
  /**
   * the Airbyte Protocol version supported by the connector. Protocol versioning uses SemVer.
   */
  protocol_version?: string
  [k: string]: unknown
}
export interface OAuthConfigSpecification {
  /**
   * OAuth specific blob. This is a Json Schema used to validate Json configurations used as input to OAuth.
   * Must be a valid non-nested JSON that refers to properties from ConnectorSpecification.connectionSpecification
   * using special annotation 'path_in_connector_config'.
   * These are input values the user is entering through the UI to authenticate to the connector, that might also shared
   * as inputs for syncing data via the connector.
   *
   * Examples:
   *
   * if no connector values is shared during oauth flow, oauth_user_input_from_connector_config_specification=[]
   * if connector values such as 'app_id' inside the top level are used to generate the API url for the oauth flow,
   *   oauth_user_input_from_connector_config_specification={
   *     app_id: {
   *       type: string
   *       path_in_connector_config: ['app_id']
   *     }
   *   }
   * if connector values such as 'info.app_id' nested inside another object are used to generate the API url for the oauth flow,
   *   oauth_user_input_from_connector_config_specification={
   *     app_id: {
   *       type: string
   *       path_in_connector_config: ['info', 'app_id']
   *     }
   *   }
   */
  oauth_user_input_from_connector_config_specification?: {
    [k: string]: unknown
  }
  /**
   * OAuth specific blob. This is a Json Schema used to validate Json configurations produced by the OAuth flows as they are
   * returned by the distant OAuth APIs.
   * Must be a valid JSON describing the fields to merge back to `ConnectorSpecification.connectionSpecification`.
   * For each field, a special annotation `path_in_connector_config` can be specified to determine where to merge it,
   *
   * Examples:
   *
   *     complete_oauth_output_specification={
   *       refresh_token: {
   *         type: string,
   *         path_in_connector_config: ['credentials', 'refresh_token']
   *       }
   *     }
   */
  complete_oauth_output_specification?: {
    [k: string]: unknown
  }
  /**
   * OAuth specific blob. This is a Json Schema used to validate Json configurations persisted as Airbyte Server configurations.
   * Must be a valid non-nested JSON describing additional fields configured by the Airbyte Instance or Workspace Admins to be used by the
   * server when completing an OAuth flow (typically exchanging an auth code for refresh token).
   *
   * Examples:
   *
   *     complete_oauth_server_input_specification={
   *       client_id: {
   *         type: string
   *       },
   *       client_secret: {
   *         type: string
   *       }
   *     }
   */
  complete_oauth_server_input_specification?: {
    [k: string]: unknown
  }
  /**
   * OAuth specific blob. This is a Json Schema used to validate Json configurations persisted as Airbyte Server configurations that
   * also need to be merged back into the connector configuration at runtime.
   * This is a subset configuration of `complete_oauth_server_input_specification` that filters fields out to retain only the ones that
   * are necessary for the connector to function with OAuth. (some fields could be used during oauth flows but not needed afterwards, therefore
   * they would be listed in the `complete_oauth_server_input_specification` but not `complete_oauth_server_output_specification`)
   * Must be a valid non-nested JSON describing additional fields configured by the Airbyte Instance or Workspace Admins to be used by the
   * connector when using OAuth flow APIs.
   * These fields are to be merged back to `ConnectorSpecification.connectionSpecification`.
   * For each field, a special annotation `path_in_connector_config` can be specified to determine where to merge it,
   *
   * Examples:
   *
   *       complete_oauth_server_output_specification={
   *         client_id: {
   *           type: string,
   *           path_in_connector_config: ['credentials', 'client_id']
   *         },
   *         client_secret: {
   *           type: string,
   *           path_in_connector_config: ['credentials', 'client_secret']
   *         }
   *       }
   */
  complete_oauth_server_output_specification?: {
    [k: string]: unknown
  }
  [k: string]: unknown
}
/**
 * Airbyte connection status
 */
export interface AirbyteConnectionStatus {
  status: "SUCCEEDED" | "FAILED"
  message?: string
  [k: string]: unknown
}
export interface AirbyteStream {
  /**
   * Stream's name.
   */
  name: string
  /**
   * Stream schema using Json Schema specs.
   */
  json_schema: {
    [k: string]: unknown
  }
  /**
   * List of sync modes supported by this stream.
   */
  supported_sync_modes: [SyncMode, ...SyncMode[]]
  /**
   * If the source defines the cursor field, then any other cursor field inputs will be ignored. If it does not, either the user_provided one is used, or the default one is used as a backup.
   */
  source_defined_cursor?: boolean
  /**
   * Path to the field that will be used to determine if a record is new or modified since the last sync. If not provided by the source, the end user will have to specify the comparable themselves.
   */
  default_cursor_field?: string[]
  /**
   * If the source defines the primary key, paths to the fields that will be used as a primary key. If not provided by the source, the end user will have to specify the primary key themselves.
   */
  source_defined_primary_key?: string[][]
  /**
   * Optional Source-defined namespace. Currently only used by JDBC destinations to determine what schema to write to. Airbyte streams from the same sources should have the same namespace.
   */
  namespace?: string
  [k: string]: unknown
}
export interface AirbyteStreamState {
  stream_descriptor: StreamDescriptor
  stream_state?: AirbyteStateBlob
  [k: string]: unknown
}
export interface StreamDescriptor {
  name: string
  namespace?: string
  [k: string]: unknown
}
/**
 * the state data
 */
export interface AirbyteStateBlob {
  [k: string]: unknown
}
export interface AirbyteGlobalState {
  shared_state?: AirbyteStateBlob
  stream_states: AirbyteStreamState[]
  [k: string]: unknown
}
/**
 * Airbyte stream schema catalog
 */
export interface ConfiguredAirbyteCatalog {
  streams: ConfiguredAirbyteStream[]
  [k: string]: unknown
}
export interface ConfiguredAirbyteStream {
  stream: AirbyteStream
  sync_mode: "full_refresh" | "incremental"
  /**
   * Path to the field that will be used to determine if a record is new or modified since the last sync. This field is REQUIRED if `sync_mode` is `incremental`. Otherwise it is ignored.
   */
  cursor_field?: string[]
  destination_sync_mode: "append" | "overwrite" | "append_dedup"
  /**
   * Paths to the fields that will be used as primary key. This field is REQUIRED if `destination_sync_mode` is `*_dedup`. Otherwise it is ignored.
   */
  primary_key?: string[][]
  [k: string]: unknown
}

