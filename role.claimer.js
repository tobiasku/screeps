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

        if (creep.room.name != creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target)
            creep.moveTo(creep.pos.findClosestByRange(exit))
        }
        else {
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller)
            }
        }
    }
};