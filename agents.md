Goal is to create an new graphical interface using ElectronJS that allows the user to do the following.

- Exit the application
- View decks, edit decks in accordance with banlist, filter cards to quickly find matches.
- play test hands
- replay saved replay game states
- play puzzels
- over LAN, connect to and duel AI
- Using the same control mechanisms as over LAN connect to dedicated servers and play games.

All code changes are to go in the port folder

Structure as a standard electron app.

Electron app provides a pass through server for the game to communicate to a server.

Electron app can also function as the server for lan games by using the code in `port/ocgcore`
