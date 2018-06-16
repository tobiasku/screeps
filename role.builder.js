var helperCreep = require('helper.creep')
var roleUpgrader = require('role.upgrader')

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
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
            if (target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            }
            else {
                roleUpgrader.run(creep)
            }
        }
    }
};