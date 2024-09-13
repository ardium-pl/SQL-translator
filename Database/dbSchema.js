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

export const dbSchema = {
  tables: [
    {
      name: "pacjenci",
      columns: [
        {
          name: "id",
          type: "int unsigned",
          primary_key: true,
          auto_increment: true,
        },
        {
          name: "data_przyjecia",
          type: "datetime",
          default: "CURRENT_TIMESTAMP",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "typ",
          type: "int unsigned",
          constraints: {
            not_null: true,
          },
          foreign_key: {
            table: "typy_pacjenta",
            column: "id",
          },
        },
      ],
    },
    {
      name: "stan_kolejki",
      columns: [
        {
          name: "id",
          type: "int unsigned",
          primary_key: true,
          auto_increment: true,
        },
        {
          name: "data",
          type: "datetime",
          constraints: {
            not_null: true,
            unique: true,
          },
        },
        {
          name: "minuty_lekarz",
          type: "int",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "minuty_pielegniarka",
          type: "int",
          constraints: {
            not_null: true,
          },
        },
      ],
    },
    {
      name: "stan_zasobow",
      columns: [
        {
          name: "id",
          type: "int unsigned",
          primary_key: true,
          auto_increment: true,
        },
        {
          name: "ilosc_lekarzy",
          type: "int unsigned",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "ilosc_lozek",
          type: "int unsigned",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "ilosc_lozek_obserwacji",
          type: "int unsigned",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "ilosc_pielegniarek",
          type: "int unsigned",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "ostatnia_aktualizacja",
          type: "datetime",
          constraints: {
            not_null: true,
            unique: true,
          },
        },
      ],
    },
    {
      name: "typy_pacjenta",
      columns: [
        {
          name: "id",
          type: "int unsigned",
          primary_key: true,
          auto_increment: true,
        },
        {
          name: "nazwa",
          type: "varchar(48)",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "czas_lekarza",
          type: "double",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "czas_pielegniarki",
          type: "double",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "czas_lozka",
          type: "double",
          constraints: {
            not_null: true,
          },
        },
        {
          name: "czas_lozka_obserwacji",
          type: "double",
          constraints: {
            not_null: true,
          },
        },
      ],
    },
  ],
};
