/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3808439220")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select3723325296",
    "maxSelect": 1,
    "name": "Jours",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche"
    ]
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1272681097",
    "max": 0,
    "min": 0,
    "name": "Heures",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3808439220")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select3723325296",
    "maxSelect": 1,
    "name": "Day",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche"
    ]
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1272681097",
    "max": 0,
    "min": 0,
    "name": "Hours",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
