import { Router, type IRouter, type Request, type Response } from "express";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import { CloudinaryService } from "../lib/cloudinary";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();
const cloudinaryService = new CloudinaryService();

/**
 * POST /storage/uploads/request-url
 *
 * Request signed Cloudinary upload parameters.
 * The client sends JSON metadata (name, size, contentType) — NOT the file.
 * Then uploads the file directly to Cloudinary.
 */
router.post(
  "/storage/uploads/request-url",
  requireAdmin,
  async (req: Request, res: Response) => {
    const parsed = RequestUploadUrlBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Missing or invalid required fields" });
      return;
    }

    try {
      const { name, size, contentType } = parsed.data;

      const uploadInstructions =
        cloudinaryService.getUploadInstructions(contentType);

      res.json(
        RequestUploadUrlResponse.parse({
          ...uploadInstructions,
          metadata: { name, size, contentType },
        }),
      );
    } catch (error) {
      req.log.error({ err: error }, "Error generating upload URL");
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  },
);

export default router;
