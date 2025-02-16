class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // Build the query
        const queryObj = { ...this.queryString }; // Copy the query object (destructuring)
        // Exclude fields from the query
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // Remove the excluded fields from the query object
        excludedFields.forEach(el => delete queryObj[el]);
        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        // Replace the operators with the MongoDB operators ($gte, $gt, $lte, $lt)
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            // Sort the documents by the given fields
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // Default sorting, sort by creation date in descending order
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            // Select the fields to return
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            // Exclude the __v field by default
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1; // Convert the string to a number, default page is 1
        const limit = this.queryString.limit * 1 || 100; // Convert the string to a number, default limit is 100
        const skip = (page - 1) * limit; // Number of documents to skip
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;