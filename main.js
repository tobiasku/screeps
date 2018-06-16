var helperRoom = require('helper.room')

module.exports.loop = function () {
    var roomName = Game.spawns['Spawn1'].room.name
    for (let name in Game.spawns) {
        var spawn = Game.spawns[name]
        helperRoom.respawnCreeps(spawn)
    }
    helperRoom.work()
    helperRoom.transferEnergy()
    helperRoom.defendRoom(roomName)
}