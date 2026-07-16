import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email obrigatório")
  .max(254, "Email muito longo")
  .email("Email inválido");

export const passwordSchema = z
  .string()
  .min(8, "Mínimo de 8 caracteres")
  .max(72, "Máximo de 72 caracteres");

export const nameSchema = z.string().trim().min(1, "Nome obrigatório").max(100);
export const phoneSchema = z
  .string()
  .trim()
  .max(30)
  .regex(/^[+()\d\s-]*$/, "Telefone inválido")
  .optional()
  .or(z.literal(""));

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().trim().min(1, "Assunto obrigatório").max(150),
  message: z.string().trim().min(10, "Mensagem muito curta").max(2000, "Máximo de 2000 caracteres"),
  // Honeypot: bots preenchem, humanos não veem
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const otpNonceSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Código deve ter 6 dígitos");