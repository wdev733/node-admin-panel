define({ "api": [
  {
    "type": "get",
    "url": "/api/data/",
    "title": "Query data from the log",
    "name": "Data",
    "group": "Data",
    "parameter": {
      "fields": {
        "Query Parameter": [
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": false,
            "field": "summary",
            "description": ""
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": false,
            "field": "overTimeData",
            "description": ""
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": false,
            "field": "overTimeData10mins",
            "description": ""
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": false,
            "field": "topItems",
            "description": ""
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": false,
            "field": "recentItems",
            "description": ""
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": false,
            "field": "getQueryTypes",
            "description": ""
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": false,
            "field": "getForwardDestinations",
            "description": ""
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": false,
            "field": "getAllQueries",
            "description": ""
          },
          {
            "group": "Query Parameter",
            "type": "boolean",
            "optional": false,
            "field": "getQuerySources",
            "description": ""
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
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "domainsOverTime",
            "description": "<p>Domain count queried over time</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "topSources",
            "description": "<p>Top query sources</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "topSources.source",
            "description": "<p>Query source</p>"
          },
          {
            "group": "Success 200",
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
    "version": "0.0.0",
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
            "optional": false,
            "field": "list",
            "description": "<p>either <tt>white</tt> or black</p>"
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
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Lastname of the User.</p>"
          }
        ]
      }
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
            "optional": false,
            "field": "list",
            "description": "<p>either <code>white</code> or <code>white</code></p>"
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
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Lastname of the User.</p>"
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
    "parameter": {
      "fields": {
        "Query Parameter": [
          {
            "group": "Query Parameter",
            "type": "string",
            "optional": false,
            "field": "list",
            "description": "<p>either <tt>white</tt> or black</p>"
          }
        ]
      }
    },
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
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Lastname of the User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
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
    "permission": [
      {
        "name": "admin",
        "title": "AdminUser",
        "description": "<p>A logged in user</p>"
      }
    ],
    "version": "0.0.0",
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
