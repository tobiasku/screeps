var helperCreep = require('helper.creep')

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        helperCreep.creepTask(creep)
        if (helperCreep.needHeal(creep)) {
            return
        }
        if (helperCreep.goToTargetRoom(creep)) {
            return
        }

        if (!creep.memory.work) {
            helperCreep.creepGetEnergyFromStructure(creep)
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller)
            }
        }
    }
};