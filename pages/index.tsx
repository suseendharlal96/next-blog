import React from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Card,
  CardActionArea,
  CardActions,
  Typography,
  CardContent,
  Grid,
  Button,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import useStyles from "../styles/styles";
import styles from "../styles/Home.module.scss";
import { client } from "../util/contentful";

export default function Home({ projects, total }) {
  const classes = useStyles();
  const router = useRouter();
  const handleChange = async (e, value) => {
    router.push(`/page/${value}`);
  };
  return (
    <div className={styles.container}>
      <Pagination
        count={total}
        page={1}
        showFirstButton
        showLastButton
        onChange={handleChange}
        style={{ marginBottom: "10px" }}
      />
      <Grid
        container
        direction="row"
        spacing={4}
        wrap="wrap"
        justify="center"
        alignItems="center"
      >
        {projects.map((project, index) => (
          <Grid key={project?.sys?.id} item xs={12} md={4} sm={6} lg={3}>
            <Card variant="outlined" className={classes.root}>
              {/* <Link href={`/project/${project.fields.title}`}> */}
              <CardActionArea>
                <Image
                  src={`https:${project.fields.image.fields.file.url}`}
                  alt={project.fields.title}
                  layout="responsive"
                  width={600}
                  height={600}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    <Link href={`/projects/${project.fields}`}>
                      <a>
                        {index + 1 + ". "}
                        {project.fields.title}
                      </a>
                    </Link>
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Link href={`/project/${project.sys.id}`}>
                  <Button variant="contained" color="primary">
                    <a>Details</a>
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={total}
        page={1}
        showFirstButton
        showLastButton
        onChange={handleChange}
        style={{ marginTop: "10px" }}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allProjects: any = await client.getEntries({
    content_type: "projects",
  });
  const projects: any = await client.getEntries({
    content_type: "projects",
    limit: 5,
    order: "fields.title",
  });
  return {
    props: {
      projects: projects.items,
      total: Math.ceil(allProjects.total / 5),
    },
    revalidate: 10,
  };
};
