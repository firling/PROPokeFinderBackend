
const Compendium = require("../file/XY-Smogon-Compendium.json")
const Pokedex = require("../file/pokedex.json")
const PokeSet = require("../file/Poke-Set.json")
const LandSpawns = require("../file/land_spawns.json")
const SurfSpawns = require("../file/Surf_spawns.json")

const fs = require('fs')
const csv = require('csv-parser')

exports.getEvent = function (context) {
  return { message: "test" };
}

exports.getCompendium = function(context) {

  var data = []

  Object.keys(Compendium).forEach(function(elem) {
    data.push(elem)
  });

  return {
    message: "ok",
    data: data
  }
}

var getPreEvo = function(poke) {

  pok = poke.replace("-", "").replace(".", "").replace(" ", "")
  pokemon = [pok]

  if (Object.keys(Pokedex[pok.toLowerCase()]).includes("prevo")){
    pokemon.push(Pokedex[pok.toLowerCase()]["prevo"])
    pok = Pokedex[pok.toLowerCase()]["prevo"]
  }

  if (Object.keys(Pokedex[pok.toLowerCase()]).includes("prevo")){
    pokemon.push(Pokedex[pok.toLowerCase()]["prevo"])
  }

  pokemon.forEach(function(elem, index) {
    if (elem === "nidoranf" || elem === "nidoranF" || elem === "NidoranF" || elem === "Nidoranf") {
      pokemon[index] = "nidoran f"
    }
    if (elem === "nidoranm" || elem === "nidoranM" || elem === "NidoranM" || elem === "Nidoranm") {
      pokemon[index] = "nidoran m"
    }
    if (pokemon === "mimejr") {
      pokemon[index] = "mime jr."
    }
  })


  return pokemon
}

var getRarity = function(poke){

  pokemon = getPreEvo(poke)

  rarity = 10

  pokemon.forEach(function(element) {
    LandSpawns.forEach(function(elem) {
      if (elem["Pokemon"].toLowerCase() == element.toLowerCase()) {
        pokeRarity = parseInt(elem["Tier"], 10)
        if (rarity > pokeRarity) {
          rarity = pokeRarity
        }
      }
    })
    SurfSpawns.forEach(function(elem) {
      if (elem["Pokemon"].toLowerCase() == element.toLowerCase()) {
        pokeRarity = parseInt(elem["Tier"], 10)
        if (rarity > pokeRarity) {
          rarity = pokeRarity
        }
      }
    })
  })

  return rarity
}

exports.getPokeInDaList = function(context) {
  const type = context.params.query.type
  const role = context.params.query.role

  var poke = []
  var pokeType = []
  var pokeRarity = []
  var pokeID = []

  if (type === "All") {
    Compendium[role].forEach(function(elem) {
      poke.push(elem)
      pokeType.push(Pokedex[elem.replace("-", "").replace(" ", "").replace(".", "").toLowerCase()]["types"])
      pokeRarity.push(getRarity(elem))
      pokeID.push(Pokedex[elem.replace("-", "").replace(" ", "").replace(".", "").toLowerCase()]["num"])
    });
  }
  else {
    Compendium[role].forEach(function(elem) {
      if (Pokedex[elem.replace("-", "").replace(" ", "").replace(".", "").toLowerCase()]["types"].includes(type)) {
        poke.push(elem)
        pokeType.push(Pokedex[elem.replace("-", "").replace(" ", "").replace(".", "").toLowerCase()]["types"])
        pokeRarity.push(getRarity(elem))
        pokeID.push(Pokedex[elem.replace("-", "").replace(" ", "").replace(".", "").toLowerCase()]["num"])
      }
    });
  }

  var data = [poke, pokeType, pokeRarity, pokeID]

  return {
    message: "ok",
    data: data
  }

}

exports.getPokeInDaListWithName = function(context) {
  const name = context.params.query.pokename

  var poke = []
  var pokeType = []
  var pokeRarity = []
  var pokeID = []

  Object.values(Compendium).forEach(function(elem) {
    elem.forEach(function(element) {
      if (element.replace("-", "").replace(" ", "").replace(".", "").toLowerCase().includes(name.replace("-", "").replace(" ", "").replace(".", "").toLowerCase()) && !poke.includes(element)) {
        poke.push(element)
        pokeType.push(Pokedex[element.replace("-", "").replace(" ", "").replace(".", "").toLowerCase()]["types"])
        pokeRarity.push(getRarity(element))
        pokeID.push(Pokedex[element.replace("-", "").replace(" ", "").replace(".", "").toLowerCase()]["num"])
      }
    })
  });

  var data = [poke, pokeType, pokeRarity, pokeID]

  return {
    message: "ok",
    data: data
  }

}

exports.getPokeSet = function(context) {
  const pokeName = context.params.query.pokename

  return {
    message: "ok",
    data: PokeSet[pokeName]
  }

}

exports.getPokeSpawn = function(context) {

  const poke = context.params.query.pokename

  var pokeName = getPreEvo(poke)

  spawns = []

  pokeName.forEach(function(element) {
    LandSpawns.forEach(function(elem) {
      if (elem["Pokemon"].toLowerCase() == element.toLowerCase()) {
        elem["LandSurf"] = "1"
        elem["ID"] = Pokedex[elem["Pokemon"].replace("-", "").replace(" ", "").replace(".", "").toLowerCase()]["num"]
        spawns.push(elem)
      }
    })

    SurfSpawns.forEach(function(elem) {
      if (elem["Pokemon"].toLowerCase() == element.toLowerCase()) {
        elem["LandSurf"] = "0"
        elem["ID"] = Pokedex[elem["Pokemon"].replace("-", "").replace(" ", "").replace(".", "").toLowerCase()]["num"]
        spawns.push(elem)
      }
    })
  })

  return {
    message: "ok",
    data: spawns
  }

}
