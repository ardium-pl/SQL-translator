const messageFormat1 = {
  sqlStatement: "statement",
  isSelect: true,
};

const messageFormat2 = {
  message:
    "It seems that you want to perform a query other than SELECT, which I cannot execute.",
  sqlStatement: "",
};

const messageFormat3 = {
  message: "No rows found.",
  sqlStatement: "",
};

const messageFormat4 = {
  sqlStatement: "",
  rawData: [],
  formattedAnswer: "",
};

const messageFormat5 = {
  message: "An error occured while processing the request.",
};

const messageFormat6 = {
  message: "Failed to execute the SQL query.",
  sqlStatement: "",
};

const DB_SCHEMA_FORMAT = {
  tables: [
    {
      name: "customers",
      columns: [
        { name: "id", type: "INT", primary_key: true, auto_increment: true },
        { name: "name", type: "VARCHAR(255)" },
        {
          name: "email",
          type: "VARCHAR(255)",
          constraints: { unique: true, not_null: true },
        },
      ],
    },
    {
      name: "orders",
      columns: [
        { name: "order_id", type: "INT", primary_key: true },
        {
          name: "customer_id",
          type: "INT",
          foreign_key: { table: "customers", column: "id" },
        },
        { name: "order_date", type: "DATETIME", default: "CURRENT_TIMESTAMP" },
      ],
    },
  ],
};
