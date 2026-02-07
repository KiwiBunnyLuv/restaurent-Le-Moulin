/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3648354296")

  // update collection data
  unmarshal({
    "otp": {
      "length": 6
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3648354296")

  // update collection data
  unmarshal({
    "otp": {
      "length": 8
    }
  }, collection)

  return app.save(collection)
})
