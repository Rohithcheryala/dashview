import json
from django.shortcuts import render
import numpy as np
import pandas as pd

# Create your views here.
from django.http import HttpResponse, JsonResponse
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PowerTransformer
from sklearn.feature_selection import SelectFromModel
from django.views.decorators.csrf import csrf_exempt
from imblearn.over_sampling import SMOTE
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer


file = "/home/rohith/code/dashview/frontend/public/data.csv"
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def get_metadata(request, id):
    df = pd.read_csv(file)
    desc = df.describe()

    df2 = df.fillna("NaN")
    desc2 = desc.fillna("Nan")

    output = []
    def python_type(t):
        if t == 'float64':
            return "float"
        elif t == 'int64':
            return "int"
        return "string"
    for col in df.columns:
        d = {
            "name": col,
            "data_type": python_type(df[col].dtype),
            "null_count": int(df[col].isnull().sum()),
        }

        if d['data_type'] in ["int","float"]:
            d.update({
                "std": desc2.get(col, {}).get("std"),
                "mean": desc2.get(col, {}).get("mean"),
                "min": desc2.get(col, {}).get("min"),
                "50%": desc2.get(col, {}).get("50%"),
                "max": desc2.get(col, {}).get("max"),
            })

        else:
             d.update({
                "std": "puka",
                "mean": "puka",
                "min": "puka",
                "50%": "puka",
                "max": "puka",
            })

        output.append(d)


    return JsonResponse({
        "columns": output
    })

def get_dashboard_info(request, id):
    # df = pd.read_csv(file)

    # import io
    # buffer = io.StringIO()
    # df.info(buf=buffer)
    # lines = buffer.getvalue().splitlines()
    # df = (pd.DataFrame([x.split() for x in lines[5:-2]], columns=lines[3].split())
    #     .drop('Count',axis=1)
    #     .drop('#',axis=1)
    #     .rename(columns={'Non-Null':'Non-Null Count'}))

    # headers = df.columns.values.tolist()
    # rows = df.loc[:, :].values.tolist()
    
    # return JsonResponse({
    #     "headers": headers,
    #     "rows": rows
    # })
    import pandas as pd

    # Load the CSV file
    df = pd.read_csv(file)

    # 1. Total Number of Records
    total_records = len(df)

    # 2. Column Names and Data Types
    column_info = list(map(str, df.dtypes))

    # 3. Missing Values Summary
    missing_values_total = int(df.isnull().sum().sum())
    missing_values_per_column = list(map(int,df.isnull().sum()))

    # 4. Data Distribution Summary (for numerical columns)
    # numeric_summary = df.describe().to

    # 5. Unique Values Count
    unique_values_count = df.nunique().tolist()

    # 6. Top Values
    top_values = {column: df[column].value_counts().head(5).tolist() for column in df.columns}

    # 7. Data Preview
    # data_preview = df.head().to_li
    df.fillna("NaN", inplace=True)
    headers = df.columns.values.tolist()
    rows = df.head().loc[:, :].values.tolist()

    # resp = {
    #     "headers": headers,
    #     "rows": rows
    # }

    # print(resp)
    # return JsonResponse(resp)

    print(missing_values_total)
    return JsonResponse({
        "total_records":total_records,
        "column_info":column_info,
        "missing_values_total":missing_values_total,
        "missing_values_per_column":missing_values_per_column,
        # # "numeric_summary":numeric_summary,
        "unique_values_count":unique_values_count,
        "data_preview": {
            "columns":headers, 
            "data":rows
        },
    })

def dashboard(request, id):

    # offset = request.GET.get("offset", None)
    # size = request.GET.get("size", None)
    # read data.csv
    with open(file) as f:
        headers = f.readline().split(",")
        rows = list(map(lambda l: l.split(',') ,f.readlines()))


    resp = {
        "headers": headers,
        "rows": rows
    }

    return JsonResponse(resp)

def edit():
    pass

@csrf_exempt
def preprocess_dataset(request, id):
    if request.method == 'POST':
        # Load the dataset
        # file = request.FILES['file']
        file = "/home/rohith/code/dashview/frontend/public/data.csv"
        df = pd.read_csv(file)
        # User inputs for preprocessing
        preprocessing_options = json.loads(request.POST['preprocessing_options'])
        print(preprocessing_options)


        for ob in preprocessing_options:
            col_name = ob['col_name']
            if ob['rename'] != "":
                print("renaming")
                df.rename(columns = {col_name: ob['rename']}, inplace = True)
            if ob["fill_nan"] != "":
                df[col_name] = df[col_name].fillna(ob["fill_nan"])
        
        df.to_csv('preprocessed_dataset.csv', index=False)
        return JsonResponse({'message': 'Dataset preprocessed successfully!'})
        # Apply preprocessing steps based on user inputs
        for option in preprocessing_options:
            if option == 'handle_missing_values':
                # Handle missing values
                if preprocessing_options[option] == 'mean':
                    imputer = SimpleImputer(strategy='mean')
                elif preprocessing_options[option] == 'median':
                    imputer = SimpleImputer(strategy='median')
                elif preprocessing_options[option] == 'remove_rows':
                    threshold = preprocessing_options['missing_values_threshold']
                    df.dropna(axis=0, thresh=threshold, inplace=True)
                elif preprocessing_options[option] == 'remove_columns':
                    threshold = preprocessing_options['missing_values_threshold']
                    df.dropna(axis=1, thresh=threshold, inplace=True)
                elif preprocessing_options[option] == 'knn_imputer':
                    imputer = KNNImputer()
                elif preprocessing_options[option] == 'iterative_imputer':
                    from sklearn.experimental import enable_iterative_imputer
                    from sklearn.impute import IterativeImputer
                    imputer = IterativeImputer()
                df = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)
            elif option == 'feature_scaling':
                # Feature scaling
                if preprocessing_options[option] == 'normalize':
                    scaler = StandardScaler()
                elif preprocessing_options[option] == 'standardize':
                    scaler = StandardScaler()
                df[df.select_dtypes(include='number').columns] = scaler.fit_transform(df.select_dtypes(include='number'))
            elif option == 'encoding_categorical_variables':
                # Encoding categorical variables
                if preprocessing_options[option]:
                    categorical_cols = preprocessing_options[option]['categorical_columns']
                    encoder = OneHotEncoder(sparse=False, drop='first')
                    encoded_cols = pd.DataFrame(encoder.fit_transform(df[categorical_cols]), columns=encoder.get_feature_names(categorical_cols))
                    df = pd.concat([df.drop(columns=categorical_cols), encoded_cols], axis=1)
            elif option == 'feature_engineering':
                # Feature engineering (example: creating polynomial features)
                if preprocessing_options[option]:
                    # Create new features from existing ones
                    # Example: Polynomial features
                    from sklearn.preprocessing import PolynomialFeatures
                    poly = PolynomialFeatures(degree=2)
                    features_poly = poly.fit_transform(df)
                    df = pd.DataFrame(features_poly, columns=poly.get_feature_names(df.columns))
            elif option == 'handling_outliers':
                # Handling outliers (example: clipping outliers)
                if preprocessing_options[option]:
                    # Clip outliers to a certain range
                    from scipy.stats import zscore
                    z_scores = zscore(df)
                    abs_z_scores = np.abs(z_scores)
                    filtered_entries = (abs_z_scores < 3).all(axis=1)
                    df = df[filtered_entries]
            elif option == 'dimensionality_reduction':
                # Dimensionality reduction
                if preprocessing_options[option] == 'pca':
                    pca = PCA(n_components=10)
                    df = pd.DataFrame(pca.fit_transform(df), columns=[f'PC{i}' for i in range(1, 11)])
            elif option == 'handling_skewed_data':
                # Handling skewed data
                if preprocessing_options[option] == 'log':
                    df = np.log1p(df)
                elif preprocessing_options[option] == 'boxcox':
                    from scipy.stats import boxcox
                    for column in df.columns:
                        df[column] = boxcox(df[column]+1)[0]
            elif option == 'feature_selection':
                # Feature selection
                if preprocessing_options[option] == 'select_k_best':
                    selector = SelectKBest(score_func=f_classif, k=10)
                    X_selected = selector.fit_transform(df, target_variable)
                    df = pd.DataFrame(X_selected, columns=df.columns[selector.get_support()])
                elif preprocessing_options[option] == 'select_from_model':
                    from sklearn.ensemble import RandomForestClassifier
                    selector = SelectFromModel(RandomForestClassifier())
                    X_selected = selector.fit_transform(df, target_variable)
                    df = pd.DataFrame(X_selected, columns=df.columns[selector.get_support()])
            elif option == 'data_sampling':
                if preprocessing_options[option] == 'smote':
                    smote = SMOTE()
                    X_resampled, y_resampled = smote.fit_resample(df, target_variable)
                    df = pd.concat([X_resampled, pd.DataFrame(y_resampled, columns=[target_variable])], axis=1)

            # Add other preprocessing steps similarly
            
        # Save the preprocessed dataset
        df.to_csv('preprocessed_dataset.csv', index=False)

        return JsonResponse({'message': 'Dataset preprocessed successfully!'})
    else:
        return JsonResponse({'error': 'POST request required.'})