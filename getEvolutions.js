//* fetching evolutions chains
console.log(pokemonsDetails)
const getEvolutionChains = async () => {
  const response = await fetch ("https://pokeapi.co/api/v2/evolution-chain?offset=0&limit=80")
  const result = await response.json()
  
  //another fetch for each chain to get the details and save in a const[]
  for (const chain of result.results) {
    const response = await fetch(chain.url)
    const chainDetails = await response.json()
    evolutionChains.push(
      {
        id: chainDetails.id,
        chain: chainDetails.chain
      }
    )
  }
  
  //let's simplify the chain to only the species's names
  for (const eChain of evolutionChains) {
    let specieToCheck = eChain.chain
    eChain.species = [specieToCheck.species.name]
    while (specieToCheck.evolves_to.length > 0) {
      specieToCheck = specieToCheck.evolves_to[0]
      eChain.species.push(specieToCheck.species.name)
      console.log(eChain)
    }
  }
  console.log(evolutionChains)
}
getEvolutionChains()

//! WORKS FINE. Creates an Array with the pokemon's names of each chain