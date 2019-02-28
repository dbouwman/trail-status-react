

export const groupOutput = {
  "areas": [
    {
      "group": "ROSS NATURAL AREA",
      "entries": [
        {
          "name": "WEST SPRING CREEK TRAIL",
          "area": "ROSS NATURAL AREA",
          "status": "Open",
          "manager": "COF Parks"
        }
      ]
    },
    {
      "group": "PINERIDGE NATURAL AREA",
      "entries": [
        {
          "name": "VIEWPOINT SPUR",
          "area": "PINERIDGE NATURAL AREA",
          "status": "Open",
          "manager": "COF Natural Areas"
        },
        {
          "name": "SOUTH LOOP TRAIL",
          "area": "PINERIDGE NATURAL AREA",
          "status": "Open",
          "manager": "COF Natural Areas"
        },
        {
          "name": "RIDGE TRAIL",
          "area": "PINERIDGE NATURAL AREA",
          "status": "Open",
          "manager": "COF Natural Areas"
        },
        {
          "name": "TIMBER TRAIL",
          "area": "PINERIDGE NATURAL AREA",
          "status": "Open",
          "manager": "COF Natural Areas"
        },
        {
          "name": "NEIGHBORHOOD ACCESS TRAIL",
          "area": "PINERIDGE NATURAL AREA",
          "status": "Open",
          "manager": "COF Natural Areas"
        },
        {
          "name": "RESERVOIR LOOP TRAIL",
          "area": "PINERIDGE NATURAL AREA",
          "status": "Open",
          "manager": "COF Natural Areas"
        },
        {
          "name": "VALLEY TRAIL",
          "area": "PINERIDGE NATURAL AREA",
          "status": "Open",
          "manager": "COF Natural Areas"
        }
      ]
    },
}


export const groupInput = [
    {
      "name": "WEST SPRING CREEK TRAIL",
      "area": "ROSS NATURAL AREA",
      "status": "Open",
      "manager": "COF Parks"
    },
    {
      "name": "WEST POUDRE TRAIL",
      "area": "NONE",
      "status": "Open",
      "manager": "COF Parks"
    },
    {
      "name": "FOSSIL CREEK TRAIL",
      "area": "NONE",
      "status": "Open",
      "manager": "COF Parks"
    },
]

export const merged = [
  {
    "attributes": {
      "FNAME": "WEST SPRING CREEK TRAIL",
      "STATUS": "Open",
      "NATNAME": "ROSS NATURAL AREA",
      "MANAGER": "COF Parks",
      "EDIT_BY": "TRNS",
      "EDIT_DATE": 1482969661000
    }
  },
  {
    "attributes": {
      "FNAME": "WEST POUDRE TRAIL",
      "STATUS": "Open",
      "NATNAME": "NONE",
      "MANAGER": "COF Parks",
      "EDIT_BY": "TRNS",
      "EDIT_DATE": 1482969656000
    }
  },
  {
    "attributes": {
      "FNAME": "WEST POUDRE TRAIL",
      "STATUS": "Open",
      "NATNAME": "NONE",
      "MANAGER": "COF Parks",
      "EDIT_BY": "TRNS",
      "EDIT_DATE": 1482969656000
    }
  }
]

export const flat = [
  {
    "FNAME": "WEST SPRING CREEK TRAIL",
    "STATUS": "Open",
    "NATNAME": "ROSS NATURAL AREA",
    "MANAGER": "COF Parks",
    "EDIT_BY": "TRNS",
    "EDIT_DATE": 1482969661000
  },
  {
    "FNAME": "WEST POUDRE TRAIL",
    "STATUS": "Open",
    "NATNAME": "NONE",
    "MANAGER": "COF Parks",
    "EDIT_BY": "TRNS",
    "EDIT_DATE": 1482969656000
  },
  {
    "FNAME": "WEST POUDRE TRAIL",
    "STATUS": "Open",
    "NATNAME": "NONE",
    "MANAGER": "COF Parks",
    "EDIT_BY": "TRNS",
    "EDIT_DATE": 1482969656000
  }
]

export const remapped =

[
  {
    "name": "WEST SPRING CREEK TRAIL",
    "area": "ROSS NATURAL AREA",
    "status": "Open",
    "manager": "COF Parks"
  },
  {
    "name": "WEST SPRING CREEK TRAIL",
    "area": "ROSS NATURAL AREA",
    "status": "Open",
    "manager": "COF Parks"
  },
  {
    "name": "WILLOW TRAIL",
    "area": "KINGFISHER POINT NATURAL AREA",
    "status": "Warning",
    "manager": "COF Natural Areas"
  }
]

export const deduped =

[
  {
    "name": "WEST SPRING CREEK TRAIL",
    "area": "ROSS NATURAL AREA",
    "status": "Open",
    "manager": "COF Parks"
  },
  {
    "name": "WILLOW TRAIL",
    "area": "KINGFISHER POINT NATURAL AREA",
    "status": "Warning",
    "manager": "COF Natural Areas"
  }
]
