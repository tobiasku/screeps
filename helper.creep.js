module.exports = {
    /** @param {Creep} creep **/
    creepTask: function(creep) {
        if (creep.memory.work && creep.carry.energy == 0) {
            creep.memory.work = false
        }
        if (!creep.memory.work && creep.carry.energy == creep.carryCapacity) {
            creep.memory.work = true
        }
    },

    /** @param {Creep} creep **/
    creepHarvest: function(creep) {
        //var source = Game.getObjectById(creep.memory.sourceId)
        var sources = creep.room.find(FIND_SOURCES, {
            filter: (source) => {
                return source.energy > 0
            }
        });
        var source = creep.pos.findClosestByPath(sources)

        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    },

    /** @param {Creep} creep **/
    creepGetEnergyFromStructure: function(creep) {
        var targets1 = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK) &&
                    structure.energy > creep.carryCapacity
            }
        });
        var targets2 = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store.energy > creep.carryCapacity
            }
        });
        var targets = targets1.concat(targets2)
        var target = target = creep.pos.findClosestByPath(targets)

        if (!target) {
            this.creepHarvest(creep)
            return
        }
    
        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target)
        }
    },

    /** @param {Creep} creep **/
    goToTargetRoom: function(creep) {
        if (creep.memory.home != undefined && creep.memory.target != undefined) {
            if (creep.room.name != creep.memory.target) {
                var exit = creep.room.findExitTo(creep.memory.target)
                creep.moveTo(creep.pos.findClosestByRange(exit))
                return true
            }
        }
        return false
            
    },

    /** @param {Creep} creep **/
    goToHomeRoom: function(creep) {
        if (creep.memory.home != undefined && creep.memory.target != undefined) {
            if (creep.room.name != creep.memory.home) {
                var exit = creep.room.findExitTo(creep.memory.home)
                creep.moveTo(creep.pos.findClosestByRange(exit))
                return true
            }
        }
        return false
    },

    /** @param {Creep} creep **/
    needHeal: function(creep) {
        if (creep.hits < creep.hitsMax) {
            if (creep.memory.home && creep.memory.target) {
                if (creep.room.name != creep.memory.home) {
                    var exit = creep.room.findExitTo(creep.memory.home)
                    creep.moveTo(creep.pos.findClosestByRange(exit))
                }
                else {
                    var towers = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy > 0
                        }
                    });
                    var tower = creep.pos.findClosestByPath(towers)
                    creep.moveTo(tower)
                }
            }
            return true
        }
        else {
            return false
        }
    },

    /** @param {Creep} creep **/
    getStructuresWithEnergy: function(creep) {
        var targets1 = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK) &&
                    structure.energy < structure.energyCapacity
            }
        });
        var targets2 = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store.energy < structure.storeCapacity
            }
        });
        return targets1.concat(targets2)
    },
};