const Umzug = require("umzug");
const AWS = require("aws-sdk");

module.exports = class Migration {
  constructor(migrationTable) {
    this.migrationTable = migrationTable;
    this.close = this.init();
  }

  init() {
    this.dynamodb = new AWS.DynamoDB();

    this.umzug = new Umzug({
      storage: "umzug-dynamodb-storage",
      storageOptions: {
        dynamodb: this.dynamodb,
        table: this.migrationTable
      },
      migrations: {
        params: [this.dynamodb]
      },
      logging: function() {
        console.log.apply(null, arguments);
      }
    });

    return () => {
      // Nothing to clean up
    };
  }

  pending() {
    return this.umzug.pending();
  }

  up() {
    return this.umzug.up();
  }

  down() {
    return this.umzug.down();
  }
};
