import { SyntheticEvent, useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission } from "../graphql/schema";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
  Grid,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Toolbar,
  Container,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  Add as AddIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  SettingsOutlined,
} from "@mui/icons-material";
import { DateTimePicker, DateTimePickerProps, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { ListMenu } from "../components/ListMenu";

type SortField = "Title" | "Date";

interface MissionsResponse {
  data: {
    Missions: Mission[];
  };
}

const getMissions = async (
  sortField: SortField,
  sortDesc?: Boolean
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
    query ($sortField: MissionSortFields!, $sortDesc: Boolean){
    Missions(
      sort: {
        field: $sortField,
        desc: $sortDesc
      }
    ) {
      id
      title
      operator
      launch {
        date
      }
    }
  }
  `,
    { sortField: sortField, sortDesc: sortDesc }
  );
};
const deleteMissions = async (
  id:String
):Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
    mutation ($id:ID!){
      deleteMission(id:$id){ 
          id
          title
          operator
          launch {
            date
          }
        }  
      }
      `,
    { id: id }
  );
};
const addMission = async (
  title: String,
  operator: String,
  date:Date ,
  vehicle:String,
  locationName:String,
  locationLongitude:Number,
  locationLatitude:Number,
  orbidPeriapsis:Number,
  orbidApoapsis:Number,
  orbitInclination:Number,
  payloadCapacity:Number,
  payloadAvailablity:Number

): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
    mutation create(
      $title: String!,
      $operator: String!,
      $date:DateTime! ,
      $vehicle:String!,
      $locationName:String!,
      $locationLongitude:Float!,
      $locationLatitude:Float!,
      $orbidPeriapsis:Int!,
      $orbidApoapsis:Int!,
      $orbitInclination:Int!,
      $payloadCapacity:Int!,
      $payloadAvailablity:Int!){
      createMission(mission: {
        title: $title, 
        operator: $operator,
        launch: {date: $date,vehicle: $vehicle,location: {name: $locationName,longitude: $locationLongitude,latitude: $locationLatitude}},
        orbit:{periapsis:$orbidPeriapsis,apoapsis:$orbidApoapsis,inclination:$orbitInclination},
        payload:{capacity:$payloadCapacity,available:$payloadAvailablity}
      }){
        id
        title
        operator
        launch {
          date
        }
      }
  }
  `,
    { title: title, operator: operator,date:date,vehicle:vehicle,locationName:locationName,locationLongitude:locationLongitude,locationLatitude,
      orbidPeriapsis:orbidPeriapsis,orbidApoapsis:orbidApoapsis,orbitInclination:orbitInclination,
      payloadCapacity:payloadCapacity,payloadAvailablity:payloadAvailablity}
  );
  
};


const Missions = (): JSX.Element => {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [newMissionOpen, setNewMissionOpen] = useState(false);
  const [tempLaunchDate, setTempLaunchDate] = useState<Date>(new Date());
  const [date, setDate] = useState<Date | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("Title");
  const [errMessage, setErrMessage] = useState<String | null>(null);
  const [title, setTitle] = useState<String>("");
  const [operator, setOperator] = useState<String>("");
  const [vehicle, setVehicle] = useState<String>("");
  const [locationName, setLocationName] = useState<String>("");
  const [locationLongitude, setLocationLongitude] = useState<Number>(0);
  const [locationLatitude, setLocationLatitude] = useState<Number>(0); 
  const [orbidPeriapsis, setOrbidPeriapsis] = useState<Number>(0);
  const [orbidApoapsis, setOrbidApoapsis] = useState<Number>(0);
  const [orbitInclination, setOrbitInclination] = useState<Number>(0);
  const [payloadCapacity, setPayloadCapacity] = useState<Number>(0);
  const [payloadAvailablity, setPayloadAvailablity] = useState<Number>(0);



  const newMission = async () => {
   await addMission(title, operator,tempLaunchDate,vehicle,locationName,locationLongitude ,locationLatitude,orbidPeriapsis,orbidApoapsis,orbitInclination,payloadCapacity,payloadAvailablity);
   setNewMissionOpen(false);
    try {
      setMissions((await getMissions(sortField,sortDesc)).data.Missions);
    } catch (error) {
      setErrMessage("Failed to load missions.");
        console.log(error);
    }
  };
  // const deleteMissions = async (id:String) => {
  //   await deleteMission(id);
  //    try {
  //      setMissions((await getMissions(sortField,sortDesc)).data.Missions);
  //    } catch (error) {
  //      setErrMessage("Failed to load missions.");
  //        console.log(error);
  //    }
  //  };
    
  const handleErrClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrMessage(null);
  };

  const handleNewMissionOpen = () => {
    setTempLaunchDate(new Date());
    setNewMissionOpen(true);
  };

  const handleNewMissionClose = () => {
    setNewMissionOpen(false);
  };

  const handleTempLaunchDateChange = (newValue: Date) => {
    setTempLaunchDate(newValue);
  };

  const handleSortFieldChange = (event: SyntheticEvent, value: SortField) => {
    setSortField(value);
  };
  const handleSortDescClick = () => {
    setSortDesc(!sortDesc);
  };

  useEffect(() => {
    getMissions(sortField, sortDesc)
      .then((result: MissionsResponse) => {
        setMissions(result.data.Missions);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions.");
        console.log(err);
      });
  }, [sortField, sortDesc]);



  return (
    <AppLayout title="Missions">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Solar Rocket Missions
        </Typography>

        <Toolbar disableGutters>
          <Grid justifyContent="flex-end" container>
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <ListMenu
              options={["Date", "Title", "Operator"]}
              endIcon={<SortIcon />}
              onSelectionChange={handleSortFieldChange}
            />

            <IconButton onClick={handleSortDescClick}>
              {sortDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Toolbar>

        {missions ? (
          <Grid container spacing={2}>
            {" "}
            {missions.map((missions: Mission, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={missions.title}
                    subheader={new Date(missions.launch.date).toDateString()}
                  />
                  <CardContent>
                    <Typography noWrap>{missions.operator}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button>Edit</Button>
                    <Button onClick={(e)=> deleteMissions(missions.id)}>Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        <Tooltip title="New Mission">
          <Fab
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            color="primary"
            aria-label="add"
            onClick={handleNewMissionOpen}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <Dialog
          open={newMissionOpen}
          onClose={handleNewMissionClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>New Mission</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  id="name"
                  label="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  label="Operator"
                  onChange={(e) => setOperator(e.target.value)}
                  variant="standard"
                  fullWidth
                />
              </Grid>

              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    minDate={new Date()}
                    minTime={new Date()}
                    label="Launch Date"
                    value={tempLaunchDate}
                    onChange={(e) => handleTempLaunchDateChange}
                    renderInput={(params) => (
                      <TextField variant="standard" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  label="vehicle"
                  onChange={(e) => setVehicle(e.target.value)}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  label="LocationName"
                  onChange={(e) => setLocationName(e.target.value)}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  type="number"
                  label="LocationLongitude"
                  onChange={(e) => setLocationLongitude(parseInt(e.target.value) )}
                  variant="standard"
                  fullWidth
                />
              </Grid><Grid item>
                
                <TextField
                  autoFocus
                  id="desc"
                  type="number"
                  label="LocationLatitude"
                  onChange={(e) => setLocationLatitude(parseInt(e.target.value))}
                  variant="standard"
                  fullWidth
                />
              </Grid><Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  type="number"
                  label="OrbidPeriapsis"
                  onChange={(e) => setOrbidPeriapsis(parseInt(e.target.value))}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  type="number"
                  label="OrbidApoapsis"
                  onChange={(e) => setOrbidApoapsis(parseInt(e.target.value))}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  type="number"
                  label="OrbitInclination"
                  onChange={(e) => setOrbitInclination(parseInt(e.target.value))}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  type="number"
                  label="PayloadCapacity"
                  onChange={(e) => setPayloadCapacity(parseInt(e.target.value))}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="desc"
                  type="number"
                  label="vehiPayloadAvailablitycle"
                  onChange={(e) => setPayloadAvailablity(parseInt(e.target.value))}
                  variant="standard"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewMissionClose}>Cancel</Button>
            <Button onClick={newMission}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Snackbar
        open={errMessage != null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrClose}
      >
        <Alert onClose={handleErrClose} variant="filled" severity="error">
          {errMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export { Missions };
