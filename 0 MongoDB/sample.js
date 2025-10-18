//  how many top 2  favaroite fruit 

[
    {
      $group: {
        _id: "$favorite_Fruit",
              count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    },
    {
      $limit: 2
    }
  ]

// ---------------------------------------------
// find average age of all users?  
  [
    {
      $group: {
        _id: null,
        agerageAge: {
          $avg: "$age"
        }
      }
    }
  ]


// ---------------------------------------------
//  List the top 5 most common favorite fruits among users


[
  {
    $group: {
      _id: "$favorite_Fruit",
      count: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      count: -1
    }
  },
  {
    $limit: 5
  }
]
//---------------------------------------------
// total sum of how many gender 

[
  {
    $group: {
      _id: "$gender",
      count: {
      	$sum: 1,
      }
  	}
  }
]
//---------------------------------------------

// Which country has the highest number of  registered users

[
  {
    $group: {
      _id: "$company.location.country",
      companyCountyCount: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      companyCountyCount: -1
    }
  },
  {
    $limit: 5
  }
]

//---------------------------------------------
// List all unique eye colors present in the collection.
[
  {
    $group: {
      _id: "$eyeColor",
    }
  }
]

//---------------------------------------------
// What is the average number of tags per user? 
[
  {
    $unwind: {
      path: "$tags",
   
    }
  },
  {
    $group: {
      _id: "_id",
      numberOfTages: {
        $sum: 1
      }

    }
  },
  {
    $group: {
      _id:  null,
      averageNumberOfTages: {
        $avg: "$numberOfTages"
      }
    }
  }
]


//                    or 


[
  {
    $addFields: {
      numberOfTages: {
        $size: {
          $ifNull: ["$tags", []]
        }
      } 
    }
  },
{
  $group: {
    _id: null,
    averageNumberOfTages: {
      $avg: "$numberOfTages"
    }
  }
}
]


//---------------------------------------------
// How many users have "enim" as one of their tags?
[
  {
    $match: {
      tags: "enim"
    }
  },
  {
    $count: 'userWithEnimTag'
  }
]

//Whai are the names and age if users who are inactive and have "velit" as a tag? 
[
  {
    $match: {
      isActive: false,
      tags: "velit",
    },
  },
  {
    $project: {
      name: 1,
      age: 1
    }
  }
]

// How many users hava a phone number starting with '+1 (940)'?
[
  {
    $match: {
      "company.phone": /^\+1 \(940\)/
    }
  },
  {
    $count: "userWithSpacialPhoneNumber"
  }
]

// Who has registered the most recently? 
[
  {
    $sort: {
      registerd: -1
    }
  },
  {
    $limit: 4
  },
  {
    $project: {
      name: 1,
      registered:1,
      favorite_Fruit: 1
    }
  }
]
//Categorize users by their favorite fruit. 

