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