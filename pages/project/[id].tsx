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
  Container,
  Button,
  Chip,
} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkIcon from "@material-ui/icons/Link";
import useStyles from "../../styles/styles";
import styles from "../../styles/Home.module.scss";
import { client } from "../../util/contentful";

export default function Home({ project }) {
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
        <p>Loading..</p>
      </Grid>
    );
  }

  return (
    <div className={styles.container}>
      <Container>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Card variant="outlined" className={classes.root}>
          <CardActionArea>
            <Image
              src={`https:${project.fields.image.fields.file.url}`}
              alt={project.fields.title}
              layout="responsive"
              height={200}
              width={600}
            />
            <CardContent>
              <Typography gutterBottom variant="h2" component="h2">
                {project.fields.title}
              </Typography>
              <Typography
                variant="h5"
                color="primary"
                dangerouslySetInnerHTML={{ __html: project.fields.desc }}
                component="p"
              />
              <Typography variant="subtitle1" color="textPrimary">
                Technologies used
              </Typography>
              {project.fields.tag.stack.map((tech, index) => (
                <Chip label={tech} key={index} color="secondary" />
              ))}
            </CardContent>
          </CardActionArea>
          <CardActions>
            <GitHubIcon />
            <a href={project.fields.github} target="__blank">
              Github
            </a>
            <LinkIcon />
            <a href={project.fields.live} target="__blank">
              Live
            </a>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project: any = await client.getEntry(params.id.toString());
  return {
    props: {
      project,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects: any = await client.getEntries({
    content_type: "projects",
    order: "fields.title",
  });
  let fewProjects = [] as any;
  projects.items.forEach((project) => {
    fewProjects.push(project);
  });
  // pre build only for first 5 projects
  fewProjects = fewProjects.slice(0, 4);
  const paths = fewProjects.map((project) => ({
    params: { id: project.sys.id },
  }));
  return {
    paths,
    fallback: true,
  };
};
