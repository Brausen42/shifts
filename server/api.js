const API_PATH = "/api/v1";
const OVERLAPPING_SHIFT = "Overlapping Shift";

const shifts = {
    shift: null,
    left: null,
    right: null,
};

function listShifts() {
    const shift_list= [];
    function getShiftsInNode(node) {
        if (node.left) {
            getShiftsInNode(node.left);
        }
        shift_list.push(node.shift);
        if (node.right) {
            getShiftsInNode(node.right);
        }
    }

    if (shifts.left) {
        getShiftsInNode(shifts.left);
    }
    if (shifts.shift) {
        shift_list.push(shifts.shift);
    }
    if (shifts.right) {
        getShiftsInNode(shifts.right);
    }
    return shift_list;
}

function addShift(newShift) {
    if (isValidShift(newShift)) {
        function addShiftToNode(node, newShift) {
            if(newShift.start_time < node.shift.start_time) {
                if(newShift.end_time > node.shift.start_time) {
                    throw new Error(OVERLAPPING_SHIFT);
                }

                if(node.left) {
                    addShiftToNode(node.left, newShift);
                } else {
                    node.left = {
                        shift: newShift,
                        left: null,
                        right: null
                    }
                }
            } else if(newShift.start_time > node.shift.end_time) {
                if (node.right) {
                    addShiftToNode(node.right, newShift);
                } else {
                    node.right = {
                        shift: newShift,
                        left: null,
                        right: null
                    }
                }
            } else {
                throw new Error(OVERLAPPING_SHIFT);
            }
        }

        if (shifts.shift) {
            addShiftToNode(shifts, newShift);
        } else {
            shifts.shift = newShift;
        }
    } else {
        throw new Error("Invalid shift");
    }
}

function isValidShift(shift) {
    return shift.id && shift.start_time && shift.end_time && (shift.start_time < shift.end_time);
}

module.exports = {
    setupApiServer: function(express_app) {
        express_app.get(`${API_PATH}/shifts`, function(_req, res) {
            res.json({shifts: listShifts()});
        })

        express_app.post(`${API_PATH}/shifts`, function(req, res) {
            try {
                addShift(req.body);
            } catch (error) {
                res.status(400).json({error: error.toString()})
                return;
            }
            
            res.status(201).json({});
        })
    }
}