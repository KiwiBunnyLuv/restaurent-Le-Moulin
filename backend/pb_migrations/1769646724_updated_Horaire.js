/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3808439220")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select3723325296",
    "maxSelect": 1,
    "name": "Jour",
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

  return app.save(collection)
}, (app) => {
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

  return app.save(collection)
})
