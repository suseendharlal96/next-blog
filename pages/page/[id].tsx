import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
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
import useStyles from "../../styles/styles";
import styles from "../../styles/Home.module.scss";
import { client } from "../../util/contentful";

export default function Home({ projects, total, page }) {
  const router = useRouter();
  const classes = useStyles();

  const handleChange = async (e, value) => {
    if (value === 1) {
      router.push("/");
    } else {
      router.push(`/page/${value}`);
    }
  };

  if (router.isFallback) {
    return (
      <Grid
        container
        direction="row"
        spacing={4}
        wrap="wrap"
        justify="center"
        alignItems="center"
      >
        <p>Loading..</p>;
      </Grid>
    );
  }

  return (
    <div className={styles.container}>
      <Pagination
        count={total}
        page={+page}
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
                  height={200}
                  width={600}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {(+router.query.id - 1) * 5 + index + 1 + ". "}{" "}
                    {project.fields.title}
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const allProjects: any = await client.getEntries({
    content_type: "projects",
  });
  const projects: any = await client.getEntries({
    limit: 5,
    skip: (+params.id - 1) * 5,
    content_type: "projects",
    order: "fields.title",
  });
  return {
    props: {
      projects: projects.items,
      total: Math.ceil(allProjects.total / 5),
      page: params.id,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "2" } }, { params: { id: "3" } }],
    fallback: true,
  };
};
