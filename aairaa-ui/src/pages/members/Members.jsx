import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Stack, Typography } from '@mui/material'
import React from 'react'

export default function Members() {

  const coreTeam = [{
    name:"Mr. Raghul Senthilkumar, M.Tech, (Ph.D)",
    pfp:"https://lh4.googleusercontent.com/C6Uvpx3icCuA6_NmjX5Z4GzygjCF4e6NwWcX_bmQmVisgbBrt8tM_lkc5xbyoKCP-LhwN490lRKmaOP9Qi2ODqhbS9f-0iOXLrn_6NgWLan-fsDBwqCgMebfnsfggAHCBQ=w1280",
    email:"s_rahul@cb.students.amrita.edu "
  },
  {
    name:"Ms. Avadhani Bindu, M.Tech, (Ph.D)",
    pfp:"https://lh4.googleusercontent.com/GPXlPAS0IrKmjP5Roenc-0vjbqFFGhaPlVNNTizI9h9-n-OEVrNypSZxqkp2CUCtP5UKkYUL7kknHzyAY6QhroaA8IAz3qxaeo3f1y3TzHqvSG0EWe7Fryx5MyrXoDkAwg=w1280",
    email:"b_avadhani@cb.students.amrita.edu"
  }
]

  return (
    <Box>
      <Typography variant="h3" sx={{color:"white", pl:2, textDecoration:"underline"}}>Members</Typography>

      <Box sx={{textAlign:"center"}}>
        <Typography variant="h4" sx={{color:"white"}}>Core team</Typography>

        <Stack direction="row" gap={2} sx={{display:"flex",justifyContent:"center"}}>

          {coreTeam.map(item => { 
            return (<Card sx={{ maxWidth: 330 }} key={item.name}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={item.pfp}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div" sx={{color:"black"}}>
                            {item.name}
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            Amrita School of Computing, Amrita Vishwa  Vidyapeetham Coimbatore
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Typography variant="p" sx={{color:"black"}}><b>Email:</b> {item.email}</Typography>
                      </CardActions>
                    </Card>)
          })}

        </Stack>

      </Box>
      <Box sx={{textAlign:"center"}}>
        <Typography variant="h4" sx={{color:"white"}}>Student team</Typography>

      </Box>
    </Box>
  )
}
