define({ "api": [
  {
    "type": "get",
    "url": "/api/data",
    "title": "Query data from the log",
    "name": "Data",
    "group": "Data",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Query Parameter": [
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": true,
            "field": "summary",
            "defaultValue": "false",
            "description": "<p>Gets the summary</p>"
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": true,
            "field": "overTimeData",
            "defaultValue": "false",
            "description": "<p>Gets the overtime data</p>"
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": true,
            "field": "overTimeData10mins",
            "defaultValue": "false",
            "description": "<p>Gets the overtime data grouped into 10  minute frames</p>"
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": true,
            "field": "topItems",
            "defaultValue": "false",
            "description": "<p>Gets the top items</p>"
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": true,
            "field": "recentItems",
            "defaultValue": "false",
            "description": "<p>Gets the recent queries</p>"
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": true,
            "field": "getQueryTypes",
            "defaultValue": "false",
            "description": "<p>Get types of queries</p>"
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": true,
            "field": "getForwardDestinations",
            "defaultValue": "false",
            "description": "<p>Get the forward destinations</p>"
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": true,
            "field": "getAllQueries",
            "defaultValue": "false",
            "description": "<p>Gets all queries from the log</p>"
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": true,
            "field": "getQuerySources",
            "defaultValue": "false",
            "description": "<p>Gets the sources where the queries originated from</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success - Summary": [
          {
            "group": "Success - Summary",
            "type": "Object",
            "optional": false,
            "field": "summary",
            "description": "<p>The object summary</p>"
          },
          {
            "group": "Success - Summary",
            "type": "Number",
            "optional": false,
            "field": "summary.adsBlockedToday",
            "description": "<p>Total blocked queries</p>"
          },
          {
            "group": "Success - Summary",
            "type": "Number",
            "optional": false,
            "field": "summary.dnsQueriesToday",
            "description": "<p>Total dns queries</p>"
          },
          {
            "group": "Success - Summary",
            "type": "Number",
            "optional": false,
            "field": "summary.adsPercentageToday",
            "description": "<p>Percentage of blocked requests</p>"
          },
          {
            "group": "Success - Summary",
            "type": "Number",
            "optional": false,
            "field": "summary.domainsBeingBlocked",
            "description": "<p>Domains being blocked in total</p>"
          }
        ],
        "Success - DomainsOverTime": [
          {
            "group": "Success - DomainsOverTime",
            "type": "Number[]",
            "optional": false,
            "field": "domainsOverTime",
            "description": "<p>Domain count queried over time</p>"
          }
        ],
        "Success - TopSources": [
          {
            "group": "Success - TopSources",
            "type": "Object[]",
            "optional": false,
            "field": "topSources",
            "description": "<p>Top query sources</p>"
          },
          {
            "group": "Success - TopSources",
            "type": "String",
            "optional": false,
            "field": "topSources.source",
            "description": "<p>Query source</p>"
          },
          {
            "group": "Success - TopSources",
            "type": "Number",
            "optional": false,
            "field": "topSources.count",
            "description": "<p>Number of queries from this source</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"disabled\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/api.js",
    "groupTitle": "Data",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidRequest",
            "description": "<p>The request is malformed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>The requester is not authorized to access this endpoint</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InvalidRequest Response:",
          "content": "HTTP/1.1 400 Invalid Request",
          "type": "json"
        },
        {
          "title": "NotAuthorized Response:",
          "content": "HTTP/1.1 401 Not Authorized",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/data",
    "title": "Get Querytypes",
    "name": "GetDataQueryTypes",
    "group": "Data",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Query Parameter": [
          {
            "group": "Query Parameter",
            "type": "boolean",
            "allowedValues": [
              "true"
            ],
            "optional": false,
            "field": "getQueryTypes",
            "description": "<p>Gets the query types</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "queryTypes",
            "description": "<p>Array with query types</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "queryTypes.type",
            "description": "<p>query type</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "queryTypes.count",
            "description": "<p>number of queries with this type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"adsBlockedToday\": 10,\n  \"dnsQueriesToday\": 100,\n  \"adsPercentageToday\": 10.0,\n  \"domainsBeingBlocked\": 1337\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/api.js",
    "groupTitle": "Data",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidRequest",
            "description": "<p>The request is malformed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>The requester is not authorized to access this endpoint</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InvalidRequest Response:",
          "content": "HTTP/1.1 400 Invalid Request",
          "type": "json"
        },
        {
          "title": "NotAuthorized Response:",
          "content": "HTTP/1.1 401 Not Authorized",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/data",
    "title": "Get Summary",
    "name": "GetDataSummary",
    "group": "Data",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Query Parameter": [
          {
            "group": "Query Parameter",
            "type": "boolean",
            "allowedValues": [
              "true"
            ],
            "optional": false,
            "field": "summary",
            "description": "<p>Gets the summary</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "summary",
            "description": "<p>The object summary</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "summary.adsBlockedToday",
            "description": "<p>Total blocked queries</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "summary.dnsQueriesToday",
            "description": "<p>Total dns queries</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "summary.adsPercentageToday",
            "description": "<p>Percentage of blocked requests</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "summary.domainsBeingBlocked",
            "description": "<p>Domains being blocked in total</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"adsBlockedToday\": 10,\n  \"dnsQueriesToday\": 100,\n  \"adsPercentageToday\": 10.0,\n  \"domainsBeingBlocked\": 1337\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/api.js",
    "groupTitle": "Data",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidRequest",
            "description": "<p>The request is malformed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>The requester is not authorized to access this endpoint</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InvalidRequest Response:",
          "content": "HTTP/1.1 400 Invalid Request",
          "type": "json"
        },
        {
          "title": "NotAuthorized Response:",
          "content": "HTTP/1.1 401 Not Authorized",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/list/",
    "title": "Adds a domain to the specified list",
    "name": "AddDomain",
    "group": "Lists",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "AdminUser",
        "description": "<p>A logged in user</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Query Parameter": [
          {
            "group": "Query Parameter",
            "type": "string",
            "allowedValues": [
              "\"white\"",
              "\"black\""
            ],
            "optional": false,
            "field": "The",
            "description": "<p>list name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The <code>list</code> is unknown to the server</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>The requester is not authorized to access this endpoint</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidRequest",
            "description": "<p>The request is malformed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized Response:",
          "content": "HTTP/1.1 401 Not Authorized",
          "type": "json"
        },
        {
          "title": "InvalidRequest Response:",
          "content": "HTTP/1.1 400 Invalid Request",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/api.js",
    "groupTitle": "Lists"
  },
  {
    "type": "delete",
    "url": "/api/list/",
    "title": "Deletes a domain from the specified list",
    "name": "DeleteDomain",
    "group": "Lists",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "AdminUser",
        "description": "<p>A logged in user</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Query Parameter": [
          {
            "group": "Query Parameter",
            "type": "string",
            "allowedValues": [
              "\"white\"",
              "\"black\""
            ],
            "optional": false,
            "field": "The",
            "description": "<p>list name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The <code>list</code> is unknown to the server</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>The requester is not authorized to access this endpoint</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidRequest",
            "description": "<p>The request is malformed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized Response:",
          "content": "HTTP/1.1 401 Not Authorized",
          "type": "json"
        },
        {
          "title": "InvalidRequest Response:",
          "content": "HTTP/1.1 400 Invalid Request",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/api.js",
    "groupTitle": "Lists"
  },
  {
    "type": "get",
    "url": "/api/list/",
    "title": "Gets the white/black list",
    "name": "GetDomains",
    "group": "Lists",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "AdminUser",
        "description": "<p>A logged in user</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Query Parameter": [
          {
            "group": "Query Parameter",
            "type": "string",
            "allowedValues": [
              "\"white\"",
              "\"black\""
            ],
            "optional": false,
            "field": "The",
            "description": "<p>list name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The <code>list</code> is unknown to the server</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>The requester is not authorized to access this endpoint</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidRequest",
            "description": "<p>The request is malformed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized Response:",
          "content": "HTTP/1.1 401 Not Authorized",
          "type": "json"
        },
        {
          "title": "InvalidRequest Response:",
          "content": "HTTP/1.1 400 Invalid Request",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/api.js",
    "groupTitle": "Lists"
  },
  {
    "type": "post",
    "url": "/api/disable/",
    "title": "Disable Pihole",
    "name": "Disables_the_Pi_Hole",
    "group": "Status",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "AdminUser",
        "description": "<p>A logged in user</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "Number",
            "optional": false,
            "field": "time",
            "description": "<p>a positive number in seconds for how long to disable the pihole. 0 disables indefinitely</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>the status of the pihole</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"disabled\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/api.js",
    "groupTitle": "Status",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidRequest",
            "description": "<p>The request is malformed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>The requester is not authorized to access this endpoint</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InvalidRequest Response:",
          "content": "HTTP/1.1 400 Invalid Request",
          "type": "json"
        },
        {
          "title": "NotAuthorized Response:",
          "content": "HTTP/1.1 401 Not Authorized",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/enable/",
    "title": "Enable Pihole",
    "name": "Enables_the_Pi_Hole",
    "group": "Status",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "AdminUser",
        "description": "<p>A logged in user</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>the status of the pihole</p>"
          }
        ]
      }
    },
    "filename": "server/routes/api.js",
    "groupTitle": "Status",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidRequest",
            "description": "<p>The request is malformed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>The requester is not authorized to access this endpoint</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "InvalidRequest Response:",
          "content": "HTTP/1.1 400 Invalid Request",
          "type": "json"
        },
        {
          "title": "NotAuthorized Response:",
          "content": "HTTP/1.1 401 Not Authorized",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/taillog/",
    "title": "Opens an eventsource stream that tails the log file",
    "name": "GetTaillog",
    "group": "Taillog",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "AdminUser",
        "description": "<p>A logged in user</p>"
      }
    ],
    "filename": "server/routes/api.js",
    "groupTitle": "Taillog",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>The requester is not authorized to access this endpoint</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized Response:",
          "content": "HTTP/1.1 401 Not Authorized",
          "type": "json"
        }
      ]
    }
  }
] });
