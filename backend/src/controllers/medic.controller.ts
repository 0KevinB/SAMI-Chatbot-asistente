import { Request, Response } from "express";
import { MedicoService } from "@/services/medic.service";

export class MedicoController {
  static async getAllMedicos(req: Request, res: Response) {
    try {
      const medicos = await MedicoService.getAllMedicos();
      res.status(200).json(medicos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMedicoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const medico = await MedicoService.getMedicoById(id);
      res.status(200).json(medico);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async createMedico(req: Request, res: Response) {
    try {
      const medicoData = req.body;
      const newMedico = await MedicoService.createMedico(medicoData);
      res.status(201).json(newMedico);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateMedico(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const medicoData = req.body;
      const updatedMedico = await MedicoService.updateMedico(id, medicoData);
      res.status(200).json(updatedMedico);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteMedico(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await MedicoService.deleteMedico(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
