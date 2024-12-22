import Sequelize, { Model } from 'sequelize'

class Products extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            price: Sequelize.INTEGER,
            offer: Sequelize.BOOLEAN,
            path: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL,
                get() {
                    return `http://localhost:3001/products-file/${this.path}`
                }
            }
        }, {
            sequelize,
        })

        return this;
    }

    static associate(models){
        this.belongsTo(models.Category,{
            foreignKey: 'category_id',
            as: 'category',
        });
        return this;
    }
}


export default Products