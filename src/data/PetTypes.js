/*
 * valid list of pets
 * this should be synced with pet_list file from root dir
 * to have only one file I can see 2 options:
 *   * perform a get request to some api call that servers the
 *     file to the client and the list gets populated like this
 *   * read pet_list before sending welcome.html and pass the list
 *     using some template engine (not sure I can do this with react
 *     only)
 * */
const PetTypes = [
    "Bird",
    "Cat",
    "Chinchilla",
    "Dog",
    "Fish",
    "Guinea Pig",
    "Hamster",
    "Lizard",
    "Pig",
    "Rabbit",
    "Turtle"
];

export default PetTypes;
