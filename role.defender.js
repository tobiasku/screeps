var helperCreep = require('helper.creep')

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (helperCreep.needHeal(creep)) {
            return
        }
        if (helperCreep.goToTargetRoom(creep)) {
            return
        }
        
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS)
        var hostile = creep.pos.findClosestByPath(hostiles)
        if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile)
        }
    }
};