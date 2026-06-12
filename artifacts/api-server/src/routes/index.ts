import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import storageRouter from "./storage";
import projectsRouter from "./projects";
import galleryRouter from "./gallery";
import teamRouter from "./team";
import servicesRouter from "./services";
import socialLinksRouter from "./social-links";
import companyRouter from "./company";
import contactRouter from "./contact";
import statsRouter from "./stats";
import testimonialsRouter from "./testimonials";
import processStepsRouter from "./process-steps";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(storageRouter);
router.use(projectsRouter);
router.use(galleryRouter);
router.use(teamRouter);
router.use(servicesRouter);
router.use(socialLinksRouter);
router.use(companyRouter);
router.use(contactRouter);
router.use(statsRouter);
router.use(testimonialsRouter);
router.use(processStepsRouter);

export default router;
