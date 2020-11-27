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
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkIcon from "@material-ui/icons/Link";
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
          <Grid key={project?.sys?.id} item xs={4}>
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
                <GitHubIcon>
                  <a href={project.fields.github} target="__blank">
                    Github
                  </a>
                </GitHubIcon>
                <LinkIcon>
                  <a href={project.fields.live} target="__blank">
                    Live
                  </a>
                </LinkIcon>
              </CardActions>
              {/* </Link> */}
            </Card>
          </Grid>
        ))}
      </Grid>
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
    order:'fields.title'
  });
  return {
    props: {
      projects: projects.items,
      total: Math.ceil(allProjects.total / 5),
    },
    revalidate: 10,
  };
};
