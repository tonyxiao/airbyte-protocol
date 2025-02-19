import { FromSchema } from 'json-schema-to-ts'

export const AirbyteProtocol = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://github.com/airbytehq/airbyte/blob/master/airbyte-protocol/models/src/main/resources/airbyte_protocol/v1/airbyte_protocol.yaml',
  title: 'AirbyteProtocol',
  type: 'object',
  description: 'AirbyteProtocol structs',
  version: '1.0.0',
  properties: {
    airbyte_message: {
      $ref: '#/definitions/AirbyteMessage',
    },
    configured_airbyte_catalog: {
      $ref: '#/definitions/ConfiguredAirbyteCatalog',
    },
  },
  definitions: {
    AirbyteMessage: {
      type: 'object',
      additionalProperties: true,
      required: ['type'],
      properties: {
        type: {
          description: 'Message type',
          type: 'string',
          enum: [
            'RECORD',
            'STATE',
            'LOG',
            'SPEC',
            'CONNECTION_STATUS',
            'CATALOG',
            'TRACE',
            'CONTROL',
          ],
        },
        log: {
          description:
            'log message: any kind of logging you want the platform to know about.',
          $ref: '#/definitions/AirbyteLogMessage',
        },
        spec: {
          $ref: '#/definitions/ConnectorSpecification',
        },
        connectionStatus: {
          $ref: '#/definitions/AirbyteConnectionStatus',
        },
        catalog: {
          description: 'catalog message: the catalog',
          $ref: '#/definitions/AirbyteCatalog',
        },
        record: {
          description: 'record message: the record',
          $ref: '#/definitions/AirbyteRecordMessage',
        },
        state: {
          description:
            'schema message: the state. Must be the last message produced. The platform uses this information',
          $ref: '#/definitions/AirbyteStateMessage',
        },
        trace: {
          description:
            'trace message: a message to communicate information about the status and performance of a connector',
          $ref: '#/definitions/AirbyteTraceMessage',
        },
        control: {
          description:
            'connector config message: a message to communicate an updated configuration from a connector that should be persisted',
          $ref: '#/definitions/AirbyteControlMessage',
        },
      },
    },
    AirbyteRecordMessage: {
      type: 'object',
      additionalProperties: true,
      required: ['stream', 'data', 'emitted_at'],
      properties: {
        namespace: {
          description: 'namespace the data is associated with',
          type: 'string',
        },
        stream: {
          description: 'stream the data is associated with',
          type: 'string',
        },
        data: {
          description: 'record data',
          type: 'object',
          existingJavaType: 'com.fasterxml.jackson.databind.JsonNode',
        },
        emitted_at: {
          description:
            'when the data was emitted from the source. epoch in millisecond.',
          type: 'integer',
        },
      },
    },
    AirbyteStateMessage: {
      type: 'object',
      additionalProperties: true,
      properties: {
        type: {
          $ref: '#/definitions/AirbyteStateType',
        },
        stream: {
          $ref: '#/definitions/AirbyteStreamState',
        },
        global: {
          $ref: '#/definitions/AirbyteGlobalState',
        },
        data: {
          description: '(Deprecated) the state data',
          type: 'object',
          existingJavaType: 'com.fasterxml.jackson.databind.JsonNode',
        },
      },
    },
    AirbyteStateType: {
      type: 'string',
      description:
        'The type of state the other fields represent. Is set to LEGACY, the state data should be read from the `data` field for backwards compatibility. If not set, assume the state object is type LEGACY. GLOBAL means that the state should be read from `global` and means that it represents the state for all the streams. It contains one shared state and individual stream states. PER_STREAM means that the state should be read from `stream`. The state present in this field correspond to the isolated state of the associated stream description.\n',
      enum: ['GLOBAL', 'STREAM', 'LEGACY'],
    },
    AirbyteStreamState: {
      type: 'object',
      additionalProperties: true,
      required: ['stream_descriptor'],
      properties: {
        stream_descriptor: {
          $ref: '#/definitions/StreamDescriptor',
        },
        stream_state: {
          $ref: '#/definitions/AirbyteStateBlob',
        },
      },
    },
    AirbyteGlobalState: {
      type: 'object',
      additionalProperties: true,
      required: ['stream_states'],
      properties: {
        shared_state: {
          $ref: '#/definitions/AirbyteStateBlob',
        },
        stream_states: {
          type: 'array',
          items: {
            $ref: '#/definitions/AirbyteStreamState',
          },
        },
      },
    },
    StreamDescriptor: {
      type: 'object',
      additionalProperties: true,
      required: ['name'],
      properties: {
        name: {
          type: 'string',
        },
        namespace: {
          type: 'string',
        },
      },
    },
    AirbyteStateBlob: {
      type: 'object',
      additionalProperties: true,
      description: 'the state data',
      existingJavaType: 'com.fasterxml.jackson.databind.JsonNode',
    },
    AirbyteLogMessage: {
      type: 'object',
      additionalProperties: true,
      required: ['level', 'message'],
      properties: {
        level: {
          description: 'log level',
          type: 'string',
          enum: ['FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'],
        },
        message: {
          description: 'log message',
          type: 'string',
        },
        stack_trace: {
          description:
            'an optional stack trace if the log message corresponds to an exception',
          type: 'string',
        },
      },
    },
    AirbyteTraceMessage: {
      type: 'object',
      additionalProperties: true,
      required: ['type', 'emitted_at'],
      properties: {
        type: {
          title: 'trace type',
          description: 'the type of trace message',
          type: 'string',
          enum: ['ERROR', 'ESTIMATE'],
        },
        emitted_at: {
          description: 'the time in ms that the message was emitted',
          type: 'number',
        },
        error: {
          description: 'error trace message: the error object',
          $ref: '#/definitions/AirbyteErrorTraceMessage',
        },
        estimate: {
          description:
            'Estimate trace message: a guess at how much data will be produced in this sync',
          $ref: '#/definitions/AirbyteEstimateTraceMessage',
        },
      },
    },
    AirbyteErrorTraceMessage: {
      type: 'object',
      additionalProperties: true,
      required: ['message'],
      properties: {
        message: {
          description:
            'A user-friendly message that indicates the cause of the error',
          type: 'string',
        },
        internal_message: {
          description: 'The internal error that caused the failure',
          type: 'string',
        },
        stack_trace: {
          description: 'The full stack trace of the error',
          type: 'string',
        },
        failure_type: {
          description: 'The type of error',
          type: 'string',
          enum: ['system_error', 'config_error'],
        },
      },
    },
    AirbyteEstimateTraceMessage: {
      type: 'object',
      additionalProperties: true,
      required: ['name', 'type'],
      properties: {
        name: {
          description: 'The name of the stream',
          type: 'string',
        },
        type: {
          title: 'estimate type',
          description:
            'Estimates are either per-stream (STREAM) or for the entire sync (SYNC). STREAM is preferred, and requires the source to count how many records are about to be emitted per-stream (e.g. there will be 100 rows from this table emitted). For the rare source which cannot tell which stream a record belongs to before reading (e.g. CDC databases), SYNC estimates can be emitted. Sources should not emit both STREAM and SOURCE estimates within a sync.\n',
          type: 'string',
          enum: ['STREAM', 'SYNC'],
        },
        namespace: {
          description: 'The namespace of the stream',
          type: 'string',
        },
        row_estimate: {
          description:
            'The estimated number of rows to be emitted by this sync for this stream',
          type: 'integer',
        },
        byte_estimate: {
          description:
            'The estimated number of bytes to be emitted by this sync for this stream',
          type: 'integer',
        },
      },
    },
    AirbyteControlMessage: {
      type: 'object',
      additionalProperties: true,
      required: ['type', 'emitted_at'],
      properties: {
        type: {
          title: 'orchestrator type',
          description: 'the type of orchestrator message',
          type: 'string',
          enum: ['CONNECTOR_CONFIG'],
        },
        emitted_at: {
          description: 'the time in ms that the message was emitted',
          type: 'number',
        },
        connectorConfig: {
          description:
            'connector config orchestrator message: the updated config for the platform to store for this connector',
          $ref: '#/definitions/AirbyteControlConnectorConfigMessage',
        },
      },
    },
    AirbyteControlConnectorConfigMessage: {
      type: 'object',
      additionalProperties: true,
      required: ['config'],
      properties: {
        config: {
          description: "the config items from this connector's spec to update",
          type: 'object',
          additionalProperties: true,
        },
      },
    },
    AirbyteConnectionStatus: {
      type: 'object',
      description: 'Airbyte connection status',
      additionalProperties: true,
      required: ['status'],
      properties: {
        status: {
          type: 'string',
          enum: ['SUCCEEDED', 'FAILED'],
        },
        message: {
          type: 'string',
        },
      },
    },
    AirbyteCatalog: {
      type: 'object',
      additionalProperties: true,
      description: 'Airbyte stream schema catalog',
      required: ['streams'],
      properties: {
        streams: {
          type: 'array',
          items: {
            $ref: '#/definitions/AirbyteStream',
          },
        },
      },
    },
    AirbyteStream: {
      type: 'object',
      additionalProperties: true,
      required: ['name', 'json_schema', 'supported_sync_modes'],
      properties: {
        name: {
          type: 'string',
          description: "Stream's name.",
        },
        json_schema: {
          description: 'Stream schema using Json Schema specs.',
          type: 'object',
          existingJavaType: 'com.fasterxml.jackson.databind.JsonNode',
        },
        supported_sync_modes: {
          description: 'List of sync modes supported by this stream.',
          type: 'array',
          minItems: 1,
          items: {
            $ref: '#/definitions/SyncMode',
          },
        },
        source_defined_cursor: {
          description:
            'If the source defines the cursor field, then any other cursor field inputs will be ignored. If it does not, either the user_provided one is used, or the default one is used as a backup.',
          type: 'boolean',
        },
        default_cursor_field: {
          description:
            'Path to the field that will be used to determine if a record is new or modified since the last sync. If not provided by the source, the end user will have to specify the comparable themselves.',
          type: 'array',
          items: {
            type: 'string',
          },
        },
        source_defined_primary_key: {
          description:
            'If the source defines the primary key, paths to the fields that will be used as a primary key. If not provided by the source, the end user will have to specify the primary key themselves.',
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        namespace: {
          description:
            'Optional Source-defined namespace. Currently only used by JDBC destinations to determine what schema to write to. Airbyte streams from the same sources should have the same namespace.',
          type: 'string',
        },
      },
    },
    ConfiguredAirbyteCatalog: {
      type: 'object',
      additionalProperties: true,
      description: 'Airbyte stream schema catalog',
      required: ['streams'],
      properties: {
        streams: {
          type: 'array',
          items: {
            $ref: '#/definitions/ConfiguredAirbyteStream',
          },
        },
      },
    },
    ConfiguredAirbyteStream: {
      type: 'object',
      additionalProperties: true,
      required: ['stream', 'sync_mode', 'destination_sync_mode'],
      properties: {
        stream: {
          $ref: '#/definitions/AirbyteStream',
        },
        sync_mode: {
          $ref: '#/definitions/SyncMode',
          default: 'full_refresh',
        },
        cursor_field: {
          description:
            'Path to the field that will be used to determine if a record is new or modified since the last sync. This field is REQUIRED if `sync_mode` is `incremental`. Otherwise it is ignored.',
          type: 'array',
          items: {
            type: 'string',
          },
        },
        destination_sync_mode: {
          $ref: '#/definitions/DestinationSyncMode',
          default: 'append',
        },
        primary_key: {
          description:
            'Paths to the fields that will be used as primary key. This field is REQUIRED if `destination_sync_mode` is `*_dedup`. Otherwise it is ignored.',
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    SyncMode: {
      type: 'string',
      enum: ['full_refresh', 'incremental'],
    },
    DestinationSyncMode: {
      type: 'string',
      enum: ['append', 'overwrite', 'append_dedup'],
    },
    OAuth2Specification: {
      type: 'object',
      additionalProperties: true,
      description:
        "An object containing any metadata needed to describe this connector's Oauth flow. Deprecated, switching to advanced_auth instead",
      properties: {
        rootObject: {
          description:
            "A list of strings representing a pointer to the root object which contains any oauth parameters in the ConnectorSpecification.\nExamples:\nif oauth parameters were contained inside the top level, rootObject=[] If they were nested inside another object {'credentials': {'app_id' etc...}, rootObject=['credentials'] If they were inside a oneOf {'switch': {oneOf: [{client_id...}, {non_oauth_param]}},  rootObject=['switch', 0] ",
          type: 'array',
          items: {
            oneOf: [
              {
                type: 'string',
              },
              {
                type: 'integer',
              },
            ],
          },
        },
        oauthFlowInitParameters: {
          description:
            "Pointers to the fields in the rootObject needed to obtain the initial refresh/access tokens for the OAuth flow. Each inner array represents the path in the rootObject of the referenced field. For example. Assume the rootObject contains params 'app_secret', 'app_id' which are needed to get the initial refresh token. If they are not nested in the rootObject, then the array would look like this [['app_secret'], ['app_id']] If they are nested inside an object called 'auth_params' then this array would be [['auth_params', 'app_secret'], ['auth_params', 'app_id']]",
          type: 'array',
          items: {
            description:
              'A list of strings denoting a pointer into the rootObject for where to find this property',
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        oauthFlowOutputParameters: {
          description:
            'Pointers to the fields in the rootObject which can be populated from successfully completing the oauth flow using the init parameters. This is typically a refresh/access token. Each inner array represents the path in the rootObject of the referenced field.',
          type: 'array',
          items: {
            description:
              'A list of strings denoting a pointer into the rootObject for where to find this property',
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    ConnectorSpecification: {
      type: 'object',
      additionalProperties: true,
      description: 'Specification of a connector (source/destination)',
      required: ['connectionSpecification'],
      properties: {
        documentationUrl: {
          type: 'string',
          format: 'uri',
        },
        changelogUrl: {
          type: 'string',
          format: 'uri',
        },
        connectionSpecification: {
          description:
            'ConnectorDefinition specific blob. Must be a valid JSON string.',
          type: 'object',
          existingJavaType: 'com.fasterxml.jackson.databind.JsonNode',
        },
        supportsIncremental: {
          description:
            '(deprecated) If the connector supports incremental mode or not.',
          type: 'boolean',
        },
        supportsNormalization: {
          description: 'If the connector supports normalization or not.',
          type: 'boolean',
          default: false,
        },
        supportsDBT: {
          description: 'If the connector supports DBT or not.',
          type: 'boolean',
          default: false,
        },
        supported_destination_sync_modes: {
          description:
            'List of destination sync modes supported by the connector',
          type: 'array',
          items: {
            $ref: '#/definitions/DestinationSyncMode',
          },
        },
        authSpecification: {
          description: 'deprecated, switching to advanced_auth instead',
          type: 'object',
          properties: {
            auth_type: {
              type: 'string',
              enum: ['oauth2.0'],
            },
            oauth2Specification: {
              description:
                'If the connector supports OAuth, this field should be non-null.',
              $ref: '#/definitions/OAuth2Specification',
            },
          },
        },
        advanced_auth: {
          description:
            "Additional and optional specification object to describe what an 'advanced' Auth flow would need to function.\n  - A connector should be able to fully function with the configuration as described by the ConnectorSpecification in a 'basic' mode.\n  - The 'advanced' mode provides easier UX for the user with UI improvements and automations. However, this requires further setup on the\n  server side by instance or workspace admins beforehand. The trade-off is that the user does not have to provide as many technical\n  inputs anymore and the auth process is faster and easier to complete.",
          type: 'object',
          properties: {
            auth_flow_type: {
              type: 'string',
              enum: ['oauth2.0', 'oauth1.0'],
            },
            predicate_key: {
              description:
                'Json Path to a field in the connectorSpecification that should exist for the advanced auth to be applicable.',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            predicate_value: {
              description:
                'Value of the predicate_key fields for the advanced auth to be applicable.',
              type: 'string',
            },
            oauth_config_specification: {
              $ref: '#/definitions/OAuthConfigSpecification',
            },
          },
        },
        protocol_version: {
          description:
            'the Airbyte Protocol version supported by the connector. Protocol versioning uses SemVer. ',
          type: 'string',
        },
      },
    },
    OAuthConfigSpecification: {
      type: 'object',
      additionalProperties: true,
      properties: {
        oauth_user_input_from_connector_config_specification: {
          description:
            "OAuth specific blob. This is a Json Schema used to validate Json configurations used as input to OAuth.\nMust be a valid non-nested JSON that refers to properties from ConnectorSpecification.connectionSpecification\nusing special annotation 'path_in_connector_config'.\nThese are input values the user is entering through the UI to authenticate to the connector, that might also shared\nas inputs for syncing data via the connector.\n\nExamples:\n\nif no connector values is shared during oauth flow, oauth_user_input_from_connector_config_specification=[]\nif connector values such as 'app_id' inside the top level are used to generate the API url for the oauth flow,\n  oauth_user_input_from_connector_config_specification={\n    app_id: {\n      type: string\n      path_in_connector_config: ['app_id']\n    }\n  }\nif connector values such as 'info.app_id' nested inside another object are used to generate the API url for the oauth flow,\n  oauth_user_input_from_connector_config_specification={\n    app_id: {\n      type: string\n      path_in_connector_config: ['info', 'app_id']\n    }\n  }",
          type: 'object',
          existingJavaType: 'com.fasterxml.jackson.databind.JsonNode',
        },
        complete_oauth_output_specification: {
          description:
            "OAuth specific blob. This is a Json Schema used to validate Json configurations produced by the OAuth flows as they are\nreturned by the distant OAuth APIs.\nMust be a valid JSON describing the fields to merge back to `ConnectorSpecification.connectionSpecification`.\nFor each field, a special annotation `path_in_connector_config` can be specified to determine where to merge it,\n\nExamples:\n\n    complete_oauth_output_specification={\n      refresh_token: {\n        type: string,\n        path_in_connector_config: ['credentials', 'refresh_token']\n      }\n    }",
          type: 'object',
          existingJavaType: 'com.fasterxml.jackson.databind.JsonNode',
        },
        complete_oauth_server_input_specification: {
          description:
            'OAuth specific blob. This is a Json Schema used to validate Json configurations persisted as Airbyte Server configurations.\nMust be a valid non-nested JSON describing additional fields configured by the Airbyte Instance or Workspace Admins to be used by the\nserver when completing an OAuth flow (typically exchanging an auth code for refresh token).\n\nExamples:\n\n    complete_oauth_server_input_specification={\n      client_id: {\n        type: string\n      },\n      client_secret: {\n        type: string\n      }\n    }',
          type: 'object',
          existingJavaType: 'com.fasterxml.jackson.databind.JsonNode',
        },
        complete_oauth_server_output_specification: {
          description:
            "OAuth specific blob. This is a Json Schema used to validate Json configurations persisted as Airbyte Server configurations that\nalso need to be merged back into the connector configuration at runtime.\nThis is a subset configuration of `complete_oauth_server_input_specification` that filters fields out to retain only the ones that\nare necessary for the connector to function with OAuth. (some fields could be used during oauth flows but not needed afterwards, therefore\nthey would be listed in the `complete_oauth_server_input_specification` but not `complete_oauth_server_output_specification`)\nMust be a valid non-nested JSON describing additional fields configured by the Airbyte Instance or Workspace Admins to be used by the\nconnector when using OAuth flow APIs.\nThese fields are to be merged back to `ConnectorSpecification.connectionSpecification`.\nFor each field, a special annotation `path_in_connector_config` can be specified to determine where to merge it,\n\nExamples:\n\n      complete_oauth_server_output_specification={\n        client_id: {\n          type: string,\n          path_in_connector_config: ['credentials', 'client_id']\n        },\n        client_secret: {\n          type: string,\n          path_in_connector_config: ['credentials', 'client_secret']\n        }\n      }",
          type: 'object',
          existingJavaType: 'com.fasterxml.jackson.databind.JsonNode',
        },
      },
    },
  },
} as const

export type AirbyteProtocol = FromSchema<typeof AirbyteProtocol>
