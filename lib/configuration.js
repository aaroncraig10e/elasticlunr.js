/*!
 * elasticlunr.Configuration
 * Copyright (C) @YEAR Wei Song
 */

 /**
  * elasticlunr.Configuration is used to analyze the user search configuration.
  *
  * By elasticlunr.Configuration user could set query-time boosting, boolean model in each field.
  *
  * Currently configuration supports:
  * 1. query-time boosting, user could set how to boost each field.
  * 2. boolean model chosing, user could choose which boolean model to use for each field.
  * 3. boolean field selection, user can choose that fields must all match a query "AND" or at least one field must match "OR" (default: "OR")
  * 4. token expandation, user could set token expand to True to improve Recall. Default is False.
  *
  * Query time boosting must be configured by field category, "boolean" model could be configured
  * by both field category or globally as the following example. Field configuration for "boolean"
  * will overwrite global configuration.
  * Token expand could be configured both by field category or golbally. Local field configuration will
  * overwrite global configuration.
  *
  * configuration example:
  * {
  *   fields:{
  *     title: {boost: 2},
  *     body: {boost: 1}
  *   },
  *   bool: "OR",
  *   fieldBool: "OR"
  * }
  *
  * "bool" field configuation overwrite global configuation example:
  * {
  *   fields:{
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  *
  * "expand" example:
  * {
  *   fields:{
  *     title: {boost: 2, bool: "AND"},
  *     body: {boost: 1}
  *   },
  *   bool: "OR",
  *   expand: true
  * }
  *
  * "expand" example for field category:
  * {
  *   fields:{
  *     title: {boost: 2, bool: "AND", expand: true},
  *     body: {boost: 1}
  *   },
  *   bool: "OR"
  * }
  *
  * setting the boost to 0 ignores the field (this will only search the title):
  * {
  *   fields:{
  *     title: {boost: 1},
  *     body: {boost: 0}
  *   }
  * }
  *
  * then, user could search with configuration to do query-time boosting.
  * idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
  *
  *
  * @constructor
  *
  * @param {String} config user configuration
  * @param {Array} fields fields of index instance
  * @module
  */
elasticlunr.Configuration = function (config, fields) {
  var config = config || '';

  if (fields == undefined || fields == null) {
    throw new Error('fields should not be null');
  }

  this.config = {};

  var userConfig;
  try {
    userConfig = JSON.parse(config);
    this.buildUserConfig(userConfig, fields);
  } catch (error) {
    elasticlunr.utils.warn('user configuration parse failed, will use default configuration');
    this.buildDefaultConfig(fields);
  }
};

/**
 * Build default search configuration.
 *
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.buildDefaultConfig = function (fields) {
  this.reset();
  fields.forEach(function (field) {
    this.config[field] = {
      boost: 1,
      bool: "OR",
      expand: false,
      fieldBool: 'OR'
    };
  }, this);
};

/**
 * Build user configuration.
 *
 * @param {JSON} config User JSON configuratoin
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.buildUserConfig = function (config, fields) {
  var global = {
    bool: 'OR',
    expand: false,
    fieldBool: 'OR'
  };

  this.reset();

  for (var entry in global) {
    if (config[entry]) {
      global[entry] = config[entry];
    }
  }

  if ('fields' in config) {
    for (var field in config['fields']) {
      if (fields.indexOf(field) > -1) {
        var field_config = config['fields'][field];
        var field_expand = global.expand;
        if (field_config.expand != undefined) {
          field_expand = field_config.expand;
        }

        this.config[field] = {
          boost: (field_config.boost || field_config.boost === 0) ? field_config.boost : 1,
          bool: field_config.bool || global.bool,
          fieldBool: global.fieldBool,
          expand: field_expand
        };
      } else {
        elasticlunr.utils.warn('field name in user configuration not found in index instance fields');
      }
    }
  } else {
    this.addAllFields2UserConfig(global, fields);
  }
};

/**
 * Add all fields to user search configuration.
 *
 * @param {String} bool Boolean model
 * @param {String} expand Expand model
 * @param {Array} fields fields of index instance
 */
elasticlunr.Configuration.prototype.addAllFields2UserConfig = function (global, fields) {
  fields.forEach(function (field) {
    this.config[field] = {
      boost: 1,
      bool: global.bool,
      expand: global.expand,
      fieldBool: global.fieldBool
    };
  }, this);
};

/**
 * get current user configuration
 */
elasticlunr.Configuration.prototype.get = function () {
  return this.config;
};

/**
 * reset user search configuration.
 */
elasticlunr.Configuration.prototype.reset = function () {
  this.config = {};
};
