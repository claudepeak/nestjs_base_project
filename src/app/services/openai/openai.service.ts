import {HttpException, Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {Configuration, OpenAIApi} from 'openai';
import {GeneratePromptDto} from './dto/generate-prompt.dto';

import * as process from "process";

@Injectable()
export class OpenaiService {
    constructor(private readonly prisma: PrismaService) {
    }

    /// Get response from openai
    async create(
        generatePromptDto: GeneratePromptDto,
        userId: string,
    ): Promise<any> {


        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new HttpException('Not found user', 404);
        }


        const INSTRUCTION = `Answer the question below as truthfully as you can, if you don't know the answer, say you don't know in a sarcastic way otherwise, just answer. Dont be use "Sincerely" or "Best regards" in this cover letter.`;
        const CONTEXT_INSTRUCTION = `This is an Upwork job posting. I kindly request you to prepare a cover letter that aligns with this job opportunity. Please refrain from using any personal information or details in the cover letter. Begin with a formal salutation.`;
        const DONT_BE_ADD = ``;

        const prompt = `${CONTEXT_INSTRUCTION}\n\n\n \n\n\n Job Description: "" \n\n\n My Information: "" \n\n\n ${DONT_BE_ADD} \n\n\n${INSTRUCTION}`;

        try {
            const configuration = new Configuration({
                apiKey: process.env.OPEN_API_KEY
            });
            const openai = new OpenAIApi(configuration);

            const completion = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt,
                max_tokens: 250,
                temperature: 0.2,
            });

            if (!completion) {
                throw new HttpException('Cannot create prompt', 400);
            }

            const normalText = completion.data.choices[0].text
                .replace(/(\r\n|\n|\r)/gm, '')
                .replace(/\[YOUR NAME\]/g, '');

            return {
                statusCompletion: completion.status == 200 ? true : false,
                prompt: normalText,
            };
        } catch (error) {
            throw new HttpException('Error creating prompt', 500);
        }
    }
}
