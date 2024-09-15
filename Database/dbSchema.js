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

export const dbSchemaWithExamples = {
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
      exampleRows: [
        { id: 167, data_przyjecia: "2024-07-31 23:36:48", typ: 4 },
        { id: 499, data_przyjecia: "2024-07-15 17:54:38", typ: 2 },
        { id: 142, data_przyjecia: "2024-08-02 15:24:42", typ: 6 },
        { id: 474, data_przyjecia: "2024-07-16 21:21:25", typ: 4 },
        { id: 435, data_przyjecia: "2024-07-18 20:51:32", typ: 4 }
      ]
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
      exampleRows: [
        { id: 9, data: "2024-07-31 00:00:00", minuty_lekarz: 31, minuty_pielegniarka: 17 },
        { id: 16, data: "2024-07-24 00:00:00", minuty_lekarz: 56, minuty_pielegniarka: 15 },
        { id: 21, data: "2024-07-19 00:00:00", minuty_lekarz: 25, minuty_pielegniarka: 10 },
        { id: 20, data: "2024-07-20 00:00:00", minuty_lekarz: 16, minuty_pielegniarka: 11 },
        { id: 8, data: "2024-08-01 00:00:00", minuty_lekarz: 31, minuty_pielegniarka: 29 }
      ]
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
      exampleRows: [
        { id: 372, ostatnia_aktualizacja: "2024-07-24 11:00:00", ilosc_lekarzy: 10, ilosc_pielegniarek: 14, ilosc_lozek: 26, ilosc_lozek_obserwacji: 7 },
        { id: 140, ostatnia_aktualizacja: "2024-08-03 19:00:00", ilosc_lekarzy: 5, ilosc_pielegniarek: 8, ilosc_lozek: 28, ilosc_lozek_obserwacji: 3 },
        { id: 821, ostatnia_aktualizacja: "2024-06-04 10:00:00", ilosc_lekarzy: 7, ilosc_pielegniarek: 9, ilosc_lozek: 50, ilosc_lozek_obserwacji: 15 },
        { id: 804, ostatnia_aktualizacja: "2024-05-03 17:00:00", ilosc_lekarzy: 6, ilosc_pielegniarek: 6, ilosc_lozek: 50, ilosc_lozek_obserwacji: 15 },
        { id: 347, ostatnia_aktualizacja: "2024-07-25 10:00:00", ilosc_lekarzy: 7, ilosc_pielegniarek: 8, ilosc_lozek: 12, ilosc_lozek_obserwacji: 3 }
      ]
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
      exampleRows: [
        { id: 1, nazwa: "resuscytacja", czas_lekarza: 300, czas_pielegniarki: 500, czas_lozka: 2000, czas_lozka_obserwacji: 5000 },
        { id: 2, nazwa: "stanZagrozeniaZycia", czas_lekarza: 240, czas_pielegniarki: 450, czas_lozka: 1700, czas_lozka_obserwacji: 4500 },
        { id: 5, nazwa: "niepilny", czas_lekarza: 150, czas_pielegniarki: 290, czas_lozka: 500, czas_lozka_obserwacji: 2800 },
        { id: 3, nazwa: "pilnyPrzypadekOstry", czas_lekarza: 200, czas_pielegniarki: 390, czas_lozka: 1500, czas_lozka_obserwacji: 3800 },
        { id: 4, nazwa: "pilnyPrzypadekNieostry", czas_lekarza: 170, czas_pielegniarki: 360, czas_lozka: 1250, czas_lozka_obserwacji: 3500 }
      ]
    }
  ],
};
