import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const Weather = (): JSX.Element => {
  const [content, setContent] = useState<Array<string>>([]);

  useEffect(() => {
    setWeather();
  }, []);

  const setWeather = async () => {
    const response = await fetch(
      "https://api.weatherapi.com/v1/forecast.json?key=ea1f6ce0bc30430ca2981436220105&q=Israel&days=5&aqi=yes&alerts=no"
    );
    const jsonData = await response.json();
    console.log("log ", jsonData.forecast.forecastday);
    setContent(jsonData.forecast.forecastday);
    console.log("content", content);
  };

  return (
    <AppLayout title="Weather">
      <Grid container alignSelf="center">
        
        {content.map((index: any) => {
          return (
           
            <Grid textAlign="center" item key={index.date}>
              <Card sx={{ width: 1200, height: 500 }}>
                <CardHeader title={index.date} />
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <TableCell> <Typography variant="h6">hour</Typography></TableCell>
                        {index.hour.map((hour: any) => {
                          return <TableCell>{hour.time.slice(10)}</TableCell>;
                        })}
                      </TableRow>
                      <TableRow>
                      <TableCell> <Typography variant="h6">c°</Typography></TableCell>
                        {index.hour.map((hour: any) => {
                          return <TableCell>{hour.temp_c}</TableCell>;
                        })}
                      </TableRow>
                      <TableRow>
                      <TableCell> <Typography variant="h6">f°</Typography></TableCell>
                        {index.hour.map((hour: any) => {
                          return <TableCell>{hour.temp_f}</TableCell>;
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody></TableBody>
                  </Table>
                  <p></p>
                </TableContainer>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </AppLayout>
  );
};
export { Weather };
