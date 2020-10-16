import {
  Entity,
  EntityRepository,
  Repository,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { IsInt, IsISO8601, IsNotEmpty, IsOptional } from "class-validator"

@Entity()
export default class Thing {
  @IsOptional()
  @IsInt()
  @PrimaryGeneratedColumn()
  id?: number

  @IsNotEmpty()
  @Column()
  color?: string

  @IsOptional()
  @IsISO8601()
  @CreateDateColumn()
  createdAt?: Date

  @IsOptional()
  @IsISO8601()
  @UpdateDateColumn()
  updatedAt?: Date

  // Allow assigning from a partial set of properties.
  constructor(props: Partial<Thing>) {
    Object.assign(this, props)
  }

  // Show the given list of instances as JSON-compatible objects.
  static show(list: Thing[]) {
    return list.map((elem) => elem.show())
  }

  // Show the given instance as a JSON-compatible object.
  show() {
    const { id, color, createdAt, updatedAt } = this
    return {
      id,
      color,
      createdAt: createdAt?.toISOString(),
      updatedAt: updatedAt?.toISOString(),
    }
  }
}

@EntityRepository(Thing)
export class ThingRepository extends Repository<Thing> {
  findByColor(color: string) {
    return this.createQueryBuilder("thing")
      .where("thing.firstName = :color", { color })
      .getMany()
  }
}
