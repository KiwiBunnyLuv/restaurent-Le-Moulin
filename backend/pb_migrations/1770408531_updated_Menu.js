/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4198167069")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select3414971543",
    "maxSelect": 1,
    "name": "Categorie",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Déjeuner",
      "Diner/souper",
      "Boisson",
      "Livraison"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4198167069")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select3414971543",
    "maxSelect": 1,
    "name": "Categorie",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Déjeuner",
      "Diner/souper",
      "Boisson"
    ]
  }))

  return app.save(collection)
})
